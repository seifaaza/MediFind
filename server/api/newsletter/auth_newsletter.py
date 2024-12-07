from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models
from app.db.database import get_db
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from api.auth import get_current_user
from app.utils.email.email_service import send_subscription_email

# Define the router
auth_newsletter_router = APIRouter()

# Request schema for newsletter subscription
class NewsletterSubscribeRequest(BaseModel):
    email: str = Field(..., example="user@example.com")

# Endpoint to subscribe for authenticated users
@auth_newsletter_router.post("/subscribe", status_code=status.HTTP_201_CREATED)
def authenticated_subscribe_to_newsletter(
    request: NewsletterSubscribeRequest,  # Request model to accept email input
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)  # Fetch authenticated user
):
    # Check if the email is already subscribed by any user (email uniqueness)
    existing_email_subscription = db.query(models.Newsletter).filter(models.Newsletter.email == request.email).first()
    if existing_email_subscription:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email is already subscribed to the newsletter."
        )

    # Check if the user is already subscribed to the newsletter
    existing_subscription = db.query(models.Newsletter).filter(models.Newsletter.user_id == current_user.id).first()
    if existing_subscription:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already subscribed to the newsletter."
        )

    # Create a new subscription with the email provided by the user
    new_subscription = models.Newsletter(
        email=request.email,  # Use the email from the request
        subscribed_at=datetime.now(timezone.utc),
        user_id=current_user.id
    )
    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)
    send_subscription_email(request.email)

    return {"message": "Successfully subscribed to the newsletter."}

# Endpoint to unsubscribe for authenticated users
@auth_newsletter_router.delete("/unsubscribe", status_code=status.HTTP_200_OK)
def authenticated_unsubscribe_from_newsletter(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)  # Fetch authenticated user
):
    subscription = db.query(models.Newsletter).filter(models.Newsletter.user_id == current_user.id).first()
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User is not subscribed to the newsletter."
        )
    
    db.delete(subscription)
    db.commit()
    
    return {"message": "Successfully unsubscribed from the newsletter."}

# Endpoint to check if the user is subscribed to the newsletter
@auth_newsletter_router.get("/status", status_code=status.HTTP_200_OK)
def check_subscription_status(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)  # Fetch authenticated user
):
    # Check if the user is subscribed to the newsletter
    subscription = db.query(models.Newsletter).filter(models.Newsletter.user_id == current_user.id).first()
    
    # If the user is subscribed, return subscription details; otherwise, return false
    if subscription:
        return {
            "is_subscribed": True,  # Set to True if the user is subscribed
            "email": subscription.email,
            "subscribed_at": subscription.subscribed_at.isoformat()  # Convert datetime to ISO format
        }
    else:
        return {
            "is_subscribed": False
        }
