import React from "react";
import { Header } from "../components/Header";
import "../styles/profile.css";

export const Profile: React.FC = () => {
  return (
    <>
      <Header />
      <div className="profile-wrapper">
        <main className="content-card">
          <div className="profile-header">
            <div className="profile-title-section">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/6d6055c06ed446f7ae90adcc09cadf90/aecc2a13695c36eac77bfadaa3fdafa47c61243e?placeholderIfAbsent=true"
                alt="Profile"
                className="profile-avatar"
              />
              <div>Профиль</div>
            </div>
            <button className="edit-button">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/6d6055c06ed446f7ae90adcc09cadf90/756be0da120c777dfd2187bd249571b8629d144b?placeholderIfAbsent=true"
                alt="Edit"
                className="edit-icon"
              />
              <span>Редактировать</span>
            </button>
          </div>

          <div className="profile-content">
            <section className="personal-info">
              <h2 className="section-title">Личная информация</h2>

              <div className="field-label">ФИО</div>
              <div className="field-value">Болтава Владимир Андреевич</div>

              <div className="field-label">Почта</div>
              <div className="field-value">vladimir.boltava@yandex.ru</div>

              <div className="field-label">Название организации</div>
              <div className="field-value">СГУГиТ</div>

              <div className="field-label">Адрес организации</div>
              <div className="field-value">
                Ул. Плахотного 10, г. Новосибирск
              </div>
            </section>

            <section className="projects-section">
              <h2 className="section-title">Мои проекты</h2>
              <p className="projects-message">
                У вас пока нет проектов. Создайте новый проект или
                присоединитесь к<br />
                существующему.
              </p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;
