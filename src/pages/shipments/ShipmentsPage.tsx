import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Plus, Eye, Pencil, XCircle, AlertTriangle, Truck, X, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { shipmentsApi } from '@/api/shipments.api';
import { SHIPMENT_STATUS_LIST, SHIPMENT_STATUS } from '@/constants/enums';
import type { ShipmentStatus } from '@/constants/enums';
import { SHIPMENT_SORTABLE } from '@/constants/sortables';
import { PERMISSIONS, SHIPMENT_VIEW_PERMISSIONS } from '@/constants/permissions';
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
import { StatusBadge } from '@/components/status/StatusBadge';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { Card } from '@/components/ui/Card';
import { CancelShipmentDialog } from './components/CancelShipmentDialog';
import { AssignDeliveryPartnerDialog } from './components/AssignDeliveryPartnerDialog';
import { BulkAssignDeliveryPartnerDialog } from './components/BulkAssignDeliveryPartnerDialog';
import { NdrActionDialog } from './components/NdrActionDialog';
import type { ShipmentWithDeliveryPartner } from '@/types/shipment.types';
import generateShipmentLabel, { generateShipmentLabelPDFBase64 } from '@/templates/shipment_label.template';
import { cn } from '@/utils/cn';
import styles from './ShipmentsPage.module.css';

type StatusFilter = ShipmentStatus | 'ALL';

async function downloadShipmentLabel(shipment: ShipmentWithDeliveryPartner) {
  try {
    const html = generateShipmentLabel(shipment);
    const base64 = await generateShipmentLabelPDFBase64(html);
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const objectUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${shipment.generated_id}-label.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to download shipment label.');
  }
}

export function ShipmentsPage() {
  const navigate = useNavigate();
  const { hasAnyPermission, hasPermission } = usePermission();
  const canView = hasAnyPermission(SHIPMENT_VIEW_PERMISSIONS);
  const canCreate = hasPermission(PERMISSIONS.SHIPMENT_CREATE);
  const canUpdate = hasPermission(PERMISSIONS.SHIPMENT_UPDATE);
  const canCancel = hasPermission(PERMISSIONS.SHIPMENT_CANCEL);
  const canAssign = hasPermission(PERMISSIONS.SHIPMENT_ASSIGN_DELIVERY_PARTNER);
  const canNdr = hasPermission(PERMISSIONS.SHIPMENT_TAKE_NDR_ACTION);

  const { page, setPage } = usePagination(1, 10);
  const [identifier, setIdentifier] = useState('');
  const [deliveryPartnerIdentifier, setDeliveryPartnerIdentifier] = useState('');
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [sortBy, setSortBy] = useState<string>(SHIPMENT_SORTABLE.ID);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [cancelTarget, setCancelTarget] = useState<ShipmentWithDeliveryPartner | null>(null);
  const [assignTarget, setAssignTarget] = useState<ShipmentWithDeliveryPartner | null>(null);
  const [ndrTarget, setNdrTarget] = useState<ShipmentWithDeliveryPartner | null>(null);

  // Bulk selection — persists across pagination because it lives here, not in DataTable
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  // The delivery partner filter is hidden on the MANIFESTED tab — no delivery
  // partner can be assigned before manifestation, so the filter is meaningless there.
  const showDeliveryPartnerFilter = status !== SHIPMENT_STATUS.MANIFESTED;

  const filters = useMemo(
    () => ({
      page,
      limit: 10,
      identifier: identifier || undefined,
      status: status === 'ALL' ? undefined : status,
      delivery_partner_identifier:
        showDeliveryPartnerFilter && deliveryPartnerIdentifier
          ? deliveryPartnerIdentifier
          : undefined,
      sort_by: sortBy,
      sort_direction: sortDirection,
    }),
    [
      page,
      identifier,
      status,
      showDeliveryPartnerFilter,
      deliveryPartnerIdentifier,
      sortBy,
      sortDirection,
    ],
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['shipments', filters],
    queryFn: () => shipmentsApi.getAll(filters),
    enabled: canView,
  });

  const rows = data?.data.rows ?? [];
  const pagination = data?.data.pagination;

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortBy(column);
    setSortDirection(direction);
    setPage(1);
  };

  const handleStatusChange = (next: StatusFilter) => {
    setStatus(next);
    // Clear the delivery partner filter when switching to MANIFESTED, since the
    // input is hidden there and a stale value would silently filter results.
    if (next === SHIPMENT_STATUS.MANIFESTED) {
      setDeliveryPartnerIdentifier('');
    }
    setPage(1);
    setSelectedIds([]);
  };

  const handleIdentifierChange = (value: string) => {
    setIdentifier(value);
    setPage(1);
    setSelectedIds([]);
  };

  // Only allow selecting shipments that don't already have a delivery partner
  const isRowSelectable = (row: ShipmentWithDeliveryPartner) =>
    !row.dp_first_name &&
    row.status !== SHIPMENT_STATUS.CANCELLED &&
    row.status !== SHIPMENT_STATUS.DELIVERED;
  const handleDeliveryPartnerIdentifierChange = (value: string) => {
    setDeliveryPartnerIdentifier(value);
    setPage(1);
  };

  const columns: Column<ShipmentWithDeliveryPartner>[] = [
    {
      key: 'generated_id',
      header: 'EGC ID',
      sortableKey: SHIPMENT_SORTABLE.ID,
      render: (row) => (
        <Link to={ROUTES.SHIPMENT_DETAIL(row.id)} className={styles.idLink}>
          {row.generated_id}
        </Link>
      ),
    },
    {
      key: 'consignee_name',
      header: 'Consignee',
      render: (row) => (
        <div className={styles.cellStack}>
          <span className={styles.cellPrimary}>{row.consignee_name}</span>
          <span className={styles.cellSecondary}>{row.consignee_phone}</span>
        </div>
      ),
    },
    {
      key: 'route',
      header: 'From → To',
      render: (row) => (
        <div className={styles.routeCell}>
          <span className={styles.routeCity}>{row.consignor_city}</span>
          <span className={styles.routeArrow}>→</span>
          <span className={styles.routeCity}>{row.consignee_city}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'delivery_partner',
      header: 'Delivery Partner',
      render: (row) => {
        const name = formatFullName(row.dp_first_name, row.dp_middle_name, row.dp_last_name);
        if (name === '—') {
          return <span className={styles.cellMuted}>Not assigned</span>;
        }
        return (
          <div className={styles.cellStack}>
            <span className={styles.cellPrimary}>{name}</span>
            <span className={styles.cellSecondary}>{row.dp_phone ?? ''}</span>
          </div>
        );
      },
    },
    {
      key: 'created_at',
      header: 'Created',
      sortableKey: SHIPMENT_SORTABLE.CREATED_AT,
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
            onClick: () => navigate(ROUTES.SHIPMENT_DETAIL(row.id)),
          });
        }
        if (row.status === SHIPMENT_STATUS.MANIFESTED || row.status === SHIPMENT_STATUS.PICKUP_SCHEDULED) {
          items.push({
            label: 'Download Label',
            icon: <Download size={14} />,
            onClick: () => { void downloadShipmentLabel(row); },
          });
        }
        if (canUpdate && (row.status === SHIPMENT_STATUS.MANIFESTED || row.status === SHIPMENT_STATUS.OUT_FOR_DELIVERY)) {
          items.push({
            label: 'Edit',
            icon: <Pencil size={14} />,
            onClick: () => navigate(ROUTES.SHIPMENT_EDIT(row.id)),
          });
        }
        if (canAssign) {
          items.push({
            label: 'Assign Partner',
            icon: <Truck size={14} />,
            onClick: () => setAssignTarget(row),
          });
        }
        if (canNdr && row.status === SHIPMENT_STATUS.NDR) {
          items.push({
            label: 'NDR Action',
            icon: <AlertTriangle size={14} />,
            onClick: () => setNdrTarget(row),
          });
        }
        if (
          canCancel &&
          (row.status === SHIPMENT_STATUS.MANIFESTED || row.status === SHIPMENT_STATUS.PICKUP_SCHEDULED)
        ) {
          items.push({
            label: 'Cancel',
            icon: <XCircle size={14} />,
            danger: true,
            onClick: () => setCancelTarget(row),
          });
        }
        return <ActionMenu items={items} />;
      },
    },
  ];

  if (!canView) {
    return (
      <EmptyState
        icon={<Package size={24} />}
        title="Access denied"
        description="You don't have permission to view shipments."
      />
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Shipments"
        subtitle="Manage and track all your shipments."
        actions={
          canCreate && (
            <Link to={ROUTES.SHIPMENT_CREATE}>
              <Button variant="primary" leftIcon={<Plus size={16} />}>
                New Shipment
              </Button>
            </Link>
          )
        }
      />

      <Card padded={false}>
        <div className={styles.filtersBar}>
          <div className={styles.searchGroup}>
            <SearchInput
              value={identifier}
              onChange={handleIdentifierChange}
              placeholder="Search by EGC ID, consignee, consignor…"
            />
            {showDeliveryPartnerFilter && (
              <SearchInput
                value={deliveryPartnerIdentifier}
                onChange={handleDeliveryPartnerIdentifierChange}
                placeholder="Search by delivery partner…"
              />
            )}
          </div>
          <div className={styles.statusTabs}>
            <button
              type="button"
              className={cn(styles.statusTab, status === 'ALL' && styles.statusTabActive)}
              onClick={() => handleStatusChange('ALL')}
            >
              All
            </button>
            {SHIPMENT_STATUS_LIST.map((s) => (
              <button
                key={s}
                type="button"
                className={cn(styles.statusTab, status === s && styles.statusTabActive)}
                onClick={() => handleStatusChange(s)}
              >
                {s}
              </button>
            ))}
          </div>
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
            selectable={canAssign}
            selectedRowKeys={selectedIds}
            onSelectionChange={(keys) => setSelectedIds(keys as number[])}
            isRowSelectable={isRowSelectable}
            emptyState={
              <EmptyState
                icon={<Package size={24} />}
                title={identifier || deliveryPartnerIdentifier || status !== 'ALL' ? 'No shipments match your filters' : 'No shipments yet'}
                description={
                  identifier || deliveryPartnerIdentifier || status !== 'ALL'
                    ? 'Try adjusting your search or filters.'
                    : 'Create your first shipment to get started.'
                }
                action={
                  canCreate && !identifier && !deliveryPartnerIdentifier && status === 'ALL' ? (
                    <Link to={ROUTES.SHIPMENT_CREATE}>
                      <Button variant="primary" leftIcon={<Plus size={16} />}>
                        Create Shipment
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

      {canAssign && selectedIds.length > 0 && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkBarText}>
            <strong>{selectedIds.length}</strong> shipment{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className={styles.bulkBarActions}>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<X size={14} />}
              onClick={() => setSelectedIds([])}
            >
              Clear
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Truck size={14} />}
              onClick={() => setBulkAssignOpen(true)}
            >
              Assign Delivery Partner
            </Button>
          </div>
        </div>
      )}

      <CancelShipmentDialog
        shipment={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onSuccess={() => setCancelTarget(null)}
      />

      <AssignDeliveryPartnerDialog
        shipment={assignTarget}
        onClose={() => setAssignTarget(null)}
        onSuccess={() => setAssignTarget(null)}
      />

      <BulkAssignDeliveryPartnerDialog
        isOpen={bulkAssignOpen}
        shipmentIds={selectedIds}
        onClose={() => setBulkAssignOpen(false)}
        onSuccess={() => {
          setSelectedIds([]);
          setBulkAssignOpen(false);
        }}
      />

      <NdrActionDialog
        shipment={ndrTarget}
        onClose={() => setNdrTarget(null)}
        onSuccess={() => setNdrTarget(null)}
      />
    </div>
  );
}