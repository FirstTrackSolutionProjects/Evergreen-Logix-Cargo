import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, Hash, User, Shield, Lock } from 'lucide-react';
import { adminsApi } from '@/api/admins.api';
import { rolesApi } from '@/api/roles.api';
import { useAuth } from '@/context/useAuth';
import { formatDateTime, formatFullName } from '@/utils/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const { user } = useAuth();
  const [changePwOpen, setChangePwOpen] = useState(false);

  const { data: rolesData } = useQuery({
    queryKey: ['roles', 'all'],
    queryFn: () => rolesApi.getAll({ page: 1, limit: 100, sort_by: 'id', sort_direction: 'asc' }),
  });

  const { data: myRoles } = useQuery({
    queryKey: ['my-roles'],
    queryFn: () => adminsApi.getMyRoles(),
  });

  const { data: myPermissions } = useQuery({
    queryKey: ['my-permissions'],
    queryFn: () => adminsApi.getMyPermissions(),
  });

  if (!user) {
    return (
      <div className={styles.center}>
        <Spinner size="lg" />
      </div>
    );
  }

  const fullName = formatFullName(user.first_name, user.middle_name, user.last_name);
  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();

  const roleTitles = (myRoles?.role_ids ?? [])
    .map((rid) => rolesData?.data.rows.find((r) => r.id === rid)?.title)
    .filter(Boolean) as string[];

  const permissionCount = myPermissions?.permission_ids.length ?? 0;

  return (
    <div className={styles.page}>
      <PageHeader
        title="My Profile"
        subtitle="Your account information, roles, and permissions."
        actions={
          <Button
            variant="outline"
            leftIcon={<Lock size={16} />}
            onClick={() => setChangePwOpen(true)}
          >
            Change Password
          </Button>
        }
      />

      <Card>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.profileInfo}>
            <div className={styles.nameRow}>
              <h2 className={styles.name}>{fullName}</h2>
              {user.is_superadmin ? (
                <Badge variant="primary" dot>
                  <Shield size={11} /> Super Admin
                </Badge>
              ) : (
                <Badge variant={user.is_active ? 'success' : 'neutral'} dot>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              )}
            </div>
            <span className={styles.profileId}>{user.generated_id}</span>
          </div>
        </div>
      </Card>

      <div className={styles.grid}>
        <Card>
          <CardHeader title="Contact Information" />
          <div className={styles.infoList}>
            <InfoRow icon={<Mail size={15} />} label="Email" value={user.email} />
            <InfoRow icon={<Phone size={15} />} label="Phone" value={user.phone} />
            <InfoRow icon={<Hash size={15} />} label="Admin ID" value={user.generated_id} mono />
            <InfoRow icon={<User size={15} />} label="Full Name" value={fullName} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Account Timeline" />
          <div className={styles.infoList}>
            <InfoRow icon={<User size={15} />} label="Created" value={formatDateTime(user.created_at)} />
            <InfoRow icon={<User size={15} />} label="Last Updated" value={formatDateTime(user.updated_at)} />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Assigned Roles" subtitle={`${roleTitles.length} role(s)`} />
        {roleTitles.length === 0 ? (
          <p className={styles.emptyText}>
            {user.is_superadmin ? 'Super Admins have all permissions by default.' : 'No roles assigned.'}
          </p>
        ) : (
          <div className={styles.chipsRow}>
            {roleTitles.map((title) => (
              <Badge key={title} variant="primary">
                {title}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader
          title="Permissions"
          subtitle={
            user.is_superadmin ? 'Super Admin — full access' : `${permissionCount} permission(s)`
          }
        />
        {user.is_superadmin ? (
          <p className={styles.emptyText}>You have access to all features.</p>
        ) : permissionCount === 0 ? (
          <p className={styles.emptyText}>No permissions assigned.</p>
        ) : (
          <div className={styles.chipsRow}>
            {myPermissions?.permission_ids.map((permission) => (
              <span key={permission} className={styles.permissionChip}>
                {permission}
              </span>
            ))}
          </div>
        )}
      </Card>

      <ChangePasswordModal isOpen={changePwOpen} onClose={() => setChangePwOpen(false)} />
    </div>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}

function InfoRow({ icon, label, value, mono = false }: InfoRowProps) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>
        <span className={styles.infoIcon}>{icon}</span>
        {label}
      </span>
      <span className={`${styles.infoValue} ${mono ? styles.infoValueMono : ''}`}>{value}</span>
    </div>
  );
}