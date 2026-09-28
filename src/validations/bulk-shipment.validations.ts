import { z } from 'zod';
import {
  BOX_WEIGHT_UNIT,
  COUNTRY,
  PAYMENT_MODE,
  SHIPPING_MODE,
} from '@/constants/enums';

const phoneRegex = /^[6-9][0-9]{9}$/;
const pincodeRegex = /^[0-9]{6}$/;

const excelRowSchema = z
  .object({
    // Consignor
    consignor_name: z
      .string({ error: 'Consignor name is required' })
      .trim()
      .min(3, 'Consignor name must be at least 3 characters long')
      .max(100, 'Consignor name must be at most 100 characters long')
      .regex(/^[a-zA-Z ]+$/, 'Consignor name can only have alphabets and spaces'),
    consignor_phone: z
      .string({ error: 'Consignor phone is required' })
      .trim()
      .length(10, 'Consignor phone must be 10 digits long')
      .regex(
        phoneRegex,
        'Consignor phone must be a valid Indian phone number starting with 6, 7, 8, or 9',
      ),
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
    consignor_country: z
      .string({ error: 'Consignor country is required' })
      .trim()
      .pipe(z.enum(Object.values(COUNTRY), { error: 'Invalid consignor country' })),

    // Return address
    return_address: z
      .string()
      .trim()
      .min(10, 'Return address must be at least 10 characters long')
      .max(200, 'Return address cannot be longer than 200 characters')
      .or(z.literal('')),
    return_pincode: z
      .string()
      .length(6, 'Return pincode must be 6 digits long')
      .regex(pincodeRegex, 'Return pincode must be a 6 digit number')
      .or(z.literal('')),
    return_city: z
      .string()
      .trim()
      .min(2, 'Return city must be at least 2 characters long')
      .max(50, 'Return city cannot be longer than 50 characters')
      .or(z.literal('')),
    return_state: z
      .string()
      .trim()
      .min(2, 'Return state must be at least 2 characters long')
      .max(50, 'Return state cannot be longer than 50 characters')
      .or(z.literal('')),
    return_country: z
      .string()
      .trim()
      .pipe(z.enum(Object.values(COUNTRY), { error: 'Invalid return country' }))
      .or(z.literal('')),

    // Consignee
    consignee_name: z
      .string({ error: 'Consignee name is required' })
      .trim()
      .min(2, 'Consignee name must be at least 2 characters long')
      .max(100, 'Consignee name cannot be longer than 100 characters'),
    consignee_phone: z
      .string({ error: 'Consignee phone is required' })
      .trim()
      .length(10, 'Consignee phone must be 10 digits long')
      .regex(
        phoneRegex,
        'Consignee phone must be a 10 digit number starting with 6, 7, 8, or 9',
      ),
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
    consignee_country: z
      .string({ error: 'Consignee country is required' })
      .trim()
      .pipe(
        z.enum(['India'], {
          error: 'Only India is supported as consignee country',
        }),
      ),

    // Flags
    return_same_as_pickup: z.coerce.boolean({
      error: 'Return same as pickup must be TRUE/FALSE or 1/0',
    }),

    // Shipment options
    payment_mode: z
      .string({ error: 'Payment mode is required' })
      .trim()
      .pipe(z.enum(Object.values(PAYMENT_MODE), { error: 'Invalid payment mode' })),
    shipping_mode: z
      .string({ error: 'Shipping mode is required' })
      .trim()
      .pipe(z.enum(Object.values(SHIPPING_MODE), { error: 'Invalid shipping mode' })),
    cod_amount: z.coerce.number({ error: 'COD amount is required' }),

    // Box
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
    box_weight_unit: z
      .string({ error: 'Box weight unit is required' })
      .trim()
      .pipe(
        z.enum(Object.values(BOX_WEIGHT_UNIT), {
          error: 'Invalid box weight unit',
        }),
      ),

    // Item
    item_description: z
      .string({ error: 'Item description is required' })
      .trim()
      .min(1, 'Item description cannot be empty')
      .max(100, 'Item description cannot be longer than 100 characters'),
    shipment_value: z.coerce
      .number({ error: 'Shipment value is required' })
      .positive('Shipment value must be greater than 0')
      .refine((v) => Number.isInteger(v * 100), {
        message: 'Shipment value must have at most 2 decimal places',
      }),
    ewaybill: z
      .string()
      .trim()
      .min(1, 'E-waybill cannot be empty')
      .max(12, 'E-waybill cannot be longer than 12 characters')
      .regex(/^[0-9]{12}$/, 'E-waybill must be a 12 digit number')
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.payment_mode === PAYMENT_MODE.COD && data.cod_amount <= 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['cod_amount'],
        message: 'COD amount must be greater than 0 for COD shipments',
      });
    }
    if (data.payment_mode === PAYMENT_MODE.PREPAID && data.cod_amount !== 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['cod_amount'],
        message: 'COD amount must be 0 for prepaid shipments',
      });
    }

    if (data.shipment_value >= 50000 && !data.ewaybill) {
      ctx.addIssue({
        code: 'custom',
        path: ['ewaybill'],
        message: 'E-waybill is required for shipment value of 50000 or more',
      });
    }

    if (
      data.box_weight_unit === BOX_WEIGHT_UNIT.GRAM &&
      !Number.isInteger(data.box_weight)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['box_weight'],
        message: 'Box weight must be an integer when weight unit is grams',
      });
    }
    if (
      data.box_weight_unit === BOX_WEIGHT_UNIT.KILOGRAM &&
      !Number.isInteger(data.box_weight * 1000)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['box_weight'],
        message:
          'Box weight can have at most 3 decimal places when weight unit is kilograms',
      });
    }

    if (!data.return_same_as_pickup) {
      if (!data.return_address) {
        ctx.addIssue({
          code: 'custom',
          path: ['return_address'],
          message: 'Return address is required',
        });
      }
      if (!data.return_pincode) {
        ctx.addIssue({
          code: 'custom',
          path: ['return_pincode'],
          message: 'Return pincode is required',
        });
      }
      if (!data.return_city) {
        ctx.addIssue({
          code: 'custom',
          path: ['return_city'],
          message: 'Return city is required',
        });
      }
      if (!data.return_state) {
        ctx.addIssue({
          code: 'custom',
          path: ['return_state'],
          message: 'Return state is required',
        });
      }
      if (!data.return_country) {
        ctx.addIssue({
          code: 'custom',
          path: ['return_country'],
          message: 'Return country is required',
        });
      }
    }
  });

export const validateExcelBulkShipmentsSchema = z
  .array(excelRowSchema, { error: 'Excel data must be an array of rows' })
  .min(1, 'Excel file must contain at least one shipment row');

export type ExcelRowBulkShipmentValues = z.infer<typeof excelRowSchema>;
export type ValidateExcelBulkShipmentsValues = z.infer<
  typeof validateExcelBulkShipmentsSchema
>;

/**
 * Validates parsed Excel rows and returns a per-row error map keyed by
 * the 1-based Excel row number (row 2 = first data row, since row 1 = headers).
 */
export interface ExcelValidationError {
  row: number;
  field: string;
  message: string;
}

export function validateBulkShipmentRows(rows: unknown[]): {
  success: boolean;
  errors: ExcelValidationError[];
  data?: ValidateExcelBulkShipmentsValues;
} {
  const result = validateExcelBulkShipmentsSchema.safeParse(rows);
  if (result.success) {
    return { success: true, errors: [], data: result.data };
  }
  const errors: ExcelValidationError[] = [];
  for (const issue of result.error.issues) {
    errors.push({
      row: typeof issue.path[0] === 'number' ? issue.path[0] + 2 : 0,
      field: issue.path.slice(1).join('.') || '(row)',
      message: issue.message,
    });
  }
  return { success: false, errors };
}