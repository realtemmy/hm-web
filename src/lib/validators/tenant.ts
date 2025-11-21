// Tenant validation schemas
import { z } from 'zod'

export const tenantSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  movedInAt: z.string().optional(),
  movedOutAt: z.string().optional(),
  emergencyContact: z.string().optional(),
})

export type TenantFormData = z.infer<typeof tenantSchema>
