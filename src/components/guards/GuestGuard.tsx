import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { FullPageLoader } from '@/components/ui/FullPageLoader';
import { ROUTES } from '@/constants/routes';

export function GuestGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}