import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Game from "./Game"
import { socket } from "../socket"

export default function Room() {
  const { code } = useParams()
  const [room, setRoom] = useState(null)
  const [symbol, setSymbol] = useState(null)
  const [loading, setLoading] = useState(true)

  const resolveSymbol = (roomData) => {
    if (!roomData || !socket.id) return
    const player = roomData.players?.find(
      (p) => p.socketId === socket.id
    )
    if (player) {
      setSymbol(player.symbol)
    } else {
      setSymbol(null) // spectator
    }
  }

  useEffect(() => {
    if (!import.meta.env.VITE_BACKEND_URL) {
      console.error("VITE_BACKEND_URL not defined")
      setLoading(false)
      return
    }

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

    /* ===== SOCKET EVENTS ===== */

    const onRoomCreated = (d) => {
      if (d.code === code) {
        setRoom(d.room)
        resolveSymbol(d.room)
      }
    }

    const onPlayerJoined = (d) => {
      if (d.room?.code === code) {
        setRoom(d.room)
        resolveSymbol(d.room)
      }
    }

    const onSpectator = (d) => {
      if (d.room?.code === code) {
        setRoom(d.room)
        resolveSymbol(d.room)
      }
    }

    const onPlayerLeft = (d) => {
      if (d.room?.code === code) {
        setRoom(d.room)
        resolveSymbol(d.room)
      }
    }

    socket.on("roomCreated", onRoomCreated)
    socket.on("playerJoined", onPlayerJoined)
    socket.on("joinedAsSpectator", onSpectator)
    socket.on("playerLeft", onPlayerLeft)

    return () => {
      socket.off("roomCreated", onRoomCreated)
      socket.off("playerJoined", onPlayerJoined)
      socket.off("joinedAsSpectator", onSpectator)
      socket.off("playerLeft", onPlayerLeft)
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
