import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { authApi } from '@/api/auth.api';
import { changePasswordSchema } from '@/validations/auth.validations';
import type { ChangePasswordFormValues } from '@/validations/auth.validations';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './ChangePasswordModal.module.css';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ChangePasswordFormValues) => authApi.changePassword(values),
    onSuccess: () => {
      toast.success('Password changed successfully');
      reset();
      onClose();
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to change password'),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: ChangePasswordFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      subtitle="Update your account password."
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            isLoading={mutation.isPending}
          >
            Update Password
          </Button>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Current Password"
          type="password"
          autoComplete="current-password"
          error={errors.oldPassword?.message}
          requiredMark
          togglePassword
          {...register('oldPassword')}
        />
        <Input
          label="New Password"
          type="password"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          requiredMark
          togglePassword
          {...register('newPassword')}
        />
        <Input
          label="Confirm New Password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmNewPassword?.message}
          requiredMark
          togglePassword
          {...register('confirmNewPassword')}
        />
      </form>
    </Modal>
  );
}