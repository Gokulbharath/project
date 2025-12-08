import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable, Column } from '@/components/common/DataTable';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import Icon from '@/components/ui/Icon';
import { listBookings, markPaid, markArrived, updateBooking } from '@/services/staff';
import { TBooking } from '@/types/staff';
import { formatDate, formatTime } from '@/utils/format';
import { DetailDrawer } from './DetailDrawer';
import { NewOrEditDialog } from './NewOrEditDialog';

export default function BookingsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState<TBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<TBooking | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<TBooking | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    date: searchParams.get('date') || '',
    status: searchParams.get('status') || '',
    payment: searchParams.get('payment') || '',
  });

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await listBookings({ ...filters, page });
      setBookings(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [filters, page]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleRowClick = (booking: TBooking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleMarkPaid = async (booking: TBooking) => {
    try {
      await markPaid(booking.id);
      toast.success('Payment marked as paid');
      loadBookings();
      if (selectedBooking?.id === booking.id) {
        setSelectedBooking({ ...selectedBooking, paymentStatus: 'PAID' });
      }
    } catch (err) {
      toast.error('Failed to update payment status');
    }
  };

  const handleMarkArrived = async (booking: TBooking) => {
    try {
      await markArrived(booking.id);
      toast.success('Guest marked as arrived');
      loadBookings();
      if (selectedBooking?.id === booking.id) {
        setSelectedBooking({ ...selectedBooking, bookingStatus: 'ARRIVED' });
      }
    } catch (err) {
      toast.error('Failed to update arrival status');
    }
  };

  const handleCancel = async (booking: TBooking) => {
    try {
      await updateBooking(booking.id, { bookingStatus: 'CANCELLED' });
      toast.success('Booking cancelled');
      loadBookings();
      if (selectedBooking?.id === booking.id) {
        setSelectedBooking({ ...selectedBooking, bookingStatus: 'CANCELLED' });
      }
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const columns: Column<TBooking>[] = [
    {
      id: 'code',
      header: 'Code',
      accessor: (row) => <span className="font-mono text-sm">{row.code}</span>,
      sortable: true,
    },
    {
      id: 'guestName',
      header: 'Guest',
      accessor: (row) => <span className="font-medium">{row.guestName}</span>,
      sortable: true,
    },
    {
      id: 'phone',
      header: 'Phone',
      accessor: (row) => <span className="text-text-dim">{row.phone}</span>,
    },
    {
      id: 'groupSize',
      header: 'Group',
      accessor: (row) => <span>{row.groupSize} guests</span>,
    },
    {
      id: 'datetime',
      header: 'Date/Time',
      accessor: (row) => (
        <div>
          <div>{formatDate(row.date)}</div>
          <div className="text-xs text-text-dim">{row.time}</div>
        </div>
      ),
    },
    {
      id: 'table',
      header: 'Table',
      accessor: (row) => (
        <span className="text-text-dim">{row.tableLabel || '—'}</span>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      accessor: (row) => (
        <span className="text-xs px-2 py-1 rounded bg-surface text-text-dim">
          {row.category}
        </span>
      ),
    },
    {
      id: 'paymentStatus',
      header: 'Payment',
      accessor: (row) => <StatusBadge status={row.paymentStatus} type="payment" />,
    },
    {
      id: 'bookingStatus',
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.bookingStatus} type="booking" />,
    },
  ];

  const actions = (booking: TBooking) => [
    {
      label: 'View',
      onClick: () => handleRowClick(booking),
      icon: 'eye',
    },
    ...(booking.bookingStatus !== 'ARRIVED'
      ? [
          {
            label: 'Mark Arrived',
            onClick: () => handleMarkArrived(booking),
            icon: 'check',
          },
        ]
      : []),
    ...(booking.paymentStatus !== 'PAID'
      ? [
          {
            label: 'Mark Paid',
            onClick: () => handleMarkPaid(booking),
            icon: 'dollar-sign',
          },
        ]
      : []),
    ...(booking.bookingStatus !== 'CANCELLED'
      ? [
          {
            label: 'Cancel',
            onClick: () => handleCancel(booking),
            icon: 'x',
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6" data-testid="bookings-page">
      <PageHeader
        title="Bookings"
        subtitle="Manage reservations and guest bookings"
        right={
          <Button
            onClick={() => {
              setEditingBooking(null);
              setDialogOpen(true);
            }}
            aria-label="New Booking"
          >
            <Icon name="plus" size={16} className="mr-2" />
            New Booking
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search bookings..."
            value={filters.q}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            className="w-full"
            aria-label="Search bookings"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              <Icon name="calendar" size={16} className="mr-2" />
              {filters.date ? formatDate(filters.date) : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.date ? new Date(filters.date) : undefined}
              onSelect={(date) =>
                handleFilterChange('date', date ? date.toISOString().split('T')[0] : '')
              }
            />
          </PopoverContent>
        </Popover>
        <Select
          value={filters.status || 'all'}
          onValueChange={(v) => handleFilterChange('status', v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ARRIVED">Arrived</SelectItem>
            <SelectItem value="NO_SHOW">No Show</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.payment || 'all'}
          onValueChange={(v) => handleFilterChange('payment', v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="PARTIAL">Partial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadBookings} />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="No bookings found"
          description="Try adjusting your filters or create a new booking"
          action={{
            label: 'New Booking',
            onClick: () => {
              setEditingBooking(null);
              setDialogOpen(true);
            },
          }}
        />
      ) : (
        <>
          <DataTable
            data={bookings}
            columns={columns}
            onRowClick={handleRowClick}
            actions={actions}
            emptyMessage="No bookings found"
          />
          {total > 10 && (
            <div className="flex items-center justify-between text-sm text-text-dim">
              <span>
                Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * 10 >= total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Drawer */}
      <DetailDrawer
        booking={selectedBooking}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onEdit={() => {
          setEditingBooking(selectedBooking);
          setDialogOpen(true);
          setDrawerOpen(false);
        }}
        onMarkPaid={() => selectedBooking && handleMarkPaid(selectedBooking)}
        onMarkArrived={() => selectedBooking && handleMarkArrived(selectedBooking)}
        onCancel={() => selectedBooking && handleCancel(selectedBooking)}
      />

      {/* New/Edit Dialog */}
      <NewOrEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        booking={editingBooking}
        onSuccess={() => {
          setDialogOpen(false);
          loadBookings();
        }}
      />
    </div>
  );
}

