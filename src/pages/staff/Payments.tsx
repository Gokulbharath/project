import { useEffect, useState } from 'react';
import { PaymentCard } from '@/components/PaymentCard';
import { NoShowTimer } from '@/components/NoShowTimer';
import { api } from '@/services/api';
import { toast } from 'sonner';
import type { Payment, BookingDetail } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/common/PageHeader';

export const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [noShowBookings, setNoShowBookings] = useState<BookingDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [paymentsData, bookingsData] = await Promise.all([
          api.payments.getAll(),
          api.bookings.getAll(),
        ]);

        setPayments(paymentsData);
        setNoShowBookings(
          bookingsData.filter(
            (b) => b.status === 'confirmed' && new Date(`${b.date}T${b.time}`) < new Date()
          )
        );
      } catch (error) {
        console.error('Failed to load payments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleMarkPaid = async (id: string) => {
    try {
      await api.payments.updateStatus(id, 'paid');
      setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'paid' } : p)));
      toast.success('Payment marked as paid');
    } catch (error) {
      toast.error('Failed to update payment');
    }
  };

  const handleMarkNoShow = async (id: string) => {
    toast.info(`Booking ${id} marked as no-show`);
    setNoShowBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const pendingPayments = payments.filter((p) => p.status === 'pending');

  if (loading) {
    return (
      <div className="space-y-6" data-testid="payments-page">
        <PageHeader title="Payments & No-Shows" subtitle="Track payments and no-show alerts" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="payments-page">
      <PageHeader title="Payments & No-Shows" subtitle="Track payments and no-show alerts" />

      <Tabs defaultValue="payments">
        <TabsList className="glass">
          <TabsTrigger value="payments">
            Pending Payments
            {pendingPayments.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-neon-primary/20 text-neon-primary">
                {pendingPayments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="noshows">
            No-Show Alerts
            {noShowBookings.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-destructive/20 text-destructive">
                {noShowBookings.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-3 mt-6">
          {pendingPayments.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-muted-foreground">No pending payments</p>
            </div>
          ) : (
            pendingPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} onMarkPaid={handleMarkPaid} />
            ))
          )}
        </TabsContent>

        <TabsContent value="noshows" className="space-y-3 mt-6">
          {noShowBookings.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-muted-foreground">No no-show alerts</p>
            </div>
          ) : (
            noShowBookings.map((booking) => (
              <NoShowTimer key={booking.id} booking={booking} onMarkNoShow={handleMarkNoShow} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
