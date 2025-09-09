import createFetchClient from 'openapi-fetch';
import * as apiTypes from './types';
import createClient from 'openapi-react-query';

// Функция для получения токена
const getToken = () => localStorage.getItem('token');

// Создаем API клиент с динамическим получением токена
export const apiFetch = createFetchClient<apiTypes.paths>({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
});

// Перехватчик запросов для добавления токена
apiFetch.use({
  onRequest({ request }) {
    const token = getToken();
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
});

export const $api = createClient(apiFetch);
