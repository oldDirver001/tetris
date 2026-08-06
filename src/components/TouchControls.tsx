import { useRef, useCallback } from 'react';
import type { PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent } from 'react';
import './TouchControls.css';

// 移动端触屏控制：仅圆形十字方向键
interface TouchControlsProps {
  onMove: (dir: number) => void;
  onRotate: () => void;
  onSoftDrop: () => void;
}

export default function TouchControls({ onMove, onRotate, onSoftDrop }: TouchControlsProps) {
  const repeatTimer = useRef<number | null>(null);
  const delayTimer = useRef<number | null>(null);

  const startRepeat = useCallback((action: () => void) => {
    action();
    delayTimer.current = setTimeout(() => {
      repeatTimer.current = setInterval(action, 70);
    }, 180);
  }, []);

  const stopRepeat = useCallback(() => {
    if (repeatTimer.current) clearInterval(repeatTimer.current);
    if (delayTimer.current) clearTimeout(delayTimer.current);
    repeatTimer.current = null;
    delayTimer.current = null;
  }, []);

  const handleDown = (e: ReactPointerEvent<HTMLButtonElement>, action: () => void, repeat = false) => {
    e.preventDefault();
    if (repeat) {
      startRepeat(action);
    } else {
      action();
    }
  };

  const handleUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    stopRepeat();
  };

  const bind = (action: () => void, repeat = false) => ({
    onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => handleDown(e, action, repeat),
    onPointerUp: handleUp,
    onPointerLeave: handleUp,
    onPointerCancel: handleUp,
    onContextMenu: (e: ReactMouseEvent<HTMLButtonElement>) => e.preventDefault(),
  });

  return (
    <div className="touch-controls">
      <div className="dpad">
        <button className="dpad-btn dpad-up" {...bind(onRotate, false)} aria-label="旋转">
          ▲
        </button>
        <button className="dpad-btn dpad-left" {...bind(() => onMove(-1), true)} aria-label="左移">
          ◀
        </button>
        <div className="dpad-center" aria-hidden="true" />
        <button className="dpad-btn dpad-right" {...bind(() => onMove(1), true)} aria-label="右移">
          ▶
        </button>
        <button className="dpad-btn dpad-down" {...bind(onSoftDrop, true)} aria-label="软降">
          ▼
        </button>
      </div>
    </div>
  );
}
