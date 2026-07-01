import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ROUTES } from '../config/routes'

const PublicRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore()
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated && user) {
    const dashboardRoute = user.role === 'admin' 
      ? ROUTES.ADMIN_DASHBOARD 
      : ROUTES.TEAM_DASHBOARD
    return <Navigate to={dashboardRoute} replace />
  }
  
  // Render child routes
  return <Outlet />
}

export default PublicRoute;