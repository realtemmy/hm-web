// Property validation schemas
import { z } from 'zod'

export const propertySchema = z.object({
  title: z
    .string()
    .min(1, 'Property title is required')
    .max(200, 'Property title must be less than 200 characters'),
  description: z.string().optional(),
  type: z.enum(['APARTMENT', 'HOUSE', 'HOSTEL'], 'Property type is required'),
  isActive: z.boolean().default(true),
})

export type PropertyFormData = z.infer<typeof propertySchema>
