import React, { useState } from 'react';
import { ProjectFilter } from '../components/ProjectFilter';
import { ProjectCard } from '../components/ProjectCard';
import { Header } from '../components/Header';
import '../styles/projects.css';

interface Project {
  type: string;
  status: string;
  title: string;
  description: string;
  tags: string[];
  authors: string;
  date: string;
  images: string[];
}

export const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const projects: Project[] = [
    {
      type: 'Лабораторный',
      status: 'В процессе',
      title: 'Разработка умной теплицы',
      description:
        'Автоматизированная система управления микроклиматом в теплице. Проект включает в себя разработку датчиков температуры, влажности и освещения. Система позволяет удаленно контролировать все параметры и автоматически поддерживать оптимальные условия для роста растений.',
      tags: ['Программирование', 'Робототехника'],
      authors: 'Шарапов Артём Андреевич, Строганов Данила, Припоров Владислав',
      date: '05.04.2025',
      images: [
        'https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/d573676e09ac7bcf900df7d78146d691823de5dd?placeholderIfAbsent=true',
      ],
    },
    {
      type: 'СНК',
      status: 'Завершен',
      title: 'Исследование качества воды',
      description:
        'Анализ состава воды в городских водоемах с использованием современных методов исследования и оборудования. Проект направлен на выявление загрязняющих веществ и разработку рекомендаций по улучшению экологической обстановки.',
      tags: ['Химия', 'Экология'],
      authors: 'Мария Иванова',
      date: '05.04.2025',
      images: [
        'https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/5f5a67915e40eaedc736e6e383be2df4136fe6ae?placeholderIfAbsent=true',
      ],
    },
    {
      type: 'Лабораторный',
      status: 'Набор участников',
      title: 'Нейросеть для распознавания объектов',
      description:
        'Разработка системы компьютерного зрения на основе нейронных сетей для распознавания объектов в режиме реального времени. Проект включает создание и обучение нейронной сети, оптимизацию алгоритмов и тестирование на реальных данных.',
      tags: ['Программирование', 'Математика'],
      authors: 'Алексей Смирнов',
      date: '05.04.2025',
      images: [
        'https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/43ee6af7106dda0ea8a254e3f7bc88454a00e3ec?placeholderIfAbsent=true',
      ],
    },
  ];


  const filteredProjects = projects.filter((project) => {
    const matchesTitle = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      !selectedType || project.type.toLowerCase() === selectedType.toLowerCase();
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) =>
        project.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
      );

    return matchesTitle && matchesType && matchesTags;
  });


  return (
    <div className="projects-container">
      <Header isAuthenticated={true} />
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
            />
          </div>
          <div className="projects-column">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={index}
                type={project.type}
                status={project.status}
                title={project.title}
                description={project.description}
                tags={project.tags}
                authors={project.authors}
                date={project.date}
                images={project.images}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};