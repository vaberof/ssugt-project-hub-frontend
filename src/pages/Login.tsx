import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveToken, checkAdminStatus } from "../utils/auth";
import { useAuth } from "../context/AuthContext"; // Добавляем импорт контекста

export const Login: React.FC = () => {
  const { refreshAuth } = useAuth(); // Получаем функцию обновления авторизации
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://46.149.67.92:80/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Сохраняем токен в localStorage
        if (data.accessToken) {
          saveToken(data.accessToken);
          // ВАЖНО: обновляем контекст авторизации!
          await refreshAuth();

          // Навигация на проекты
          navigate("/projects");
        } else {
          setError("Ошибка получения токена авторизации");
        }
      } else if (response.status === 401) {
        setError("Неверный email или пароль");
      } else if (response.status === 404) {
        setError("Пользователь не найден");
      } else {
        setError("Ошибка авторизации. Попробуйте снова.");
      }
    } catch (err) {
      setError("Ошибка подключения к серверу");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/32934464ca7115dbead126ee120286be3f74eb32?placeholderIfAbsent=true"
            alt="Login Icon"
            className="form-icon"
          />
          <h1 className="form-title">Вход в систему</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label className="form-label">Почта</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="example@mail.ru"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Пароль</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-input"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Скрыть" : "Показать"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isLoading || !formData.email || !formData.password}
        >
          {isLoading ? "Вход..." : "Войти"}
        </button>

        <div className="register-prompt">
          <span>Нет аккаунта?</span>
          <Link to="/register" className="register-prompt-link">
            Зарегистрироваться
          </Link>
        </div>

        <div className="forgot-password">Забыли пароль?</div>
      </form>
    </div>
  );
};