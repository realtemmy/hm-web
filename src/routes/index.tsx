// Main router configuration
import { Routes, Route, Navigate } from 'react-router'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleBasedRoute } from './RoleBasedRoute'
import { ROUTES } from '@/config/routes'

// Auth pages
import { Login, Register, ForgotPassword, ResetPassword } from '@/pages/auth'

// Placeholder components for pages not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex h-screen items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground">This page is under construction</p>
    </div>
  </div>
)

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

      {/* Admin routes - protected and role-based */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleBasedRoute allowedRoles={['ADMIN']} />}>
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<PlaceholderPage title="Landlord Dashboard" />} />

          {/* Properties */}
          <Route path={ROUTES.ADMIN.PROPERTIES.LIST} element={<PlaceholderPage title="My Properties" />} />
          <Route path={ROUTES.ADMIN.PROPERTIES.NEW} element={<PlaceholderPage title="Add Property" />} />
          <Route path={ROUTES.ADMIN.PROPERTIES.DETAIL} element={<PlaceholderPage title="Property Details" />} />
          <Route path={ROUTES.ADMIN.PROPERTIES.EDIT} element={<PlaceholderPage title="Edit Property" />} />

          {/* Buildings */}
          <Route path="/admin/buildings" element={<PlaceholderPage title="Buildings" />} />
          <Route path="/admin/buildings/new" element={<PlaceholderPage title="Add Building" />} />
          <Route path="/admin/buildings/:id" element={<PlaceholderPage title="Building Details" />} />
          <Route path="/admin/buildings/:id/edit" element={<PlaceholderPage title="Edit Building" />} />

          {/* Units */}
          <Route path="/admin/units" element={<PlaceholderPage title="Units" />} />
          <Route path="/admin/units/new" element={<PlaceholderPage title="Add Unit" />} />
          <Route path="/admin/units/:id" element={<PlaceholderPage title="Unit Details" />} />
          <Route path="/admin/units/:id/edit" element={<PlaceholderPage title="Edit Unit" />} />
          <Route path="/admin/units/:id/photos" element={<PlaceholderPage title="Unit Photos" />} />

          {/* Leases */}
          <Route path="/admin/leases" element={<PlaceholderPage title="All Leases" />} />
          <Route path="/admin/leases/pending" element={<PlaceholderPage title="Pending Applications" />} />
          <Route path="/admin/leases/:id" element={<PlaceholderPage title="Lease Details" />} />
          <Route path="/admin/leases/:id/approve" element={<PlaceholderPage title="Approve Lease" />} />

          {/* Payments */}
          <Route path={ROUTES.ADMIN.PAYMENTS.LIST} element={<PlaceholderPage title="All Payments" />} />
          <Route path={ROUTES.ADMIN.PAYMENTS.DETAIL} element={<PlaceholderPage title="Payment Details" />} />

          {/* Invoices */}
          <Route path="/admin/invoices" element={<PlaceholderPage title="Invoices" />} />
          <Route path="/admin/invoices/new" element={<PlaceholderPage title="Create Invoice" />} />
          <Route path="/admin/invoices/:id" element={<PlaceholderPage title="Invoice Details" />} />

          {/* Maintenance */}
          <Route path={ROUTES.ADMIN.MAINTENANCE.LIST} element={<PlaceholderPage title="Maintenance Requests" />} />
          <Route path={ROUTES.ADMIN.MAINTENANCE.DETAIL} element={<PlaceholderPage title="Request Details" />} />
          <Route path="/admin/maintenance/:id/assign" element={<PlaceholderPage title="Assign Request" />} />

          {/* Tenants */}
          <Route path="/admin/tenants" element={<PlaceholderPage title="Tenants" />} />
          <Route path="/admin/tenants/:id" element={<PlaceholderPage title="Tenant Details" />} />
        </Route>
      </Route>

      {/* User (Tenant) routes - protected and role-based */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleBasedRoute allowedRoles={['USER']} />}>
          <Route path={ROUTES.USER.DASHBOARD} element={<PlaceholderPage title="My Dashboard" />} />

          {/* Browse & Apply */}
          <Route path="/user/browse" element={<PlaceholderPage title="Browse Units" />} />
          <Route path="/user/units/:id" element={<PlaceholderPage title="Unit Details" />} />
          <Route path="/user/units/:id/apply" element={<PlaceholderPage title="Apply for Lease" />} />

          {/* Leases */}
          <Route path="/user/leases" element={<PlaceholderPage title="My Leases" />} />
          <Route path="/user/leases/:id" element={<PlaceholderPage title="Lease Details" />} />
          <Route path="/user/leases/:id/renew" element={<PlaceholderPage title="Renew Lease" />} />

          {/* Payments */}
          <Route path="/user/payments" element={<PlaceholderPage title="Payment History" />} />
          <Route path="/user/payments/new" element={<PlaceholderPage title="Make Payment" />} />

          {/* Invoices */}
          <Route path="/user/invoices" element={<PlaceholderPage title="My Invoices" />} />

          {/* Maintenance */}
          <Route path="/user/maintenance" element={<PlaceholderPage title="My Requests" />} />
          <Route path="/user/maintenance/new" element={<PlaceholderPage title="Submit Request" />} />
          <Route path="/user/maintenance/:id" element={<PlaceholderPage title="Request Details" />} />

          <Route path="/user/profile" element={<PlaceholderPage title="My Profile" />} />
        </Route>
      </Route>

      {/* Shared routes - all authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/notifications" element={<PlaceholderPage title="Notifications" />} />
      </Route>

      {/* Catch-all route - 404 */}
      <Route path="*" element={
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl text-muted-foreground mb-4">Page not found</p>
            <a href={ROUTES.LOGIN} className="text-primary hover:underline">
              Go to login
            </a>
          </div>
        </div>
      } />
    </Routes>
  )
}
