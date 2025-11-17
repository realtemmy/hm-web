// Payment validation schemas
import { z } from 'zod'

export const paymentSchema = z.object({
  leaseId: z.string().optional(),
  invoiceId: z.string().optional(),
  amount: z.number().min(0, 'Amount must be positive'),
  method: z.string().optional(),
  currency: z.string().default('NGN'),
})

export type PaymentFormData = z.infer<typeof paymentSchema>
