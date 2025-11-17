// Application routes
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',

  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PROPERTIES: {
      LIST: '/admin/properties',
      NEW: '/admin/properties/new',
      DETAIL: '/admin/properties/:id',
      EDIT: '/admin/properties/:id/edit',
    },
    TENANTS: {
      LIST: '/admin/tenants',
      NEW: '/admin/tenants/new',
      DETAIL: '/admin/tenants/:id',
      EDIT: '/admin/tenants/:id/edit',
    },
    PAYMENTS: {
      LIST: '/admin/payments',
      NEW: '/admin/payments/new',
      DETAIL: '/admin/payments/:id',
    },
    MAINTENANCE: {
      LIST: '/admin/maintenance',
      NEW: '/admin/maintenance/new',
      DETAIL: '/admin/maintenance/:id',
      EDIT: '/admin/maintenance/:id/edit',
    },
    REPORTS: {
      FINANCIAL: '/admin/reports/financial',
      OCCUPANCY: '/admin/reports/occupancy',
      MAINTENANCE: '/admin/reports/maintenance',
    },
    SETTINGS: {
      USERS: '/admin/settings/users',
      ROLES: '/admin/settings/roles',
      EMAIL_TEMPLATES: '/admin/settings/email-templates',
      GENERAL: '/admin/settings/general',
    },
  },

  // User (Tenant) routes
  USER: {
    DASHBOARD: '/user/dashboard',
    LEASE: '/user/lease',
    PAYMENTS: {
      HISTORY: '/user/payments',
      NEW: '/user/payments/new',
    },
    MAINTENANCE: {
      LIST: '/user/maintenance',
      NEW: '/user/maintenance/new',
      DETAIL: '/user/maintenance/:id',
    },
    PROFILE: '/user/profile',
  },

  // Shared routes (all authenticated users)
  SHARED: {
    PROFILE: '/profile',
    NOTIFICATIONS: '/notifications',
    HELP: '/help',
  },
} as const

// Helper function to build dynamic routes
export const buildRoute = (route: string, params: Record<string, string | number>): string => {
  let builtRoute = route
  Object.entries(params).forEach(([key, value]) => {
    builtRoute = builtRoute.replace(`:${key}`, String(value))
  })
  return builtRoute
}

// Example usage:
// buildRoute(ROUTES.ADMIN.PROPERTIES.DETAIL, { id: '123' }) => '/admin/properties/123'
