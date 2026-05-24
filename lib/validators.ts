import { z } from 'zod'

export const ShieldIdSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^SH-(20\d{2})-[A-Z]{3}$/, 'Use format SH-YYYY-XXX')

export const TrackingIdSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^TRK-(20\d{2})-[A-Z0-9]{3}$/, 'Use format TRK-2025-XYZ')

export const ContactSchema = z.object({
  name: z.string().trim().min(3, 'Please enter your full name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  message: z.string().trim().min(10, 'Please share more details.'),
})

export type ContactPayload = z.infer<typeof ContactSchema>
