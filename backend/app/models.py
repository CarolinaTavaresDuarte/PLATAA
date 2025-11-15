from datetime import datetime
from sqlalchemy import (
    Boolean, CheckConstraint, Column, DateTime, Enum, ForeignKey,
    Integer, JSON, String, Text, UniqueConstraint, Float
)
from sqlalchemy.orm import relationship
from .config import get_settings
from .database import Base

settings = get_settings()


# ===================== USERS =====================

class UserAccount(Base):
    __tablename__ = "usuarios"
    __table_args__ = {"schema": settings.user_schema}

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    senha_hash = Column(String(255), nullable=False)
    role = Column(
        Enum("responsavel", "especialista", name="user_role", schema=settings.user_schema),
        nullable=False
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    especialista = relationship("SpecialistProfile", back_populates="usuario", uselist=False)
    testados = relationship("TestedIndividual", back_populates="responsavel")
    resultados = relationship("TestResult", back_populates="usuario")
    contatos = relationship("ContactMessage", back_populates="usuario")


# ===================== SPECIALISTS =====================

class SpecialistProfile(Base):
    __tablename__ = "especialistas"
    __table_args__ = {"schema": settings.specialist_schema}

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(
        Integer,
        ForeignKey(f"{settings.user_schema}.usuarios.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )
    conselho = Column(String(255), nullable=True)
    especialidade = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    usuario = relationship("UserAccount", back_populates="especialista")


# ===================== TESTED INDIVIDUALS =====================

class TestedIndividual(Base):
    __tablename__ = "testados"
    __table_args__ = {"schema": settings.tests_schema}

    id = Column(Integer, primary_key=True, index=True)
    responsavel_id = Column(
        Integer,
        ForeignKey(f"{settings.user_schema}.usuarios.id", ondelete="SET NULL"),
        nullable=True
    )
    nome_completo = Column(String(255), nullable=False)
    documento_cpf = Column(String(14), nullable=False, unique=True, index=True)
    regiao_bairro = Column(String(255), nullable=False)
    contato_telefone = Column(String(32), nullable=False)
    contato_email = Column(String(255), nullable=False)
    consentimento_pesquisa = Column(Boolean, nullable=False, default=False)
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)

    resultados = relationship("TestResult", back_populates="testado", cascade="all, delete-orphan")
    responsavel = relationship("UserAccount", back_populates="testados")


# ===================== TEST RESULTS =====================

class TestResult(Base):
    __tablename__ = "resultados_testes"
    __table_args__ = (
        UniqueConstraint("testado_id", "teste_tipo", name="uq_resultado_testado_tipo"),
        CheckConstraint("score >= 0", name="check_score_positive"),
        {"schema": settings.tests_schema},
    )

    id = Column(Integer, primary_key=True, index=True)
    testado_id = Column(
        Integer,
        ForeignKey(f"{settings.tests_schema}.testados.id", ondelete="CASCADE"),
        nullable=False
    )
    usuario_id = Column(
        Integer,
        ForeignKey(f"{settings.user_schema}.usuarios.id", ondelete="SET NULL"),
        nullable=True
    )
    teste_tipo = Column(String(64), nullable=False)
    respostas = Column(JSON, nullable=False)
    score = Column(Integer, nullable=False)
    classificacao = Column(String(64), nullable=False)
    faixa_etaria = Column(String(64), nullable=False)
    regiao_geografica = Column(String(128), nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)

    testado = relationship("TestedIndividual", back_populates="resultados")
    usuario = relationship("UserAccount", back_populates="resultados")
    anonimizado = relationship("AnonymisedRecord", back_populates="resultado", uselist=False, cascade="all, delete-orphan")


# ===================== ANONYMISED RECORDS =====================

class AnonymisedRecord(Base):
    __tablename__ = "registros_anonimizados"
    __table_args__ = {"schema": settings.tests_schema}

    id = Column(Integer, primary_key=True, index=True)
    resultado_id = Column(
        Integer,
        ForeignKey(f"{settings.tests_schema}.resultados_testes.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )
    faixa_etaria = Column(String(64), nullable=False)
    regiao_geografica = Column(String(128), nullable=False)
    score = Column(Integer, nullable=False)
    teste_tipo = Column(String(64), nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)

    resultado = relationship("TestResult", back_populates="anonimizado")


# ===================== CONTACT MESSAGES =====================

class ContactMessage(Base):
    __tablename__ = "contatos"
    __table_args__ = {"schema": settings.user_schema}

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    mensagem = Column(Text, nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)

    usuario_id = Column(Integer, ForeignKey(f"{settings.user_schema}.usuarios.id", ondelete="SET NULL"), nullable=True)
    usuario = relationship("UserAccount", back_populates="contatos")

# ===================== IBGE ESTATISTICAS INDÍGENAS =====================
class IndigenousAutismStatistic(Base):
    __tablename__ = "indigenous_autism_statistics"
    __table_args__ = {"schema": settings.ibge_data_schema}

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String(255), nullable=False)
    indigenous_population = Column(Integer, nullable=False)
    autism_count = Column(Integer, nullable=False)
    autism_percentage = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)