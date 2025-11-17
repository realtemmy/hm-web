// Role-based Route component
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/config/routes'
import type { UserRole } from '@/types'

interface RoleBasedRouteProps {
  allowedRoles: UserRole[]
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  // Check if user's role is allowed
  const hasAccess = allowedRoles.includes(user.role)

  // Redirect to appropriate dashboard if role not allowed
  if (!hasAccess) {
    const redirectPath =
      user.role === 'ADMIN' ? ROUTES.ADMIN.DASHBOARD :
      ROUTES.USER.DASHBOARD

    return <Navigate to={redirectPath} replace />
  }

  // Render protected content
  return <Outlet />
}
