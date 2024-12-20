from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session
from app import models
from app.db.database import get_db
from api.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy import func, desc
from typing import List

# Create an APIRouter instance for comment-related routes
reaction_router = APIRouter()

@reaction_router.get("/comment/{comment_id}", status_code=status.HTTP_200_OK)
def get_reaction(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Check if the comment exists
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found."
        )

    # Check if the user has reacted to this comment
    reaction = (
        db.query(models.LikeDislike)
        .filter(
            models.LikeDislike.comment_id == comment_id,
            models.LikeDislike.user_id == current_user.id
        )
        .first()
    )

    if reaction:
        return {
            "reaction": "like" if reaction.value == 1 else "dislike"
        }
    else:
        return {
            "reaction": "none"
        }

@reaction_router.post("/comment/{comment_id}", status_code=status.HTTP_200_OK)
def add_reaction(
    comment_id: int,
    value: int = Query(..., description="1 for like, -1 for dislike", ge=-1, le=1),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Validate the comment exists
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found."
        )

    # Check if the user has already reacted to this comment
    existing_reaction = (
        db.query(models.LikeDislike)
        .filter(
            models.LikeDislike.comment_id == comment_id,
            models.LikeDislike.user_id == current_user.id
        )
        .first()
    )

    if existing_reaction:
        # Update the existing reaction if it is different
        if existing_reaction.value != value:
            existing_reaction.value = value
            db.commit()
            db.refresh(existing_reaction)
        else:
            # If the reaction is the same, raise an error
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already reacted with the same value."
            )
    else:
        # Create a new reaction
        new_reaction = models.LikeDislike(
            value=value,
            user_id=current_user.id,
            comment_id=comment_id
        )
        db.add(new_reaction)
        db.commit()
        db.refresh(new_reaction)

    # Calculate the total likes and dislikes
    likes_count = (
        db.query(func.count())
        .filter(models.LikeDislike.comment_id == comment_id, models.LikeDislike.value == 1)
        .scalar()
    )
    dislikes_count = (
        db.query(func.count())
        .filter(models.LikeDislike.comment_id == comment_id, models.LikeDislike.value == -1)
        .scalar()
    )

    return {
        "message": "Reaction updated successfully.",
        "likes_count": likes_count,
        "dislikes_count": dislikes_count,
    }

@reaction_router.delete("/comment/{comment_id}", status_code=status.HTTP_200_OK)
def remove_reaction(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Check if the comment exists
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found."
        )

    # Check if the user has reacted to this comment
    existing_reaction = (
        db.query(models.LikeDislike)
        .filter(
            models.LikeDislike.comment_id == comment_id,
            models.LikeDislike.user_id == current_user.id
        )
        .first()
    )

    if existing_reaction:
        # Delete the existing reaction
        db.delete(existing_reaction)
        db.commit()

        # Calculate the total likes and dislikes after removal
        likes_count = (
            db.query(func.count())
            .filter(models.LikeDislike.comment_id == comment_id, models.LikeDislike.value == 1)
            .scalar()
        )
        dislikes_count = (
            db.query(func.count())
            .filter(models.LikeDislike.comment_id == comment_id, models.LikeDislike.value == -1)
            .scalar()
        )

        return {
            "message": "Reaction removed successfully.",
            "likes_count": likes_count,
            "dislikes_count": dislikes_count,
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No reaction found to remove."
        )
