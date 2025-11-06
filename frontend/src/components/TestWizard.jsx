import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { useMutation } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi';

const TESTS = {
  mchat: {
    title: 'M-CHAT-R/F (16 a 30 meses)',
    faixa: '16-30 meses',
    regiao: 'Sudeste',
    questions: [
      'Quando você aponta algo, a criança acompanha com o olhar?',
      'Você já suspeitou que ele(a) pudesse ser surdo?',
      'Ele(a) participa de brincadeiras de faz-de-conta?',
      'Costuma explorar móveis e escadas?',
      'Faz movimentos repetitivos com os dedos próximos aos olhos?',
      'Aponta para pedir ajuda?',
      'Aponta para compartilhar algo interessante?',
      'Demonstra interesse por outras crianças?',
      'Traz objetos apenas para compartilhar?',
      'Responde quando é chamado pelo nome?'
    ],
    options: [
      { value: 'sim', label: 'Sim' },
      { value: 'nao', label: 'Não' }
    ]
  },
  assq: {
    title: 'ASSQ (6 a 17 anos)',
    faixa: '6-17 anos',
    regiao: 'Sudeste',
    questions: [
      'Tem dificuldade para fazer amigos?',
      'Prefere brincar sozinho?',
      'Usa linguagem muito formal?',
      'Fala longamente sobre um único tema?',
      'Tem reações fortes a ruídos?',
      'Mostra movimentos repetitivos?',
      'Demonstra pouca empatia?',
      'Evita contato visual?',
      'Necessita de rotinas rígidas?',
      'Interesses intensos e restritos?'
    ],
    options: [
      { value: 'nao', label: 'Não' },
      { value: 'um_pouco', label: 'Um pouco' },
      { value: 'sim', label: 'Sim' }
    ]
  },
  aq10: {
    title: 'AQ-10 (Adultos)',
    faixa: 'Adultos',
    regiao: 'Sudeste',
    questions: [
      'Você repara em detalhes que outros não percebem?',
      'Prefere fazer as coisas sempre da mesma maneira?',
      'Acha fácil inventar histórias?',
      'Percebe mudanças pequenas em um ambiente?',
      'Geralmente se concentra mais em pessoas do que objetos?',
      'Acha fácil manter uma conversa?',
      'Gosta de planejar tudo com antecedência?',
      'Entende rapidamente o que os outros estão pensando?',
      'É fácil imaginar como alguém se sente em uma história?',
      'Interessa-se intensamente por tópicos específicos?'
    ],
    options: [
      { value: 'concordo_totalmente', label: 'Concordo totalmente' },
      { value: 'concordo_um_pouco', label: 'Concordo um pouco' },
      { value: 'discordo_um_pouco', label: 'Discordo um pouco' },
      { value: 'discordo_totalmente', label: 'Discordo totalmente' }
    ]
  }
};

const orientationMessage = (classificacao) => {
  if (['Alto', 'Encaminhar'].includes(classificacao)) {
    return 'Procure acompanhamento especializado. Esta triagem não substitui avaliação clínica completa.';
  }
  if (['Moderado'].includes(classificacao)) {
    return 'Risco moderado. Repita a triagem ou solicite orientação profissional.';
  }
  return 'Sem recomendações adicionais no momento.';
};

export const TestWizard = ({ cpf, onClose }) => {
  const [currentTest, setCurrentTest] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useApi();

  const handleSelectTest = (testKey) => {
    setCurrentTest(testKey);
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setErrorMessage(null);
  };

  const handleAnswer = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStep]: value
    }));
    setErrorMessage(null);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const testData = TESTS[currentTest];
      const payload = {
        teste_tipo: currentTest,
        faixa_etaria: testData.faixa,
        regiao_geografica: testData.regiao,
        respostas: testData.questions.map((question, index) => ({
          pergunta_id: String(index + 1),
          resposta: answers[index] ?? ''
        }))
      };
      const response = await api.post(`/api/v1/tests/${cpf}/iniciar`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      setErrorMessage(null);
      setResult({
        ...data.resultado,
        orientacao: data.mensagem_orientacao || orientationMessage(data.resultado.classificacao)
      });
    },
    onError: () => {
      setErrorMessage('Não foi possível registrar o teste. Verifique os dados do CPF e tente novamente.');
    }
  });

  const testData = useMemo(() => (currentTest ? TESTS[currentTest] : null), [currentTest]);
  const currentQuestion = testData?.questions[currentStep];

  const readyToSubmit = testData && Object.keys(answers).length === testData.questions.length;

  return (
    <div className="section" id="tests-flow">
      <div className="container">
        {!currentTest && (
          <div className="test-view" aria-live="polite">
            <h2>Selecione o questionário</h2>
            <p>Escolha a faixa etária para iniciar a triagem.</p>
            <div className="test-options">
              {Object.entries(TESTS).map(([key, value]) => (
                <button key={key} className="test-button" onClick={() => handleSelectTest(key)}>
                  <strong>{value.title}</strong>
                  <span style={{ display: 'block', fontSize: '0.9rem', marginTop: '0.25rem', color: '#4b5563' }}>
                    {value.questions.length} perguntas
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentTest && !result && (
          <div className="test-view">
            <div className="progress-indicator">
              Pergunta {currentStep + 1} de {testData.questions.length}
            </div>
            {errorMessage && <div className="alert alert-error">{errorMessage}</div>}
            <h3>{testData.title}</h3>
            <p style={{ margin: '1.5rem 0', fontSize: '1.1rem', color: '#111827' }}>{currentQuestion}</p>
            <div className="test-options" role="radiogroup">
              {testData.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={classNames('test-button', {
                    active: answers[currentStep] === option.value
                  })}
                  onClick={() => handleAnswer(option.value)}
                  aria-pressed={answers[currentStep] === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="test-navigation">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                disabled={currentStep === 0}
              >
                Voltar
              </button>
              {currentStep + 1 === testData.questions.length ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!readyToSubmit || mutation.isLoading}
                  onClick={() => mutation.mutate()}
                >
                  {mutation.isLoading ? 'Enviando...' : 'Enviar respostas'}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setCurrentStep((prev) => Math.min(prev + 1, testData.questions.length - 1))}
                  disabled={!answers[currentStep]}
                >
                  Próxima
                </button>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="test-view">
            <h3>Resultado da triagem</h3>
            <p style={{ marginTop: '1rem' }}>
              <strong>Classificação:</strong> {result.classificacao}
            </p>
            <p>
              <strong>Pontuação:</strong> {result.score}
            </p>
            <p style={{ margin: '1.25rem 0', color: '#0f172a' }}>{result.orientacao}</p>
            <button className="btn btn-primary" type="button" onClick={() => onClose(result)}>
              Concluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
