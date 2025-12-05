import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
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
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" theme="dark" />
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />

          {/* Staff Routes */}
          <Route
            path={ROUTES.STAFF_DASHBOARD}
            element={
              <ProtectedRoute requiredRole="staff">
                <AppLayout>
                  <StaffDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STAFF_TABLE_MAP}
            element={
              <ProtectedRoute requiredRole="staff">
                <AppLayout>
                  <TableMap />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STAFF_ARRIVALS}
            element={
              <ProtectedRoute requiredRole="staff">
                <AppLayout>
                  <Arrivals />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STAFF_WALKINS}
            element={
              <ProtectedRoute requiredRole="staff">
                <AppLayout>
                  <WalkIns />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STAFF_PAYMENTS}
            element={
              <ProtectedRoute requiredRole="staff">
                <AppLayout>
                  <Payments />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute requiredRole="admin">
                <AppLayout>
                  <AdminDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_ONBOARDING}
            element={
              <ProtectedRoute requiredRole="admin">
                <AppLayout>
                  <Onboarding />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_LAYOUT}
            element={
              <ProtectedRoute requiredRole="admin">
                <AppLayout>
                  <LayoutEditor />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_ANALYTICS}
            element={
              <ProtectedRoute requiredRole="admin">
                <AppLayout>
                  <Analytics />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_LOGS}
            element={
              <ProtectedRoute requiredRole="admin">
                <AppLayout>
                  <SystemLogs />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
