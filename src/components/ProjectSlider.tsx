import React, { useState } from 'react';

export const ProjectSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    'https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/a14ab77119303eceb94e46d15eb9c0d28871d5ad?placeholderIfAbsent=true',
    'https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/71fb50ae1410c181eef39079121a05010e28e493?placeholderIfAbsent=true',
    // Add more images as needed
  ];

  const navigationButtons = [
    { src: 'https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/f3d878c8c968774a889ab2a812a5f1b8568c08f8?placeholderIfAbsent=true', alt: 'Previous' },
    { src: 'https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/3fd35f546523cb66fda5773188512b9dd1d905a3?placeholderIfAbsent=true', alt: 'Next' }
  ];

  return (
    <div className="slider-container">
      <div className="slider-content">
        <img
          src={images[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          className="slider-image"
        />
        <div className="slider-overlay">
          <div className="slider-navigation">
            {navigationButtons.map((button, index) => (
              <button
                key={index}
                className="nav-button"
                onClick={() => setCurrentSlide(index === 0 ? currentSlide - 1 : currentSlide + 1)}
                disabled={
                  (index === 0 && currentSlide === 0) ||
                  (index === 1 && currentSlide === images.length - 1)
                }
              >
                <img src={button.src} alt={button.alt} className="nav-icon" />
              </button>
            ))}
          </div>
          <div className="slider-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};