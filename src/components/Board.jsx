export default function Board({
  board,
  onClick,
  disabled = false
}) {
  return (
    <div className="board">
      {board.map((c, i) => (
        <div
          key={i}
          className={`cell ${disabled || c ? "disabled" : ""}`}
          onClick={() => {
            if (!disabled && !c) {
              onClick(i)
            }
          }}
        >
          {c}
        </div>
      ))}
    </div>
  )
}

