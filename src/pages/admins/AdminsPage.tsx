import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Plus, Eye, Pencil, Power, PowerOff, Shield } from 'lucide-react';
import { adminsApi } from '@/api/admins.api';
import { ADMIN_SORTABLE } from '@/constants/sortables';
import { PERMISSIONS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { usePermission } from '@/hooks/usePermission';
import { usePagination } from '@/hooks/usePagination';
import { formatDate, formatFullName } from '@/utils/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { DataTable } from '@/components/ui/DataTable';
import type { Column } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { ActiveBadge } from '@/components/status/ActiveBadge';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { Card } from '@/components/ui/Card';
import { CreateAdminModal } from './components/CreateAdminModal';
import { EditAdminModal } from './components/EditAdminModal';
import { ConfirmToggleDialog } from './components/ConfirmToggleDialog';
import type { Admin } from '@/types/admin.types';
import styles from './AdminsPage.module.css';

export function AdminsPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const canCreate = hasPermission(PERMISSIONS.ADMIN_CREATE);
  const canUpdate = hasPermission(PERMISSIONS.ADMIN_UPDATE);
  const canView = hasPermission(PERMISSIONS.ADMIN_VIEW) || canCreate || canUpdate;

  const { page, setPage } = usePagination(1, 10);
  const [identifier, setIdentifier] = useState('');
  const [sortBy, setSortBy] = useState<string>(ADMIN_SORTABLE.ID);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Admin | null>(null);
  const [toggleTarget, setToggleTarget] = useState<Admin | null>(null);

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
    queryKey: ['admins', filters],
    queryFn: () => adminsApi.getAll(filters),
    enabled: canView,
  });

  const rows = data?.data.rows ?? [];
  const pagination = data?.data.pagination;

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortBy(column);
    setSortDirection(direction);
    setPage(1);
  };

  const columns: Column<Admin>[] = [
    {
      key: 'generated_id',
      header: 'Admin ID',
      sortableKey: ADMIN_SORTABLE.ID,
      render: (row) => <span className={styles.idMono}>{row.generated_id}</span>,
    },
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <div className={styles.cellStack}>
          <span className={styles.cellPrimary}>
            {formatFullName(row.first_name, row.middle_name, row.last_name)}
          </span>
          <span className={styles.cellSecondary}>{row.email}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (row) => <span className={styles.cellMuted}>{row.phone}</span>,
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) =>
        row.is_superadmin ? (
          <Badge variant="primary" dot>
            <Shield size={11} /> Super Admin
          </Badge>
        ) : (
          <Badge variant="neutral">Admin</Badge>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <ActiveBadge isActive={row.is_active} />,
    },
    {
      key: 'created_at',
      header: 'Created',
      sortableKey: ADMIN_SORTABLE.CREATED_AT,
      render: (row) => <span className={styles.cellMuted}>{formatDate(row.created_at)}</span>,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => {
        const items = [];
        if (canView) {
          items.push({
            label: 'View',
            icon: <Eye size={14} />,
            onClick: () => navigate(ROUTES.ADMIN_DETAIL(row.id)),
          });
        }
        if (canUpdate && !row.is_superadmin) {
          items.push({
            label: 'Edit',
            icon: <Pencil size={14} />,
            onClick: () => setEditTarget(row),
          });
          items.push({
            label: row.is_active ? 'Deactivate' : 'Activate',
            icon: row.is_active ? <PowerOff size={14} /> : <Power size={14} />,
            danger: row.is_active,
            onClick: () => setToggleTarget(row),
          });
        }
        return <ActionMenu items={items} />;
      },
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Admins"
        subtitle="Manage admin accounts and their role assignments."
        actions={
          canCreate && (
            <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
              New Admin
            </Button>
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
            placeholder="Search by name or email…"
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
                icon={<Users size={24} />}
                title={identifier ? 'No admins found' : 'No admins yet'}
                description={
                  identifier ? 'Try adjusting your search.' : 'Create your first admin account.'
                }
                action={
                  canCreate && !identifier ? (
                    <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
                      New Admin
                    </Button>
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

      <CreateAdminModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
      <EditAdminModal admin={editTarget} onClose={() => setEditTarget(null)} />
      <ConfirmToggleDialog admin={toggleTarget} onClose={() => setToggleTarget(null)} />
    </div>
  );
}