import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { deliveryPartnersApi } from '@/api/delivery-partners.api';
import { updateDeliveryPartnerSchema } from '@/validations/delivery-partner.validations';
import type { UpdateDeliveryPartnerFormValues } from '@/validations/delivery-partner.validations';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { DeliveryPartner } from '@/types/delivery-partner.types';
import styles from './DeliveryPartnerModal.module.css';

interface EditDeliveryPartnerModalProps {
  partner: DeliveryPartner | null;
  onClose: () => void;
}

export function EditDeliveryPartnerModal({ partner, onClose }: EditDeliveryPartnerModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateDeliveryPartnerFormValues>({
    resolver: zodResolver(updateDeliveryPartnerSchema),
  });

  useEffect(() => {
    if (partner) {
      reset({
        first_name: partner.first_name,
        middle_name: partner.middle_name,
        last_name: partner.last_name,
        phone: partner.phone,
        email: partner.email,
      });
    }
  }, [partner, reset]);

  const mutation = useMutation({
    mutationFn: (values: UpdateDeliveryPartnerFormValues) =>
      deliveryPartnersApi.update(partner!.id, values),
    onSuccess: () => {
      toast.success('Delivery partner updated successfully');
      queryClient.invalidateQueries({ queryKey: ['delivery-partners'] });
      onClose();
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update delivery partner'),
  });

  if (!partner) return null;

  return (
    <Modal
      isOpen={Boolean(partner)}
      onClose={onClose}
      title="Edit Delivery Partner"
      subtitle={partner.generated_id}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit((values) => mutation.mutate(values))}
            isLoading={mutation.isPending}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
        <div className={styles.nameGrid}>
          <Input label="First Name" error={errors.first_name?.message} requiredMark {...register('first_name')} />
          <Input label="Middle Name" error={errors.middle_name?.message} {...register('middle_name')} />
          <Input label="Last Name" error={errors.last_name?.message} {...register('last_name')} />
        </div>
        <Input label="Phone" maxLength={10} error={errors.phone?.message} requiredMark {...register('phone')} />
        <Input label="Email" type="email" error={errors.email?.message} requiredMark {...register('email')} />
      </form>
    </Modal>
  );
}