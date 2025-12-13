import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Game from "./Game"
import { socket, connectSocket } from "../socket"

export default function Room() {
  const { code } = useParams()
  const [room, setRoom] = useState(null)
  const [symbol, setSymbol] = useState(null)
  const [loading, setLoading] = useState(true)

  /* =========================
     RESOLVE PLAYER SYMBOL
  ========================= */
  const resolveSymbol = (roomData) => {
    if (!roomData || !socket.id) return

    const player = roomData.players?.find(
      (p) => p.socketId === socket.id
    )

    setSymbol(player ? player.symbol : null)
  }

  useEffect(() => {
    if (!import.meta.env.VITE_BACKEND_URL) {
      console.error("VITE_BACKEND_URL not defined")
      return
    }

    connectSocket()

    /* =========================
       SOCKET CONNECT → JOIN ROOM
    ========================= */
    const onConnect = () => {
      socket.emit("joinRoom", { code })
    }

    socket.on("connect", onConnect)

    /* =========================
       FETCH ROOM (HTTP fallback)
    ========================= */
    const fetchRoom = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/room/${code}`
        )
        setRoom(res.data.room)
        resolveSymbol(res.data.room)
      } catch (err) {
        console.error(err)
        setRoom(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()

    /* =========================
       SOCKET EVENTS
    ========================= */
    const updateRoom = (roomData) => {
      if (!roomData || roomData.code !== code) return
      setRoom(roomData)
      resolveSymbol(roomData)
    }

    socket.on("playerJoined", (d) => updateRoom(d.room))
    socket.on("joinedAsSpectator", (d) => updateRoom(d.room))
    socket.on("playerLeft", (d) => updateRoom(d.room))
    socket.on("rematchStarted", (d) => updateRoom(d.room))

    socket.on("moveMade", ({ board, turn }) => {
      setRoom((prev) =>
        prev ? { ...prev, board, turn } : prev
      )
    })

    socket.on("gameOver", ({ board }) => {
      setRoom((prev) =>
        prev ? { ...prev, board, finished: true } : prev
      )
    })

    return () => {
      socket.off("connect", onConnect)
      socket.off("playerJoined")
      socket.off("joinedAsSpectator")
      socket.off("playerLeft")
      socket.off("moveMade")
      socket.off("gameOver")
      socket.off("rematchStarted")
    }
  }, [code])

  if (loading) return <div>Loading room...</div>
  if (!room) return <div>Room not found</div>

  return (
    <div>
      <h2>Room {code}</h2>
      <Game code={code} initialSymbol={symbol} />
    </div>
  )
}
