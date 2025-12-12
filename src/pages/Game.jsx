import React, { useEffect, useState } from 'react'
import Board from '../components/Board'
import { socket } from '../socket'

export default function Game({ code, initialSymbol }) {
  const [board, setBoard] = useState(Array(9).fill(''))
  const [symbol, setSymbol] = useState(initialSymbol || null)
  const [turn, setTurn] = useState('X')
  const [winner, setWinner] = useState(null)
  const [votes, setVotes] = useState(0)

  useEffect(() => {
    socket.on('moveMade', data => { setBoard(data.board); setTurn(data.turn) })
    socket.on('gameOver', data => { setBoard(data.board); setWinner(data.winner) })
    socket.on('rematchStarted', data => { setBoard(data.room.board); setWinner(null); setTurn('X') })
    socket.on('rematchVote', data => setVotes(data.votes))
    socket.on('roomCreated', d => { if (d.code === code) setSymbol(d.symbol) })
    socket.on('joinedAsSpectator', d => { if (d.room?.code === code) setBoard(d.room.board) })

    return () => {
      socket.off('moveMade'); socket.off('gameOver'); socket.off('rematchStarted'); socket.off('rematchVote'); socket.off('roomCreated'); socket.off('joinedAsSpectator')
    }
  }, [code])

  const clickCell = (i) => {
    if (board[i] || winner) return
    // check local turn match
    // We do not have server-side symbol here always; symbol is assigned when user created/joined room via socket
    if (!symbol) { alert('Waiting for assignment...'); return }
    if (turn !== symbol) { alert('Not your turn'); return }
    socket.emit('makeMove', { code, index: i, symbol })
  }

  const rematch = () => socket.emit('voteRematch', { code })

  return (
    <div>
      <Board board={board} onClick={clickCell} />
      <div className="game-info">
        {winner ? <div className="winner">Winner: {winner}</div> : <div>Turn: {turn}</div>}
        <div>Rematch votes: {votes}</div>
        <button onClick={rematch}>Rematch</button>
      </div>
    </div>
  )
}
