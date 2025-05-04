import React, { useState } from 'react';
import { Header } from '../components/Header';
import { useParams } from 'react-router-dom';
import '../styles/profile.css';

export const Profile: React.FC = () => {
  const { userId: _userId, profileId: _profileId } = useParams<{ userId: string; profileId: string }>();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Болтава Владимир Андреевич',
    email: 'vladimir.boltava@yandex.ru',
    organization: 'СГУГиТ',
    address: 'Ул. Плахотного 10, г. Новосибирск',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Здесь можно добавить логику сохранения данных, например, отправку на сервер
    console.log('Сохраненные данные:', formData);
  };

  return (
    <div className="profile-container">
      <Header isAuthenticated={true} />
      <div className="profile-content">
        <div className="profile-header" style={{ width: '100%', marginBottom: '32px' }}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/976c0edeb93f26a4cc99252c12f80ab40d4234c6?placeholderIfAbsent=true"
            alt="Profile"
            className="profile-header-icon"
          />
          <div>Профиль</div>
          <button
            className="edit-profile-button"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? 'Отменить' : 'Редактировать'}
          </button>
        </div>

        <div className="profile-info-section">
          <div className="section-title">Личная информация</div>

          <div className="info-label">ФИО</div>
          {isEditing ? (
            <input
              type="text"
              name="fullName"
              className="info-input"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          ) : (
            <div className="info-value">{formData.fullName}</div>
          )}

          <div className="info-label">Почта</div>
          {isEditing ? (
            <input
              type="email"
              name="email"
              className="info-input"
              value={formData.email}
              onChange={handleInputChange}
            />
          ) : (
            <div className="info-value">{formData.email}</div>
          )}

          <div className="info-label">Название организации</div>
          {isEditing ? (
            <input
              type="text"
              name="organization"
              className="info-input"
              value={formData.organization}
              onChange={handleInputChange}
            />
          ) : (
            <div className="info-value">{formData.organization}</div>
          )}

          <div className="info-label">Адрес организации</div>
          {isEditing ? (
            <input
              type="text"
              name="address"
              className="info-input"
              value={formData.address}
              onChange={handleInputChange}
            />
          ) : (
            <div className="info-value">{formData.address}</div>
          )}
        </div>

        {isEditing && (
          <button className="save-profile-button" onClick={handleSave}>
            Сохранить изменения
          </button>
        )}

        <div className="projects-section">
          <div className="section-title">Мои проекты</div>
          <div className="projects-empty-state">
            У вас пока нет проектов. Создайте новый проект или присоединитесь к<br />
            существующему.
          </div>
        </div>
      </div>
    </div>
  );
};