import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProjectSlider } from '../components/ProjectSlider';
import '../styles/projectModerationView.css';

export const ProjectModerationView: React.FC = () => {
  const handleApprove = () => {
    console.log('Project approved');
    // Implement approval logic
  };

  const handleReject = () => {
    console.log('Project rejected');
    // Implement rejection logic
  };

  return (
    <div className="moderation-view">
      <Header isAuthenticated={true} />
      <div className="moderation-content">
        <div className="moderation-layout">
          <div className="sidebar">
            <div className="back-link">
              <Link to="/projects/moderation" className="back-button">
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
              <div className="participants-list">
                <div className="participant-item">
                  <img src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/f89fcd69fcea175ad221bdc7828665542429b653?placeholderIfAbsent=true" alt="Participant" className="participant-avatar" />
                  <div className="participant-info">
                    <span className="participant-name">Шарапов Артём Андреевич</span>
                    <span className="participant-role">Руководитель</span>
                  </div>
                </div>
                <div className="participant-item">
                  <img src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/bf3986113f92039b6a8a311d619b143f98e41e9e?placeholderIfAbsent=true" alt="Participant" className="participant-avatar" />
                  <div className="participant-info">
                    <span className="participant-name">Строганов Данила</span>
                    <span className="participant-role">Разработчик</span>
                  </div>
                </div>
                <div className="participant-item">
                  <img src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/cd7ff13f9df3c53242e8d7447d1238ee63a72b96?placeholderIfAbsent=true" alt="Participant" className="participant-avatar" />
                  <div className="participant-info">
                    <span className="participant-name">Припоров Владислав</span>
                    <span className="participant-role">Разработчик</span>
                  </div>
                </div>
              </div>
              <h2 className="card-title status-title">Статус проекта</h2>
              <div className="status-badge">В обработке</div>
            </div>
            <button className="approve-button" onClick={handleApprove}>
              Подтвердить
            </button>
            <button className="reject-button" onClick={handleReject}>
              Отклонить
            </button>
          </div>
          <div className="main-content">
            <div className="project-details-card">
              <ProjectSlider />
              <div className="project-info">
                <div className="project-tags">
                  <span className="tag tag-primary">Лабораторный</span>
                  <span className="tag tag-secondary">В процессе</span>
                </div>
                <h1 className="project-title">Разработка умной теплицы</h1>
                <p className="project-description">
                  Автоматизированная система управления микроклиматом в теплице. 
                  Проект включает в себя разработку датчиков температуры, влажности и освещения. 
                  Система позволяет удаленно контролировать все параметры и автоматически 
                  поддерживать оптимальные условия для роста растений.
                </p>
                <div className="project-categories">
                  <span className="category-tag">Программирование</span>
                  <span className="category-tag">Робототехника</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};