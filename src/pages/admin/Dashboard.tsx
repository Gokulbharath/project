import { useEffect, useState } from 'react';
import { KpiCard } from '@/components/KpiCard';
import { ChartCard } from '@/components/ChartCard';
import { api } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Analytics } from '@/types';

const COLORS = ['#4A6CFF', '#A56CFF', '#00FF90', '#4388FF'];

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.analytics.get();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Overview</h1>
          <p className="text-muted-foreground">Business intelligence and KPIs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Overview</h1>
        <p className="text-muted-foreground">Business intelligence and KPIs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Bookings"
          value={analytics.kpis.totalBookings}
        />
        <KpiCard
          title="Monthly Revenue"
          value={`$${analytics.kpis.monthlyRevenue.toLocaleString()}`}
        />
        <KpiCard
          title="Peak Hours"
          value={analytics.kpis.peakHours}
        />
        <KpiCard
          title="Table Occupancy"
          value={`${analytics.kpis.tableOccupancy}%`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Daily Bookings" description="Last 7 days">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.dailyBookings}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                stroke="#888"
                tick={{ fill: '#888' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#888" tick={{ fill: '#888' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 10, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                }}
              />
              <Line type="monotone" dataKey="bookings" stroke="#4A6CFF" strokeWidth={2} dot={{ fill: '#4A6CFF', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hourly Occupancy" description="Today">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.hourlyOccupancy}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="hour" stroke="#888" tick={{ fill: '#888' }} />
              <YAxis stroke="#888" tick={{ fill: '#888' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 10, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="occupied" fill="#A56CFF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Category Performance" description="Revenue by table category">
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPie>
            <Pie
              data={analytics.categoryUsage}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category, revenue }) => `${category}: $${revenue.toLocaleString()}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="revenue"
            >
              {analytics.categoryUsage.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 10, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </RechartsPie>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};
