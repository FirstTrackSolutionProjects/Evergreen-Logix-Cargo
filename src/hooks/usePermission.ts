import { useCallback, useMemo } from 'react';
import { useAuth } from '@/context/useAuth';

export function usePermission() {
  const { permissions, isSuperAdmin } = useAuth();

  const permissionSet = useMemo(() => new Set(permissions), [permissions]);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (isSuperAdmin) return true;
      return permissionSet.has(permission);
    },
    [isSuperAdmin, permissionSet],
  );

  const hasAnyPermission = useCallback(
    (required: string[]): boolean => {
      if (isSuperAdmin) return true;
      return required.some((permission) => permissionSet.has(permission));
    },
    [isSuperAdmin, permissionSet],
  );

  const hasAllPermissions = useCallback(
    (required: string[]): boolean => {
      if (isSuperAdmin) return true;
      return required.every((permission) => permissionSet.has(permission));
    },
    [isSuperAdmin, permissionSet],
  );

  return {
    permissions,
    isSuperAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}