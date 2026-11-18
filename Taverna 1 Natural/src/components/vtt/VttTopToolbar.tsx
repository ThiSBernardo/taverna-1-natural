import React, { useState } from 'react';
import { 
  Ruler, 
  Circle, 
  Square, 
  Triangle, 
  Minus, 
  Anchor, 
  Pin, 
  X, 
  Plus
} from 'lucide-react';

export type VttToolType = 'ruler' | 'circle' | 'square' | 'cone' | 'line';

interface VttTopToolbarProps {
  activeTool: VttToolType | null;
  onSelectTool: (tool: VttToolType | null) => void;
  activeColor: string;
  onSelectColor: (color: string) => void;
  isAnchored: boolean;
  onToggleAnchor: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
}

export const VttTopToolbar: React.FC<VttTopToolbarProps> = ({
  activeTool,
  onSelectTool,
  activeColor,
  onSelectColor,
  isAnchored,
  onToggleAnchor,
  isPinned,
  onTogglePin,
  onClose,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    '#8b5cf6', // Purple
    '#ef4444', // Red
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber/Gold
    '#ec4899', // Pink
    '#ffffff', // White
  ];

  return (
    <div className="fixed top-[58px] left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="h-11 px-2 rounded-full bg-[#17141f]/92 backdrop-blur-xl border border-white/[0.09] shadow-[0_12px_36px_rgba(0,0,0,0.7)] flex items-center gap-1.5 text-gray-300">
        
        {/* RULER PILL DROPDOWN BUTTON */}
        <div className="flex items-center gap-0.5 bg-[#7a55cf] text-white px-2.5 py-1.5 rounded-full shadow-[0_2px_10px_rgba(122,85,207,0.4)] text-xs font-medium">
          <Ruler className="w-3.5 h-3.5" />
          <span className="font-sans text-[11px] font-semibold tracking-wide">Régua</span>
          <button
            type="button"
            onClick={() => onSelectTool(activeTool === 'ruler' ? null : 'ruler')}
            className="hover:bg-white/20 rounded-full p-0.5 ml-0.5 transition-colors cursor-pointer"
            title="Expandir ferramentas de medição"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* SHAPE & MEASUREMENT TOOLS */}
        <div className="flex items-center gap-1 pl-1">
          <button
            type="button"
            onClick={() => onSelectTool(activeTool === 'ruler' ? null : 'ruler')}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'ruler'
                ? 'bg-[#8257e5] text-white shadow-md'
                : 'hover:bg-white/10 hover:text-white text-gray-400'
            }`}
            title="Medição Linear (Régua)"
          >
            <Ruler className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onSelectTool(activeTool === 'circle' ? null : 'circle')}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'circle'
                ? 'bg-[#8257e5] text-white shadow-md'
                : 'hover:bg-white/10 hover:text-white text-gray-400'
            }`}
            title="Raio Circular"
          >
            <Circle className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onSelectTool(activeTool === 'square' ? null : 'square')}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'square'
                ? 'bg-[#8257e5] text-white shadow-md'
                : 'hover:bg-white/10 hover:text-white text-gray-400'
            }`}
            title="Área Quadrada"
          >
            <Square className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onSelectTool(activeTool === 'cone' ? null : 'cone')}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'cone'
                ? 'bg-[#8257e5] text-white shadow-md'
                : 'hover:bg-white/10 hover:text-white text-gray-400'
            }`}
            title="Cone Direcional"
          >
            <Triangle className="w-3.5 h-3.5 rotate-180" />
          </button>

          <button
            type="button"
            onClick={() => onSelectTool(activeTool === 'line' ? null : 'line')}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'line'
                ? 'bg-[#8257e5] text-white shadow-md'
                : 'hover:bg-white/10 hover:text-white text-gray-400'
            }`}
            title="Feixe / Linha Reta"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* DIVIDER */}
        <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

        {/* COLOR PICKER DOT */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(prev => !prev)}
            style={{ backgroundColor: activeColor }}
            className="w-4 h-4 rounded-full ring-2 ring-white/30 hover:ring-white/60 transition-all cursor-pointer shadow-sm"
            title="Alterar cor da ferramenta"
          />

          {showColorPicker && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 p-2 rounded-xl bg-[#14121b]/98 border border-white/15 shadow-2xl flex items-center gap-1.5 animate-fadeIn z-50">
              {colors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { onSelectColor(c); setShowColorPicker(false); }}
                  style={{ backgroundColor: c }}
                  className={`w-4 h-4 rounded-full transition-transform hover:scale-125 cursor-pointer ${
                    activeColor === c ? 'ring-2 ring-white scale-110' : 'ring-1 ring-white/20'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ANCHOR TOGGLE */}
        <button
          type="button"
          onClick={onToggleAnchor}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isAnchored ? 'text-purple-400 bg-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title={isAnchored ? 'Desancorar medições' : 'Ancorar medições no grid'}
        >
          <Anchor className="w-3.5 h-3.5" />
        </button>

        {/* PIN TOGGLE */}
        <button
          type="button"
          onClick={onTogglePin}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isPinned ? 'text-purple-400 bg-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title={isPinned ? 'Desafixar barra' : 'Fixar barra no topo'}
        >
          <Pin className="w-3.5 h-3.5" />
        </button>

        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ml-0.5"
          title="Fechar barra de ferramentas"
        >
          <X className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
