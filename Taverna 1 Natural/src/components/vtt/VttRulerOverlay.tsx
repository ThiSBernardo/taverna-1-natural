import React, { useState } from 'react';

interface VttRulerOverlayProps {
  isActive: boolean;
  color?: string;
}

export const VttRulerOverlay: React.FC<VttRulerOverlayProps> = ({
  isActive,
  color = '#ffffff',
}) => {
  const [startPoint, setStartPoint] = useState<{ x: number; y: number }>({ x: 677, y: 467 });
  const [endPoint, setEndPoint] = useState<{ x: number; y: number }>({ x: 1007, y: 492 });
  const [draggingPoint, setDraggingPoint] = useState<'start' | 'end' | null>(null);

  if (!isActive) return null;

  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const distancePx = Math.sqrt(dx * dx + dy * dy);
  
  // 40px ≈ 1.5m (1 square)
  const distanceSquares = Math.round((distancePx / 40) * 10) / 10;
  const distanceMeters = Math.round(distanceSquares * 1.5 * 10) / 10;

  const midX = (startPoint.x + endPoint.x) / 2;
  const midY = (startPoint.y + endPoint.y) / 2;

  const handleMouseDown = (point: 'start' | 'end') => (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingPoint(point);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newPos = { x: moveEvent.clientX, y: moveEvent.clientY };
      if (point === 'start') {
        setStartPoint(newPos);
      } else {
        setEndPoint(newPos);
      }
    };

    const handleMouseUp = () => {
      setDraggingPoint(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none">
      <svg className="w-full h-full absolute inset-0">
        {/* Glow Line */}
        <line
          x1={startPoint.x}
          y1={startPoint.y}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke={color}
          strokeWidth="6"
          strokeOpacity="0.25"
          strokeLinecap="round"
        />
        {/* Core Line */}
        <line
          x1={startPoint.x}
          y1={startPoint.y}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Start Handle */}
      <div
        onMouseDown={handleMouseDown('start')}
        style={{ left: `${startPoint.x}px`, top: `${startPoint.y}px` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white ring-4 ring-purple-500/50 shadow-xl pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
        title="Arrastar ponto inicial"
      />

      {/* End Handle */}
      <div
        onMouseDown={handleMouseDown('end')}
        style={{ left: `${endPoint.x}px`, top: `${endPoint.y}px` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white ring-4 ring-purple-500/50 shadow-xl pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
        title="Arrastar ponto final"
      />

      {/* Center Distance Badge & Crosshair (Exact visual match from Screenshot 3) */}
      <div
        style={{ left: `${midX}px`, top: `${midY}px` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center"
      >
        {/* Crosshair Graphic */}
        <div className="w-5 h-5 relative flex items-center justify-center">
          <div className="w-3.5 h-1 bg-white rounded-full shadow-md" />
          <div className="w-1 h-3.5 bg-white rounded-full absolute shadow-md" />
        </div>
        {/* Measurement Pill Tag */}
        <div className="mt-1 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 text-[10px] font-mono font-bold text-white shadow-xl">
          {distanceMeters}m · {distanceSquares} sq
        </div>
      </div>
    </div>
  );
};
