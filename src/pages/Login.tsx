import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-container">
      <Header />
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/32934464ca7115dbead126ee120286be3f74eb32?placeholderIfAbsent=true" 
            alt="Login Icon" 
            className="form-icon"
          />
          <h1 className="form-title">Вход в систему</h1>
        </div>

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
              Показать
            </span>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Войти
        </button>

        <div className="register-prompt">
          <span>Нет аккаунта?</span>
          <Link to="/register" className="register-prompt-link">
            Зарегистрироваться
          </Link>
        </div>

        <div className="forgot-password">
          Забыли пароль?
        </div>
      </form>
    </div>
  );
};