// Authentication API service
import apiClient from '../api-client'
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  ForgotPasswordData,
  ResetPasswordData,
} from '@/types'
import type { ApiResponse } from '@/types/api'

export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  // Register user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  // Logout user
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  // Get current user
  me: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me')
    return response.data.data
  },

  // Refresh access token
  refresh: async (): Promise<{ token: string }> => {
    const response = await apiClient.post<{ token: string }>(
      '/auth/refresh',
      {},
      { withCredentials: true }
    )
    return response.data
  },

  // Request password reset
  forgotPassword: async (data: ForgotPasswordData): Promise<void> => {
    await apiClient.post('/auth/forgot-password', data)
  },

  // Reset password with token
  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    await apiClient.post('/auth/reset-password', data)
  },
}
