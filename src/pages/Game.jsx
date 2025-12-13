import React, { useEffect, useState } from "react"
import Board from "../components/Board"
import { socket } from "../socket"

export default function Game({ code, initialSymbol }) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [symbol, setSymbol] = useState(null)
  const [turn, setTurn] = useState("X")
  const [winner, setWinner] = useState(null)
  const [votes, setVotes] = useState(0)

  /* =========================
     SYNC SYMBOL FROM ROOM
  ========================= */
  useEffect(() => {
    setSymbol(initialSymbol || null)
  }, [initialSymbol])

  /* =========================
     SOCKET EVENTS
  ========================= */
  useEffect(() => {
    const onMoveMade = ({ board, turn }) => {
      setBoard(board)
      setTurn(turn)
    }

    const onGameOver = ({ board, winner }) => {
      setBoard(board)
      setWinner(winner)
    }

    const onRematchStarted = ({ room }) => {
      setBoard(room.board)
      setWinner(null)
      setTurn(room.turn)   // ✅ do NOT hardcode "X"
      setVotes(0)
    }

    const onRematchVote = ({ votes }) => {
      setVotes(votes)
    }

    socket.on("moveMade", onMoveMade)
    socket.on("gameOver", onGameOver)
    socket.on("rematchStarted", onRematchStarted)
    socket.on("rematchVote", onRematchVote)

    return () => {
      socket.off("moveMade", onMoveMade)
      socket.off("gameOver", onGameOver)
      socket.off("rematchStarted", onRematchStarted)
      socket.off("rematchVote", onRematchVote)
    }
  }, [])

  /* =========================
     HANDLE CELL CLICK
  ========================= */
  const clickCell = (i) => {
    if (!symbol) return alert("You are a spectator")
    if (winner) return
    if (board[i]) return
    if (turn !== symbol) return alert("Not your turn")

    socket.emit("makeMove", { code, index: i })
  }

  const rematch = () => {
    if (!winner) return
    socket.emit("voteRematch", { code })
  }

  return (
    <div>
      <Board board={board} onClick={clickCell} />

      <div className="game-info">
        {winner ? (
          <div className="winner">
            {winner === "draw" ? "Draw!" : `Winner: ${winner}`}
          </div>
        ) : (
          <div>Turn: {turn}</div>
        )}

        <div>Rematch votes: {votes}</div>

        <button onClick={rematch} disabled={!winner}>
          Rematch
        </button>
      </div>
    </div>
  )
}
