import React from 'react';

interface ProjectFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  tagsInput: string;
  onTagsInputChange: (val: string) => void;
  onSearchClick: () => void;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedTags,
  onTagsChange,
  tagsInput,
  onTagsInputChange,
  onSearchClick
}) => {
  const predefinedTags = [
    'Программирование', 'Дизайн', 'Физика',
    'Математика', 'Химия', 'Биология',
    'Экология', 'Робототехника'
  ];

  const handleTagClick = (tag: string) => {
    let newTags = [...selectedTags];
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter(t => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }
    onTagsChange(newTags);
    onTagsInputChange(newTags.join(', '));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTagsInputChange(e.target.value);
  };

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h2 className="filter-title">Фильтры</h2>
      </div>

      <div className="filter-section">
        <label className="filter-label">Поиск</label>
        <input
          type="text"
          className="filter-input"
          placeholder="Название проекта..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-section">
        <label className="filter-label">Тип проекта</label>
        <div className="filter-select">
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="filter-input"
          >
            <option value="">Любой</option>
            <option value="laboratory">Лабораторный</option>
            <option value="snk">СНК</option>
          </select>
          <img src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/2a3e85ff70776e2431b9ff5b587eec0c9e25adda?placeholderIfAbsent=true" alt="Dropdown" className="select-arrow" />
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Теги</label>
        <input
          type="text"
          className="filter-input"
          placeholder="Химия, Биология..."
          value={tagsInput}
          onChange={handleInputChange}
        />
        <div className="tags-grid">
          {predefinedTags.map((tag) => (
            <button
              key={tag}
              className={`tag-button ${selectedTags.includes(tag) ? 'active' : ''}`}
              onClick={() => handleTagClick(tag)}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <button className="search-button" type="button" onClick={onSearchClick}>
        <img src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/0b8d2aaeb2cec9dafb42d253715dcb7c04caa773?placeholderIfAbsent=true" alt="Search" className="search-icon" />
        <span>Найти</span>
      </button>
    </div>
  );
};
