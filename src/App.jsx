import React, { useState, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import ComplexityPanel from './components/ComplexityPanel';
import MeshGrid from './components/MeshGrid';
import { initNodes, computeRowShiftState, computeBaseColShiftState, computeCompensateShiftState } from './utils/shiftLogic';
import { Layers } from 'lucide-react';

const App = () => {
  const [p, setP] = useState(16);
  const [q, setQ] = useState(5);
  const [nodes, setNodes] = useState(initNodes(16));
  const [stage, setStage] = useState(0); // 0: Init, 1: Row Shift Done, 2: Compensate Done, 3: Col Shift Done
  const [isAnimating, setIsAnimating] = useState(false);
  const rootP = Math.sqrt(p);

  useEffect(() => {
    // Reset simulation when p changes to give correct initial nodes
    setNodes(initNodes(p));
    setStage(0);
    setIsAnimating(false);
  }, [p]);

  const handleNext = () => {
    if (stage >= 3 || isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      if (stage === 0) {
        setNodes(computeRowShiftState(nodes, q, rootP));
        setStage(1);
      } else if (stage === 1) {
        setNodes(computeCompensateShiftState(nodes, rootP));
        setStage(2);
      } else if (stage === 2) {
        setNodes(computeBaseColShiftState(nodes, q, rootP));
        setStage(3);
      }
      setIsAnimating(false);
    }, 2000);
  };

  const handleReset = () => {
    setNodes(initNodes(p));
    setStage(0);
    setIsAnimating(false);
  };

  return (
    <div className="app-container">
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="gradient-text">Mesh Circular Shift Visualizer</h1>
        <p className="subtitle">Interactive parallel computing simulation on a 2D Mesh Topology</p>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <ControlPanel 
            p={p} setP={setP} 
            q={q} setQ={setQ} 
            stage={stage} 
            handleNext={handleNext} 
            handleReset={handleReset} 
            isAnimating={isAnimating}
          />
          <ComplexityPanel 
            p={p} 
            q={q} 
            rootP={rootP} 
          />
        </aside>

        <section className="visualization-area">
          <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            <div className="glass-panel-header">
              <Layers size={20} className="text-glow" /> 
              Execution Trace: 
              <span style={{ marginLeft: '12px', fontSize: '1rem', color: stage === 0 ? 'var(--glow-accent)' : 'var(--text-secondary)' }}>
                {stage === 0 ? 'Initial State' : stage === 1 ? 'After Row Shift' : stage === 2 ? 'After Compensate' : 'After Col Shift (Final State)'}
              </span>
            </div>

            <div className="stepper">
              <div className={`step-dot ${stage >= 0 ? (stage === 0 && isAnimating ? 'active' : 'completed') : ''}`}>1</div>
              <div className={`step-dot ${stage >= 1 ? (stage === 1 && isAnimating ? 'active' : 'completed') : ''}`}>2</div>
              <div className={`step-dot ${stage >= 2 ? (stage === 2 && isAnimating ? 'active' : 'completed') : ''}`}>3</div>
              <div className={`step-dot ${stage >= 3 ? 'completed' : ''}`}>4</div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <span>Initial</span>
              <span>Row Shift</span>
              <span>Compensate</span>
              <span>Col Shift</span>
            </div>

            <MeshGrid 
              nodes={nodes} 
              rootP={rootP} 
              stage={stage} 
              q={q} 
              isAnimating={isAnimating} 
            />

          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
