import React, { useEffect, useState, useCallback } from "react";
import "../styles/moderation.css";
import { getToken } from "../utils/auth";
import { ModerationCard } from "../components/ModerationCard";

interface ProjectAttributes {
  title?: string;
  summary?: string;
  tags?: string[];
  [key: string]: any;
}

interface Collaborator {
  userId: number;
}

interface ProjectBackend {
  id: number;
  userId: number;
  type: number;
  status: string;
  attributes: ProjectAttributes;
  collaborators: Collaborator[];
  createdAt: string;
  files?: { type: string; content?: string; name?: string }[];
}

interface UserShort {
  id: number;
  fullName: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

interface FilterState {
  search: string;
  projectType: string;
  projectStatus: string;
  tags: string;
  date: string;
}

export const Moderation: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    projectType: "",
    projectStatus: "processing",
    tags: "",
    date: ""
  });
  const [projects, setProjects] = useState<ProjectBackend[]>([]);
  const [usersMap, setUsersMap] = useState<Record<number, UserShort>>({});
  const [loading, setLoading] = useState(false);

  const [searchTrigger, setSearchTrigger] = useState(0);
  const debouncedSearch = useDebounce(filters.search, 400);
  const debouncedTags = useDebounce(filters.tags, 400);

  // ===== Получение проектов =====
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setProjects([]);
    setUsersMap({});

    let typeNum = 0;
    if (filters.projectType === "snk") typeNum = 1;
    if (filters.projectType === "laboratory") typeNum = 2;

    let status = "";
    if (filters.projectStatus === "processing") status = "В обработке";
    else if (filters.projectStatus === "rejected") status = "Отклонено";
    else if (filters.projectStatus === "approved") status = "Подтверждено";

    const tagsArr = (filters.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const apiFilters = {
      baseFilters: {
        Type: typeNum,
        Status: status,
        Date: null,
      },
      attributeFilters: {
        Title: filters.search,
        Tags: tagsArr,
      },
    };

    try {
      const resp = await fetch("http://46.149.67.92:80/projects/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `${getToken()}` } : {}),
        },
        body: JSON.stringify(apiFilters),
      });
      if (!resp.ok) throw new Error("Ошибка поиска проектов");
      const data = await resp.json();
      const projects: ProjectBackend[] = data.projects || data.Projects || [];
      setProjects(projects);

      // ФИО авторов и соавторов
      const allUserIds = Array.from(
        new Set(projects.flatMap((p) => [p.userId, ...(p.collaborators?.map((c) => c.userId) || [])]))
      );
      if (allUserIds.length > 0) {
        const params = allUserIds.map((id) => `ids=${id}`).join("&");
        const usersResp = await fetch(`http://46.149.67.92:80/users?${params}`, {
          headers: { "Content-Type": "application/json" }
        });
        const usersData = await usersResp.json();
        const map: Record<number, UserShort> = {};
        (usersData.users || []).forEach((u: UserShort) => { map[u.id] = u; });
        setUsersMap(map);
      }
    } catch (e) {
      setProjects([]);
      setUsersMap({});
    }
    setLoading(false);
  }, [filters.projectType, filters.projectStatus, debouncedSearch, debouncedTags]);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, [filters.projectType, filters.projectStatus, debouncedSearch, debouncedTags, searchTrigger]);

  // Обработка изменений фильтров
  const handleFilterChange = (name: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===== Маппинг карточки =====
  function mapModerationCard(project: ProjectBackend) {
    let typeLabel = "";
    if (project.type === 1) typeLabel = "СНК";
    else if (project.type === 2) typeLabel = "Лабораторный";
    else typeLabel = String(project.type);

    let statusLabel = "";
    if (project.status === "В обработке") statusLabel = "В обработке";
    else if (project.status === "Подтверждено") statusLabel = "Завершён";
    else if (project.status === "Отклонено") statusLabel = "Отклонён";
    else statusLabel = project.status;

    const tags = (project.attributes?.tags ?? []).filter(Boolean);

    const allAuthorIds = Array.from(
      new Set([project.userId, ...(project.collaborators?.map((c) => c.userId) || [])])
    );
    const authorsArr = allAuthorIds
      .map((uid) => usersMap[uid]?.fullName)
      .filter(Boolean) as string[];
    const authors = authorsArr.join(", ");

    let date = "";
    if (project.createdAt) {
      const d = new Date(project.createdAt);
      date = d.toLocaleDateString("ru-RU");
    }

    const description = project.attributes?.summary || "";

    const images = (project.files ?? [])
      .filter((f) => f.type === "Изображение" && f.content)
      .map((f) => ({
        url: `data:image/*;base64,${f.content}`,
        name: f.name || "image",
      }));
    if (images.length === 0)
      images.push({
        url: "https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/d573676e09ac7bcf900df7d78146d691823de5dd?placeholderIfAbsent=true",
        name: "default",
      });

    return {
      id: project.id,
      type: typeLabel,
      status: statusLabel,
      title: project.attributes?.title || `Проект #${project.id}`,
      description,
      tags,
      authors,
      date,
      images,
    };
  }

  // ===== Действия для модерации (заглушки) =====
  const handleApprove = (id: number) => {
    alert("Проект подтверждён (реализуй отправку на бек)");
    // TODO: PATCH/POST запрос на бекенд
  };
  const handleReject = (id: number) => {
    alert("Проект отклонён (реализуй отправку на бек)");
    // TODO: PATCH/POST запрос на бекенд
  };

  return (
    <div className="moderation-page">
      <div className="moderation-content">
        <div className="moderation-grid">
          <div className="filter-column">
            <div className="filter-card">
              <h2 className="filter-title">Фильтры</h2>
              <div className="filter-section">
                <label className="filter-label">Поиск</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Название проекта..."
                  value={filters.search}
                  onChange={e => handleFilterChange("search", e.target.value)}
                />
              </div>
              <div className="filter-section">
                <label className="filter-label">Тип проекта</label>
                <div className="filter-select">
                  <select
                    value={filters.projectType}
                    onChange={e => handleFilterChange("projectType", e.target.value)}
                    className="filter-select-input"
                  >
                    <option value="">Любой</option>
                    <option value="snk">СНК</option>
                    <option value="laboratory">Лабораторный</option>
                  </select>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/2a3e85ff70776e2431b9ff5b587eec0c9e25adda?placeholderIfAbsent=true"
                    alt="dropdown"
                    className="select-arrow"
                  />
                </div>
              </div>
              <div className="filter-section">
                <label className="filter-label">Статус проекта</label>
                <div className="filter-select">
                  <select
                    value={filters.projectStatus}
                    onChange={e => handleFilterChange("projectStatus", e.target.value)}
                    className="filter-select-input"
                  >
                    <option value="processing">В обработке</option>
                    <option value="rejected">Отклонено</option>
                    <option value="approved">Подтверждено</option>
                    <option value="">Любой</option>
                  </select>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/2a3e85ff70776e2431b9ff5b587eec0c9e25adda?placeholderIfAbsent=true"
                    alt="dropdown"
                    className="select-arrow"
                  />
                </div>
              </div>
              <div className="filter-section">
                <label className="filter-label">Теги</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Химия, Биология..."
                  value={filters.tags}
                  onChange={e => handleFilterChange("tags", e.target.value)}
                />
              </div>
              <button
                className="search-button"
                type="button"
                onClick={() => setSearchTrigger(x => x + 1)}
                style={{ marginTop: 12 }}
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/0b8d2aaeb2cec9dafb42d253715dcb7c04caa773?placeholderIfAbsent=true"
                  alt="search"
                  className="search-icon"
                />
                Найти
              </button>
            </div>
          </div>
          <div className="projects-column">
            <div className="projects-header">
              <h1 className="projects-title">Проекты на рассмотрении</h1>
              <p className="projects-subtitle">Список проектов, требующих модерации</p>
            </div>
            {loading && <div style={{ padding: 40 }}>Загрузка проектов...</div>}
            {!loading && projects.length === 0 && (
              <div style={{ padding: 40, color: "#888" }}>Проекты не найдены</div>
            )}
            {!loading &&
              projects.map((project) => (
                <ModerationCard
                  key={project.id}
                  project={mapModerationCard(project)}
                  onApprove={() => handleApprove(project.id)}
                  onReject={() => handleReject(project.id)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
