from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user
from ..security import create_access_token, get_password_hash, verify_password

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/register", response_model=schemas.UserResponseSchema, status_code=status.HTTP_201_CREATED)
def register_user(payload: schemas.UserCreateSchema, db: Session = Depends(get_db)):
    existing = db.query(models.UserAccount).filter(models.UserAccount.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail já cadastrado")

    user = models.UserAccount(
        nome=payload.nome,
        email=payload.email,
        role=payload.role,
        senha_hash=get_password_hash(payload.senha),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if payload.role == "especialista":
        specialist = models.SpecialistProfile(usuario_id=user.id)
        db.add(specialist)
        db.commit()
        db.refresh(user)

    return user


@router.post("/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.UserAccount).filter(models.UserAccount.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.senha_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Credenciais inválidas")

    # Ajuste: chamada compatível com security.py atualizado
    access_token = create_access_token(
        user_id=user.id,
        role=user.role,
        expires_delta=timedelta(minutes=60 * 6),
    )

    return schemas.Token(access_token=access_token)


@router.get("/me", response_model=schemas.UserResponseSchema)
def read_users_me(current_user: models.UserAccount = Depends(get_current_user)):
    return current_user
