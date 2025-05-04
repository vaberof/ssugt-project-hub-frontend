import React, { useState } from 'react';

interface Participant {
  name: string;
  role: string;
}

interface ParticipantInputProps {
  participants: Participant[];
  onRemove: (index: number) => void;
}

export const ParticipantInput: React.FC<ParticipantInputProps> = ({
  participants,
  onRemove
}) => {
  const [newParticipant, setNewParticipant] = useState({ name: '', role: '' });

  return (
    <div className="participants-section">
      <div className="add-participant">
        <input
          type="text"
          className="participant-input"
          placeholder="ФИО"
          value={newParticipant.name}
          onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
        />
        <div className="role-select">
          <select
            className="role-input"
            value={newParticipant.role}
            onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value })}
          >
            <option value="">Выберите роль</option>
            <option value="Руководитель">Руководитель</option>
            <option value="Разработчик">Разработчик</option>
            <option value="Исследователь">Исследователь</option>
          </select>
          <img src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/af5c670344cc75b4f459800343b45eede33696ea?placeholderIfAbsent=true" alt="Select" className="select-icon" />
        </div>
        <button type="button" className="add-participant-button">
          Добавить
        </button>
      </div>

      <div className="participants-list">
        {participants.map((participant, index) => (
          <div key={index} className="participant-item">
            <div className="participant-info">
              <span className="participant-name">{participant.name}</span>
              <span className="participant-role">{participant.role}</span>
            </div>
            <button
              type="button"
              className="remove-participant-button"
              onClick={() => onRemove(index)}
            >
              <img src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/3293b9ebf58506465abf88390a3ab44c4d6891ce?placeholderIfAbsent=true" alt="Remove" className="remove-icon" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};