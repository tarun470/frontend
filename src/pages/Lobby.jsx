import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { socket } from '../socket'

export default function Lobby() {
  const { user } = useContext(AuthContext)
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  const createRoom = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/room/create`, { token })
      const room = res.data.room
      // call socket to create room (so socket knows your socketId/presence)
      socket.emit('createRoom', { token })
      socket.once('roomCreated', (d) => {
        navigate(`/room/${d.code}`)
      })
    } catch (err) {
      alert('Could not create room')
    }
  }

  const joinRoom = () => {
    const token = localStorage.getItem('token')
    socket.emit('joinRoom', { code, token })
    socket.once('playerJoined', () => navigate(`/room/${code}`))
    socket.once('joinedAsSpectator', () => navigate(`/room/${code}`))
    socket.once('error', (msg) => alert(msg))
  }

  const joinAI = () => {
    // create a room and then play alone (socket createRoom, but server logic already handles 1 player = AI)
    const token = localStorage.getItem('token')
    socket.emit('createRoom', { token })
    socket.once('roomCreated', (d) => navigate(`/room/${d.code}`))
  }

  return (
    <div className="lobby">
      <h2>Lobby</h2>

      <div>
        <button onClick={createRoom}>Create Room (1v1)</button>
        <button onClick={joinAI} style={{ marginLeft: 8 }}>Play vs AI</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Room Code" />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  )
}
