// Admin layout with sidebar and header
import { Outlet } from 'react-router'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar - Fixed left */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header - Fixed top */}
        <AdminHeader />

        {/* Page content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
