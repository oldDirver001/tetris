import './Controls.css';

export default function Controls() {
  const keys = [
    { key: '← →', desc: '左右移动' },
    { key: '↑', desc: '旋转' },
    { key: '↓', desc: '加速下落' },
    { key: '空格', desc: '直接落下' },
    { key: 'P', desc: '暂停/继续' },
  ];

  return (
    <div className="controls-panel">
      <h3>操作说明</h3>
      <div className="controls-list">
        {keys.map((item, i) => (
          <div key={i} className="control-item">
            <kbd className="key-badge">{item.key}</kbd>
            <span className="control-desc">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
