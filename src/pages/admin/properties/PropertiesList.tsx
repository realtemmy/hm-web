// Properties list page with table and filters
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Plus, Search, Building2, MapPin, Trash2, Edit, Eye } from 'lucide-react'
import { useProperties, useDeleteProperty } from '@/hooks/queries/useProperties'
import { ROUTES, buildRoute } from '@/config/routes'
import { PROPERTY_TYPES, NIGERIAN_STATES } from '@/config/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export const PropertiesList = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>()
  const [stateFilter, setStateFilter] = useState<string>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Fetch properties with filters
  const { data, isLoading, error } = useProperties({
    search,
    type: typeFilter,
    state: stateFilter,
  })

  const deleteMutation = useDeleteProperty()

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    } catch (error) {
      console.error('Failed to delete property:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Properties</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your rental properties
          </p>
        </div>
        <Button asChild>
          <Link to={ROUTES.ADMIN.PROPERTIES.NEW}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All states" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All states</SelectItem>
                {NIGERIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading properties...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium">Failed to load properties</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Please try again later
                </p>
              </div>
            </div>
          ) : !data?.properties || data.properties.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">No properties found</p>
              <p className="mt-1 text-xs text-muted-foreground mb-4">
                Get started by adding your first property
              </p>
              <Button asChild>
                <Link to={ROUTES.ADMIN.PROPERTIES.NEW}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Property
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Buildings</TableHead>
                  <TableHead className="text-center">Units</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.name}</TableCell>
                    <TableCell>
                      {PROPERTY_TYPES.find((t) => t.value === property.type)?.label || property.type}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {property.city}, {property.state}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {property._count?.buildings || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {property._count?.buildings ? '—' : 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(buildRoute(ROUTES.ADMIN.PROPERTIES.DETAIL, { id: property.id }))}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(buildRoute(ROUTES.ADMIN.PROPERTIES.EDIT, { id: property.id }))}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(property.id)}
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
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot be
              undone and will also delete all associated buildings and units.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
