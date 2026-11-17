import React, { useState } from 'react';
import { 
  Castle, 
  Search, 
  Plus, 
  Crown,
  Users, 
  Play, 
  Info,
  ChevronRight,
  Shield,
  BookOpen,
  Link as LinkIcon
} from 'lucide-react';
import { Campaign } from '../../types/campaign';
import { RPG_SYSTEMS, RPGSystemId } from '../../types/rpg-systems';
import darkageBg from '../../assets/darkage_dashboard_bg.jpg';
import campaignCardBg from '../../assets/campaign_card_bg.jpg';

interface CampaignListProps {
  campaigns: Campaign[];
  currentUserId: string;
  onOpenCampaignDetail: (campaign: Campaign) => void;
  onOpenCreateCampaign: () => void;
  onOpenInviteModal: () => void;
  onNavigateToDiscover: () => void;
  onSelectSystemForCharacter: (systemId: RPGSystemId) => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  currentUserId,
  onOpenCampaignDetail,
  onOpenCreateCampaign,
  onOpenInviteModal,
  onNavigateToDiscover,
  onSelectSystemForCharacter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const myMasterCampaigns = campaigns.filter(c => c.masterId === currentUserId);
  const myPlayerCampaigns = campaigns.filter(c => 
    c.masterId !== currentUserId && c.participants.some(p => p.userId === currentUserId)
  );

  const filteredMasterCampaigns = myMasterCampaigns.filter(camp => 
    camp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camp.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camp.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPlayerCampaigns = myPlayerCampaigns.filter(camp => 
    camp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camp.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camp.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredCampaign = campaigns.find(c => c.isSessionActive) || campaigns[0];
  const featuredSystem = featuredCampaign 
    ? (RPG_SYSTEMS.find(s => s.id === featuredCampaign.systemId) || RPG_SYSTEMS[0])
    : RPG_SYSTEMS[0];

  return (
    <div className="min-h-screen relative text-gray-100 pb-28">
      <div 
        className="fixed inset-0 bg-cover bg-top bg-fixed pointer-events-none"
        style={{ backgroundImage: `url(${darkageBg})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0B0E14]/30 via-transparent to-[#0B0E14] pointer-events-none" />

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 pt-12 relative z-10 space-y-16">
        
        {featuredCampaign && (
          <section className="max-w-4xl pt-4">
            <div className="flex items-center gap-2.5 text-xs font-semibold tracking-widest text-purple-300/90 uppercase mb-4">
              <span className="w-5 h-0.5 bg-purple-500 inline-block" />
              <span>CONTINUAR DE ONDE PAROU</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-xl mb-4 leading-tight truncate max-w-4xl">
              {featuredCampaign.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mb-8">
              <span className="px-3.5 py-1 rounded-full border border-white/20 bg-black/40 text-xs text-white font-medium backdrop-blur-sm">
                {featuredSystem.name}
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-purple-300 font-medium">
                <Crown className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
                <span>{featuredCampaign.masterId === currentUserId ? 'Você mestra' : `Mestre: ${featuredCampaign.masterName}`}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-purple-300/90 font-medium">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>{featuredCampaign.participants.length} {featuredCampaign.participants.length === 1 ? 'jogador' : 'jogadores'}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Última sessão há 3 dias</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenCampaignDetail(featuredCampaign)}
                className="rounded-full bg-[#8A4FFF] hover:bg-[#7839EE] text-white font-semibold text-xs sm:text-sm px-7 py-2.5 flex items-center gap-2 shadow-[0_0_24px_rgba(138,79,255,0.4)] cursor-pointer active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Entrar</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenCampaignDetail(featuredCampaign)}
                className="rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-medium text-xs sm:text-sm px-6 py-2.5 flex items-center gap-2 cursor-pointer transition-all backdrop-blur-sm"
              >
                <Info className="w-4 h-4 text-slate-300" />
                <span>Detalhes</span>
              </button>
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
            <div className="flex items-center gap-2.5">
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
                Suas campanhas
              </h2>
              <span className="w-5 h-5 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-[11px] text-slate-400 font-semibold">
                {myMasterCampaigns.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative min-w-[200px] sm:min-w-[240px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar mesas..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 backdrop-blur-sm"
                />
              </div>

              <button
                type="button"
                onClick={onOpenCreateCampaign}
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-950/40 transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Campanha</span>
              </button>
            </div>
          </div>

          {filteredMasterCampaigns.length === 0 ? (
            <div className="p-10 text-center rounded-2xl border border-white/5 bg-[#121826]/40 text-gray-400 text-xs space-y-3 max-w-md">
              <Castle className="w-8 h-8 text-gray-600 mx-auto" />
              <p className="font-spectral text-sm text-gray-300">Você ainda não mestra nenhuma campanha.</p>
              <button
                type="button"
                onClick={onOpenCreateCampaign}
                className="btn-primary text-xs px-4 py-2 rounded-lg"
              >
                Criar Nova Mesa
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMasterCampaigns.map(camp => (
                <CampaignCard 
                  key={camp.id} 
                  campaign={camp} 
                  onClick={() => onOpenCampaignDetail(camp)}
                />
              ))}
            </div>
          )}
        </section>

        {myPlayerCampaigns.length > 0 && (
          <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between gap-4 pb-2">
              <div className="flex items-center gap-2.5">
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
                  Campanhas que Participo
                </h2>
                <span className="w-5 h-5 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-[11px] text-slate-400 font-semibold">
                  {myPlayerCampaigns.length}
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenInviteModal}
                className="glass-button text-xs text-gray-300 hover:text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5 text-purple-400" />
                <span>Entrar por Código</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPlayerCampaigns.map(camp => (
                <CampaignCard 
                  key={camp.id} 
                  campaign={camp} 
                  onClick={() => onOpenCampaignDetail(camp)}
                />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-yellow-400" />
              <div>
                <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
                  Sistemas Disponíveis
                </h2>
                <p className="text-xs text-gray-400">Selecione um sistema para criar uma nova ficha ou explorar regras</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateToDiscover}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Ver Compêndio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {RPG_SYSTEMS.map(sys => (
              <button
                type="button"
                key={sys.id}
                onClick={() => onSelectSystemForCharacter(sys.id)}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/60 shadow-lg hover:shadow-purple-950/40 hover:scale-[1.03] transition-all duration-300 text-left flex flex-col justify-end p-4 cursor-pointer"
              >
                <img
                  src={sys.coverImage}
                  alt={sys.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-75 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/60 to-transparent" />
                
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-purple-300 bg-purple-950/80 border border-purple-500/30 px-2 py-0.5 rounded-full inline-block backdrop-blur-sm">
                    {sys.badge}
                  </span>
                  <h3 className="font-cinzel font-bold text-sm text-white group-hover:text-purple-200 transition-colors line-clamp-1">
                    {sys.name}
                  </h3>
                  <p className="font-spectral text-[11px] text-gray-300 line-clamp-2 leading-tight">
                    {sys.description}
                  </p>
                  <div className="pt-2 text-[9px] text-purple-300/80 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                    <span>{sys.attributeKeys.join(' · ')}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

const CampaignCard: React.FC<{ campaign: Campaign; onClick: () => void }> = ({
  campaign,
  onClick,
}) => {
  const systemInfo = RPG_SYSTEMS.find(s => s.id === campaign.systemId) || RPG_SYSTEMS[0];

  return (
    <div 
      onClick={onClick}
      className="group rounded-2xl border border-white/10 bg-[#0e1117] overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-950/40 transition-all duration-300 cursor-pointer relative aspect-[16/10] flex flex-col justify-between p-4"
    >
      <img 
        src={campaign.coverImage || campaignCardBg} 
        alt={campaign.title} 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
        onError={(e) => {
          (e.target as HTMLImageElement).src = campaignCardBg;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex justify-end">
        <div className="flex items-center gap-1.5 text-xs text-purple-300 font-medium drop-shadow">
          <Crown className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
          <Users className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-xs">{campaign.participants.length}</span>
        </div>
      </div>

      <div className="relative z-10 space-y-1">
        <h3 className="font-cinzel font-bold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1 drop-shadow-md">
          {campaign.title}
        </h3>
        <div className="text-xs text-slate-300 flex items-center gap-2">
          <span>{systemInfo.name}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">há 3 dias</span>
        </div>
      </div>
    </div>
  );
};
