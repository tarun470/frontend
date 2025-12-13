import React, { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { socket, connectSocket } from "../socket"

export default function Lobby() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const hasNavigated = useRef(false)

  if (!auth) return null

  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  /* =========================
     SOCKET SETUP
  ========================= */
  useEffect(() => {
    connectSocket()

    const safeNavigate = (roomCode) => {
      if (hasNavigated.current) return
      hasNavigated.current = true
      setLoading(false)
      navigate(`/room/${roomCode}`)
    }

    const onRoomCreated = ({ room }) => {
      safeNavigate(room.code)
    }

    const onJoined = ({ room }) => {
      safeNavigate(room.code)
    }

    const onRoomError = (msg) => {
      setLoading(false)
      hasNavigated.current = false
      alert(msg)
    }

    socket.on("roomCreated", onRoomCreated)
    socket.on("playerJoined", onJoined)
    socket.on("joinedAsSpectator", onJoined)
    socket.on("roomError", onRoomError)

    return () => {
      socket.off("roomCreated", onRoomCreated)
      socket.off("playerJoined", onJoined)
      socket.off("joinedAsSpectator", onJoined)
      socket.off("roomError", onRoomError)
      hasNavigated.current = false
    }
  }, [navigate])

  /* =========================
     ACTIONS
  ========================= */

  const createRoom = () => {
    if (loading) return
    setLoading(true)
    hasNavigated.current = false
    socket.emit("createRoom")
  }

  const playVsAI = () => {
    if (loading) return
    setLoading(true)
    hasNavigated.current = false
    socket.emit("createAiRoom")
  }

  const joinRoom = () => {
    if (!code.trim()) {
      alert("Enter room code")
      return
    }
    if (loading) return

    setLoading(true)
    hasNavigated.current = false
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
          {loading ? "Starting..." : "Play vs AI"}
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Room Code"
          disabled={loading}
        />
        <button onClick={joinRoom} disabled={loading}>
          Join Room
        </button>
      </div>
    </div>
  )
}

