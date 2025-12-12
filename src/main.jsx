import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Lobby from './pages/Lobby'
import Room from './pages/Room'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider, AuthContext } from './contexts/AuthContext'
import './styles.css'

function Protected({ children }) {
  const { user } = React.useContext(AuthContext)
  if (!user) return <Navigate to="/login" />
  return children
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Protected><Lobby /></Protected>} />
            <Route path="room/:code" element={<Protected><Room /></Protected>} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
