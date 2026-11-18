import React, { useState, useRef, useEffect } from 'react';
import { 
  RotateCcw, 
  Palette, 
  ChevronDown, 
  ChevronUp, 
  Dices,
  Sparkles
} from 'lucide-react';

export type DiceType = 'moeda' | 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';
export type RollMode = 'normal' | 'vantagem' | 'desvantagem';

interface VttDiceTrayProps {
  onRoll: (formula: string, title: string, options?: { mode?: 'normal' | 'oculto' | 'maior' | 'menor' }) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const VttDiceTray: React.FC<VttDiceTrayProps> = ({
  onRoll,
  isOpen,
  onToggle,
}) => {
  const [selectedDie, setSelectedDie] = useState<DiceType>('d20');
  const [quantity, setQuantity] = useState<number>(1);
  const [mode, setMode] = useState<RollMode>('normal');
  const [showPaletteModal, setShowPaletteModal] = useState<boolean>(false);
  const [diceTheme, setDiceTheme] = useState<'obsidian' | 'gold' | 'blood' | 'amethyst'>('obsidian');

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({ startX: 0, startY: 0, posX: 0, posY: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        if (!['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
          onToggle();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  const handleDieClick = (die: DiceType, isShift: boolean) => {
    if (isShift) {
      if (selectedDie === die) {
        setQuantity(prev => Math.min(20, prev + 1));
      } else {
        setSelectedDie(die);
        setQuantity(1);
      }
      return;
    }

    setSelectedDie(die);
    executeRoll(die, quantity, mode);
  };

  const executeRoll = (die: DiceType, qty: number, rollMode: RollMode) => {
    let formula = '';
    const label = die === 'moeda' ? 'Moeda' : die;

    if (die === 'moeda') {
      formula = `${qty}d2`;
    } else if (rollMode === 'vantagem') {
      formula = `${qty + 1}${die}k${qty}`;
    } else if (rollMode === 'desvantagem') {
      formula = `${qty + 1}${die}kl${qty}`;
    } else {
      formula = `${qty}${die}`;
    }

    const modeTitle = rollMode === 'vantagem' ? ' com Vantagem' : rollMode === 'desvantagem' ? ' com Desvantagem' : '';
    onRoll(formula, `Rolagem de ${label}${modeTitle}`);
  };

  const handleReset = () => {
    setQuantity(1);
    setSelectedDie('d20');
    setMode('normal');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.no-drag')) {
      return;
    }
    isDraggingRef.current = true;
    const currentX = position ? position.x : 0;
    const currentY = position ? position.y : 0;
    dragStartRef.current = { startX: e.clientX, startY: e.clientY, posX: currentX, posY: currentY };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.startX;
      const dy = moveEvent.clientY - dragStartRef.current.startY;
      setPosition({
        x: dragStartRef.current.posX + dx,
        y: dragStartRef.current.posY + dy
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const diceList: { type: DiceType; label: string }[] = [
    { type: 'moeda', label: 'Moeda' },
    { type: 'd4', label: 'd4' },
    { type: 'd6', label: 'd6' },
    { type: 'd8', label: 'd8' },
    { type: 'd10', label: 'd10' },
    { type: 'd12', label: 'd12' },
    { type: 'd20', label: 'd20' },
  ];

  const renderDieIcon = (type: DiceType, isSelected: boolean) => {
    const isGold = diceTheme === 'gold';
    const isAmethyst = diceTheme === 'amethyst';
    const isBlood = diceTheme === 'blood';

    const strokeColor = isSelected 
      ? '#a855f7' 
      : isGold ? '#f59e0b' : isAmethyst ? '#c084fc' : isBlood ? '#ef4444' : '#6b7280';
    const fillColor = isSelected
      ? '#3b2959'
      : isGold ? '#3d2b0e' : isAmethyst ? '#2d1e3d' : isBlood ? '#3b1212' : '#22232c';
    const numColor = isSelected ? '#ffffff' : '#d1d5db';

    switch (type) {
      case 'moeda':
        return (
          <svg viewBox="0 0 40 40" className="w-9 h-9 transition-transform group-hover:scale-110">
            <circle cx="20" cy="20" r="17" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" />
            <circle cx="20" cy="20" r="14" fill="none" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
            <path d="M20 12 C15 12 14 16 17 18 C22 21 21 28 15 26" fill="none" stroke={numColor} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="15" cy="26" r="1" fill={numColor} />
          </svg>
        );
      case 'd4':
        return (
          <svg viewBox="0 0 40 40" className="w-9 h-9 transition-transform group-hover:scale-110">
            <polygon points="20,6 6,34 34,34" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" />
            <line x1="20" y1="6" x2="20" y2="28" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="6" y1="34" x2="20" y2="28" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="34" y1="34" x2="20" y2="28" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <text x="20" y="22" fill={numColor} fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="Spectral, serif">4</text>
          </svg>
        );
      case 'd6':
        return (
          <svg viewBox="0 0 40 40" className="w-9 h-9 transition-transform group-hover:scale-110">
            <polygon points="20,7 34,15 20,23 6,15" fill={fillColor} stroke={strokeColor} strokeWidth="1.6" />
            <polygon points="6,15 20,23 20,35 6,27" fill={fillColor} stroke={strokeColor} strokeWidth="1.6" filter="brightness(0.85)" />
            <polygon points="34,15 20,23 20,35 34,27" fill={fillColor} stroke={strokeColor} strokeWidth="1.6" filter="brightness(0.7)" />
            <text x="20" y="17" fill={numColor} fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="Spectral, serif">6</text>
            <text x="13" y="27" fill={numColor} fontSize="7" textAnchor="middle" opacity="0.8" fontFamily="Spectral, serif">1</text>
            <text x="27" y="27" fill={numColor} fontSize="7" textAnchor="middle" opacity="0.8" fontFamily="Spectral, serif">3</text>
          </svg>
        );
      case 'd8':
        return (
          <svg viewBox="0 0 40 40" className="w-9 h-9 transition-transform group-hover:scale-110">
            <polygon points="20,5 34,20 20,35 6,20" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" />
            <line x1="20" y1="5" x2="20" y2="35" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="6" y1="20" x2="34" y2="20" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <text x="14" y="16" fill={numColor} fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="Spectral, serif">8</text>
            <text x="26" y="28" fill={numColor} fontSize="7" textAnchor="middle" opacity="0.8" fontFamily="Spectral, serif">4</text>
          </svg>
        );
      case 'd10':
        return (
          <svg viewBox="0 0 40 40" className="w-9 h-9 transition-transform group-hover:scale-110">
            <polygon points="20,5 33,16 29,33 20,36 11,33 7,16" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" />
            <line x1="20" y1="5" x2="20" y2="25" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="7" y1="16" x2="20" y2="25" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="33" y1="16" x2="20" y2="25" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="11" y1="33" x2="20" y2="25" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="29" y1="33" x2="20" y2="25" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <text x="20" y="20" fill={numColor} fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="Spectral, serif">0</text>
          </svg>
        );
      case 'd12':
        return (
          <svg viewBox="0 0 40 40" className="w-9 h-9 transition-transform group-hover:scale-110">
            <polygon points="20,6 33,13 31,30 20,36 9,30 7,13" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" />
            <polygon points="20,13 28,18 25,28 15,28 12,18" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.8" />
            <line x1="20" y1="6" x2="20" y2="13" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="33" y1="13" x2="28" y2="18" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="31" y1="30" x2="25" y2="28" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="9" y1="30" x2="15" y2="28" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="7" y1="13" x2="12" y2="18" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <text x="20" y="23" fill={numColor} fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="Spectral, serif">12</text>
          </svg>
        );
      case 'd20':
      default:
        return (
          <svg viewBox="0 0 40 40" className="w-9 h-9 transition-transform group-hover:scale-110">
            <polygon points="20,5 35,14 35,27 20,36 5,27 5,14" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" />
            <polygon points="20,10 30,28 10,28" fill="none" stroke={strokeColor} strokeWidth="1.2" opacity="0.9" />
            <line x1="20" y1="5" x2="20" y2="10" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="35" y1="14" x2="20" y2="10" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="5" y1="14" x2="20" y2="10" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="35" y1="27" x2="30" y2="28" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="5" y1="27" x2="10" y2="28" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="20" y1="36" x2="30" y2="28" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <line x1="20" y1="36" x2="10" y2="28" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
            <text x="20" y="24" fill={numColor} fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="Spectral, serif">20</text>
          </svg>
        );
    }
  };

  return (
    <div 
      style={{
        transform: position ? `translate3d(${position.x}px, ${position.y}px, 0)` : undefined
      }}
      className="fixed bottom-6 right-16 z-40 select-none flex flex-col items-center pointer-events-auto transition-transform duration-75"
    >
      {isOpen ? (
        <div 
          onMouseDown={handleMouseDown}
          className="w-[390px] rounded-3xl bg-[#16131c]/92 backdrop-blur-xl border border-white/[0.09] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(245,158,11,0.06)] p-3.5 text-white animate-modal-in cursor-grab active:cursor-grabbing"
        >
          {/* DICE ROW */}
          <div className="flex items-center justify-between px-1">
            {diceList.map(({ type, label }) => {
              const isSelected = selectedDie === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={(e) => handleDieClick(type, e.shiftKey)}
                  title={`${label} (Clique para rolar, Shift+Clique para montar rolagem)`}
                  className={`no-drag flex flex-col items-center gap-1 group cursor-pointer p-1 rounded-xl transition-all ${
                    isSelected ? 'scale-105' : 'hover:scale-105 opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="relative">
                    {renderDieIcon(type, isSelected)}
                    {isSelected && quantity > 1 && (
                      <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[9px] font-bold px-1 rounded-full border border-white/20">
                        {quantity}
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] font-spectral tracking-wide ${
                    isSelected ? 'text-purple-300 font-bold' : 'text-amber-100/70 group-hover:text-amber-100'
                  }`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* HINT 1 */}
          <div className="text-[10px] text-amber-100/40 font-spectral tracking-wide text-center mt-2.5 mb-1.5">
            Shift + clique monta a rolagem
          </div>

          <div className="border-t border-white/[0.07] my-2" />

          {/* CONTROLS ROW */}
          <div className="no-drag flex items-center justify-between px-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="text-gray-400 hover:text-white text-base font-bold w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/5 active:scale-95 cursor-pointer"
                title="Diminuir quantidade"
              >
                —
              </button>
              <span className="font-spectral text-xs font-bold text-gray-200 min-w-[26px] text-center">
                {quantity}×
              </span>
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.min(20, prev + 1))}
                className="text-gray-400 hover:text-white text-base font-bold w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/5 active:scale-95 cursor-pointer"
                title="Aumentar quantidade"
              >
                +
              </button>
            </div>

            {/* MODE PILLS */}
            <div className="bg-black/40 p-0.5 rounded-full border border-white/[0.06] flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setMode('normal')}
                className={`px-3 py-1 rounded-full text-xs font-spectral transition-all cursor-pointer ${
                  mode === 'normal' 
                    ? 'bg-[#5b4d75] text-white shadow-sm font-semibold' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setMode('vantagem')}
                className={`px-2.5 py-1 rounded-full text-xs font-spectral transition-all cursor-pointer ${
                  mode === 'vantagem' 
                    ? 'bg-[#5b4d75] text-white shadow-sm font-semibold' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Vant.
              </button>
              <button
                type="button"
                onClick={() => setMode('desvantagem')}
                className={`px-2.5 py-1 rounded-full text-xs font-spectral transition-all cursor-pointer ${
                  mode === 'desvantagem' 
                    ? 'bg-[#5b4d75] text-white shadow-sm font-semibold' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Desv.
              </button>
            </div>

            {/* ACTION ICONS */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                title="Reiniciar seleções"
                className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowPaletteModal(prev => !prev)}
                title="Personalizar dados"
                className="p-1 text-gray-400 hover:text-purple-300 transition-colors cursor-pointer rounded-lg hover:bg-white/5"
              >
                <Palette className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PALETTE THEMES POPOVER */}
          {showPaletteModal && (
            <div className="no-drag mt-3 p-2.5 rounded-2xl bg-black/60 border border-purple-500/30 flex items-center justify-between text-xs animate-fadeIn">
              <span className="text-[11px] font-spectral text-gray-300">Tema dos dados:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => { setDiceTheme('obsidian'); setShowPaletteModal(false); }}
                  className={`w-5 h-5 rounded-full bg-[#22232c] border ${diceTheme === 'obsidian' ? 'ring-2 ring-purple-400 border-white' : 'border-white/20'}`}
                  title="Obsidiana"
                />
                <button
                  type="button"
                  onClick={() => { setDiceTheme('amethyst'); setShowPaletteModal(false); }}
                  className={`w-5 h-5 rounded-full bg-[#8b5cf6] border ${diceTheme === 'amethyst' ? 'ring-2 ring-purple-400 border-white' : 'border-white/20'}`}
                  title="Ametista"
                />
                <button
                  type="button"
                  onClick={() => { setDiceTheme('gold'); setShowPaletteModal(false); }}
                  className={`w-5 h-5 rounded-full bg-[#f59e0b] border ${diceTheme === 'gold' ? 'ring-2 ring-purple-400 border-white' : 'border-white/20'}`}
                  title="Ouro Nobre"
                />
                <button
                  type="button"
                  onClick={() => { setDiceTheme('blood'); setShowPaletteModal(false); }}
                  className={`w-5 h-5 rounded-full bg-[#ef4444] border ${diceTheme === 'blood' ? 'ring-2 ring-purple-400 border-white' : 'border-white/20'}`}
                  title="Sangue Paranormal"
                />
              </div>
            </div>
          )}

          {/* FOOTER HINTS */}
          <div className="text-[9.5px] text-amber-100/45 font-spectral text-center leading-relaxed mt-2.5">
            <div>Segure D para abrir a roleta</div>
            <div>Arraste o botão para qualquer borda</div>
          </div>
        </div>
      ) : null}

      {/* TOGGLE CHEVRON BUTTON */}
      <button
        type="button"
        onClick={onToggle}
        title={isOpen ? 'Recolher bandeja de dados' : 'Abrir bandeja de dados (D)'}
        className="mt-2 w-10 h-10 rounded-full bg-[#1e1927]/95 border border-purple-500/40 text-purple-300 shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex items-center justify-center hover:bg-[#2a2238] hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
      </button>
    </div>
  );
};
