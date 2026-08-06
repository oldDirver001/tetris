import './ScorePanel.css';

interface ScorePanelProps {
  score: number;
  lines: number;
  level: number;
}

export default function ScorePanel({ score, lines, level }: ScorePanelProps) {
  return (
    <div className="score-panel">
      <div className="score-item">
        <span className="score-label">分数</span>
        <span className="score-value">{score.toLocaleString()}</span>
      </div>
      <div className="score-item">
        <span className="score-label">行数</span>
        <span className="score-value">{lines}</span>
      </div>
      <div className="score-item">
        <span className="score-label">等级</span>
        <span className="score-value highlight">{level}</span>
      </div>
    </div>
  );
}
