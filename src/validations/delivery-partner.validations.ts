import { z } from 'zod';

const phoneRegex = /^[6-9][0-9]{9}$/;

export const createDeliveryPartnerSchema = z.object({
  first_name: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return 'First name is required';
        if (issue.code === 'invalid_type') return 'First name must be a string';
        return 'Invalid first name';
      },
    })
    .trim()
    .min(1, 'First name cannot be empty')
    .max(100, 'First name cannot exceed 100 characters'),
  middle_name: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return 'Middle name is required';
        if (issue.code === 'invalid_type') return 'Middle name must be a string';
        return 'Invalid middle name';
      },
    })
    .trim()
    .max(100, 'Middle name cannot exceed 100 characters'),
  last_name: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return 'Last name is required';
        if (issue.code === 'invalid_type') return 'Last name must be a string';
        return 'Invalid last name';
      },
    })
    .trim()
    .max(100, 'Last name cannot exceed 100 characters'),
  phone: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return 'Phone number is required';
        if (issue.code === 'invalid_type') return 'Phone number must be a string';
        return 'Invalid phone number';
      },
    })
    .trim()
    .regex(phoneRegex, 'Phone number must be a 10-digit number starting with 6, 7, 8, or 9'),
  email: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return 'Email is required';
        if (issue.code === 'invalid_type') return 'Email must be a string';
        return 'Invalid email address';
      },
    })
    .trim()
    .max(250, 'Email cannot exceed 250 characters')
    .check(
      z.email({
        error: (issue) => {
          if (issue.code === 'invalid_format') {
            return 'Invalid email address';
          }
        },
      }),
    ),
});

export type CreateDeliveryPartnerFormValues = z.infer<typeof createDeliveryPartnerSchema>;

export const updateDeliveryPartnerSchema = createDeliveryPartnerSchema;
export type UpdateDeliveryPartnerFormValues = z.infer<typeof updateDeliveryPartnerSchema>;

export const assignShipmentsSchema = z.object({
  shipment_ids: z
    .array(
      z.coerce
        .number({
          error: (issue) => {
            if (issue.input === undefined) return 'Shipment ID is required';
            if (issue.code === 'invalid_type') return 'Shipment ID must be a number';
            return 'Invalid shipment ID';
          },
        })
        .int('Shipment ID must be a valid integer')
        .positive('Shipment ID must be a positive number'),
    )
    .min(1, 'Please select at least one shipment'),
});

export type AssignShipmentsFormValues = z.infer<typeof assignShipmentsSchema>;