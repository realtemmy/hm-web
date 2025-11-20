// Admin dashboard overview page
import { Building2, FileText, Wrench, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'
import { ROUTES } from '@/config/routes'

interface StatCardProps {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  trend?: string
}

const StatCard = ({ title, value, icon: Icon, trend }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-semibold">{value}</div>
      {trend && (
        <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
      )}
    </CardContent>
  </Card>
)

interface ActivityItem {
  id: string
  type: 'lease' | 'payment' | 'maintenance'
  description: string
  time: string
}

const recentActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'lease',
    description: 'New lease application for Unit 2B',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'payment',
    description: 'Payment received - ₦450,000',
    time: '4 hours ago',
  },
  {
    id: '3',
    type: 'maintenance',
    description: 'Maintenance request submitted for Building A',
    time: '5 hours ago',
  },
  {
    id: '4',
    type: 'lease',
    description: 'Lease renewed for Unit 5A',
    time: '1 day ago',
  },
]

export const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your housing management system
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Properties"
          value="12"
          icon={Building2}
          trend="+2 this month"
        />
        <StatCard
          title="Active Leases"
          value="84"
          icon={FileText}
          trend="+5 this month"
        />
        <StatCard
          title="Pending Maintenance"
          value="7"
          icon={Wrench}
          trend="2 urgent"
        />
        <StatCard
          title="Monthly Revenue"
          value="₦12.5M"
          icon={TrendingUp}
          trend="+12% from last month"
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to={ROUTES.ADMIN.PROPERTIES.NEW}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Add New Property
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to={ROUTES.ADMIN.LEASES.NEW}>
                  <FileText className="mr-2 h-4 w-4" />
                  Create Lease Agreement
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to={ROUTES.ADMIN.INVOICES.NEW}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to={ROUTES.ADMIN.MAINTENANCE.INDEX}>
                  <Wrench className="mr-2 h-4 w-4" />
                  View Maintenance Requests
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
