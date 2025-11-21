// Buildings list page with table and filters
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Search, Building, Trash2, Edit, Eye } from "lucide-react";
import { useBuildings, useDeleteBuilding } from "@/hooks/queries/useBuildings";
import { useProperties } from "@/hooks/queries/useProperties";
import { ROUTES, buildRoute } from "@/config/routes";
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

export const BuildingsList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState<string>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch buildings with filters
  const { data, isLoading, error } = useBuildings({
    search,
    propertyId: propertyFilter,
  });

  // Fetch properties for filter dropdown
  const { data: propertiesData } = useProperties();

  const deleteMutation = useDeleteBuilding();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete building:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Buildings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage buildings across your properties
          </p>
        </div>
        <Button asChild>
          <Link to={ROUTES.ADMIN.BUILDINGS.NEW}>
            <Plus className="mr-2 h-4 w-4" />
            Add Building
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter your buildings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search buildings..."
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
          </div>
        </CardContent>
      </Card>

      {/* Buildings Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">
                  Loading buildings...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium">Failed to load buildings</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Please try again later
                </p>
              </div>
            </div>
          ) : !data?.items || data.items.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">No buildings found</p>
              <p className="mt-1 text-xs text-muted-foreground mb-4">
                Get started by adding your first building
              </p>
              <Button asChild>
                <Link to={ROUTES.ADMIN.BUILDINGS.NEW}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Building
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-center">Floors</TableHead>
                  <TableHead className="text-center">Units</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((building) => (
                  <TableRow key={building.id}>
                    <TableCell className="font-medium">
                      {building.name}
                    </TableCell>
                    <TableCell>{building.property?.title || "—"}</TableCell>
                    <TableCell>
                      {building.address ? (
                        <div className="text-sm text-muted-foreground">
                          {building.address.city}, {building.address.state}
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {building.floors || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {building.units?.length || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Building"
                          onClick={() =>
                            navigate(
                              buildRoute(ROUTES.ADMIN.BUILDINGS.DETAIL, {
                                id: building.id,
                              })
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit Building"
                          onClick={() =>
                            navigate(
                              buildRoute(ROUTES.ADMIN.BUILDINGS.EDIT, {
                                id: building.id,
                              })
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          title="Delete Building"
                          onClick={() => setDeleteId(building.id)}
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
            <AlertDialogTitle>Delete Building</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this building? This action cannot
              be undone and will also delete all associated units.
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
