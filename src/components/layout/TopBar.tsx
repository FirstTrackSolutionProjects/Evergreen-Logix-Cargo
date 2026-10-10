// src/components/layout/TopBar.tsx
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon, ChevronDown, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/useAuth';
import { formatFullName } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { MAIN_WEBSITE_URL } from '@/constants/links';
import { ApkDownloadPanel } from '@/components/ui/ApkDownloadPanel';
import { getPageTitle } from './pageTitles';
import styles from './TopBar.module.css';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const fullName = user ? formatFullName(user.first_name, user.middle_name, user.last_name) : '—';
  const initials = user
    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
    : '?';

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button type="button" className={styles.menuButton} onClick={onMenuClick} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <h1 className={styles.pageTitle}>{getPageTitle(location.pathname)}</h1>
      </div>

      <div className={styles.right}>
        {/* Subtle app-download widget — hover to expand */}
        <ApkDownloadPanel variant="subtle" />

        {/* Link back to the main website */}
        <a
          href={MAIN_WEBSITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.websiteLink}
          title="Visit evergreenlogix.com"
          aria-label="Visit the Evergreen Logix website"
        >
          <ExternalLink size={16} />
          <span className={styles.websiteLinkLabel}>Main site</span>
        </a>

        <div className={styles.userWrapper} ref={ref}>
          <button
            type="button"
            className={styles.userButton}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={styles.avatar}>{initials}</span>
            <span className={styles.userInfo}>
              <span className={styles.userName}>{fullName}</span>
              <span className={styles.userRole}>
                {user?.is_superadmin ? 'Super Admin' : 'Admin'}
              </span>
            </span>
            <ChevronDown size={15} className={styles.chevron} />
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => {
                  setMenuOpen(false);
                  navigate(ROUTES.PROFILE);
                }}
              >
                <UserIcon size={15} />
                My Profile
              </button>
              <div className={styles.dropdownDivider} />
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownDanger}`}
                onClick={handleLogout}
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}