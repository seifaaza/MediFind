from app.db.database import SessionLocal, Base, engine
from app.models import insert_initial_data

def init_db():
    # Create the tables in the database
    Base.metadata.create_all(bind=engine)

    # Create a session
    db_session = SessionLocal()

    try:
        # Insert the initial data
        insert_initial_data(db_session)
        db_session.commit()  # Ensure commit happens after the insertions
        print("Initial data inserted successfully.")
    except Exception as e:
        db_session.rollback()  # Rollback if any error occurs
        print(f"Error inserting data: {e}")
    finally:
        # Close the session
        db_session.close()

if __name__ == "__main__":
    init_db()
