import React from 'react';

interface Participant {
  name: string;
  role: string;
  image: string;
}

export const ProjectParticipants: React.FC = () => {
  const participants: Participant[] = [
    {
      name: 'Шарапов Артём Андреевич',
      role: 'Руководитель',
      image: 'https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/f89fcd69fcea175ad221bdc7828665542429b653?placeholderIfAbsent=true'
    },
    {
      name: 'Строганов Данила',
      role: 'Разработчик',
      image: 'https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/bf3986113f92039b6a8a311d619b143f98e41e9e?placeholderIfAbsent=true'
    },
    {
      name: 'Припоров Владислав',
      role: 'Разработчик',
      image: 'https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/cd7ff13f9df3c53242e8d7447d1238ee63a72b96?placeholderIfAbsent=true'
    }
  ];

  return (
    <div className="participants-list">
      {participants.map((participant, index) => (
        <div key={index} className="participant-item">
          <img
            src={participant.image}
            alt={participant.name}
            className="participant-avatar"
          />
          <div className="participant-info">
            <div className="participant-name">{participant.name}</div>
            <div className="participant-role">{participant.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
};