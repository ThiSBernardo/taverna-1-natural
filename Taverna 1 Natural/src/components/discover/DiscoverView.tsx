import React, { useState, useRef } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  UserPlus, 
  Info,
  ChevronDown,
  X,
  Flame,
  Globe
} from 'lucide-react';
import { Campaign } from '../../types/campaign';
import { UserProfile, DayAvailability } from '../../types/user';
import { RPG_SYSTEMS } from '../../types/rpg-systems';

interface DiscoverViewProps {
  campaigns: Campaign[];
  user: UserProfile;
  onOpenCampaignDetail: (campaign: Campaign) => void;
  onRequestJoinCampaign: (campaign: Campaign) => void;
  onAddFriend: (code: string) => void;
  onOpenPublicProfile?: (userCode: string) => void;
}

const DAYS: DayAvailability['day'][] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

const GENRE_DOT_COLORS: Record<string, string> = {
  'Terror': 'bg-purple-400',
  'Sobrevivência': 'bg-emerald-400',
  'Suspense': 'bg-purple-400',
  'Dark Fantasy': 'bg-amber-400',
  'Pós-Apocalíptico': 'bg-slate-400',
  'Mitologia': 'bg-yellow-400',
  'Investigação': 'bg-cyan-400',
  'Fantasia Clássica': 'bg-blue-400'
};

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  campaigns,
  onOpenCampaignDetail,
  onRequestJoinCampaign,
  onAddFriend,
  onOpenPublicProfile,
}) => {
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const initialDiscoverTab = (queryParams.get('tab') as 'campaigns' | 'players') || 'campaigns';
  const [activeTab, setActiveTab] = useState<'campaigns' | 'players'>(initialDiscoverTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  const communityPlayers = [
    {
      id: 'p-1',
      name: 'Helena "Valkyrie" Frost',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      friendCode: 'VALK990',
      discordTag: 'Valkyrie#4412',
      bio: 'Adoro interpretar guerreiras nórdicas e investigadoras forenses. Jogo sério com imersão total.',
      genres: ['Dark Fantasy', 'Horror', 'Investigação'],
      availability: [
        { day: 'Sex', shifts: ['noite'] },
        { day: 'Sab', shifts: ['tarde', 'noite'] },
        { day: 'Dom', shifts: ['tarde'] }
      ]
    },
    {
      id: 'p-2',
      name: 'Ronaldo "DungeonMaster"',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
      friendCode: 'DMMASTER',
      discordTag: 'RonaldoDM#0001',
      bio: 'Mestrando D&D e Tormenta20 há mais de 10 anos. Sempre buscando novos jogadores motivados.',
      genres: ['Fantasia Clássica', 'Dark Fantasy', 'Intriga'],
      availability: [
        { day: 'Seg', shifts: ['noite'] },
        { day: 'Qua', shifts: ['noite'] },
        { day: 'Sex', shifts: ['noite'] }
      ]
    },
    {
      id: 'p-3',
      name: 'Beatriz "Nyx" Rocha',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      friendCode: 'NYX8871',
      discordTag: 'NyxGoth#6666',
      bio: 'Especialista em rituais e horror psicológico. Fã incondicional de Ordem Paranormal.',
      genres: ['Terror Cósmico', 'Suspense', 'Ordem'],
      availability: [
        { day: 'Ter', shifts: ['noite'] },
        { day: 'Qui', shifts: ['noite'] },
        { day: 'Sab', shifts: ['noite'] }
      ]
    }
  ];

  const publicCampaigns = campaigns.filter(c => c.isPublic);

  const filteredCampaigns = publicCampaigns.filter(c => {
    if (selectedSystem !== 'all' && c.systemId !== selectedSystem) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchSynopsis = c.synopsis.toLowerCase().includes(q);
      const matchGenres = c.genres.some(g => g.toLowerCase().includes(q));
      if (!matchTitle && !matchSynopsis && !matchGenres) return false;
    }
    return true;
  });

  const recommendedCampaigns = filteredCampaigns.slice(0, 6);
  const allCampaignsList = filteredCampaigns;

  return (
    <div className="w-full mx-auto px-4 sm:px-8 xl:px-[70px] pt-8 pb-24 select-none animate-fadeIn space-y-7">
      
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center p-1 rounded-2xl bg-[#120f1e] border border-white/10 text-xs shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('campaigns')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-gradient-to-r from-[#8A4FFF] to-[#7839EE] text-white shadow-md shadow-purple-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current text-white" />
            <span>Campanhas Públicas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('players')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'players'
                ? 'bg-gradient-to-r from-[#8A4FFF] to-[#7839EE] text-white shadow-md shadow-purple-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span>Jogadores</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 flex-1 md:flex-initial justify-end">
          <div className="relative flex-1 md:w-80 lg:w-96 flex items-center bg-[#120f1e] border border-white/10 rounded-xl px-3.5 py-2 text-xs shadow-inner focus-within:border-purple-500/50">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar campanhas por nome..."
              className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-full"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterModal(!showFilterModal)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#120f1e] hover:bg-[#1b172a] border border-white/10 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer shadow-sm"
            >
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span>Filtros</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {}}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1b152d] hover:bg-[#261e3f] border border-purple-500/40 text-xs text-purple-200 font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Search className="w-3.5 h-3.5 text-purple-400" />
            <span>Buscar</span>
          </button>
        </div>
      </div>

      {showFilterModal && (
        <div className="p-4 rounded-2xl bg-[#120f1e] border border-white/10 shadow-2xl flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Sistema:</span>
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="bg-[#181524] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-200 focus:outline-none cursor-pointer"
            >
              <option value="all">Todos os Sistemas</option>
              {RPG_SYSTEMS.map(sys => (
                <option key={sys.id} value={sys.id}>{sys.name}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedSystem('all');
              setSearchQuery('');
              setShowFilterModal(false);
            }}
            className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer ml-auto"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-8">
          
          <section className="space-y-4 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-purple-600 rounded-full shrink-0" />
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                  Campanhas que combinam com você
                </h2>
                <p className="text-xs text-gray-400 font-sans mt-0.5">
                  Com base nos seus gêneros favoritos, preferências e disponibilidade
                </p>
              </div>
            </div>

            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x w-full"
            >
              {recommendedCampaigns.map(camp => (
                <div
                  key={camp.id}
                  className="w-[280px] shrink-0 h-[440px] rounded-2xl overflow-hidden bg-[#0e0c18] border border-white/[0.08] hover:border-purple-500/40 hover:shadow-[0_0_24px_rgba(138,79,255,0.2)] transition-all flex flex-col justify-between relative group snap-start shadow-xl"
                >
                  <div className="h-[185px] w-full relative overflow-hidden bg-black/60 shrink-0">
                    <img 
                      src={camp.coverImage} 
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c18] via-[#0e0c18]/30 to-transparent" />

                    {camp.maxPlayers && (
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-gray-200 font-medium">
                          <Users className="w-3 h-3 text-gray-300" />
                          <span>{camp.maxPlayers} vagas</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="px-4 pt-2 pb-3 flex-1 flex flex-col">
                    <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wide truncate leading-tight mt-1">
                      {camp.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      {camp.genres.slice(0, 2).map((g) => (
                        <span key={g} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#181524] border border-white/5 text-[10px] text-gray-300 font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full ${GENRE_DOT_COLORS[g] || 'bg-purple-400'}`} />
                          <span>{g}</span>
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] text-gray-400 font-sans mt-3">
                      {camp.genres.length} gênero{camp.genres.length !== 1 ? 's' : ''} · 1 preferência
                    </div>
                  </div>

                  <div className="border-t border-white/[0.06] pt-3 px-4 pb-3.5 flex items-center justify-between text-[11px] text-gray-400 mt-auto">
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{camp.nextSession?.date || 'Data a definir'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenCampaignDetail(camp)}
                        className="w-7 h-7 rounded-full bg-[#181524] hover:bg-[#231e33] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                        title="Detalhes da mesa"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onRequestJoinCampaign(camp)}
                        className="px-3.5 py-1 rounded-full bg-[#181524] hover:bg-[#231e33] border border-white/10 text-gray-200 text-xs font-medium transition-colors cursor-pointer active:scale-95"
                      >
                        Solicitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-[11px] font-sans font-bold text-gray-400 tracking-widest uppercase px-2">
              Todas as Campanhas
            </span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCampaignsList.map((camp, idx) => (
                <div
                  key={camp.id}
                  className="group rounded-2xl border border-white/[0.08] bg-[#0e0c18] hover:border-purple-500/40 hover:shadow-[0_0_24px_rgba(138,79,255,0.2)] transition-all flex flex-col justify-between overflow-hidden relative shadow-xl"
                >
                  <div className="h-56 w-full relative overflow-hidden bg-black/60 shrink-0">
                    <img 
                      src={camp.coverImage} 
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c18] via-[#0e0c18]/30 to-transparent" />

                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs text-white font-medium">
                        {RPG_SYSTEMS.find(s => s.id === camp.systemId)?.name || 'D&D 5e (2014)'}
                      </span>
                    </div>

                    {idx === 0 && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="w-8 h-8 rounded-full bg-orange-600/90 border border-orange-400/50 flex items-center justify-center text-white shadow-lg shadow-orange-600/40">
                          <Flame className="w-4 h-4 fill-white text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-serif text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mt-1">
                        {camp.synopsis}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {camp.genres.map((g) => (
                        <span key={g} className="text-[10px] text-gray-300 bg-[#181524] border border-white/5 px-2.5 py-0.5 rounded-full font-medium">
                          {g}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <img 
                          src={camp.masterAvatar} 
                          alt={camp.masterName}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20" 
                        />
                        <span className="text-gray-300 text-xs truncate max-w-[120px]">
                          {camp.masterName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenCampaignDetail(camp)}
                          className="px-3 py-1 rounded-lg bg-[#181524] hover:bg-[#231e33] border border-white/10 text-xs text-gray-300 transition-colors cursor-pointer"
                        >
                          Detalhes
                        </button>
                        <button
                          type="button"
                          onClick={() => onRequestJoinCampaign(camp)}
                          className="px-3.5 py-1 rounded-lg bg-[#8A4FFF] hover:bg-[#7839EE] text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all cursor-pointer active:scale-95"
                        >
                          Solicitar Vaga
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

      {activeTab === 'players' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityPlayers.map(player => (
              <div 
                key={player.id}
                className="p-5 rounded-2xl border border-white/10 bg-[#0e0c18] space-y-4 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      <img 
                        src={player.avatar} 
                        alt={player.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/50" 
                      />
                      <span className="w-3 h-3 rounded-full bg-green-500 absolute bottom-0 right-0 border-2 border-black" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{player.name}</h4>
                      <div className="text-[10px] text-purple-400 font-mono">{player.discordTag}</div>
                      <div className="text-[10px] text-gray-500">Código: {player.friendCode}</div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed italic mb-3">
                    "{player.bio}"
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {player.genres.map(g => (
                      <span key={g} className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-md border border-purple-500/20">
                        {g}
                      </span>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center justify-between">
                      <span>Disponibilidade Semanal (M · T · N)</span>
                      <Calendar className="w-3 h-3 text-purple-400" />
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {DAYS.map(d => {
                        const dayData = player.availability.find(a => a.day === d);
                        const hasMorning = dayData?.shifts.includes('manha');
                        const hasAfternoon = dayData?.shifts.includes('tarde');
                        const hasNight = dayData?.shifts.includes('noite');

                        return (
                          <div key={d} className="flex flex-col items-center gap-1">
                            <span className="text-[9px] text-gray-400 font-mono font-semibold">{d}</span>
                            <div className="w-full flex flex-col gap-0.5 bg-black/50 p-0.5 rounded border border-white/5">
                              <div 
                                className={`w-full h-1.5 rounded-xs transition-all ${
                                  hasMorning 
                                    ? 'bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.8)]' 
                                    : 'bg-white/10'
                                }`} 
                                title={`${d} Manhã: ${hasMorning ? 'Livre' : 'Ocupado'}`}
                              />
                              <div 
                                className={`w-full h-1.5 rounded-xs transition-all ${
                                  hasAfternoon 
                                    ? 'bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.8)]' 
                                    : 'bg-white/10'
                                }`} 
                                title={`${d} Tarde: ${hasAfternoon ? 'Livre' : 'Ocupado'}`}
                              />
                              <div 
                                className={`w-full h-1.5 rounded-xs transition-all ${
                                  hasNight 
                                    ? 'bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.8)]' 
                                    : 'bg-white/10'
                                }`} 
                                title={`${d} Noite: ${hasNight ? 'Livre' : 'Ocupado'}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onAddFriend(player.friendCode)}
                    className="flex-1 bg-[#8A4FFF] hover:bg-[#7839EE] text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/30 transition-all active:scale-95"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenPublicProfile) {
                        onOpenPublicProfile(player.friendCode);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-[#181524] hover:bg-[#231e33] border border-white/10 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Biblioteca
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
