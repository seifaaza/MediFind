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

# Association table for Allergy and NutritionRecommendation many-to-many relationship
allergy_nutrition_recommendations = Table(
    "allergy_nutrition_recommendations",
    Base.metadata,
    Column("allergy_id", Integer, ForeignKey("allergies.id"), primary_key=True),
    Column("nutrition_recommendation_id", Integer, ForeignKey("nutrition_recommendations.id"), primary_key=True)
)

# Define the NutritionRecommendation model for nutrition recommendations
class NutritionRecommendation(Base):
    __tablename__ = "nutrition_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    # Many-to-many relationship with Allergy
    allergies = relationship("Allergy", secondary=allergy_nutrition_recommendations, back_populates="nutrition_recommendations")


# Define the Allergy model for the allergies list
class Allergy(Base):
    __tablename__ = "allergies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # Allergy name, e.g., "Peanuts"

    # Profiles that have this allergy
    profiles = relationship("Profile", secondary="profile_allergies", back_populates="allergies")
    
    # Categories associated with this allergy
    categories = relationship("Category", secondary="allergy_categories", back_populates="allergies")

    # Many-to-many relationship with NutritionRecommendation
    nutrition_recommendations = relationship("NutritionRecommendation", secondary=allergy_nutrition_recommendations, back_populates="allergies")

# Association table for HealthGoal and Category many-to-many relationship
health_goal_categories = Table(
    "health_goal_categories",
    Base.metadata,
    Column("health_goal_id", Integer, ForeignKey("health_goals.id"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id"), primary_key=True)
)

# Association table for HealthGoal and ActivityRecommendation many-to-many relationship
health_goal_activity_recommendations = Table(
    "health_goal_activity_recommendations",
    Base.metadata,
    Column("health_goal_id", Integer, ForeignKey("health_goals.id"), primary_key=True),
    Column("activity_recommendation_id", Integer, ForeignKey("activity_recommendations.id"), primary_key=True)
)

# Define the ActivityRecommendation model for activity recommendations
class ActivityRecommendation(Base):
    __tablename__ = "activity_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # Activity name, e.g., "Walking", "Yoga"

    # Many-to-many relationship with HealthGoal
    health_goals = relationship("HealthGoal", secondary=health_goal_activity_recommendations, back_populates="activity_recommendations")

# Modify the HealthGoal model to include the relationship to ActivityRecommendation
class HealthGoal(Base):
    __tablename__ = "health_goals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # Goal name, e.g., "Improve heart health"

    # Profiles that have this health goal
    profiles = relationship("Profile", secondary="profile_health_goals", back_populates="health_goals")

    # Many-to-many relationship with Category
    categories = relationship("Category", secondary=health_goal_categories, back_populates="health_goals")

    # Many-to-many relationship with ActivityRecommendation
    activity_recommendations = relationship("ActivityRecommendation", secondary=health_goal_activity_recommendations, back_populates="health_goals")

# Define the many-to-many relationship table if not already done
profile_categories = Table(
    'profile_categories', Base.metadata,
    Column('profile_id', Integer, ForeignKey('profiles.id')),
    Column('category_id', Integer, ForeignKey('categories.id'))
)

# Define the Category model
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    # Relationship to Post model
    posts = relationship("Post", back_populates="category")

    # Many-to-many relationship with HealthGoal
    health_goals = relationship("HealthGoal", secondary=health_goal_categories, back_populates="categories")

    # Allergies associated with this category
    allergies = relationship("Allergy", secondary=allergy_categories, back_populates="categories")

    # Reverse relationship with Profile
    profiles = relationship("Profile", secondary=profile_categories, back_populates="categories")

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
    # Add categories relationship
    categories = relationship("Category", secondary=profile_categories, back_populates="profiles")

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

        # Activity recommendations data for each health goal
        activity_recommendations_data = {
            "Overcome Addiction": ["Yoga", "Meditation", "Walking", "Breathing Exercises"],
            "Improve Mental Clarity": ["Meditation", "Mindfulness", "Reading", "Journaling"],
            "Reduce Stress": ["Yoga", "Deep Breathing", "Running", "Progressive Muscle Relaxation"],
            "Improve Mood": ["Walking", "Running", "Cycling", "Socializing", "Mindfulness"],
            "Enhance Focus": ["Yoga", "Meditation", "Walking", "Reading", "Breathing Exercises"],
            "Build Muscle": ["Weight Training", "Strength Exercises", "Protein Supplements"],
            "Lose Weight": ["Cardio", "HIIT", "Running", "Swimming", "Cycling"],
            "Increase Energy": ["Walking", "Yoga", "Swimming", "Cycling", "Stretching"],
            "Eat Balanced Diet": ["Meal Planning", "Vegetable Cooking Classes", "Healthy Cooking Workshops"],
            "Improve Digestion": ["Walking", "Yoga", "Hydration Exercises", "Low-Fiber Diet"],
            "Maintain Healthy Weight": ["Regular Exercise", "Balanced Diet", "Portion Control"],
            "Regular Health Checkups": ["Routine Exercise", "Dietary Adjustments", "Stress Management"],
            "Prevent Chronic Diseases": ["Exercise", "Eating Whole Foods", "Reducing Sugar Intake"],
            "Improve Heart Health": ["Running", "Cycling", "Swimming", "Cardio Exercise"],
            "Get Educated on Health": ["Reading Health Books", "Attending Workshops", "Webinars"],
            "Boost Immune System": ["Walking", "Healthy Eating", "Sleep Hygiene", "Mindfulness"],
            "Improve Sleep Quality": ["Evening Yoga", "Breathing Exercises", "Consistent Bedtime"]
        }

        # Sample nutrition recommendations data
        nutrition_recommendations_data = {
            "Gluten": ["Gluten-Free Bread", "Rice-Based Meals", "Quinoa"],
            "Dairy": ["Lactose-Free Milk", "Almond Milk", "Soy Cheese"],
            "Shellfish": ["Plant-Based Protein", "Fresh Vegetables", "Grilled Chicken"],
            "Peanuts": ["Sunflower Butter", "Almond Butter", "Cashew Butter"],
            "Tree Nuts": ["Nut-Free Snacks", "Coconut-Based Products", "Seeds"],
            "Nuts": ["Nut-Free Granola", "Fruit Snacks", "Vegetable Chips"],
            "Soy": ["Soy-Free Protein Powder", "Coconut Aminos", "Legumes"],
            "Wheat": ["Corn Tortillas", "Gluten-Free Pasta", "Rice Noodles"],
            "Eggs": ["Chickpea Flour Omelet", "Tofu Scramble", "Vegan Mayonnaise"],
            "Milk": ["Oat Milk", "Coconut Milk", "Rice Milk"],
            "Pollen": ["Filtered Honey", "Antioxidant Smoothies", "Vitamin C-Rich Fruits"],
            "Dust": ["Hydrating Foods", "Air-Purifying Plants", "Omega-3 Fatty Acids"],
            "Mold": ["Fermented Foods", "Probiotic-Rich Foods", "Low-Moisture Fruits"],
            "Latex": ["Non-Latex Alternatives", "Banana-Free Snacks", "Gluten-Free Cookies"],
            "Pet Dander": ["Anti-Allergy Diet", "High-Vitamin Diet", "Probiotic Foods"]
        }

        # Insert categories
        categories = {}
        for category_name in categories_data:
            existing_category = db_session.query(Category).filter_by(name=category_name).first()
            if not existing_category:
                category = Category(name=category_name)
                db_session.add(category)
                categories[category_name] = category
            else:
                categories[category_name] = existing_category

        # Insert health goals
        health_goals = {}
        for category_name, goal_names in health_goals_data.items():
            for goal_name in goal_names:
                existing_goal = db_session.query(HealthGoal).filter_by(name=goal_name).first()
                if not existing_goal:
                    health_goal = HealthGoal(name=goal_name)
                    db_session.add(health_goal)
                    if category_name not in health_goals:
                        health_goals[category_name] = []
                    health_goals[category_name].append(health_goal)
                else:
                    health_goals[category_name].append(existing_goal)

        # Insert allergies
        allergies = {}
        for category_name, allergy_names in allergies_data.items():
            for allergy_name in allergy_names:
                existing_allergy = db_session.query(Allergy).filter_by(name=allergy_name).first()
                if not existing_allergy:
                    allergy = Allergy(name=allergy_name)
                    db_session.add(allergy)
                    if category_name not in allergies:
                        allergies[category_name] = []
                    allergies[category_name].append(allergy)
                else:
                    allergies[category_name].append(existing_allergy)

        # Insert activity recommendations
        activity_recommendations = {}
        for health_goal_name, activities in activity_recommendations_data.items():
            for activity_name in activities:
                existing_activity = db_session.query(ActivityRecommendation).filter_by(name=activity_name).first()
                if not existing_activity:
                    activity = ActivityRecommendation(name=activity_name)
                    db_session.add(activity)
                    activity_recommendations.setdefault(health_goal_name, []).append(activity)
                else:
                    activity_recommendations.setdefault(health_goal_name, []).append(existing_activity)

        # Insert nutrition recommendations
        nutrition_recommendations = {}
        for allergy_name, recommendations in nutrition_recommendations_data.items():
            for recommendation_name in recommendations:
                existing_recommendation = db_session.query(NutritionRecommendation).filter_by(name=recommendation_name).first()
                if not existing_recommendation:
                    recommendation = NutritionRecommendation(name=recommendation_name)
                    db_session.add(recommendation)
                    nutrition_recommendations.setdefault(allergy_name, []).append(recommendation)
                else:
                    nutrition_recommendations.setdefault(allergy_name, []).append(existing_recommendation)

        # Commit the data insertion
        db_session.commit()

        # Associate health goals and allergies with categories
        for category_name, goal_list in health_goals.items():
            category = categories[category_name]
            for goal in goal_list:
                if goal not in category.health_goals:
                    category.health_goals.append(goal)

        for category_name, allergy_list in allergies.items():
            category = categories[category_name]
            for allergy in allergy_list:
                if allergy not in category.allergies:
                    category.allergies.append(allergy)

        # Associate activity recommendations with health goals
        for health_goal_name, activity_list in activity_recommendations.items():
            for category_name, goal_list in health_goals.items():
                health_goal = next((goal for goal in goal_list if goal.name == health_goal_name), None)
                if health_goal:
                    for activity in activity_list:
                        if activity not in health_goal.activity_recommendations:
                            health_goal.activity_recommendations.append(activity)

        # Associate nutrition recommendations with allergies
        for allergy_name, recommendation_list in nutrition_recommendations.items():
            allergy = db_session.query(Allergy).filter_by(name=allergy_name).first()
            if allergy:
                for recommendation in recommendation_list:
                    if recommendation not in allergy.nutrition_recommendations:
                        allergy.nutrition_recommendations.append(recommendation)

        # Final commit for associations
        db_session.commit()
        print("Initial data inserted successfully.")

    except Exception as e:
        print(f"Error inserting data: {e}")
        db_session.rollback()


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