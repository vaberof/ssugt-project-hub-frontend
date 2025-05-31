import React from "react";
import styles from "../styles/profile.module.css";

export const Profile: React.FC = () => {
  return (
    <div className={styles.profileContainer}>
      <div className={styles.mainSection}>
        <header className={styles.header}>
          <div className={styles.logoSection}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/6d6055c06ed446f7ae90adcc09cadf90/f57eb47aa86a5087ae2a1d4ed54a5f6df6743982?placeholderIfAbsent=true"
              alt="Logo"
              className={styles.logoImage}
            />
            <div>Проекты СГУГиТ</div>
          </div>

          <nav className={styles.navigation}>
            <div>Проекты</div>
            <div>О платформе</div>
            <div>Контакты</div>
          </nav>

          <div className={styles.actionButtons}>
            <button className={styles.addProjectButton}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/6d6055c06ed446f7ae90adcc09cadf90/7b9561732f1280cdd35f194a2ed90e952073dccd?placeholderIfAbsent=true"
                alt="Add"
                className={styles.addProjectIcon}
              />
              <span>Добавить проект</span>
            </button>
            <div className={styles.divider} />
            <button className={styles.logoutButton}>Выйти</button>
          </div>
        </header>

        <main className={styles.contentCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profileTitleSection}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/6d6055c06ed446f7ae90adcc09cadf90/aecc2a13695c36eac77bfadaa3fdafa47c61243e?placeholderIfAbsent=true"
                alt="Profile"
                className={styles.profileAvatar}
              />
              <div>Профиль</div>
            </div>
            <button className={styles.editButton}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/6d6055c06ed446f7ae90adcc09cadf90/756be0da120c777dfd2187bd249571b8629d144b?placeholderIfAbsent=true"
                alt="Edit"
                className={styles.editIcon}
              />
              <span>Редактировать</span>
            </button>
          </div>

          <div className={styles.profileContent}>
            <section className={styles.personalInfo}>
              <h2 className={styles.sectionTitle}>Личная информация</h2>

              <div className={styles.fieldLabel}>ФИО</div>
              <div className={styles.fieldValue}>
                Болтава Владимир Андреевич
              </div>

              <div className={styles.fieldLabel}>Почта</div>
              <div className={styles.fieldValue}>
                vladimir.boltava@yandex.ru
              </div>

              <div className={styles.fieldLabel}>Название организации</div>
              <div className={styles.fieldValue}>СГУГиТ</div>

              <div className={styles.fieldLabel}>Адрес организации</div>
              <div className={styles.fieldValue}>
                Ул. Плахотного 10, г. Новосибирск
              </div>
            </section>

            <section className={styles.projectsSection}>
              <h2 className={styles.sectionTitle}>Мои проекты</h2>
              <p className={styles.projectsMessage}>
                У вас пока нет проектов. Создайте новый проект или
                присоединитесь к<br />
                существующему.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
