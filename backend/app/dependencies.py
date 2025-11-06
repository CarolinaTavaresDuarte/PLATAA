from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from . import models
from .database import get_db
from .schemas import RoleType, TokenData
from .security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> models.UserAccount:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id: int | None = payload.get("sub")
    role: str | None = payload.get("role")
    if user_id is None or role not in {"responsavel", "especialista"}:
        raise credentials_exception

    user = db.get(models.UserAccount, user_id)
    if user is None:
        raise credentials_exception
    return user


def require_role(role: RoleType):
    def _role_dependency(current_user: models.UserAccount = Depends(get_current_user)) -> models.UserAccount:
        if current_user.role != role:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso não autorizado para este perfil")
        return current_user

    return _role_dependency
