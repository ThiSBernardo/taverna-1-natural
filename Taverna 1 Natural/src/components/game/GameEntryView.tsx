import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Campaign } from '../../types/campaign';

interface GameEntryViewProps {
  campaign: Campaign;
  onEnterGame: (campaign: Campaign) => void;
  onBack: () => void;
  onOpenLibrary?: () => void;
}

export const GameEntryView: React.FC<GameEntryViewProps> = ({
  campaign,
  onEnterGame,
  onBack,
  onOpenLibrary,
}) => {
  const [isAltActive, setIsAltActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      } else if (e.key === 'p' || e.key === 'P') {
        if (onOpenLibrary) onOpenLibrary();
      } else if (e.key === 'Alt') {
        setIsAltActive(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onBack, onOpenLibrary]);

  return (
    <div className="fixed inset-0 z-50 bg-[#000000] text-white flex flex-col items-center justify-between py-24 select-none animate-fadeIn">
      
      <button
        type="button"
        onClick={onBack}
        className="absolute top-8 left-8 text-gray-500 hover:text-gray-300 flex items-center gap-2 text-xs font-serif tracking-widest uppercase transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Voltar</span>
      </button>

      <div className="w-[252px] h-[100px] rounded-2xl bg-[#0c0c0e] border border-white/[0.08] flex flex-col items-center justify-center p-4 shadow-2xl">
        <span className="font-serif text-[11px] font-bold text-gray-300 tracking-[0.25em] uppercase mb-2">
          Atalho
        </span>
        <div className="text-[11px] font-serif text-gray-400 tracking-wider flex items-center gap-1.5">
          <span>DESENHO (SEGURE):</span>
          <span className={`font-bold transition-colors ${isAltActive ? 'text-purple-400 scale-110' : 'text-gray-200'}`}>
            ALT
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-auto">
        <button
          type="button"
          onClick={() => onEnterGame(campaign)}
          className="w-[224px] h-[44px] rounded-full bg-[#9d6efd] hover:bg-[#8b5cf6] active:scale-95 text-white font-serif font-semibold text-xs tracking-[0.18em] uppercase transition-all shadow-[0_4px_24px_rgba(157,110,253,0.35)] flex items-center justify-center cursor-pointer"
        >
          <span>Entrar no Jogo</span>
        </button>
      </div>

      <div className="h-6" />
    </div>
  );
};
