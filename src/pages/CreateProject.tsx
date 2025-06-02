import React from 'react';
import { ProjectForm } from '../components/ProjectForm';
import '../styles/createProject.css';

export const CreateProject: React.FC = () => {
  return (
    <div className="create-project">
      <div className="create-project-container">
        <div className="create-project-content">
            <ProjectForm />
        </div>
      </div>
    </div>
  );
};