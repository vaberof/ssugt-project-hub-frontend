import { useState, useEffect } from "react";
import {
  isAuthenticated,
  getOrCheckAdminStatus,
  getAdminStatus,
} from "../utils/auth";

interface UseAuthReturn {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoadingAdminStatus: boolean;
  refreshAuth: () => Promise<void>;
}

/**
 * Хук для управления состоянием авторизации и статуса администратора
 */
export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    isLoadingAdminStatus: true,
  });

  const refreshAuth = async () => {
    const authenticated = isAuthenticated();

    if (authenticated) {
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        isLoadingAdminStatus: true,
      }));

      // Проверяем статус администратора
      const adminStatus = await getOrCheckAdminStatus();

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
  };

  useEffect(() => {
    const initAuth = async () => {
      const authenticated = isAuthenticated();

      if (authenticated) {
        // Сначала проверяем кэшированный статус
        const cachedAdminStatus = getAdminStatus();

        if (cachedAdminStatus !== null) {
          // Если есть кэшированный статус, используем его
          setAuthState({
            isAuthenticated: true,
            isAdmin: cachedAdminStatus,
            isLoadingAdminStatus: false,
          });
        } else {
          // Если нет кэша, загружаем с сервера
          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: true,
            isLoadingAdminStatus: true,
          }));
          const adminStatus = await getOrCheckAdminStatus();
          setAuthState({
            isAuthenticated: true,
            isAdmin: adminStatus,
            isLoadingAdminStatus: false,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          isLoadingAdminStatus: false,
        });
      }
    };

    initAuth();
  }, []);

  return {
    ...authState,
    refreshAuth,
  };
};
