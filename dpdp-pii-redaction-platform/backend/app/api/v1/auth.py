from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token, verify_password
from app.repositories.user_repository import user_repo
from app.schemas.auth_schema import UserCreate, User, Token
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=User)
def register(obj_in: UserCreate, db: Session = Depends(get_db)):
    user = user_repo.get_by_email(db, email=obj_in.email)
    if user:
        raise HTTPException(status_code=400, detail="User already exists")
    return user_repo.create(db, obj_in=obj_in)

@router.post("/login", response_model=Token)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = user_repo.get_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=User)
def update_me(obj_in: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if obj_in.email and obj_in.email != current_user.email:
        existing = user_repo.get_by_email(db, email=obj_in.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already taken")
    
    # Simple manual update to avoid full repository refactor
    if obj_in.full_name is not None:
        current_user.full_name = obj_in.full_name
    if obj_in.email is not None:
        current_user.email = obj_in.email
    if obj_in.password:
        from app.core.security import get_password_hash
        current_user.hashed_password = get_password_hash(obj_in.password)
        
    db.commit()
    db.refresh(current_user)
    return current_user
