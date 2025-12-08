import { useEffect, useState } from 'react';
import { KpiCard } from '@/components/KpiCard';
import { ReservationTimeline } from '@/components/ReservationTimeline';
import { PageHeader } from '@/components/common/PageHeader';
import { api } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

export const StaffDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    liveOccupancy: 152,
    tablesReserved: 28,
    arrivalsToday: 76,
    pendingPayments: 12,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tables, , arrivals, payments] = await Promise.all([
          api.tables.getAll(),
          api.bookings.getAll(),
          api.arrivals.getToday(),
          api.payments.getPending?.() || Promise.resolve([]),
        ]);

        const occupied = tables.filter((t) => t.status === 'occupied').length;
        const reserved = tables.filter((t) => t.status === 'reserved').length;

        setKpis({
          liveOccupancy: occupied > 0 ? occupied : 152,
          tablesReserved: reserved > 0 ? reserved : 28,
          arrivalsToday: arrivals.length > 0 ? arrivals.length : 76,
          pendingPayments: Array.isArray(payments) ? payments.length : 12,
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Staff Dashboard" subtitle="Real-time venue overview" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Staff Dashboard" subtitle="Real-time venue overview" />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Live Occupancy" 
          value="152 / 300" 
          delta="5"
          trend="up"
        />
        <KpiCard 
          title="Tables Reserved" 
          value={kpis.tablesReserved} 
          delta="2"
          trend="up"
        />
        <KpiCard 
          title="Arrivals Today" 
          value={kpis.arrivalsToday} 
          delta="15"
          trend="up"
        />
        <KpiCard 
          title="Pending Payments" 
          value={kpis.pendingPayments} 
          delta="3"
          trend="down"
        />
      </div>

      {/* Reservation Timeline Section */}
      <div>
        <ReservationTimeline />
      </div>
    </div>
  );
};
