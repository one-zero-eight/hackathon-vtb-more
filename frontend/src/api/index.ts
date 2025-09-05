import createFetchClient from 'openapi-fetch';
import * as apiTypes from './types';
import createClient from 'openapi-react-query';

export const apiFetch = createFetchClient<apiTypes.paths>({
  baseUrl: import.meta.env.VITE_API_URL,
});

export const $api = createClient(apiFetch);
