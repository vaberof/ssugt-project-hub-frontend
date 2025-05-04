import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { ParticipantInput } from './ParticipantInput';

interface ProjectTag {
  name: string;
}

interface ProjectParticipant {
  name: string;
  role: string;
}

export const ProjectForm: React.FC = () => {
  const [projectType, setProjectType] = useState<'snk' | 'laboratory'>('laboratory');
  const [tags, setTags] = useState<ProjectTag[]>([
    { name: 'Программирование' },
    { name: 'Робототехника' }
  ]);
  const [participants, setParticipants] = useState<ProjectParticipant[]>([
    { name: 'Шарапов Артём Андреевич', role: 'Руководитель' },
    { name: 'Строганов Данила', role: 'Разработчик' },
    { name: 'Припоров Владислав', role: 'Разработчик' }
  ]);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags([...tags, { name: newTag.trim() }]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <section className="form-section">
        <h2 className="section-title">Тип проекта</h2>
        <div className="project-type-options">
          <label className={`type-option ${projectType === 'snk' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="projectType"
              value="snk"
              checked={projectType === 'snk'}
              onChange={() => setProjectType('snk')}
              className="type-radio"
            />
            <span className="radio-circle" />
            <span>СНК</span>
          </label>
          <label className={`type-option ${projectType === 'laboratory' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="projectType"
              value="laboratory"
              checked={projectType === 'laboratory'}
              onChange={() => setProjectType('laboratory')}
              className="type-radio"
            />
            <span className="radio-circle" />
            <span>Лабораторный</span>
          </label>
        </div>
      </section>

      <section className="form-section">
        <h2 className="section-title">Общая информация</h2>
        <div className="form-group">
          <label className="form-label">Название проекта</label>
          <input
            type="text"
            className="form-input"
            defaultValue="Разработка умной теплицы"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Объект исследования/разработки</label>
          <input type="text" className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Описание проекта</label>
          <textarea
            className="form-textarea"
            defaultValue="Автоматизированная система управления микроклиматом в теплице. 
Проект включает в себя разработку датчиков температуры, влажности и освещения. 
Система позволяет удаленно контролировать все параметры и автоматически 
поддерживать оптимальные условия для роста растений."
          />
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <label className="form-label">Стоимость проекта</label>
            <input type="text" className="form-input" />
          </div>
          <div className="form-group half-width">
            <label className="form-label">Текущий этап разработки</label>
            <input type="text" className="form-input" defaultValue="В процессе" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <label className="form-label">Срок реализации</label>
            <input type="text" className="form-input" />
          </div>
          <div className="form-group half-width">
            <label className="form-label">Размер команды</label>
            <input type="text" className="form-input" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Область применения</label>
          <textarea className="form-textarea" />
        </div>

        <div className="form-group">
          <label className="form-label">Источник финансирования</label>
          <input type="text" className="form-input" />
        </div>
      </section>

      <section className="form-section">
        <h2 className="section-title">Теги проекта</h2>
        <div className="tags-input-container">
          <input
            type="text"
            className="tags-input"
            placeholder="Добавить тег..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button
            type="button"
            className="add-tag-button"
            onClick={handleAddTag}
          >
            Добавить
          </button>
        </div>
        <div className="tags-container">
          {tags.map((tag, index) => (
            <div key={index} className="tag-item">
              <span>{tag.name}</span>
              <button
                type="button"
                className="remove-tag-button"
                onClick={() => handleRemoveTag(index)}
              >
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

      <section className="form-section">
        <h2 className="section-title">Участники проекта</h2>
        <ParticipantInput
          participants={participants}
          onRemove={handleRemoveParticipant}
        />
      </section>

      <section className="form-section">
        <h2 className="section-title">Изображения</h2>
        <FileUpload />
      </section>

      <button type="submit" className="submit-button">
        Создать проект
      </button>
    </form>
  );
};