import React, { useState } from 'react';
import { 
  ArrowLeft,
  Eye,
  Heart,
  Crown,
  MoreHorizontal,
  Swords,
  Library,
  MessageSquare,
  Dices,
  Sparkles,
  Folder,
  Dna,
  Star,
  Users,
  User,
  Plus
} from 'lucide-react';
import { Character } from '../../types/character';
import { Campaign } from '../../types/campaign';
import { UserProfile } from '../../types/user';
import { RPG_SYSTEMS, RPGSystemId } from '../../types/rpg-systems';
import coverOrdem from '../../assets/systems/cover_ordem_paranormal.png';
import coverDnd from '../../assets/systems/cover_dnd_5e.png';
import coverTormenta from '../../assets/systems/cover_tormenta_20.png';
import coverFabula from '../../assets/systems/cover_fabula_ultima.png';

export interface LibraryModalProps {
  isOpen: boolean;
  characters: Character[];
  user: UserProfile;
  campaigns: Campaign[];
  recentRollsCount?: number;
  onClose: () => void;
  onOpenCharacterSheet: (character: Character) => void;
  onStartCreateCharacter: () => void;
  onOpenProfile?: () => void;
  onOpenShop?: () => void;
  onOpenPublicProfile?: () => void;
  onOpenCreateCampaign?: () => void;
  onOpenCampaignDetail?: (campaign: Campaign) => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  characters,
  user,
  campaigns,
  recentRollsCount = 2,
  onClose,
  onOpenCharacterSheet,
  onStartCreateCharacter,
  onOpenProfile,
  onOpenShop,
  onOpenPublicProfile,
  onOpenCreateCampaign,
  onOpenCampaignDetail,
}) => {
  const [activeItemTab, setActiveItemTab] = useState<'campanhas' | 'sistemas'>('campanhas');

  if (!isOpen) return null;

  const activeCampaign = campaigns[0] || {
    id: 'camp-default',
    title: 'Campanha de Teste Mapeamento',
    systemId: 'ordem-paranormal',
    masterName: user.displayName
  };

  const currentSystemName = RPG_SYSTEMS.find(s => s.id === activeCampaign.systemId)?.name || 'Ordem Paranormal';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0a0714] text-gray-100 select-none">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_10%_15%,rgba(109,40,217,0.45)_0%,rgba(67,24,138,0.22)_35%,transparent_65%),radial-gradient(ellipse_60%_40%_at_85%_25%,rgba(124,58,237,0.16)_0%,transparent_55%)]" />

      <div className="relative max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-10 py-5 min-h-screen flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141122]/90 hover:bg-[#1f1a35] border border-white/10 text-xs text-gray-200 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>

            <button
              type="button"
              onClick={onOpenPublicProfile}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141122]/90 hover:bg-[#1f1a35] border border-white/10 text-xs text-gray-200 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver como visitante</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 bg-[#120f1e]/90 border border-white/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#CBD5E1] flex items-center justify-center shrink-0 shadow-inner">
                  <User className="w-12 h-12 sm:w-14 sm:h-14 fill-[#64748B] text-[#64748B]" />
                </div>
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                    {user.displayName}
                  </h1>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-3 font-sans">
                    <span>{campaigns.length} Campanhas</span>
                    <span className="text-gray-600">•</span>
                    <span>{characters.length} Personagens</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs text-white hover:border-purple-500/40 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 fill-white text-white" />
                  <span>0</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs text-white hover:bg-white/10 hover:border-purple-500/40 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver perfil</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenShop}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs text-white hover:bg-white/10 hover:border-purple-500/40 transition-colors cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Assinar plano</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-purple-500/40 transition-colors cursor-pointer"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#120f1e]/90 border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.45)] flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                <div className="flex items-center gap-3">
                  <Library className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-base font-bold text-white leading-tight">{campaigns.length}</div>
                    <div className="text-[11px] text-gray-400">Campanhas</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Swords className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-base font-bold text-white leading-tight">{characters.length}</div>
                    <div className="text-[11px] text-gray-400">Personagens</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-base font-bold text-white leading-tight">0</div>
                    <div className="text-[11px] text-gray-400">Mensagens</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Dices className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-base font-bold text-white leading-tight">{recentRollsCount}</div>
                    <div className="text-[11px] text-gray-400">Rolagens</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 space-y-4">
              <section className="bg-[#120f1e]/90 border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <Swords className="w-4 h-4 text-purple-400" />
                    <h2 className="font-serif text-sm font-bold text-white">
                      Personagens criados <span className="text-gray-500 font-sans font-normal text-xs">({characters.length})</span>
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onStartCreateCharacter}
                    className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Gerenciar</span>
                  </button>
                </div>

                {characters.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6">Nenhum personagem criado ainda.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pt-2">
                    {characters.map(char => (
                      <div
                        key={char.id}
                        onClick={() => onOpenCharacterSheet(char)}
                        className="group bg-[#0e0c17] rounded-xl overflow-hidden border border-white/[0.08] hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all cursor-pointer flex flex-col"
                      >
                        <div className="aspect-[4/5] w-full overflow-hidden bg-black/60 relative">
                          <img
                            src={char.token?.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'}
                            alt={char.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="bg-[#100d1c] px-3 py-2 border-t border-white/[0.06] text-center sm:text-left">
                          <h3 className="text-xs font-semibold text-white truncate font-serif">
                            {char.name}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="bg-[#120f1e]/90 border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-2 pb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h2 className="font-serif text-sm font-bold text-white">
                    Vitrine de insígnias <span className="text-gray-500 font-sans font-normal text-xs">(0)</span>
                  </h2>
                </div>
                <p className="text-xs text-gray-500 py-2">
                  Nenhuma insígnia conquistada ainda.
                </p>
              </section>

              <section className="bg-[#120f1e]/90 border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <Library className="w-4 h-4 text-purple-400" />
                    <h2 className="font-serif text-sm font-bold text-white">
                      Campanhas <span className="text-gray-500 font-sans font-normal text-xs">(0)</span>
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCreateCampaign}
                    className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Gerenciar</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 py-2">
                  Você ainda não destacou nenhuma campanha.
                </p>
              </section>

              <section className="bg-[#120f1e]/90 border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-2 pb-3">
                  <Users className="w-4 h-4 text-purple-400" />
                  <h2 className="font-serif text-sm font-bold text-white">
                    Meus Itens
                  </h2>
                </div>

                <div className="flex items-center gap-2 pb-4">
                  <button
                    type="button"
                    onClick={() => setActiveItemTab('campanhas')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeItemTab === 'campanhas'
                        ? 'border border-purple-500 bg-purple-950/40 text-purple-200 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                        : 'border border-white/5 bg-white/[0.03] text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5" />
                    <span>Campanhas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveItemTab('sistemas')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeItemTab === 'sistemas'
                        ? 'border border-purple-500 bg-purple-950/40 text-purple-200 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                        : 'border border-white/5 bg-white/[0.03] text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Library className="w-3.5 h-3.5" />
                    <span>Sistemas</span>
                  </button>
                </div>

                {activeItemTab === 'campanhas' ? (
                  <div className="flex flex-wrap gap-3">
                    <div
                      onClick={() => onOpenCampaignDetail?.(activeCampaign as Campaign)}
                      className="w-48 bg-[#151222] border border-white/[0.08] hover:border-purple-500/40 rounded-xl p-3.5 flex flex-col justify-between min-h-[92px] transition-all cursor-pointer relative overflow-hidden group shadow-md"
                    >
                      <div className="z-10">
                        <h3 className="text-xs font-bold text-white truncate font-serif">
                          {activeCampaign.title}
                        </h3>
                        <div className="text-[11px] text-gray-400 mt-1">Mestre</div>
                        <div className="text-[11px] text-gray-500">{currentSystemName}</div>
                      </div>
                      <div className="absolute right-2 bottom-2 opacity-15 group-hover:opacity-30 transition-opacity">
                        <Library className="w-8 h-8 text-purple-400" />
                      </div>
                    </div>

                    <div className="w-36 bg-[#151222] border border-white/[0.08] rounded-xl p-3.5 flex flex-col items-center justify-center min-h-[92px] text-center shadow-md">
                      <Library className="w-6 h-6 text-purple-400 mb-1" />
                      <span className="text-xs text-gray-300 font-medium">Sem campanha</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'ordem', name: 'Ordem Paranormal', cover: coverOrdem },
                      { id: 'dnd', name: 'D&D 5e', cover: coverDnd },
                      { id: 'tormenta', name: 'Tormenta 20', cover: coverTormenta },
                      { id: 'fabula', name: 'Fabula Ultima', cover: coverFabula }
                    ].map(sys => (
                      <div
                        key={sys.id}
                        className="bg-[#151222] border border-white/[0.08] rounded-xl p-2.5 flex items-center gap-2.5 shadow-md"
                      >
                        <img src={sys.cover} alt={sys.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                        <span className="text-xs font-semibold text-white truncate font-serif">{sys.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <aside className="lg:col-span-4 space-y-4">
              <section className="bg-[#120f1e]/90 border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-2 pb-2">
                  <Dna className="w-4 h-4 text-purple-400" />
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-200">
                    DNA DE RPG
                  </h2>
                </div>
                <p className="text-xs text-gray-500 py-1">
                  Sem dados suficientes ainda.
                </p>
              </section>

              <section className="bg-[#120f1e]/90 border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-2 pb-2">
                  <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-200">
                    SISTEMA FAVORITO
                  </h2>
                </div>
                <div className="bg-[#0e0c18] rounded-xl p-2.5 border border-white/[0.06] flex items-center gap-3 mt-1 shadow-sm">
                  <img
                    src={coverOrdem}
                    alt="Ordem Paranormal"
                    className="w-11 h-11 rounded-lg object-cover shadow-sm shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white truncate font-serif">
                      Ordem Paranormal
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      1 campanha(s)
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-[#120f1e]/90 border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-2 pb-2">
                  <Library className="w-4 h-4 text-purple-400" />
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-200">
                    CAMPANHA ATUAL
                  </h2>
                </div>
                <div className="bg-[#0e0c18] rounded-xl p-2.5 border border-white/[0.06] flex items-center gap-3 mt-1 shadow-sm">
                  <div className="w-11 h-11 rounded-lg bg-[#CBD5E1] flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-6 h-6 fill-[#64748B] text-[#64748B]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white truncate font-serif">
                      {activeCampaign.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {currentSystemName}
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-[#120f1e]/90 border border-white/[0.08] rounded-2xl p-5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-2 pb-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-200">
                    GUILDA
                  </h2>
                </div>
                <p className="text-xs text-gray-500 py-1">
                  Não participa de nenhuma guilda.
                </p>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
