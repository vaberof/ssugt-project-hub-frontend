import React, { useEffect, useState, useCallback } from 'react';
import { ProjectFilter } from '../components/ProjectFilter';
import { ProjectCard } from '../components/ProjectCard';
import '../styles/projects.css';
import { getToken, getUserIdFromApi } from '../utils/auth';

interface ProjectAttributes {
  title?: string;
  summary?: string;
  tags?: string[];
  createdAt?: string;
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
  files?: { type: string; content?: string }[];
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

const checkAdminStatus = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) return false;
  try {
    const response = await fetch("http://46.149.67.92:80/auth/is-admin", {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.isAdmin || false;
    }
  } catch {}
  return false;
};

export const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [projects, setProjects] = useState<ProjectBackend[]>([]);
  const [usersMap, setUsersMap] = useState<Record<number, UserShort>>({});
  const [loading, setLoading] = useState(false);

  // Для фильтрации доступа к "В обработке"
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Доп. состояние, чтобы отслеживать ручной запуск поиска
  const [searchTrigger, setSearchTrigger] = useState(0);

  const debouncedQuery = useDebounce(searchQuery, 400);
  const debouncedTags = useDebounce(selectedTags, 400);

  // Обработка инпута тегов
  useEffect(() => {
    if (tagsInput.length === 0) return setSelectedTags([]);
    const arr = tagsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    setSelectedTags(Array.from(new Set(arr)));
    // eslint-disable-next-line
  }, [tagsInput]);

  // Получаем userId и admin (только если залогинен)
  useEffect(() => {
    async function getUserData() {
      const token = getToken();
      if (!token) {
        setCurrentUserId(null);
        setIsAdmin(false);
        return;
      }
      const uid = await getUserIdFromApi();
      setCurrentUserId(uid);
      if (uid) {
        const admin = await checkAdminStatus();
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
    }
    getUserData();
  }, []);

  // Универсальная функция поиска
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setProjects([]);
    setUsersMap({});

    let typeNum = 0;
    if (selectedType === 'snk') typeNum = 1;
    if (selectedType === 'laboratory') typeNum = 2;

    const filters = {
      baseFilters: {
        Type: typeNum,
        Status: '',
        Date: null,
      },
      attributeFilters: {
        Title: searchQuery,
        Tags: selectedTags,
      },
    };

    try {
      const resp = await fetch('http://46.149.67.92:80/projects/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });
      if (!resp.ok) throw new Error('Ошибка поиска проектов');
      const data = await resp.json();
      let projects: ProjectBackend[] = data.projects || data.Projects || [];

      // === Фильтрация "В обработке" ===
      projects = projects.filter((p) => {
        if (p.status !== 'В обработке') return true;
        if (isAdmin) return true;
        if (!currentUserId) return false; // Гости не видят такие проекты
        const isCreator = p.userId === currentUserId;
        const isCollaborator = (p.collaborators || []).some(
          (c) => c.userId === currentUserId
        );
        return isCreator || isCollaborator;
      });

      setProjects(projects);

      const allUserIds = Array.from(
        new Set(projects.flatMap(p =>
          [p.userId, ...(p.collaborators?.map(c => c.userId) || [])]
        ))
      );
      if (allUserIds.length > 0) {
        const params = allUserIds.map(id => `ids=${id}`).join('&');
        const usersResp = await fetch(`http://46.149.67.92:80/users?${params}`, {
          headers: {
            'Content-Type': 'application/json',
          }
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
  }, [searchQuery, selectedType, selectedTags, currentUserId, isAdmin]);

  // Поиск по debounce или ручному запуску
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, [debouncedQuery, selectedType, debouncedTags.join(','), searchTrigger, currentUserId, isAdmin]);

  function mapProjectCard(project: ProjectBackend) {
    let typeLabel = '';
    if (project.type === 1) typeLabel = 'СНК';
    else if (project.type === 2) typeLabel = 'Лабораторный';
    else typeLabel = String(project.type);

  let statusLabel = '';
  if (project.attributes?.developingStage) {
    statusLabel = project.attributes.developingStage}


    const tags = (project.attributes?.tags ?? []).filter(Boolean);

    const allAuthorIds = Array.from(
      new Set([project.userId, ...(project.collaborators?.map(c => c.userId) || [])])
    );
    const authorsArr = allAuthorIds
      .map(uid => usersMap[uid]?.fullName)
      .filter(Boolean) as string[];
    const authors = authorsArr.join(', ');

    let date = '';
    if (project.createdAt) {
      const d = new Date(project.createdAt);
      date = d.toLocaleDateString('ru-RU');
    }

    const description = project.attributes?.summary || '';

    const images = (project.files ?? [])
      .filter(f => f.type === 'Изображение' && f.content)
      .map(f => `data:image/*;base64,${f.content}`);
    if (images.length === 0)
      images.push('https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/d573676e09ac7bcf900df7d78146d691823de5dd?placeholderIfAbsent=true');

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

  return (
    <div className="projects-container">
      <div className="projects-content">
        <div className="projects-grid">
          <div className="filter-column">
            <ProjectFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              tagsInput={tagsInput}
              onTagsInputChange={setTagsInput}
              onSearchClick={() => setSearchTrigger(x => x + 1)}
            />
          </div>
          <div className="projects-column">
            {loading && <div style={{ padding: 40, fontSize: 18 }}>Загрузка проектов...</div>}
            {!loading && projects.length === 0 && (
              <div style={{ padding: 40, color: '#888', fontSize: 18 }}>
                Проекты не найдены
              </div>
            )}
            {!loading &&
              projects.map((project) => (
                <ProjectCard key={project.id} {...mapProjectCard(project)} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
