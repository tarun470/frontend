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

  useEffect(() => {
    // 🔴 Guard backend URL
    if (!import.meta.env.VITE_BACKEND_URL) {
      console.error("VITE_BACKEND_URL not defined")
      setLoading(false)
      return
    }

    const token = localStorage.getItem("token")

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/room/${code}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      .then((res) => {
        setRoom(res.data.room)
      })
      .catch((err) => {
        console.error(err)
        setRoom(null)
      })
      .finally(() => setLoading(false))

    // 🔌 socket listeners (SAFE)
    const onRoomCreated = (d) => {
      if (d.code === code) {
        setSymbol(d.symbol)
        setRoom(d.room)
      }
    }

    const onPlayerJoined = (d) => {
      if (d.room?.code === code) setRoom(d.room)
    }

    const onSpectator = (d) => {
      if (d.room?.code === code) setRoom(d.room)
    }

    const onPlayerLeft = (d) => {
      if (d.room?.code === code) setRoom(d.room)
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
