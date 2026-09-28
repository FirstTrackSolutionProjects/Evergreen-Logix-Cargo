import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { deliveryPartnersApi } from '@/api/delivery-partners.api';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { DeliveryPartner } from '@/types/delivery-partner.types';

interface ConfirmToggleDialogProps {
  partner: DeliveryPartner | null;
  onClose: () => void;
}

export function ConfirmToggleDialog({ partner, onClose }: ConfirmToggleDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      partner!.is_active
        ? deliveryPartnersApi.deactivate(partner!.id)
        : deliveryPartnersApi.activate(partner!.id),
    onSuccess: () => {
      toast.success(`Delivery partner ${partner!.is_active ? 'deactivated' : 'activated'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['delivery-partners'] });
      onClose();
    },
    onError: (error: Error) => toast.error(error.message || 'Action failed'),
  });

  if (!partner) return null;

  return (
    <ConfirmDialog
      isOpen={Boolean(partner)}
      onClose={onClose}
      onConfirm={() => mutation.mutate()}
      title={partner.is_active ? 'Deactivate delivery partner?' : 'Activate delivery partner?'}
      message={
        partner.is_active
          ? `${partner.first_name} ${partner.last_name} won't be able to log in or receive new shipment assignments.`
          : `${partner.first_name} ${partner.last_name} will be able to log in and receive shipment assignments.`
      }
      confirmLabel={partner.is_active ? 'Deactivate' : 'Activate'}
      variant={partner.is_active ? 'danger' : 'primary'}
      isLoading={mutation.isPending}
    />
  );
}