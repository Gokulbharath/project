import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Map,
  Users,
  UserPlus,
  CreditCard,
  BarChart3,
  Settings,
  FileText,
  Sparkles,
  Grid3x3,
} from 'lucide-react';
import { ROUTES } from '@/utils/constants';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  group: 'staff' | 'admin';
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.STAFF_DASHBOARD,
    icon: <LayoutDashboard className="w-5 h-5" />,
    group: 'staff',
  },
  {
    label: 'Table Map',
    path: ROUTES.STAFF_TABLE_MAP,
    icon: <Map className="w-5 h-5" />,
    group: 'staff',
  },
  {
    label: 'Arrivals',
    path: ROUTES.STAFF_ARRIVALS,
    icon: <Users className="w-5 h-5" />,
    group: 'staff',
  },
  {
    label: 'Walk-ins',
    path: ROUTES.STAFF_WALKINS,
    icon: <UserPlus className="w-5 h-5" />,
    group: 'staff',
  },
  {
    label: 'Payments',
    path: ROUTES.STAFF_PAYMENTS,
    icon: <CreditCard className="w-5 h-5" />,
    group: 'staff',
  },
  {
    label: 'Admin',
    path: ROUTES.ADMIN_DASHBOARD,
    icon: <Settings className="w-5 h-5" />,
    group: 'admin',
  },
  {
    label: 'Onboarding',
    path: ROUTES.ADMIN_ONBOARDING,
    icon: <Sparkles className="w-5 h-5" />,
    group: 'admin',
  },
  {
    label: 'Layout Editor',
    path: ROUTES.ADMIN_LAYOUT,
    icon: <Grid3x3 className="w-5 h-5" />,
    group: 'admin',
  },
  {
    label: 'Analytics',
    path: ROUTES.ADMIN_ANALYTICS,
    icon: <BarChart3 className="w-5 h-5" />,
    group: 'admin',
  },
  {
    label: 'System Logs',
    path: ROUTES.ADMIN_LOGS,
    icon: <FileText className="w-5 h-5" />,
    group: 'admin',
  },
];

export const Sidebar = () => {
  const location = useLocation();

  const staffItems = navItems.filter((item) => item.group === 'staff');
  const adminItems = navItems.filter((item) => item.group === 'admin');

  return (
    <aside className="w-64 glass-card p-4 flex flex-col gap-6">
      <div className="flex items-center gap-2 px-2">
        <Sparkles className="w-8 h-8 text-neon-primary" />
        <h1 className="text-xl font-bold text-white">NightScene</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-6">
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Staff
          </h2>
          <div className="space-y-1">
            {staffItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all',
                  'hover:bg-white/5 hover-lift',
                  location.pathname === item.path
                    ? 'bg-neon-primary/10 text-neon-primary border border-neon-primary/30 shadow-neon-sm'
                    : 'text-muted-foreground'
                )}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Admin
          </h2>
          <div className="space-y-1">
            {adminItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all',
                  'hover:bg-white/5 hover-lift',
                  location.pathname === item.path
                    ? 'bg-neon-accent/10 text-neon-accent border border-neon-accent/30 shadow-accent-sm'
                    : 'text-muted-foreground'
                )}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};
