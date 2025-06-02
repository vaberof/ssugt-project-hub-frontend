import React, { useState, useEffect, useRef } from "react";
import { getUserIdFromApi, getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "../styles/projectForm.css";

const collaboratorRoles = [
  "Руководитель",
  "Архитектор",
  "Бэкенд-разработчик",
  "Фронтенд-разработчик",
  "Фуллстек-Разработчик",
  "Тестировщик",
  "Менеджер продукта",
  "Бизнес-аналитик",
  "Другое",
] as const;

type CollaboratorRole = typeof collaboratorRoles[number];

interface ProjectTag {
  name: string;
}

interface CollaboratorDraft {
  email: string;
  role: CollaboratorRole | "";
  user?: {
    id: number;
    email: string;
    fullName: string;
  };
  isCreator?: boolean;
}

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
  userId: number;
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

interface ProjectFormProps {
  mode?: "create" | "edit";
  initialProject?: Project;
  onCancel?: () => void;
  onSubmit?: (project: Project) => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  mode = "create",
  initialProject,
  onCancel,
  onSubmit,
}) => {
  const navigate = useNavigate();

  // Form state
  const [projectType, setProjectType] = useState<"snk" | "laboratory">("laboratory");
  const [tags, setTags] = useState<ProjectTag[]>([]);
  const [newTag, setNewTag] = useState("");
  const [collaborators, setCollaborators] = useState<CollaboratorDraft[]>([]);
  const [newColEmail, setNewColEmail] = useState("");
  const [newColRole, setNewColRole] = useState<CollaboratorRole | "">("");
  const [colSearchError, setColSearchError] = useState("");
  const [colLoading, setColLoading] = useState(false);

  // Fields
  const [title, setTitle] = useState("");
  const [object, setObject] = useState("");
  const [summary, setSummary] = useState("");
  const [cost, setCost] = useState("");
  const [developingStage, setDevelopingStage] = useState("");
  const [realizationTerm, setRealizationTerm] = useState("");
  const [applicationScope, setApplicationScope] = useState("");
  const [fundingSource, setFundingSource] = useState("");
  const [teamSize, setTeamSize] = useState("");
  // СНК
  const [researchGoals, setResearchGoals] = useState("");
  const [methodology, setMethodology] = useState("");
  const [potentialImpact, setPotentialImpact] = useState("");
  // Лабораторный
  const [laboratoryName, setLaboratoryName] = useState("");
  const [problematic, setProblematic] = useState("");
  const [solution, setSolution] = useState("");
  const [functionality, setFunctionality] = useState("");
  const [technologyStack, setTechnologyStack] = useState("");
  const [advantages, setAdvantages] = useState<string[]>([]);
  const [newAdvantage, setNewAdvantage] = useState("");
  const [testResults, setTestResults] = useState("");
  const [deploymentPlan, setDeploymentPlan] = useState("");

  // Files
  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const [collaboratorsLoading, setCollaboratorsLoading] = useState(false);


  const developingStageOptions = [
    { value: "Концепт", label: "Концепт" },
    { value: "Исследование", label: "Исследование" },
    { value: "Разработка", label: "Разработка" },
    { value: "Тестирование", label: "Тестирование" },
    { value: "Внедрение", label: "Внедрение" },
    { value: "Завершён", label: "Завершён" },
    { value: "Приостановлен", label: "Приостановлен" },
    { value: "Отменён", label: "Отменён" },
    { value: "Другое", label: "Другое" },
  ];

  // --- ИНИЦИАЛИЗАЦИЯ ДАННЫХ ДЛЯ РЕДАКТИРОВАНИЯ ---
useEffect(() => {
  async function initCollaborators() {
    if (
      initialProject &&
      initialProject.collaborators &&
      Array.isArray(initialProject.collaborators)
    ) {
      setCollaboratorsLoading(true);

      // Получаем список userId без дублей
      const ids = Array.from(
        new Set(initialProject.collaborators.map((c) => c.userId))
      );
      // Запрашиваем пачкой пользователей
      let usersMap: Record<number, { id: number; email: string; fullName: string }> = {};
      try {
        const token = getToken();
        const resp = await fetch(`http://46.149.67.92:80/users?${ids.map(id => `ids=${id}`).join("&")}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `${token}` } : {}),
          },
        });
        if (resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data.users)) {
            data.users.forEach((u: any) => {
              usersMap[u.id] = u;
            });
          }
        }
      } catch {}

      setCollaborators(
      initialProject.collaborators.map((c) => ({
        email: "",
        role: collaboratorRoles.includes(c.role as CollaboratorRole) ? (c.role as CollaboratorRole) : "",
        user: usersMap[c.userId] || { id: c.userId, email: "", fullName: "" },
        isCreator: c.userId === initialProject.userId,
      }))
    );
      setCollaboratorsLoading(false);
    }
  }

  if (initialProject) {
    setProjectType(initialProject.type === 1 ? "snk" : "laboratory");
    const attr = initialProject.attributes;
    setTitle(attr.title || "");
    setObject(attr.object || "");
    setSummary(attr.summary || "");
    setCost(attr.cost || "");
    setDevelopingStage(attr.developingStage || "");
    setRealizationTerm(attr.realizationTerm || "");
    setApplicationScope(attr.applicationScope || "");
    setTags((attr.tags || []).map((t: string) => ({ name: t })));
    setFundingSource(attr.fundingSource || "");
    setTeamSize(attr.teamSize ? attr.teamSize.toString() : "");
    setResearchGoals(attr.researchGoals || "");
    setMethodology(attr.methodology || "");
    setPotentialImpact(attr.potentialImpact || "");
    setLaboratoryName(attr.laboratoryName || "");
    setProblematic(attr.problematic || "");
    setSolution(attr.solution || "");
    setFunctionality(attr.functionality || "");
    setTechnologyStack(attr.technologyStack || "");
    setAdvantages(attr.advantages || []);
    setTestResults(attr.testResults || "");
    setDeploymentPlan(attr.deploymentPlan || "");

    // Загружаем участников с ФИО!
    initCollaborators();
  }
  // eslint-disable-next-line
}, [initialProject]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Введите название проекта";
    if (!summary.trim()) newErrors.summary = "Введите описание проекта";
    if (!developingStage.trim()) newErrors.developingStage = "Укажите текущий этап разработки";
    if (!tags.length) newErrors.tags = "Добавьте хотя бы один тег";
    if (!collaborators.length || collaborators.some(c => !c.role)) {
      newErrors.collaborators = "У всех участников должна быть выбрана роль";
    }
    return newErrors;
  };

  // --- Остальной код формы (handleFieldChange, tags, advantages, files, collaborators) ---
  const handleFieldChange = (field: string, value: string, setter: (v: string) => void) => {
    setter(value);
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.find((t) => t.name === newTag.trim())) {
      setTags([...tags, { name: newTag.trim() }]);
      setNewTag("");
      setErrors(prev => ({ ...prev, tags: "" }));
    }
  };
  const handleRemoveTag = (idx: number) => setTags(tags.filter((_, i) => i !== idx));
  const handleAddAdvantage = () => {
    if (newAdvantage.trim() && !advantages.includes(newAdvantage.trim())) {
      setAdvantages([...advantages, newAdvantage.trim()]);
      setNewAdvantage("");
    }
  };
  const handleRemoveAdvantage = (idx: number) =>
    setAdvantages(advantages.filter((_, i) => i !== idx));
  async function fetchUserByEmail(email: string) {
    const token = getToken();
    try {
      const resp = await fetch(`http://46.149.67.92:80/users/${encodeURIComponent(email)}`, {
        headers: token ? { Authorization: `${token}` } : {},
      });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      return {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.fullName,
      };
    } catch {
      return null;
    }
  }
  const handleAddCollaborator = async () => {
    setColSearchError("");
    if (!newColEmail || !newColRole) {
      setColSearchError("Укажите email и роль");
      return;
    }
    if (collaborators.find((c) => c.email === newColEmail)) {
      setColSearchError("Этот пользователь уже добавлен");
      return;
    }
    setColLoading(true);
    const user = await fetchUserByEmail(newColEmail);
    setColLoading(false);
    if (!user) {
      setColSearchError("Пользователь не найден");
      return;
    }
    setCollaborators([
      ...collaborators,
      {
        email: newColEmail,
        role: newColRole,
        user,
        isCreator: false,
      },
    ]);
    setNewColEmail("");
    setNewColRole("");
  };
  const handleRemoveCollaborator = (idx: number) => {
    if (collaborators[idx].isCreator) return;
    setCollaborators(collaborators.filter((_, i) => i !== idx));
  };
  const handleChangeRole = (idx: number, value: CollaboratorRole | "") => {
    setCollaborators((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, role: value } : c))
    );
    setErrors(prev => ({ ...prev, collaborators: "" }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const images = selected.filter(f =>
      ["image/jpeg", "image/png", "image/jpg"].includes(f.type)
    );
    const totalSize = images.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      alert("Суммарный размер файлов не должен превышать 50 МБ");
      return;
    }
    setProjectFiles(images);
  };
  const handleDropFiles = (files: FileList) => {
    const images = Array.from(files).filter(f =>
      ["image/jpeg", "image/png", "image/jpg"].includes(f.type)
    );
    const totalSize = images.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      alert("Суммарный размер файлов не должен превышать 50 МБ");
      return;
    }
    setProjectFiles(prev => [...prev, ...images]);
  };

  // --- Основной SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const token = getToken();
    if (!token) {
      alert("Вы не авторизованы");
      return;
    }

    let userId = await getUserIdFromApi();
    if (!userId) {
      alert("Не удалось получить userId (issuer) из токена");
      return;
    }

    const collaboratorsToSend = collaborators
      .filter((col) => col.user)
      .map((col) => ({
        userId: col.user!.id,
        role: col.role,
      }));

    let attributes: any = {
      title,
      object,
      summary,
      cost,
      developingStage,
      realizationTerm,
      applicationScope,
      tags: tags.map((t) => t.name),
      fundingSource,
      teamSize: parseInt(teamSize) || 0,
    };

    if (projectType === "snk") {
      attributes = {
        ...attributes,
        researchGoals,
        methodology,
        potentialImpact,
      };
    } else if (projectType === "laboratory") {
      attributes = {
        ...attributes,
        laboratoryName,
        problematic,
        solution,
        functionality,
        technologyStack,
        advantages,
        testResults,
        deploymentPlan,
      };
    }

    const typeId = projectType === "snk" ? 1 : 2;

    if (mode === "edit" && initialProject) {
      // UPDATE PROJECT
      const payload = {
        userId: initialProject.userId,
        type: typeId,
        status: "В процессе",
        attributes,
        collaborators: collaboratorsToSend,
      };
      try {
        const resp = await fetch(`http://46.149.67.92:80/projects/${initialProject.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!resp.ok) throw new Error("Ошибка обновления проекта");
        const data = await resp.json();

        // Загружаем файлы, если они есть
        let filesRespOk = true;
        if (data && (data.project?.id || data.id) && projectFiles.length > 0) {
          const projectId = data.project?.id || data.id;
          const formData = new FormData();
          for (let file of projectFiles) {
            formData.append("files", file);
          }
          const filesResp = await fetch(`http://46.149.67.92:80/projects/${projectId}/files`, {
            method: "PUT",
            headers: { Authorization: `${token}` },
            body: formData,
          });
          filesRespOk = filesResp.ok;
          if (!filesRespOk) {
            alert("Проект обновлён, но файлы не обновились!");
          }
        }

        if (onSubmit) onSubmit(data.project ?? data); // ТОЛЬКО onSubmit
        return; // завершаем хендлер
      } catch {
        alert("Не удалось обновить проект");
      }
      return;
    }

    // --- СОЗДАНИЕ ---
    const payload = {
      userId,
      type: typeId,
      attributes,
      collaborators: collaboratorsToSend,
    };

    try {
      const resp = await fetch("http://46.149.67.92:80/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error("Ошибка при создании проекта");
      const data = await resp.json();

      // Загрузка файлов
      if (data && data.id && projectFiles.length > 0) {
        const formData = new FormData();
        for (let file of projectFiles) {
          formData.append("files", file);
        }
        const filesResp = await fetch(`http://46.149.67.92:80/projects/${data.id}/files`, {
          method: "POST",
          headers: { Authorization: `${token}` },
          body: formData,
        });
        if (!filesResp.ok) {
          alert("Проект создан, но файлы не загрузились!");
        }
      }

      alert("Проект успешно создан!");
      if (data && data.id) {
        navigate(`/projects/${data.id}`);
      } else {
        alert("Проект создан, но не удалось получить id проекта");
      }
    } catch (e) {
      alert("Не удалось создать проект");
    }
  };

  // --- UI ---
  return (
    <form onSubmit={handleSubmit} className="project-form">
      {/* ... Вся остальная разметка формы без изменений ... */}
{/* Тип проекта */}
      <section className="form-section">
        <h2 className="section-title">Тип проекта</h2>
        <div className="project-type-options">
          <label className={`type-option ${projectType === "snk" ? "selected" : ""}`}>
            <input
              type="radio"
              name="projectType"
              value="snk"
              checked={projectType === "snk"}
              onChange={() => setProjectType("snk")}
              className="type-radio"
            />
            <span className="radio-circle" />
            <span>СНК</span>
          </label>
          <label className={`type-option ${projectType === "laboratory" ? "selected" : ""}`}>
            <input
              type="radio"
              name="projectType"
              value="laboratory"
              checked={projectType === "laboratory"}
              onChange={() => setProjectType("laboratory")}
              className="type-radio"
            />
            <span className="radio-circle" />
            <span>Лабораторный</span>
          </label>
        </div>
      </section>

      {/* Общая информация */}
      <section className="form-section">
        <h2 className="section-title">Общая информация</h2>
        <div className="form-group">
          <label className="form-label">Название проекта</label>
          <input type="text" className="form-input" value={title} onChange={e => handleFieldChange("title", e.target.value, setTitle)} />
          {isSubmitted && errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Объект исследования/разработки</label>
          <input type="text" className="form-input" value={object} onChange={e => setObject(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Описание проекта</label>
          <textarea className="form-textarea" value={summary} onChange={e => handleFieldChange("summary", e.target.value, setSummary)} />
          {isSubmitted && errors.summary && <div className="error-message">{errors.summary}</div>}
        </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label className="form-label">Стоимость проекта</label>
            <input type="text" className="form-input" value={cost} onChange={e => setCost(e.target.value)} />
          </div>
          <div className="form-group half-width">
            <label className="form-label">Текущий этап разработки</label>
            <input type="text" className="form-input" value={developingStage} onChange={e => handleFieldChange("developingStage", e.target.value, setDevelopingStage)} />
            {isSubmitted && errors.developingStage && <div className="error-message">{errors.developingStage}</div>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label className="form-label">Срок реализации</label>
            <input type="text" className="form-input" value={realizationTerm} onChange={e => setRealizationTerm(e.target.value)} />
          </div>
          <div className="form-group half-width">
            <label className="form-label">Размер команды</label>
            <input type="text" className="form-input" value={teamSize} onChange={e => setTeamSize(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Область применения</label>
          <textarea className="form-textarea" value={applicationScope} onChange={e => setApplicationScope(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Источник финансирования</label>
          <input type="text" className="form-input" value={fundingSource} onChange={e => setFundingSource(e.target.value)} />
        </div>
      </section>

      {/* Динамические секции */}
      {projectType === "snk" && (
        <section className="form-section">
          <h2 className="section-title">Атрибуты СНК-проекта</h2>
          <div className="form-group">
            <label className="form-label">Цели исследования</label>
            <textarea className="form-textarea" value={researchGoals} onChange={e => setResearchGoals(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Методология исследования</label>
            <textarea className="form-textarea" value={methodology} onChange={e => setMethodology(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Потенциальное влияние</label>
            <textarea className="form-textarea" value={potentialImpact} onChange={e => setPotentialImpact(e.target.value)} />
          </div>
        </section>
      )}
      {projectType === "laboratory" && (
        <section className="form-section">
          <h2 className="section-title">Атрибуты лабораторного проекта</h2>
          <div className="form-group">
            <label className="form-label">Название лаборатории</label>
            <input type="text" className="form-input" value={laboratoryName} onChange={e => setLaboratoryName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Проблематика</label>
            <textarea className="form-textarea" value={problematic} onChange={e => setProblematic(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Предлагаемое решение</label>
            <textarea className="form-textarea" value={solution} onChange={e => setSolution(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Основная функциональность</label>
            <textarea className="form-textarea" value={functionality} onChange={e => setFunctionality(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Стек технологий</label>
            <input type="text" className="form-input" value={technologyStack} onChange={e => setTechnologyStack(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Преимущества решения</label>
            <div className="tags-input-container">
              <input type="text" className="form-input" value={newAdvantage} onChange={e => setNewAdvantage(e.target.value)} />
              <button type="button" className="add-tag-button" onClick={handleAddAdvantage}>
                Добавить
              </button>
            </div>
            <div className="tags-container">
              {advantages.map((adv, idx) => (
                <div key={idx} className="tag-item">
                  <span>{adv}</span>
                  <button type="button" className="remove-tag-button" onClick={() => handleRemoveAdvantage(idx)}>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/3293b9ebf58506465abf88390a3ab44c4d6891ce?placeholderIfAbsent=true"
                      alt="Remove"
                      className="remove-icon"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Результаты тестирования</label>
            <textarea className="form-textarea" value={testResults} onChange={e => setTestResults(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">План внедрения</label>
            <textarea className="form-textarea" value={deploymentPlan} onChange={e => setDeploymentPlan(e.target.value)} />
          </div>
        </section>
      )}

      {/* Теги */}
      <section className="form-section">
        <h2 className="section-title">Теги проекта</h2>
        <div className="tags-input-container">
          <input
            type="text"
            className="tags-input"
            placeholder="Добавить тег..."
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
          />
          <button type="button" className="add-tag-button" onClick={handleAddTag}>
            Добавить
          </button>
        </div>
        {isSubmitted && errors.tags && <div className="error-message">{errors.tags}</div>}
        <div className="tags-container">
          {tags.map((tag, index) => (
            <div key={index} className="tag-item">
              <span>{tag.name}</span>
              <button type="button" className="remove-tag-button" onClick={() => handleRemoveTag(index)}>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/3293b9ebf58506465abf88390a3ab44c4d6891ce?placeholderIfAbsent=true"
                  alt="Remove"
                  className="remove-icon"
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Соавторы */}
      <section className="form-section">
        <h2 className="section-title">Участники проекта</h2>
        <div className="add-participant">
          <input
            type="email"
            className="participant-input"
            placeholder="Email пользователя"
            value={newColEmail}
            onChange={e => setNewColEmail(e.target.value)}
            disabled={colLoading}
          />
          <select
            className="participant-role"
            value={newColRole}
            onChange={e => setNewColRole(e.target.value as CollaboratorRole)}
            disabled={colLoading}
          >
            <option value="">Выберите роль</option>
            {collaboratorRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="add-participant-button"
            onClick={handleAddCollaborator}
            disabled={colLoading}
          >
            {colLoading ? "Поиск..." : "Добавить"}
          </button>
        </div>
        {isSubmitted && errors.collaborators && <div className="error-message">{errors.collaborators}</div>}
        {colSearchError && <span className="error-message">{colSearchError}</span>}
        <div className="participants-list">
          {collaborators.map((col, idx) => (
  <div key={idx} className="participant-item">
    <div className="participant-info">
      <span className="participant-name">{col.user?.fullName || col.email}</span>
      <span className="participant-role">
        <select
          value={col.role}
          disabled={col.isCreator ? false : false}
          onChange={e => handleChangeRole(idx, e.target.value as CollaboratorRole)}
        >
          <option value="">Выберите роль</option>
          {collaboratorRoles.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </span>
    </div>
    {/* Вот тут: */}
    {!col.isCreator && (
      <button
        type="button"
        className="remove-participant-button"
        onClick={() => handleRemoveCollaborator(idx)}
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/3293b9ebf58506465abf88390a3ab44c4d6891ce?placeholderIfAbsent=true"
          alt="Remove"
          className="remove-icon"
        />
      </button>
    )}
  </div>
))}
          
        </div>
      </section>

      {/* Изображения */}
     <section className="form-section">
  <h2 className="section-title">Изображения</h2>
  <div
  className={`dropzone${dragActive ? ' drag-active' : ''}`}
  onDragOver={e => { e.preventDefault(); setDragActive(true); }}
  onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
  onDrop={e => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleDropFiles(e.dataTransfer.files);
    }
  }}
  onClick={() => fileInputRef.current && fileInputRef.current.click()}
  >
    <div className="dropzone-inner">
      <svg className="dropzone-icon" width="48" height="48" fill="none"><path d="M24 5v30m0 0l-8-8m8 8l8-8" stroke="#3877e3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="37" width="42" height="6" rx="3" fill="#e8f0fe"/></svg>
      <div className="dropzone-label">
        Перетащите файлы сюда или
      </div>
      <button
        type="button"
        className="custom-upload-button"
        onClick={e => {
          e.stopPropagation();
          fileInputRef.current && fileInputRef.current.click();
        }}
      >
        Выберите файлы
      </button>
      <div className="dropzone-hint">PNG, JPEG, JPG до 50 МБ</div>
    </div>
    <input
      ref={fileInputRef}
      type="file"
      accept=".jpg,.jpeg,.png"
      multiple
      className="file-input"
      onChange={handleFileChange}
      style={{ display: "none" }}
    />
  </div>
  {projectFiles.length > 0 && (
    <ul className="file-list-preview">
      {projectFiles.map((file, idx) => (
        <li key={idx} className="file-preview-item">
          {file.type.startsWith("image") && (
            <img
              className="file-preview-thumb"
              src={URL.createObjectURL(file)}
              alt={file.name}
            />
          )}
          <div className="file-preview-info">
            <div className="file-preview-name">{file.name}</div>
            <div className="file-preview-size">
              {(file.size / (1024 * 1024)).toFixed(2)} МБ
            </div>
          </div>
          <button
            type="button"
            className="remove-file-button"
            title="Удалить файл"
            onClick={e => {
              e.stopPropagation();
              setProjectFiles(files => files.filter((_, i) => i !== idx));
            }}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  )}
</section>
      {/* Кнопки */}
      <div className="form-actions" style={{ marginTop: 30 }}>
        <button type="submit" className="submit-button">
          {mode === "edit" ? "Сохранить изменения" : "Создать проект"}
        </button>
        {mode === "edit" && onCancel && (
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};