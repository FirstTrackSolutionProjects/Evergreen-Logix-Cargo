import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, XCircle, AlertTriangle, Users, ArrowRight, Plus } from 'lucide-react';
import { shipmentsApi } from '@/api/shipments.api';
import { deliveryPartnersApi } from '@/api/delivery-partners.api';
import { useAuth } from '@/context/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS, SHIPMENT_VIEW_PERMISSIONS } from '@/constants/permissions';
import { SHIPMENT_STATUS } from '@/constants/enums';
import { ROUTES } from '@/constants/routes';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatFullName } from '@/utils/format';
import { cn } from '@/utils/cn';
import styles from './DashboardPage.module.css';

interface StatCard {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
  accent: 'primary' | 'info' | 'success' | 'danger' | 'warning';
  isLoading: boolean;
}

export function DashboardPage() {
  const { user } = useAuth();
  const { hasAnyPermission } = usePermission();
  const canViewShipments = hasAnyPermission(SHIPMENT_VIEW_PERMISSIONS);

  const shipmentsQuery = useQuery({
    queryKey: ['shipments', 'dashboard', 'all'],
    queryFn: () => shipmentsApi.getAll({ page: 1, limit: 1 }),
    enabled: canViewShipments,
  });

  const transitQuery = useQuery({
    queryKey: ['shipments', 'dashboard', 'transit'],
    queryFn: () => shipmentsApi.getAll({ page: 1, limit: 1, status: SHIPMENT_STATUS.IN_TRANSIT }),
    enabled: canViewShipments,
  });

  const deliveredQuery = useQuery({
    queryKey: ['shipments', 'dashboard', 'delivered'],
    queryFn: () => shipmentsApi.getAll({ page: 1, limit: 1, status: SHIPMENT_STATUS.DELIVERED }),
    enabled: canViewShipments,
  });

  const cancelledQuery = useQuery({
    queryKey: ['shipments', 'dashboard', 'cancelled'],
    queryFn: () => shipmentsApi.getAll({ page: 1, limit: 1, status: SHIPMENT_STATUS.CANCELLED }),
    enabled: canViewShipments,
  });

  const ndrQuery = useQuery({
    queryKey: ['shipments', 'dashboard', 'ndr'],
    queryFn: () => shipmentsApi.getAll({ page: 1, limit: 1, status: SHIPMENT_STATUS.NDR }),
    enabled: canViewShipments,
  });

  const deliveryPartnersQuery = useQuery({
    queryKey: ['delivery-partners', 'dashboard'],
    queryFn: () => deliveryPartnersApi.getAll({ page: 1, limit: 1 }),
    enabled: canViewShipments,
  });

  const stats: StatCard[] = useMemo(
    () => [
      {
        label: 'Total Shipments',
        value: shipmentsQuery.data?.data.pagination.totalCount,
        icon: <Package size={22} />,
        accent: 'primary',
        isLoading: shipmentsQuery.isLoading,
      },
      {
        label: 'In Transit',
        value: transitQuery.data?.data.pagination.totalCount,
        icon: <Truck size={22} />,
        accent: 'info',
        isLoading: transitQuery.isLoading,
      },
      {
        label: 'Delivered',
        value: deliveredQuery.data?.data.pagination.totalCount,
        icon: <CheckCircle2 size={22} />,
        accent: 'success',
        isLoading: deliveredQuery.isLoading,
      },
      {
        label: 'Cancelled',
        value: cancelledQuery.data?.data.pagination.totalCount,
        icon: <XCircle size={22} />,
        accent: 'danger',
        isLoading: cancelledQuery.isLoading,
      },
      {
        label: 'NDR Pending',
        value: ndrQuery.data?.data.pagination.totalCount,
        icon: <AlertTriangle size={22} />,
        accent: 'warning',
        isLoading: ndrQuery.isLoading,
      },
      {
        label: 'Delivery Partners',
        value: deliveryPartnersQuery.data?.data.pagination.totalCount,
        icon: <Users size={22} />,
        accent: 'primary',
        isLoading: deliveryPartnersQuery.isLoading,
      },
    ],
    [
      shipmentsQuery.data,
      shipmentsQuery.isLoading,
      transitQuery.data,
      transitQuery.isLoading,
      deliveredQuery.data,
      deliveredQuery.isLoading,
      cancelledQuery.data,
      cancelledQuery.isLoading,
      ndrQuery.data,
      ndrQuery.isLoading,
      deliveryPartnersQuery.data,
      deliveryPartnersQuery.isLoading,
    ],
  );

  const fullName = user ? formatFullName(user.first_name, user.middle_name, user.last_name) : 'Admin';

  return (
    <div className={styles.page}>
      <PageHeader
        title={`Welcome, ${fullName.split(' ')[0]} 👋`}
        subtitle="Here's an overview of your courier operations."
        actions={
          hasAnyPermission([PERMISSIONS.SHIPMENT_CREATE]) && (
            <Link to={ROUTES.SHIPMENT_CREATE}>
              <Button variant="primary" leftIcon={<Plus size={16} />}>
                New Shipment
              </Button>
            </Link>
          )
        }
      />

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={cn(styles.statCard, styles[`accent_${stat.accent}`])}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statContent}>
              {stat.isLoading ? (
                <Skeleton width={70} height={28} />
              ) : (
                <span className={styles.statValue}>{stat.value ?? 0}</span>
              )}
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.gridTwo}>
        <Card>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Quick Actions</h3>
          </div>
          <div className={styles.quickActions}>
            {canViewShipments && (
              <Link to={ROUTES.SHIPMENTS} className={styles.quickAction}>
                <div className={cn(styles.quickIcon, styles.quickIconPrimary)}>
                  <Package size={18} />
                </div>
                <div className={styles.quickText}>
                  <span className={styles.quickTitle}>View Shipments</span>
                  <span className={styles.quickDesc}>Browse and filter all shipments</span>
                </div>
                <ArrowRight size={16} className={styles.quickArrow} />
              </Link>
            )}

            {hasAnyPermission([PERMISSIONS.BULK_SHIPMENT_CREATE]) && (
              <Link to={ROUTES.BULK_SHIPMENTS} className={styles.quickAction}>
                <div className={cn(styles.quickIcon, styles.quickIconInfo)}>
                  <Package size={18} />
                </div>
                <div className={styles.quickText}>
                  <span className={styles.quickTitle}>Bulk Upload</span>
                  <span className={styles.quickDesc}>Upload Excel with multiple shipments</span>
                </div>
                <ArrowRight size={16} className={styles.quickArrow} />
              </Link>
            )}

            {canViewShipments && (
              <Link to={ROUTES.DELIVERY_PARTNERS} className={styles.quickAction}>
                <div className={cn(styles.quickIcon, styles.quickIconSuccess)}>
                  <Truck size={18} />
                </div>
                <div className={styles.quickText}>
                  <span className={styles.quickTitle}>Delivery Partners</span>
                  <span className={styles.quickDesc}>Manage your delivery fleet</span>
                </div>
                <ArrowRight size={16} className={styles.quickArrow} />
              </Link>
            )}
          </div>
        </Card>

        <Card>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Account Overview</h3>
          </div>
          <div className={styles.accountInfo}>
            <div className={styles.accountRow}>
              <span className={styles.accountLabel}>Admin ID</span>
              <span className={styles.accountValueMono}>{user?.generated_id ?? '—'}</span>
            </div>
            <div className={styles.accountRow}>
              <span className={styles.accountLabel}>Full Name</span>
              <span className={styles.accountValue}>{fullName}</span>
            </div>
            <div className={styles.accountRow}>
              <span className={styles.accountLabel}>Email</span>
              <span className={styles.accountValue}>{user?.email ?? '—'}</span>
            </div>
            <div className={styles.accountRow}>
              <span className={styles.accountLabel}>Phone</span>
              <span className={styles.accountValue}>{user?.phone ?? '—'}</span>
            </div>
            <div className={styles.accountRow}>
              <span className={styles.accountLabel}>Role</span>
              <span className={styles.accountValue}>
                {user?.is_superadmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>
          <Link to={ROUTES.PROFILE} className={styles.profileLink}>
            View full profile
            <ArrowRight size={14} />
          </Link>
        </Card>
      </div>
    </div>
  );
}