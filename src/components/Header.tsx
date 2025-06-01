import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout as doLogout } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isLoadingAdminStatus, refreshAuth } = useAuth();

  const handleLogout = async () => {
    doLogout();
    await refreshAuth();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-wrapper">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/f57eb47aa86a5087ae2a1d4ed54a5f6df6743982?placeholderIfAbsent=true"
              alt="Logo"
              className="logo-image"
            />
            <span>Проекты СГУГиТ</span>
          </div>
          <nav className="nav-links">
            <Link
              to="/projects"
              className={location.pathname === "/projects" ? "active" : ""}
            >
              Проекты
            </Link>
            {/* Показывать раздел "Модерация проектов" только если данные загружены и юзер админ */}
            {!isLoadingAdminStatus && isAuthenticated && isAdmin && (
              <Link
                to="/projects/moderation"
                className={
                  location.pathname === "/projects/moderation" ? "active" : ""
                }
              >
                Модерация проектов
              </Link>
            )}
            <span className="disabled">О платформе</span>
          </nav>
        </div>
        <div className="auth-section">
          {isLoadingAdminStatus ? (
            <span className="auth-loading">Загрузка...</span>
          ) : isAuthenticated ? (
            <>
              <Link to="/projects/add" className="auth-button">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/plus-icon.svg"
                  alt="Add"
                  className="button-icon"
                />
                Добавить проект
              </Link>
              <div className="divider" />
              <Link to="/users/1/profile/1" className="auth-button">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/profile-icon.svg"
                  alt="Profile"
                  className="button-icon"
                />
                Профиль
              </Link>
              <div className="divider" />
              <button onClick={handleLogout} className="auth-button">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/logout-icon.svg"
                  alt="Logout"
                  className="button-icon"
                />
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">
                Войти
              </Link>
              <div className="divider" />
              <Link to="/register" className="register-button">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
