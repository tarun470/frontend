import React, { useContext, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { socket } from "../socket"

export default function Lobby() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  // 🔴 Guard context
  if (!auth) return null

  const { user } = auth
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const createRoom = async () => {
    if (!import.meta.env.VITE_BACKEND_URL) {
      alert("Backend URL not configured")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      alert("Not authenticated")
      return
    }

    try {
      setLoading(true)

      // create room via API
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/room/create`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // notify socket
      socket.emit("createRoom", { token })

      const onCreated = (d) => {
        socket.off("roomCreated", onCreated)
        navigate(`/room/${d.code}`)
      }

      socket.on("roomCreated", onCreated)
    } catch (err) {
      console.error(err)
      alert("Could not create room")
    } finally {
      setLoading(false)
    }
  }

  const joinRoom = () => {
    if (!code) {
      alert("Enter room code")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      alert("Not authenticated")
      return
    }

    const onJoin = () => {
      cleanup()
      navigate(`/room/${code}`)
    }

    const onError = (msg) => {
      cleanup()
      alert(msg)
    }

    const cleanup = () => {
      socket.off("playerJoined", onJoin)
      socket.off("joinedAsSpectator", onJoin)
      socket.off("error", onError)
    }

    socket.on("playerJoined", onJoin)
    socket.on("joinedAsSpectator", onJoin)
    socket.on("error", onError)

    socket.emit("joinRoom", { code, token })
  }

  const joinAI = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Not authenticated")
      return
    }

    socket.emit("createRoom", { token })

    const onCreated = (d) => {
      socket.off("roomCreated", onCreated)
      navigate(`/room/${d.code}`)
    }

    socket.on("roomCreated", onCreated)
  }

  return (
    <div className="lobby">
      <h2>Lobby</h2>

      <div>
        <button onClick={createRoom} disabled={loading}>
          {loading ? "Creating..." : "Create Room (1v1)"}
        </button>

        <button
          onClick={joinAI}
          style={{ marginLeft: 8 }}
          disabled={loading}
        >
          Play vs AI
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Room Code"
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  )
}
