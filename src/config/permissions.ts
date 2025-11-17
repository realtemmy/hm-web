// Permission configuration
import type { UserRole } from '@/types'

export type Resource = 'properties' | 'buildings' | 'units' | 'leases' | 'invoices' | 'payments' | 'maintenance' | 'reports'
export type Action = 'view' | 'create' | 'update' | 'delete' | 'approve'
export type Scope = 'all' | 'own'

export interface Permission {
  actions: Action[]
  scope: Scope
}

export type RolePermissions = Record<Resource, Permission>

export const ROLE_PERMISSIONS: Record<UserRole, Partial<RolePermissions>> = {
  ADMIN: {
    properties: { actions: ['view', 'create', 'update', 'delete'], scope: 'all' },
    buildings: { actions: ['view', 'create', 'update', 'delete'], scope: 'all' },
    units: { actions: ['view', 'create', 'update', 'delete'], scope: 'all' },
    leases: { actions: ['view', 'create', 'update', 'delete', 'approve'], scope: 'all' },
    invoices: { actions: ['view', 'create', 'update', 'delete'], scope: 'all' },
    payments: { actions: ['view', 'create', 'update', 'delete'], scope: 'all' },
    maintenance: { actions: ['view', 'create', 'update', 'delete'], scope: 'all' },
    reports: { actions: ['view', 'create'], scope: 'all' },
  },
  USER: {
    properties: { actions: ['view'], scope: 'all' }, // Can browse all properties
    units: { actions: ['view'], scope: 'all' }, // Can browse all available units
    leases: { actions: ['view', 'create'], scope: 'own' }, // Apply for lease, view own leases
    invoices: { actions: ['view'], scope: 'own' }, // View own invoices
    payments: { actions: ['view', 'create'], scope: 'own' }, // View history, make payments
    maintenance: { actions: ['view', 'create'], scope: 'own' }, // Submit and view own requests
  },
}

// Helper function to check if a user has a specific permission
export const hasPermission = (
  role: UserRole,
  resource: Resource,
  action: Action
): boolean => {
  const rolePermission = ROLE_PERMISSIONS[role]
  const resourcePermission = rolePermission?.[resource]

  if (!resourcePermission) {
    return false
  }

  return resourcePermission.actions.includes(action)
}

// Helper function to get permission scope
export const getPermissionScope = (
  role: UserRole,
  resource: Resource
): Scope | null => {
  const rolePermission = ROLE_PERMISSIONS[role]
  const resourcePermission = rolePermission?.[resource]

  return resourcePermission?.scope ?? null
}

// Helper function to check if user can access a specific resource
export const canAccessResource = (
  role: UserRole,
  resource: Resource
): boolean => {
  return !!ROLE_PERMISSIONS[role]?.[resource]
}
