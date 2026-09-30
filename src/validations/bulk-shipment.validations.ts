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
    // ── Consignor (Sender) details ──────────────────────────────────────────
    consignor_name: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignor name is required';
          if (issue.code === 'invalid_type') return 'Consignor name must be a string';
          return 'Invalid consignor name';
        },
      })
      .trim()
      .min(3, 'Consignor name must be at least 3 characters long')
      .max(100, 'Consignor name must be at most 100 characters long')
      .regex(/^[a-zA-Z ]+$/, 'Consignor name can only have alphabets and spaces'),

    consignor_phone: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignor phone is required';
          if (issue.code === 'invalid_type') return 'Consignor phone must be a string';
          return 'Invalid consignor phone';
        },
      })
      .trim()
      .length(10, 'Consignor phone must be 10 digits long')
      .regex(
        phoneRegex,
        'Consignor phone must be a valid Indian phone number starting with 6, 7, 8, or 9',
      ),

    consignor_email: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignor email is required';
          if (issue.code === 'invalid_type') return 'Consignor email must be a string';
          return 'Invalid consignor email';
        },
      })
      .trim()
      .max(250, 'Consignor email cannot be longer than 250 characters')
      .check(
        z.email({
          error: (issue) => {
            if (issue.code === 'invalid_format') {
              return 'Please provide a valid consignor email address';
            }
          },
        }),
      ),

    consignor_address: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignor address is required';
          if (issue.code === 'invalid_type') return 'Consignor address must be a string';
          return 'Invalid consignor address';
        },
      })
      .trim()
      .min(10, 'Consignor address must be at least 10 characters long')
      .max(200, 'Consignor address cannot be longer than 200 characters'),

    consignor_pincode: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignor pincode is required';
          if (issue.code === 'invalid_type') return 'Consignor pincode must be a string';
          return 'Invalid consignor pincode';
        },
      })
      .length(6, 'Consignor pincode must be 6 digits long')
      .regex(pincodeRegex, 'Consignor pincode must be a 6 digit number'),

    consignor_city: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignor city is required';
          if (issue.code === 'invalid_type') return 'Consignor city must be a string';
          return 'Invalid consignor city';
        },
      })
      .trim()
      .min(2, 'Consignor city must be at least 2 characters long')
      .max(50, 'Consignor city cannot be longer than 50 characters'),

    consignor_state: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignor state is required';
          if (issue.code === 'invalid_type') return 'Consignor state must be a string';
          return 'Invalid consignor state';
        },
      })
      .trim()
      .min(2, 'Consignor state must be at least 2 characters long')
      .max(50, 'Consignor state cannot be longer than 50 characters'),

    consignor_country: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignor country is required';
          if (issue.code === 'invalid_type') return 'Consignor country must be a string';
          return 'Invalid consignor country';
        },
      })
      .trim()
      .pipe(
        z.enum(Object.values(COUNTRY), {
          error: (issue) => {
            if (issue.code === 'invalid_value') {
              return `Supported countries are: ${Object.values(COUNTRY).join(', ')}`;
            }
          },
        }),
      ),

    // ── Return address details ──────────────────────────────────────────────
    return_address: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Return address is required';
          if (issue.code === 'invalid_type') return 'Return address must be a string';
          return 'Invalid return address';
        },
      })
      .trim()
      .min(10, 'Return address must be at least 10 characters long')
      .max(200, 'Return address cannot be longer than 200 characters')
      .or(z.literal('')),

    return_pincode: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Return pincode is required';
          if (issue.code === 'invalid_type') return 'Return pincode must be a string';
          return 'Invalid return pincode';
        },
      })
      .length(6, 'Return pincode must be 6 digits long')
      .regex(pincodeRegex, 'Return pincode must be a 6 digit number')
      .or(z.literal('')),

    return_city: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Return city is required';
          if (issue.code === 'invalid_type') return 'Return city must be a string';
          return 'Invalid return city';
        },
      })
      .trim()
      .min(2, 'Return city must be at least 2 characters long')
      .max(50, 'Return city cannot be longer than 50 characters')
      .or(z.literal('')),

    return_state: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Return state is required';
          if (issue.code === 'invalid_type') return 'Return state must be a string';
          return 'Invalid return state';
        },
      })
      .trim()
      .min(2, 'Return state must be at least 2 characters long')
      .max(50, 'Return state cannot be longer than 50 characters')
      .or(z.literal('')),

    return_country: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Return country is required';
          if (issue.code === 'invalid_type') return 'Return country must be a string';
          return 'Invalid return country';
        },
      })
      .trim()
      .pipe(
        z.enum(Object.values(COUNTRY), {
          error: (issue) => {
            if (issue.code === 'invalid_value') {
              return `Supported countries are: ${Object.values(COUNTRY).join(', ')}`;
            }
          },
        }),
      )
      .or(z.literal('')),

    // ── Consignee (Receiver) details ────────────────────────────────────────
    consignee_name: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignee name is required';
          if (issue.code === 'invalid_type') return 'Consignee name must be a string';
          return 'Invalid consignee name';
        },
      })
      .trim()
      .min(2, 'Consignee name must be at least 2 characters long')
      .max(100, 'Consignee name cannot be longer than 100 characters'),

    consignee_phone: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignee phone is required';
          if (issue.code === 'invalid_type') return 'Consignee phone must be a string';
          return 'Invalid consignee phone';
        },
      })
      .trim()
      .length(10, 'Consignee phone must be 10 digits long')
      .regex(
        phoneRegex,
        'Consignee phone must be a 10 digit number starting with 6, 7, 8, or 9',
      ),

    consignee_email: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignee email is required';
          if (issue.code === 'invalid_type') return 'Consignee email must be a string';
          return 'Invalid consignee email';
        },
      })
      .trim()
      .max(250, 'Consignee email cannot be longer than 250 characters')
      .check(
        z.email({
          error: (issue) => {
            if (issue.code === 'invalid_format') {
              return 'Please provide a valid consignee email address';
            }
          },
        }),
      ),

    consignee_address: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignee address is required';
          if (issue.code === 'invalid_type') return 'Consignee address must be a string';
          return 'Invalid consignee address';
        },
      })
      .trim()
      .min(10, 'Consignee address must be at least 10 characters long')
      .max(200, 'Consignee address cannot be longer than 200 characters'),

    consignee_pincode: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignee pincode is required';
          if (issue.code === 'invalid_type') return 'Consignee pincode must be a string';
          return 'Invalid consignee pincode';
        },
      })
      .length(6, 'Consignee pincode must be 6 digits long')
      .regex(pincodeRegex, 'Consignee pincode must be a 6 digit number'),

    consignee_city: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignee city is required';
          if (issue.code === 'invalid_type') return 'Consignee city must be a string';
          return 'Invalid consignee city';
        },
      })
      .trim()
      .min(2, 'Consignee city must be at least 2 characters long')
      .max(50, 'Consignee city cannot be longer than 50 characters'),

    consignee_state: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignee state is required';
          if (issue.code === 'invalid_type') return 'Consignee state must be a string';
          return 'Invalid consignee state';
        },
      })
      .trim()
      .min(2, 'Consignee state must be at least 2 characters long')
      .max(50, 'Consignee state cannot be longer than 50 characters'),

    consignee_country: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Consignee country is required';
          if (issue.code === 'invalid_type') return 'Consignee country must be a string';
          return 'Invalid consignee country';
        },
      })
      .trim()
      .pipe(
        z.enum([COUNTRY.INDIA], {
          error: (issue) => {
            if (issue.code === 'invalid_value') {
              return 'Only India is supported as consignee country';
            }
          },
        }),
      ),

    // ── Flags ───────────────────────────────────────────────────────────────
    return_same_as_pickup: z.coerce.boolean({
      error: (issue) => {
        if (issue.input === undefined) return 'Return same as pickup is required';
        if (issue.code === 'invalid_type')
          return 'Return same as pickup must be a boolean (TRUE/FALSE or 1/0)';
        return 'Invalid return same as pickup';
      },
    }),

    // ── Shipment options ────────────────────────────────────────────────────
    payment_mode: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Payment mode is required';
          if (issue.code === 'invalid_type') return 'Payment mode must be a string';
          return 'Invalid payment mode';
        },
      })
      .trim()
      .pipe(
        z.enum(Object.values(PAYMENT_MODE), {
          error: (issue) => {
            if (issue.input === undefined) return 'Payment mode is required';
            if (issue.code === 'invalid_value') {
              return `Supported payment modes are: ${Object.values(PAYMENT_MODE).join(', ')}`;
            }
            return 'Invalid payment mode';
          },
        }),
      ),

    shipping_mode: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Shipping mode is required';
          if (issue.code === 'invalid_type') return 'Shipping mode must be a string';
          return 'Invalid shipping mode';
        },
      })
      .trim()
      .pipe(
        z.enum(Object.values(SHIPPING_MODE), {
          error: (issue) => {
            if (issue.input === undefined) return 'Shipping mode is required';
            if (issue.code === 'invalid_value') {
              return `Supported shipping modes are: ${Object.values(SHIPPING_MODE).join(', ')}`;
            }
            return 'Invalid shipping mode';
          },
        }),
      ),

    cod_amount: z.coerce.number({
      error: (issue) => {
        if (issue.input === undefined) return 'COD amount is required';
        if (issue.code === 'invalid_type') return 'COD amount must be a number';
        return 'Invalid COD amount';
      },
    }),

    // ── Box dimensions ──────────────────────────────────────────────────────
    box_length: z.coerce
      .number({
        error: (issue) => {
          if (issue.input === undefined) return 'Box length is required';
          if (issue.code === 'invalid_type') return 'Box length must be a number';
          return 'Invalid box length';
        },
      })
      .int('Box length must be an integer')
      .positive('Box length must be greater than 0'),

    box_breadth: z.coerce
      .number({
        error: (issue) => {
          if (issue.input === undefined) return 'Box breadth is required';
          if (issue.code === 'invalid_type') return 'Box breadth must be a number';
          return 'Invalid box breadth';
        },
      })
      .int('Box breadth must be an integer')
      .positive('Box breadth must be greater than 0'),

    box_height: z.coerce
      .number({
        error: (issue) => {
          if (issue.input === undefined) return 'Box height is required';
          if (issue.code === 'invalid_type') return 'Box height must be a number';
          return 'Invalid box height';
        },
      })
      .int('Box height must be an integer')
      .positive('Box height must be greater than 0'),

    box_weight: z.coerce.number({
      error: (issue) => {
        if (issue.input === undefined) return 'Box weight is required';
        if (issue.code === 'invalid_type') return 'Box weight must be a number';
        return 'Invalid box weight';
      },
    }),

    box_weight_unit: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Box weight unit is required';
          if (issue.code === 'invalid_type') return 'Box weight unit must be a string';
          return 'Invalid box weight unit';
        },
      })
      .trim()
      .pipe(
        z.enum(Object.values(BOX_WEIGHT_UNIT), {
          error: (issue) => {
            if (issue.code === 'invalid_value') {
              return `Supported box weight units are: ${Object.values(BOX_WEIGHT_UNIT).join(', ')}`;
            }
          },
        }),
      ),

    // ── Item details ────────────────────────────────────────────────────────
    item_description: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return 'Item description is required';
          if (issue.code === 'invalid_type') return 'Item description must be a string';
          return 'Invalid item description';
        },
      })
      .trim()
      .min(1, 'Item description cannot be empty')
      .max(100, 'Item description cannot be longer than 100 characters'),

    shipment_value: z.coerce
      .number({
        error: (issue) => {
          if (issue.input === undefined) return 'Shipment value is required';
          if (issue.code === 'invalid_type') return 'Shipment value must be a number';
          return 'Invalid shipment value';
        },
      })
      .positive('Shipment value must be greater than 0')
      .refine((value) => Number.isInteger(value * 100), {
        message: 'Shipment value must have at most 2 decimal places',
      }),

    ewaybill: z
      .string({
        error: (issue) => {
          if (issue.code === 'invalid_type') return 'E-waybill must be a string';
          return 'Invalid E-waybill';
        },
      })
      .trim()
      .min(1, 'E-waybill cannot be empty')
      .max(12, 'E-waybill cannot be longer than 12 characters')
      .regex(/^[0-9]{12}$/, 'E-waybill must be a 12 digit number')
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    // COD amount
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

    // E-waybill
    if (data.shipment_value >= 50000 && !data.ewaybill) {
      ctx.addIssue({
        code: 'custom',
        path: ['ewaybill'],
        message: 'E-waybill is required for shipment value of 50000 or more',
      });
    }

    // Box weight precision
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

    // Return address (required when return_same_as_pickup is false)
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
  .array(excelRowSchema, {
    error: (issue) => {
      if (issue.input === undefined) return 'Excel data is required';
      if (issue.code === 'invalid_type') return 'Excel data must be an array of rows';
      return 'Invalid Excel data';
    },
  })
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