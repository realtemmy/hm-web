// Lease create/edit form
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { useLease, useCreateLease, useUpdateLease } from "@/hooks/queries/useLeases";
import { useUnits } from "@/hooks/queries/useUnits";
import { useTenants } from "@/hooks/queries/useTenants";
import { leaseSchema, type LeaseFormData } from "@/lib/validators/lease";
import { ROUTES } from "@/config/routes";
import { CURRENCY } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const LeaseForm = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const unitIdParam = searchParams.get("unitId");

  const { data: lease, isLoading: isLoadingLease } = useLease(id || "");
  const { data: unitsData } = useUnits();
  const { data: tenantsData } = useTenants();

  const createMutation = useCreateLease();
  const updateMutation = useUpdateLease();

  const form = useForm<LeaseFormData>({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      unitId: unitIdParam || "",
      tenantId: "",
      startDate: "",
      endDate: "",
      rentAmount: 0,
      securityDeposit: undefined,
      status: "PENDING",
    },
  });

  useEffect(() => {
    if (lease) {
      form.reset({
        unitId: lease.unitId,
        tenantId: lease.tenantId,
        startDate: lease.startDate.split("T")[0],
        endDate: lease.endDate.split("T")[0],
        rentAmount: lease.rentAmount,
        securityDeposit: lease.securityDeposit,
        status: lease.status,
      });
    }
  }, [lease, form]);

  const onSubmit = async (data: LeaseFormData) => {
    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data });
        toast.success("The lease has been updated successfully.");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("The lease has been created successfully.");
      }
      navigate(ROUTES.ADMIN.LEASES.INDEX);
    } catch (error) {
      toast.error(
        isEditMode
          ? "Failed to update lease. Please try again."
          : "Failed to create lease. Please try again."
      );
    }
  };

  if (isEditMode && isLoadingLease) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading lease...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">
            {isEditMode ? "Edit Lease" : "Add New Lease"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode ? "Update lease information" : "Create a new rental agreement"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lease Details</CardTitle>
              <CardDescription>Basic information about the lease</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!!unitIdParam}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {unitsData?.items?.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.unitNumber} - {unit.property?.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the unit for this lease
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tenantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenant" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tenantsData?.items?.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.userId}>
                            {tenant.user?.name} ({tenant.user?.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the tenant for this lease
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="rentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Rent ({CURRENCY.SYMBOL})</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityDeposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Deposit ({CURRENCY.SYMBOL})</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="TERMINATED">Terminated</SelectItem>
                        <SelectItem value="EXPIRED">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(ROUTES.ADMIN.LEASES.INDEX)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? "Update Lease" : "Create Lease"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
