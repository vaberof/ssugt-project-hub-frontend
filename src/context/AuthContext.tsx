import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  isAuthenticated as checkIsAuthenticated,
  checkAdminStatus,
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

  // Всегда только live-проверка isAdmin (без кэша!)
  const refreshAuth = useCallback(async () => {
    const authenticated = checkIsAuthenticated();
    setAuthState({
      isAuthenticated: authenticated,
      isAdmin: false,
      isLoadingAdminStatus: true,
    });

    if (authenticated) {
      try {
        const adminStatus = await checkAdminStatus();
        setAuthState({
          isAuthenticated: true,
          isAdmin: adminStatus,
          isLoadingAdminStatus: false,
        });
      } catch {
        setAuthState({
          isAuthenticated: true,
          isAdmin: false,
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
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ ...authState, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
