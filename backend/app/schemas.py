from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

RoleType = Literal["responsavel", "especialista"]
TesteTipo = Literal[
    "mchat",
    "assq",
    "aq10",
    "ados2",
    "adir",
]


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int
    role: RoleType


class UserBaseSchema(BaseModel):
    nome: str = Field(..., max_length=255)
    email: EmailStr
    role: RoleType


class UserCreateSchema(UserBaseSchema):
    senha: str = Field(..., min_length=6)


class UserResponseSchema(UserBaseSchema):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SpecialistProfileSchema(BaseModel):
    conselho: Optional[str]
    especialidade: Optional[str]
    bio: Optional[str]


class SpecialistProfileResponse(SpecialistProfileSchema):
    id: int
    usuario_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TestedIndividualBase(BaseModel):
    nome_completo: str
    documento_cpf: str = Field(..., min_length=11, max_length=14)
    regiao_bairro: str
    contato_telefone: str
    contato_email: EmailStr
    consentimento_pesquisa: bool


class TestedIndividualCreate(TestedIndividualBase):
    pass


class TestedIndividualResponse(TestedIndividualBase):
    id: int
    responsavel_id: Optional[int]
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)


class TestResponseItem(BaseModel):
    pergunta_id: str
    resposta: str


class TestResultCreate(BaseModel):
    teste_tipo: TesteTipo
    faixa_etaria: str
    regiao_geografica: str
    respostas: List[TestResponseItem]


class TestResultResponse(BaseModel):
    id: int
    teste_tipo: str
    faixa_etaria: str
    regiao_geografica: str
    score: int
    classificacao: str
    criado_em: datetime
    respostas: List[TestResponseItem]

    model_config = ConfigDict(from_attributes=True)


class TestSubmissionResponse(BaseModel):
    resultado: TestResultResponse
    mensagem_orientacao: str


class DashboardMetric(BaseModel):
    label: str
    value: str


class ContactRequest(BaseModel):
    nome: str
    email: EmailStr
    mensagem: str


class ContactResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr
    mensagem: str
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)


class PlatformStatsResponse(BaseModel):
    triagens_realizadas: int
    especialistas_cadastrados: int
    ultima_atualizacao: datetime


class SpecialistDashboardItem(BaseModel):
    nome_completo: str
    faixa_etaria: str
    regiao_bairro: str
    contato_principal: str
    risco: str
    teste_tipo: str
    data: datetime


class SpecialistDashboardResponse(BaseModel):
    totais_por_risco: dict
    pacientes: List[SpecialistDashboardItem]


class PatientDashboardCard(BaseModel):
    teste_tipo: str
    data: datetime
    risco: str


class PatientDashboardResponse(BaseModel):
    cpf: str
    cards: List[PatientDashboardCard]
    transparencia_ibge: List[str]

class IndigenousAutismStatisticBase(BaseModel):
    location: str
    indigenous_population: int
    autism_count: int
    autism_percentage: float

class IndigenousAutismStatisticCreate(IndigenousAutismStatisticBase):
    pass

class IndigenousAutismStatisticResponse(IndigenousAutismStatisticBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)