import { z } from 'zod';

const phoneRegex = /^[6-9][0-9]{9}$/;

export const createDeliveryPartnerSchema = z.object({
  first_name: z
    .string({ error: 'First name is required' })
    .trim()
    .min(1, 'First name cannot be empty')
    .max(100, 'First name cannot exceed 100 characters'),
  middle_name: z
    .string({ error: 'Middle name is required' })
    .trim()
    .max(100, 'Middle name cannot exceed 100 characters'),
  last_name: z
    .string({ error: 'Last name is required' })
    .trim()
    .max(100, 'Last name cannot exceed 100 characters'),
  phone: z
    .string({ error: 'Phone number is required' })
    .trim()
    .regex(phoneRegex, 'Phone number must be a 10-digit number starting with 6, 7, 8, or 9'),
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .max(250, 'Email cannot exceed 250 characters')
    .email('Invalid email address'),
});

export type CreateDeliveryPartnerFormValues = z.infer<typeof createDeliveryPartnerSchema>;

export const updateDeliveryPartnerSchema = createDeliveryPartnerSchema;
export type UpdateDeliveryPartnerFormValues = z.infer<typeof updateDeliveryPartnerSchema>;

export const assignShipmentsSchema = z.object({
  shipment_ids: z
    .array(z.coerce.number().int().positive())
    .min(1, 'Please select at least one shipment'),
});

export type AssignShipmentsFormValues = z.infer<typeof assignShipmentsSchema>;