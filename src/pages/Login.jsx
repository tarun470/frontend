import { useState, useContext, useEffect } from "react"
import axios from "axios"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import "./Auth.css"

export default function Login() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  // 🔴 Guard against undefined context
  if (!auth) return null

  const { user, login } = auth

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ If already logged in → go to home
  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  async function submit() {
    if (!username || !password) {
      alert("Username and password required")
      return
    }

    if (!import.meta.env.VITE_BACKEND_URL) {
      alert("Backend URL not configured")
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        { username, password }
      )

      if (res.data?.error) {
        alert(res.data.error)
        return
      }

      localStorage.setItem("token", res.data.token)
      login(res.data.user)

      navigate("/")
    } catch (err) {
      console.error(err)
      alert("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to continue</p>

        <input
          className="auth-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <input
          className="auth-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          className="auth-btn"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  )
}
