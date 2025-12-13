import React, { useEffect, useState } from "react"
import Board from "../components/Board"
import { socket } from "../socket"

export default function Game({ code, initialSymbol }) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [symbol, setSymbol] = useState(null)
  const [turn, setTurn] = useState("X")
  const [winner, setWinner] = useState(null)
  const [votes, setVotes] = useState(0)

  // 🔄 Sync initialSymbol safely
  useEffect(() => {
    if (initialSymbol) setSymbol(initialSymbol)
  }, [initialSymbol])

  useEffect(() => {
    // 🔌 Define handlers explicitly (important!)
    const onMoveMade = (data) => {
      setBoard(data.board)
      setTurn(data.turn)
    }

    const onGameOver = (data) => {
      setBoard(data.board)
      setWinner(data.winner)
    }

    const onRematchStarted = (data) => {
      setBoard(data.room.board)
      setWinner(null)
      setTurn("X")
      setVotes(0)
    }

    const onRematchVote = (data) => {
      setVotes(data.votes)
    }

    const onRoomCreated = (d) => {
      if (d.code === code) setSymbol(d.symbol)
    }

    const onSpectator = (d) => {
      if (d.room?.code === code) {
        setBoard(d.room.board)
        setWinner(d.room.winner || null)
        setTurn(d.room.turn || "X")
      }
    }

    socket.on("moveMade", onMoveMade)
    socket.on("gameOver", onGameOver)
    socket.on("rematchStarted", onRematchStarted)
    socket.on("rematchVote", onRematchVote)
    socket.on("roomCreated", onRoomCreated)
    socket.on("joinedAsSpectator", onSpectator)

    return () => {
      socket.off("moveMade", onMoveMade)
      socket.off("gameOver", onGameOver)
      socket.off("rematchStarted", onRematchStarted)
      socket.off("rematchVote", onRematchVote)
      socket.off("roomCreated", onRoomCreated)
      socket.off("joinedAsSpectator", onSpectator)
    }
  }, [code])

  const clickCell = (i) => {
    if (board[i] || winner) return
    if (!symbol) {
      alert("Waiting for symbol assignment…")
      return
    }
    if (turn !== symbol) {
      alert("Not your turn")
      return
    }
    socket.emit("makeMove", { code, index: i, symbol })
  }

  const rematch = () => socket.emit("voteRematch", { code })

  return (
    <div>
      <Board board={board} onClick={clickCell} />

      <div className="game-info">
        {winner ? (
          <div className="winner">Winner: {winner}</div>
        ) : (
          <div>Turn: {turn}</div>
        )}

        <div>Rematch votes: {votes}</div>

        <button onClick={rematch}>Rematch</button>
      </div>
    </div>
  )
}
