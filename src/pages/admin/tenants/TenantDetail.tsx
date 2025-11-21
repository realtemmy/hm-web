// Tenant detail page with profile and leases
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, Home } from "lucide-react";
import { useTenant } from "@/hooks/queries/useTenants";
import { useLeases } from "@/hooks/queries/useLeases";
import { ROUTES, buildRoute } from "@/config/routes";
import { CURRENCY } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LeaseStatus } from "@/types";

const statusColors: Record<LeaseStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  TERMINATED: "bg-red-100 text-red-800",
  EXPIRED: "bg-gray-100 text-gray-800",
};

export const TenantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: tenant, isLoading, error } = useTenant(id || "");
  const { data: leasesData } = useLeases({ tenantId: tenant?.userId });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading tenant...</p>
        </div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium">Tenant not found</p>
          <p className="mt-1 text-xs text-muted-foreground mb-4">
            The tenant you're looking for doesn't exist or has been deleted
          </p>
          <Button onClick={() => navigate(ROUTES.ADMIN.TENANTS.INDEX)}>
            Back to Tenants
          </Button>
        </div>
      </div>
    );
  }

  const activeLeases = leasesData?.items?.filter(
    (lease) => lease.status === "ACTIVE" || lease.status === "PENDING"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{tenant.user?.name || "Tenant Profile"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tenant information and rental history
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{tenant.user?.name || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{tenant.user?.email || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{tenant.user?.phone || "—"}</p>
                </div>
              </div>

              {tenant.emergencyContact && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Emergency Contact</p>
                    <p className="text-sm text-muted-foreground">{tenant.emergencyContact}</p>
                  </div>
                </div>
              )}

              {tenant.movedInAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Moved In</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tenant.movedInAt).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}

              {tenant.movedOutAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Moved Out</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tenant.movedOutAt).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Leases</CardTitle>
                  <CardDescription>
                    {leasesData?.items?.length || 0} total lease(s)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!leasesData?.items || leasesData.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">No leases found</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This tenant doesn't have any leases yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leasesData.items.map((lease) => (
                    <Link
                      key={lease.id}
                      to={buildRoute(ROUTES.ADMIN.LEASES.DETAIL, { id: lease.id })}
                      className="flex items-center justify-between rounded-md border border-border p-3 hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            Unit {lease.unit?.unitNumber || "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(lease.startDate).toLocaleDateString("en-NG")} -{" "}
                            {new Date(lease.endDate).toLocaleDateString("en-NG")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-medium">
                          {CURRENCY.SYMBOL}{lease.rentAmount.toLocaleString()}
                        </p>
                        <Badge className={statusColors[lease.status]}>
                          {lease.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {activeLeases && activeLeases.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Current Residence</CardTitle>
                <CardDescription>Active rental unit</CardDescription>
              </CardHeader>
              <CardContent>
                {activeLeases.map((lease) => (
                  <div key={lease.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Unit {lease.unit?.unitNumber || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lease.unit?.property?.title || "—"}
                        </p>
                      </div>
                      <Badge className={statusColors[lease.status]}>
                        {lease.status}
                      </Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Monthly Rent</p>
                        <p className="text-sm font-medium">
                          {CURRENCY.SYMBOL}{lease.rentAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Lease Ends</p>
                        <p className="text-sm font-medium">
                          {new Date(lease.endDate).toLocaleDateString("en-NG")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
