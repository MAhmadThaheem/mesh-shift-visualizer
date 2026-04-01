export const calculateRowShift = (q, rootP) => q % rootP;
export const calculateColShift = (q, rootP) => Math.floor(q / rootP);

export const getRingSteps = (q, p) => Math.min(q, p - q);
export const getMeshSteps = (q, rootP) => calculateRowShift(q, rootP) + calculateColShift(q, rootP);

export const initNodes = (p) => {
  return Array.from({ length: p }, (_, i) => ({ id: i, value: i, wrappedRow: false }));
};

export const computeRowShiftState = (nodes, q, rootP) => {
  const nextNodes = [...nodes];
  const rowShift = calculateRowShift(q, rootP);
  const tempNodes = nodes.map(n => ({...n}));
  
  for (let r = 0; r < rootP; r++) {
    for (let c = 0; c < rootP; c++) {
      const sourceIndex = r * rootP + c;
      const targetCol = (c + rowShift) % rootP;
      const targetIndex = r * rootP + targetCol;
      nextNodes[targetIndex].value = tempNodes[sourceIndex].value;
      nextNodes[targetIndex].wrappedRow = (c + rowShift >= rootP) || tempNodes[sourceIndex].wrappedRow;
    }
  }
  return nextNodes;
};

export const computeBaseColShiftState = (nodes, q, rootP) => {
  const nextNodes = [...nodes];
  const colShift = calculateColShift(q, rootP);
  const tempNodes = nodes.map(n => ({...n}));
  
  for (let r = 0; r < rootP; r++) {
    for (let c = 0; c < rootP; c++) {
      const sourceIndex = r * rootP + c;
      const targetRow = (r + colShift) % rootP;
      const targetIndex = targetRow * rootP + c;
      nextNodes[targetIndex].value = tempNodes[sourceIndex].value;
      nextNodes[targetIndex].wrappedRow = tempNodes[sourceIndex].wrappedRow;
    }
  }
  return nextNodes;
};

export const computeCompensateShiftState = (nodes, rootP) => {
  const nextNodes = [...nodes];
  const tempNodes = nodes.map(n => ({...n}));
  
  for (let r = 0; r < rootP; r++) {
    for (let c = 0; c < rootP; c++) {
      const sourceIndex = r * rootP + c;
      const needsCompensate = tempNodes[sourceIndex].wrappedRow;
      const actualColShift = needsCompensate ? 1 : 0;
      const targetRow = (r + actualColShift) % rootP;
      const targetIndex = targetRow * rootP + c;
      nextNodes[targetIndex].value = tempNodes[sourceIndex].value;
      nextNodes[targetIndex].wrappedRow = false; // Reset for cleanliness
    }
  }
  return nextNodes;
};
