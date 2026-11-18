import React, { useState } from 'react';
import { 
  X, 
  Radio, 
  Calendar, 
  Users, 
  BookOpen, 
  Copy, 
  Check, 
  Play, 
  Square, 
  Plus, 
  Clock, 
  UserCheck, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Campaign, ScheduledSession, ChronicleChapter } from '../../types/campaign';
import { RPG_SYSTEMS } from '../../types/rpg-systems';

interface CampaignDetailModalProps {
  isOpen: boolean;
  campaign: Campaign;
  currentUserId: string;
  onClose: () => void;
  onUpdateCampaign: (updated: Campaign) => void;
  onOpenCharacterSheet: (characterId: string) => void;
  onLaunchVtt: (campaign: Campaign) => void;
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({
  isOpen,
  campaign,
  currentUserId,
  onClose,
  onUpdateCampaign,
  onOpenCharacterSheet,
  onLaunchVtt,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'chronicle'>('overview');
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);

  // New session state
  const [newDate, setNewDate] = useState('Sábado');
  const [newTime, setNewTime] = useState('20:00');
  const [newNotes, setNewNotes] = useState('');

  // New chapter state
  const [chapTitle, setChapTitle] = useState('');
  const [chapSummary, setChapSummary] = useState('');
  const [chapContent, setChapContent] = useState('');

  if (!isOpen) return null;

  const systemInfo = RPG_SYSTEMS.find(s => s.id === campaign.systemId) || RPG_SYSTEMS[0];
  const isMaster = campaign.masterId === currentUserId;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(`https://darkagerpg.com/Campanhas/join/${campaign.inviteCode}`);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleToggleSessionState = () => {
    onUpdateCampaign({
      ...campaign,
      isSessionActive: !campaign.isSessionActive
    });
  };

  const handleScheduleSession = () => {
    const session: ScheduledSession = {
      id: 'sess-' + Date.now(),
      date: newDate,
      time: newTime,
      durationHours: 3.5,
      notes: newNotes,
      recurrence: 'weekly'
    };
    onUpdateCampaign({
      ...campaign,
      nextSession: session
    });
    setShowScheduleModal(false);
  };

  const handleAddChapter = () => {
    if (!chapTitle.trim()) return;
    const chapter: ChronicleChapter = {
      id: 'chap-' + Date.now(),
      title: chapTitle.trim(),
      date: new Date().toLocaleDateString('pt-BR'),
      summary: chapSummary,
      content: chapContent
    };
    onUpdateCampaign({
      ...campaign,
      chronicle: [chapter, ...campaign.chronicle]
    });
    setChapTitle('');
    setChapSummary('');
    setChapContent('');
    setShowAddChapterModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="glass-panel-elevated max-w-4xl w-full rounded-2xl relative animate-modal-in border border-white/10 shadow-2xl max-h-[96vh] flex flex-col overflow-hidden">
        
        {/* HERO BANNER SECTION */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden shrink-0">
          <img 
            src={campaign.coverImage} 
            alt={campaign.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141520] via-[#141520]/60 to-black/40" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 glass-button p-1.5 rounded-full text-gray-300 hover:text-white z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full border border-purple-500/40 bg-purple-950/80 text-purple-200 backdrop-blur-md shadow-md">
              {systemInfo.name}
            </span>
            {campaign.isSessionActive && (
              <span className="text-xs font-bold px-3 py-1 rounded-full border border-green-500/40 bg-green-950/80 text-green-300 backdrop-blur-md flex items-center gap-1.5 shadow-md animate-pulse">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span>Sessão em Andamento</span>
              </span>
            )}
          </div>

          {/* Title & Actions inside Banner */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <img 
                  src={campaign.masterAvatar} 
                  alt={campaign.masterName} 
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-purple-500/50" 
                />
                <span className="text-xs text-purple-300 font-semibold drop-shadow">
                  Mestre: {campaign.masterName}
                </span>
              </div>
              <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">
                {campaign.title}
              </h1>
            </div>

            {/* Main Action: Entrar na Sessão */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onLaunchVtt(campaign)}
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl shadow-purple-600/40 hover:scale-105 transition-transform"
              >
                <Radio className="w-4 h-4 text-green-300" />
                <span>Entrar na Sessão (VTT)</span>
              </button>

              {isMaster && (
                <button
                  onClick={handleToggleSessionState}
                  className={`glass-button p-2.5 rounded-xl text-xs flex items-center gap-1.5 font-semibold ${
                    campaign.isSessionActive ? 'text-red-400 border-red-500/30' : 'text-green-400 border-green-500/30'
                  }`}
                  title={campaign.isSessionActive ? 'Encerrar sessão ao vivo' : 'Iniciar sessão ao vivo'}
                >
                  {campaign.isSessionActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls Subheader */}
        <div className="px-6 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#12131a]">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                activeTab === 'calendar' 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendário</span>
            </button>

            <button
              onClick={() => setActiveTab('chronicle')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                activeTab === 'chronicle' 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Crônica ({campaign.chronicle.length})</span>
            </button>
          </div>

          {/* Quick buttons */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleCopyInvite}
              className="glass-button px-3 py-1.5 rounded-lg text-purple-300 flex items-center gap-1.5 hover:text-purple-200"
              title="Copiar link de convite da mesa"
            >
              {copiedInvite ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedInvite ? 'Link Copiado!' : 'Convidar Jogadores'}</span>
            </button>

            {isMaster && (
              <button
                onClick={() => setShowScheduleModal(true)}
                className="glass-button px-3 py-1.5 rounded-lg text-yellow-300 border-yellow-500/20 hover:border-yellow-500/40 flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Agendar Sessão</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB CONTENTS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Sinopse */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <h4 className="font-cinzel text-sm font-bold text-purple-300">Sinopse da Trama</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {campaign.synopsis}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {campaign.genres.map(g => (
                    <span key={g} className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-md">
                      {g}
                    </span>
                  ))}
                  {campaign.playStyles.map(s => (
                    <span key={s} className="text-[10px] text-purple-400/90 bg-purple-500/10 px-2 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Participantes & Fichas da Mesa */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-cinzel text-sm font-bold text-white">
                    Aventureiros na Mesa ({campaign.participants.length} / {campaign.maxPlayers})
                  </h4>
                  <span className="text-[10px] text-gray-400">Clique na ficha para inspecionar</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {campaign.participants.map(p => (
                    <div 
                      key={p.userId}
                      className="p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-purple-500/40 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.userAvatar} 
                          alt={p.userName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/40" 
                        />
                        <div>
                          <div className="font-bold text-xs text-gray-200">{p.userName}</div>
                          <div className="text-[10px] text-purple-400 font-semibold">
                            {p.role === 'master' ? '👑 Mestre' : '🛡️ Jogador'}
                          </div>
                          {p.characterName && (
                            <div className="text-[11px] text-gray-400 font-cinzel mt-0.5">
                              {p.characterName}
                            </div>
                          )}
                        </div>
                      </div>

                      {p.characterId && (
                        <button
                          onClick={() => onOpenCharacterSheet(p.characterId!)}
                          className="text-[10px] btn-primary px-2.5 py-1 rounded-lg font-semibold"
                        >
                          Ver Ficha
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CALENDÁRIO */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              {campaign.nextSession ? (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-950/30 via-black/40 to-purple-950/30 border border-yellow-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-sm font-bold text-yellow-300">Próxima Sessão Agendada</span>
                    <span className="text-xs text-yellow-400 font-bold bg-yellow-500/10 px-2.5 py-0.5 rounded-full border border-yellow-500/30">
                      {campaign.nextSession.date} às {campaign.nextSession.time}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300">
                    Duração estimada: {campaign.nextSession.durationHours} horas · Recorrente semanalmente
                  </div>
                  {campaign.nextSession.notes && (
                    <p className="text-xs text-gray-400 pt-1 italic">
                      "{campaign.nextSession.notes}"
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500 py-6 text-center">Nenhuma sessão agendada no momento.</p>
              )}

              {/* Histórico */}
              <div>
                <h4 className="font-cinzel text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Histórico de Sessões Anteriores
                </h4>
                {campaign.sessionsHistory.length === 0 ? (
                  <p className="text-xs text-gray-500">Nenhum registro de sessão passada.</p>
                ) : (
                  <div className="space-y-2">
                    {campaign.sessionsHistory.map(h => (
                      <div key={h.id} className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs flex justify-between">
                        <span className="text-gray-300">{h.date} às {h.time}</span>
                        <span className="text-purple-400 font-mono">{h.durationHours}h jogadas</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CRÔNICA */}
          {activeTab === 'chronicle' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cinzel text-base font-bold text-white">Diário de Bordo da Campanha</h4>
                  <p className="text-xs text-gray-400">Resumo dos capítulos e acontecimentos mais marcantes.</p>
                </div>
                {isMaster && (
                  <button
                    onClick={() => setShowAddChapterModal(true)}
                    className="btn-primary text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Capítulo</span>
                  </button>
                )}
              </div>

              {campaign.chronicle.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">Nenhum capítulo registrado na crônica ainda.</p>
              ) : (
                <div className="space-y-3">
                  {campaign.chronicle.map(chap => (
                    <div key={chap.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-cinzel font-bold text-sm text-purple-300">{chap.title}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{chap.date}</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{chap.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Modal: Agendar Sessão */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
          <div className="glass-panel-elevated max-w-sm w-full rounded-2xl p-5 space-y-4 text-xs animate-modal-in">
            <h4 className="font-cinzel text-base font-bold text-white">Agendar Próxima Sessão</h4>
            <div>
              <label className="text-gray-400 block mb-1">Data / Dia</label>
              <input 
                type="text" 
                value={newDate} 
                onChange={(e) => setNewDate(e.target.value)} 
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs" 
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Horário de Início</label>
              <input 
                type="text" 
                value={newTime} 
                onChange={(e) => setNewTime(e.target.value)} 
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs" 
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Notas de Preparação</label>
              <textarea 
                rows={2} 
                value={newNotes} 
                onChange={(e) => setNewNotes(e.target.value)} 
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs" 
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowScheduleModal(false)} 
                className="glass-button px-3 py-1.5 rounded-lg text-gray-400"
              >
                Cancelar
              </button>
              <button 
                onClick={handleScheduleSession} 
                className="btn-primary px-4 py-1.5 rounded-lg font-semibold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Capítulo de Crônica */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
          <div className="glass-panel-elevated max-w-md w-full rounded-2xl p-5 space-y-3 text-xs animate-modal-in">
            <h4 className="font-cinzel text-base font-bold text-white">Novo Capítulo da Crônica</h4>
            <div>
              <label className="text-gray-400 block mb-1">Título do Capítulo</label>
              <input 
                type="text" 
                value={chapTitle} 
                onChange={(e) => setChapTitle(e.target.value)} 
                placeholder="Ex: Capítulo 2 — O Encontro nas Sombras"
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold" 
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Resumo Narrativo</label>
              <textarea 
                rows={4} 
                value={chapSummary} 
                onChange={(e) => setChapSummary(e.target.value)} 
                placeholder="Descreva o que os heróis enfrentaram..."
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs" 
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowAddChapterModal(false)} 
                className="glass-button px-3 py-1.5 rounded-lg text-gray-400"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddChapter} 
                className="btn-primary px-4 py-1.5 rounded-lg font-semibold"
              >
                Publicar Capítulo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
