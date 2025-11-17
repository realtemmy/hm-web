// Maintenance request validation schemas
import { z } from 'zod'

export const maintenanceRequestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  unitId: z.string().min(1, 'Unit is required'),
  priority: z.number().min(1).max(5).optional(),
})

export type MaintenanceRequestFormData = z.infer<typeof maintenanceRequestSchema>

// Maintenance note schema
export const maintenanceNoteSchema = z.object({
  requestId: z.string().min(1, 'Request is required'),
  body: z.string().min(1, 'Note content is required'),
})

export type MaintenanceNoteFormData = z.infer<typeof maintenanceNoteSchema>
