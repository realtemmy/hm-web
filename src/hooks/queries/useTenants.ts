// Tenants query hooks using React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantsApi } from "@/lib/api/tenants";
import type { TenantFormData } from "@/lib/validators/tenant";

// Query keys
export const tenantKeys = {
  all: ["tenants"] as const,
  lists: () => [...tenantKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...tenantKeys.lists(), filters] as const,
  details: () => [...tenantKeys.all, "detail"] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
};

interface UseTenantsParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Hook to get all tenants with optional filters
 */
export function useTenants(params?: UseTenantsParams) {
  return useQuery({
    queryKey: tenantKeys.list(params as Record<string, unknown>),
    queryFn: async () => {
      const response = await tenantsApi.getTenants(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get a single tenant by ID
 */
export function useTenant(id: string) {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: async () => {
      const response = await tenantsApi.getTenant(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new tenant
 */
export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TenantFormData) => {
      const response = await tenantsApi.createTenant(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate tenants list to refetch
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });
}

/**
 * Hook to update a tenant
 */
export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TenantFormData;
    }) => {
      const response = await tenantsApi.updateTenant(id, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.detail(data.id),
      });
    },
  });
}

/**
 * Hook to delete a tenant
 */
export function useDeleteTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await tenantsApi.deleteTenant(id);
      return id;
    },
    onSuccess: () => {
      // Invalidate tenants list to refetch
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });
}
