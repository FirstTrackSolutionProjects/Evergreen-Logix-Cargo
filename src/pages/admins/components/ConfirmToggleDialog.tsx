import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { adminsApi } from '@/api/admins.api';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { Admin } from '@/types/admin.types';

interface ConfirmToggleDialogProps {
  admin: Admin | null;
  onClose: () => void;
}

export function ConfirmToggleDialog({ admin, onClose }: ConfirmToggleDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      admin!.is_active ? adminsApi.deactivate(admin!.id) : adminsApi.activate(admin!.id),
    onSuccess: () => {
      toast.success(`Admin ${admin!.is_active ? 'deactivated' : 'activated'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      onClose();
    },
    onError: (error: Error) => toast.error(error.message || 'Action failed'),
  });

  if (!admin) return null;

  return (
    <ConfirmDialog
      isOpen={Boolean(admin)}
      onClose={onClose}
      onConfirm={() => mutation.mutate()}
      title={admin.is_active ? 'Deactivate admin?' : 'Activate admin?'}
      message={
        admin.is_active
          ? `${admin.first_name} ${admin.last_name} won't be able to log in.`
          : `${admin.first_name} ${admin.last_name} will be able to log in again.`
      }
      confirmLabel={admin.is_active ? 'Deactivate' : 'Activate'}
      variant={admin.is_active ? 'danger' : 'primary'}
      isLoading={mutation.isPending}
    />
  );
}