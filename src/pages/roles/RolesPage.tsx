import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { rolesApi } from '@/api/roles.api';
import { ROLE_SORTABLE } from '@/constants/sortables';
import { PERMISSIONS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { usePermission } from '@/hooks/usePermission';
import { usePagination } from '@/hooks/usePagination';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { DataTable } from '@/components/ui/DataTable';
import type { Column } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { Card } from '@/components/ui/Card';
import { DeleteRoleDialog } from './components/DeleteRoleDialog';
import type { Role } from '@/types/role.types';
import styles from './RolesPage.module.css';

export function RolesPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const canCreate = hasPermission(PERMISSIONS.ROLE_CREATE);
  const canUpdate = hasPermission(PERMISSIONS.ROLE_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.ROLE_DELETE);
  const canView = hasPermission(PERMISSIONS.ROLE_VIEW) || canCreate || canUpdate || canDelete;

  const { page, setPage } = usePagination(1, 10);
  const [identifier, setIdentifier] = useState('');
  const [sortBy, setSortBy] = useState<string>(ROLE_SORTABLE.ID);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const filters = useMemo(
    () => ({
      page,
      limit: 10,
      identifier: identifier || undefined,
      sort_by: sortBy,
      sort_direction: sortDirection,
    }),
    [page, identifier, sortBy, sortDirection],
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['roles', filters],
    queryFn: () => rolesApi.getAll(filters),
    enabled: canView,
  });

  const rows = data?.data.rows ?? [];
  const pagination = data?.data.pagination;

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortBy(column);
    setSortDirection(direction);
    setPage(1);
  };

  const columns: Column<Role>[] = [
    {
      key: 'id',
      header: 'ID',
      sortableKey: ROLE_SORTABLE.ID,
      width: '80px',
      render: (row) => <span className={styles.idMono}>#{row.id}</span>,
    },
    {
      key: 'title',
      header: 'Role Name',
      render: (row) => (
        <Link to={ROUTES.ROLE_DETAIL(row.id)} className={styles.roleLink}>
          {row.title}
        </Link>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => {
        const items = [];
        if (canView) {
          items.push({
            label: 'View / Edit',
            icon: <Pencil size={14} />,
            onClick: () => navigate(ROUTES.ROLE_DETAIL(row.id)),
          });
        }
        if (canDelete) {
          items.push({
            label: 'Delete',
            icon: <Trash2 size={14} />,
            danger: true,
            onClick: () => setDeleteTarget(row),
          });
        }
        return <ActionMenu items={items} />;
      },
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Roles & Permissions"
        subtitle="Create roles and manage their permissions."
        actions={
          canCreate && (
            <Link to={ROUTES.ROLE_CREATE}>
              <Button variant="primary" leftIcon={<Plus size={16} />}>
                New Role
              </Button>
            </Link>
          )
        }
      />

      <Card padded={false}>
        <div className={styles.filtersBar}>
          <SearchInput
            value={identifier}
            onChange={(v) => {
              setIdentifier(v);
              setPage(1);
            }}
            placeholder="Search roles…"
          />
        </div>

        <div className={styles.tableWrapper}>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            isLoading={isLoading || (isFetching && rows.length === 0)}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
            emptyState={
              <EmptyState
                icon={<Shield size={24} />}
                title={identifier ? 'No roles found' : 'No roles yet'}
                description={
                  identifier ? 'Try adjusting your search.' : 'Create your first role to get started.'
                }
                action={
                  canCreate && !identifier ? (
                    <Link to={ROUTES.ROLE_CREATE}>
                      <Button variant="primary" leftIcon={<Plus size={16} />}>
                        New Role
                      </Button>
                    </Link>
                  ) : undefined
                }
              />
            }
          />
        </div>

        {pagination && (
          <div className={styles.paginationWrapper}>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              currentCount={pagination.currentCount}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>

      <DeleteRoleDialog role={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </div>
  );
}