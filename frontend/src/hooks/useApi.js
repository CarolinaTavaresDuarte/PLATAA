import axios from 'axios';
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const useApi = () => {
  const authContext = useAuth();
  const token = authContext ? authContext.token : null;

  const client = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      // 1. ANEXA O TOKEN DIRETAMENTE NO CABEÇALHO NA CRIAÇÃO DA INSTÂNCIA
      headers: {
        'Authorization': token ? `Bearer ${token}` : '', 
        'Content-Type': 'application/json',
      },
    });

    // Removemos o interceptor, pois o useMemo já garante o token atualizado.
    return instance;
  }, [token]); // 2. A dependência [token] RECRIA a instância quando o token muda.

  return {
    get: async (url, config = {}) => {
     const response = await client.get(url, config);
      return response.data;
    },
    post: (url, data, config) => client.post(url, data, config),
    put: (url, data, config) => client.put(url, data, config),
    delete: (url, config) => client.delete(url, config),
  };
};