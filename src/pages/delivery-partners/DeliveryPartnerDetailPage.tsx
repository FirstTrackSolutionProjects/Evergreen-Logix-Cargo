import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Hash, Calendar, Truck } from 'lucide-react';
import { deliveryPartnersApi } from '@/api/delivery-partners.api';
import { ROUTES } from '@/constants/routes';
import { formatDateTime, formatFullName } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { ActiveBadge } from '@/components/status/ActiveBadge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from './DeliveryPartnerDetailPage.module.css';

export function DeliveryPartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['delivery-partner', id],
    queryFn: () => deliveryPartnersApi.getById(id!),
    enabled: Boolean(id),
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
        icon={<Truck size={24} />}
        title="Delivery partner not found"
        action={
          <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(ROUTES.DELIVERY_PARTNERS)}>
            Back to List
          </Button>
        }
      />
    );
  }

  const fullName = formatFullName(data.first_name, data.middle_name, data.last_name);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button type="button" className={styles.backButton} onClick={() => navigate(ROUTES.DELIVERY_PARTNERS)}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className={styles.titleRow}>
              <h2 className={styles.title}>{fullName}</h2>
              <ActiveBadge isActive={data.is_active} />
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
            <InfoRow icon={<Hash size={15} />} label="Partner ID" value={data.generated_id} mono />
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