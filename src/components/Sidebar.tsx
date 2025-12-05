import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Map,
  Users,
  UserPlus,
  CreditCard,
  BarChart3,
  FileText,
  Grid3x3,
  LogOut,
  Settings,
} from 'lucide-react';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  group: 'staff' | 'admin' | 'footer';
}

const navItems: NavItem[] = [
  // Staff section
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
    label: 'Payments',
    path: ROUTES.STAFF_PAYMENTS,
    icon: <CreditCard className="w-5 h-5" />,
    group: 'staff',
  },
  {
    label: 'Walk-ins',
    path: ROUTES.STAFF_WALKINS,
    icon: <UserPlus className="w-5 h-5" />,
    group: 'staff',
  },
  // Admin section
  {
    label: 'Admin',
    path: ROUTES.ADMIN_DASHBOARD,
    icon: <BarChart3 className="w-5 h-5" />,
    group: 'admin',
  },
  {
    label: 'Onboarding',
    path: ROUTES.ADMIN_ONBOARDING,
    icon: <Grid3x3 className="w-5 h-5" />,
    group: 'admin',
  },
  {
    label: 'Layout Editor',
    path: ROUTES.ADMIN_LAYOUT,
    icon: <Map className="w-5 h-5" />,
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
  // Footer
  {
    label: 'Settings',
    path: '/settings',
    icon: <Settings className="w-5 h-5" />,
    group: 'footer',
  },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const staffItems = navItems.filter((item) => item.group === 'staff');
  const adminItems = navItems.filter((item) => item.group === 'admin');
  const footerItems = navItems.filter((item) => item.group === 'footer');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={item.path}
        to={item.path}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium',
          'focus:ring-2 focus:ring-[rgba(138,92,255,.6)] focus:ring-offset-0',
          isActive
            ? 'glass neon-border text-neon-primary shadow-glow'
            : 'text-text-dim hover:text-text-high hover:bg-white/5'
        )}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 glass flex flex-col h-screen sticky top-0 overflow-y-auto border-r border-[rgba(138,92,255,.15)] scrollbar-hide">
      {/* Logo Section */}
      <div className="p-6 border-b border-[rgba(138,92,255,.15)]">
        <div className="space-y-1">
          <h1 className="text-lg font-bold text-text-high">NightScene</h1>
          <p className="text-xs text-text-dim">Operations Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
        {/* Staff Section */}
        {user?.role === 'staff' && staffItems.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-text-dim uppercase tracking-wider px-3 opacity-75">Staff</p>
            <div className="space-y-2">
              {staffItems.map(renderNavItem)}
            </div>
          </div>
        )}

        {/* Admin Section */}
        {user?.role === 'admin' && adminItems.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-text-dim uppercase tracking-wider px-3 opacity-75">Admin</p>
            <div className="space-y-2">
              {adminItems.map(renderNavItem)}
            </div>
          </div>
        )}
      </nav>

      {/* Footer Section */}
      <div className="border-t border-[rgba(138,92,255,.15)] p-4 space-y-4">
        {footerItems.map(renderNavItem)}

        <Button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-error/10 hover:bg-error/20 text-error border border-error/30 transition-all h-9 rounded-lg"
          variant="outline"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
};
