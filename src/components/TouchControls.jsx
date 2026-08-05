import { useRef, useCallback } from 'react';
import './TouchControls.css';

// 移动端触屏控制：仅圆形十字方向键
export default function TouchControls({ onMove, onRotate, onSoftDrop }) {
  const repeatTimer = useRef(null);
  const delayTimer = useRef(null);

  const startRepeat = useCallback((action) => {
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

  const handleDown = (e, action, repeat = false) => {
    e.preventDefault();
    if (repeat) {
      startRepeat(action);
    } else {
      action();
    }
  };

  const handleUp = (e) => {
    if (e) e.preventDefault();
    stopRepeat();
  };

  const bind = (action, repeat = false) => ({
    onPointerDown: (e) => handleDown(e, action, repeat),
    onPointerUp: handleUp,
    onPointerLeave: handleUp,
    onPointerCancel: handleUp,
    onContextMenu: (e) => e.preventDefault(),
  });

  return (
    <div className="touch-controls">
      <div className="dpad">
        <button
          className="dpad-btn dpad-up"
          {...bind(onRotate, false)}
          aria-label="旋转"
        >
          ▲
        </button>
        <button
          className="dpad-btn dpad-left"
          {...bind(() => onMove(-1), true)}
          aria-label="左移"
        >
          ◀
        </button>
        <div className="dpad-center" aria-hidden="true" />
        <button
          className="dpad-btn dpad-right"
          {...bind(() => onMove(1), true)}
          aria-label="右移"
        >
          ▶
        </button>
        <button
          className="dpad-btn dpad-down"
          {...bind(onSoftDrop, true)}
          aria-label="软降"
        >
          ▼
        </button>
      </div>
    </div>
  );
}
