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
    PROFILE: '/admin/profile',
    SETTINGS: '/admin/settings',
    PROPERTIES: {
      INDEX: '/admin/properties',// Alias for backward compatibility
      NEW: '/admin/properties/new',
      DETAIL: '/admin/properties/:id',
      EDIT: '/admin/properties/:id/edit',
    },
    BUILDINGS: {
      INDEX: '/admin/buildings',
      NEW: '/admin/buildings/new',
      DETAIL: '/admin/buildings/:id',
      EDIT: '/admin/buildings/:id/edit',
    },
    UNITS: {
      INDEX: '/admin/units',
      NEW: '/admin/units/new',
      DETAIL: '/admin/units/:id',
      EDIT: '/admin/units/:id/edit',
      PHOTOS: '/admin/units/:id/photos',
    },
    LEASES: {
      INDEX: '/admin/leases',
      NEW: '/admin/leases/new',
      DETAIL: '/admin/leases/:id',
      EDIT: '/admin/leases/:id/edit',
      PENDING: '/admin/leases/pending',
      APPROVE: '/admin/leases/:id/approve',
    },
    TENANTS: {
      INDEX: '/admin/tenants',
      NEW: '/admin/tenants/new',
      DETAIL: '/admin/tenants/:id',
      EDIT: '/admin/tenants/:id/edit',
    },
    INVOICES: {
      INDEX: '/admin/invoices',
      NEW: '/admin/invoices/new',
      DETAIL: '/admin/invoices/:id',
    },
    PAYMENTS: {
      INDEX: '/admin/payments',
      NEW: '/admin/payments/new',
      DETAIL: '/admin/payments/:id',
    },
    MAINTENANCE: {
      INDEX: '/admin/maintenance',
      NEW: '/admin/maintenance/new',
      DETAIL: '/admin/maintenance/:id',
      EDIT: '/admin/maintenance/:id/edit',
      ASSIGN: '/admin/maintenance/:id/assign',
    },
    REPORTS: {
      INDEX: '/admin/reports',
      FINANCIAL: '/admin/reports/financial',
      OCCUPANCY: '/admin/reports/occupancy',
      MAINTENANCE: '/admin/reports/maintenance',
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
