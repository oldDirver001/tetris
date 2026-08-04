import { useState, useCallback, useRef, useEffect } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, GAME_STATUS, INITIAL_DROP_TIME, LINES_PER_LEVEL, SCORE_TABLE, getDropTime } from '../utils/constants';
import { TETROMINOES, randomTetrominoType, createTetromino } from '../utils/tetrominoes';

// 创建空游戏面板
function createEmptyBoard() {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

// 检查碰撞
function checkCollision(board, piece, shape, offsetX, offsetY) {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] === 0) continue;
      const newX = piece.x + x + offsetX;
      const newY = piece.y + y + offsetY;

      // 左右边界
      if (newX < 0 || newX >= BOARD_WIDTH) return true;
      // 底部边界
      if (newY >= BOARD_HEIGHT) return true;
      // 与已有方块碰撞（只在面板范围内检查）
      if (newY >= 0 && board[newY][newX] !== null) return true;
    }
  }
  return false;
}

// 将方块固定到面板上
function mergePiece(board, piece) {
  const newBoard = board.map(row => [...row]);
  const shape = piece.shape;
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] === 1) {
        const boardY = piece.y + y;
        const boardX = piece.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }
  return newBoard;
}

// 消除已满的行，返回新面板和消除的行数
function clearLines(board) {
  const newBoard = board.map(row => [...row]);
  let linesCleared = 0;

  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (newBoard[y].every(cell => cell !== null)) {
      newBoard.splice(y, 1);
      newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
      linesCleared++;
      y++; // 重新检查同一行
    }
  }

  return { board: newBoard, linesCleared };
}

// 计算幽灵方块（投影）的Y位置
function getGhostY(board, piece) {
  let ghostY = 0;
  while (!checkCollision(board, piece, piece.shape, 0, ghostY + 1)) {
    ghostY++;
  }
  return piece.y + ghostY;
}

export function useTetris() {
  const [board, setBoard] = useState(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState(GAME_STATUS.READY);
  const [dropTime, setDropTime] = useState(INITIAL_DROP_TIME);
  const [clearingRows, setClearingRows] = useState([]);

  const lastTimeRef = useRef(0);
  const rafRef = useRef(null);

  // 用 ref 保存最新状态，避免游戏循环因依赖变化而频繁重启
  const stateRef = useRef({});

  // 生成新方块
  const spawnPiece = useCallback((type) => {
    return createTetromino(type || randomTetrominoType());
  }, []);

  // 使用 ref 保存 nextPiece 以在回调中访问最新值
  const nextPieceRef = useRef(null);

  // 方块落地后的处理
  const lockPiece = useCallback((piece, currentBoard) => {
    const merged = mergePiece(currentBoard, piece);

    // 找出满行
    const fullRows = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (merged[y].every(cell => cell !== null)) {
        fullRows.push(y);
      }
    }

    if (fullRows.length > 0) {
      // 先显示消除动画，然后实际消除
      setClearingRows(fullRows);
      setBoard(merged);

      setTimeout(() => {
        const { board: clearedBoard, linesCleared } = clearLines(merged);
        setBoard(clearedBoard);
        setClearingRows([]);

        setLines(prevLines => {
          const newLines = prevLines + linesCleared;
          const newLevel = Math.floor(newLines / LINES_PER_LEVEL) + 1;
          setLevel(newLevel);
          setDropTime(getDropTime(newLevel));
          return newLines;
        });

        const currentLevel = stateRef.current.level || 1;
        setScore(prev => prev + (SCORE_TABLE[fullRows.length] || 0) * currentLevel);

        // 生成下一个方块
        const next = nextPieceRef.current;
        const newNext = spawnPiece();
        setNextPiece(newNext);

        // 检查游戏结束
        if (checkCollision(clearedBoard, next, next.shape, 0, 0)) {
          setStatus(GAME_STATUS.GAMEOVER);
        } else {
          setCurrentPiece(next);
        }
      }, 300);
    } else {
      // 没有行被消除，直接生成新方块
      const next = nextPieceRef.current;
      const newNext = spawnPiece();
      setNextPiece(newNext);

      if (checkCollision(merged, next, next.shape, 0, 0)) {
        setStatus(GAME_STATUS.GAMEOVER);
        setBoard(merged);
      } else {
        setCurrentPiece(next);
        setBoard(merged);
      }
    }
  }, [spawnPiece]);

  // 下落一格
  const drop = useCallback(() => {
    const { status: st, currentPiece: cp, board: bd } = stateRef.current;
    if (st !== GAME_STATUS.PLAYING || !cp) return;

    if (!checkCollision(bd, cp, cp.shape, 0, 1)) {
      setCurrentPiece(prev => ({ ...prev, y: prev.y + 1 }));
    } else {
      lockPiece(cp, bd);
    }
  }, [lockPiece]);

  // 硬降（直接落到底部）
  const hardDrop = useCallback(() => {
    const { status: st, currentPiece: cp, board: bd } = stateRef.current;
    if (st !== GAME_STATUS.PLAYING || !cp) return;

    let dropDistance = 0;
    while (!checkCollision(bd, cp, cp.shape, 0, dropDistance + 1)) {
      dropDistance++;
    }

    const newPiece = { ...cp, y: cp.y + dropDistance };
    setScore(prev => prev + dropDistance * 2);
    lockPiece(newPiece, bd);
  }, [lockPiece]);

  // 左右移动
  const move = useCallback((dir) => {
    const { status: st, currentPiece: cp, board: bd } = stateRef.current;
    if (st !== GAME_STATUS.PLAYING || !cp) return;

    if (!checkCollision(bd, cp, cp.shape, dir, 0)) {
      setCurrentPiece(prev => ({ ...prev, x: prev.x + dir }));
    }
  }, []);

  // 旋转
  const rotate = useCallback(() => {
    const { status: st, currentPiece: cp, board: bd } = stateRef.current;
    if (st !== GAME_STATUS.PLAYING || !cp) return;

    const data = TETROMINOES[cp.type];
    const newRotation = (cp.rotation + 1) % data.shapes.length;
    const newShape = data.shapes[newRotation];

    // 墙踢：尝试在当前位置或偏移位置旋转
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      if (!checkCollision(bd, cp, newShape, kick, 0)) {
        setCurrentPiece(prev => ({
          ...prev,
          rotation: newRotation,
          shape: newShape,
          x: prev.x + kick,
        }));
        return;
      }
    }
  }, []);

  // 同步状态到 ref
  useEffect(() => {
    stateRef.current = { status, currentPiece, board, level };
  });

  useEffect(() => {
    nextPieceRef.current = nextPiece;
  }, [nextPiece]);

  // 开始游戏
  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLines(0);
    setLevel(1);
    setDropTime(INITIAL_DROP_TIME);
    setClearingRows([]);
    const first = spawnPiece();
    const next = spawnPiece();
    setCurrentPiece(first);
    setNextPiece(next);
    setStatus(GAME_STATUS.PLAYING);
  }, [spawnPiece]);

  // 暂停/恢复
  const togglePause = useCallback(() => {
    setStatus(prev => {
      if (prev === GAME_STATUS.PLAYING) return GAME_STATUS.PAUSED;
      if (prev === GAME_STATUS.PAUSED) return GAME_STATUS.PLAYING;
      return prev;
    });
  }, []);

  // 自动下落的游戏循环 — 只依赖 status 和 dropTime
  // 使用 ref 调用最新的 drop，避免因 piece/board 变化而重置计时器
  const dropRef = useRef(drop);
  useEffect(() => {
    dropRef.current = drop;
  });

  useEffect(() => {
    if (status !== GAME_STATUS.PLAYING) return;

    const loop = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;

      if (delta > dropTime) {
        dropRef.current();
        lastTimeRef.current = time;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [status, dropTime]);

  // 计算幽灵方块位置
  const ghostY = currentPiece ? getGhostY(board, currentPiece) : 0;

  return {
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
  };
}
