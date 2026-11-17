import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Sparkles, 
  Dice5, 
  IdCard, 
  Palette, 
  BookOpen, 
  Link as LinkIcon 
} from 'lucide-react';
import createCampaignImg from '../../assets/create_campaign.png';
import createCharacterImg from '../../assets/create_character.png';
import createTokenImg from '../../assets/create_token.png';

interface CreateMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCreateCampaign: () => void;
  onSelectCreateCharacter: () => void;
  onOpenDiceAtelier: () => void;
  onOpenItemCreator: () => void;
  onOpenAbilityCreator: () => void;
  onOpenPlayerCard: () => void;
  onOpenLibrary: () => void;
  onJoinInviteCode: (code: string) => void;
}

export const CreateMenuModal: React.FC<CreateMenuModalProps> = ({
  isOpen,
  onClose,
  onSelectCreateCampaign,
  onSelectCreateCharacter,
  onOpenDiceAtelier,
  onOpenItemCreator,
  onOpenAbilityCreator,
  onOpenPlayerCard,
  onOpenLibrary,
  onJoinInviteCode,
}) => {
  const [inviteInput, setInviteInput] = useState('');

  if (!isOpen) return null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteInput.trim()) {
      onJoinInviteCode(inviteInput.trim());
      setInviteInput('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-[940px] rounded-3xl bg-[#0e1117] border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.85)] p-6 sm:p-10 relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg cursor-pointer"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1.5 pt-2">
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
            O que vamos criar?
          </h2>
          <p className="font-sans text-xs sm:text-sm text-slate-400">
            Escolha por onde começar. O resto você cria quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 my-8 text-center">
          
          <button
            type="button"
            onClick={() => { onClose(); onSelectCreateCampaign(); }}
            className="group flex flex-col items-center p-3 rounded-2xl hover:bg-white/[0.03] transition-all cursor-pointer focus:outline-none"
          >
            <div className="h-32 sm:h-36 w-full flex items-center justify-center overflow-hidden">
              <img 
                src={createCampaignImg} 
                alt="Campanha" 
                className="max-h-full max-w-full object-contain rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#E07A5F] uppercase mt-4 mb-1">
              PARA MESTRAR
            </div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">
              Campanha
            </h3>
            <p className="font-sans text-xs text-slate-400 leading-relaxed max-w-[210px] mx-auto mb-2">
              Monte uma mesa, convide seu grupo e conduza a história.
            </p>
            <div className="text-[11px] text-slate-500 font-medium">
              2 de 3 disponíveis no seu plano
            </div>
          </button>

          <button
            type="button"
            onClick={() => { onClose(); onSelectCreateCharacter(); }}
            className="group flex flex-col items-center p-3 rounded-2xl hover:bg-white/[0.03] transition-all cursor-pointer focus:outline-none"
          >
            <div className="h-32 sm:h-36 w-full flex items-center justify-center overflow-hidden">
              <img 
                src={createCharacterImg} 
                alt="Personagem" 
                className="max-h-full max-w-full object-contain rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-4 mb-1">
              PARA JOGAR
            </div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">
              Personagem
            </h3>
            <p className="font-sans text-xs text-slate-400 leading-relaxed max-w-[210px] mx-auto mb-2">
              Crie uma ficha pronta para levar a qualquer mesa.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenDiceAtelier();
            }}
            className="group flex flex-col items-center p-3 rounded-2xl hover:bg-white/[0.03] transition-all cursor-pointer focus:outline-none"
          >
            <div className="h-32 sm:h-36 w-full flex items-center justify-center overflow-hidden">
              <img 
                src={createTokenImg} 
                alt="Token animado" 
                className="max-h-full max-w-full object-contain rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-4 mb-1">
              PARA A MESA
            </div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">
              Token animado
            </h3>
            <p className="font-sans text-xs text-slate-400 leading-relaxed max-w-[210px] mx-auto mb-2">
              Dê movimento à arte do seu personagem.
            </p>
          </button>

        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0e1117] px-4 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
              MAIS FERRAMENTAS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center pt-2">
          
          <button
            type="button"
            onClick={() => { onClose(); onOpenItemCreator(); }}
            className="flex flex-col items-center p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 flex items-center justify-center text-slate-300 group-hover:text-purple-300 mb-1.5">
              <Package className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-white group-hover:text-purple-200">
              Item
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Armas e tesouros
            </div>
          </button>

          <button
            type="button"
            onClick={() => { onClose(); onOpenAbilityCreator(); }}
            className="flex flex-col items-center p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 flex items-center justify-center text-slate-300 group-hover:text-purple-300 mb-1.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-white group-hover:text-purple-200">
              Habilidade
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Magias e poderes
            </div>
          </button>

          <button
            type="button"
            onClick={() => { onClose(); onOpenDiceAtelier(); }}
            className="flex flex-col items-center p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 flex items-center justify-center text-slate-300 group-hover:text-purple-300 mb-1.5">
              <Dice5 className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-white group-hover:text-purple-200">
              Dados
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Cores e texturas
            </div>
          </button>

          <button
            type="button"
            onClick={() => { onClose(); onOpenPlayerCard(); }}
            className="flex flex-col items-center p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 flex items-center justify-center text-slate-300 group-hover:text-purple-300 mb-1.5">
              <IdCard className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-white group-hover:text-purple-200">
              Cartão de jogador
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Como te veem
            </div>
          </button>

          <button
            type="button"
            onClick={() => { onClose(); onOpenLibrary(); }}
            className="flex flex-col items-center p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 flex items-center justify-center text-slate-300 group-hover:text-purple-300 mb-1.5">
              <Palette className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-white group-hover:text-purple-200">
              Galeria
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Suas artes e mapas
            </div>
          </button>

          <button
            type="button"
            onClick={() => { onClose(); onOpenLibrary(); }}
            className="flex flex-col items-center p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 flex items-center justify-center text-slate-300 group-hover:text-purple-300 mb-1.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-white group-hover:text-purple-200">
              Biblioteca
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Sua vitrine e itens
            </div>
          </button>

        </div>

        <div className="mt-8 pt-4 flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Recebeu um convite?</span>
          </div>

          <form onSubmit={handleJoin} className="w-full max-w-md flex items-center bg-[#131720] border border-white/10 rounded-full p-1 pl-4 focus-within:border-purple-500/50 transition-colors">
            <input
              type="text"
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
              placeholder="Cole o link ou o código"
              className="bg-transparent flex-1 text-xs text-white placeholder-slate-500 outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-purple-700/80 hover:bg-purple-600 text-white text-xs font-semibold px-5 py-2 transition-colors cursor-pointer"
            >
              Entrar
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
