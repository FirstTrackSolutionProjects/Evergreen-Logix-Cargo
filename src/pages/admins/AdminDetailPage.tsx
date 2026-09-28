import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Hash, Calendar, Shield, Users } from 'lucide-react';
import { adminsApi } from '@/api/admins.api';
import { rolesApi } from '@/api/roles.api';
import { ROUTES } from '@/constants/routes';
import { formatDateTime, formatFullName } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ActiveBadge } from '@/components/status/ActiveBadge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from './AdminDetailPage.module.css';

export function AdminDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', id],
    queryFn: () => adminsApi.getById(id!),
    enabled: Boolean(id),
  });

  const { data: rolesData } = useQuery({
    queryKey: ['roles', 'all'],
    queryFn: () => rolesApi.getAll({ page: 1, limit: 100, sort_by: 'id', sort_direction: 'asc' }),
    enabled: Boolean(data),
  });

  if (isLoading) {
    return (
      <div className={styles.center}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={<Users size={24} />}
        title="Admin not found"
        action={
          <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(ROUTES.ADMINS)}>
            Back to List
          </Button>
        }
      />
    );
  }

  const fullName = formatFullName(data.first_name, data.middle_name, data.last_name);
  const roleTitles = (data.role_ids ?? [])
    .map((rid) => rolesData?.data.rows.find((r) => r.id === rid)?.title)
    .filter(Boolean) as string[];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button type="button" className={styles.backButton} onClick={() => navigate(ROUTES.ADMINS)}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className={styles.titleRow}>
              <h2 className={styles.title}>{fullName}</h2>
              {data.is_superadmin ? (
                <Badge variant="primary" dot>
                  <Shield size={11} /> Super Admin
                </Badge>
              ) : (
                <ActiveBadge isActive={data.is_active} />
              )}
            </div>
            <p className={styles.subtitle}>{data.generated_id}</p>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <Card>
          <CardHeader title="Contact Information" />
          <div className={styles.infoList}>
            <InfoRow icon={<Mail size={15} />} label="Email" value={data.email} />
            <InfoRow icon={<Phone size={15} />} label="Phone" value={data.phone} />
            <InfoRow icon={<Hash size={15} />} label="Admin ID" value={data.generated_id} mono />
          </div>
        </Card>

        <Card>
          <CardHeader title="Timeline" />
          <div className={styles.infoList}>
            <InfoRow icon={<Calendar size={15} />} label="Created" value={formatDateTime(data.created_at)} />
            <InfoRow icon={<Calendar size={15} />} label="Last Updated" value={formatDateTime(data.updated_at)} />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Assigned Roles" />
        {roleTitles.length === 0 ? (
          <p className={styles.emptyText}>No roles assigned.</p>
        ) : (
          <div className={styles.rolesRow}>
            {roleTitles.map((title) => (
              <Badge key={title} variant="primary">
                {title}
              </Badge>
            ))}
          </div>
        )}
      </Card>
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