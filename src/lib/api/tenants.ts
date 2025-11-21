// Tenants API client
import apiClient from "@/lib/api-client";
import type { Tenant } from "@/types";
import type { TenantFormData } from "@/lib/validators/tenant";

interface GetTenantsParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface TenantsResponse {
  status: "success";
  data: {
    items: Tenant[];
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

interface TenantResponse {
  status: "success";
  data: Tenant;
}

export const tenantsApi = {
  // Get all tenants with filters
  getTenants: async (params?: GetTenantsParams): Promise<TenantsResponse> => {
    const response = await apiClient.get<TenantsResponse>("/tenants", {
      params,
    });
    return response.data;
  },

  // Get single tenant by ID
  getTenant: async (id: string): Promise<TenantResponse> => {
    const response = await apiClient.get<TenantResponse>(`/tenants/${id}`);
    return response.data;
  },

  // Create new tenant
  createTenant: async (data: TenantFormData): Promise<TenantResponse> => {
    const response = await apiClient.post<TenantResponse>("/tenants", data);
    return response.data;
  },

  // Update tenant
  updateTenant: async (
    id: string,
    data: TenantFormData
  ): Promise<TenantResponse> => {
    const response = await apiClient.patch<TenantResponse>(
      `/tenants/${id}`,
      data
    );
    return response.data;
  },

  // Delete tenant
  deleteTenant: async (id: string): Promise<void> => {
    await apiClient.delete(`/tenants/${id}`);
  },
};
