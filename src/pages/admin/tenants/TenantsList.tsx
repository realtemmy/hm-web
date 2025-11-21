// Tenants list page with search and filters
import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Users, Eye } from "lucide-react";
import { useTenants } from "@/hooks/queries/useTenants";
import { ROUTES, buildRoute } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const TenantsList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Fetch tenants with search
  const { data, isLoading, error } = useTenants({
    search,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tenants</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage tenant profiles and rental history
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>Find tenants by name or email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tenants Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">
                  Loading tenants...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium">Failed to load tenants</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Please try again later
                </p>
              </div>
            </div>
          ) : !data?.items || data.items.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">No tenants found</p>
              <p className="mt-1 text-xs text-muted-foreground mb-4">
                Tenants are created automatically when users sign up with USER role
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Emergency Contact</TableHead>
                  <TableHead>Moved In</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">
                      {tenant.user?.name || "—"}
                    </TableCell>
                    <TableCell>{tenant.user?.email || "—"}</TableCell>
                    <TableCell>{tenant.user?.phone || "—"}</TableCell>
                    <TableCell>
                      {tenant.emergencyContact || "—"}
                    </TableCell>
                    <TableCell>
                      {tenant.movedInAt
                        ? new Date(tenant.movedInAt).toLocaleDateString("en-NG", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View Tenant"
                        onClick={() =>
                          navigate(
                            buildRoute(ROUTES.ADMIN.TENANTS.DETAIL, {
                              id: tenant.id,
                            })
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
