import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getToken, getUserIdFromApi } from "../utils/auth";
import "../styles/projectView.css";

interface ProjectAttributes {
  title?: string;
  object?: string;
  summary?: string;
  cost?: string;
  developingStage?: string;
  realizationTerm?: string;
  applicationScope?: string;
  tags?: string[];
  fundingSource?: string;
  teamSize?: number;
  researchGoals?: string;
  methodology?: string;
  potentialImpact?: string;
  laboratoryName?: string;
  problematic?: string;
  solution?: string;
  functionality?: string;
  technologyStack?: string;
  advantages?: string[];
  testResults?: string;
  deploymentPlan?: string;
}

interface Collaborator {
  id?: number;
  userId: number;
  projectId?: number;
  role: string;
}

interface ProjectFile {
  id: string;
  type: string;
  name: string;
  content?: string;
}

interface Project {
  id: number;
  userId: number;
  type: number;
  status: string;
  attributes: ProjectAttributes;
  collaborators?: Collaborator[];
  files?: ProjectFile[] | null;
  createdAt: string;
  updatedAt?: string;
}

interface UserResponse {
  id: number;
  email: string;
  fullName: string;
}

export const ProjectView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMap, setUserMap] = useState<Record<number, UserResponse>>({});
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [userIdLoading, setUserIdLoading] = useState(true);
const [currentSlide, setCurrentSlide] = useState(0);

  // Получить project
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:80/projects/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(getToken() ? { Authorization: `${getToken()}` } : {}),
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Ошибка загрузки");
        const data = await res.json();
        setProject(data.project ?? data);
      })
      .catch(() => setError("Не удалось загрузить проект"))
      .finally(() => setLoading(false));
  }, [id]);

 // Получаем текущий userId через твой getUserIdFromApi
  useEffect(() => {
    setUserIdLoading(true);
    getUserIdFromApi()
      .then(id => setCurrentUserId(id))
      .finally(() => setUserIdLoading(false));
  }, []);

  // Получить данные пользователей-участников
  useEffect(() => {
    if (project && project.collaborators && project.collaborators.length > 0) {
      const uniqueIds = Array.from(new Set(project.collaborators.map((c) => c.userId)));
      const searchParams = uniqueIds.map(id => `ids=${id}`).join("&");
      fetch(
        `http://localhost:80/users?${searchParams}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(getToken() ? { Authorization: `${getToken()}` } : {}),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.users)) {
            const map: Record<number, UserResponse> = {};
            data.users.forEach((u: UserResponse) => {
              map[u.id] = u;
            });
            setUserMap(map);
          }
        });
    }
  }, [project]);

  // Пока не загрузились все данные — показываем загрузку
  if (loading || userIdLoading) return <div style={{ padding: 40 }}>Загрузка...</div>;
  if (error || !project) return <div style={{ color: "red", padding: 40 }}>{error || "Проект не найден"}</div>;

  const { attributes, collaborators = [], files, type } = project;

  const tags = (attributes.tags ?? []).filter(Boolean);
  const advantages = (attributes.advantages ?? []).filter(Boolean);

  const images = (files ?? [])
    .filter((f) => f.type === "Изображение" && f.content)
    .map((f) => ({
      url: `data:image/*;base64,${f.content}`,
      name: f.name,
    }));

  // Только заполненные атрибуты (кроме Названия и Описания — они будут вверху)
  const visibleAttributes = [
    {
      label: "Теги",
      value: tags.length > 0
        ? tags.map((t, i) => (
            <span key={t} className="category-tag" style={{ marginRight: 7, fontSize: 14 }}>
              {t}
            </span>
          ))
        : "—"
    },
    { label: "Объект исследования/разработки", value: attributes.object },
    { label: "Стоимость", value: attributes.cost },
    { label: "Срок реализации", value: attributes.realizationTerm },
    { label: "Область применения", value: attributes.applicationScope },
    { label: "Источник финансирования", value: attributes.fundingSource },
    { label: "Размер команды", value: attributes.teamSize && attributes.teamSize > 0 ? attributes.teamSize : undefined },
    // СНК
    { label: "Цели исследования", value: attributes.researchGoals },
    { label: "Методология", value: attributes.methodology },
    { label: "Потенциальное влияние", value: attributes.potentialImpact },
    // Лабораторный
    { label: "Название лаборатории", value: attributes.laboratoryName },
    { label: "Проблематика", value: attributes.problematic },
    { label: "Предлагаемое решение", value: attributes.solution },
    { label: "Основная функциональность", value: attributes.functionality },
    {
      label: "Преимущества",
      value: advantages.length > 0 ? (
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {advantages.map((a, i) => (
            <li key={i} style={{ marginBottom: 2 }}>{a}</li>
          ))}
        </ul>
      ) : "—"
    },
    { label: "Стек технологий", value: attributes.technologyStack },
    { label: "Результаты тестирования", value: attributes.testResults },
    { label: "План внедрения", value: attributes.deploymentPlan }
    
  ].filter((item) =>
    typeof item.value === "string" ? item.value.trim() !== "" : item.value !== undefined
  );

  // Текущий этап разработки (developingStage) — как “статус”
  const stage = attributes.developingStage || "";

  // Список id всех участников
  const collaboratorsUserIds = collaborators.map(c => Number(c.userId));
  const userIdNum = Number(currentUserId);

  // Можно ли видеть статус проекта? (если текущий user среди участников)
  const canViewStatus = collaboratorsUserIds.includes(userIdNum);

  // Можно ли редактировать? (если текущий user — автор)
  const canEdit = userIdNum === Number(project.userId);

  // Участники с ФИО и ролью
  const participantsList = (
    <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
      {collaborators.map((c, idx) => {
        const user = userMap[c.userId];
        return (
          <li key={c.id || c.userId || idx} style={{ marginBottom: 16 }}>
            {user ? (
              <Link to={`/users/${user.id}`} style={{ fontWeight: 500, color: "#2563eb", textDecoration: "underline" }}>
                {user.fullName}
              </Link>
            ) : (
              <span style={{ fontWeight: 500 }}>{`userId: ${c.userId}`}</span>
            )}
            <div style={{ color: "#888" }}>{c.role}</div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="project-view">
      <div className="project-content">
        <div className="project-layout">
          {/* Левая панель */}
          <div className="sidebar">
            <div className="back-link">
              <Link to="/projects" className="back-button">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/32f07af05225680cc026f796070895196cb11d56?placeholderIfAbsent=true"
                  alt="Back"
                  className="back-icon"
                />
                Назад к проектам
              </Link>
            </div>
            <div className="participants-card">
              <h2 className="card-title">Участники проекта</h2>
            <ul className="participants-list">
  {collaborators.map((c, idx) => {
    const user = userMap[c.userId];
    const toProfile = user ? `/users/${user.id}` : "#";
    return (
      <li key={c.id || c.userId || idx} className="participant-item" style={{ padding: 0 }}>
        <Link
          to={toProfile}
          className="participant-full-link"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            textDecoration: "none",
            borderRadius: "12px",
            padding: "8px 0",
            transition: "background 0.16s",
          }}
          title={user?.fullName || ""}
        >
          <span className="participant-avatar">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#F3F4F6"/>
              <path d="M18 17C20.2091 17 22 15.2091 22 13C22 10.7909 20.2091 9 18 9C15.7909 9 14 10.7909 14 13C14 15.2091 15.7909 17 18 17Z" fill="#C1C6CE"/>
              <path d="M29 26.5V25C29 21.6863 25.4183 19 21 19H15C10.5817 19 7 21.6863 7 25V26.5C7 27.0523 7.44772 27.5 8 27.5H28C28.5523 27.5 29 27.0523 29 26.5Z" fill="#C1C6CE"/>
            </svg>
          </span>
          <span className="participant-text" style={{ minWidth: 0 }}>
            <div className="participant-name" style={{
              color: "#222",
              fontSize: 17,
              fontWeight: 500,
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: "1.3",
              marginBottom: 2,
            }}>
              {user ? user.fullName : `userId: ${c.userId}`}
            </div>
            <div className="participant-role" style={{
              color: "#7a7a7a",
              fontSize: 15,
              marginTop: 0,
            }}>
              {c.role}
            </div>
          </span>
        </Link>
      </li>
    );
  })}
</ul>

              <hr className="participants-divider" />
              <h2 className="card-title status-title">Статус проекта</h2>
              <div className="status-badge status-processing">
                {project.status}
              </div>
            </div>
            {/* Кнопка "Редактировать" только если автор */}
            {canEdit && (
              <button className="edit-button">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/40d96eedfdd990280336a9e23fe46faeea5a893e?placeholderIfAbsent=true"
                  alt="Edit"
                  className="edit-icon"
                />
                Редактировать проект
              </button>
            )}
          </div>

          {/* Правая панель */}
          <div className="main-content">
      <div className="project-details-card">
        {/* --- КАРУСЕЛЬ КАРТИНОК --- */}
        {images.length > 0 && (
  <div className="slider-container">
    <img
      src={images[currentSlide].url}
      alt={images[currentSlide].name}
      className="slider-image"
    />
    {images.length > 1 && (
      <>
        <button
          className="nav-button left"
          onClick={e => {
            e.stopPropagation();
            setCurrentSlide(prev => (prev === 0 ? images.length - 1 : prev - 1));
          }}
          aria-label="Назад"
        >
          <span className="nav-icon" aria-hidden>‹</span>
        </button>
        <button
          className="nav-button right"
          onClick={e => {
            e.stopPropagation();
            setCurrentSlide(prev => (prev === images.length - 1 ? 0 : prev + 1));
          }}
          aria-label="Вперёд"
        >
          <span className="nav-icon" aria-hidden>›</span>
        </button>
        <div className="slider-dots" style={{
          position: "absolute",
          bottom: 14,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8
        }}>
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`slider-dot${idx === currentSlide ? " active" : ""}`}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: idx === currentSlide ? "#3b82f6" : "#fff",
                border: "none",
                margin: 0,
                padding: 0,
                cursor: "pointer"
              }}
              onClick={e => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </>
    )}
  </div>
)}
              <div className="project-info">
                <div className="project-tags">
                  <span className="tag tag-primary">
                    {type === 1 ? "СНК" : type === 2 ? "Лабораторный" : `Тип ${type}`}
                  </span>
                  {stage && <span className="tag tag-secondary">{stage}</span>}
                </div>
                {attributes.title && <h1 className="project-title">{attributes.title}</h1>}
                {attributes.summary && (
                  <p className="project-attr-value">{attributes.summary}</p>
                )}

                {/* Все остальные атрибуты */}
                <dl className="project-attributes">
                  {visibleAttributes.map(({ label, value }) =>
                    <React.Fragment key={label}>
                      <dt className="project-attr-label">{label}</dt>
                      <dd className="project-attr-value">{value}</dd>
                    </React.Fragment>
                  )}
                </dl>
                <div className="project-footer" style={{ marginTop: 24, fontSize: 14, color: "#777" }}>
                  <span className="project-date">
                    {new Date(project.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                  {/* {project.updatedAt && (
                    <span style={{ marginLeft: 22 }}>
                      Обновлено: {new Date(project.updatedAt).toLocaleString("ru-RU")}
                    </span>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;

