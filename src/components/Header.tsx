import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isAuthenticated = false }) => {
  const location = useLocation();

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
              className={location.pathname === '/projects' ? 'active' : ''}
            >
              Проекты
            </Link>
            <span className="disabled">О платформе</span>
            <span className="disabled">Контакты</span>
          </nav>
        </div>
        <div className="auth-section">
          {isAuthenticated ? (
            <>
              <Link to="/projects/add" className="auth-button">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/32934464ca7115dbead126ee120286be3f74eb32"
                  alt="Add"
                  className="button-icon"
                />
                Добавить проект
              </Link>
              <div className="divider" />
              <Link to="/profile" className="auth-button">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/26c64e2dae1ed518aa02da4c8d427d513cf7a665"
                  alt="Profile"
                  className="button-icon"
                />
                Профиль
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">Войти</Link>
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