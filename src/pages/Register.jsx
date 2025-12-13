import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

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
      navigate("/login")   // ✅ redirect to login
    } catch (err) {
      console.error(err)
      alert("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h2>Register</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={submit} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  )
}
