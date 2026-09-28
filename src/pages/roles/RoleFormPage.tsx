import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { rolesApi } from '@/api/roles.api';
import { permissionsApi } from '@/api/permissions.api';
import { createRoleSchema } from '@/validations/role.validations';
import type { CreateRoleFormValues } from '@/validations/role.validations';
import { PERMISSION_GROUPS, PERMISSION_LABELS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/utils/cn';
import styles from './RoleFormPage.module.css';

interface RoleFormPageProps {
  mode: 'create' | 'edit';
}

export function RoleFormPage({ mode }: RoleFormPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = mode === 'edit';

  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions', 'all'],
    queryFn: () => permissionsApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: role, isLoading: roleLoading } = useQuery({
    queryKey: ['role', id],
    queryFn: () => rolesApi.getById(id!),
    enabled: isEdit && Boolean(id),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { title: '', permissions: [] },
  });

  const selectedPermissions = watch('permissions') ?? [];

  useEffect(() => {
    if (isEdit && role) {
      reset({
        title: role.title,
        permissions: role.permissions,
      });
    }
  }, [isEdit, role, reset]);

  const togglePermission = (permissionId: string) => {
    const next = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter((p) => p !== permissionId)
      : [...selectedPermissions, permissionId];
    setValue('permissions', next, { shouldValidate: true });
  };

  const toggleGroup = (groupId: string[]) => {
    const allSelected = groupId.every((p) => selectedPermissions.includes(p));
    let next: string[];
    if (allSelected) {
      next = selectedPermissions.filter((p) => !groupId.includes(p));
    } else {
      const set = new Set([...selectedPermissions, ...groupId]);
      next = Array.from(set);
    }
    setValue('permissions', next, { shouldValidate: true });
  };

  const mutation = useMutation({
    mutationFn: (values: CreateRoleFormValues) =>
      isEdit ? rolesApi.update(id!, values) : rolesApi.create(values),
    onSuccess: () => {
      toast.success(`Role ${isEdit ? 'updated' : 'created'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      if (isEdit) queryClient.invalidateQueries({ queryKey: ['role', id] });
      navigate(ROUTES.ROLES);
    },
    onError: (error: Error) =>
      toast.error(error.message || `Failed to ${isEdit ? 'update' : 'create'} role`),
  });

  const onSubmit = async (values: CreateRoleFormValues) => {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  if ((isEdit && roleLoading) || permissionsLoading) {
    return (
      <div className={styles.center}>
        <Spinner size="lg" />
      </div>
    );
  }

  const permissionNameMap = new Map<string, string>();
  permissions?.forEach((p) => permissionNameMap.set(p.id, p.name));

  return (
    <form className={styles.page} onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader
        title={isEdit ? `Edit Role${role ? ` — ${role.title}` : ''}` : 'Create Role'}
        subtitle={
          isEdit
            ? 'Update the role name and its permission set.'
            : 'Give the role a name and select the permissions it should grant.'
        }
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.ROLES)}
              leftIcon={<ArrowLeft size={16} />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<Save size={16} />}
            >
              {isEdit ? 'Save Changes' : 'Create Role'}
            </Button>
          </>
        }
      />

      <Card>
        <Input
          label="Role Name"
          placeholder="e.g. Operations Manager"
          error={errors.title?.message}
          requiredMark
          {...register('title')}
        />
      </Card>

      <Card>
        <div className={styles.permissionsHeader}>
          <div>
            <h3 className={styles.permissionsTitle}>Permissions</h3>
            <p className={styles.permissionsSubtitle}>
              {selectedPermissions.length} of {permissions?.length ?? 0} selected
            </p>
          </div>
          {errors.permissions && (
            <span className={styles.errorText}>{errors.permissions.message}</span>
          )}
        </div>

        <div className={styles.groups}>
          {PERMISSION_GROUPS.map((group) => {
            const groupIds = group.permissions as unknown as string[];
            const allSelected = groupIds.every((p) => selectedPermissions.includes(p));
            const someSelected = groupIds.some((p) => selectedPermissions.includes(p));

            return (
              <div key={group.label} className={styles.group}>
                <div className={styles.groupHeader}>
                  <label className={styles.groupCheckLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = !allSelected && someSelected;
                      }}
                      onChange={() => toggleGroup(groupIds)}
                    />
                    <span className={styles.groupLabel}>{group.label}</span>
                  </label>
                  <span className={styles.groupCount}>
                    {groupIds.filter((p) => selectedPermissions.includes(p)).length}/{groupIds.length}
                  </span>
                </div>

                <div className={styles.permissionList}>
                  {groupIds.map((permissionId) => {
                    const checked = selectedPermissions.includes(permissionId);
                    const displayName =
                      permissionNameMap.get(permissionId) ??
                      PERMISSION_LABELS[permissionId] ??
                      permissionId;
                    return (
                      <label
                        key={permissionId}
                        className={cn(styles.permissionItem, checked && styles.permissionChecked)}
                      >
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={checked}
                          onChange={() => togglePermission(permissionId)}
                        />
                        <div className={styles.permissionInfo}>
                          <span className={styles.permissionName}>{displayName}</span>
                          <span className={styles.permissionId}>{permissionId}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className={styles.stickyFooter}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(ROUTES.ROLES)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          leftIcon={<Save size={16} />}
        >
          {isEdit ? 'Save Changes' : 'Create Role'}
        </Button>
      </div>
    </form>
  );
}