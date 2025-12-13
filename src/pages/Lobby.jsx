import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { socket, connectSocket } from "../socket"

export default function Lobby() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  if (!auth) return null

  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  /* =========================
     SOCKET SETUP
  ========================= */
  useEffect(() => {
    connectSocket()

    socket.on("roomCreated", ({ room }) => {
      setLoading(false)
      navigate(`/room/${room.code}`)
    })

    socket.on("roomError", (msg) => {
      setLoading(false)
      alert(msg)
    })

    return () => {
      socket.off("roomCreated")
      socket.off("roomError")
    }
  }, [])

  /* =========================
     ACTIONS
  ========================= */

  const createRoom = () => {
    setLoading(true)
    socket.emit("createRoom")
  }

  const playVsAI = () => {
    setLoading(true)
    socket.emit("createAiRoom")
  }

  const joinRoom = () => {
    if (!code.trim()) {
      alert("Enter room code")
      return
    }

    socket.emit("joinRoom", { code: code.trim().toUpperCase() })
    navigate(`/room/${code.trim().toUpperCase()}`)
  }

  return (
    <div className="lobby">
      <h2>Lobby</h2>

      <div>
        <button onClick={createRoom} disabled={loading}>
          {loading ? "Creating..." : "Create Room (1v1)"}
        </button>

        <button
          onClick={playVsAI}
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
