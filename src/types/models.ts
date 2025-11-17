// Domain models based on Prisma schema
import type { User } from './auth'

// Property types
export type PropertyType = 'APARTMENT' | 'HOUSE' | 'HOSTEL'

export interface Property {
  id: string
  title: string
  description?: string
  type: PropertyType
  ownerId: string
  owner?: User
  buildings?: Building[]
  units?: Unit[]
  isActive: boolean
  verified: boolean
  createdAt: string
  updatedAt: string
}

// Building and Address
export interface Address {
  id: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  longitude?: number
  latitude?: number
  buildingId: string
}

export interface Building {
  id: string
  name: string
  propertyId: string
  property?: Property
  address?: Address
  floors?: number
  units?: Unit[]
  createdAt: string
  updatedAt: string
}

// Unit types
export type UnitStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED'

export interface Unit {
  id: string
  unitNumber: string
  floor?: number
  bedrooms?: number
  bathrooms?: number
  sqft?: number
  status: UnitStatus
  rentAmount: number
  depositAmount?: number
  propertyId: string
  property?: Property
  buildingId?: string
  building?: Building
  occupantId?: string
  occupant?: User
  photos?: Photo[]
  leases?: Lease[]
  maintenance?: MaintenanceRequest[]
  createdAt: string
  updatedAt: string
}

export interface Photo {
  id: string
  url: string
  caption?: string
  unitId?: string
  createdAt: string
}

// Tenant profile (extended user data)
export interface Tenant {
  id: string
  userId: string
  user?: User
  movedInAt?: string
  movedOutAt?: string
  emergencyContact?: string
  metadata?: any
}

// Lease types
export type LeaseStatus = 'ACTIVE' | 'PENDING' | 'TERMINATED' | 'EXPIRED'

export interface Lease {
  id: string
  unitId: string
  unit?: Unit
  tenantId: string
  tenant?: User
  startDate: string
  endDate: string
  rentAmount: number
  securityDeposit?: number
  status: LeaseStatus
  payments?: Payment[]
  invoices?: Invoice[]
  renewals?: LeaseRenewal[]
  createdAt: string
  updatedAt: string
}

export interface LeaseRenewal {
  id: string
  leaseId: string
  lease?: Lease
  requestedAt: string
  newStart: string
  newEnd: string
  newRent?: number
  approved?: boolean
}

// Payment types
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

export interface Payment {
  id: string
  leaseId?: string
  lease?: Lease
  invoiceId?: string
  invoice?: Invoice
  payerId: string
  payer?: User
  amount: number
  currency: string
  method?: string
  status: PaymentStatus
  transactionRef?: string
  paidAt?: string
  createdAt: string
}

export interface Invoice {
  id: string
  leaseId?: string
  lease?: Lease
  title: string
  description?: string
  amount: number
  dueDate?: string
  status: PaymentStatus
  payments?: Payment[]
  createdAt: string
}

// Maintenance types
export type MaintenanceStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED'

export interface MaintenanceRequest {
  id: string
  title: string
  description?: string
  unitId: string
  unit?: Unit
  requesterId: string
  requester?: User
  assigneeId: string
  assignee?: User
  status: MaintenanceStatus
  priority?: number // 1-5
  requestedAt: string
  resolvedAt?: string
  attachments?: Attachment[]
  notes?: MaintenanceNote[]
}

export interface MaintenanceNote {
  id: string
  requestId: string
  authorId: string
  author?: User
  body: string
  createdAt: string
}

export interface Attachment {
  id: string
  url: string
  filename?: string
  mimeType?: string
  size?: number
  uploadedById: string
  uploadedBy?: User
  maintenanceId?: string
  createdAt: string
}

// Notification
export interface Notification {
  id: string
  userId: string
  user?: User
  title: string
  body?: string
  read: boolean
  data?: any
  createdAt: string
}
