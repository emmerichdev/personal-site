const isDev = import.meta.env.DEV;

export const apiBaseUrl = import.meta.env.VITE_API_BASE ?? '/api';

export const isLocalMode =
  isDev && (import.meta.env.VITE_LOCAL_MODE === 'true' || import.meta.env.VITE_LOCAL_MODE === '1');

