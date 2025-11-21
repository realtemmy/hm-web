// Property create/edit form
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import { useProperty, useCreateProperty, useUpdateProperty } from '@/hooks/queries/useProperties'
import { propertySchema } from '@/lib/validators/property'
import { PROPERTY_TYPES } from '@/config/constants'
import { ROUTES } from '@/config/routes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'
import type { PropertyFormData } from '@/lib/validators/property'

export const PropertyForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  // Fetch property data if editing
  const { data: property, isLoading: isLoadingProperty } = useProperty(id || '')


  const createMutation = useCreateProperty()
  const updateMutation = useUpdateProperty()

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'APARTMENT',
      ownerId: '',
    },
  })

  // Load property data into form when editing
  useEffect(() => {
    if (property) {
      form.reset({
        title: property.title,
        description: property.description || '',
        type: property.type,
        ownerId: property.ownerId,
      })
    }
  }, [property, form])

  const onSubmit = async (data: PropertyFormData) => {
    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data })
        toast.success("The property has been updated successfully.");
      } else {
        await createMutation.mutateAsync(data)
        toast.success("The property has been created successfully.");
      }
      navigate(ROUTES.ADMIN.PROPERTIES.INDEX)
    } catch (error) {
      toast.error(
        isEditMode
          ? "Failed to update property. Please try again."
          : "Failed to create property. Please try again."
      );
    }
  }

  if (isEditMode && isLoadingProperty) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading property...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">
            {isEditMode ? 'Edit Property' : 'Add New Property'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode
              ? 'Update property information'
              : 'Enter the details of your property'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the basic details about the property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sunset Apartments" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the property..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of the property
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROPERTY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.ADMIN.PROPERTIES.INDEX)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'Update Property' : 'Create Property'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
