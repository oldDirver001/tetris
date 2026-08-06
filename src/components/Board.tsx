import type { CSSProperties } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../utils/constants';
import type { Board as BoardType, Cell, Tetromino } from '../utils/types';
import './Board.css';

interface BoardProps {
  board: BoardType;
  currentPiece: Tetromino | null;
  ghostY: number;
  clearingRows: number[];
}

export default function Board({ board, currentPiece, ghostY, clearingRows }: BoardProps) {
  // 构建用于渲染的网格：将当前方块和幽灵方块叠加到面板上
  const displayBoard: Cell[][] = board.map((row) => [...row]);

  // 叠加幽灵方块（投影）
  if (currentPiece && ghostY !== undefined) {
    const shape = currentPiece.shape;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          const boardY = ghostY + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            if (displayBoard[boardY][boardX] === null) {
              displayBoard[boardY][boardX] = 'ghost';
            }
          }
        }
      }
    }
  }

  // 叠加当前方块
  if (currentPiece) {
    const shape = currentPiece.shape;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            displayBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }
  }

  return (
    <div className="board-container">
      <div className="game-board">
        {displayBoard.map((row, y) => (
          <div key={y} className={`board-row ${clearingRows.includes(y) ? 'clearing' : ''}`}>
            {row.map((cell, x) => (
              <div
                key={x}
                className={`cell ${cell ? 'filled' : ''}`}
                style={
                  cell && cell !== 'ghost'
                    ? ({ '--cell-color': cell, '--cell-glow': cell + '40' } as CSSProperties)
                    : {}
                }
                data-type={cell === 'ghost' ? 'ghost' : ''}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
