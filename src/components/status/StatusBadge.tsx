import { Badge } from '@/components/ui/Badge';
import { SHIPMENT_STATUS } from '@/constants/enums';
import type { ShipmentStatus } from '@/constants/enums';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

const STATUS_VARIANT_MAP: Record<ShipmentStatus, BadgeVariant> = {
  [SHIPMENT_STATUS.MANIFESTED]: 'neutral',
  [SHIPMENT_STATUS.PICKUP_SCHEDULED]: 'info',
  [SHIPMENT_STATUS.IN_TRANSIT]: 'primary',
  [SHIPMENT_STATUS.OUT_FOR_DELIVERY]: 'warning',
  [SHIPMENT_STATUS.DELIVERED]: 'success',
  [SHIPMENT_STATUS.RTO]: 'warning',
  [SHIPMENT_STATUS.RTO_DELIVERED]: 'neutral',
  [SHIPMENT_STATUS.CANCELLED]: 'danger',
  [SHIPMENT_STATUS.NDR]: 'danger',
  [SHIPMENT_STATUS.NDR_RESOLVED]: 'success',
};

interface StatusBadgeProps {
  status: ShipmentStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = STATUS_VARIANT_MAP[status as ShipmentStatus] ?? 'neutral';
  return (
    <Badge variant={variant} dot>
      {status}
    </Badge>
  );
}