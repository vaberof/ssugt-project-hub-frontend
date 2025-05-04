import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Projects } from "./pages/Projects";
import { CreateProject } from "./pages/CreateProject";
import { Moderation } from "./pages/Moderation";
import "./styles/global.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/add" element={<CreateProject />} />
        <Route path="/projects/moderation" element={<Moderation />} />
        <Route path="/" element={<Projects />} />
      </Routes>
    </Router>
  );
};

export default App;