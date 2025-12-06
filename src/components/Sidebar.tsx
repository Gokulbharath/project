import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Icon from '@/components/ui/Icon';
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
    icon: <Icon name="dashboard" size={18} className="mr-2 text-white/80 group-hover:text-white transition" />,
    group: 'staff',
  },
  {
    label: 'Table Map',
    path: ROUTES.STAFF_TABLE_MAP,
    icon: <Icon name="table-map" size={18} className="mr-2 text-white/80 group-hover:text-white transition" />,
    group: 'staff',
  },
  {
    label: 'Arrivals',
    path: ROUTES.STAFF_ARRIVALS,
    icon: <Icon name="arrivals" size={18} className="mr-2 text-white/80 group-hover:text-white transition" />,
    group: 'staff',
  },
  {
    label: 'Payments',
    path: ROUTES.STAFF_PAYMENTS,
    icon: <Icon name="payments" size={18} className="mr-2 text-white/80 group-hover:text-white transition" />,
    group: 'staff',
  },
  {
    label: 'Walk-ins',
    path: ROUTES.STAFF_WALKINS,
    icon: <Icon name="walkins" size={18} className="mr-2 text-white/80 group-hover:text-white transition" />,
    group: 'staff',
  },
  // Admin section
  {
    label: 'Admin',
    path: ROUTES.ADMIN_DASHBOARD,
    icon: <Icon name="analytics" size={18} className="mr-2 text-white/80 group-hover:text-white transition" />,
    group: 'admin',
  },
  {
    label: 'Onboarding',
    path: ROUTES.ADMIN_ONBOARDING,
    icon: <Icon name="onboarding" size={18} className="mr-2 text-white/80 group-hover:text-white transition" />,
    group: 'admin',
  },
  {
    label: 'Layout Editor',
    path: ROUTES.ADMIN_LAYOUT,
    icon: <Icon name="layout" size={18} className="mr-2 text-white/80 group-hover:text-white transition" />,
    group: 'admin',
  },
  {
    label: 'Analytics',
    path: ROUTES.ADMIN_ANALYTICS,
    icon: <Icon name="analytics" size={18} className="mr-2 text-white/80 group-hover:text-white transition" />,
    group: 'admin',
  },
  {
    label: 'System Logs',
    path: ROUTES.ADMIN_LOGS,
    icon: <Icon name="logs" size={18} className="mr-2 text-white/80 group-hover:text-white transition" />,
    group: 'admin',
  },
  // Footer
  {
    label: 'Settings',
    path: '/settings',
    icon: <Icon name="settings" size={18} className="mr-2 text-white/80 group-hover:text-white transition" />,
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
          <Icon name="logout" size={16} />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
};
