// Units API client
import apiClient from "@/lib/api-client";
import type { Unit, UnitStatus } from "@/types";

interface GetUnitsParams {
  page?: number;
  limit?: number;
  search?: string;
  propertyId?: string;
  buildingId?: string;
  status?: UnitStatus;
}

interface UnitsResponse {
  status: "success";
  data: {
    items: Unit[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

interface UnitResponse {
  status: "success";
  data: Unit;
}

export const unitsApi = {
  // Get all units with filters
  getUnits: async (params?: GetUnitsParams): Promise<UnitsResponse> => {
    const response = await apiClient.get<UnitsResponse>("/units", {
      params,
    });
    return response.data;
  },

  // Get single unit by ID
  getUnit: async (id: string): Promise<UnitResponse> => {
    const response = await apiClient.get<UnitResponse>(`/units/${id}`);
    return response.data;
  },

  // Create new unit
  createUnit: async (
    data: Omit<Unit, "id" | "createdAt" | "updatedAt">
  ): Promise<UnitResponse> => {
    const response = await apiClient.post<UnitResponse>("/units", data);
    return response.data;
  },

  // Update unit
  updateUnit: async (
    id: string,
    data: Partial<Unit>
  ): Promise<UnitResponse> => {
    const response = await apiClient.patch<UnitResponse>(`/units/${id}`, data);
    return response.data;
  },

  // Delete unit
  deleteUnit: async (id: string): Promise<void> => {
    await apiClient.delete(`/units/${id}`);
  },
};
