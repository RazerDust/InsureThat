// Vite exposes browser-safe environment variables on import.meta.env.
// VITE_API_BASE_URL can point the frontend at a local or deployed API.
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  isDevelopment: import.meta.env.DEV,
} as const
