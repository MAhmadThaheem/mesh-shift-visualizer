import React from 'react';
import { Activity, Zap } from 'lucide-react';
import { getRingSteps, getMeshSteps, calculateRowShift, calculateColShift } from '../utils/shiftLogic';

const ComplexityPanel = ({ p, q, rootP }) => {
  const ringSteps = getRingSteps(q, p);
  const meshSteps = getMeshSteps(q, rootP);
  const rowShift = calculateRowShift(q, rootP);
  const colShift = calculateColShift(q, rootP);

  const maxSteps = Math.max(ringSteps, meshSteps, 1);
  const ringPercent = (ringSteps / maxSteps) * 100;
  const meshPercent = (meshSteps / maxSteps) * 100;

  return (
    <div className="glass-panel" style={{ marginTop: '24px' }}>
      <div className="glass-panel-header">
        <Activity size={20} className="text-glow" />
        Real-Time Complexity Analysis
      </div>

      <div className="metric-row">
        <div className="metric-label">Row Shift Limit:</div>
        <div className="metric-value">
          q mod √p = <span className="metric-highlight">{rowShift}</span>
        </div>
      </div>

      <div className="metric-row">
        <div className="metric-label">Column Shift Limit:</div>
        <div className="metric-value">
          ⌊ q / √p ⌋ = <span className="metric-highlight">{colShift}</span>
        </div>
      </div>

      <div className="metric-row">
        <div className="metric-label">Total Mesh Steps:</div>
        <div className="metric-value">
          <span className="metric-highlight">{meshSteps}</span>
        </div>
      </div>

      <div className="chart-bar-container">
        <div className="glass-panel-header" style={{ fontSize: '1rem', marginTop: '12px', marginBottom: '8px' }}>
          <Zap size={16} /> Mesh vs Ring Steps
        </div>

        <div className="chart-row">
          <div className="chart-label">Ring 1D</div>
          <div className="chart-bar-bg">
            <div 
              className="chart-bar-fill ring" 
              style={{ width: `${ringPercent}%` }}
              title={`min(q, p-q) = min(${q}, ${p-q}) = ${ringSteps}`}
            />
          </div>
          <div className="chart-value">{ringSteps}</div>
        </div>

        <div className="chart-row">
          <div className="chart-label">Mesh 2D</div>
          <div className="chart-bar-bg">
            <div 
              className="chart-bar-fill mesh" 
              style={{ width: `${meshPercent}%` }}
              title={`${rowShift} + ${colShift} = ${meshSteps}`}
            />
          </div>
          <div className="chart-value">{meshSteps}</div>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <em>Formula Ring:</em> <code>min(q, p-q)</code><br/>
        <em>Formula Mesh:</em> <code>(q mod √p) + ⌊ q / √p ⌋</code>
      </div>
    </div>
  );
};

export default ComplexityPanel;
