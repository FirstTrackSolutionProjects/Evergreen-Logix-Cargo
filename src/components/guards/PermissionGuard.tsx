import type { ReactNode } from 'react';
import { usePermission } from '@/hooks/usePermission';

interface PermissionGuardProps {
  permissions: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({ permissions, children, fallback = null }: PermissionGuardProps) {
  const { hasAnyPermission } = usePermission();

  if (hasAnyPermission(permissions)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}