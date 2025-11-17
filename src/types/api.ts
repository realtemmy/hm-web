// API request and response types
// import type { Property, Tenant, Payment, MaintenanceRequest } from './models'

// Generic API Response
export interface ApiResponse<T> {
  data: T
  message?: string
}

// Pagination
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

// Property API Types
export interface PropertyFilters extends PaginationParams {
  search?: string
  status?: string
  type?: string
}

export interface CreatePropertyInput {
  name: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  type: string
  status: string
  units: number
  rentAmount: number
  description: string
  amenities: string[]
  managerId: string
}

export interface UpdatePropertyInput extends Partial<CreatePropertyInput> {}

// Tenant API Types
export interface TenantFilters extends PaginationParams {
  search?: string
  status?: string
  propertyId?: string
}

export interface CreateTenantInput {
  userId: string
  propertyId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  leaseStartDate: string
  leaseEndDate: string
  rentAmount: number
  depositAmount: number
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

export interface UpdateTenantInput extends Partial<CreateTenantInput> {
  status?: string
}

// Payment API Types
export interface PaymentFilters extends PaginationParams {
  status?: string
  tenantId?: string
  propertyId?: string
  startDate?: string
  endDate?: string
}

export interface CreatePaymentInput {
  tenantId: string
  propertyId: string
  amount: number
  paymentDate: string
  dueDate: string
  paymentMethod: string
  notes?: string
}

export interface ProcessPaymentInput extends CreatePaymentInput {
  gatewayData?: Record<string, any>
}

// Maintenance API Types
export interface MaintenanceFilters extends PaginationParams {
  status?: string
  priority?: string
  propertyId?: string
  tenantId?: string
}

export interface CreateMaintenanceInput {
  tenantId: string
  propertyId: string
  title: string
  description: string
  category: string
  priority: string
}

export interface UpdateMaintenanceInput extends Partial<CreateMaintenanceInput> {
  status?: string
  assignedTo?: string
  estimatedCost?: number
  actualCost?: number
  scheduledDate?: string
  completedDate?: string
}

export interface UpdateMaintenanceStatusInput {
  status: string
  notes?: string
}

export interface AddMaintenanceCommentInput {
  comment: string
}

// Report API Types
export interface FinancialReportParams {
  startDate?: string
  endDate?: string
  propertyId?: string
}

export interface OccupancyReportParams {
  date?: string
}

export interface MaintenanceReportParams {
  startDate?: string
  endDate?: string
  status?: string
}

export interface ExportParams {
  type: string
  format: 'csv' | 'pdf'
  startDate?: string
  endDate?: string
}

// User Management API Types
export interface UserFilters extends PaginationParams {
  role?: string
}

export interface CreateUserInput {
  email: string
  password: string
  name: string
  role: string
}

export interface UpdateUserInput extends Partial<Omit<CreateUserInput, 'password'>> {}

export interface UpdateUserRoleInput {
  role: string
}

// Error Response
export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface ApiErrorResponse {
  error: ApiError
}
