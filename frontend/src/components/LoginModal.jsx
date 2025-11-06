import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

const initialState = {
  nome: '',
  email: '',
  senha: '',
  role: 'responsavel'
};

export const LoginModal = ({ onClose }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialState);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const api = useApi();
  const { setToken, setProfile } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const tokenResponse = await api.post('/api/v1/auth/token', new URLSearchParams({
        username: form.email,
        password: form.senha
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      setToken(tokenResponse.data.access_token);
      const profileResponse = await api.get('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
      });
      setProfile(profileResponse.data);
      onClose();
    } catch (error) {
      setFeedback({ type: 'error', message: 'Falha ao autenticar. Verifique os dados.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      await api.post('/api/v1/auth/register', {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        role: form.role
      });
      setFeedback({ type: 'success', message: 'Cadastro realizado! Faça login para continuar.' });
      setMode('login');
    } catch (error) {
      setFeedback({ type: 'error', message: 'Não foi possível realizar o cadastro.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = mode === 'login' ? handleLogin : handleRegister;

  return (
    <div className="login-overlay">
      <div className="login-card" role="dialog" aria-modal="true">
        <div className="login-toggle" role="tablist">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >
            Criar conta
          </button>
        </div>
        {feedback && (
          <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {feedback.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="nome">Nome completo</label>
              <input id="nome" name="nome" type="text" value={form.nome} onChange={handleChange} required />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input id="senha" name="senha" type="password" value={form.senha} onChange={handleChange} required />
          </div>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="role">Perfil de acesso</label>
              <select id="role" name="role" value={form.role} onChange={handleChange}>
                <option value="responsavel">Responsável / Usuário</option>
                <option value="especialista">Especialista</option>
              </select>
            </div>
          )}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>
        <button type="button" className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }} onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};
