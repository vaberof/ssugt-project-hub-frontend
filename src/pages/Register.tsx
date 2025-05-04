import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';

export const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    organization: '',
    address: ''
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
    <div className="register-container">
      <Header />
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <img src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/26c64e2dae1ed518aa02da4c8d427d513cf7a665?placeholderIfAbsent=true" alt="Register Icon" style={{ width: '50px', borderRadius: '12px' }} />
          <h1 className="form-title">Регистрация</h1>
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
              placeholder="Минимум 8 символов"
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

        <div className="form-group">
          <label className="form-label">Подтвердите пароль</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-input"
            placeholder="Повторите пароль"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">ФИО</label>
          <input
            type="text"
            name="fullName"
            className="form-input"
            placeholder="Иванов Иван Иванович"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        {/* <div className="form-group">
          <label className="form-label">Номер телефона</label>
          <input
            type="tel"
            name="phone"
            className="form-input"
            placeholder="+7 (999) 999-99-99"
            value={formData.phone}
            onChange={handleChange}
          />
        </div> */}

        <div className="form-group">
          <label className="form-label">Название организации</label>
          <input
            type="text"
            name="organization"
            className="form-input"
            placeholder="СГУГиТ"
            value={formData.organization}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Адрес организации</label>
          <input
            type="text"
            name="address"
            className="form-input"
            placeholder="Ул. Плахотного 10, г. Новосибирск"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-button">
          Зарегистрироваться
        </button>

        <div className="login-prompt">
          Уже есть аккаунт?
          <Link to="/login" className="login-prompt-link">
            Войти
          </Link>
        </div>
      </form>
    </div>
  );
};