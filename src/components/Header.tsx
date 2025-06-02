import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout as doLogout } from "../utils/auth";
import { useAuth } from "../context/AuthContext";
import { getUserIdFromApi } from "../utils/auth"; // Важно!

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isLoadingAdminStatus, refreshAuth } = useAuth();

  const handleLogout = async () => {
    doLogout();
    await refreshAuth();
    navigate("/login");
  };

  // Обработчик для профиля (работает и для обычного клика, и для "открыть в новой вкладке")
  const handleGoToProfile = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const userId = await getUserIdFromApi();
    if (userId) {
      navigate(`/users/${userId}`);
    } else {
      navigate("/login");
    }
  };

  // SVG-компоненты с белым цветом
  const IconAdd = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
  const IconProfile = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 8-6 8-6s8 2 8 6"/>
    </svg>
  );
  const IconLogout = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
      <path d="M13 5v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
    </svg>
  );

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
  <div
    className="logo-wrapper"
    style={{ cursor: "pointer" }}
    onClick={() => navigate("/projects")}
    tabIndex={0}
    onKeyDown={e => {
      if (e.key === "Enter" || e.key === " ") navigate("/projects");
    }}
    title="На главную страницу проектов"
  >
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
                to="/moderation/projects"
                className={
                  location.pathname === "/moderation/projects" ? "active" : ""
                }
              >
                Модерация проектов
              </Link>
            )}
            {/* <span className="disabled">О платформе</span> */}
          </nav>
        </div>
        <div className="auth-section">
          {isLoadingAdminStatus ? (
            <span className="auth-loading">Загрузка...</span>
          ) : isAuthenticated ? (
            <>
              <Link to="/projects/add" className="auth-button">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <IconAdd />
                  Добавить проект
                </span>
              </Link>
              <div className="divider" />
              {/* Кнопка для перехода в профиль */}
              <a
                href="#"
                className="auth-button"
                onClick={handleGoToProfile}
                // title="Открыть профиль"
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <IconProfile />
                  Профиль
                </span>
              </a>
              <div className="divider" />
              <button onClick={handleLogout} className="auth-button">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <IconLogout />
                  Выйти
                </span>
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
