// Unit validation schemas
import { z } from 'zod'

export const unitSchema = z.object({
  unitNumber: z.string().min(1, 'Unit number is required'),
  propertyId: z.string().min(1, 'Property is required'),
  buildingId: z.string().optional(),
  floor: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  sqft: z.number().optional(),
  rentAmount: z.number().min(0, 'Rent amount must be positive'),
  depositAmount: z.number().optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'], 'Status is required'),
})

export type UnitFormData = z.infer<typeof unitSchema>
