import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Projects } from "./pages/Projects";
import { CreateProject } from "./pages/CreateProject";
import { Moderation } from "./pages/Moderation";
import { Profile } from "./pages/Profile";
import { useAuth } from "./hooks/useAuth";
import "./styles/global.css";
const App: React.FC = () => {
  const { isAuthenticated, isAdmin, refreshAuth } = useAuth();
  React.useEffect(() => {
    // Only refresh auth on initial mount when authenticated
    if (isAuthenticated) {
      refreshAuth();
    }
  }, []); // Remove isAuthenticated and refreshAuth from dependencies
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/add" element={<CreateProject />} />
        <Route path="/projects/moderation" element={<Moderation />} />
        <Route path="/users/:userId/profile/:profileId" element={<Profile />} />
        <Route path="/" element={<Navigate to="/projects" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
