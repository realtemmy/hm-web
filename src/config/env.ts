// Environment configuration
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3300/api/',
  appName: import.meta.env.VITE_APP_NAME || 'Housing Management System',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  tokenExpiryMinutes: Number(import.meta.env.VITE_ACCESS_TOKEN) || 10,
  refreshTokenExpiryDays: Number(import.meta.env.VITE_REFRESH_TOKEN) || 24,
  enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  env: import.meta.env.VITE_ENV || 'development',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const
