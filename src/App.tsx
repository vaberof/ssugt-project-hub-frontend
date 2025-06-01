import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Projects } from "./pages/Projects";
import { CreateProject } from "./pages/CreateProject";
import ProtectedRouteAdmin from "./components/ProtectedRouteAdmin";
import { Moderation } from "./pages/Moderation";
import { Profile } from "./pages/Profile";
import "./styles/global.css";
import { AuthProvider } from "./context/AuthContext"; // Импортируй провайдер
import Layout from "./components/Layout";
import { ProjectView } from "./pages/ProjectView";
import { ProjectModerationView } from "./pages/ProjectModerationView";

const App: React.FC = () => {
  return (
    <Router>
             <AuthProvider>
        <Layout>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectView />} />
        <Route path="/projects/add" element={<CreateProject />} />
        <Route
          path="/moderation/projects"
          element={
          <ProtectedRouteAdmin>
            <Moderation />
            </ProtectedRouteAdmin>
            }
        />
        <Route
          path="/moderation/projects/:id"
          element={
          <ProtectedRouteAdmin>
            <ProjectModerationView  />
            </ProtectedRouteAdmin>
            }
        />
        
        <Route path="/users/:userId" element={<Profile />} />
        <Route path="/" element={<Navigate to="/projects" replace />} />
      </Routes>
       </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;
