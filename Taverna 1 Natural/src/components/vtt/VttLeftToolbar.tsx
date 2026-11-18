import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Swords, 
  Flame, 
  ShoppingBag, 
  Package, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface VttLeftToolbarProps {
  isLocked: boolean;
  onToggleLock: () => void;
  activeMode: 'combat' | 'camp' | 'items' | null;
  onSelectMode: (mode: 'combat' | 'camp' | 'items' | null) => void;
  onOpenShop: () => void;
  onOpenSkills: () => void;
}

export const VttLeftToolbar: React.FC<VttLeftToolbarProps> = ({
  isLocked,
  onToggleLock,
  activeMode,
  onSelectMode,
  onOpenShop,
  onOpenSkills,
}) => {
  const [showShopTooltip, setShowShopTooltip] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="fixed left-3 top-1/2 -translate-y-1/2 z-40 select-none flex items-center">
      {!isCollapsed ? (
        <div className="py-2.5 px-1.5 rounded-full bg-[#16131c]/92 backdrop-blur-xl border border-white/[0.09] shadow-[0_12px_36px_rgba(0,0,0,0.7)] flex flex-col items-center gap-2.5 text-gray-400 animate-fadeIn">
          
          {/* LOCK TOGGLE */}
          <button
            type="button"
            onClick={onToggleLock}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isLocked ? 'text-gray-300 hover:text-white' : 'text-purple-400 hover:text-purple-300'
            }`}
            title={isLocked ? 'Cenário travado (Clique para destravar)' : 'Cenário destravado'}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          {/* COMBAT / SWORDS */}
          <button
            type="button"
            onClick={() => onSelectMode(activeMode === 'combat' ? null : 'combat')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeMode === 'combat'
                ? 'bg-[#8257e5] text-white shadow-lg shadow-purple-900/40'
                : 'hover:bg-white/10 hover:text-white text-gray-400'
            }`}
            title="Modo Combate & Iniciativa"
          >
            <Swords className="w-4 h-4" />
          </button>

          {/* CAMPFIRE */}
          <button
            type="button"
            onClick={() => onSelectMode(activeMode === 'camp' ? null : 'camp')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeMode === 'camp'
                ? 'bg-[#8257e5] text-white shadow-lg'
                : 'hover:bg-white/10 hover:text-white text-gray-400'
            }`}
            title="Acampamento & Descanso"
          >
            <Flame className="w-4 h-4" />
          </button>

          {/* POUCH / QUICK BAG */}
          <button
            type="button"
            onClick={() => onSelectMode(activeMode === 'items' ? null : 'items')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeMode === 'items'
                ? 'bg-[#8257e5] text-white shadow-lg'
                : 'hover:bg-white/10 hover:text-white text-gray-400'
            }`}
            title="Inventário Rápido"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          {/* CAMPAIGN ITEM SHOP (CHEST) WITH EXACT TOOLTIP */}
          <div className="relative">
            <button
              type="button"
              onClick={onOpenShop}
              onMouseEnter={() => setShowShopTooltip(true)}
              onMouseLeave={() => setShowShopTooltip(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Loja de Itens da Campanha (L)"
            >
              <Package className="w-4 h-4" />
            </button>

            {showShopTooltip && (
              <div className="absolute left-11 top-1/2 -translate-y-1/2 w-64 p-3 rounded-2xl bg-[#0f0e15]/98 backdrop-blur-xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.85)] z-50 pointer-events-none animate-fadeIn">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-sans text-xs font-bold text-gray-100">Loja de itens</span>
                  <span className="bg-white/10 text-gray-400 text-[10px] font-mono px-1.5 py-0.5 rounded">L</span>
                </div>
                <div className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  Procure, compre ou consulte itens da campanha.
                </div>
              </div>
            )}
          </div>

          {/* WIZARD HAT / ABILITIES CATALOG */}
          <button
            type="button"
            onClick={onOpenSkills}
            className="w-8 h-8 rounded-full flex items-center justify-center text-purple-400 hover:text-white hover:bg-purple-600/30 transition-colors cursor-pointer"
            title="Catálogo de Habilidades & Poderes"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* COLLAPSE ARROW */}
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors cursor-pointer mt-1"
            title="Ocultar barra lateral"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="w-6 h-12 rounded-r-xl bg-[#16131c]/90 border border-l-0 border-white/10 text-gray-400 hover:text-white flex items-center justify-center shadow-lg cursor-pointer"
          title="Expandir barra de ferramentas"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
