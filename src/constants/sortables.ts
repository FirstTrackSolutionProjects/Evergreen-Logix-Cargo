export const SHIPMENT_SORTABLE = {
  ID: 'id',
  CREATED_AT: 'created_at',
} as const;

export type ShipmentSortable = (typeof SHIPMENT_SORTABLE)[keyof typeof SHIPMENT_SORTABLE];

export const ADMIN_SORTABLE = {
  ID: 'id',
  CREATED_AT: 'created_at',
} as const;

export type AdminSortable = (typeof ADMIN_SORTABLE)[keyof typeof ADMIN_SORTABLE];

export const DELIVERY_PARTNER_SORTABLE = {
  ID: 'id',
  CREATED_AT: 'created_at',
} as const;

export type DeliveryPartnerSortable =
  (typeof DELIVERY_PARTNER_SORTABLE)[keyof typeof DELIVERY_PARTNER_SORTABLE];

export const ROLE_SORTABLE = {
  ID: 'id',
} as const;

export type RoleSortable = (typeof ROLE_SORTABLE)[keyof typeof ROLE_SORTABLE];