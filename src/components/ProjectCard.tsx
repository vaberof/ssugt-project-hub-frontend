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
  sliderImages?: string[];
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
  images,
  sliderImages
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Link to={`/projects/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="project-card" tabIndex={0} style={{ cursor: 'pointer' }}>
        {sliderImages ? (
          <div className="project-slider">
            <img src={images[0]} alt={title} className="project-image" />
            <div className="slider-controls">
              {sliderImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${title} ${index + 1}`}
                  className="slider-thumbnail"
                  onClick={e => { e.preventDefault(); setCurrentSlide(index); }}
                />
              ))}
            </div>
            <div className="slider-dots">
              {sliderImages.map((_, index) => (
                <div
                  key={index}
                  className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={e => { e.preventDefault(); setCurrentSlide(index); }}
                />
              ))}
            </div>
          </div>
        ) : (
          <img src={images[0]} alt={title} className="project-image" />
        )}

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
