import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Search, Truck } from 'lucide-react';
import { deliveryPartnersApi } from '@/api/delivery-partners.api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useDebounce } from '@/hooks/useDebounce';
import { formatFullName } from '@/utils/format';
import type { ShipmentWithDeliveryPartner } from '@/types/shipment.types';
import type { DeliveryPartner } from '@/types/delivery-partner.types';
import styles from './AssignDeliveryPartnerDialog.module.css';

interface AssignDeliveryPartnerDialogProps {
  shipment: ShipmentWithDeliveryPartner | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignDeliveryPartnerDialog({
  shipment,
  onClose,
  onSuccess,
}: AssignDeliveryPartnerDialogProps) {
  const queryClient = useQueryClient();
  const [identifier, setIdentifier] = useState('');
  const [selected, setSelected] = useState<DeliveryPartner | null>(null);
  const debouncedIdentifier = useDebounce(identifier, 300);

  useEffect(() => {
    if (shipment) {
      setSelected(null);
      setIdentifier('');
    }
  }, [shipment]);

  const { data, isLoading } = useQuery({
    queryKey: ['delivery-partners', 'assign', debouncedIdentifier],
    queryFn: () =>
      deliveryPartnersApi.getAll({
        page: 1,
        limit: 20,
        identifier: debouncedIdentifier || undefined,
        sort_by: 'id',
        sort_direction: 'desc',
      }),
    enabled: Boolean(shipment),
  });

  const partners = (data?.data.rows ?? []).filter((p) => p.is_active);

  const mutation = useMutation({
    mutationFn: () =>
      deliveryPartnersApi.assignShipments(selected!.id, { shipment_ids: [shipment!.id] }),
    onSuccess: () => {
      toast.success('Delivery partner assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign delivery partner');
    },
  });

  if (!shipment) return null;

  return (
    <Modal
      isOpen={Boolean(shipment)}
      onClose={onClose}
      title="Assign Delivery Partner"
      subtitle={`Shipment ${shipment.generated_id} → ${shipment.consignee_name}`}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => mutation.mutate()}
            disabled={!selected}
            isLoading={mutation.isPending}
          >
            Assign Partner
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        <Input
          placeholder="Search delivery partners by name, email, phone…"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          leftIcon={<Search size={16} />}
        />

        <div className={styles.list}>
          {isLoading ? (
            <div className={styles.center}>
              <Spinner size="md" />
            </div>
          ) : partners.length === 0 ? (
            <div className={styles.empty}>
              <Truck size={22} />
              <p>No active delivery partners found</p>
            </div>
          ) : (
            partners.map((partner) => {
              const isSelected = selected?.id === partner.id;
              return (
                <button
                  key={partner.id}
                  type="button"
                  className={`${styles.partnerItem} ${isSelected ? styles.partnerSelected : ''}`}
                  onClick={() => setSelected(partner)}
                >
                  <div className={styles.partnerIcon}>
                    <Truck size={16} />
                  </div>
                  <div className={styles.partnerInfo}>
                    <span className={styles.partnerName}>
                      {formatFullName(partner.first_name, partner.middle_name, partner.last_name)}
                    </span>
                    <span className={styles.partnerMeta}>
                      {partner.generated_id} · {partner.phone}
                    </span>
                  </div>
                  <Badge variant={isSelected ? 'primary' : 'success'} dot>
                    {isSelected ? 'Selected' : 'Active'}
                  </Badge>
                </button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}