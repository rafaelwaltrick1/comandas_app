import axios from 'axios';
import { BASE_URL, TIMEOUT, API_ENDPOINTS } from '../config/apiConfig';

// Extrair apenas endpoints utilizados no service
const { AUTH } = API_ENDPOINTS;

// Criar instância do axios com configurações base
const api = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Serviços genéricos da API
export const apiService = {
    // GET request
    get: async (url, config = {}) => {
        return api.get(url, config);
    },

    // POST request
    post: async (url, data, config = {}) => {
        return api.post(url, data, config);
    },

    // PUT request
    put: async (url, data, config = {}) => {
        return api.put(url, data, config);
    },

    // DELETE request
    delete: async (url, config = {}) => {
        return api.delete(url, config);
    },
};

export default api;

// Interceptor de request para adicionar token nas requisições
// Executado antes de cada requisição
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de response para refresh automático de token
// Executado após cada requisição
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Se o erro for 401 e não for uma tentativa de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = sessionStorage.getItem('refresh_token');
                if (refreshToken) {
                    // Fazer requisição na API para refresh token
                    const response = await api.post(AUTH.REFRESH, {
                        refresh_token: refreshToken,
                    });

                    const {
                        access_token,
                        refresh_token,
                        token_type,
                        expires_in,
                        refresh_expires_in,
                    } = response.data;

                    // Atualizar os dados do token na sessão
                    sessionStorage.setItem('access_token', access_token);
                    sessionStorage.setItem('refresh_token', refresh_token);
                    sessionStorage.setItem('token_type', token_type);
                    sessionStorage.setItem('expires_in', expires_in);
                    sessionStorage.setItem('refresh_expires_in', refresh_expires_in);
                    sessionStorage.setItem('loginRealizado', 'true');

                    // Calcular novo tempo de expiração
                    const now = new Date().getTime();
                    const expiresAt = now + expires_in * 1000;
                    const refreshExpiresAt = now + refresh_expires_in * 1000;
                    sessionStorage.setItem('expires_at', expiresAt);
                    sessionStorage.setItem('refresh_expires_at', refreshExpiresAt);

                    // Refazer a requisição original com novo token
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Se o refresh falhar, limpar sessão e redirecionar para login
                sessionStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        } else {
            // Outros erros da API (400, 403, 404, 500)
            const errorMessage =
                error.response?.data?.detail ||
                error.message ||
                'Erro desconhecido';

            // Adicionar a mensagem de erro ao objeto error para uso posterior
            error.apiMessage = errorMessage;
        }

        return Promise.reject(error);
    }
);