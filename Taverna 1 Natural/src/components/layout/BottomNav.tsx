import React from 'react';
import { Home, Compass, Plus, Shield, ShoppingBag } from 'lucide-react';

export type MainNavRoute = 'campanhas' | 'descubra' | 'guildas' | 'loja';

interface BottomNavProps {
  currentRoute: MainNavRoute;
  onRouteChange: (route: MainNavRoute) => void;
  onOpenCreateMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRoute,
  onRouteChange,
  onOpenCreateMenu,
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] sm:w-[540px] max-w-[560px]">
      <nav className="rounded-full px-6 py-2 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.55)] border border-white/[0.08] bg-[#121218]/85 backdrop-blur-[20px]">
        
        {/* Início (Campanhas) */}
        <button
          onClick={() => onRouteChange('campanhas')}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
            currentRoute === 'campanhas' 
              ? 'text-purple-300 font-medium scale-105 drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-wide font-inter">Início</span>
        </button>

        {/* Descubra */}
        <button
          onClick={() => onRouteChange('descubra')}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
            currentRoute === 'descubra' 
              ? 'text-purple-300 font-medium scale-105 drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-wide font-inter">Descubra</span>
        </button>

        {/* Central Plus Button (Elevated Circle) */}
        <div className="relative -top-4 flex items-center justify-center px-2">
          <button
            onClick={onOpenCreateMenu}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#6d28d9] via-[#7c3aed] to-[#8b5cf6] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(124,58,237,0.55)] border-2 border-purple-300/40 hover:scale-110 active:scale-95 transition-all duration-200"
            title="O que vamos criar?"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Guildas */}
        <button
          onClick={() => onRouteChange('guildas')}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
            currentRoute === 'guildas' 
              ? 'text-purple-300 font-medium scale-105 drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px] tracking-wide font-inter">Guildas</span>
        </button>

        {/* Loja */}
        <button
          onClick={() => onRouteChange('loja')}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
            currentRoute === 'loja' 
              ? 'text-purple-300 font-medium scale-105 drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] tracking-wide font-inter">Loja</span>
        </button>

      </nav>
    </div>
  );
};
