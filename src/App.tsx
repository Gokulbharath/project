import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/layouts/AppLayout';
import { Login } from '@/pages/Login';
import { StaffDashboard } from '@/pages/staff/Dashboard';
import { Arrivals } from '@/pages/staff/Arrivals';
import { WalkIns } from '@/pages/staff/WalkIns';
import { Payments } from '@/pages/staff/Payments';
import BookingsList from '@/pages/staff/bookings';
import NotificationsIndex from '@/pages/staff/notifications/Index';
import ProfileIndex from '@/pages/staff/profile/Index';
import SupportIndex from '@/pages/staff/support/Index';
import SettingsIndex from '@/pages/staff/settings/Index';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { Onboarding } from '@/pages/admin/Onboarding';
import { LayoutEditor } from '@/pages/admin/Layout';
import { Analytics } from '@/pages/admin/Analytics';
import { SystemLogs } from '@/pages/admin/Logs';
import { ROUTES } from '@/utils/constants';
import TableMapIndex from '@/pages/staff/table-map/Index';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" theme="dark" />
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />

          <Route
            element={
              <ProtectedRoute requiredRole="staff">
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.STAFF_DASHBOARD} element={<StaffDashboard />} />
            <Route path={ROUTES.STAFF_TABLE_MAP} element={<TableMapIndex />} />
            <Route path={ROUTES.STAFF_ARRIVALS} element={<Arrivals />} />
            <Route path={ROUTES.STAFF_WALKINS} element={<WalkIns />} />
            <Route path={ROUTES.STAFF_PAYMENTS} element={<Payments />} />
            <Route path={ROUTES.STAFF_BOOKINGS} element={<BookingsList />} />
            <Route path={ROUTES.STAFF_NOTIFICATIONS} element={<NotificationsIndex />} />
            <Route path={ROUTES.STAFF_PROFILE} element={<ProfileIndex />} />
            <Route path={ROUTES.STAFF_SUPPORT} element={<SupportIndex />} />
            <Route path={ROUTES.STAFF_SETTINGS} element={<SettingsIndex />} />
          </Route>

          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_ONBOARDING} element={<Onboarding />} />
            <Route path={ROUTES.ADMIN_LAYOUT} element={<LayoutEditor />} />
            <Route path={ROUTES.ADMIN_ANALYTICS} element={<Analytics />} />
            <Route path={ROUTES.ADMIN_LOGS} element={<SystemLogs />} />
          </Route>

          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
