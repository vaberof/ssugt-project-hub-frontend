import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveToken } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Login: React.FC = () => {
  const { refreshAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // Функция валидации
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = "Введите email";
    else if (!EMAIL_REGEXP.test(formData.email)) newErrors.email = "Некорректный email";
    if (!formData.password) newErrors.password = "Введите пароль";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setServerError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:80/auth/login", {
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

        if (data.accessToken) {
          saveToken(data.accessToken);
          await refreshAuth();
          navigate("/projects");
        } else {
          setServerError("Ошибка получения токена авторизации");
        }
      } else if (response.status === 401) {
        setServerError("Неверный email или пароль");
      } else if (response.status === 404) {
        setServerError("Пользователь не найден");
      } else {
        setServerError("Ошибка авторизации. Попробуйте снова.");
      }
    } catch (err) {
      setServerError("Ошибка подключения к серверу");
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
    // Очищаем ошибку этого поля, если меняется значение
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setServerError("");
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

        {serverError && <div className="error-message">{serverError}</div>}

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
          {isSubmitted && errors.email && <div className="error-message">{errors.email}</div>}
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
          {isSubmitted && errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? "Вход..." : "Войти"}
        </button>

        <div className="register-prompt">
          <span>Нет аккаунта?</span>
          <Link to="/register" className="register-prompt-link">
            Зарегистрироваться
          </Link>
        </div>

        {/* <div className="forgot-password">Забыли пароль?</div> */}
      </form>
    </div>
  );
};
