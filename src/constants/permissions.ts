export const PERMISSIONS = {
  BULK_SHIPMENT_CREATE: 'bulk-shipment:create',
  SHIPMENT_CREATE: 'shipment:create',
  SHIPMENT_VIEW: 'shipment:view',
  SHIPMENT_UPDATE: 'shipment:update',
  SHIPMENT_CANCEL: 'shipment:cancel',
  SHIPMENT_ASSIGN_DELIVERY_PARTNER: 'shipment:assign-delivery-partner',
  SHIPMENT_TAKE_NDR_ACTION: 'shipment:take-ndr-action',
  ADMIN_VIEW: 'admin:view',
  ADMIN_CREATE: 'admin:create',
  ADMIN_UPDATE: 'admin:update',
  DELIVERY_PARTNER_VIEW: 'delivery-partner:view',
  DELIVERY_PARTNER_CREATE: 'delivery-partner:create',
  DELIVERY_PARTNER_UPDATE: 'delivery-partner:update',
  ROLE_VIEW: 'role:view',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = (typeof PERMISSIONS)[PermissionKey];

export const SHIPMENT_VIEW_PERMISSIONS: PermissionValue[] = [
  PERMISSIONS.SHIPMENT_VIEW,
  PERMISSIONS.SHIPMENT_CREATE,
  PERMISSIONS.SHIPMENT_UPDATE,
  PERMISSIONS.SHIPMENT_CANCEL,
  PERMISSIONS.SHIPMENT_ASSIGN_DELIVERY_PARTNER,
  PERMISSIONS.SHIPMENT_TAKE_NDR_ACTION,
];

export const ADMIN_VIEW_PERMISSIONS: PermissionValue[] = [
  PERMISSIONS.ADMIN_VIEW,
  PERMISSIONS.ADMIN_CREATE,
  PERMISSIONS.ADMIN_UPDATE,
];

export const DELIVERY_PARTNER_VIEW_PERMISSIONS: PermissionValue[] = [
  PERMISSIONS.DELIVERY_PARTNER_VIEW,
  PERMISSIONS.DELIVERY_PARTNER_CREATE,
  PERMISSIONS.DELIVERY_PARTNER_UPDATE,
];

export const ROLE_VIEW_PERMISSIONS: PermissionValue[] = [
  PERMISSIONS.ROLE_VIEW,
  PERMISSIONS.ROLE_CREATE,
  PERMISSIONS.ROLE_UPDATE,
  PERMISSIONS.ROLE_DELETE,
];

export const PERMISSION_GROUPS: { label: string; permissions: PermissionValue[] }[] = [
  {
    label: 'Shipments',
    permissions: [
      PERMISSIONS.SHIPMENT_VIEW,
      PERMISSIONS.SHIPMENT_CREATE,
      PERMISSIONS.SHIPMENT_UPDATE,
      PERMISSIONS.SHIPMENT_CANCEL,
      PERMISSIONS.SHIPMENT_ASSIGN_DELIVERY_PARTNER,
      PERMISSIONS.SHIPMENT_TAKE_NDR_ACTION,
      PERMISSIONS.BULK_SHIPMENT_CREATE,
    ],
  },
  {
    label: 'Delivery Partners',
    permissions: [
      PERMISSIONS.DELIVERY_PARTNER_VIEW,
      PERMISSIONS.DELIVERY_PARTNER_CREATE,
      PERMISSIONS.DELIVERY_PARTNER_UPDATE,
    ],
  },
  {
    label: 'Admins',
    permissions: [
      PERMISSIONS.ADMIN_VIEW,
      PERMISSIONS.ADMIN_CREATE,
      PERMISSIONS.ADMIN_UPDATE,
    ],
  },
  {
    label: 'Roles & Permissions',
    permissions: [
      PERMISSIONS.ROLE_VIEW,
      PERMISSIONS.ROLE_CREATE,
      PERMISSIONS.ROLE_UPDATE,
      PERMISSIONS.ROLE_DELETE,
    ],
  },
];

export const PERMISSION_LABELS: Record<string, string> = {
  [PERMISSIONS.BULK_SHIPMENT_CREATE]: 'Bulk Shipment Create',
  [PERMISSIONS.SHIPMENT_CREATE]: 'Shipment Create',
  [PERMISSIONS.SHIPMENT_VIEW]: 'Shipment View',
  [PERMISSIONS.SHIPMENT_UPDATE]: 'Shipment Update',
  [PERMISSIONS.SHIPMENT_CANCEL]: 'Shipment Cancel',
  [PERMISSIONS.SHIPMENT_ASSIGN_DELIVERY_PARTNER]: 'Shipment Assign Delivery Partner',
  [PERMISSIONS.SHIPMENT_TAKE_NDR_ACTION]: 'Shipment Take NDR Action',
  [PERMISSIONS.ADMIN_VIEW]: 'Admin View',
  [PERMISSIONS.ADMIN_CREATE]: 'Admin Create',
  [PERMISSIONS.ADMIN_UPDATE]: 'Admin Update',
  [PERMISSIONS.DELIVERY_PARTNER_VIEW]: 'Delivery Partner View',
  [PERMISSIONS.DELIVERY_PARTNER_CREATE]: 'Delivery Partner Create',
  [PERMISSIONS.DELIVERY_PARTNER_UPDATE]: 'Delivery Partner Update',
  [PERMISSIONS.ROLE_VIEW]: 'Role View',
  [PERMISSIONS.ROLE_CREATE]: 'Role Create',
  [PERMISSIONS.ROLE_UPDATE]: 'Role Update',
  [PERMISSIONS.ROLE_DELETE]: 'Role Delete',
};