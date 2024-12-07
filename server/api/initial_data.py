from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.db.database import get_db
from pydantic import BaseModel
from typing import List

# Create an APIRouter instance for post-related routes
initial_data_router = APIRouter()


# Schema for the category response
class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

# Endpoint to retrieve all categories
@initial_data_router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Category).all()
    if not categories:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="data not found"
        )
    return categories


# Schema for the category response
class HealthGoalResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

# Endpoint to retrieve all health_goals
@initial_data_router.get("/health-goals", response_model=List[HealthGoalResponse])
def get_health_goals(db: Session = Depends(get_db)):
    health_goals = db.query(models.HealthGoal).all()
    if not health_goals:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="data not found"
        )
    return health_goals


# Schema for the category response
class AllergyResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

# Endpoint to retrieve all allergies
@initial_data_router.get("/allergies", response_model=List[AllergyResponse])
def get_allergies(db: Session = Depends(get_db)):
    allergies = db.query(models.Allergy).all()
    if not allergies:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="data not found"
        )
    return allergies
