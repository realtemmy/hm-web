// Authentication Context with React Query
import React, { useCallback } from 'react'
import type { AuthContextType, LoginCredentials, RegisterData } from '@/types'
import { hasPermission as checkPermission } from '@/config/permissions'
import type { Resource, Action } from '@/config/permissions'
import { useCurrentUser, useLogin, useRegister, useLogout } from '@/hooks/queries/useAuth'
import { getAccessToken } from '@/lib/api-client'
import { AuthContext } from './auth-context'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // React Query hooks for auth state
  const { data: user, isLoading } = useCurrentUser()
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const logoutMutation = useLogout()

  // Get access token from localStorage
  const token = getAccessToken()

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token

  // Login function - wraps mutation to provide Promise-based API
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      return new Promise<void>((resolve, reject) => {
        loginMutation.mutate(credentials, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        })
      })
    },
    [loginMutation]
  )

  // Register function - wraps mutation to provide Promise-based API
  const register = useCallback(
    async (data: RegisterData) => {
      return new Promise<void>((resolve, reject) => {
        registerMutation.mutate(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        })
      })
    },
    [registerMutation]
  )

  // Logout function - wraps mutation to provide Promise-based API
  const logout = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      logoutMutation.mutate(undefined, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      })
    })
  }, [logoutMutation])

  // Check if user has permission
  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      if (!user) return false
      return checkPermission(user.role, resource as Resource, action as Action)
    },
    [user]
  )

  const value: AuthContextType = {
    user: user || null,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
