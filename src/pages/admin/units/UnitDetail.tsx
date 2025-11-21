// Unit detail page with stats and photos
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Edit, Trash2, Image as ImageIcon, Calendar } from "lucide-react";
import { useUnit, useDeleteUnit } from "@/hooks/queries/useUnits";
import { ROUTES, buildRoute } from "@/config/routes";
import { CURRENCY } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { UnitStatus } from "@/types";

const statusColors: Record<UnitStatus, string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  OCCUPIED: "bg-blue-100 text-blue-800",
  MAINTENANCE: "bg-orange-100 text-orange-800",
  RESERVED: "bg-purple-100 text-purple-800",
};

export const UnitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: unit, isLoading, error } = useUnit(id || "");
  const deleteMutation = useDeleteUnit();

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("The unit has been deleted successfully.");
      navigate(ROUTES.ADMIN.UNITS.INDEX);
    } catch (error) {
      toast.error("Failed to delete unit. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading unit...</p>
        </div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium">Unit not found</p>
          <p className="mt-1 text-xs text-muted-foreground mb-4">
            The unit you're looking for doesn't exist or has been deleted
          </p>
          <Button onClick={() => navigate(ROUTES.ADMIN.UNITS.INDEX)}>
            Back to Units
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">Unit {unit.unitNumber}</h1>
              <Badge className={statusColors[unit.status]}>{unit.status}</Badge>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              {unit.building && (
                <>
                  Building:{" "}
                  <Link
                    to={buildRoute(ROUTES.ADMIN.BUILDINGS.DETAIL, { id: unit.buildingId || "" })}
                    className="text-primary hover:underline"
                  >
                    {unit.building.name}
                  </Link>
                </>
              )}
              {unit.property && (
                <>
                  {" · "}Property:{" "}
                  <Link
                    to={buildRoute(ROUTES.ADMIN.PROPERTIES.DETAIL, { id: unit.propertyId })}
                    className="text-primary hover:underline"
                  >
                    {unit.property.title}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(buildRoute(ROUTES.ADMIN.UNITS.EDIT, { id: unit.id }))}>
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
                <AlertDialogTitle>Delete Unit</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this unit? This action cannot be undone.
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
            <div className="text-2xl font-semibold">{CURRENCY.SYMBOL}{unit.rentAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {unit.depositAmount ? `${CURRENCY.SYMBOL}${unit.depositAmount.toLocaleString()}` : "—"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{unit.sqft ? `${unit.sqft} sqft` : "—"}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Unit Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bedrooms</p>
                <p className="mt-1 text-sm">{unit.bedrooms || "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bathrooms</p>
                <p className="mt-1 text-sm">{unit.bathrooms || "—"}</p>
              </div>
            </div>

            {unit.floor && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Floor</p>
                <p className="mt-1 text-sm">{unit.floor}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="mt-1 flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3" />
                {new Date(unit.createdAt).toLocaleDateString("en-NG", {
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
                <CardTitle>Photos</CardTitle>
                <CardDescription>{unit.photos?.length || 0} photos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No photos yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Photo upload feature coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
