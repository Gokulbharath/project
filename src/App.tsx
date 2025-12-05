import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from '@/layouts/AppLayout';
import { Login } from '@/pages/Login';
import { StaffDashboard } from '@/pages/staff/Dashboard';
import { TableMap } from '@/pages/staff/TableMap';
import { Arrivals } from '@/pages/staff/Arrivals';
import { WalkIns } from '@/pages/staff/WalkIns';
import { Payments } from '@/pages/staff/Payments';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { Onboarding } from '@/pages/admin/Onboarding';
import { LayoutEditor } from '@/pages/admin/Layout';
import { Analytics } from '@/pages/admin/Analytics';
import { SystemLogs } from '@/pages/admin/Logs';
import { ROUTES } from '@/utils/constants';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" theme="dark" />
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route
          path={ROUTES.STAFF_DASHBOARD}
          element={
            <AppLayout>
              <StaffDashboard />
            </AppLayout>
          }
        />
        <Route
          path={ROUTES.STAFF_TABLE_MAP}
          element={
            <AppLayout>
              <TableMap />
            </AppLayout>
          }
        />
        <Route
          path={ROUTES.STAFF_ARRIVALS}
          element={
            <AppLayout>
              <Arrivals />
            </AppLayout>
          }
        />
        <Route
          path={ROUTES.STAFF_WALKINS}
          element={
            <AppLayout>
              <WalkIns />
            </AppLayout>
          }
        />
        <Route
          path={ROUTES.STAFF_PAYMENTS}
          element={
            <AppLayout>
              <Payments />
            </AppLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_ONBOARDING}
          element={
            <AppLayout>
              <Onboarding />
            </AppLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_LAYOUT}
          element={
            <AppLayout>
              <LayoutEditor />
            </AppLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_ANALYTICS}
          element={
            <AppLayout>
              <Analytics />
            </AppLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_LOGS}
          element={
            <AppLayout>
              <SystemLogs />
            </AppLayout>
          }
        />
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
