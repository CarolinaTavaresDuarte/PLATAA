from __future__ import annotations
from typing import Optional

from sqlalchemy import MetaData, create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import get_settings

settings = get_settings()

# Base única para todo o projeto
metadata = MetaData()
Base = declarative_base(metadata=metadata)

engine: Optional[Engine] = None
SessionLocal: Optional[sessionmaker] = None


def init_engine() -> None:
    """Inicializa engine e sessão."""
    global engine, SessionLocal
    url = settings.sqlalchemy_url
    connect_args = {}
    if url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}

    engine = create_engine(url, pool_pre_ping=True, future=True, connect_args=connect_args)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("init_engine: engine.connect() OK")
    except Exception as e:
        print("init_engine: engine.connect() FAIL ->", repr(e))

    try:
        with SessionLocal() as s:
            s.execute(text("SELECT 1"))
        print("init_engine: SessionLocal OK")
    except Exception as e:
        print("init_engine: SessionLocal FAIL ->", repr(e))


def create_schemas() -> None:
    """Cria os schemas se não existirem."""
    assert engine is not None, "Engine não inicializada"
    with engine.begin() as conn:
        conn.execute(text(f"CREATE SCHEMA IF NOT EXISTS {settings.user_schema}"))
        conn.execute(text(f"CREATE SCHEMA IF NOT EXISTS {settings.specialist_schema}"))
        conn.execute(text(f"CREATE SCHEMA IF NOT EXISTS {settings.tests_schema}"))


def create_all() -> None:
    """Cria schemas e todas as tabelas."""
    assert engine is not None, "Engine não inicializada"
    create_schemas()
    Base.metadata.create_all(bind=engine)


def get_db():
    """Gerador de sessão para dependência FastAPI."""
    assert SessionLocal is not None, "SessionLocal não inicializada"
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
