import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  id: number;
  type: string;
  status: string;
  title: string;
  description: string;
  tags: string[];
  authors: string;
  date: string;
  images: string[];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  type,
  status,
  title,
  description,
  tags,
  authors,
  date,
  images
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSlide(s => (s === 0 ? images.length - 1 : s - 1));
  };
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSlide(s => (s === images.length - 1 ? 0 : s + 1));
  };

  return (
    <Link to={`/projects/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="project-card" tabIndex={0} style={{ cursor: 'pointer' }}>
        <div className="slider-container">
          <img
            src={images[currentSlide]}
            alt={title}
            className="slider-image"
          />
          {images.length > 1 && (
            <>
              <button className="nav-button left" onClick={handlePrev} aria-label="Назад">
                <span className="nav-icon" aria-hidden>‹</span>
              </button>
              <button className="nav-button right" onClick={handleNext} aria-label="Вперёд">
                <span className="nav-icon" aria-hidden>›</span>
              </button>
              <div className="slider-dots">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`slider-dot${idx === currentSlide ? ' active' : ''}`}
                    onClick={e => { e.preventDefault(); setCurrentSlide(idx); }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="project-content">
          <div className="project-badges">
            <span className="project-type">{type}</span>
            <span className="project-status">{status}</span>
          </div>
          <h3 className="project-title">{title}</h3>
          <p className="project-description">{description}</p>
          <div className="project-tags">
            {tags.map((tag) => (
              <span key={tag} className="project-tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="project-footer">
            <span className="project-authors">{authors}</span>
            <span className="project-date">{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
