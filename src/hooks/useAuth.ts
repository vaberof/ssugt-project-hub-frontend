import { useState, useEffect, useCallback } from "react";
import { getToken, isAuthenticated as checkIsAuthenticated } from "../utils/auth";

interface UseAuthReturn {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoadingAdminStatus: boolean;
  refreshAuth: () => Promise<void>;
}

/**
 * Проверяет статус администратора на сервере (без кэша)
 */
const checkAdminStatus = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) return false;
  try {
    const response = await fetch("http://localhost:80/auth/is-admin", {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.isAdmin || false;
    }
  } catch {}
  return false;
};

/**
 * Хук для управления состоянием авторизации и статуса администратора (всегда реальный запрос)
 */
export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    isLoadingAdminStatus: true,
  });

  const refreshAuth = useCallback(async () => {
    const authenticated = checkIsAuthenticated();
    setAuthState({
      isAuthenticated: authenticated,
      isAdmin: false,
      isLoadingAdminStatus: true,
    });
    if (authenticated) {
      const adminStatus = await checkAdminStatus();
      setAuthState({
        isAuthenticated: true,
        isAdmin: adminStatus,
        isLoadingAdminStatus: false,
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        isAdmin: false,
        isLoadingAdminStatus: false,
      });
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return {
    ...authState,
    refreshAuth,
  };
};
