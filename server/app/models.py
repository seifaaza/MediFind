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
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    profile = relationship("Profile", back_populates="user")
    
    # Add cascade delete to the newsletter_subscription relationship
    newsletter_subscription = relationship("Newsletter", back_populates="user", uselist=False, cascade="all, delete-orphan")  

    # One-to-many relationships with posts, comments, and likes/dislikes
    posts = relationship("Post", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    likes_dislikes = relationship("LikeDislike", back_populates="user", cascade="all, delete-orphan")

# Association table for Allergy and Category many-to-many relationship
allergy_categories = Table(
    "allergy_categories",
    Base.metadata,
    Column("allergy_id", Integer, ForeignKey("allergies.id"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id"), primary_key=True)
)

# Define the Allergy model for the allergies list
class Allergy(Base):
    __tablename__ = "allergies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # Allergy name, e.g., "Peanuts"

    # Profiles that have this allergy
    profiles = relationship("Profile", secondary="profile_allergies", back_populates="allergies")
    
    # Categories associated with this allergy
    categories = relationship("Category", secondary=allergy_categories, back_populates="allergies")

# Association table for HealthGoal and Category many-to-many relationship
health_goal_categories = Table(
    "health_goal_categories",
    Base.metadata,
    Column("health_goal_id", Integer, ForeignKey("health_goals.id"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id"), primary_key=True)
)

# Define the HealthGoal model for the health goals list
class HealthGoal(Base):
    __tablename__ = "health_goals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # Goal name, e.g., "Improve heart health"

    # Profiles that have this health goal
    profiles = relationship("Profile", secondary="profile_health_goals", back_populates="health_goals")

    # Many-to-many relationship with Category
    categories = relationship("Category", secondary=health_goal_categories, back_populates="health_goals")


# Define the Category model
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    # Relationship to Post model
    posts = relationship("Post", back_populates="category")

    # Many-to-many relationship with HealthGoal
    health_goals = relationship("HealthGoal", secondary=health_goal_categories, back_populates="categories")

    # Allergies associated with this category
    allergies = relationship("Allergy", secondary=allergy_categories, back_populates="categories")

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

# Define the Post model
class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    # Relationship to User model
    user = relationship("User", back_populates="posts")

    # Relationship to Category model
    category = relationship("Category", back_populates="posts")

    # Relationship to Comment model
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")

# Define the Comment model (Response to the post)
class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)  # Content of the comment
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))  # Created timestamp
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Foreign key to User
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)  # Foreign key to Post

    # Relationship to User model
    user = relationship("User", back_populates="comments")

    # Relationship to Post model
    post = relationship("Post", back_populates="comments")

    # Relationship to LikeDislike model (Many-to-many: each comment can have many likes/dislikes)
    likes_dislikes = relationship("LikeDislike", back_populates="comment", cascade="all, delete-orphan")

# Define the LikeDislike model (Tracks like or dislike for a comment)
class LikeDislike(Base):
    __tablename__ = "like_dislike"

    id = Column(Integer, primary_key=True, index=True)
    value = Column(Integer, nullable=False)  # 1 for like, -1 for dislike
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Foreign key to User
    comment_id = Column(Integer, ForeignKey("comments.id"), nullable=False)  # Foreign key to Comment

    # Relationship to User model
    user = relationship("User", back_populates="likes_dislikes")

    # Relationship to Comment model
    comment = relationship("Comment", back_populates="likes_dislikes")

# Add relationships to User model for easy access
User.posts = relationship("Post", back_populates="user", cascade="all, delete-orphan")
User.comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
User.likes_dislikes = relationship("LikeDislike", back_populates="user", cascade="all, delete-orphan")

def insert_initial_data(db_session):
    try:
        # Sample categories data
        categories_data = [
            "Health Essentials", "Preventive Care", "Nutrition & Healthy Eating", 
            "Fitness & Physical Health", "Mental Well-being", 
            "Addiction Recovery & Support", "Other"
        ]

        # Sample health goals and allergies data
        health_goals_data = {
            "Addiction Recovery & Support": ["Overcome Addiction"],
            "Mental Well-being": ["Improve Mental Clarity", "Reduce Stress", "Improve Mood", "Enhance Focus"],
            "Fitness & Physical Health": ["Build Muscle", "Lose Weight", "Increase Energy"],
            "Nutrition & Healthy Eating": ["Eat Balanced Diet", "Improve Digestion", "Maintain Healthy Weight"],
            "Preventive Care": ["Regular Health Checkups", "Prevent Chronic Diseases", "Improve Heart Health"],
            "Health Essentials": ["Get Educated on Health", "Boost Immune System", "Improve Sleep Quality"]
        }

        allergies_data = {
            "Addiction Recovery & Support": [],
            "Mental Well-being": [],
            "Fitness & Physical Health": [],
            "Nutrition & Healthy Eating": ["Gluten", "Dairy", "Shellfish", "Peanuts", "Tree Nuts"],
            "Preventive Care": ["Nuts", "Soy", "Wheat", "Eggs", "Milk"],
            "Health Essentials": ["Pollen", "Dust", "Mold", "Latex", "Pet Dander"]
        }

        # Insert categories
        categories = {}
        for category_name in categories_data:
            category = Category(name=category_name)
            db_session.add(category)
            categories[category_name] = category

        # Insert health goals
        health_goals = {}
        for category_name, goal_names in health_goals_data.items():
            for goal_name in goal_names:
                health_goal = HealthGoal(name=goal_name)
                db_session.add(health_goal)
                if category_name not in health_goals:
                    health_goals[category_name] = []
                health_goals[category_name].append(health_goal)

        # Insert allergies
        allergies = {}
        for category_name, allergy_names in allergies_data.items():
            for allergy_name in allergy_names:
                allergy = Allergy(name=allergy_name)
                db_session.add(allergy)
                if category_name not in allergies:
                    allergies[category_name] = []
                allergies[category_name].append(allergy)

        # Commit the data insertion
        db_session.commit()

        # Now associate health goals and allergies with categories
        for category_name, goal_list in health_goals.items():
            category = categories[category_name]
            for goal in goal_list:
                category.health_goals.append(goal)

        for category_name, allergy_list in allergies.items():
            category = categories[category_name]
            for allergy in allergy_list:
                category.allergies.append(allergy)

        # Commit the associations
        db_session.commit()

        print("Initial data inserted and associations created successfully.")
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










