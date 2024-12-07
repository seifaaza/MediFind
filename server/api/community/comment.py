from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.db.database import get_db
from api.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime

# Create an APIRouter instance for comment-related routes
comment_router = APIRouter()

# Request model for creating a comment
class CommentCreate(BaseModel):
    content: str

# Response model for a created comment
class CommentResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    post_id: int
    author_username: str


@comment_router.post("/{post_id}", status_code=status.HTTP_201_CREATED)
def create_comment(
    post_id: int,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Check if the post exists
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post with ID {post_id} not found.",
        )

    # Create the comment object
    new_comment = models.Comment(
        content=comment_data.content,
        created_at=datetime.utcnow(),
        post_id=post_id,
        user_id=current_user.id,  # `current_user` provides the logged-in user's ID
    )

    # Add the comment to the database
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    # Return the created comment
    return {"message": "Comment created successfully"}
