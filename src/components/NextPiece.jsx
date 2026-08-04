import { TETROMINOES } from '../utils/tetrominoes';
import './NextPiece.css';

export default function NextPiece({ piece }) {
  if (!piece) {
    return (
      <div className="next-piece-panel">
        <h3>下一个</h3>
        <div className="next-piece-grid" />
      </div>
    );
  }

  const shape = piece.shape;
  const rows = shape.length;
  const cols = shape[0].length;

  return (
    <div className="next-piece-panel">
      <h3>下一个</h3>
      <div className="next-piece-grid" style={{ '--rows': rows, '--cols': cols }}>
        {shape.map((row, y) => (
          <div key={y} className="next-row">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`next-cell ${cell ? 'filled' : ''}`}
                style={cell ? {
                  '--cell-color': piece.color,
                  '--cell-glow': piece.color + '40',
                } : {}}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
