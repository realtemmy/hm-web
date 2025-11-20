// Property detail page with stats and buildings
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Building,
  MapPin,
  Calendar,
} from "lucide-react";
import { useProperty, useDeleteProperty } from "@/hooks/queries/useProperties";
import { ROUTES, buildRoute } from "@/config/routes";
import { PROPERTY_TYPES } from "@/config/constants";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: property, isLoading, error } = useProperty(id || "");
  const deleteMutation = useDeleteProperty();

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("The property has been deleted successfully.");
      navigate(ROUTES.ADMIN.PROPERTIES.INDEX);
    } catch (error) {
      toast.error("Failed to delete property. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium">Property not found</p>
          <p className="mt-1 text-xs text-muted-foreground mb-4">
            The property you're looking for doesn't exist or has been deleted
          </p>
          <Button onClick={() => navigate(ROUTES.ADMIN.PROPERTIES.INDEX)}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const propertyType = PROPERTY_TYPES.find((t) => t.value === property.type);
  const buildingsCount = property._count?.buildings || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{property.name}</h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {property.street}, {property.city}, {property.state}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              navigate(
                buildRoute(ROUTES.ADMIN.PROPERTIES.EDIT, { id: property.id })
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
                <AlertDialogTitle>Delete Property</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this property? This action
                  cannot be undone and will also delete all associated buildings
                  and units.
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
              Buildings
            </CardTitle>
            <Building className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{buildingsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Units
            </CardTitle>
            <Building className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">—</div>
            <p className="text-xs text-muted-foreground">
              Across all buildings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Occupancy
            </CardTitle>
            <Building className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">—</div>
            <p className="text-xs text-muted-foreground">
              Overall occupancy rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Property Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <Badge variant="secondary" className="mt-1">
                {propertyType?.label || property.type}
              </Badge>
            </div>

            {property.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Description
                </p>
                <p className="mt-1 text-sm">{property.description}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              <p className="mt-1 text-sm">
                {property.street}
                <br />
                {property.city}, {property.state}
                {property.postalCode && ` ${property.postalCode}`}
              </p>
            </div>

            {property.latitude && property.longitude && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Coordinates
                </p>
                <p className="mt-1 text-sm">
                  {property.latitude}, {property.longitude}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3" />
                {new Date(property.createdAt).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Buildings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Buildings</CardTitle>
                <CardDescription>
                  {buildingsCount}{" "}
                  {buildingsCount === 1 ? "building" : "buildings"} in this
                  property
                </CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link
                  to={`${ROUTES.ADMIN.BUILDINGS.NEW}?propertyId=${property.id}`}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {buildingsCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Building className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No buildings yet</p>
                <p className="mt-1 text-xs text-muted-foreground mb-4">
                  Add buildings to this property to get started
                </p>
                <Button size="sm" asChild>
                  <Link
                    to={`${ROUTES.ADMIN.BUILDINGS.NEW}?propertyId=${property.id}`}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Building
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Building list will be displayed here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
