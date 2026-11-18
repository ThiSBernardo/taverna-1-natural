import React from 'react';
import { X, Activity } from 'lucide-react';
import { Character } from '../../types/character';

interface VttGroupStatusPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeCharacters?: Character[];
  onOpenCharacterSheet?: (char: Character) => void;
}

export const VttGroupStatusPanel: React.FC<VttGroupStatusPanelProps> = ({
  isOpen,
  onClose,
  activeCharacters = [],
  onOpenCharacterSheet,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-16 left-4 z-40 w-64 rounded-2xl bg-[#14121b]/96 backdrop-blur-2xl border border-white/[0.09] shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-3.5 text-white animate-fadeIn select-none">
      
      {/* HEADER */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <div>
          <h3 className="font-cinzel text-xs font-bold text-white tracking-wide">
            Status do grupo
          </h3>
          <p className="text-[10px] text-gray-400 font-sans">
            {activeCharacters.length} {activeCharacters.length === 1 ? 'personagem ativo' : 'personagens ativos'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          title="Fechar painel"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* BODY */}
      <div className="pt-3">
        {activeCharacters.length === 0 ? (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-2.5">
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-[11px] text-gray-300 font-serif leading-relaxed px-2">
              Nenhum personagem ativo na campanha.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {activeCharacters.map(char => (
              <div
                key={char.id}
                onClick={() => onOpenCharacterSheet && onOpenCharacterSheet(char)}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={char.token?.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                    alt={char.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-500/30"
                  />
                  <div>
                    <div className="text-xs font-semibold text-gray-200 truncate max-w-[110px]">
                      {char.name}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {char.characterClass} · NEX {char.levelOrNex}%
                    </div>
                  </div>
                </div>

                {/* VITAL MINI INDICATORS */}
                <div className="flex flex-col items-end gap-1">
                  <div className="text-[10px] font-mono text-red-400">
                    PV {char.hp.current}/{char.hp.max}
                  </div>
                  <div className="w-14 h-1.5 rounded-full bg-black/60 overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${Math.min(100, (char.hp.current / char.hp.max) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
