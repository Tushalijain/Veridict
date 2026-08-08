import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Problems from "../pages/Problems";
import ProblemDetails from "../pages/ProblemDetails";
import SubmissionHistory from "../pages/SubmissionHistory";
import ProtectedRoute from "../components/ProtectedRoute";
import Leaderboard from "../pages/Leaderboard";
import Profile from "../pages/Profile";
import Contests from "../pages/Contests";
import ContestArena from "../pages/ContestArena";
import NotFound from "../pages/NotFound";
import Navbar from "../components/Navbar";

function AppContent() {
  const location = useLocation();

  const hideNavbar =
  location.pathname === "/" ||
  location.pathname === "/login" ||
  location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <Problems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/problems/:id"
          element={
            <ProtectedRoute>
              <ProblemDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submissions"
          element={
            <ProtectedRoute>
              <SubmissionHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route path="/profile" element={<Profile />} />

        <Route path="/contests" element={<Contests />} />

        <Route
          path="/contest/:id"
          element={<ContestArena />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default AppRoutes;