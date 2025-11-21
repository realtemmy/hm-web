// Building detail page with stats and units
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Home,
  MapPin,
  Calendar,
} from "lucide-react";
import { useBuilding, useDeleteBuilding } from "@/hooks/queries/useBuildings";
import { ROUTES, buildRoute } from "@/config/routes";
import { Button } from "@/components/ui/button";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const BuildingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: building, isLoading, error } = useBuilding(id || "");
  const deleteMutation = useDeleteBuilding();

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("The building has been deleted successfully.");
      navigate(ROUTES.ADMIN.BUILDINGS.INDEX);
    } catch (error) {
      toast.error("Failed to delete building. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading building...</p>
        </div>
      </div>
    );
  }

  if (error || !building) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium">Building not found</p>
          <p className="mt-1 text-xs text-muted-foreground mb-4">
            The building you're looking for doesn't exist or has been deleted
          </p>
          <Button onClick={() => navigate(ROUTES.ADMIN.BUILDINGS.INDEX)}>
            Back to Buildings
          </Button>
        </div>
      </div>
    );
  }

  const unitsCount = building.units?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{building.name}</h1>
            {building.property && (
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                Property:{" "}
                <Link
                  to={buildRoute(ROUTES.ADMIN.PROPERTIES.DETAIL, {
                    id: building.propertyId,
                  })}
                  className="text-primary hover:underline"
                >
                  {building.property.title}
                </Link>
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              navigate(
                buildRoute(ROUTES.ADMIN.BUILDINGS.EDIT, { id: building.id })
              )
            }
          >
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
                <AlertDialogTitle>Delete Building</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this building? This action
                  cannot be undone and will also delete all associated units.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Units
            </CardTitle>
            <Home className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{unitsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Occupied Units
            </CardTitle>
            <Home className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">—</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Units
            </CardTitle>
            <Home className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">—</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Building Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Building Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {building.floors && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Floors
                </p>
                <p className="mt-1 text-sm">{building.floors}</p>
              </div>
            )}

            {building.address && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Address
                </p>
                <div className="mt-1 text-sm">
                  <p>{building.address.street}</p>
                  <p>
                    {building.address.city}, {building.address.state}{" "}
                    {building.address.postalCode}
                  </p>
                  <p>{building.address.country}</p>
                </div>
              </div>
            )}

            {building.address?.latitude && building.address?.longitude && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Coordinates
                </p>
                <p className="mt-1 text-sm">
                  <MapPin className="inline h-3 w-3 mr-1" />
                  {building.address.latitude}, {building.address.longitude}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3" />
                {new Date(building.createdAt).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Units */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Units</CardTitle>
                <CardDescription>
                  {unitsCount} {unitsCount === 1 ? "unit" : "units"} in this
                  building
                </CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link
                  to={`${ROUTES.ADMIN.UNITS.NEW}?buildingId=${building.id}`}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {unitsCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Home className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No units yet</p>
                <p className="mt-1 text-xs text-muted-foreground mb-4">
                  Add units to this building to get started
                </p>
                <Button size="sm" asChild>
                  <Link
                    to={`${ROUTES.ADMIN.UNITS.NEW}?buildingId=${building.id}`}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Unit
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Unit list will be displayed here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
