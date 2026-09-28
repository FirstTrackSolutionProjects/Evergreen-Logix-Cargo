import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { adminsApi } from '@/api/admins.api';
import { rolesApi } from '@/api/roles.api';
import { createAdminSchema } from '@/validations/admin.validations';
import type { CreateAdminFormValues } from '@/validations/admin.validations';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import styles from './AdminModal.module.css';

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAdminModal({ isOpen, onClose }: CreateAdminModalProps) {
  const queryClient = useQueryClient();

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles', 'all'],
    queryFn: () => rolesApi.getAll({ page: 1, limit: 100, sort_by: 'id', sort_direction: 'asc' }),
    enabled: isOpen,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      phone: '',
      email: '',
      role_ids: [],
    },
  });

  const selectedRoles = watch('role_ids') ?? [];

  const toggleRole = (roleId: number) => {
    const next = selectedRoles.includes(roleId)
      ? selectedRoles.filter((r) => r !== roleId)
      : [...selectedRoles, roleId];
    setValue('role_ids', next, { shouldValidate: true });
  };

  const mutation = useMutation({
    mutationFn: (values: CreateAdminFormValues) => adminsApi.create(values),
    onSuccess: () => {
      toast.success('Admin created successfully. Password emailed to them.');
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      reset();
      onClose();
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create admin'),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: CreateAdminFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Admin"
      subtitle="A temporary password will be emailed to them automatically."
      size="lg"
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
            Create Admin
          </Button>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.nameGrid}>
          <Input label="First Name" placeholder="John" error={errors.first_name?.message} requiredMark {...register('first_name')} />
          <Input label="Middle Name" placeholder="M" error={errors.middle_name?.message} {...register('middle_name')} />
          <Input label="Last Name" placeholder="Doe" error={errors.last_name?.message} {...register('last_name')} />
        </div>
        <Input label="Phone" placeholder="10-digit mobile number" maxLength={10} error={errors.phone?.message} requiredMark {...register('phone')} />
        <Input label="Email" type="email" placeholder="admin@example.com" error={errors.email?.message} requiredMark {...register('email')} />

        <div>
          <div className={styles.sectionLabel}>Assign Roles</div>
          <div className={styles.rolesGrid}>
            {rolesLoading ? (
              <div className={styles.rolesEmpty}>
                <Spinner size="sm" />
              </div>
            ) : rolesData?.data.rows.length === 0 ? (
              <div className={styles.rolesEmpty}>No roles available. Create a role first.</div>
            ) : (
              rolesData?.data.rows.map((role) => {
                const checked = selectedRoles.includes(role.id);
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
          {errors.role_ids && <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>{errors.role_ids.message}</span>}
        </div>
      </form>
    </Modal>
  );
}