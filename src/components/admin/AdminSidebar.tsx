// Admin sidebar navigation
import { Link, useLocation } from 'react-router'
import {
  LayoutDashboard,
  Building2,
  Building,
  Home,
  FileText,
  Users,
  Receipt,
  CreditCard,
  Wrench,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/config/routes'

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: 'Properties',
    path: ROUTES.ADMIN.PROPERTIES.INDEX,
    icon: Building2,
  },
  {
    label: 'Buildings',
    path: ROUTES.ADMIN.BUILDINGS.INDEX,
    icon: Building,
  },
  {
    label: 'Units',
    path: ROUTES.ADMIN.UNITS.INDEX,
    icon: Home,
  },
  {
    label: 'Leases',
    path: ROUTES.ADMIN.LEASES.INDEX,
    icon: FileText,
  },
  {
    label: 'Tenants',
    path: ROUTES.ADMIN.TENANTS.INDEX,
    icon: Users,
  },
  {
    label: 'Invoices',
    path: ROUTES.ADMIN.INVOICES.INDEX,
    icon: Receipt,
  },
  {
    label: 'Payments',
    path: ROUTES.ADMIN.PAYMENTS.INDEX,
    icon: CreditCard,
  },
  {
    label: 'Maintenance',
    path: ROUTES.ADMIN.MAINTENANCE.INDEX,
    icon: Wrench,
  },
  {
    label: 'Reports',
    path: ROUTES.ADMIN.REPORTS.INDEX,
    icon: BarChart3,
  },
]

export const AdminSidebar = () => {
  const location = useLocation()

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-card">
      {/* Logo/Brand */}
      <div className="flex items-center border-b border-border">
        <h4 className="text-sm font-medium text-foreground">Housing Admin</h4>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
