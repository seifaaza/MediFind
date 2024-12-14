from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session
from app import models
from app.db.database import get_db
from api.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy import func, desc, asc
from typing import List
from app.utils.email.email_service import send_notification_email


# Create an APIRouter instance for comment-related routes
comment_router = APIRouter()

# Request model for creating a comment
class CommentCreate(BaseModel):
    content: str

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

    # Calculate the likes and dislikes counts
    likes_count = db.query(models.LikeDislike).filter(models.LikeDislike.comment_id == new_comment.id, models.LikeDislike.value == 1).count()
    dislikes_count = db.query(models.LikeDislike).filter(models.LikeDislike.comment_id == new_comment.id, models.LikeDislike.value == -1).count()

    # Get the current user's username
    username = current_user.username

    # Send an email notification to the post owner, but not if they are commenting on their own post
    if current_user.id != post.user_id:
        # Construct the full post URL
        send_notification_email(post.user.email, post_id)

    # Return the created comment in the specified format
    return {
        "id": new_comment.id,
        "content": new_comment.content,
        "created_at": new_comment.created_at.isoformat(),
        "likes_count": likes_count,
        "dislikes_count": dislikes_count,
        "user_id": new_comment.user_id,
        "username": username,
    }


@comment_router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Find the comment by ID
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found.",
        )

    # Ensure the current user is the owner of the comment
    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this comment.",
        )

    # Delete the comment
    db.delete(comment)
    db.commit()

    return {"message": "Comment deleted successfully"}

# Metadata model for pagination
class Meta(BaseModel):
    total_items: int
    skip: int
    limit: int
    ordered_by: str

# Comment response model
class CommentResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    likes_count: int
    dislikes_count: int
    user_id: int
    username: str

# Paginated response model
class PaginatedComments(BaseModel):
    meta: Meta
    data: List[CommentResponse]

@comment_router.get("/{post_id}", response_model=PaginatedComments)
def get_comments(
    post_id: int,
    skip: int = 0,
    limit: int = 10,
    order_by: str = "most_liked",  # default sorting order
    db: Session = Depends(get_db)
):
    # Base query to retrieve comments
    query = (
        db.query(
            models.Comment.id,
            models.Comment.content,
            models.Comment.created_at,
            func.count(func.nullif(models.LikeDislike.value, -1)).label("likes_count"),  # Count of likes
            func.count(func.nullif(models.LikeDislike.value, 1)).label("dislikes_count"),  # Count of dislikes
            models.User.id.label("user_id"),  # User ID
            models.User.username.label("username"),  # Username
        )
        .join(models.User, models.Comment.user_id == models.User.id)  # Join User model
        .outerjoin(models.LikeDislike, models.LikeDislike.comment_id == models.Comment.id)  # Join LikeDislike model
        .filter(models.Comment.post_id == post_id)  # Filter by post_id
        .group_by(
            models.Comment.id,
            models.User.id,
            models.User.username,
            models.Comment.content,
            models.Comment.created_at,
        )
    )

    # Apply ordering based on likes - dislikes score
    if order_by == "most_liked":
        query = query.order_by(
            desc(
                func.count(func.nullif(models.LikeDislike.value, -1))  # likes count
                - func.count(func.nullif(models.LikeDislike.value, 1))  # dislikes count
            ),  # Sort by likes - dislikes score
            desc(func.count(func.nullif(models.LikeDislike.value, -1))),  # Secondary: by likes
            asc(func.count(func.nullif(models.LikeDislike.value, 1))),  # Tertiary: by fewer dislikes
            desc(models.Comment.created_at),  # Finally: by creation date
        )
    else:  # Default: order by latest
        query = query.order_by(desc(models.Comment.created_at))

    # Count total comments
    total_items = query.count()

    # Apply pagination
    comments = query.offset(skip).limit(limit).all()

    # Serialize response
    serialized_comments = [
        CommentResponse(
            id=comment.id,
            content=comment.content,
            created_at=comment.created_at,
            likes_count=comment.likes_count or 0,
            dislikes_count=comment.dislikes_count or 0,
            user_id=comment.user_id,
            username=comment.username,
        )
        for comment in comments
    ]

    # Build metadata for pagination
    meta = Meta(
        total_items=total_items,
        skip=skip,
        limit=limit,
        ordered_by=order_by,
    )

    return PaginatedComments(meta=meta, data=serialized_comments)
