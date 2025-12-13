import React, { useEffect, useState } from "react"
import Board from "../components/Board"
import { socket } from "../socket"

export default function Game({ code, initialSymbol }) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [symbol, setSymbol] = useState(null)
  const [turn, setTurn] = useState("X")
  const [winner, setWinner] = useState(null)
  const [votes, setVotes] = useState(0)
  const [requiredVotes, setRequiredVotes] = useState(1)

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
      setTurn(room.turn)
      setVotes(0)
      setRequiredVotes(room.isAI ? 1 : 2)
    }

    const onRematchVote = ({ votes, required }) => {
      setVotes(votes)
      setRequiredVotes(required)
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

        {/* ✅ REMATCH MESSAGE */}
        {winner && (
          <div style={{ marginTop: 8 }}>
            {votes === 0 && "Click Rematch to play again"}
            {votes > 0 && votes < requiredVotes &&
              "Waiting for other player to accept rematch..."}
          </div>
        )}

        <button onClick={rematch} disabled={!winner}>
          Rematch
        </button>
      </div>
    </div>
  )
}

