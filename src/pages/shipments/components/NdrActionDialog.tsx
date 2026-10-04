import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';
import { shipmentsApi } from '@/api/shipments.api';
import { NDR_ACTIONS_FOR_REASON, NDR_REASON } from '@/constants/enums';
import type { NdrAction } from '@/constants/enums';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Spinner } from '@/components/ui/Spinner';
import type { ShipmentWithDeliveryPartner } from '@/types/shipment.types';
import type { TakeNdrActionPayload } from '@/types/shipment.types';
import styles from './NdrActionDialog.module.css';

interface NdrActionDialogProps {
  shipment: ShipmentWithDeliveryPartner | null;
  onClose: () => void;
  onSuccess: () => void;
}

const REASON_LABELS: Record<string, string> = {
  [NDR_REASON.CONSIGNEE_NOT_AVAILABLE]: 'Consignee Not Available',
  [NDR_REASON.CONSIGNEE_ADDRESS_INCORRECT]: 'Consignee Address Incorrect',
  [NDR_REASON.CONSIGNEE_REFUSED]: 'Consignee Refused',
};

export function NdrActionDialog({ shipment, onClose, onSuccess }: NdrActionDialogProps) {
  const queryClient = useQueryClient();
  const [selectedAction, setSelectedAction] = useState<NdrAction | ''>('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Fetch the reason the delivery partner already reported when raising the NDR.
  const { data: ndrReport, isLoading: isLoadingReason } = useQuery({
    queryKey: ['shipment', shipment?.id, 'ndr-report'],
    queryFn: () => shipmentsApi.getNdrReport(shipment!.id),
    enabled: Boolean(shipment),
  });

  const reportedReason = ndrReport?.reason ?? '';

  useEffect(() => {
    if (shipment) {
      setSelectedAction('');
      setAddress(shipment.consignee_address ?? '');
      setCity(shipment.consignee_city ?? '');
      setState(shipment.consignee_state ?? '');
      setPincode(shipment.consignee_pincode ?? '');
    }
  }, [shipment]);

  const mutation = useMutation({
    mutationFn: (payload: TakeNdrActionPayload) => shipmentsApi.takeNdrAction(shipment!.id, payload),
    onSuccess: () => {
      toast.success('NDR action taken successfully');
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['shipment', shipment?.id] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to take NDR action');
    },
  });

  if (!shipment) return null;

  const availableActions = reportedReason
    ? NDR_ACTIONS_FOR_REASON[reportedReason as keyof typeof NDR_ACTIONS_FOR_REASON]
    : [];

  const requiresAddress = selectedAction === 'UPDATE ADDRESS';

  const handleSubmit = () => {
    if (!selectedAction) {
      toast.error('Select an action');
      return;
    }
    const payload: TakeNdrActionPayload = {
      action: selectedAction,
      address: {
        consignee_address: requiresAddress ? address : '',
        consignee_city: requiresAddress ? city : '',
        consignee_state: requiresAddress ? state : '',
        consignee_pincode: requiresAddress ? pincode : '',
      },
    };
    mutation.mutate(payload);
  };

  return (
    <Modal
      isOpen={Boolean(shipment)}
      onClose={onClose}
      title="Take NDR Action"
      subtitle={`Shipment ${shipment.generated_id} is marked as NDR`}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!selectedAction}
            isLoading={mutation.isPending}
          >
            Submit Action
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        <div className={styles.banner}>
          <AlertTriangle size={18} />
          <span>This shipment requires a non-delivery resolution.</span>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>NDR Reason (reported by delivery partner)</h4>
          {isLoadingReason ? (
            <div className={styles.center}>
              <Spinner size="sm" />
            </div>
          ) : reportedReason ? (
            <div className={`${styles.reasonButton} ${styles.reasonActive}`} style={{ cursor: 'default' }}>
              {REASON_LABELS[reportedReason] ?? reportedReason}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No reason recorded.</p>
          )}
        </div>

        {reportedReason && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Action</h4>
            <div className={styles.actionList}>
              {availableActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  className={`${styles.actionButton} ${selectedAction === action ? styles.actionActive : ''}`}
                  onClick={() => setSelectedAction(action)}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {requiresAddress && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Updated Consignee Address</h4>
            <div className={styles.addressGrid}>
              <div className={styles.fullRow}>
                <Textarea
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full address"
                  requiredMark
                />
              </div>
              <Input
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                requiredMark
              />
              <Input
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                requiredMark
              />
              <Input
                label="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                requiredMark
              />
            </div>
          </div>
        )}

        {mutation.isPending && (
          <div className={styles.center}>
            <Spinner size="md" />
          </div>
        )}
      </div>
    </Modal>
  );
}