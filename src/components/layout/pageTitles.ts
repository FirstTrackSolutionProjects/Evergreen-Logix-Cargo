import { ROUTES } from '@/constants/routes';

export function getPageTitle(pathname: string): string {
  if (pathname === ROUTES.DASHBOARD) return 'Dashboard';
  if (pathname === ROUTES.SHIPMENTS) return 'Shipments';
  if (pathname === ROUTES.SHIPMENT_CREATE) return 'Create Shipment';
  if (/^\/shipments\/[^/]+\/edit$/.test(pathname)) return 'Edit Shipment';
  if (/^\/shipments\/[^/]+$/.test(pathname)) return 'Shipment Details';
  if (pathname === ROUTES.BULK_SHIPMENTS) return 'Bulk Shipments';
  if (pathname === ROUTES.DELIVERY_PARTNERS) return 'Delivery Partners';
  if (/^\/delivery-partners\/[^/]+$/.test(pathname)) return 'Delivery Partner Details';
  if (pathname === ROUTES.ADMINS) return 'Admins';
  if (/^\/admins\/[^/]+$/.test(pathname)) return 'Admin Details';
  if (pathname === ROUTES.ROLES) return 'Roles & Permissions';
  if (pathname === ROUTES.ROLE_CREATE) return 'Create Role';
  if (/^\/roles\/[^/]+$/.test(pathname)) return 'Edit Role';
  if (pathname === ROUTES.PROFILE) return 'My Profile';
  return 'Evergreen Logix Cargo';
}