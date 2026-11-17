import React, { useState } from 'react';
import { 
  Compass, 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  Check, 
  UserPlus, 
  Sparkles,
  ChevronRight,
  Shield
} from 'lucide-react';
import { Campaign } from '../../types/campaign';
import { UserProfile, DayAvailability } from '../../types/user';
import { RPG_SYSTEMS, RPGSystemId } from '../../types/rpg-systems';

interface DiscoverViewProps {
  campaigns: Campaign[];
  user: UserProfile;
  onOpenCampaignDetail: (campaign: Campaign) => void;
  onRequestJoinCampaign: (campaign: Campaign) => void;
  onAddFriend: (code: string) => void;
  onOpenPublicProfile?: (userCode: string) => void;
}

const DAYS: DayAvailability['day'][] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  campaigns,
  user,
  onOpenCampaignDetail,
  onRequestJoinCampaign,
  onAddFriend,
  onOpenPublicProfile,
}) => {
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const initialDiscoverTab = (queryParams.get('tab') as 'campaigns' | 'players') || 'players';
  const [activeTab, setActiveTab] = useState<'campaigns' | 'players'>(initialDiscoverTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState(false);

  // Mock players in community
  const communityPlayers: {
    id: string;
    name: string;
    avatar: string;
    friendCode: string;
    discordTag: string;
    bio: string;
    genres: string[];
    availability: DayAvailability[];
  }[] = [
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

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(c => {
    if (!c.isPublic) return false;
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

  return (
    <div className="space-y-6 pb-32 max-w-[1240px] mx-auto px-6 lg:px-12 pt-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-purple-400" />
            <h1 className="font-cinzel text-2xl font-bold text-white tracking-wide">
              Descubra & Comunidade
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Encontre novas mesas abertas para jogar e conecte-se com jogadores da comunidade brasileira.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'campaigns'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Campanhas Públicas ({filteredCampaigns.length})
          </button>

          <button
            onClick={() => setActiveTab('players')}
            className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'players'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Catálogo de Jogadores
          </button>
        </div>
      </div>

      {/* TAB 1: CAMPANHAS PÚBLICAS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar campanha por título, gênero (ex: Terror, D&D)..."
                  className="glass-input w-full pl-9 pr-3 py-2 text-xs rounded-xl"
                />
              </div>

              {/* System selector */}
              <select
                value={selectedSystem}
                onChange={(e) => setSelectedSystem(e.target.value)}
                className="glass-input px-3 py-2 text-xs rounded-xl bg-black/50 text-gray-200 w-full sm:w-auto"
              >
                <option value="all">Todos os Sistemas</option>
                {RPG_SYSTEMS.map(sys => (
                  <option key={sys.id} value={sys.id}>{sys.name}</option>
                ))}
              </select>

            </div>

            {/* Toggle: Considerar minha disponibilidade */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                <input
                  type="checkbox"
                  checked={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
                <span>Considerar minha disponibilidade nas sugestões</span>
              </label>

              <span className="text-[10px] text-purple-400">
                Cruza seus horários livres cadastrados com as datas das sessões
              </span>
            </div>
          </div>

          {/* Grid of Public Campaigns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCampaigns.map(camp => (
              <div
                key={camp.id}
                className="group rounded-2xl border border-white/10 bg-[#141520]/80 backdrop-blur-md overflow-hidden hover:border-purple-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full relative overflow-hidden bg-purple-950/40">
                    <img 
                      src={camp.coverImage} 
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141520] via-[#141520]/50 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-400/40 bg-purple-950/80 text-purple-200 backdrop-blur-md">
                        {RPG_SYSTEMS.find(s => s.id === camp.systemId)?.name || 'RPG'}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-3 flex items-center gap-2">
                      <img 
                        src={camp.masterAvatar} 
                        alt={camp.masterName}
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-purple-500/40" 
                      />
                      <span className="text-xs text-gray-200 font-semibold drop-shadow">
                        Mestre: {camp.masterName}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-cinzel text-base font-bold text-white group-hover:text-purple-300 line-clamp-1">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {camp.synopsis}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {camp.genres.map(g => (
                        <span key={g} className="text-[10px] text-gray-300 bg-white/5 px-2 py-0.5 rounded-md">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>{camp.participants.length} / {camp.maxPlayers} vagas</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenCampaignDetail(camp)}
                      className="glass-button px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white"
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => onRequestJoinCampaign(camp)}
                      className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
                    >
                      Solicitar Vaga
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: CATÁLOGO DE JOGADORES */}
      {activeTab === 'players' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {communityPlayers.map(player => (
              <div 
                key={player.id}
                className="p-5 rounded-2xl border border-white/10 bg-[#141520]/80 glass-panel space-y-4 flex flex-col justify-between"
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
                    onClick={() => onAddFriend(player.friendCode)}
                    className="flex-1 btn-primary py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenPublicProfile) {
                        onOpenPublicProfile(player.friendCode);
                      }
                    }}
                    className="glass-button px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white cursor-pointer"
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
