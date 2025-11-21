// Buildings API client
import apiClient from "@/lib/api-client";
import type { Building } from "@/types";
import type { BuildingFormData } from "@/lib/validators/building";

interface GetBuildingsParams {
  page?: number;
  limit?: number;
  search?: string;
  propertyId?: string;
}

interface BuildingsResponse {
  status: "success";
  data: {
    items: Building[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

interface BuildingResponse {
  status: "success";
  data: Building;
}

export const buildingsApi = {
  // Get all buildings with filters
  getBuildings: async (
    params?: GetBuildingsParams
  ): Promise<BuildingsResponse> => {
    const response = await apiClient.get<BuildingsResponse>("/buildings", {
      params,
    });
    return response.data;
  },

  // Get single building by ID
  getBuilding: async (id: string): Promise<BuildingResponse> => {
    const response = await apiClient.get<BuildingResponse>(
      `/buildings/${id}`
    );
    return response.data;
  },

  // Create new building
  createBuilding: async (
    data: BuildingFormData
  ): Promise<BuildingResponse> => {
    const response = await apiClient.post<BuildingResponse>(
      "/buildings",
      data
    );
    return response.data;
  },

  // Update building
  updateBuilding: async (
    id: string,
    data: BuildingFormData
  ): Promise<BuildingResponse> => {
    const response = await apiClient.patch<BuildingResponse>(
      `/buildings/${id}`,
      data
    );
    return response.data;
  },

  // Delete building
  deleteBuilding: async (id: string): Promise<void> => {
    await apiClient.delete(`/buildings/${id}`);
  },
};
