# app/services/autism_data_service.py (Crie este arquivo)

from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import ResidentAutismStatistic 

def get_resident_gender_autism_distribution(db: Session):
    """
    Calcula o total de casos de autismo por sexo (homens e mulheres) 
    em toda a População Residente e suas porcentagens.
    """
    
    # Consulta: Soma os totais de casos de autismo em todas as localidades
    result = db.query(
        func.sum(ResidentAutismStatistic.total_residentes_homens_autismo).label("total_male_cases"),
        func.sum(ResidentAutismStatistic.total_residentes_mulheres_autismo).label("total_female_cases")
    ).first()

    # Checa se a consulta retornou resultados válidos
    if not result or (result.total_male_cases is None and result.total_female_cases is None):
        return None

    total_male = result.total_male_cases or 0
    total_female = result.total_female_cases or 0
    total_cases = total_male + total_female

    # Cálculo das Porcentagens de Distribuição (sobre o total de casos)
    if total_cases == 0:
        male_percent = 0.0
        female_percent = 0.0
    else:
        male_percent = (total_male / total_cases) * 100
        female_percent = (total_female / total_cases) * 100

    return {
        "male_percentage": round(male_percent, 2),
        "female_percentage": round(female_percent, 2),
        "total_male_cases": total_male,
        "total_female_cases": total_female
    }