import React, { useEffect, useState } from 'react';
import { X, Dices, Sparkles, Skull } from 'lucide-react';
import { DiceRollResult } from '../../types/dice';

interface DiceOverlayProps {
  roll: DiceRollResult | null;
  onClose: () => void;
}

export const DiceOverlay: React.FC<DiceOverlayProps> = ({ roll, onClose }) => {
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (roll) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 400);
      return () => clearTimeout(timer);
    }
  }, [roll]);

  if (!roll) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`glass-panel-elevated max-w-sm w-full rounded-3xl p-6 text-center border shadow-2xl relative transition-all duration-300 transform ${
          animating ? 'scale-90 rotate-1' : 'scale-100 rotate-0'
        } ${
          roll.isCritical 
            ? 'border-yellow-400 bg-gradient-to-b from-yellow-950/40 via-[#181924] to-black/80 shadow-yellow-500/20' 
            : roll.isFumble 
              ? 'border-red-500 bg-gradient-to-b from-red-950/40 via-[#181924] to-black/80 shadow-red-500/20' 
              : 'border-purple-500/50 bg-gradient-to-b from-purple-950/40 via-[#181924] to-black/80 shadow-purple-500/20'
        }`}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Roller & Title */}
        <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
          {roll.sourceTitle}
        </div>
        <div className="text-[11px] text-gray-400 font-mono mb-4">
          Fórmula: {roll.formula} {roll.mode !== 'normal' ? `(${roll.mode})` : ''}
        </div>

        {/* Individual Dice Display */}
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          {roll.diceResults.map((die, idx) => (
            <div 
              key={idx}
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base border shadow-lg transition-transform ${
                die.dropped
                  ? 'bg-black/50 border-white/5 text-gray-600 line-through scale-90 opacity-60'
                  : die.result === 20 || (roll.isCritical && die.result >= 19)
                    ? 'bg-gradient-to-tr from-yellow-600 to-amber-400 text-black border-yellow-300 font-extrabold scale-110 shadow-yellow-500/50'
                    : die.result === 1
                      ? 'bg-red-600/80 border-red-400 text-white font-extrabold'
                      : 'bg-gradient-to-tr from-purple-800 to-purple-600 border-purple-400/50 text-white'
              }`}
            >
              {die.result}
            </div>
          ))}
          {roll.modifierTotal !== 0 && (
            <div className="text-sm font-mono font-bold text-gray-300 self-center">
              {roll.modifierTotal > 0 ? `+ ${roll.modifierTotal}` : `- ${Math.abs(roll.modifierTotal)}`}
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="my-3">
          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">
            Resultado Final
          </div>
          <div className="font-cinzel text-5xl font-black text-white tracking-wider drop-shadow-lg">
            {roll.total}
          </div>
        </div>

        {/* Critical or Fumble Banner */}
        {roll.isCritical && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 text-xs font-bold shadow-lg animate-pulse">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>ACERTO CRÍTICO!</span>
          </div>
        )}

        {roll.isFumble && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-bold shadow-lg">
            <Skull className="w-4 h-4 text-red-400" />
            <span>FALHA CRÍTICA!</span>
          </div>
        )}

        {/* Optional Damage Display */}
        {roll.damageResults && (
          <div className="mt-4 pt-3 border-t border-white/10 text-xs">
            <span className="text-gray-400">Dano Causado: </span>
            <strong className="text-red-400 font-mono font-bold text-sm">
              {roll.damageResults.total} de dano ({roll.damageResults.formula})
            </strong>
          </div>
        )}

        <div className="text-[10px] text-gray-500 mt-4">
          Toque em qualquer lugar para fechar
        </div>

      </div>
    </div>
  );
};
