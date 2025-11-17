// Invoice validation schemas
import { z } from 'zod'

export const invoiceSchema = z.object({
  leaseId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  amount: z.number().min(0, 'Amount must be positive'),
  dueDate: z.string().optional(),
})

export type InvoiceFormData = z.infer<typeof invoiceSchema>
