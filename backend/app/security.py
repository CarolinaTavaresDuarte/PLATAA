from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import get_settings

# Cria o contexto de criptografia
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()


# -------- Funções de senha --------

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compara a senha digitada com o hash salvo."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Gera o hash da senha (corta senhas longas demais)."""
    return pwd_context.hash(password[:72])  # bcrypt suporta até 72 bytes


# -------- Funções de token --------

def create_access_token(user_id: int, role: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Cria um token JWT com o ID do usuário e o papel (role).
    """
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.jwt_expiration_minutes))
    to_encode = {"sub": str(user_id), "role": role, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodifica o token JWT e retorna o payload, se válido.
    """
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        sub = payload.get("sub")
        role = payload.get("role")
        if sub is None or role is None:
            return None
        return payload
    except JWTError:
        return None
