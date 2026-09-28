import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { rolesApi } from '@/api/roles.api';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { Role } from '@/types/role.types';

interface DeleteRoleDialogProps {
  role: Role | null;
  onClose: () => void;
}

export function DeleteRoleDialog({ role, onClose }: DeleteRoleDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => rolesApi.delete(role!.id),
    onSuccess: () => {
      toast.success('Role deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      onClose();
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete role'),
  });

  if (!role) return null;

  return (
    <ConfirmDialog
      isOpen={Boolean(role)}
      onClose={onClose}
      onConfirm={() => mutation.mutate()}
      title="Delete role?"
      message={`Are you sure you want to delete "${role.title}"? Any admins assigned to this role will lose its permissions. This action cannot be undone.`}
      confirmLabel="Delete Role"
      variant="danger"
      isLoading={mutation.isPending}
    />
  );
}