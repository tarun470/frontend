import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import "./Auth.css"

export default function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

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
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        { username, password }
      )

      if (res.data?.error) {
        alert(res.data.error)
        return
      }

      alert("Registration successful! Please login.")
      navigate("/login")
    } catch (err) {
      console.error(err)
      alert("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join and start playing</p>

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
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  )
}
