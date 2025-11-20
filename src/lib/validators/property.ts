// Property validation schemas
import { z } from 'zod'

export const propertySchema = z.object({
  name: z
    .string()
    .min(1, 'Property name is required')
    .max(200, 'Property name must be less than 200 characters'),
  description: z.string().optional(),
  type: z.enum(['APARTMENT', 'HOUSE', 'HOSTEL'], 'Please select a property type'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  ownerId: z.string().min(1, 'Owner ID is required'),
})

export type PropertyFormData = z.infer<typeof propertySchema>
