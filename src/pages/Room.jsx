import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Game from './Game'
import { socket } from '../socket'

export default function Room() {
  const { code } = useParams()
  const [room, setRoom] = useState(null)
  const [symbol, setSymbol] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/room/${code}`)
      .then(res => setRoom(res.data.room))
      .catch(() => setRoom(null))

    // when socket events provide symbol/room data:
    socket.on('roomCreated', d => { if (d.code === code) { setSymbol(d.symbol); setRoom(d.room) } })
    socket.on('playerJoined', d => { if (d.room?.code === code) setRoom(d.room) })
    socket.on('joinedAsSpectator', d => { if (d.room?.code === code) setRoom(d.room) })
    socket.on('playerLeft', d => { if (d.room?.code === code) setRoom(d.room) })

    return () => {
      socket.off('roomCreated'); socket.off('playerJoined'); socket.off('joinedAsSpectator'); socket.off('playerLeft')
    }
  }, [code])

  if (!room) return <div>Loading room...</div>
  return (
    <div>
      <h2>Room {code}</h2>
      <Game code={code} initialSymbol={symbol} />
    </div>
  )
}
