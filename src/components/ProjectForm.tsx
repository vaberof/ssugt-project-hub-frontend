import React, { useState, useEffect, useRef } from "react";
import { getUserIdFromApi, getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

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

export const ProjectForm: React.FC = () => {
  const navigate = useNavigate();

  // Стейты формы
  const [projectType, setProjectType] = useState<"snk" | "laboratory">("laboratory");
  const [tags, setTags] = useState<ProjectTag[]>([]);
  const [newTag, setNewTag] = useState("");
  const [collaborators, setCollaborators] = useState<CollaboratorDraft[]>([]);
  const [newColEmail, setNewColEmail] = useState("");
  const [newColRole, setNewColRole] = useState<CollaboratorRole | "">("");
  const [colSearchError, setColSearchError] = useState("");
  const [colLoading, setColLoading] = useState(false);

  // --- Form fields ---
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

  // --- Файлы ---
  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- Добавление себя как участника ---
 useEffect(() => {
  async function fetchSelf() {
    const token = getToken();
    const userId = await getUserIdFromApi();
    if (!userId) return;
    const resp = await fetch(`http://46.149.67.92:80/users?ids=${userId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `${token}` } : {}),
      },
    });
    const data = await resp.json();
    if (data && data.users && data.users[0]) {
      const user = data.users[0];
      setCollaborators((prev) => {
        // === ПРОВЕРКА ===
        if (prev.some((c) => c.email === user.email)) return prev;
        return [
          {
            email: user.email,
            role: "",
            user: {
              id: user.id,
              email: user.email,
              fullName: user.fullName,
            },
            isCreator: true,
          },
          ...prev,
        ];
      });
    }
  }
  fetchSelf();
  // eslint-disable-next-line
}, []);


  // --- Tags ---
  const handleAddTag = () => {
    if (newTag.trim() && !tags.find((t) => t.name === newTag.trim())) {
      setTags([...tags, { name: newTag.trim() }]);
      setNewTag("");
    }
  };
  const handleRemoveTag = (idx: number) => setTags(tags.filter((_, i) => i !== idx));

  // --- Advantages ---
  const handleAddAdvantage = () => {
    if (newAdvantage.trim() && !advantages.includes(newAdvantage.trim())) {
      setAdvantages([...advantages, newAdvantage.trim()]);
      setNewAdvantage("");
    }
  };
  const handleRemoveAdvantage = (idx: number) =>
    setAdvantages(advantages.filter((_, i) => i !== idx));

  // --- Collaborators ---
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
      setColSearchError("Этот email уже добавлен");
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
  };

  // --- File Upload ---
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

  // --- Main Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      alert("Вы не авторизованы");
      return;
    }

    const userId = await getUserIdFromApi();
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

      // === Загрузка файлов ===
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
          <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Объект исследования/разработки</label>
          <input type="text" className="form-input" value={object} onChange={e => setObject(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Описание проекта</label>
          <textarea className="form-textarea" value={summary} onChange={e => setSummary(e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label className="form-label">Стоимость проекта</label>
            <input type="text" className="form-input" value={cost} onChange={e => setCost(e.target.value)} />
          </div>
          <div className="form-group half-width">
            <label className="form-label">Текущий этап разработки</label>
            <input type="text" className="form-input" value={developingStage} onChange={e => setDevelopingStage(e.target.value)} />
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
            <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
              <input type="text" className="form-input" value={newAdvantage} onChange={e => setNewAdvantage(e.target.value)} />
              <button type="button" className="add-tag-button" onClick={handleAddAdvantage}>
                Добавить
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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
        <div className="add-participant" style={{ gap: 12 }}>
          <input
            type="email"
            className="participant-input"
            placeholder="Email пользователя"
            value={newColEmail}
            onChange={e => setNewColEmail(e.target.value)}
            disabled={colLoading}
          />
          <select
            className="role-input"
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
          {colSearchError && <span className="error-message">{colSearchError}</span>}
        </div>
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
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          multiple
          style={{ display: "block", margin: "8px 0" }}
          onChange={handleFileChange}
        />
        {projectFiles.length > 0 && (
          <ul>
            {projectFiles.map((file, idx) => (
              <li key={idx}>
                {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} МБ)
              </li>
            ))}
          </ul>
        )}
      </section>

      <button type="submit" className="submit-button">
        Создать проект
      </button>
    </form>
  );
};
