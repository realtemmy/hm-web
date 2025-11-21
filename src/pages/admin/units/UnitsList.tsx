// Units list page with table and filters
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Plus,
  Search,
  Home,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import { useUnits, useDeleteUnit } from "@/hooks/queries/useUnits";
import { useProperties } from "@/hooks/queries/useProperties";
import { useBuildings } from "@/hooks/queries/useBuildings";
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
import type { UnitStatus } from "@/types";

const statusColors: Record<UnitStatus, string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  OCCUPIED: "bg-blue-100 text-blue-800",
  MAINTENANCE: "bg-orange-100 text-orange-800",
  RESERVED: "bg-purple-100 text-purple-800",
};

export const UnitsList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState<string>();
  const [buildingFilter, setBuildingFilter] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<UnitStatus>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch units with filters
  const { data, isLoading, error } = useUnits({
    search,
    propertyId: propertyFilter,
    buildingId: buildingFilter,
    status: statusFilter,
  });

  // Fetch properties for filter dropdown
  const { data: propertiesData } = useProperties();

  // Fetch buildings filtered by selected property
  const { data: buildingsData } = useBuildings({
    propertyId: propertyFilter,
  });

  const deleteMutation = useDeleteUnit();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete unit:", error);
    }
  };

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Units</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage rental units across your properties
          </p>
        </div>
        <Button asChild>
          <Link to={ROUTES.ADMIN.UNITS.NEW}>
            <Plus className="mr-2 h-4 w-4" />
            Add Unit
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter your units</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search units..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={propertyFilter} onValueChange={setPropertyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All properties</SelectItem>
                {propertiesData?.items?.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All buildings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All buildings</SelectItem>
                {buildingsData?.items?.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as UnitStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="OCCUPIED">Occupied</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="RESERVED">Reserved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Units Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">
                  Loading units...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium">Failed to load units</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Please try again later
                </p>
              </div>
            </div>
          ) : !data?.items || data.items.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center">
              <Home className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">No units found</p>
              <p className="mt-1 text-xs text-muted-foreground mb-4">
                Get started by adding your first unit
              </p>
              <Button asChild>
                <Link to={ROUTES.ADMIN.UNITS.NEW}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Unit
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit Number</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead className="text-center">Bed/Bath</TableHead>
                  <TableHead className="text-right">Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">
                      {unit.unitNumber}
                    </TableCell>
                    <TableCell>{unit.building?.name || "—"}</TableCell>
                    <TableCell>{unit.property?.title || "—"}</TableCell>
                    <TableCell className="text-center">
                      {unit.bedrooms || 0} / {unit.bathrooms || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {CURRENCY.SYMBOL}
                      {unit.rentAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[unit.status]}>
                        {unit.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Unit"
                          onClick={() =>
                            navigate(
                              buildRoute(ROUTES.ADMIN.UNITS.DETAIL, {
                                id: unit.id,
                              })
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit Unit"
                          onClick={() =>
                            navigate(
                              buildRoute(ROUTES.ADMIN.UNITS.EDIT, {
                                id: unit.id,
                              })
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          title="Delete Unit"
                          onClick={() => setDeleteId(unit.id)}
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
            <AlertDialogTitle>Delete Unit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this unit? This action cannot be
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
