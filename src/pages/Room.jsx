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
    if (!roomData || !socket?.id) {
      setSymbol(null)
      return
    }

    const player = roomData.players?.find(
      (p) => p.socketId === socket.id
    )

    setSymbol(player ? player.symbol : null) // null = spectator
  }

  useEffect(() => {
    if (!import.meta.env.VITE_BACKEND_URL) {
      console.error("VITE_BACKEND_URL not defined")
      setLoading(false)
      return
    }

    // 🔥 ENSURE SOCKET IS CONNECTED
    connectSocket()

    /* =========================
       FETCH ROOM (HTTP)
    ========================= */
    const fetchRoom = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/room/${code}`
        )
        setRoom(res.data.room)
      } catch (err) {
        console.error(err)
        setRoom(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()

    // 🔥 JOIN ROOM VIA SOCKET (THIS WAS MISSING)
    socket.emit("joinRoom", { code })

    /* =========================
       SOCKET EVENTS
    ========================= */
    const updateRoom = (roomData) => {
      if (roomData?.code === code) {
        setRoom(roomData)
        resolveSymbol(roomData)
      }
    }

    socket.on("playerJoined", (d) => updateRoom(d.room))
    socket.on("joinedAsSpectator", (d) => updateRoom(d.room))
    socket.on("playerLeft", (d) => updateRoom(d.room))
    socket.on("moveMade", (d) => {
      setRoom((prev) =>
        prev ? { ...prev, board: d.board, turn: d.turn } : prev
      )
    })
    socket.on("gameOver", (d) => {
      setRoom((prev) =>
        prev ? { ...prev, board: d.board, finished: true } : prev
      )
    })
    socket.on("rematchStarted", (d) => updateRoom(d.room))

    // 🔑 Resolve symbol once socket connects
    socket.on("connect", () => {
      if (room) resolveSymbol(room)
    })

    return () => {
      socket.off("playerJoined")
      socket.off("joinedAsSpectator")
      socket.off("playerLeft")
      socket.off("moveMade")
      socket.off("gameOver")
      socket.off("rematchStarted")
      socket.off("connect")
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
