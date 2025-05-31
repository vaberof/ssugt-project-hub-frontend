import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    hasOrganisation: true,
    organisationName: '',
    organisationAddress: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const response = await fetch('http://localhost:80/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          personalInfo: {
            hasOrganisation: formData.hasOrganisation,
            organisation: {
              name: formData.organisationName,
              address: formData.organisationAddress,
            },
          },
          role: 1, // DefaultRole
        }),
      });

      if (response.ok) {
        navigate('/verify-email', { state: { email: formData.email } });
      } else {
        setError('Ошибка регистрации. Попробуйте снова.');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу.');
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
    <div className="register-container">
      <Header />
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h1 className="form-title">Регистрация</h1>
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
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Минимум 8 символов"
            value={formData.password}
            onChange={handleChange}
          />
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

        <div className="form-group">
          <label className="form-label">Название организации</label>
          <input
            type="text"
            name="organisationName"
            className="form-input"
            placeholder="СГУГиТ"
            value={formData.organisationName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Адрес организации</label>
          <input
            type="text"
            name="organisationAddress"
            className="form-input"
            placeholder="Ул. Плахотного 10, г. Новосибирск"
            value={formData.organisationAddress}
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