# 俄罗斯方块 (Tetris)

使用 React + Vite 构建的网页版俄罗斯方块单机游戏。

## 功能特性

- 7种经典方块（I, O, T, S, Z, J, L），每种带独特颜色和旋转状态
- 幽灵方块投影 — 显示当前方块的落点位置
- 墙踢系统 — 旋转时自动尝试偏移，避免卡墙
- 行消除动画
- 计分系统 — 单行/双行/三行/四行(Tetris)分别得分不同
- 等级系统 — 每消除10行升一级，下落速度递增
- 下一块预览
- 暂停/恢复
- 游戏结束检测与重新开始

## 操作指南

| 按键 | 功能 |
|------|------|
| ← → | 左右移动 |
| ↑ | 旋转方块 |
| ↓ | 加速下落 |
| 空格 | 直接落下（硬降） |
| P | 暂停/继续 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 技术栈

- React 18
- Vite 5
- 纯 CSS（无 UI 框架依赖）

## 项目结构

```
tetris/
├── src/
│   ├── components/
│   │   ├── Board.jsx / .css       # 游戏主面板
│   │   ├── NextPiece.jsx / .css   # 下一块预览
│   │   ├── ScorePanel.jsx / .css  # 分数面板
│   │   └── Controls.jsx / .css    # 操作说明
│   ├── hooks/
│   │   └── useTetris.js           # 核心游戏逻辑
│   ├── utils/
│   │   ├── constants.js           # 游戏常量
│   │   └── tetrominoes.js         # 方块定义
│   ├── App.jsx / .css             # 主应用组件
│   ├── main.jsx                   # 入口文件
│   └── index.css                  # 全局样式
├── index.html
├── vite.config.js
└── package.json
```
