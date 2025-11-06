from collections import Counter
from typing import List

from .schemas import TestResponseItem, TesteTipo


MCHAT_RISK_RULES = {
    "1": "nao",
    "2": "sim",
    "3": "nao",
    "4": "nao",
    "5": "sim",
    "6": "nao",
    "7": "nao",
    "8": "nao",
    "9": "nao",
    "10": "nao",
    "11": "nao",
    "12": "sim",
    "13": "nao",
    "14": "nao",
    "15": "nao",
    "16": "nao",
    "17": "nao",
    "18": "nao",
    "19": "nao",
    "20": "nao",
}


ASSQ_RISK_VALUES = {
    "nao": 0,
    "um_pouco": 1,
    "sim": 2,
}


AQ10_RISK_ITEMS = {
    "1": {"concordo_totalmente", "concordo_um_pouco"},
    "2": {"concordo_totalmente", "concordo_um_pouco"},
    "3": {"discordo_totalmente", "discordo_um_pouco"},
    "4": {"concordo_totalmente", "concordo_um_pouco"},
    "5": {"discordo_totalmente", "discordo_um_pouco"},
    "6": {"discordo_totalmente", "discordo_um_pouco"},
    "7": {"concordo_totalmente", "concordo_um_pouco"},
    "8": {"discordo_totalmente", "discordo_um_pouco"},
    "9": {"discordo_totalmente", "discordo_um_pouco"},
    "10": {"concordo_totalmente", "concordo_um_pouco"},
}


TEST_LABELS = {
    "mchat": "M-CHAT-R/F",
    "assq": "ASSQ",
    "aq10": "AQ-10",
    "ados2": "ADOS-2",
    "adir": "ADI-R",
}


TEST_MAX_QUESTIONS = {
    "mchat": 20,
    "assq": 27,
    "aq10": 10,
    "ados2": 10,
    "adir": 10,
}


def compute_test_score(teste_tipo: TesteTipo, respostas: List[TestResponseItem]) -> tuple[int, str]:
    if teste_tipo == "mchat":
        risco = 0
        for item in respostas:
            expected = MCHAT_RISK_RULES.get(item.pergunta_id)
            if expected and item.resposta.lower() == expected:
                risco += 1
        if risco <= 2:
            classificacao = "Baixo"
        elif risco <= 7:
            classificacao = "Moderado"
        else:
            classificacao = "Alto"
        return risco, classificacao
    if teste_tipo == "assq":
        score = sum(ASSQ_RISK_VALUES.get(item.resposta.lower(), 0) for item in respostas)
        if score <= 12:
            classificacao = "Baixo"
        elif score <= 19:
            classificacao = "Moderado"
        else:
            classificacao = "Alto"
        return score, classificacao
    if teste_tipo == "aq10":
        score = sum(1 for item in respostas if item.resposta.lower() in AQ10_RISK_ITEMS.get(item.pergunta_id, set()))
        classificacao = "Alto" if score >= 6 else "Baixo"
        return score, classificacao
    # For ADOS-2 and ADI-R placeholder with simple yes/no scoring
    score = sum(1 for item in respostas if item.resposta.lower() == "sim")
    classificacao = "Encaminhar" if score >= len(respostas) // 2 else "Observação"
    return score, classificacao


def classify_orientation(classificacao: str, teste_tipo: TesteTipo) -> str:
    if teste_tipo == "mchat":
        if classificacao == "Baixo":
            return "Risco baixo. Reavalie mais tarde."
        if classificacao == "Moderado":
            return "Risco moderado. Aplicar Follow-Up detalhado e considerar encaminhamento."
        return "Risco alto. Encaminhar para avaliação especializada."
    if teste_tipo == "assq":
        if classificacao == "Baixo":
            return "Sem sinais consistentes. Monitorar."
        if classificacao == "Moderado":
            return "Risco moderado. Repetir triagem ou solicitar avaliação complementar."
        return "Risco alto. Encaminhar para avaliação clínica especializada."
    if teste_tipo == "aq10":
        if classificacao == "Alto":
            return "Triagem positiva. Recomenda-se avaliação especializada."
        return "Baixo risco. Avaliação clínica completa apenas se persistirem dúvidas."
    if classificacao in {"Encaminhar", "Alto"}:
        return "Encaminhar para especialista."
    return "Monitoramento recomendado."


def summarize_answers(respostas: List[TestResponseItem]) -> dict[str, int]:
    counter = Counter(item.resposta.lower() for item in respostas)
    return dict(counter)
