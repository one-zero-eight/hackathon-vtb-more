import createFetchClient from 'openapi-fetch';
import * as apiTypes from './types';
import createClient from 'openapi-react-query';

const token = localStorage.getItem('token');

export const apiFetch = createFetchClient<apiTypes.paths>({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  headers: {
    Authorization: token ? `bearer ${token}` : undefined,
  },
});

export const $api = createClient(apiFetch);
