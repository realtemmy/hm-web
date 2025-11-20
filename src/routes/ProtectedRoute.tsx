// Protected Route component
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config/routes'

interface ProtectedRouteProps {
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = ROUTES.LOGIN
}) => {
  const { isAuthenticated, isLoading } = useAuth()

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
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Render protected content
  return <Outlet />
}
