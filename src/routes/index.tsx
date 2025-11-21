// Main router configuration
import { Routes, Route, Navigate } from 'react-router'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleBasedRoute } from './RoleBasedRoute'
import { ROUTES } from '@/config/routes'

// Auth pages
import { Login, Register, ForgotPassword, ResetPassword } from '@/pages/auth'

// Layouts
import { AdminLayout } from '@/layouts/AdminLayout'

// Admin pages
import { AdminDashboard } from '@/pages/admin/Dashboard'
import { PropertiesList } from '@/pages/admin/properties/PropertiesList'
import { PropertyForm } from '@/pages/admin/properties/PropertyForm'
import { PropertyDetail } from '@/pages/admin/properties/PropertyDetail'
import { BuildingsList } from '@/pages/admin/buildings/BuildingsList'
import { BuildingForm } from '@/pages/admin/buildings/BuildingForm'
import { BuildingDetail } from '@/pages/admin/buildings/BuildingDetail'
import { UnitsList } from '@/pages/admin/units/UnitsList'
import { UnitForm } from '@/pages/admin/units/UnitForm'
import { UnitDetail } from '@/pages/admin/units/UnitDetail'
import { LeasesList } from '@/pages/admin/leases/LeasesList'
import { LeaseForm } from '@/pages/admin/leases/LeaseForm'
import { LeaseDetail } from '@/pages/admin/leases/LeaseDetail'
import { TenantsList } from '@/pages/admin/tenants/TenantsList'
import { TenantDetail } from '@/pages/admin/tenants/TenantDetail'

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
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />

            {/* Properties */}
            <Route path={ROUTES.ADMIN.PROPERTIES.INDEX} element={<PropertiesList />} />
            <Route path={ROUTES.ADMIN.PROPERTIES.NEW} element={<PropertyForm />} />
            <Route path={ROUTES.ADMIN.PROPERTIES.DETAIL} element={<PropertyDetail />} />
            <Route path={ROUTES.ADMIN.PROPERTIES.EDIT} element={<PropertyForm />} />

            {/* Buildings */}
            <Route path={ROUTES.ADMIN.BUILDINGS.INDEX} element={<BuildingsList />} />
            <Route path={ROUTES.ADMIN.BUILDINGS.NEW} element={<BuildingForm />} />
            <Route path={ROUTES.ADMIN.BUILDINGS.DETAIL} element={<BuildingDetail />} />
            <Route path={ROUTES.ADMIN.BUILDINGS.EDIT} element={<BuildingForm />} />

            {/* Units */}
            <Route path={ROUTES.ADMIN.UNITS.INDEX} element={<UnitsList />} />
            <Route path={ROUTES.ADMIN.UNITS.NEW} element={<UnitForm />} />
            <Route path={ROUTES.ADMIN.UNITS.DETAIL} element={<UnitDetail />} />
            <Route path={ROUTES.ADMIN.UNITS.EDIT} element={<UnitForm />} />
            <Route path={ROUTES.ADMIN.UNITS.PHOTOS} element={<PlaceholderPage title="Unit Photos" />} />

            {/* Leases */}
            <Route path={ROUTES.ADMIN.LEASES.INDEX} element={<LeasesList />} />
            <Route path={ROUTES.ADMIN.LEASES.NEW} element={<LeaseForm />} />
            <Route path={ROUTES.ADMIN.LEASES.DETAIL} element={<LeaseDetail />} />
            <Route path={ROUTES.ADMIN.LEASES.EDIT} element={<LeaseForm />} />

            {/* Payments */}
            <Route path={ROUTES.ADMIN.PAYMENTS.INDEX} element={<PlaceholderPage title="All Payments" />} />
            <Route path={ROUTES.ADMIN.PAYMENTS.DETAIL} element={<PlaceholderPage title="Payment Details" />} />

            {/* Invoices */}
            <Route path="/admin/invoices" element={<PlaceholderPage title="Invoices" />} />
            <Route path="/admin/invoices/new" element={<PlaceholderPage title="Create Invoice" />} />
            <Route path="/admin/invoices/:id" element={<PlaceholderPage title="Invoice Details" />} />

            {/* Maintenance */}
            <Route path={ROUTES.ADMIN.MAINTENANCE.INDEX} element={<PlaceholderPage title="Maintenance Requests" />} />
            <Route path={ROUTES.ADMIN.MAINTENANCE.DETAIL} element={<PlaceholderPage title="Request Details" />} />
            <Route path="/admin/maintenance/:id/assign" element={<PlaceholderPage title="Assign Request" />} />

            {/* Tenants */}
            <Route path={ROUTES.ADMIN.TENANTS.INDEX} element={<TenantsList />} />
            <Route path={ROUTES.ADMIN.TENANTS.DETAIL} element={<TenantDetail />} />
          </Route>
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
