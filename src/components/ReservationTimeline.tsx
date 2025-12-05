import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { subscribeOccupancy, type OccupancyPoint } from '@/services/live';


export const ReservationTimeline = () => {
    const [data, setData] = useState<OccupancyPoint[]>([
      { t: '8 PM', v: 42 },
      { t: '9 PM', v: 68 },
      { t: '10 PM', v: 51 },
      { t: '11 PM', v: 73 },
      { t: '12 AM', v: 38 },
      { t: '1 AM', v: 102 },
      { t: '2 AM', v: 64 },
    ]);

    useEffect(() => {
      const unsubscribe = subscribeOccupancy((newData) => {
        setData(newData);
      });
      return unsubscribe;
    }, []);

    const trend = data.length >= 2
      ? Math.round(((data[data.length - 1].v - data[0].v) / data[0].v) * 100)
      : 0;
    const trendColor = trend >= 0 ? 'text-green' : 'text-red';
    const trendSign = trend >= 0 ? '+' : '';
  return (
    <div className="relative">
      {/* Outer glow effect */}
      <div 
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(138,92,255,.2), transparent)',
        }}
      />
      
          <div className="glass neon-border p-6 md:p-8 rounded-2xl shadow-card relative group">
        <div className="space-y-2 mb-6">
          <h3 className="text-lg font-semibold text-text-high">Occupancy Timeline</h3>
          <p className="text-sm text-text-dim">
            Real-time venue occupancy — <span className={`font-semibold ${trendColor}`}>{trendSign}{trend}%</span>
          </p>
        </div>

    <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -40, bottom: 0 }}>
            <defs>
              <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(138,92,255,0.2)" stopOpacity={1} />
                <stop offset="95%" stopColor="rgba(138,92,255,0)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,.06)" vertical={false} />
            <XAxis 
              dataKey="t" 
              stroke="rgba(156,163,175,0.6)"
              style={{ fontSize: '12px' }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(18,18,41,0.95)',
                border: '1px solid rgba(138,92,255,.25)',
                borderRadius: '8px',
                color: '#E7E7F4',
              }}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#8A5CFF"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorV)"
              dot={false}
             isAnimationActive={true}
             animationDuration={600}
             animationEasing="ease-in-out"
              activeDot={{ r: 5, fill: '#8A5CFF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
