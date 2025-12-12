import { useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function submit() {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, { username, password })
      if (res.data.error) { alert(res.data.error); return }
      localStorage.setItem('token', res.data.token)
      login(res.data.user)
      navigate('/')
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Login</button>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  )
}
