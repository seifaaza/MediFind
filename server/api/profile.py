from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models
from app.db.database import get_db
from api.auth import get_current_user
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone

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


# Profile response model with allergy and health goal names
class ProfileResponse(BaseModel):
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    weight: Optional[int] = None
    height: Optional[int] = None
    medical_history: Optional[str] = None
    personalized_medications: Optional[List[str]] = []
    allergies: Optional[List[str]] = []  # List of allergy names
    health_goals: Optional[List[str]] = []  # List of health goal names
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True  # Enable ORM mode for SQLAlchemy compatibility

# Request model for updating profile fields
class ProfileUpdateRequest(BaseModel):
    weight: Optional[int] = None
    height: Optional[int] = None
    personalized_medications: Optional[List[str]] = []
    allergies: Optional[List[int]] = []  # List of allergy IDs
    health_goals: Optional[List[int]] = []  # List of health goal IDs

# Create a new profile
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
    
    # Create a new profile
    profile = models.Profile(
        user_id=current_user.id,
        date_of_birth=profile_data.date_of_birth,
        gender=profile_data.gender,
        weight=profile_data.weight,
        height=profile_data.height,
        medical_history=profile_data.medical_history
    )

    # Add personalized medications if present
    if profile_data.personalized_medications:
        for medication_name in profile_data.personalized_medications:
            medication = models.PersonalizedMedication(name=medication_name, profile=profile)
            db.add(medication)
    
    # Add allergies by retrieving them by ID
    if profile_data.allergies:
        allergies = db.query(models.Allergy).filter(models.Allergy.id.in_(profile_data.allergies)).all()
        profile.allergies.extend(allergies)
    
    # Add health goals by retrieving them by ID
    if profile_data.health_goals:
        health_goals = db.query(models.HealthGoal).filter(models.HealthGoal.id.in_(profile_data.health_goals)).all()
        profile.health_goals.extend(health_goals)

    # Add the profile to the session and commit
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    return {"message": "Profile created successfully"}

# Retrieve profile with allergy and health goal names
@profile_router.get("/", response_model=ProfileResponse)
def get_profile(
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

    # Construct response with related names
    profile_data = ProfileResponse(
        date_of_birth=profile.date_of_birth,
        gender=profile.gender,
        weight=profile.weight,
        height=profile.height,
        medical_history=profile.medical_history,
        personalized_medications=[medication.name for medication in profile.personalized_medications],
        allergies=[allergy.name for allergy in profile.allergies],  # Retrieve allergy names
        health_goals=[goal.name for goal in profile.health_goals],  # Retrieve health goal names
        created_at=profile.user.created_at,
        updated_at=profile.updated_at
    )

    return profile_data

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
