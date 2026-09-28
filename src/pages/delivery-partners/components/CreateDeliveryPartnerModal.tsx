import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { deliveryPartnersApi } from '@/api/delivery-partners.api';
import { createDeliveryPartnerSchema } from '@/validations/delivery-partner.validations';
import type { CreateDeliveryPartnerFormValues } from '@/validations/delivery-partner.validations';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './DeliveryPartnerModal.module.css';

interface CreateDeliveryPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateDeliveryPartnerModal({ isOpen, onClose }: CreateDeliveryPartnerModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDeliveryPartnerFormValues>({
    resolver: zodResolver(createDeliveryPartnerSchema),
    defaultValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      phone: '',
      email: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CreateDeliveryPartnerFormValues) => deliveryPartnersApi.create(values),
    onSuccess: () => {
      toast.success('Delivery partner created successfully');
      queryClient.invalidateQueries({ queryKey: ['delivery-partners'] });
      reset();
      onClose();
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create delivery partner'),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Delivery Partner"
      subtitle="A temporary password will be emailed to them automatically."
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit((values) => mutation.mutate(values))}
            isLoading={mutation.isPending}
          >
            Create Partner
          </Button>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
        <div className={styles.nameGrid}>
          <Input label="First Name" placeholder="John" error={errors.first_name?.message} requiredMark {...register('first_name')} />
          <Input label="Middle Name" placeholder="M" error={errors.middle_name?.message} {...register('middle_name')} />
          <Input label="Last Name" placeholder="Doe" error={errors.last_name?.message} {...register('last_name')} />
        </div>
        <Input
          label="Phone"
          placeholder="10-digit mobile number"
          maxLength={10}
          error={errors.phone?.message}
          requiredMark
          {...register('phone')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="partner@example.com"
          error={errors.email?.message}
          requiredMark
          {...register('email')}
        />
      </form>
    </Modal>
  );
}