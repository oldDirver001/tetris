// 俄罗斯方块 —— 核心类型定义

// 方块类型（7种标准方块）
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

// 形状矩阵：0 表示空格，1 表示有方块
export type Shape = number[][];

// 游戏面板的一个格子：null 为空，'ghost' 为幽灵投影，其余为方块颜色字符串
export type Cell = string | null;

// 游戏面板（二维数组：高 × 宽）
export type Board = Cell[][];

// 单个方块的数据定义（颜色 + 所有旋转状态）
export interface TetrominoData {
  color: string;
  glow: string;
  shapes: Shape[];
}

// 当前活动方块实例
export interface Tetromino {
  type: TetrominoType;
  color: string;
  glow: string;
  rotation: number;
  shape: Shape;
  x: number;
  y: number;
}
