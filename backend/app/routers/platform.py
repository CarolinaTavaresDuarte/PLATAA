from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/v1/platform", tags=["platform"])


@router.get("/metrics/platform-stats", response_model=schemas.PlatformStatsResponse)
def get_platform_stats(db: Session = Depends(get_db)):
    triagens = db.query(models.TestResult).count()
    especialistas = db.query(models.UserAccount).filter(models.UserAccount.role == "especialista").count()
    return schemas.PlatformStatsResponse(
        triagens_realizadas=triagens,
        especialistas_cadastrados=especialistas,
        ultima_atualizacao=datetime.utcnow(),
    )


@router.post("/contact/submit", response_model=schemas.ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(payload: schemas.ContactRequest, db: Session = Depends(get_db)):
    mensagem = models.ContactMessage(**payload.model_dump())
    db.add(mensagem)
    db.commit()
    db.refresh(mensagem)
    return mensagem
