// Properties query hooks using React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertiesApi } from '@/lib/api/properties'
import type { Property } from '@/types'

// Query keys
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
}

interface UsePropertiesParams {
  page?: number
  limit?: number
  search?: string
  type?: string
  state?: string
  status?: string
}

/**
 * Hook to get all properties with optional filters
 */
export function useProperties(params?: UsePropertiesParams) {
  return useQuery({
    queryKey: propertyKeys.list(params),
    queryFn: async () => {
      const response = await propertiesApi.getProperties(params)
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to get a single property by ID
 */
export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: async () => {
      const response = await propertiesApi.getProperty(id)
      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to create a new property
 */
export function useCreateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await propertiesApi.createProperty(data)
      return response.data
    },
    onSuccess: () => {
      // Invalidate properties list to refetch
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
    },
  })
}

/**
 * Hook to update a property
 */
export function useUpdateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Property> }) => {
      const response = await propertiesApi.updateProperty(id, data)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(data.id) })
    },
  })
}

/**
 * Hook to delete a property
 */
export function useDeleteProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await propertiesApi.deleteProperty(id)
      return id
    },
    onSuccess: () => {
      // Invalidate properties list to refetch
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
    },
  })
}
