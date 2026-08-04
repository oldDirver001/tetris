import { useEffect } from 'react';
import Board from './components/Board';
import NextPiece from './components/NextPiece';
import ScorePanel from './components/ScorePanel';
import Controls from './components/Controls';
import { useTetris } from './hooks/useTetris';
import { GAME_STATUS } from './utils/constants';
import './App.css';

export default function App() {
  const {
    board,
    currentPiece,
    nextPiece,
    ghostY,
    score,
    lines,
    level,
    status,
    clearingRows,
    startGame,
    togglePause,
    move,
    rotate,
    drop,
    hardDrop,
  } = useTetris();

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 空格键防止页面滚动
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.repeat) return;

      switch (e.code) {
        case 'ArrowLeft':
          move(-1);
          break;
        case 'ArrowRight':
          move(1);
          break;
        case 'ArrowDown':
          drop();
          break;
        case 'ArrowUp':
          rotate();
          break;
        case 'Space':
          if (status === GAME_STATUS.PLAYING) {
            hardDrop();
          }
          break;
        case 'KeyP':
          if (status === GAME_STATUS.PLAYING || status === GAME_STATUS.PAUSED) {
            togglePause();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, rotate, drop, hardDrop, togglePause, status]);

  const handleStartOrRestart = () => {
    startGame();
  };

  return (
    <div className="app">
      <div className="game-wrapper">
        <h1 className="game-title">TETRIS</h1>
        <div className="game-layout">
          {/* 左侧信息栏 */}
          <div className="side-panel left-panel">
            <ScorePanel score={score} lines={lines} level={level} />
            <Controls />
          </div>

          {/* 游戏主区域 */}
          <div className="board-wrapper">
            <Board
              board={board}
              currentPiece={currentPiece}
              ghostY={ghostY}
              clearingRows={clearingRows}
            />
            {/* 遮罩层 */}
            {status !== GAME_STATUS.PLAYING && (
              <div className="overlay">
                <div className="overlay-content">
                  {status === GAME_STATUS.READY && (
                    <>
                      <h2>俄罗斯方块</h2>
                      <p>准备好挑战了吗？</p>
                      <button className="btn-primary" onClick={handleStartOrRestart}>
                        开始游戏
                      </button>
                    </>
                  )}
                  {status === GAME_STATUS.PAUSED && (
                    <>
                      <h2>已暂停</h2>
                      <button className="btn-primary" onClick={togglePause}>
                        继续游戏
                      </button>
                    </>
                  )}
                  {status === GAME_STATUS.GAMEOVER && (
                    <>
                      <h2 className="gameover-title">游戏结束</h2>
                      <p className="final-score">最终得分: {score.toLocaleString()}</p>
                      <p className="final-stats">消除 {lines} 行 · 等级 {level}</p>
                      <button className="btn-primary" onClick={handleStartOrRestart}>
                        再来一局
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 右侧信息栏 */}
          <div className="side-panel right-panel">
            <NextPiece piece={nextPiece} />
          </div>
        </div>
      </div>
    </div>
  );
}
