// Environment configuration
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  appName: import.meta.env.VITE_APP_NAME || 'Housing Management System',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  tokenExpiryMinutes: Number(import.meta.env.VITE_TOKEN_EXPIRY_MINUTES) || 15,
  refreshTokenExpiryDays: Number(import.meta.env.VITE_REFRESH_TOKEN_EXPIRY_DAYS) || 7,
  enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  env: import.meta.env.VITE_ENV || 'development',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const
