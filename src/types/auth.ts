// Authentication types
export type UserRole = 'ADMIN' | 'USER'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  bio?: string
  photo?: string
  role: UserRole
  provider: string
  providerId?: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role: UserRole
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  user: User
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (resource: string, action: string) => boolean
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  password: string
}
