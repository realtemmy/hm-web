// Properties API client
import apiClient from '@/lib/api-client'
import type { Property } from '@/types'

interface GetPropertiesParams {
  page?: number
  limit?: number
  search?: string
  type?: string
  state?: string
  status?: string
}

interface PropertiesResponse {
  status: 'success'
  data: {
    properties: Property[]
    total: number
    page: number
    limit: number
  }
}

interface PropertyResponse {
  status: 'success'
  data: Property
}

export const propertiesApi = {
  // Get all properties with filters
  getProperties: async (params?: GetPropertiesParams): Promise<PropertiesResponse> => {
    const response = await apiClient.get<PropertiesResponse>('/properties', { params })
    return response.data
  },

  // Get single property by ID
  getProperty: async (id: string): Promise<PropertyResponse> => {
    const response = await apiClient.get<PropertyResponse>(`/properties/${id}`)
    return response.data
  },

  // Create new property
  createProperty: async (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyResponse> => {
    const response = await apiClient.post<PropertyResponse>('/properties', data)
    return response.data
  },

  // Update property
  updateProperty: async (id: string, data: Partial<Property>): Promise<PropertyResponse> => {
    const response = await apiClient.patch<PropertyResponse>(`/properties/${id}`, data)
    return response.data
  },

  // Delete property
  deleteProperty: async (id: string): Promise<void> => {
    await apiClient.delete(`/properties/${id}`)
  },
}
