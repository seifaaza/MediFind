from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app import models
from app.db.database import get_db
from pydantic import BaseModel, Field, ValidationError, EmailStr
from app.utils.token import create_access_token, decode_access_token
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from fastapi.responses import RedirectResponse
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os
import requests
from datetime import timedelta
from fastapi.responses import JSONResponse

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI") 
CLIENT_URL = os.getenv("CLIENT_URL") 

auth_router = APIRouter()

# Route to initiate Google login
@auth_router.get("/google/login", response_class=RedirectResponse)
def google_login():
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        "response_type=code"
        f"&client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        "&scope=openid%20email%20profile"
    )
    return google_auth_url

# Route to handle Google OAuth2 callback
@auth_router.get("/google/callback")
def google_callback(code: str, db: Session = Depends(get_db)):
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    token_response = requests.post(token_url, data=token_data)
    if token_response.status_code != 200:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to fetch Google OAuth token")

    token_info = token_response.json()
    id_token_str = token_info.get("id_token")
    if not id_token_str:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID token missing in response from Google")

    try:
        id_info = id_token.verify_oauth2_token(id_token_str, google_requests.Request(), GOOGLE_CLIENT_ID)
        google_email = id_info.get("email")
        given_name = id_info.get("given_name")
        family_name = id_info.get("family_name")

        if not google_email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Google email missing in ID token")

        username = f"{given_name} {family_name}" if given_name and family_name else google_email.split('@')[0]
        user = db.query(models.User).filter(models.User.username == username).first()
        if not user:
            user = models.User(username=username, hashed_password=None)
            db.add(user)
            db.commit()
            db.refresh(user)

        access_token = create_access_token(data={"username": user.username, "id": user.id}, expires_delta=timedelta(days=90))

        response = JSONResponse(content={"message": "Success"})

        response.headers["Authorization"] = f"Bearer {access_token}"
        return response

    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Google ID token")

# Set up password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme to read the access token from the request header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Define Pydantic model for register request body
class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=8)

# Define Pydantic model for login request body
class LoginRequest(BaseModel):
    username: str
    password: str

# Verify password using bcrypt hash
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Hash password using bcrypt
def get_password_hash(password):
    return pwd_context.hash(password)

# Register a new user with email, username, and password
def register_user(db: Session, username: str, email: str, password: str):
    existing_user_by_username = db.query(models.User).filter(models.User.username == username).first()
    if existing_user_by_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    
    existing_user_by_email = db.query(models.User).filter(models.User.email == email).first()
    if existing_user_by_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hashed_password = get_password_hash(password)
    user = models.User(username=username, email=email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# Authenticate user
def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is missing",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    try:
        token_data = decode_access_token(token)
    except HTTPException:
        raise credentials_exception  # Invalid or expired token

    user = db.query(models.User).filter(models.User.id == token_data["id"]).first()
    if user is None:
        raise credentials_exception

    return user

# Register route with enhanced error handling
@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    try:
        user = register_user(db, request.username, request.email, request.password)
        access_token = create_access_token(data={"username": user.username, "id": user.id})

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "token": access_token,
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during registration"
        )

# Login route with enhanced error handling
@auth_router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, request.username, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username or password is incorrect"
        )
    try:
        access_token = create_access_token(data={"username": user.username, "id": user.id})
        
        # Check if the user has a profile associated with them
        has_profile = db.query(models.Profile).filter(models.Profile.user_id == user.id).first() is not None
        
        return {
            "id": user.id,
            "username": user.username,
            "token": access_token,
            "has_profile": has_profile  # Include hasProfile in the response
        }

    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Validation error: {e.errors()}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during login"
        )
