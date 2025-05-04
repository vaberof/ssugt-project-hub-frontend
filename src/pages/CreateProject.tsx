import React from 'react';
import { Header } from '../components/Header';
import { ProjectForm } from '../components/ProjectForm';
import '../styles/createProject.css';

export const CreateProject: React.FC = () => {
  return (
    <div className="create-project">
      <Header isAuthenticated={true} />
      <div className="create-project-container">
        <div className="create-project-content">
          <div className="create-project-card">
            <ProjectForm />
          </div>
        </div>
      </div>
    </div>
  );
};