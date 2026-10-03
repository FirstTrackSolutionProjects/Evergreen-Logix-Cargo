import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Upload,
  Truck,
  Users,
  Shield,
  UserCircle2,
  X,
} from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS, SHIPMENT_VIEW_PERMISSIONS, ADMIN_VIEW_PERMISSIONS, DELIVERY_PARTNER_VIEW_PERMISSIONS, ROLE_VIEW_PERMISSIONS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';
import styles from './Sidebar.module.css';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  permissions?: string[];
  always?: boolean;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [hovered, setHovered] = useState(false);
  const { hasAnyPermission } = usePermission();
  const location = useLocation();

  const items: NavItem[] = [
    { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: <LayoutDashboard size={20} />, always: true },
    { label: 'Shipments', to: ROUTES.SHIPMENTS, icon: <Package size={20} />, permissions: SHIPMENT_VIEW_PERMISSIONS },
    { label: 'Bulk Shipments', to: ROUTES.BULK_SHIPMENTS, icon: <Upload size={20} />, permissions: [PERMISSIONS.BULK_SHIPMENT_CREATE] },
    { label: 'Delivery Partners', to: ROUTES.DELIVERY_PARTNERS, icon: <Truck size={20} />, permissions: DELIVERY_PARTNER_VIEW_PERMISSIONS },
    { label: 'Admins', to: ROUTES.ADMINS, icon: <Users size={20} />, permissions: ADMIN_VIEW_PERMISSIONS },
    { label: 'Roles', to: ROUTES.ROLES, icon: <Shield size={20} />, permissions: ROLE_VIEW_PERMISSIONS },
    { label: 'My Profile', to: ROUTES.PROFILE, icon: <UserCircle2 size={20} />, always: true },
  ];

  const visibleItems = items.filter(
    (item) => item.always || (item.permissions && hasAnyPermission(item.permissions)),
  );

  useEffect(() => {
    onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const expanded = hovered;

  return (
    <>
      {mobileOpen && (
        <div className={styles.overlay} onClick={onMobileClose} role="presentation" />
      )}
      <aside
        className={cn(
          styles.sidebar,
          expanded && styles.expanded,
          mobileOpen && styles.mobileOpen,
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={styles.brand}>
          {expanded ? (
            <img src="/Logo.png" alt="Evergreen Logix Cargo" className={styles.brandLogo} />
          ) : (
            <span className={styles.brandMark} />
          )}
          {expanded && (
            <span className={styles.brandText}>
              Evergreen <span className={styles.brandAccent}>Logix</span>
            </span>
          )}
          <button
            type="button"
            className={styles.mobileClose}
            onClick={onMobileClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className={styles.nav}>
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.DASHBOARD}
              className={({ isActive }) => cn(styles.navItem, isActive && styles.active)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {expanded && <span className={styles.navLabel}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          {expanded && <span className={styles.footerText}>v1.0.0</span>}
        </div>
      </aside>
    </>
  );
}