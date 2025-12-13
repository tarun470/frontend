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

    const onRoomCreated = ({ room }) => {
      setLoading(false)
      navigate(`/room/${room.code}`)
    }

    const onPlayerJoined = ({ room }) => {
      setLoading(false)
      navigate(`/room/${room.code}`)
    }

    const onSpectator = ({ room }) => {
      setLoading(false)
      navigate(`/room/${room.code}`)
    }

    const onRoomError = (msg) => {
      setLoading(false)
      alert(msg)
    }

    socket.on("roomCreated", onRoomCreated)
    socket.on("playerJoined", onPlayerJoined)
    socket.on("joinedAsSpectator", onSpectator)
    socket.on("roomError", onRoomError)

    return () => {
      socket.off("roomCreated", onRoomCreated)
      socket.off("playerJoined", onPlayerJoined)
      socket.off("joinedAsSpectator", onSpectator)
      socket.off("roomError", onRoomError)
    }
  }, [navigate])

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

    setLoading(true)
    socket.emit("joinRoom", { code: code.trim().toUpperCase() })
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
        <button onClick={joinRoom} disabled={loading}>
          Join Room
        </button>
      </div>
    </div>
  )
}
