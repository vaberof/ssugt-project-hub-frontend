// src/components/ProtectedRouteAdmin.tsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteAdminProps {
  children: React.ReactNode;
}

const ProtectedRouteAdmin: React.FC<ProtectedRouteAdminProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoadingAdminStatus } = useAuth();

  if (isLoadingAdminStatus) {
    // Пока идет запрос на сервер — показываем загрузку
    return <div>Проверка прав доступа...</div>;
  }

  if (!isAuthenticated) {
    // Не авторизован — редиректим на логин
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Авторизован, но не админ — редиректим на главную (или куда тебе нужно)
    return <Navigate to="/projects" replace />;
  }

  // Всё ок — показываем дочерний компонент (Moderation)
  return <>{children}</>;
};

export default ProtectedRouteAdmin;
