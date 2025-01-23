import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import KanbanPage from "./pages/project/KanbanPage";
import Teams from "./pages/Teams";
import Users from "./pages/Users";
import Login from "./pages/Login";
import ProtectedRoute from "./components/middleware/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProjectDetails from "./pages/ProjectDetails";
import { TeamProvider } from "./contexts/TeamContext";
import TimelinePage from "./pages/project/TimelinePage";
import MembersPage from "./pages/project/MembersPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TeamProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<></>} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="/projects/:projectId" element={<ProjectDetails />}>
                  <Route index element={<KanbanPage />} />
                  <Route path="kanban" element={<KanbanPage />} />
                  <Route path="members" element={<MembersPage />} />
                  <Route path="timeline" element={<TimelinePage />} />
                </Route>
                <Route path="teams" element={<Teams />} />
                <Route path="users" element={<Users />} />
                <Route path="profile" element={<></>} />
              </Route>
            </Routes>
          </Router>
        </TeamProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
