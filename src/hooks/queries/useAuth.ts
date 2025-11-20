// Auth query hooks using React Query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { setAccessToken, clearAuth, getAccessToken } from "@/lib/api-client";
import type { LoginCredentials, RegisterData } from "@/types";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
};

/**
 * Hook to get the current authenticated user
 * Automatically fetches on mount to restore session
 */
export function useCurrentUser() {
  const hasToken = !!getAccessToken();

  return useQuery({
    queryKey: ["auth", "currentUser"],
    queryFn: async () => {
      // If no access token, return null (user not authenticated)
      const token = getAccessToken();
      if (!token) {
        return null;
      }

      try {
        const user = await authApi.me();
        return user;
      } catch (error) {
        // If 401, user is not authenticated - return null instead of throwing
        if (
          (error as { response?: { status?: number } })?.response?.status ===
          401
        ) {
          // Clear invalid token
          clearAuth();
          return null;
        }
        throw error;
      }
    },
    enabled: hasToken, // Only run query if access token exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized)
      if (
        (error as { response?: { status?: number } })?.response?.status === 401
      ) {
        return false;
      }
      // Retry once for other errors
      return failureCount < 1;
    },
    // Set placeholder data when no token exists to prevent undefined errors
    placeholderData: hasToken ? undefined : null,
  });
}

/**
 * Hook to login a user
 * On success, updates the user cache and stores access token
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authApi.login(credentials);
      console.log('🔍 LOGIN RESPONSE:', response);
      console.log('🔍 Response.data:', response.data);
      console.log('🔍 Access Token:', response.data?.accessToken);
      console.log('🔍 User:', response.data?.user);
      return response;
    },
    onSuccess: (response) => {
      console.log('✅ LOGIN SUCCESS - Response:', response);

      // Backend returns: { status: "success", data: { user, accessToken } }
      // So we need to access response.data.accessToken and response.data.user
      const { user, accessToken } = response.data;

      // Store access token in localStorage FIRST
      setAccessToken(accessToken);
      console.log('✅ Token stored:', accessToken);

      // Update the current user cache
      queryClient.setQueryData(["auth", "currentUser"], user);
      console.log('✅ User cached:', user);

      // Refetch to ensure query is in sync
      queryClient.invalidateQueries({ queryKey: ["auth", "currentUser"] });
    },
    onError: () => {
      // Clear any stale auth data on login failure
      clearAuth();
      queryClient.setQueryData(["auth", "currentUser"], null);
    },
  });
}

/**
 * Hook to register a new user
 * On success, updates the user cache and stores access token
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await authApi.register(data);
      return response;
    },
    onSuccess: (response) => {
      // Backend returns: { status: "success", data: { user, accessToken } }
      const { user, accessToken } = response.data;

      // Store access token in localStorage FIRST
      setAccessToken(accessToken);

      // Update the current user cache
      queryClient.setQueryData(["auth", "currentUser"], user);

      // Refetch to ensure query is in sync
      queryClient.invalidateQueries({ queryKey: ["auth", "currentUser"] });
    },
    onError: () => {
      // Clear any stale auth data on registration failure
      clearAuth();
      queryClient.setQueryData(["auth", "currentUser"], null);
    },
  });
}

/**
 * Hook to logout the current user
 * On success, clears auth data and invalidates queries
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      // Clear access token from localStorage
      clearAuth();

      // Remove current user from cache
      queryClient.setQueryData(["auth", "currentUser"], null);

      // Invalidate all auth-related queries
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: () => {
      // Even if API call fails, clear local auth state
      clearAuth();
      queryClient.setQueryData(["auth", "currentUser"], null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
