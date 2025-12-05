import { useEffect, useState } from 'react';
import { ChartCard } from '@/components/ChartCard';
import { api } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Analytics as AnalyticsData } from '@/types';

const COLORS = ['#4A6CFF', '#A56CFF', '#00FF90', '#4388FF'];

export const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'year'>('week');

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
  }, [timeFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-muted-foreground">Detailed performance metrics</p>
        </div>

        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-muted-foreground">Detailed performance metrics</p>
        </div>

        <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as any)}>
          <SelectTrigger className="w-32 glass">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass">
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        <ChartCard title="Daily Bookings Trend" description={`Bookings over the last ${timeFilter}`}>
          <ResponsiveContainer width="100%" height={300}>
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
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#4A6CFF" strokeWidth={3} dot={{ fill: '#4A6CFF', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hourly Occupancy Rate" description="Average table occupancy by hour">
          <ResponsiveContainer width="100%" height={300}>
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
              <Legend />
              <Bar dataKey="occupied" fill="#A56CFF" radius={[8, 8, 0, 0]} />
              <Bar dataKey="total" fill="#4A6CFF40" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Table Category Usage" description="Bookings and revenue by category">
          <div className="grid grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={analytics.categoryUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, bookings }) => `${category}: ${bookings}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="bookings"
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

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Category Breakdown</h3>
              {analytics.categoryUsage.map((cat, idx) => (
                <div key={cat.category} className="glass p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{cat.category}</span>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">Bookings</div>
                      <div className="text-white font-semibold">{cat.bookings}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Revenue</div>
                      <div className="text-neon-success font-semibold">${cat.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
