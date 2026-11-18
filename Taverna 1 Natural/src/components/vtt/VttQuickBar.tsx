import React from 'react';
import { 
  Users, 
  Activity, 
  Scroll, 
  Briefcase, 
  Feather 
} from 'lucide-react';

interface VttQuickBarProps {
  isGroupStatusOpen: boolean;
  onToggleGroupStatus: () => void;
  onOpenPartyList: () => void;
  onOpenCharacterSheet: () => void;
  onOpenInventory: () => void;
  onOpenChronicle: () => void;
}

export const VttQuickBar: React.FC<VttQuickBarProps> = ({
  isGroupStatusOpen,
  onToggleGroupStatus,
  onOpenPartyList,
  onOpenCharacterSheet,
  onOpenInventory,
  onOpenChronicle,
}) => {
  return (
    <div className="fixed top-4 left-4 z-40 select-none">
      <div className="h-10 px-2 rounded-full bg-[#17141f]/92 backdrop-blur-xl border border-white/[0.09] shadow-[0_12px_36px_rgba(0,0,0,0.7)] flex items-center gap-1.5 text-gray-400">
        
        {/* PLAYERS / PARTY */}
        <button
          type="button"
          onClick={onOpenPartyList}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          title="Jogadores na Sessão"
        >
          <Users className="w-3.5 h-3.5" />
        </button>

        {/* GROUP STATUS (HEARTPULSE) */}
        <button
          type="button"
          onClick={onToggleGroupStatus}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isGroupStatusOpen
              ? 'bg-[#8257e5] text-white shadow-md'
              : 'hover:bg-white/10 hover:text-white'
          }`}
          title="Status do Grupo"
        >
          <Activity className="w-3.5 h-3.5" />
        </button>

        {/* CHARACTER SHEET */}
        <button
          type="button"
          onClick={onOpenCharacterSheet}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          title="Ficha do Personagem (C)"
        >
          <Scroll className="w-3.5 h-3.5" />
        </button>

        {/* INVENTORY */}
        <button
          type="button"
          onClick={onOpenInventory}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          title="Inventário da Mochila (I)"
        >
          <Briefcase className="w-3.5 h-3.5" />
        </button>

        {/* CHRONICLE / NOTES */}
        <button
          type="button"
          onClick={onOpenChronicle}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          title="Diário da Crônica & Pistas (N)"
        >
          <Feather className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
