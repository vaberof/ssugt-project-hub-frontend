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

  // ---- ВАЖНО: тут выводим в консоль!
  console.log("project.userId:", project.userId, typeof project.userId);
  console.log("currentUserId:", currentUserId, typeof currentUserId);

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
              {participantsList}

              {/* Статус только для участников или создателя */}
              {(canEdit || canViewStatus) && (
                <>
                  <h2 className="card-title status-title" style={{ marginTop: 28 }}>Статус проекта</h2>
                  <div className={
                    "status-badge " +
                    (project.status === "В обработке"
                      ? "status-processing"
                      : project.status === "Отклонён"
                        ? "status-rejected"
                        : project.status === "Одобрен"
                          ? "status-approved"
                          : "")
                  }>
                    {project.status}
                  </div>
                </>
              )}
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
              {/* Слайдер картинок */}
              {images.length > 0 && (
                <div className="project-images" style={{ marginBottom: 16 }}>
                  {images.map((img, i) => (
                    <img
                      key={img.url}
                      src={img.url}
                      alt={img.name}
                      style={{
                        width: 220,
                        height: 220,
                        objectFit: "cover",
                        borderRadius: 10,
                        marginRight: 8,
                      }}
                    />
                  ))}
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

export default ProjectView;
