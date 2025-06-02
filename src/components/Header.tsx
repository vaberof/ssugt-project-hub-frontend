import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout as doLogout } from "../utils/auth";
import { useAuth } from "../context/AuthContext";
import { getUserIdFromApi } from "../utils/auth";
import "../styles/header.css"; // путь скорректируй если другой

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isLoadingAdminStatus, refreshAuth } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    doLogout();
    await refreshAuth();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const handleGoToProfile = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const userId = await getUserIdFromApi();
    setMobileMenuOpen(false);
    if (userId) {
      navigate(`/users/${userId}`);
    } else {
      navigate("/login");
    }
  };

  // SVGs
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
  const BurgerIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="5" y="8" width="18" height="2.5" rx="1.25" fill="#fff"/>
      <rect x="5" y="13" width="18" height="2.5" rx="1.25" fill="#fff"/>
      <rect x="5" y="18" width="18" height="2.5" rx="1.25" fill="#fff"/>
    </svg>
  );
  const CloseIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <line x1="8" y1="8" x2="24" y2="24" stroke="#111" strokeWidth="3"/>
      <line x1="24" y1="8" x2="8" y2="24" stroke="#111" strokeWidth="3"/>
    </svg>
  );

  // -------------------------------
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
            {!isLoadingAdminStatus && isAuthenticated && isAdmin && (
              <Link
                to="/moderation/projects"
                className={location.pathname === "/moderation/projects" ? "active" : ""}
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
              <a
                href="#"
                className="auth-button"
                onClick={handleGoToProfile}
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

        {/* --- Бургер только на мобильных --- */}
        <button
          className="burger"
          aria-label="Открыть меню"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(true)}
        >
          <BurgerIcon />
        </button>
      </div>

      {/* Затемнение фона при открытом меню */}
      {mobileMenuOpen && (
        <div
          className="menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Мобильное меню */}
      <div className={`mobile-menu${mobileMenuOpen ? " open" : ""}`}>
        <button
          className="mobile-menu-close"
          aria-label="Закрыть меню"
          onClick={() => setMobileMenuOpen(false)}
        >
          <CloseIcon />
        </button>
        <nav className="mobile-menu-links">
          <Link to="/projects"
                className={location.pathname === "/projects" ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}>
            Проекты
          </Link>
          {!isLoadingAdminStatus && isAuthenticated && isAdmin && (
            <Link
              to="/moderation/projects"
              className={location.pathname === "/moderation/projects" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              Модерация проектов
            </Link>
          )}
        </nav>
        <div className="mobile-auth-section">
          {isLoadingAdminStatus ? (
            <span className="auth-loading">Загрузка...</span>
          ) : isAuthenticated ? (
            <>
              <Link to="/projects/add" className="auth-button" onClick={() => setMobileMenuOpen(false)}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <IconAdd />
                  Добавить проект
                </span>
              </Link>
              <div className="divider" />
              <a
                href="#"
                className="auth-button"
                onClick={handleGoToProfile}
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
              <Link to="/login" className="login-link" onClick={() => setMobileMenuOpen(false)}>
                Войти
              </Link>
              <div className="divider" />
              <Link to="/register" className="register-button" onClick={() => setMobileMenuOpen(false)}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
