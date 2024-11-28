from fastapi import FastAPI
from app.db.database import engine
from app.models import Base
from dotenv import load_dotenv
import logging
from app.db.init_db import init_db
from fastapi.middleware.cors import CORSMiddleware
from api.auth import auth_router
from api.profile import profile_router
from api.newsletter.newsletter import newsletter_router
from api.newsletter.auth_newsletter import auth_newsletter_router

# Load environment variables from .env file
load_dotenv()

# Set up logging for the FastAPI application
logging.basicConfig(level=logging.INFO)

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  # Allow all headers

)

# Create database tables if they don't exist (creates on startup)
Base.metadata.create_all(bind=engine)

# Insert initial data on startup
@app.on_event("startup")
async def startup_event():
    init_db()  # Ensures the data is inserted
    logging.info("FastAPI server is starting...")
    logging.info(f"Server is running on http://localhost:8000")

# Routes
app.include_router(auth_router, prefix="/auth")
app.include_router(profile_router, prefix="/profile")
app.include_router(newsletter_router, prefix="/newsletter")
app.include_router(auth_newsletter_router, prefix="/auth/newsletter")

@app.get("/routes")
def show_routes():
    routes = [f"{route.path} - {route.methods}" for route in app.routes]
    return {"routes": routes}

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}
