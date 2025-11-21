// Leases query hooks using React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leasesApi } from "@/lib/api/leases";
import type { LeaseFormData } from "@/lib/validators/lease";

// Query keys
export const leaseKeys = {
  all: ["leases"] as const,
  lists: () => [...leaseKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...leaseKeys.lists(), filters] as const,
  details: () => [...leaseKeys.all, "detail"] as const,
  detail: (id: string) => [...leaseKeys.details(), id] as const,
};

interface UseLeasesParams {
  page?: number;
  limit?: number;
  search?: string;
  unitId?: string;
  tenantId?: string;
  status?: string;
}

/**
 * Hook to get all leases with optional filters
 */
export function useLeases(params?: UseLeasesParams) {
  return useQuery({
    queryKey: leaseKeys.list(params as Record<string, unknown>),
    queryFn: async () => {
      const response = await leasesApi.getLeases(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get a single lease by ID
 */
export function useLease(id: string) {
  return useQuery({
    queryKey: leaseKeys.detail(id),
    queryFn: async () => {
      const response = await leasesApi.getLease(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new lease
 */
export function useCreateLease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LeaseFormData) => {
      const response = await leasesApi.createLease(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate leases list to refetch
      queryClient.invalidateQueries({ queryKey: leaseKeys.lists() });
    },
  });
}

/**
 * Hook to update a lease
 */
export function useUpdateLease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: LeaseFormData;
    }) => {
      const response = await leasesApi.updateLease(id, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: leaseKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: leaseKeys.detail(data.id),
      });
    },
  });
}

/**
 * Hook to delete a lease
 */
export function useDeleteLease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await leasesApi.deleteLease(id);
      return id;
    },
    onSuccess: () => {
      // Invalidate leases list to refetch
      queryClient.invalidateQueries({ queryKey: leaseKeys.lists() });
    },
  });
}
