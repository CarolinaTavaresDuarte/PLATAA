from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.ibge_importer import import_ibge_autism_file
from app.schemas import IndigenousAutismStatisticResponse
from app.models import IndigenousAutismStatistic

router = APIRouter(prefix="/api/v1/ibge", tags=["IBGE"])


@router.post("/autism/import")
def import_autism_data(db: Session = Depends(get_db)):
    import_ibge_autism_file(db, "data/autismo.xlsx")
    return {"status": "import completed"}


@router.get("/autism", response_model=list[IndigenousAutismStatisticResponse])
def list_autism_data(db: Session = Depends(get_db)):
    return db.query(IndigenousAutismStatistic).all()
