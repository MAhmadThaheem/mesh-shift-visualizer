import React, { useEffect, useState } from 'react';
import { calculateRowShift, calculateColShift } from '../utils/shiftLogic';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUp } from 'lucide-react';

const MeshGrid = ({ nodes, rootP, stage, q, isAnimating }) => {
  const rowShift = calculateRowShift(q, rootP);
  const colShift = calculateColShift(q, rootP);

  const getGridStyle = () => ({
    gridTemplateColumns: `repeat(${rootP}, 1fr)`,
    gridTemplateRows: `repeat(${rootP}, 1fr)`,
  });

  return (
    <div className="grid-wrapper">
      <div className="mesh-grid" style={getGridStyle()}>
        {nodes.map((node, index) => {
          const r = Math.floor(index / rootP);
          const c = index % rootP;
          
          const gridColumn = c + 1;
          const gridRow = rootP - r;

          let isMovingNow = false;
          let arrowDir = null;
          let arrowLabel = '';

          if (isAnimating && stage === 0 && rowShift > 0) {
            isMovingNow = true;
            arrowDir = 'right';
            arrowLabel = `+${rowShift}`;
          } else if (isAnimating && stage === 1 && node.wrappedRow) {
            isMovingNow = true;
            arrowDir = 'up';
            arrowLabel = `+1 (wrap)`;
          } else if (isAnimating && stage === 2 && colShift > 0) {
            isMovingNow = true;
            arrowDir = 'up';
            arrowLabel = `+${colShift}`;
          }

          return (
            <div 
              key={node.id} 
              className={`mesh-node ${isMovingNow ? 'moving' : ''}`}
              style={{ gridRow, gridColumn }}
            >
              <div className="node-id">n{node.id}</div>
              
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={node.value}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0, position: 'absolute' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="node-value"
                >
                  {node.value}
                </motion.div>
              </AnimatePresence>

              {/* Show animated arrows based on phase */}
              {isMovingNow && arrowDir === 'right' && (
                <motion.div 
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 20 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  style={{ position: 'absolute', right: '-25px', color: 'var(--glow-accent)', zIndex: 100 }}
                >
                  <ArrowRight size={20} />
                  <span style={{ fontSize: '10px', position: 'absolute', top: '-10px', right: 0 }}>{arrowLabel}</span>
                </motion.div>
              )}

              {isMovingNow && arrowDir === 'up' && (
                <motion.div 
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -20 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  style={{ position: 'absolute', top: '-25px', color: 'var(--glow-secondary)', zIndex: 100 }}
                >
                  <ArrowUp size={20} />
                  <span style={{ fontSize: '10px', position: 'absolute', left: '20px', top: 0 }}>{arrowLabel}</span>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeshGrid;
