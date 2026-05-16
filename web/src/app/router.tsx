import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShellLayout } from '../components/layout/AppShellLayout'
import { EmptyState } from '../components/common/EmptyState'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { CrmAccountPage } from '../features/crm/pages/CrmAccountPage'
import { CrmPage } from '../features/crm/pages/CrmPage'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { UsersPage } from '../features/users/pages/UsersPage'

// The router maps each browser URL to the React page component that should render.
// All routes sit inside AppShellLayout so the sidebar and top bar stay consistent.
export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShellLayout />}>
        {/* Opening "/" sends the user to the dashboard, which is the main starting screen. */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="crm" element={<CrmPage />} />
        <Route path="crm/accounts/:accountId" element={<CrmAccountPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="login" element={<LoginPage />} />
        {/* "*" is the catch-all route for any URL the app does not recognise. */}
        <Route
          path="*"
          element={
            <EmptyState
              title="Page not found"
              message="The route you opened is not available."
            />
          }
        />
      </Route>
    </Routes>
  )
}
