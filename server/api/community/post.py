from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session
from app import models
from app.db.database import get_db
from api.auth import get_current_user
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from sqlalchemy import func

# Create an APIRouter instance for post-related routes
post_router = APIRouter()

# Schema for creating a post
class PostCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Title of the post")
    content: str = Field(..., min_length=1, description="Content of the post")
    category_id: int = Field(..., description="ID of the category for the post")

    class Config:
        orm_mode = True

# Schema for metadata and response
class Meta(BaseModel):
    total_items: int
    category: Optional[int]
    skip: int
    limit: int

# Endpoint to create a new post
@post_router.post("/", status_code=status.HTTP_201_CREATED)
def create_post(
    post_data: PostCreateRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Validate the category exists
    category = db.query(models.Category).filter(models.Category.id == post_data.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category ID"
        )

    # Create the new post
    new_post = models.Post(
        title=post_data.title.strip(),
        content=post_data.content.strip(),
        user_id=current_user.id,
        category_id=post_data.category_id
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    # Return success message
    return {"message": "Post created successfully"}

class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    category: str
    author_id: int
    author_username: str
    num_comments: int 

class PaginatedResponse(BaseModel):
    meta: Meta
    data: List[PostResponse]

# Endpoint to get posts by category or all posts if no category is provided
@post_router.get("/", response_model=PaginatedResponse)
def get_posts(
    db: Session = Depends(get_db),
    category: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=100),
):
    # Check if the category exists (if provided)
    if category is not None:
        category_exists = db.query(models.Category).filter(models.Category.id == category).first()
        if not category_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with ID {category} not found",
            )

    # Build the query
    query = (
        db.query(
            models.Post.id,
            models.Post.title,
            models.Post.content,
            models.Post.created_at,
            models.Category.name.label("category"),
            models.User.id.label("author_id"),
            models.User.username.label("author_username"),
            func.count(models.Comment.id).label("num_comments"),  # Count comments
        )
        .join(models.Category, models.Post.category_id == models.Category.id)
        .join(models.User, models.Post.user_id == models.User.id)
        .outerjoin(models.Comment, models.Comment.post_id == models.Post.id)  # Outer join to count comments
        .group_by(
            models.Post.id,
            models.Post.title,
            models.Post.content,
            models.Post.created_at,
            models.Category.name,
            models.User.id,
            models.User.username,
        )  # Group by all selected columns
        .order_by(models.Post.created_at.desc())  # Sort by the latest created posts
    )

    # Filter by category if provided
    if category is not None:
        query = query.filter(models.Post.category_id == category)

    # Count total items for metadata
    total_items = query.count()

    # Apply pagination
    posts = query.offset(skip).limit(limit).all()

    # Serialize posts into the response format
    serialized_posts = [
        PostResponse(
            id=post.id,
            title=post.title,
            content=post.content,
            created_at=post.created_at,
            category=post.category,
            author_id=post.author_id,
            author_username=post.author_username,
            num_comments=post.num_comments,  # Include the number of comments
        )
        for post in posts
    ]

    # Construct the response
    return PaginatedResponse(
        meta=Meta(
            total_items=total_items,
            category=category,
            skip=skip,
            limit=limit,
        ),
        data=serialized_posts,
    )

class CommentResponse(BaseModel):
    content: str
    created_at: datetime
    author_username: str

class PostWithCommentsResponse(PostResponse):
    comments: List[CommentResponse]

@post_router.get("/{post_id}", response_model=PostWithCommentsResponse)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
):
    # Query to fetch the post details
    post = (
        db.query(
            models.Post.id,
            models.Post.title,
            models.Post.content,
            models.Post.created_at,
            models.Category.name.label("category"),
            models.User.id.label("author_id"),
            models.User.username.label("author_username"),
            func.count(models.Comment.id).label("num_comments"),  # Count comments
        )
        .join(models.Category, models.Post.category_id == models.Category.id)
        .join(models.User, models.Post.user_id == models.User.id)
        .outerjoin(models.Comment, models.Comment.post_id == models.Post.id)  # Outer join for comments
        .filter(models.Post.id == post_id)
        .group_by(
            models.Post.id,
            models.Post.title,
            models.Post.content,
            models.Post.created_at,
            models.Category.name,
            models.User.id,
            models.User.username,
        )  # Group by all selected columns
        .first()
    )

    # Raise a 404 error if the post is not found
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post with ID {post_id} not found"
        )

    # Query to fetch the comments for the post
    comments = (
        db.query(
            models.Comment.content,
            models.Comment.created_at,
            models.User.username.label("author_username"),
        )
        .join(models.User, models.Comment.user_id == models.User.id)
        .filter(models.Comment.post_id == post_id)
        .order_by(models.Comment.created_at.asc())  # Order comments by creation time
        .all()
    )

    # Serialize comments into the response format
    serialized_comments = [
        CommentResponse(
            content=comment.content,
            created_at=comment.created_at,
            author_username=comment.author_username,
        )
        for comment in comments
    ]

    # Serialize and return the post details with comments
    return PostWithCommentsResponse(
        id=post.id,
        title=post.title,
        content=post.content,
        created_at=post.created_at,
        category=post.category,
        author_id=post.author_id,
        author_username=post.author_username,
        num_comments=post.num_comments,
        comments=serialized_comments,  # Include serialized comments
    )

# Endpoint to delete a post
@post_router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Find the post by ID
    post = db.query(models.Post).filter(models.Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check if the current user is the owner of the post
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this post"
        )

    # Delete the post
    db.delete(post)
    db.commit()
