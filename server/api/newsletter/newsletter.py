from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app import models
from app.db.database import get_db
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from app.utils.email.email_service import send_subscription_email

# Define the router
newsletter_router = APIRouter()

# Request schema for newsletter subscription
class NewsletterSubscribeRequest(BaseModel):
    email: str = Field(..., example="user@example.com")

# Endpoint to subscribe to the newsletter (Unauthenticated)
@newsletter_router.post("/subscribe", status_code=status.HTTP_201_CREATED)
def subscribe_to_newsletter(request: NewsletterSubscribeRequest, db: Session = Depends(get_db)):
    existing_subscription = db.query(models.Newsletter).filter(models.Newsletter.email == request.email).first()
    if existing_subscription:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already subscribed to the newsletter."
        )
    
    new_subscription = models.Newsletter(email=request.email, subscribed_at=datetime.now(timezone.utc))
    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)
    send_subscription_email(request.email)

    return {"message": "Successfully subscribed to the newsletter."}


# Endpoint to unsubscribe from the newsletter (Unauthenticated)
@newsletter_router.delete("/unsubscribe", status_code=status.HTTP_200_OK)
def unsubscribe_from_newsletter(email: str = Query(..., example="user@example.com"), db: Session = Depends(get_db)):
    existing_subscription = db.query(models.Newsletter).filter(models.Newsletter.email == email).first()
    if not existing_subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email is not subscribed to the newsletter."
        )
    
    db.delete(existing_subscription)
    db.commit()
    
    return {"message": "Successfully unsubscribed from the newsletter."}

