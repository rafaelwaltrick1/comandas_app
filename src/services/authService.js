import { API_ENDPOINTS } from '../config/apiConfig';
import api from './api';

const { AUTH } = API_ENDPOINTS; // Extrair apenas endpoints utilizados no service

// Serviços de autenticação
export const authService = {
    // Verificar se usuário está autenticado
    isAuthenticated: () => {
        const token = sessionStorage.getItem('access_token');
        const expiresAt = sessionStorage.getItem('expires_at');

        if (!token || !expiresAt) {
            return false;
        }

        // Verificar se token não expirou
        const now = new Date().getTime();
        return now < parseInt(expiresAt);
    },

    // Verificar se token está próximo de expirar (5 minutos)
    isTokenExpiringSoon: () => {
        const expiresAt = sessionStorage.getItem('expires_at');
        if (!expiresAt) return true;

        const now = new Date().getTime();
        const fiveMinutes = 5 * 60 * 1000; // 5 minutos em ms

        return now > parseInt(expiresAt) - fiveMinutes;
    },

    // Login de usuário na API - obter Token de Acesso
    login: async (cpf, senha) => {
        try {
            const response = await api.post(AUTH.LOGIN, {
                cpf: cpf.replace(/\D/g, ''), // Remove caracteres não numéricos do CPF
                senha: senha,
            });

            const {
                access_token,
                refresh_token,
                token_type,
                expires_in,
                refresh_expires_in,
            } = response.data;

            // Persistir dados na sessionStorage
            sessionStorage.setItem('access_token', access_token);
            sessionStorage.setItem('refresh_token', refresh_token);
            sessionStorage.setItem('token_type', token_type);
            sessionStorage.setItem('expires_in', expires_in);
            sessionStorage.setItem('refresh_expires_in', refresh_expires_in);
            sessionStorage.setItem('loginRealizado', 'true');

            // Calcular tempo de expiração
            const now = new Date().getTime();
            const expiresAt = now + expires_in * 1000;
            const refreshExpiresAt = now + refresh_expires_in * 1000;

            sessionStorage.setItem('expires_at', expiresAt);
            sessionStorage.setItem('refresh_expires_at', refreshExpiresAt);

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Erro ao realizar login',
            };
        }
    },

    // Obtém dados do usuário logado
    getUserData: async () => {
        try {
            const response = await api.get(AUTH.ME);
            return response.data;
        } catch (error) {
            return null;
        }
    },

    // Logout do usuário
    logout: () => {
        sessionStorage.clear();
        window.location.href = '/login';
    },
};

export default api;