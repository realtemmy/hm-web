// Property validation schemas
import { z } from 'zod'

export const propertySchema = z.object({
  title: z
    .string()
    .min(1, 'Property title is required')
    .max(200, 'Property title must be less than 200 characters'),
  description: z.string().optional(),
  type: z.enum(['APARTMENT', 'HOUSE', 'HOSTEL'], 'Please select a property type'),
  ownerId: z.string().min(1, 'Owner ID is required'),
})

export type PropertyFormData = z.infer<typeof propertySchema>
