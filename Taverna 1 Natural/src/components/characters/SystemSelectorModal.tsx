import React, { useState } from 'react';
import { X, Search, ChevronLeft } from 'lucide-react';
import { RPG_SYSTEMS, RPGSystemId } from '../../types/rpg-systems';

import coverOrdem from '../../assets/systems/cover_ordem_paranormal.png';
import coverOrdem2 from '../../assets/systems/cover_ordem_paranormal_2.png';
import coverDnd from '../../assets/systems/cover_dnd_5e.png';
import coverFabula from '../../assets/systems/cover_fabula_ultima.png';
import coverTormenta from '../../assets/systems/cover_tormenta_20.png';
import coverSlasher from '../../assets/systems/cover_slasher.png';
import coverFeiticeiros25 from '../../assets/systems/cover_feiticeiros_2_5.png';
import coverFeiticeiros20 from '../../assets/systems/cover_feiticeiros_2_0.png';

interface SystemSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onSelectSystem: (systemId: RPGSystemId) => void;
}

const SYSTEM_COVERS: Record<string, string> = {
  'ordem-paranormal': coverOrdem,
  'ordem-paranormal-2': coverOrdem2,
  'dnd-5e-2014': coverDnd,
  'fabula-ultima': coverFabula,
  'tormenta-20': coverTormenta,
  'slasher': coverSlasher,
  'feiticeiros-maldicoes-2-5': coverFeiticeiros25,
  'feiticeiros-maldicoes-2-0': coverFeiticeiros20,
};

export const SystemSelectorModal: React.FC<SystemSelectorModalProps> = ({
  isOpen,
  onClose,
  onBack,
  onSelectSystem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const baseList = searchQuery.trim() === '' 
    ? RPG_SYSTEMS.filter(s => s.id !== 'ficha-universal')
    : RPG_SYSTEMS;

  const filteredSystems = baseList.filter(sys => 
    sys.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sys.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-[980px] rounded-3xl bg-[#0E1117] border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.85)] p-5 sm:p-7 relative max-h-[96vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full">
          {onBack ? (
            <button 
              type="button"
              onClick={onBack}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              title="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-7 h-7" />
          )}

          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center space-y-1.5 -mt-3">
          <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide">
            Personagem para qual sistema?
          </h2>
          <p className="font-sans text-xs sm:text-sm text-slate-400 max-w-xl mx-auto px-2">
            A ficha fica na sua Biblioteca e pode ir com você para qualquer mesa desse sistema.
          </p>
        </div>

        <div className="max-w-md w-full mx-auto my-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar sistema"
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 backdrop-blur-sm transition-colors"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-1">
          {filteredSystems.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm font-sans">
              Nenhum sistema encontrado para "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 pt-1 pb-3">
              {filteredSystems.map(sys => {
                const cover = SYSTEM_COVERS[sys.id] || sys.coverImage;
                return (
                  <button
                    key={sys.id}
                    type="button"
                    onClick={() => onSelectSystem(sys.id)}
                    className="group flex flex-col items-center cursor-pointer text-center focus:outline-none"
                  >
                    <div className="w-full aspect-[142/210] rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-lg group-hover:border-purple-500/70 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.35)] group-hover:scale-105 transition-all duration-300 relative">
                      <img 
                        src={cover} 
                        alt={sys.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-cinzel text-xs sm:text-[13px] font-bold text-white group-hover:text-purple-300 transition-colors mt-2 text-center leading-snug">
                      {sys.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
