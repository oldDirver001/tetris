// 游戏常量

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// 方块类型
export const TETROMINO_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'] as const;

// 游戏状态
export const GAME_STATUS = {
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAMEOVER: 'gameover',
} as const;

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];

// 初始下落速度（毫秒）
export const INITIAL_DROP_TIME = 800;

// 每消除多少行升一级
export const LINES_PER_LEVEL = 10;

// 计分规则
export const SCORE_TABLE: Record<number, number> = {
  1: 100, // 单行消除
  2: 300, // 双行消除
  3: 500, // 三行消除
  4: 800, // 四行消除（Tetris）
};

// 根据等级计算下落速度
export function getDropTime(level: number): number {
  const speed = INITIAL_DROP_TIME - (level - 1) * 60;
  return Math.max(speed, 80);
}
