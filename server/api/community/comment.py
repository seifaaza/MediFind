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

    # Return the created comment
    return {"message": "Comment created successfully"}

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

# Get comments endpoint
@comment_router.get("/{post_id}", response_model=PaginatedComments)
def get_comments(
    post_id: int,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=100),
    order_by: str = Query("latest", regex="^(latest|most_liked)$"),
):
    # Validate the post exists
    post_exists = db.query(func.count(models.Post.id)).filter(models.Post.id == post_id).scalar()
    if not post_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    # Base query to retrieve comments
    query = (
        db.query(
            models.Comment.id,
            models.Comment.content,
            models.Comment.created_at,
            func.count(func.nullif(models.LikeDislike.value, -1)).label("likes_count"),
            func.count(func.nullif(models.LikeDislike.value, 1)).label("dislikes_count"),
            models.User.id.label("user_id"),
            models.User.username.label("username"),
        )
        .join(models.User, models.Comment.user_id == models.User.id)
        .outerjoin(models.LikeDislike, models.LikeDislike.comment_id == models.Comment.id)
        .filter(models.Comment.post_id == post_id)
        .group_by(
            models.Comment.id,
            models.User.id,
            models.User.username,
            models.Comment.content,
            models.Comment.created_at,
        )
    )

    # Check if any likes exist when order_by is 'most_liked'
    if order_by == "most_liked":
        likes_exist = db.query(func.count(models.LikeDislike.id)).filter(
            models.LikeDislike.comment_id == models.Comment.id
        ).scalar()
        if likes_exist == 0:
            order_by = "latest"  # Fallback to latest if no likes exist

    # Apply ordering
    if order_by == "most_liked":
        query = query.order_by(desc("likes_count"))
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

    # Build metadata
    meta = Meta(
        total_items=total_items,
        skip=skip,
        limit=limit,
        ordered_by=order_by,
    )

    return PaginatedComments(meta=meta, data=serialized_comments)
