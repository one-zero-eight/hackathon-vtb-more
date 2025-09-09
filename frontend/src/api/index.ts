import createFetchClient from 'openapi-fetch';
import * as apiTypes from './types';
import createClient from 'openapi-react-query';

export const apiFetch = createFetchClient<apiTypes.paths>({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
});

// Add request interceptor to dynamically get token
apiFetch.use({
  onRequest({ request }) {
    const token = localStorage.getItem('token');
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
});

export const $api = createClient(apiFetch);
