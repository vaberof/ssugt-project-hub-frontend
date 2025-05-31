import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  isAuthenticated as checkIsAuthenticated,
  getOrCheckAdminStatus,
  getAdminStatus,
} from "../utils/auth";

interface AuthContextProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoadingAdminStatus: boolean;
  refreshAuth: () => Promise<void>;
}

// Создаём сам контекст
const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isAdmin: false,
  isLoadingAdminStatus: false,
  refreshAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    isLoadingAdminStatus: true,
  });

  const refreshAuth = useCallback(async () => {
    const authenticated = checkIsAuthenticated();
    if (authenticated) {
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        isLoadingAdminStatus: true,
      }));
      try {
        const adminStatus = await getOrCheckAdminStatus();
        setAuthState((prev) => ({
          ...prev,
          isAdmin: adminStatus,
          isLoadingAdminStatus: false,
        }));
      } catch {
        setAuthState((prev) => ({
          ...prev,
          isLoadingAdminStatus: false,
        }));
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        isAdmin: false,
        isLoadingAdminStatus: false,
      });
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const authenticated = checkIsAuthenticated();
      if (authenticated) {
        const cachedAdminStatus = getAdminStatus();
        if (cachedAdminStatus !== null) {
          setAuthState({
            isAuthenticated: true,
            isAdmin: cachedAdminStatus,
            isLoadingAdminStatus: false,
          });
        } else {
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

  return (
    <AuthContext.Provider value={{ ...authState, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
