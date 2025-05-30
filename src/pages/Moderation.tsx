import React, { useState } from 'react';
import { Header } from '../components/Header';
import { ModerationCard } from '../components/ModerationCard';
import '../styles/moderation.css';

interface FilterState {
  search: string;
  projectType: string;
  projectStatus: string;
  date: string;
}

export const Moderation: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    projectType: '',
    projectStatus: '',
    date: ''
  });

  const handleFilterChange = (name: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="moderation-page">
      <Header isAuthenticated={true} />
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
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <div className="filter-section">
                <label className="filter-label">Тип проекта</label>
                <div className="filter-select">
                  <select
                    value={filters.projectType}
                    onChange={(e) => handleFilterChange('projectType', e.target.value)}
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
                    onChange={(e) => handleFilterChange('projectStatus', e.target.value)}
                    className="filter-select-input"
                  >
                    <option value="">Любой</option>
                    <option value="processing">В обработке</option>
                    <option value="rejected">Отклонено</option>
                    <option value="approved">Подтверждено</option>
                  </select>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/2a3e85ff70776e2431b9ff5b587eec0c9e25adda?placeholderIfAbsent=true"
                    alt="dropdown"
                    className="select-arrow"
                  />
                </div>
              </div>
              <div className="filter-section">
                <label className="filter-label">Дата</label>
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="дд. мм. гггг."
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  />
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/3b0ba2064f2f671e7b9c8a2039a00e770f50595a?placeholderIfAbsent=true"
                    alt="calendar"
                    className="date-icon"
                  />
                </div>
              </div>
              <button className="search-button">
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
            <ModerationCard
              title="Разработка умной теплицы"
              authors="Шарапов Артём Андреевич, Строганов Данила, Болтава Владимир Андреевич"
              status="В обработке"
              description="Автоматизированная система управления микроклиматом в теплице. Проект включает..."
              onApprove={() => console.log('Approved')}
              onReject={() => console.log('Rejected')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};