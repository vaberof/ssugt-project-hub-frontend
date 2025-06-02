import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import "../styles/projectModerationView.css";

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

export const ProjectModerationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMap, setUserMap] = useState<Record<number, UserResponse>>({});
const [currentSlide, setCurrentSlide] = useState(0);

  // Получить project
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://46.149.67.92:80/projects/${id}`, {
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

  // Получить данные пользователей-участников
  useEffect(() => {
    if (project && project.collaborators && project.collaborators.length > 0) {
      const uniqueIds = Array.from(new Set(project.collaborators.map((c) => c.userId)));
      const searchParams = uniqueIds.map(id => `ids=${id}`).join("&");
      fetch(
        `http://46.149.67.92:80/users?${searchParams}`,
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

  if (loading) return <div style={{ padding: 40 }}>Загрузка...</div>;
  if (error || !project) return <div style={{ color: "red", padding: 40 }}>{error || "Проект не найден"}</div>;

  const { attributes, collaborators = [], files, type, status } = project;

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
    { label: "Объект исследования/разработки", value: attributes.object },
    { label: "Стоимость", value: attributes.cost },
    { label: "Срок реализации", value: attributes.realizationTerm },
    { label: "Область применения", value: attributes.applicationScope },
    { label: "Источник финансирования", value: attributes.fundingSource },
    { label: "Размер команды", value: attributes.teamSize && attributes.teamSize > 0 ? attributes.teamSize : undefined },
    { label: "Цели исследования", value: attributes.researchGoals },
    { label: "Методология", value: attributes.methodology },
    { label: "Потенциальное влияние", value: attributes.potentialImpact },
    { label: "Название лаборатории", value: attributes.laboratoryName },
    { label: "Проблематика", value: attributes.problematic },
    { label: "Предлагаемое решение", value: attributes.solution },
    { label: "Основная функциональность", value: attributes.functionality },
    { label: "Стек технологий", value: attributes.technologyStack },
    { label: "Результаты тестирования", value: attributes.testResults },
    { label: "План внедрения", value: attributes.deploymentPlan }
  ].filter((item) =>
    typeof item.value === "string" ? item.value.trim() !== "" : item.value !== undefined
  );

  // Тип/статус/этап
  let typeLabel = type === 1 ? "СНК" : type === 2 ? "Лабораторный" : `Тип ${type}`;
  let statusLabel =
    status === "В обработке"
      ? "В обработке"
      : status === "Подтверждено"
        ? "Завершён"
        : status === "Отклонено"
          ? "Отклонён"
          : status;
  const stage = attributes.developingStage || "";

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

  // === Функции модерации (заглушки) ===
  const handleApprove = async () => {
    alert("Проект подтверждён (добавь API-логику)");
    // Тут отправь PATCH/POST/PUT с обновлением статуса
    // navigate("/moderation/projects");
  };
  const handleReject = async () => {
    alert("Проект отклонён (добавь API-логику)");
    // Тут отправь PATCH/POST/PUT с обновлением статуса
    // navigate("/moderation/projects");
  };

  return (
    <div className="project-view moderation-project-view">
      <div className="project-content">
        <div className="project-layout">
          {/* Левая панель */}
          <div className="sidebar">
            <div className="back-link">
              <Link to="/moderation/projects" className="back-button">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/a0735ba21429b97369b57045a0d396d5380a82af?placeholderIfAbsent=true"
                  alt="Back"
                  className="back-icon"
                />
                Назад к проектам
              </Link>
            </div>
            <div className="participants-card">
              <h2 className="card-title">Участники проекта</h2>
              {participantsList}
              <h2 className="card-title status-title" style={{ marginTop: 28 }}>Статус проекта</h2>
              <div className={
                "status-badge " +
                (status === "В обработке"
                  ? "status-processing"
                  : status === "Отклонено"
                    ? "status-rejected"
                    : status === "Подтверждено"
                      ? "status-approved"
                      : "")
              }>
                {statusLabel}
              </div>
            </div>
            {/* Кнопки модерации только на странице модерации */}
            <button className="approve-button" onClick={handleApprove}>
              Подтвердить
            </button>
            <button className="reject-button" onClick={handleReject}>
              Отклонить
            </button>
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
            {/* Стрелки */}
            {images.length > 1 && (
              <>
                <button
                  className="slider-arrow slider-arrow-left"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    width: 40,
                    height: 40,
                    cursor: "pointer",
                    zIndex: 2
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                  }}
                  aria-label="prev"
                >
                  &#8592;
                </button>
                <button
                  className="slider-arrow slider-arrow-right"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    width: 40,
                    height: 40,
                    cursor: "pointer",
                    zIndex: 2
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                  }}
                  aria-label="next"
                >
                  &#8594;
                </button>
                {/* Точки */}
                <div
                  className="slider-dots"
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 8
                  }}
                >
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
                  <span className="tag tag-primary">{typeLabel}</span>
                  {stage && <span className="tag tag-secondary">{stage}</span>}
                </div>
                {attributes.title && <h1 className="project-title">{attributes.title}</h1>}
                {attributes.summary && (
                  <p className="project-description">{attributes.summary}</p>
                )}
                {/* Категории/теги */}
                {tags.length > 0 && (
                  <div className="project-categories" style={{ marginTop: 12 }}>
                    {tags.map((tag) => (
                      <span key={tag} className="category-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Все остальные атрибуты */}
                <dl className="project-attributes" style={{ marginTop: 16 }}>
                  {visibleAttributes.map(({ label, value }) =>
                    <React.Fragment key={label}>
                      <dt style={{ fontWeight: 500, marginTop: 10 }}>{label}</dt>
                      <dd style={{ marginLeft: 0, marginBottom: 0 }}>{value}</dd>
                    </React.Fragment>
                  )}
                </dl>

                {/* Преимущества */}
                {advantages.length > 0 && (
                  <div className="project-advantages" style={{ marginTop: 16 }}>
                    <strong>Преимущества:</strong>
                    <ul>
                      {advantages.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="project-footer" style={{ marginTop: 24, fontSize: 14, color: "#777" }}>
                  <span>
                    Создано: {new Date(project.createdAt).toLocaleString("ru-RU")}
                  </span>
                  {project.updatedAt && (
                    <span style={{ marginLeft: 22 }}>
                      Обновлено: {new Date(project.updatedAt).toLocaleString("ru-RU")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
