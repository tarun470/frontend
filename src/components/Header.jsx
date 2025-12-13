import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function Header() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  // 🔴 Prevent crash during initial render
  if (!auth) return null

  const { user, logout } = auth

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div>
        <Link
          to="/"
          style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}
        >
          TicTacToe
        </Link>
      </div>

      <div>
        {user ? (
          <>
            <span style={{ color: '#fff', marginRight: 12 }}>
              {user?.username || 'Player'}
            </span>
            <button
              onClick={handleLogout}
              style={{ background: '#c53030' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{ marginLeft: 8 }}>
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
