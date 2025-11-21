// Buildings query hooks using React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buildingsApi } from "@/lib/api/buildings";
import type { BuildingFormData } from "@/lib/validators/building";

// Query keys
export const buildingKeys = {
  all: ["buildings"] as const,
  lists: () => [...buildingKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...buildingKeys.lists(), filters] as const,
  details: () => [...buildingKeys.all, "detail"] as const,
  detail: (id: string) => [...buildingKeys.details(), id] as const,
};

interface UseBuildingsParams {
  page?: number;
  limit?: number;
  search?: string;
  propertyId?: string;
}

/**
 * Hook to get all buildings with optional filters
 */
export function useBuildings(params?: UseBuildingsParams) {
  return useQuery({
    queryKey: buildingKeys.list(params as Record<string, unknown>),
    queryFn: async () => {
      const response = await buildingsApi.getBuildings(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get a single building by ID
 */
export function useBuilding(id: string) {
  return useQuery({
    queryKey: buildingKeys.detail(id),
    queryFn: async () => {
      const response = await buildingsApi.getBuilding(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new building
 */
export function useCreateBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BuildingFormData) => {
      const response = await buildingsApi.createBuilding(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate buildings list to refetch
      queryClient.invalidateQueries({ queryKey: buildingKeys.lists() });
    },
  });
}

/**
 * Hook to update a building
 */
export function useUpdateBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: BuildingFormData;
    }) => {
      const response = await buildingsApi.updateBuilding(id, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: buildingKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: buildingKeys.detail(data.id),
      });
    },
  });
}

/**
 * Hook to delete a building
 */
export function useDeleteBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await buildingsApi.deleteBuilding(id);
      return id;
    },
    onSuccess: () => {
      // Invalidate buildings list to refetch
      queryClient.invalidateQueries({ queryKey: buildingKeys.lists() });
    },
  });
}
