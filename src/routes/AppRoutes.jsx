import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import { ROUTES, USER_ROLES } from '../config/routes'

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout'
import AuthLayout from '../components/layout/AuthLayout'

// Lazy load pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'))
const AdminDashboardPage = lazy(() => import('../pages/dashboard/AdminDashboardPage'))
const TeamDashboardPage = lazy(() => import('../pages/dashboard/TeamDashboardPage'))
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'))
const NotFoundPage = lazy(() => import('../pages/errors/NotFoundPage'))
const UnauthorizedPage = lazy(() => import('../pages/errors/UnauthorizedPage'))

// Loading fallback
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
)

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Root path - redirect to login */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* Auth Routes - uses AuthLayout */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* Protected Dashboard Routes - uses DashboardLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
          </Route>
        </Route>

        {/* Team Member Routes */}
        <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.TEAM_MEMBER]} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.TEAM_DASHBOARD} element={<TeamDashboardPage />} />
          </Route>
        </Route>

        {/* Error Routes */}
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes