// Leases API client
import apiClient from "@/lib/api-client";
import type { Lease } from "@/types";
import type { LeaseFormData } from "@/lib/validators/lease";

interface GetLeasesParams {
  page?: number;
  limit?: number;
  search?: string;
  unitId?: string;
  tenantId?: string;
  status?: string;
}

interface LeasesResponse {
  status: "success";
  data: {
    items: Lease[];
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

interface LeaseResponse {
  status: "success";
  data: Lease;
}

export const leasesApi = {
  // Get all leases with filters
  getLeases: async (params?: GetLeasesParams): Promise<LeasesResponse> => {
    const response = await apiClient.get<LeasesResponse>("/leases", {
      params,
    });
    return response.data;
  },

  // Get single lease by ID
  getLease: async (id: string): Promise<LeaseResponse> => {
    const response = await apiClient.get<LeaseResponse>(`/leases/${id}`);
    return response.data;
  },

  // Create new lease
  createLease: async (data: LeaseFormData): Promise<LeaseResponse> => {
    const response = await apiClient.post<LeaseResponse>("/leases", data);
    return response.data;
  },

  // Update lease
  updateLease: async (
    id: string,
    data: LeaseFormData
  ): Promise<LeaseResponse> => {
    const response = await apiClient.patch<LeaseResponse>(
      `/leases/${id}`,
      data
    );
    return response.data;
  },

  // Delete lease
  deleteLease: async (id: string): Promise<void> => {
    await apiClient.delete(`/leases/${id}`);
  },
};
