// Building validation schemas
import { z } from 'zod'

export const buildingSchema = z.object({
  name: z.string().min(1, 'Building name is required'),
  propertyId: z.string().min(1, 'Property is required'),
  floors: z.number().optional(),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().default('Nigeria'),
    longitude: z.number().optional(),
    latitude: z.number().optional(),
  }),
})

export type BuildingFormData = z.infer<typeof buildingSchema>
