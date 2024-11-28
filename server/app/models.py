from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime, timezone
from app.db.database import Base, engine  # Assuming `Base` and `engine` are defined in app.database

# Define the Newsletter model
class Newsletter(Base):
    __tablename__ = "newsletters"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    subscribed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Add a foreign key for user_id

    # Relationship to User model
    user = relationship("User", back_populates="newsletter_subscription")

# Define the User model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    profile = relationship("Profile", back_populates="user")
    
    # Add cascade delete to the newsletter_subscription relationship
    newsletter_subscription = relationship("Newsletter", back_populates="user", uselist=False, cascade="all, delete-orphan")  



# Define the Allergy model for the allergies list
class Allergy(Base):
    __tablename__ = "allergies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # Allergy name, e.g., "Peanuts"

    # Profiles that have this allergy
    profiles = relationship("Profile", secondary="profile_allergies", back_populates="allergies")


# Define the HealthGoal model for the health goals list
class HealthGoal(Base):
    __tablename__ = "health_goals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # Goal name, e.g., "Improve heart health"

    # Profiles that have this health goal
    profiles = relationship("Profile", secondary="profile_health_goals", back_populates="health_goals")


# Association table for Profile and Allergy many-to-many relationship
profile_allergies = Table(
    "profile_allergies",
    Base.metadata,
    Column("profile_id", Integer, ForeignKey("profiles.id"), primary_key=True),
    Column("allergy_id", Integer, ForeignKey("allergies.id"), primary_key=True)
)

# Association table for Profile and HealthGoal many-to-many relationship
profile_health_goals = Table(
    "profile_health_goals",
    Base.metadata,
    Column("profile_id", Integer, ForeignKey("profiles.id"), primary_key=True),
    Column("health_goal_id", Integer, ForeignKey("health_goals.id"), primary_key=True)
)

# Association table for Profile and PersonalizedMedication many-to-many relationship
profile_personalized_medications = Table(
    "profile_personalized_medications",
    Base.metadata,
    Column("profile_id", Integer, ForeignKey("profiles.id"), primary_key=True),
    Column("personalized_medication_id", Integer, ForeignKey("personalized_medications.id"), primary_key=True)
)

# Define the PersonalizedMedication model (for user-specific data)
class PersonalizedMedication(Base):
    __tablename__ = "personalized_medications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # Medication name is no longer unique
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)  # Foreign key to Profile
    
    # Relationship to the Profile model
    profile = relationship("Profile", back_populates="personalized_medications")


# Define the Profile model with cascading deletes only for personalized medications
class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    date_of_birth = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    weight = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    medical_history = Column(String, nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Many-to-many relationships without cascading delete-orphan
    allergies = relationship("Allergy", secondary=profile_allergies, back_populates="profiles", cascade=None)
    health_goals = relationship("HealthGoal", secondary=profile_health_goals, back_populates="profiles", cascade=None)
    personalized_medications = relationship("PersonalizedMedication", back_populates="profile", cascade="all, delete-orphan")

    # One-to-many relationships with cascading deletes for orphaned records (only where applicable)
    user = relationship("User", back_populates="profile", single_parent=True, cascade="all, delete-orphan")


def insert_initial_data(db_session):
    try:
        # Sample allergies and health goals data
        allergies_data = [
            "Peanuts", "Shellfish", "Eggs", "Milk", "Wheat", "Soy", "Tree nuts", 
            "Fish", "Gluten", "Sesame"
        ]
        
        health_goals_data = [
            "Improve heart health", "Lose weight", "Increase muscle mass", "Reduce stress",
            "Improve flexibility", "Lower blood pressure", "Control diabetes", 
            "Improve sleep quality"
        ]
        
        # Insert allergies
        for allergy_name in allergies_data:
            allergy = Allergy(name=allergy_name)
            db_session.add(allergy)
        
        # Insert health goals
        for goal_name in health_goals_data:
            health_goal = HealthGoal(name=goal_name)
            db_session.add(health_goal)
        
        # Commit both inserts in one go
        db_session.commit()  # Commit the data insertion to the database
        print("Initial data inserted successfully.")
    except Exception as e:
        db_session.rollback()  # Rollback in case of an error
        print(f"Error inserting data: {e}")

# Create the sessionmaker for SQLAlchemy
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Example usage:
if __name__ == "__main__":
    # Create the tables in the database (if they don't exist)
    Base.metadata.create_all(bind=engine)

    # Get the database session
    db_session = SessionLocal()
    
    # Insert the initial data
    insert_initial_data(db_session)
    
    # Close the session after use
    db_session.close()