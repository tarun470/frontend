import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import App from "./App"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Lobby from "./pages/Lobby"
import Room from "./pages/Room"
import { AuthProvider, AuthContext } from "./contexts/AuthContext"
import "./styles.css"

function ProtectedRoute({ children }) {
  const { user } = React.useContext(AuthContext)
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = React.useContext(AuthContext)
  return user ? <Navigate to="/" replace /> : children
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 🔐 Public */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* 🔐 Protected */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          >
            <Route index element={<Lobby />} />
            <Route path="room/:code" element={<Room />} />
          </Route>

          {/* ❌ Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
