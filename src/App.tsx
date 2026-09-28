import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { GuestGuard } from '@/components/guards/GuestGuard';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { ROUTES } from '@/constants/routes';
import {
  PERMISSIONS,
  SHIPMENT_VIEW_PERMISSIONS,
  ADMIN_VIEW_PERMISSIONS,
  DELIVERY_PARTNER_VIEW_PERMISSIONS,
  ROLE_VIEW_PERMISSIONS,
} from '@/constants/permissions';

import { LoginPage } from '@/pages/auth/LoginPage';
import { OtpPage } from '@/pages/auth/OtpPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ShipmentsPage } from '@/pages/shipments/ShipmentsPage';
import { ShipmentDetailPage } from '@/pages/shipments/ShipmentDetailPage';
import { CreateShipmentPage } from '@/pages/shipments/CreateShipmentPage';
import { UpdateShipmentPage } from '@/pages/shipments/UpdateShipmentPage';
import { BulkShipmentPage } from '@/pages/bulk-shipments/BulkShipmentPage';
import { DeliveryPartnersPage } from '@/pages/delivery-partners/DeliveryPartnersPage';
import { DeliveryPartnerDetailPage } from '@/pages/delivery-partners/DeliveryPartnerDetailPage';
import { AdminsPage } from '@/pages/admins/AdminsPage';
import { AdminDetailPage } from '@/pages/admins/AdminDetailPage';
import { RolesPage } from '@/pages/roles/RolesPage';
import { RoleFormPage } from '@/pages/roles/RoleFormPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public / Guest routes */}
            <Route element={<GuestGuard />}>
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.VERIFY_OTP} element={<OtpPage />} />
            </Route>

            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardPage />} />

                {/* Shipments */}
                <Route
                  path="shipments"
                  element={
                    <PermissionGuard permissions={SHIPMENT_VIEW_PERMISSIONS}>
                      <ShipmentsPage />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="shipments/create"
                  element={
                    <PermissionGuard permissions={[PERMISSIONS.SHIPMENT_CREATE]}>
                      <CreateShipmentPage />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="shipments/:id"
                  element={
                    <PermissionGuard permissions={SHIPMENT_VIEW_PERMISSIONS}>
                      <ShipmentDetailPage />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="shipments/:id/edit"
                  element={
                    <PermissionGuard permissions={[PERMISSIONS.SHIPMENT_UPDATE]}>
                      <UpdateShipmentPage />
                    </PermissionGuard>
                  }
                />

                {/* Bulk Shipments */}
                <Route
                  path="bulk-shipments"
                  element={
                    <PermissionGuard permissions={[PERMISSIONS.BULK_SHIPMENT_CREATE]}>
                      <BulkShipmentPage />
                    </PermissionGuard>
                  }
                />

                {/* Delivery Partners */}
                <Route
                  path="delivery-partners"
                  element={
                    <PermissionGuard permissions={DELIVERY_PARTNER_VIEW_PERMISSIONS}>
                      <DeliveryPartnersPage />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="delivery-partners/:id"
                  element={
                    <PermissionGuard permissions={DELIVERY_PARTNER_VIEW_PERMISSIONS}>
                      <DeliveryPartnerDetailPage />
                    </PermissionGuard>
                  }
                />

                {/* Admins */}
                <Route
                  path="admins"
                  element={
                    <PermissionGuard permissions={ADMIN_VIEW_PERMISSIONS}>
                      <AdminsPage />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="admins/:id"
                  element={
                    <PermissionGuard permissions={ADMIN_VIEW_PERMISSIONS}>
                      <AdminDetailPage />
                    </PermissionGuard>
                  }
                />

                {/* Roles */}
                <Route
                  path="roles"
                  element={
                    <PermissionGuard permissions={ROLE_VIEW_PERMISSIONS}>
                      <RolesPage />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="roles/create"
                  element={
                    <PermissionGuard permissions={[PERMISSIONS.ROLE_CREATE]}>
                      <RoleFormPage mode="create" />
                    </PermissionGuard>
                  }
                />
                <Route
                  path="roles/:id"
                  element={
                    <PermissionGuard permissions={ROLE_VIEW_PERMISSIONS}>
                      <RoleFormPage mode="edit" />
                    </PermissionGuard>
                  }
                />

                {/* Profile */}
                <Route path="profile" element={<ProfilePage />} />

                {/* Redirects */}
                <Route path="login" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                <Route path="verify-otp" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontSize: '13.5px',
                fontWeight: 500,
                borderRadius: '10px',
                background: '#ffffff',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}