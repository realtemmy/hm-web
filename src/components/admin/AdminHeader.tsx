// Admin header with breadcrumbs and user menu
import { useLocation, Link } from 'react-router'
import { ChevronRight, User, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config/routes'

interface Breadcrumb {
  label: string
  path?: string
}

const getBreadcrumbs = (pathname: string): Breadcrumb[] => {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: Breadcrumb[] = [{ label: 'Home', path: ROUTES.ADMIN.DASHBOARD }]

  // Map route segments to readable labels
  const labelMap: Record<string, string> = {
    admin: 'Admin',
    properties: 'Properties',
    buildings: 'Buildings',
    units: 'Units',
    leases: 'Leases',
    tenants: 'Tenants',
    invoices: 'Invoices',
    payments: 'Payments',
    maintenance: 'Maintenance',
    reports: 'Reports',
    new: 'New',
    edit: 'Edit',
  }

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const label = labelMap[segment] || segment

    // Don't add link for the last segment (current page)
    if (index === segments.length - 1) {
      breadcrumbs.push({ label })
    } else if (index > 0) {
      // Skip 'admin' segment
      breadcrumbs.push({ label, path: currentPath })
    }
  })

  return breadcrumbs
}

export const AdminHeader = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const breadcrumbs = getBreadcrumbs(location.pathname)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Get user initials for avatar
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'AD'

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {crumb.path ? (
              <Link
                to={crumb.path}
                className="font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{crumb.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-3 px-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photo} alt={user?.name} />
              <AvatarFallback className="bg-accent text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">{user?.role}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={ROUTES.ADMIN.PROFILE} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={ROUTES.ADMIN.SETTINGS} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
