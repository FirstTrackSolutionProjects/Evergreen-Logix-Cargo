import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Box,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { shipmentsApi } from '@/api/shipments.api';
import { PERMISSIONS } from '@/constants/permissions';
import { SHIPMENT_STATUS } from '@/constants/enums';
import { ROUTES } from '@/constants/routes';
import { usePermission } from '@/hooks/usePermission';
import { formatCurrency, formatDateTime, formatWeight } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/status/StatusBadge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/utils/cn';
import styles from './ShipmentDetailPage.module.css';

export function ShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const canUpdate = hasPermission(PERMISSIONS.SHIPMENT_UPDATE);
  const canNdr = hasPermission(PERMISSIONS.SHIPMENT_TAKE_NDR_ACTION);

  const { data: shipment, isLoading } = useQuery({
    queryKey: ['shipment', id],
    queryFn: () => shipmentsApi.getById(id!),
    enabled: Boolean(id),
  });

  const { data: tracking } = useQuery({
    queryKey: ['shipment', id, 'tracking'],
    queryFn: () => shipmentsApi.track(id!),
    enabled: Boolean(id),
  });

  const isDelivered = shipment?.status === SHIPMENT_STATUS.DELIVERED;

  const { data: pod, isLoading: isPodLoading } = useQuery({
    queryKey: ['shipment', id, 'pod'],
    queryFn: () => shipmentsApi.getPod(id!),
    enabled: Boolean(id) && isDelivered,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className={styles.center}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!shipment) {
    return (
      <EmptyState
        icon={<Package size={24} />}
        title="Shipment not found"
        description="This shipment may have been removed or doesn't exist."
        action={
          <Link to={ROUTES.SHIPMENTS}>
            <Button variant="outline" leftIcon={<ArrowLeft size={16} />}>
              Back to Shipments
            </Button>
          </Link>
        }
      />
    );
  }

  // Editable only while MANIFESTED
  const isUpdatable = shipment.status === SHIPMENT_STATUS.MANIFESTED;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button type="button" className={styles.backButton} onClick={() => navigate(ROUTES.SHIPMENTS)}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className={styles.titleRow}>
              <h2 className={styles.title}>{shipment.generated_id}</h2>
              <StatusBadge status={shipment.status} />
            </div>
            <p className={styles.subtitle}>
              Created on {formatDateTime(shipment.created_at)}
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          {canUpdate && isUpdatable && (
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.SHIPMENT_EDIT(shipment.id))}
            >
              Edit Shipment
            </Button>
          )}
          {canNdr && shipment.status === SHIPMENT_STATUS.NDR && (
            <Button variant="primary" leftIcon={<AlertTriangle size={16} />}>
              Take NDR Action
            </Button>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainColumn}>
          <Card>
            <CardHeader title="Consignor (Sender)" subtitle="Pickup details" />
            <div className={styles.infoGrid}>
              <InfoRow icon={<User size={14} />} label="Name" value={shipment.consignor_name} />
              <InfoRow icon={<User size={14} />} label="Phone" value={shipment.consignor_phone} />
              <InfoRow icon={<User size={14} />} label="Email" value={shipment.consignor_email} />
              <InfoRow
                icon={<MapPin size={14} />}
                label="Address"
                value={`${shipment.consignor_address}, ${shipment.consignor_city}, ${shipment.consignor_state} — ${shipment.consignor_pincode}, ${shipment.consignor_country}`}
                full
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Consignee (Receiver)" subtitle="Delivery details" />
            <div className={styles.infoGrid}>
              <InfoRow icon={<User size={14} />} label="Name" value={shipment.consignee_name} />
              <InfoRow icon={<User size={14} />} label="Phone" value={shipment.consignee_phone} />
              <InfoRow icon={<User size={14} />} label="Email" value={shipment.consignee_email} />
              <InfoRow
                icon={<MapPin size={14} />}
                label="Address"
                value={`${shipment.consignee_address}, ${shipment.consignee_city}, ${shipment.consignee_state} — ${shipment.consignee_pincode}, ${shipment.consignee_country}`}
                full
              />
            </div>
          </Card>

          {!shipment.return_same_as_pickup && (
            <Card>
              <CardHeader title="Return Address" />
              <div className={styles.infoGrid}>
                <InfoRow
                  icon={<MapPin size={14} />}
                  label="Address"
                  value={`${shipment.return_address}, ${shipment.return_city}, ${shipment.return_state} — ${shipment.return_pincode}, ${shipment.return_country}`}
                  full
                />
              </div>
            </Card>
          )}

          <Card>
            <CardHeader title="Package Details" />
            <div className={styles.infoGrid}>
              <InfoRow
                icon={<Box size={14} />}
                label="Dimensions"
                value={`${shipment.box_length} × ${shipment.box_breadth} × ${shipment.box_height} cm`}
              />
              <InfoRow
                icon={<Box size={14} />}
                label="Weight"
                value={formatWeight(shipment.box_weight, shipment.box_weight_unit)}
              />
              <InfoRow icon={<Package size={14} />} label="Item" value={shipment.item_description} />
              <InfoRow
                icon={<CreditCard size={14} />}
                label="Shipment Value"
                value={formatCurrency(shipment.shipment_value)}
              />
              {shipment.ewaybill && (
                <InfoRow icon={<Package size={14} />} label="E-waybill" value={shipment.ewaybill} />
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Payment & Shipping" />
            <div className={styles.infoGrid}>
              <InfoRow icon={<CreditCard size={14} />} label="Payment Mode" value={shipment.payment_mode} />
              <InfoRow icon={<Truck size={14} />} label="Shipping Mode" value={shipment.shipping_mode} />
              {shipment.payment_mode === 'COD' && (
                <InfoRow
                  icon={<CreditCard size={14} />}
                  label="COD Amount"
                  value={formatCurrency(shipment.cod_amount)}
                />
              )}
            </div>
          </Card>

          {isDelivered && (
            <Card>
              <CardHeader
                title="Proof of Delivery"
                subtitle="Photo captured by the delivery partner at the doorstep"
                actions={
                  pod && (
                    <a href={pod.url} target="_blank" rel="noreferrer">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<ExternalLink size={14} />}
                      >
                        Open
                      </Button>
                    </a>
                  )
                }
              />
              {isPodLoading ? (
                <div className={styles.podCenter}>
                  <Spinner size="md" />
                </div>
              ) : pod ? (
                <a
                  href={pod.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.podLink}
                >
                  <img
                    src={pod.url}
                    alt="Proof of delivery"
                    className={styles.podImage}
                  />
                </a>
              ) : (
                <div className={styles.podEmpty}>
                  <ImageIcon size={22} />
                  <span>No proof of delivery available for this shipment.</span>
                </div>
              )}
            </Card>
          )}
        </div>

        <div className={styles.sideColumn}>
          <Card>
            <CardHeader title="Tracking Timeline" subtitle={`${tracking?.events.length ?? 0} events`} />
            {!tracking || tracking.events.length === 0 ? (
              <div className={styles.noEvents}>
                <Clock size={20} />
                <span>No tracking events yet</span>
              </div>
            ) : (
              <ol className={styles.timeline}>
                {tracking.events.map((event, index) => {
                  const variant = getStatusVariant(event.status);
                  return (
                    <li key={index} className={styles.timelineItem}>
                      <div className={cn(styles.timelineDot, styles[variant])}>
                        {getStatusIcon(event.status)}
                      </div>
                      {index < tracking.events.length - 1 && <div className={styles.timelineLine} />}
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineHeader}>
                          <span className={styles.timelineStatus}>{event.status}</span>
                          <span className={styles.timelineTime}>{formatDateTime(event.timestamp)}</span>
                        </div>
                        <p className={styles.timelineDesc}>{event.description}</p>
                        {event.location && event.location !== 'N/A' && (
                          <span className={styles.timelineLocation}>
                            <MapPin size={12} /> {event.location}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  full?: boolean;
}

function InfoRow({ icon, label, value, full = false }: InfoRowProps) {
  return (
    <div className={cn(styles.infoRow, full && styles.infoRowFull)}>
      <span className={styles.infoLabel}>
        <span className={styles.infoIcon}>{icon}</span>
        {label}
      </span>
      <span className={styles.infoValue}>{value || '—'}</span>
    </div>
  );
}

function getStatusVariant(status: string): string {
  switch (status) {
    case SHIPMENT_STATUS.DELIVERED:
    case SHIPMENT_STATUS.NDR_RESOLVED:
      return 'dotSuccess';
    case SHIPMENT_STATUS.IN_TRANSIT:
    case SHIPMENT_STATUS.OUT_FOR_DELIVERY:
      return 'dotInfo';
    case SHIPMENT_STATUS.CANCELLED:
    case SHIPMENT_STATUS.NDR:
      return 'dotDanger';
    case SHIPMENT_STATUS.RTO:
    case SHIPMENT_STATUS.PICKUP_SCHEDULED:
      return 'dotWarning';
    default:
      return 'dotNeutral';
  }
}

function getStatusIcon(status: string): React.ReactNode {
  switch (status) {
    case SHIPMENT_STATUS.DELIVERED:
    case SHIPMENT_STATUS.NDR_RESOLVED:
      return <CheckCircle2 size={14} />;
    case SHIPMENT_STATUS.CANCELLED:
      return <XCircle size={14} />;
    case SHIPMENT_STATUS.NDR:
      return <AlertTriangle size={14} />;
    case SHIPMENT_STATUS.IN_TRANSIT:
    case SHIPMENT_STATUS.OUT_FOR_DELIVERY:
      return <Truck size={14} />;
    default:
      return <Package size={14} />;
  }
}