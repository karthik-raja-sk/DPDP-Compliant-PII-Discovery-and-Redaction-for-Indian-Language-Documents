import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    from app.core.database import SessionLocal, engine, Base
    from app.models.user import User
    from app.repositories.user_repository import user_repo
    from app.schemas.auth_schema import UserCreate
    
    print("Models and modules imported successfully.")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("Tables created.")
    
    # Test hashing and creation
    db = SessionLocal()
    try:
        user_in = UserCreate(
            email="diag_test@example.com",
            full_name="Diag Test",
            password="Password123!"
        )
        print("Schema object created.")
        
        # Check if user exists
        existing_user = user_repo.get_by_email(db, email=user_in.email)
        if existing_user:
            print(f"User {user_in.email} already exists. Deleting...")
            db.delete(existing_user)
            db.commit()
            
        print("Attempting to create user...")
        user = user_repo.create(db, obj_in=user_in)
        print(f"User created: {user.email}")
    except Exception as e:
        print(f"Error during user creation: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()
        
except Exception as e:
    print(f"Error during import or setup: {e}")
    import traceback
    traceback.print_exc()
