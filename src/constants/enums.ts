export const SHIPMENT_STATUS = {
  MANIFESTED: 'MANIFESTED',
  PICKUP_SCHEDULED: 'PICKUP SCHEDULED',
  IN_TRANSIT: 'IN TRANSIT',
  OUT_FOR_DELIVERY: 'OUT FOR DELIVERY',
  DELIVERED: 'DELIVERED',
  RTO: 'RTO',
  RTO_DELIVERED: 'RTO DELIVERED',
  CANCELLED: 'CANCELLED',
  NDR: 'NDR',
  NDR_RESOLVED: 'NDR RESOLVED',
} as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUS)[keyof typeof SHIPMENT_STATUS];

export const SHIPMENT_STATUS_LIST: ShipmentStatus[] = Object.values(SHIPMENT_STATUS);

export const NDR_REASON = {
  CONSIGNEE_NOT_AVAILABLE: 'CONSIGNEE NOT AVAILABLE',
  CONSIGNEE_ADDRESS_INCORRECT: 'CONSIGNEE ADDRESS INCORRECT',
  CONSIGNEE_REFUSED: 'CONSIGNEE REFUSED',
} as const;

export type NdrReason = (typeof NDR_REASON)[keyof typeof NDR_REASON];

export const NDR_ACTION = {
  UPDATE_ADDRESS: 'UPDATE ADDRESS',
  REATTEMPT_DELIVERY: 'REATTEMPT DELIVERY',
  RETURN_TO_ORIGIN: 'RETURN TO ORIGIN',
} as const;

export type NdrAction = (typeof NDR_ACTION)[keyof typeof NDR_ACTION];

export const NDR_ACTIONS_FOR_REASON: Record<NdrReason, NdrAction[]> = {
  [NDR_REASON.CONSIGNEE_NOT_AVAILABLE]: [
    NDR_ACTION.REATTEMPT_DELIVERY,
    NDR_ACTION.RETURN_TO_ORIGIN,
  ],
  [NDR_REASON.CONSIGNEE_ADDRESS_INCORRECT]: [NDR_ACTION.UPDATE_ADDRESS],
  [NDR_REASON.CONSIGNEE_REFUSED]: [NDR_ACTION.RETURN_TO_ORIGIN],
};

export const PAYMENT_MODE = {
  PREPAID: 'PREPAID',
  COD: 'COD',
} as const;

export type PaymentMode = (typeof PAYMENT_MODE)[keyof typeof PAYMENT_MODE];

export const SHIPPING_MODE = {
  SURFACE: 'SURFACE',
} as const;

export type ShippingMode = (typeof SHIPPING_MODE)[keyof typeof SHIPPING_MODE];

export const BOX_WEIGHT_UNIT = {
  GRAM: 'g',
  KILOGRAM: 'kg',
} as const;

export type BoxWeightUnit = (typeof BOX_WEIGHT_UNIT)[keyof typeof BOX_WEIGHT_UNIT];

export const COUNTRY = {
  INDIA: 'India',
} as const;

export type Country = (typeof COUNTRY)[keyof typeof COUNTRY];

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];

export const OTP_PURPOSE = {
  RESET_PASSWORD: 'RESET PASSWORD',
} as const;

export type OtpPurpose = (typeof OTP_PURPOSE)[keyof typeof OTP_PURPOSE];

export const USER_TYPE = {
  ADMIN: 'ADMIN',
  DELIVERY_PARTNER: 'DELIVERY PARTNER',
} as const;

export type UserType = (typeof USER_TYPE)[keyof typeof USER_TYPE];