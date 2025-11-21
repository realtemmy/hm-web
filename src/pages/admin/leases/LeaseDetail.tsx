// Lease detail page with payments and renewal info
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Edit, Trash2, Calendar, User, Home } from "lucide-react";
import { useLease, useDeleteLease } from "@/hooks/queries/useLeases";
import { ROUTES, buildRoute } from "@/config/routes";
import { CURRENCY } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { LeaseStatus } from "@/types";

const statusColors: Record<LeaseStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  TERMINATED: "bg-red-100 text-red-800",
  EXPIRED: "bg-gray-100 text-gray-800",
};

export const LeaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: lease, isLoading, error } = useLease(id || "");
  const deleteMutation = useDeleteLease();

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("The lease has been deleted successfully.");
      navigate(ROUTES.ADMIN.LEASES.INDEX);
    } catch (error) {
      toast.error("Failed to delete lease. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading lease...</p>
        </div>
      </div>
    );
  }

  if (error || !lease) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium">Lease not found</p>
          <p className="mt-1 text-xs text-muted-foreground mb-4">
            The lease you're looking for doesn't exist or has been deleted
          </p>
          <Button onClick={() => navigate(ROUTES.ADMIN.LEASES.INDEX)}>
            Back to Leases
          </Button>
        </div>
      </div>
    );
  }

  const duration = Math.ceil(
    (new Date(lease.endDate).getTime() - new Date(lease.startDate).getTime()) /
      (1000 * 60 * 60 * 24 * 30)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">Lease Details</h1>
              <Badge className={statusColors[lease.status]}>{lease.status}</Badge>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              {lease.unit && (
                <>
                  Unit:{" "}
                  <Link
                    to={buildRoute(ROUTES.ADMIN.UNITS.DETAIL, { id: lease.unitId })}
                    className="text-primary hover:underline"
                  >
                    {lease.unit.unitNumber}
                  </Link>
                </>
              )}
              {lease.tenant && (
                <>
                  {" · "}Tenant:{" "}
                  <span>
                    {lease.tenant.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(buildRoute(ROUTES.ADMIN.LEASES.EDIT, { id: lease.id }))}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Lease</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this lease? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Rent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{CURRENCY.SYMBOL}{lease.rentAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Security Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {lease.securityDeposit ? `${CURRENCY.SYMBOL}${lease.securityDeposit.toLocaleString()}` : "—"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{duration} months</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lease Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Start Date</p>
              <p className="mt-1 flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3" />
                {new Date(lease.startDate).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">End Date</p>
              <p className="mt-1 flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3" />
                {new Date(lease.endDate).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="mt-1 text-sm">
                {new Date(lease.createdAt).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Unit & Tenant</CardTitle>
                <CardDescription>Associated unit and tenant information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {lease.unit && (
              <Link
                to={buildRoute(ROUTES.ADMIN.UNITS.DETAIL, { id: lease.unitId })}
                className="flex items-center justify-between rounded-md border border-border p-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Unit {lease.unit.unitNumber}</p>
                    <p className="text-xs text-muted-foreground">{lease.unit.property?.title}</p>
                  </div>
                </div>
              </Link>
            )}

            {lease.tenant && (
              <div className="flex items-center gap-3 rounded-md border border-border p-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {lease.tenant.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{lease.tenant.email}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments & Invoices</CardTitle>
          <CardDescription>{lease.payments?.length || 0} payments recorded</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm font-medium">Payment tracking coming soon</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Payment management will be available in Phase 2E
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
