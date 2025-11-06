import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi';

export const PatientDashboard = ({ cpf }) => {
  const api = useApi();
  const { data } = useQuery({
    queryKey: ['patient-dashboard', cpf],
    queryFn: async () => {
      const response = await api.get(`/api/v1/tests/paciente/${cpf}`);
      return response.data;
    },
    enabled: Boolean(cpf)
  });

  if (!cpf) {
    return null;
  }

  return (
    <section className="section" id="dashboard-paciente">
      <div className="container">
        <h2 className="section-title">Seus resultados</h2>
        <p className="section-subtitle">
          Acompanhe as triagens realizadas e veja como os dados são usados de forma anônima para pesquisas.
        </p>
        <div className="dashboard-grid">
          {(data?.cards || []).map((card) => (
            <article key={`${card.teste_tipo}-${card.data}`} className="dashboard-card">
              <h3>{card.teste_tipo.toUpperCase()}</h3>
              <p style={{ margin: '0.75rem 0', fontWeight: 600 }}>Risco: {card.risco}</p>
              <time dateTime={card.data}>{new Date(card.data).toLocaleDateString('pt-BR')}</time>
            </article>
          ))}
          {!data?.cards?.length && (
            <article className="dashboard-card">
              <h3>Sem triagens ainda</h3>
              <p style={{ marginTop: '0.75rem', lineHeight: 1.6 }}>
                Quando você concluir um questionário, os resultados ficarão disponíveis aqui com orientações personalizadas.
              </p>
            </article>
          )}
          {data?.transparencia_ibge?.length ? (
            <article className="dashboard-card">
              <h3>Transparência IBGE</h3>
              <ul style={{ marginTop: '0.75rem', lineHeight: 1.6 }}>
                {data.transparencia_ibge.map((info) => (
                  <li key={info}>{info}</li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export const SpecialistDashboard = () => {
  const api = useApi();
  const { data } = useQuery({
    queryKey: ['specialist-dashboard'],
    queryFn: async () => {
      const response = await api.get('/api/v1/tests/especialista/dashboard');
      return response.data;
    }
  });

  const totalCases = useMemo(() => {
    if (!data?.totais_por_risco) return 0;
    return Object.values(data.totais_por_risco).reduce((acc, value) => acc + value, 0);
  }, [data]);

  return (
    <section className="section" id="dashboard-especialista">
      <div className="container">
        <h2 className="section-title">Carteira de casos</h2>
        <p className="section-subtitle">
          Visualize rapidamente o panorama dos pacientes triados e acesse filtros estratégicos para tomada de decisão.
        </p>
        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          {Object.entries(data?.totais_por_risco || {}).map(([key, value]) => (
            <article key={key} className="dashboard-card">
              <h3>{key}</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 700 }}>{value}</p>
            </article>
          ))}
          <article className="dashboard-card">
            <h3>Total de casos</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 700 }}>{totalCases}</p>
          </article>
        </div>
        <div className="card" style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <label htmlFor="filtro-regiao" style={{ fontWeight: 600 }}>Filtro por região</label>
              <select id="filtro-regiao" style={{ marginLeft: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }}>
                <option>Sudeste</option>
                <option>Nordeste</option>
                <option>Sul</option>
                <option>Centro-Oeste</option>
              </select>
            </div>
            <div>
              <label htmlFor="filtro-risco" style={{ fontWeight: 600 }}>Filtro por risco</label>
              <select id="filtro-risco" style={{ marginLeft: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }}>
                <option>Todos</option>
                <option>Baixo</option>
                <option>Moderado</option>
                <option>Alto</option>
              </select>
            </div>
            <button className="btn btn-outline" type="button">Exportar lista (CSV)</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                <th>Nome</th>
                <th>Faixa etária</th>
                <th>Região/Bairro</th>
                <th>Contato</th>
                <th>Risco</th>
                <th>Teste</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {(data?.pacientes || []).map((item) => (
                <tr key={`${item.nome_completo}-${item.data}`} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td>{item.nome_completo}</td>
                  <td>{item.faixa_etaria}</td>
                  <td>{item.regiao_bairro}</td>
                  <td>{item.contato_principal}</td>
                  <td>{item.risco}</td>
                  <td>{item.teste_tipo.toUpperCase()}</td>
                  <td>{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
