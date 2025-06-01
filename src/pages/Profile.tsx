import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/profile.css";
import { getToken } from "../utils/auth";

// Интерфейсы
interface Organisation {
  name: string;
  address: string;
}

interface PersonalInfo {
  hasOrganisation: boolean;
  organisation: Organisation;
}

interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  personalInfo: PersonalInfo;
  role: number;
  createdAt: string;
  updatedAt: string;
}

interface ProjectAttributes {
  title?: string;
  summary?: string;
  // ...добавить другие по необходимости
}

interface Project {
  id: number;
  attributes: ProjectAttributes;
  // ...можно добавить другие поля, если нужно
}

export const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    // Получаем пользователя
    fetch(`http://localhost:80/users?ids=${userId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(getToken() ? { Authorization: `${getToken()}` } : {}),
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.users && data.users.length > 0) setUser(data.users[0]);
      });

    // Получаем проекты пользователя
    fetch(`http://localhost:80/users/${userId}/projects`, {
      headers: {
        "Content-Type": "application/json",
        ...(getToken() ? { Authorization: `${getToken()}` } : {}),
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.projects) setProjects(data.projects);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div style={{ padding: 40 }}>Загрузка профиля...</div>;
  if (!user) return <div style={{ padding: 40 }}>Пользователь не найден</div>;

  return (
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
            <div className="field-value">{user.fullName}</div>
            <div className="field-label">Почта</div>
            <div className="field-value">{user.email}</div>
            <div className="field-label">Название организации</div>
            <div className="field-value">{user.personalInfo?.organisation?.name || "-"}</div>
            <div className="field-label">Адрес организации</div>
            <div className="field-value">{user.personalInfo?.organisation?.address || "-"}</div>
          </section>

          <section className="projects-section">
            <h2 className="section-title">Проекты</h2>
            {projects.length === 0 ? (
              <p className="projects-message">
                У вас пока нет проектов. Создайте новый проект или
                присоединитесь к<br />
                существующему.
              </p>
            ) : (
              <div style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}>
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <Link
                      to={`/projects/${proj.id}`}
                      style={{
                        color: "#2563eb",
                        fontWeight: 500,
                        textDecoration: "underline"
                      }}
                    >
                      {proj.attributes.title || `Проект #${proj.id}`}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;
