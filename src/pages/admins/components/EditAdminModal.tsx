import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { adminsApi } from '@/api/admins.api';
import { rolesApi } from '@/api/roles.api';
import { updateAdminSchema } from '@/validations/admin.validations';
import type { UpdateAdminFormValues } from '@/validations/admin.validations';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import type { Admin } from '@/types/admin.types';
import styles from './AdminModal.module.css';

interface EditAdminModalProps {
  admin: Admin | null;
  onClose: () => void;
}

export function EditAdminModal({ admin, onClose }: EditAdminModalProps) {
  const queryClient = useQueryClient();

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles', 'all'],
    queryFn: () => rolesApi.getAll({ page: 1, limit: 100, sort_by: 'id', sort_direction: 'asc' }),
    enabled: Boolean(admin),
  });

  const { data: detail } = useQuery({
    queryKey: ['admin', admin?.id],
    queryFn: () => adminsApi.getById(admin!.id),
    enabled: Boolean(admin),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateAdminFormValues>({
    resolver: zodResolver(updateAdminSchema),
  });

  useEffect(() => {
    if (admin) {
      reset({
        first_name: admin.first_name,
        middle_name: admin.middle_name,
        last_name: admin.last_name,
        phone: admin.phone,
        email: admin.email,
        role_ids: [],
      });
    }
  }, [admin, reset]);

  const selectedRoles = watch('role_ids') ?? [];

  const toggleRole = (roleId: number) => {
    const next = selectedRoles.includes(roleId)
      ? selectedRoles.filter((r) => r !== roleId)
      : [...selectedRoles, roleId];
    setValue('role_ids', next, { shouldValidate: true });
  };

  const mutation = useMutation({
    mutationFn: (values: UpdateAdminFormValues) => adminsApi.update(admin!.id, values),
    onSuccess: () => {
      toast.success('Admin updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['admin', admin?.id] });
      onClose();
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update admin'),
  });

  if (!admin) return null;

  const onSubmit = (values: UpdateAdminFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Modal
      isOpen={Boolean(admin)}
      onClose={onClose}
      title="Edit Admin"
      subtitle={admin.generated_id}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={mutation.isPending}>
            Save Changes
          </Button>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.nameGrid}>
          <Input label="First Name" error={errors.first_name?.message} requiredMark {...register('first_name')} />
          <Input label="Middle Name" error={errors.middle_name?.message} {...register('middle_name')} />
          <Input label="Last Name" error={errors.last_name?.message} {...register('last_name')} />
        </div>
        <Input label="Phone" maxLength={10} error={errors.phone?.message} requiredMark {...register('phone')} />
        <Input label="Email" type="email" error={errors.email?.message} requiredMark {...register('email')} />

        <div>
          <div className={styles.sectionLabel}>Roles</div>
          <div className={styles.rolesGrid}>
            {rolesLoading ? (
              <div className={styles.rolesEmpty}>
                <Spinner size="sm" />
              </div>
            ) : rolesData?.data.rows.length === 0 ? (
              <div className={styles.rolesEmpty}>No roles available.</div>
            ) : (
              rolesData?.data.rows.map((role) => {
                const checked = (detail?.role_ids ?? []).includes(role.id) || selectedRoles.includes(role.id);
                return (
                  <label key={role.id} className={`${styles.roleRow} ${checked ? styles.roleRowChecked : ''}`}>
                    <input
                      type="checkbox"
                      className={styles.roleCheckbox}
                      checked={checked}
                      onChange={() => toggleRole(role.id)}
                    />
                    <span className={styles.roleTitle}>{role.title}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}