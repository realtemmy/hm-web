// Leases list page with table and filters
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Plus,
  Search,
  FileText,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import { useLeases, useDeleteLease } from "@/hooks/queries/useLeases";
import { useUnits } from "@/hooks/queries/useUnits";
import { ROUTES, buildRoute } from "@/config/routes";
import { CURRENCY } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import type { LeaseStatus } from "@/types";

const statusColors: Record<LeaseStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  TERMINATED: "bg-red-100 text-red-800",
  EXPIRED: "bg-gray-100 text-gray-800",
};

export const LeasesList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [unitFilter, setUnitFilter] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<LeaseStatus>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch leases with filters
  const { data, isLoading, error } = useLeases({
    search,
    unitId: unitFilter,
    status: statusFilter,
  });

  // Fetch units for filter dropdown
  const { data: unitsData } = useUnits();

  const deleteMutation = useDeleteLease();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete lease:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leases</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage rental agreements and contracts
          </p>
        </div>
        <Button asChild>
          <Link to={ROUTES.ADMIN.LEASES.NEW}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lease
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter your leases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={unitFilter} onValueChange={setUnitFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All units</SelectItem>
                {unitsData?.items?.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.unitNumber} - {unit.property?.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as LeaseStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="TERMINATED">Terminated</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leases Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">
                  Loading leases...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium">Failed to load leases</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Please try again later
                </p>
              </div>
            </div>
          ) : !data?.items || data.items.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">No leases found</p>
              <p className="mt-1 text-xs text-muted-foreground mb-4">
                Get started by creating your first lease
              </p>
              <Button asChild>
                <Link to={ROUTES.ADMIN.LEASES.NEW}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lease
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((lease) => (
                  <TableRow key={lease.id}>
                    <TableCell className="font-medium">
                      {lease.unit?.unitNumber || "—"}
                    </TableCell>
                    <TableCell>
                      {lease.tenant?.name || "—"}
                    </TableCell>
                    <TableCell>
                      {new Date(lease.startDate).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(lease.endDate).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {CURRENCY.SYMBOL}
                      {lease.rentAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[lease.status]}>
                        {lease.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Lease"
                          onClick={() =>
                            navigate(
                              buildRoute(ROUTES.ADMIN.LEASES.DETAIL, {
                                id: lease.id,
                              })
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit Lease"
                          onClick={() =>
                            navigate(
                              buildRoute(ROUTES.ADMIN.LEASES.EDIT, {
                                id: lease.id,
                              })
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          title="Delete Lease"
                          onClick={() => setDeleteId(lease.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lease</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this lease? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
