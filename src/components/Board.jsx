import React from 'react'

export default function Board({ board, onClick }) {
  return (
    <div className="board">
      {board.map((c, i) => (
        <div key={i} className="cell" onClick={() => onClick(i)}>
          {c}
        </div>
      ))}
    </div>
  )
}
