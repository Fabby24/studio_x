import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ROUTES } from '../config/routes'

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore()
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  
  // Check role-based access
  if (allowedRoles && user) {
    const hasRequiredRole = allowedRoles.includes(user.role)
    if (!hasRequiredRole) {
      return <Navigate to={ROUTES.UNAUTHORIZED} replace />
    }
  }
  
  // Render child routes
  return <Outlet />
}

export default ProtectedRoute;