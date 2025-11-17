// Lease validation schemas
import { z } from 'zod'

// Lease application schema (for tenants)
export const leaseApplicationSchema = z.object({
  unitId: z.string().min(1, 'Unit is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  emergencyContact: z.string().optional(),
})

export type LeaseApplicationFormData = z.infer<typeof leaseApplicationSchema>

// Lease creation schema (for admins)
export const leaseSchema = z.object({
  unitId: z.string().min(1, 'Unit is required'),
  tenantId: z.string().min(1, 'Tenant is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  rentAmount: z.number().min(0, 'Rent amount must be positive'),
  securityDeposit: z.number().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'TERMINATED', 'EXPIRED'], 'Status is required'),
})

export type LeaseFormData = z.infer<typeof leaseSchema>

// Lease renewal schema
export const leaseRenewalSchema = z.object({
  leaseId: z.string().min(1, 'Lease is required'),
  newStart: z.string().min(1, 'New start date is required'),
  newEnd: z.string().min(1, 'New end date is required'),
  newRent: z.number().optional(),
})

export type LeaseRenewalFormData = z.infer<typeof leaseRenewalSchema>
