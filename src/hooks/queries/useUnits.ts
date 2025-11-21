// Units query hooks using React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { unitsApi } from "@/lib/api/units";
import type { Unit, UnitStatus } from "@/types";

// Query keys
export const unitKeys = {
  all: ["units"] as const,
  lists: () => [...unitKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...unitKeys.lists(), filters] as const,
  details: () => [...unitKeys.all, "detail"] as const,
  detail: (id: string) => [...unitKeys.details(), id] as const,
};

interface UseUnitsParams {
  page?: number;
  limit?: number;
  search?: string;
  propertyId?: string;
  buildingId?: string;
  status?: UnitStatus;
}

/**
 * Hook to get all units with optional filters
 */
export function useUnits(params?: UseUnitsParams) {
  return useQuery({
    queryKey: unitKeys.list(params as Record<string, unknown>),
    queryFn: async () => {
      const response = await unitsApi.getUnits(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get a single unit by ID
 */
export function useUnit(id: string) {
  return useQuery({
    queryKey: unitKeys.detail(id),
    queryFn: async () => {
      const response = await unitsApi.getUnit(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new unit
 */
export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Unit, "id" | "createdAt" | "updatedAt">) => {
      const response = await unitsApi.createUnit(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate units list to refetch
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
    },
  });
}

/**
 * Hook to update a unit
 */
export function useUpdateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Unit> }) => {
      const response = await unitsApi.updateUnit(id, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: unitKeys.detail(data.id) });
    },
  });
}

/**
 * Hook to delete a unit
 */
export function useDeleteUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await unitsApi.deleteUnit(id);
      return id;
    },
    onSuccess: () => {
      // Invalidate units list to refetch
      queryClient.invalidateQueries({ queryKey: unitKeys.lists() });
    },
  });
}
