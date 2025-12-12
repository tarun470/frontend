import { useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function submit() {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, { username, password })
      if (res.data.error) { alert(res.data.error); return }
      localStorage.setItem('token', res.data.token)
      login(res.data.user)
      navigate('/')
    } catch (err) {
      alert('Registration failed')
    }
  }

  return (
    <div className="auth-card">
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Register</button>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  )
}
