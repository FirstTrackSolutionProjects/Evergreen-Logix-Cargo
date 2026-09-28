import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { shipmentsApi } from '@/api/shipments.api';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { ShipmentWithDeliveryPartner } from '@/types/shipment.types';

interface CancelShipmentDialogProps {
  shipment: ShipmentWithDeliveryPartner | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CancelShipmentDialog({ shipment, onClose, onSuccess }: CancelShipmentDialogProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(Boolean(shipment));

  const mutation = useMutation({
    mutationFn: (id: number) => shipmentsApi.cancel(id),
    onSuccess: () => {
      toast.success('Shipment cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setIsOpen(false);
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel shipment');
    },
  });

  if (!shipment) return null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        onClose();
      }}
      onConfirm={() => mutation.mutate(shipment.id)}
      title="Cancel shipment?"
      message={`Are you sure you want to cancel shipment ${shipment.generated_id}? This action cannot be undone.`}
      confirmLabel="Yes, Cancel"
      cancelLabel="Keep Shipment"
      isLoading={mutation.isPending}
      variant="danger"
    />
  );
}