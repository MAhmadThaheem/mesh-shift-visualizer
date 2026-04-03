import React from 'react';
import { Play, SkipForward, RotateCcw } from 'lucide-react';

const ControlPanel = ({ p, setP, q, setQ, stage, handleNext, handleReset, isAnimating }) => {
  const pOptions = [4, 9, 16, 25, 36, 49, 64];

  const handlePChange = (e) => {
    const newP = parseInt(e.target.value);
    setP(newP);
    if (q >= newP) {
      setQ(newP - 1);
    }
  };

  const handleQChange = (e) => {
    let newQ = parseInt(e.target.value) || 1;
    if (newQ >= p) newQ = p - 1;
    if (newQ < 1) newQ = 1;
    setQ(newQ);
  };

  return (
    <div className="glass-panel">
      <div className="glass-panel-header">
        <Play size={20} className="text-glow" />
        Configuration Control
      </div>
      
      <div className="input-group">
        <label htmlFor="p-select">Nodes (p) - Perfect Square</label>
        <select 
          id="p-select"
          className="input-control" 
          value={p} 
          onChange={handlePChange}
          disabled={stage > 0 || isAnimating}
        >
          {pOptions.map(opt => (
            <option key={opt} value={opt}>{opt} ({Math.sqrt(opt)}x{Math.sqrt(opt)})</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="q-input">Shift Amount (q) [1 to {p - 1}]</label>
        <input 
          id="q-input"
          type="number" 
          className="input-control" 
          min="1" 
          max={p - 1} 
          value={q} 
          onChange={handleQChange}
          disabled={stage > 0 || isAnimating}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        <button 
          className="button-primary" 
          onClick={handleNext} 
          disabled={stage >= 3 || isAnimating}
        >
          {stage === 0 ? <><Play size={18} /> Run Stage 1 (Row Shift)</> : 
           stage === 1 ? <><SkipForward size={18} /> Run Stage 2 (Compensate Shift)</> : 
           <><SkipForward size={18} /> Run Stage 3 (Base Col Shift)</>}
        </button>
        
        <button 
          className="button-secondary" 
          onClick={handleReset}
          disabled={stage === 0 && !isAnimating}
        >
          <RotateCcw size={18} /> Reset Simulation
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
