import { z } from 'zod';
import { BOX_WEIGHT_UNIT, COUNTRY, PAYMENT_MODE, SHIPPING_MODE } from '@/constants/enums';

const phoneRegex = /^[6-9][0-9]{9}$/;
const pincodeRegex = /^[0-9]{6}$/;
const nameRegex = /^[a-zA-Z ]+$/;

export const createShipmentSchema = z
  .object({
    consignor_name: z
      .string({ error: 'Consignor name is required' })
      .trim()
      .min(3, 'Consignor name must be at least 3 characters long')
      .max(100, 'Consignor name must be at most 100 characters long')
      .regex(nameRegex, 'Consignor name can only have alphabets and spaces'),
    consignor_phone: z
      .string({ error: 'Consignor phone is required' })
      .trim()
      .length(10, 'Consignor phone must be 10 digits long')
      .regex(phoneRegex, 'Consignor phone must be a valid Indian phone number starting with 6, 7, 8, or 9'),
    consignor_email: z
      .string({ error: 'Consignor email is required' })
      .trim()
      .max(250, 'Consignor email cannot be longer than 250 characters')
      .email('Please provide a valid consignor email address'),
    consignor_address: z
      .string({ error: 'Consignor address is required' })
      .trim()
      .min(10, 'Consignor address must be at least 10 characters long')
      .max(200, 'Consignor address cannot be longer than 200 characters'),
    consignor_pincode: z
      .string({ error: 'Consignor pincode is required' })
      .trim()
      .length(6, 'Consignor pincode must be 6 digits long')
      .regex(pincodeRegex, 'Consignor pincode must be a 6 digit number'),
    consignor_city: z
      .string({ error: 'Consignor city is required' })
      .trim()
      .min(2, 'Consignor city must be at least 2 characters long')
      .max(50, 'Consignor city cannot be longer than 50 characters'),
    consignor_state: z
      .string({ error: 'Consignor state is required' })
      .trim()
      .min(2, 'Consignor state must be at least 2 characters long')
      .max(50, 'Consignor state cannot be longer than 50 characters'),
    consignor_country: z.literal(COUNTRY.INDIA, { error: 'Consignor country is required' }),

    return_address: z.string().trim().max(200, 'Return address cannot be longer than 200 characters').or(z.literal('')),
    return_pincode: z
      .string()
      .trim()
      .length(6, 'Return pincode must be 6 digits long')
      .regex(pincodeRegex, 'Return pincode must be a 6 digit number')
      .or(z.literal('')),
    return_city: z.string().trim().max(50, 'Return city cannot be longer than 50 characters').or(z.literal('')),
    return_state: z.string().trim().max(50, 'Return state cannot be longer than 50 characters').or(z.literal('')),
    return_country: z.literal(COUNTRY.INDIA, { error: 'Return country is required' }).or(z.literal('')),

    consignee_name: z
      .string({ error: 'Consignee name is required' })
      .trim()
      .min(2, 'Consignee name must be at least 2 characters long')
      .max(100, 'Consignee name cannot be longer than 100 characters'),
    consignee_phone: z
      .string({ error: 'Consignee phone is required' })
      .trim()
      .length(10, 'Consignee phone must be 10 digits long')
      .regex(phoneRegex, 'Consignee phone must be a 10 digit number starting with 6, 7, 8, or 9'),
    consignee_email: z
      .string({ error: 'Consignee email is required' })
      .trim()
      .max(250, 'Consignee email cannot be longer than 250 characters')
      .email('Please provide a valid consignee email address'),
    consignee_address: z
      .string({ error: 'Consignee address is required' })
      .trim()
      .min(10, 'Consignee address must be at least 10 characters long')
      .max(200, 'Consignee address cannot be longer than 200 characters'),
    consignee_pincode: z
      .string({ error: 'Consignee pincode is required' })
      .trim()
      .length(6, 'Consignee pincode must be 6 digits long')
      .regex(pincodeRegex, 'Consignee pincode must be a 6 digit number'),
    consignee_city: z
      .string({ error: 'Consignee city is required' })
      .trim()
      .min(2, 'Consignee city must be at least 2 characters long')
      .max(50, 'Consignee city cannot be longer than 50 characters'),
    consignee_state: z
      .string({ error: 'Consignee state is required' })
      .trim()
      .min(2, 'Consignee state must be at least 2 characters long')
      .max(50, 'Consignee state cannot be longer than 50 characters'),
    consignee_country: z.literal(COUNTRY.INDIA, { error: 'Consignee country is required' }),

    return_same_as_pickup: z.boolean(),
    billing_same_as_pickup: z.boolean(),

    billing_address: z.string().trim().max(200, 'Billing address cannot be longer than 200 characters').optional().or(z.literal('')),
    billing_pincode: z
      .string()
      .trim()
      .length(6, 'Billing pincode must be 6 digits long')
      .regex(pincodeRegex, 'Billing pincode must be a 6 digit number')
      .optional()
      .or(z.literal('')),
    billing_city: z.string().trim().max(50, 'Billing city cannot be longer than 50 characters').optional().or(z.literal('')),
    billing_state: z.string().trim().max(50, 'Billing state cannot be longer than 50 characters').optional().or(z.literal('')),
    billing_country: z.literal(COUNTRY.INDIA).optional().or(z.literal('')),

    payment_mode: z.enum([PAYMENT_MODE.PREPAID, PAYMENT_MODE.COD], {
      error: 'Payment mode is required',
    }),
    shipping_mode: z.literal(SHIPPING_MODE.SURFACE, { error: 'Shipping mode is required' }),
    cod_amount: z.coerce.number({ error: 'COD amount is required' }),

    box_length: z.coerce
      .number({ error: 'Box length is required' })
      .int('Box length must be an integer')
      .positive('Box length must be greater than 0'),
    box_breadth: z.coerce
      .number({ error: 'Box breadth is required' })
      .int('Box breadth must be an integer')
      .positive('Box breadth must be greater than 0'),
    box_height: z.coerce
      .number({ error: 'Box height is required' })
      .int('Box height must be an integer')
      .positive('Box height must be greater than 0'),
    box_weight: z.coerce.number({ error: 'Box weight is required' }),
    box_weight_unit: z.enum([BOX_WEIGHT_UNIT.GRAM, BOX_WEIGHT_UNIT.KILOGRAM], {
      error: 'Box weight unit is required',
    }),

    item_description: z
      .string({ error: 'Item description is required' })
      .trim()
      .min(1, 'Item description cannot be empty')
      .max(100, 'Item description cannot be longer than 100 characters'),

    shipment_value: z.coerce
      .number({ error: 'Shipment value is required' })
      .positive('Shipment value must be greater than 0')
      .refine((value) => Number.isInteger(value * 100), {
        message: 'Shipment value must have at most 2 decimal places',
      }),

    ewaybill: z
      .string()
      .trim()
      .length(12, 'E-waybill must be 12 digits long')
      .regex(/^[0-9]{12}$/, 'E-waybill must be a 12 digit number')
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.payment_mode === PAYMENT_MODE.COD) {
      if (data.cod_amount <= 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['cod_amount'],
          message: 'COD amount must be greater than 0 for COD shipments',
        });
      }
    }

    if (data.payment_mode === PAYMENT_MODE.PREPAID) {
      if (data.cod_amount !== 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['cod_amount'],
          message: 'COD amount must be 0 for prepaid shipments',
        });
      }
    }

    if (data.shipment_value >= 50000 && !data.ewaybill) {
      ctx.addIssue({
        code: 'custom',
        path: ['ewaybill'],
        message: 'E-waybill is required for shipment value of 50000 or more',
      });
    }

    if (data.box_weight_unit === BOX_WEIGHT_UNIT.GRAM) {
      if (!Number.isInteger(data.box_weight)) {
        ctx.addIssue({
          code: 'custom',
          path: ['box_weight'],
          message: 'Box weight must be an integer when weight unit is grams',
        });
      }
    }

    if (data.box_weight_unit === BOX_WEIGHT_UNIT.KILOGRAM) {
      if (!Number.isInteger(data.box_weight * 1000)) {
        ctx.addIssue({
          code: 'custom',
          path: ['box_weight'],
          message: 'Box weight can have at most 3 decimal places when weight unit is kilograms',
        });
      }
    }

    if (!data.return_same_as_pickup) {
      if (!data.return_address) {
        ctx.addIssue({ code: 'custom', path: ['return_address'], message: 'Return address is required' });
      }
      if (!data.return_pincode) {
        ctx.addIssue({ code: 'custom', path: ['return_pincode'], message: 'Return pincode is required' });
      }
      if (!data.return_city) {
        ctx.addIssue({ code: 'custom', path: ['return_city'], message: 'Return city is required' });
      }
      if (!data.return_state) {
        ctx.addIssue({ code: 'custom', path: ['return_state'], message: 'Return state is required' });
      }
      if (!data.return_country) {
        ctx.addIssue({ code: 'custom', path: ['return_country'], message: 'Return country is required' });
      }
    }

    if (!data.billing_same_as_pickup) {
      if (!data.billing_address) {
        ctx.addIssue({ code: 'custom', path: ['billing_address'], message: 'Billing address is required' });
      }
      if (!data.billing_pincode) {
        ctx.addIssue({ code: 'custom', path: ['billing_pincode'], message: 'Billing pincode is required' });
      }
      if (!data.billing_city) {
        ctx.addIssue({ code: 'custom', path: ['billing_city'], message: 'Billing city is required' });
      }
      if (!data.billing_state) {
        ctx.addIssue({ code: 'custom', path: ['billing_state'], message: 'Billing state is required' });
      }
      if (!data.billing_country) {
        ctx.addIssue({ code: 'custom', path: ['billing_country'], message: 'Billing country is required' });
      }
    }
  });

export type CreateShipmentFormValues = z.infer<typeof createShipmentSchema>;

export const updateShipmentSchema = createShipmentSchema;
export type UpdateShipmentFormValues = z.infer<typeof updateShipmentSchema>;

export const takeNdrActionSchema = z
  .object({
    action: z.enum(['UPDATE ADDRESS', 'REATTEMPT DELIVERY', 'RETURN TO ORIGIN'], {
      error: 'Action is required',
    }),
    consignee_address: z.string().trim().max(200).or(z.literal('')),
    consignee_city: z.string().trim().max(50).or(z.literal('')),
    consignee_state: z.string().trim().max(50).or(z.literal('')),
    consignee_pincode: z.string().trim().max(6).or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.action === 'UPDATE ADDRESS') {
      if (!data.consignee_address || data.consignee_address.length < 10) {
        ctx.addIssue({ code: 'custom', path: ['consignee_address'], message: 'Consignee address must be at least 10 characters long' });
      }
      if (!data.consignee_city || data.consignee_city.length < 2) {
        ctx.addIssue({ code: 'custom', path: ['consignee_city'], message: 'Consignee city is required' });
      }
      if (!data.consignee_state || data.consignee_state.length < 2) {
        ctx.addIssue({ code: 'custom', path: ['consignee_state'], message: 'Consignee state is required' });
      }
      if (!data.consignee_pincode || !pincodeRegex.test(data.consignee_pincode)) {
        ctx.addIssue({ code: 'custom', path: ['consignee_pincode'], message: 'Consignee pincode must be a 6 digit number' });
      }
    }
  });

export type TakeNdrActionFormValues = z.infer<typeof takeNdrActionSchema>;