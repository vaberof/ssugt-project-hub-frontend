import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getToken } from "../utils/auth"; // если проект приватный
import { ProjectCard } from "../components/ProjectCard"; // путь зависит от структуры

// Типы для проекта (можно вынести отдельно)
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

export const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      if (!res.ok) {
        throw new Error(`Ошибка загрузки: ${res.statusText}`);
      }
      const data = await res.json();
      // Исправление здесь: получаем сам объект проекта
      setProject(data.project); // <-- ВАЖНО!
    })
    .catch((err) => {
      setError("Не удалось загрузить проект");
    })
    .finally(() => setLoading(false));
}, [id]);

  if (loading) return <div style={{ padding: 40 }}>Загрузка проекта...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;
  if (!project) return null;

  return (
    <div className="project-page" style={{ maxWidth: 900, margin: "40px auto" }}>
      <ProjectCard project={project} />
    </div>
  );
};
