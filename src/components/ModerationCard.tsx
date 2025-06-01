import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ModerationCardProps {
  project: {
    id: number;
    type: string;
    status: string;
    title: string;
    description: string;
    tags: string[];
    authors: string;
    date: string;
    images: { url: string; name: string }[];
  };
  onApprove: () => void;
  onReject: () => void;
}

export const ModerationCard: React.FC<ModerationCardProps> = ({
  project,
  onApprove,
  onReject,
}) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).classList.contains("slider-thumbnail") ||
      (e.target as HTMLElement).classList.contains("slider-dot") ||
      (e.target as HTMLElement).classList.contains("approve-button") ||
      (e.target as HTMLElement).classList.contains("reject-button")
    ) {
      return;
    }
    navigate(`/moderation/projects/${project.id}`);
  };

  return (
    <div
      className="project-card moderation-card"
      tabIndex={0}
      style={{ cursor: "pointer" }}
      onClick={handleCardClick}
    >
      {/* Слайдер картинок */}
      {project.images.length > 1 ? (
        <div className="project-slider">
          <img
            src={project.images[currentSlide].url}
            alt={project.images[currentSlide].name}
            className="project-image"
            style={{
              width: "100%",
              maxHeight: 220,
              objectFit: "cover",
              borderRadius: "12px 12px 0 0",
              display: "block",
            }}
          />
          <div className="slider-controls">
            {project.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.name}
                className="slider-thumbnail"
                style={{
                  width: 48,
                  height: 38,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginRight: 5,
                  border: index === currentSlide ? "2px solid #2563eb" : "1px solid #eee",
                  cursor: "pointer",
                }}
                onClick={e => {
                  e.stopPropagation();
                  setCurrentSlide(index);
                }}
              />
            ))}
          </div>
          <div className="slider-dots">
            {project.images.map((_, index) => (
              <div
                key={index}
                className={`slider-dot${index === currentSlide ? " active" : ""}`}
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: index === currentSlide ? "#2563eb" : "#dbeafe",
                  margin: "0 3px",
                  cursor: "pointer",
                  verticalAlign: "middle",
                }}
                onClick={e => {
                  e.stopPropagation();
                  setCurrentSlide(index);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <img
          src={project.images[0].url}
          alt={project.images[0].name}
          className="project-image"
          style={{
            width: "100%",
            maxHeight: 220,
            objectFit: "cover",
            borderRadius: "12px 12px 0 0",
            display: "block",
          }}
        />
      )}

      <div className="project-content">
        <div className="project-badges">
          <span className="project-type">{project.type}</span>
          <span className="project-status">{project.status}</span>
        </div>

        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="project-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="project-footer">
          <span className="project-authors">{project.authors}</span>
          <span className="project-date">{project.date}</span>
        </div>

        {/* Кнопки одобрения/отклонения */}
        <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
          <button
            className="approve-button"
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              padding: "6px 20px",
              fontWeight: 500,
              cursor: "pointer",
            }}
            onClick={e => {
              e.stopPropagation();
              onApprove();
            }}
          >
            Подтвердить
          </button>
          <button
            className="reject-button"
            style={{
              background: "#fff",
              color: "#d14343",
              border: "1.3px solid #d14343",
              borderRadius: 7,
              padding: "6px 18px",
              fontWeight: 500,
              cursor: "pointer",
            }}
            onClick={e => {
              e.stopPropagation();
              onReject();
            }}
          >
            Отклонить
          </button>
        </div>
      </div>
    </div>
  );
};
