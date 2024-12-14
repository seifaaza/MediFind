from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models
from app.db.database import get_db
from api.auth import get_current_user
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import joinedload
from app.utils.token import create_access_token
from fastapi.responses import JSONResponse
from app.utils.calculate_sport_times import calculate_sport_times
from app.utils.calculate_age import calculate_age

# Create an APIRouter instance for profile-related routes
profile_router = APIRouter()

# Profile creation model including IDs for allergies and health goals
class ProfileCreateRequest(BaseModel):
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    weight: Optional[int] = None
    height: Optional[int] = None
    medical_history: Optional[str] = None
    personalized_medications: Optional[List[str]] = []
    allergies: Optional[List[int]] = []  # List of allergy IDs
    health_goals: Optional[List[int]] = []  # List of health goal IDs
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Create profile
@profile_router.post("/", status_code=status.HTTP_201_CREATED)
def create_profile(
    profile_data: ProfileCreateRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Check if the user already has a profile
    existing_profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists for this user"
        )

    # Ensure that at least one field is provided
    if not any([
        profile_data.date_of_birth,
        profile_data.gender,
        profile_data.weight,
        profile_data.height,
        profile_data.medical_history,
        profile_data.personalized_medications,
        profile_data.allergies,
        profile_data.health_goals,
    ]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one field must be provided to create a profile"
        )

    # Create a new profile
    profile = models.Profile(
        user_id=current_user.id,
        date_of_birth=profile_data.date_of_birth,
        gender=profile_data.gender,
        weight=profile_data.weight,
        height=profile_data.height,
        medical_history=profile_data.medical_history
    )

    # Add relationships (allergies, health goals, medications)
    if profile_data.personalized_medications:
        for medication_name in profile_data.personalized_medications:
            medication = models.PersonalizedMedication(name=medication_name, profile=profile)
            db.add(medication)

    if profile_data.allergies:
        allergies = db.query(models.Allergy).filter(models.Allergy.id.in_(profile_data.allergies)).all()
        profile.allergies.extend(allergies)

    if profile_data.health_goals:
        health_goals = db.query(models.HealthGoal).filter(models.HealthGoal.id.in_(profile_data.health_goals)).all()
        profile.health_goals.extend(health_goals)

    # Collect categories from health goals and allergies
    categories = set()

    if profile_data.allergies:
        allergy_categories = db.query(models.Category).join(models.Allergy.categories).filter(models.Allergy.id.in_(profile_data.allergies)).all()
        categories.update(allergy_categories)

    if profile_data.health_goals:
        health_goal_categories = db.query(models.Category).join(models.HealthGoal.categories).filter(models.HealthGoal.id.in_(profile_data.health_goals)).all()
        categories.update(health_goal_categories)

    # Add categories to profile
    profile.categories.extend(categories)

    # Commit changes
    db.add(profile)
    db.commit()
    db.refresh(profile)

    # Extract the category IDs from the profile
    category_ids = [category.id for category in profile.categories] if profile.categories else []

    # Create the access token with the has_profile flag
    access_token = create_access_token(
        data={"username": current_user.username, "id": current_user.id, "has_profile": True}
    )
    return {
        "message": "Profile created successfully",
        "profile_id": profile.id,
        "category_ids": category_ids,
        "token": access_token
    }

class ProfileResponse(BaseModel):
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    weight: Optional[int] = None
    height: Optional[int] = None
    medical_history: Optional[str] = None
    personalized_medications: Optional[List[str]] = []
    allergies: Optional[List[str]] = []  # List of allergy names
    health_goals: Optional[List[str]] = []  # List of health goal names
    categories: Optional[List[str]] = []  # List of category names
    activity_recommendations: Optional[List[str]] = []  # List of activity recommendation names
    nutrition_recommendations: Optional[List[str]] = []  # List of nutrition recommendation names
    created_at: datetime
    updated_at: datetime
    ideal_weight_range: Optional[str] = None  # Include ideal weight range in the response
    sport_times_per_week: Optional[int] = None  # Add sport times per week field

    class Config:
        orm_mode = True  # Enable ORM mode for SQLAlchemy compatibility
        json_encoders = {
            datetime: lambda v: v.isoformat()  # Convert datetime to ISO 8601 string
        }

@profile_router.get("/", response_model=ProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Retrieve the user's profile and eagerly load the categories, health goals, and allergies
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).options(
        joinedload(models.Profile.categories),
        joinedload(models.Profile.health_goals).joinedload(models.HealthGoal.activity_recommendations),
        joinedload(models.Profile.allergies).joinedload(models.Allergy.nutrition_recommendations)
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found for this user"
        )

    # Calculate the ideal weight range if height is provided
    ideal_weight_range = None
    if profile.height:
        height_in_meters = profile.height / 100  # Convert height to meters
        min_weight = round(18.5 * (height_in_meters ** 2), 1)
        max_weight = round(24.9 * (height_in_meters ** 2), 1)
        ideal_weight_range = f"{min_weight} kg - {max_weight} kg"

    # Calculate the user's age from date_of_birth
    age = calculate_age(profile.date_of_birth)

    # Calculate the recommended sport times per week
    sport_times_per_week = calculate_sport_times(profile.gender, profile.weight, age)

    # Manually serialize datetime fields and include recommendations
    data = {
        "age": age,
        "gender": profile.gender,
        "height": profile.height,
        "weight": profile.weight,
        "medical_history": profile.medical_history,
        "personalized_medications": [medication.name for medication in profile.personalized_medications],
        "allergies": [allergy.name for allergy in profile.allergies],
        "health_goals": [goal.name for goal in profile.health_goals],
        "categories": [category.name for category in profile.categories],  # Extract category names
        "activity_recommendations": [activity.name for goal in profile.health_goals for activity in goal.activity_recommendations],  # Extract activity recommendation names
        "nutrition_recommendations": [nutrition.name for allergy in profile.allergies for nutrition in allergy.nutrition_recommendations],  # Extract nutrition recommendation names
        "created_at": profile.user.created_at.isoformat(),  # Manually serialize datetime to ISO 8601
        "updated_at": profile.updated_at.isoformat(),      # Manually serialize datetime to ISO 8601
        "ideal_weight_range": ideal_weight_range,  # Add the ideal weight range
        "sport_times_per_week": sport_times_per_week  # Include the sport times per week
    }

    return JSONResponse(content=data)

# Request model for updating profile fields
class ProfileUpdateRequest(BaseModel):
    weight: Optional[int] = None
    height: Optional[int] = None
    personalized_medications: Optional[List[str]] = []
    allergies: Optional[List[int]] = []  # List of allergy IDs
    health_goals: Optional[List[int]] = []  # List of health goal IDs

# Edit profile endpoint
@profile_router.put("/", status_code=status.HTTP_200_OK)
def edit_profile(
    profile_data: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Retrieve the user's profile
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found for this user"
        )

    # Update weight and height if provided
    if profile_data.weight is not None:
        profile.weight = profile_data.weight
    if profile_data.height is not None:
        profile.height = profile_data.height

    # Update personalized medications
    if profile_data.personalized_medications is not None:
        # Clear existing personalized medications
        profile.personalized_medications.clear()
        # Add new personalized medications
        for medication_name in profile_data.personalized_medications:
            medication = models.PersonalizedMedication(name=medication_name, profile=profile)
            db.add(medication)

    # Update allergies by IDs
    if profile_data.allergies is not None:
        allergies = db.query(models.Allergy).filter(models.Allergy.id.in_(profile_data.allergies)).all()
        profile.allergies = allergies

    # Update health goals by IDs
    if profile_data.health_goals is not None:
        health_goals = db.query(models.HealthGoal).filter(models.HealthGoal.id.in_(profile_data.health_goals)).all()
        profile.health_goals = health_goals

    # Update the `updated_at` timestamp
    profile.updated_at = datetime.now(timezone.utc)

    # Commit changes to the database
    db.commit()
    db.refresh(profile)

    return {"message": "Profile data updated successfully"}

# Delete profile endpoint
@profile_router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def delete_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Retrieve the user's profile
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found for this user"
        )
    
    # Remove personalized medications associated with the profile
    for medication in profile.personalized_medications:
        db.delete(medication)

    # Remove allergies from the profile (without deleting the actual allergy records)
    profile.allergies.clear()

    # Remove health goals from the profile (without deleting the actual health goal records)
    profile.health_goals.clear()

    # Finally, delete the profile itself
    db.delete(profile)
    
    # Commit changes to the database
    db.commit()
    
    return {"message": "Profile and associated data deleted successfully"}
