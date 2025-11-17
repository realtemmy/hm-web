// Authentication Context
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { AuthContextType, User, LoginCredentials, RegisterData } from '@/types'
import { authApi } from '@/lib/api/auth'
import { setAuthToken, getAuthToken } from '@/lib/api-client'
import { hasPermission as checkPermission } from '@/config/permissions'
import type { Resource, Action } from '@/config/permissions'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Attempt to get current user (will use refresh token if access token expired)
        const currentUser = await authApi.me()

        setUser(currentUser)

        // Token will be set by interceptor after refresh
        const currentToken = getAuthToken()
        setToken(currentToken)
      } catch (error) {
        // Session restore failed - user needs to log in
        setUser(null)
        setToken(null)
        setAuthToken(null)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  // Listen for logout events from API client
  useEffect(() => {
    const handleLogout = () => {
      setUser(null)
      setToken(null)
      setAuthToken(null)
    }

    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials)

      setUser(response.user)
      setToken(response.token)
      setAuthToken(response.token)
    } catch (error) {
      throw error
    }
  }, [])

  // Register function
  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await authApi.register(data)

      setUser(response.user)
      setToken(response.token)
      setAuthToken(response.token)
    } catch (error) {
      throw error
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error)
    } finally {
      setUser(null)
      setToken(null)
      setAuthToken(null)
    }
  }, [])

  // Check if user has permission
  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      if (!user) return false
      return checkPermission(user.role, resource as Resource, action as Action)
    },
    [user]
  )

  const value: AuthContextType = {
    user,
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

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
