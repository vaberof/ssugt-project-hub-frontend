import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Введите email';
    else if (!EMAIL_REGEXP.test(formData.email)) newErrors.email = 'Некорректный email';

    if (!formData.password) newErrors.password = 'Введите пароль';
    else if (formData.password.length < 8) newErrors.password = 'Пароль должен быть не менее 8 символов';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Повторите пароль';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';

    if (!formData.fullName) newErrors.fullName = 'Введите ФИО';

    if (!formData.organisationName) newErrors.organisationName = 'Введите название организации';

    if (!formData.organisationAddress) newErrors.organisationAddress = 'Введите адрес организации';

    return newErrors;
  };

  const isFormValid = () => {
    return Object.keys(validate()).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setServerError('');
    if (Object.keys(validationErrors).length > 0) return;

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
        setServerError('Ошибка регистрации. Попробуйте снова.');
      }
    } catch (err) {
      setServerError('Ошибка подключения к серверу.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '', // очищаем ошибку у этого поля при изменении
    }));
    setServerError('');
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h1 className="form-title">Регистрация</h1>
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
          {errors.email && <div className="error-message">{errors.email}</div>}
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
          {errors.password && <div className="error-message">{errors.password}</div>}
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
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
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
          {errors.fullName && <div className="error-message">{errors.fullName}</div>}
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
          {errors.organisationName && <div className="error-message">{errors.organisationName}</div>}
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
          {errors.organisationAddress && <div className="error-message">{errors.organisationAddress}</div>}
        </div>

        <button
          type="submit"
          className="submit-button"
        >
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
