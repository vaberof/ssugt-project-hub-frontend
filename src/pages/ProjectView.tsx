import React from 'react';
import { Link } from 'react-router-dom';
import { ProjectSlider } from '../components/ProjectSlider';
import { ProjectParticipants } from '../components/ProjectParticipants';
import '../styles/projectView.css';

export const ProjectView: React.FC = () => {
  return (
    <div className="project-view">
      <div className="project-content">
        <div className="project-layout">
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
              <ProjectParticipants />
              <h2 className="card-title status-title">Статус проекта</h2>
              <div className="status-badge status-processing">
                В обработке
              </div>
            </div>
            <button className="edit-button">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/40d96eedfdd990280336a9e23fe46faeea5a893e?placeholderIfAbsent=true"
                alt="Edit"
                className="edit-icon"
              />
              Редактировать проект
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