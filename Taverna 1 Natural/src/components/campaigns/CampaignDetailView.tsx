import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Play,
  Hourglass,
  Calendar,
  Plus,
  Link2,
  Check,
  Crown,
  BookOpen,
  Castle,
  Feather,
  X,
  Clock,
  Radio,
  User
} from 'lucide-react';
import { Campaign, ScheduledSession, ChronicleChapter } from '../../types/campaign';
import { RPG_SYSTEMS, RPGSystemId } from '../../types/rpg-systems';
import darkageBg from '../../assets/darkage_dashboard_bg.jpg';

interface CampaignDetailViewProps {
  campaign: Campaign;
  currentUserId: string;
  initialTab?: TabType;
  onClose: () => void;
  onUpdateCampaign: (updated: Campaign) => void;
  onOpenCharacterSheet: (characterId: string) => void;
  onLaunchVtt: (campaign: Campaign) => void;
}

type TabType = 'overview' | 'calendar' | 'chronicle';
type CalendarFilter = 'padrao' | 'lua' | 'arcano' | 'forja';

export const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({
  campaign,
  currentUserId,
  initialTab = 'overview',
  onClose,
  onUpdateCampaign,
  onOpenCharacterSheet,
  onLaunchVtt
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [calendarFilter, setCalendarFilter] = useState<CalendarFilter>('padrao');
  const [selectedDay, setSelectedDay] = useState<number>(17);
  const [copiedLink, setCopiedLink] = useState(false);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [sessionDate, setSessionDate] = useState('Sábado');
  const [sessionTime, setSessionTime] = useState('20:00');
  const [sessionNotes, setSessionNotes] = useState('');

  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterSummary, setChapterSummary] = useState('');
  const [chapterContent, setChapterContent] = useState('');

  const [editTitle, setEditTitle] = useState(campaign.title);
  const [editSynopsis, setEditSynopsis] = useState(campaign.synopsis);
  const [editSystemId, setEditSystemId] = useState<RPGSystemId>(campaign.systemId);
  const [editMaxPlayers, setEditMaxPlayers] = useState(campaign.maxPlayers);

  const systemInfo = RPG_SYSTEMS.find((s) => s.id === campaign.systemId) || RPG_SYSTEMS[0];
  const isMaster = campaign.masterId === currentUserId;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showScheduleModal) setShowScheduleModal(false);
        else if (showChapterModal) setShowChapterModal(false);
        else if (showEditModal) setShowEditModal(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showScheduleModal, showChapterModal, showEditModal, onClose]);

  const handleCopyLink = () => {
    const url = `https://darkagerpg.com/Campanhas/join/${campaign.inviteCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleSession = () => {
    onUpdateCampaign({
      ...campaign,
      isSessionActive: !campaign.isSessionActive
    });
  };

  const handleSaveSchedule = () => {
    const nextSession: ScheduledSession = {
      id: `sess-${Date.now()}`,
      date: sessionDate,
      time: sessionTime,
      durationHours: 3.5,
      notes: sessionNotes,
      recurrence: 'weekly'
    };
    onUpdateCampaign({
      ...campaign,
      nextSession
    });
    setShowScheduleModal(false);
  };

  const handleSaveChapter = () => {
    if (!chapterTitle.trim()) return;
    const newChapter: ChronicleChapter = {
      id: `chap-${Date.now()}`,
      title: chapterTitle.trim(),
      date: new Date().toLocaleDateString('pt-BR'),
      summary: chapterSummary,
      content: chapterContent
    };
    onUpdateCampaign({
      ...campaign,
      chronicle: [newChapter, ...campaign.chronicle]
    });
    setChapterTitle('');
    setChapterSummary('');
    setChapterContent('');
    setShowChapterModal(false);
  };

  const handleSaveEdit = () => {
    onUpdateCampaign({
      ...campaign,
      title: editTitle.trim() || campaign.title,
      synopsis: editSynopsis.trim() || campaign.synopsis,
      systemId: editSystemId,
      maxPlayers: editMaxPlayers
    });
    setShowEditModal(false);
  };

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-40 bg-black overflow-y-auto lg:overflow-hidden selection:bg-[#9d6efd]/30 text-white font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={darkageBg}
          alt={campaign.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0e]/95 via-transparent to-[#0a0a0e]/50" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-30 px-3 sm:px-10 py-3 sm:py-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-black/75 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
            title="Voltar"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          {activeTab !== 'overview' && (
            <span className="font-serif font-bold text-xs sm:text-sm text-white/90 tracking-wide drop-shadow truncate max-w-[120px] sm:max-w-md">
              {campaign.title}
            </span>
          )}
        </div>

        <nav className="pointer-events-auto flex items-center gap-0.5 sm:gap-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full p-0.5 sm:p-1 shadow-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full font-serif text-[11px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#9d6efd] text-white shadow-[0_0_16px_rgba(157,110,253,0.5)]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Castle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Visão geral</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full font-serif text-[11px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-[#9d6efd] text-white shadow-[0_0_16px_rgba(157,110,253,0.5)]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Calendário</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chronicle')}
            className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full font-serif text-[11px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
              activeTab === 'chronicle'
                ? 'bg-[#9d6efd] text-white shadow-[0_0_16px_rgba(157,110,253,0.5)]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Feather className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Crônica</span>
          </button>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {activeTab !== 'overview' && (
            <button
              type="button"
              onClick={() => onLaunchVtt(campaign)}
              className="bg-[#9d6efd] hover:bg-[#8b5cf6] text-white text-[11px] sm:text-xs font-serif font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-[0_0_14px_rgba(157,110,253,0.45)] cursor-pointer transition-all active:scale-95"
            >
              <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" />
              <span className="hidden sm:inline">Entrar na sessão</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-black/75 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
            title="Editar campanha"
          >
            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </header>

      <main className="relative z-10 min-h-screen flex flex-col justify-between pt-24 pb-10 px-8 sm:px-12">
        {activeTab === 'overview' && (
          <div className="flex-1 flex flex-col justify-end w-full">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 w-full mt-auto">
              <div className="max-w-2xl flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#9d6efd] text-white font-serif font-semibold text-xs px-3.5 py-1 rounded-full shadow-[0_0_12px_rgba(157,110,253,0.35)] tracking-wide">
                    {systemInfo.name}
                  </span>

                  <span className="bg-black/60 border border-white/10 text-white/90 text-xs px-3.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                    <Crown className="w-3.5 h-3.5 text-[#c084fc]" />
                    <span>{isMaster ? 'Você mestra' : 'Jogador'}</span>
                  </span>

                  <span className="bg-black/60 border border-white/10 text-white/90 text-xs px-3.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        campaign.isSessionActive ? 'bg-emerald-400' : 'bg-gray-400'
                      }`}
                    />
                    <span>{campaign.isSessionActive ? 'Sessão aberta' : 'Sessão encerrada'}</span>
                  </span>

                  <span className="text-xs text-white/60 font-sans ml-1 self-center">
                    Jogada hoje
                  </span>
                </div>

                <h1 className="font-garamond text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-normal leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] max-w-xl break-words">
                  {campaign.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onLaunchVtt(campaign)}
                    className="bg-[#9d6efd] hover:bg-[#8b5cf6] text-white font-serif font-bold text-sm px-7 py-3 rounded-full flex items-center gap-2.5 shadow-[0_0_24px_rgba(157,110,253,0.55)] transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-white text-white" />
                    <span>Entrar na sessão</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleSession}
                    className="bg-black/50 hover:bg-black/75 border border-white/15 text-white/90 hover:text-white font-serif font-medium text-xs sm:text-sm px-5 py-3 rounded-full flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
                  >
                    <Hourglass className="w-4 h-4 text-white/80" />
                    <span>{campaign.isSessionActive ? 'Encerrar sessão' : 'Iniciar sessão'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEditModal(true)}
                    className="bg-black/50 hover:bg-black/75 border border-white/15 text-white/90 hover:text-white font-serif font-medium text-xs sm:text-sm px-5 py-3 rounded-full flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
                  >
                    <Pencil className="w-4 h-4 text-white/80" />
                    <span>Editar</span>
                  </button>
                </div>
              </div>

              <div className="w-full sm:w-[380px] flex flex-col gap-3 shrink-0">
                <div className="rounded-2xl bg-[#0c0c10]/85 backdrop-blur-md border border-white/10 p-4 flex items-center justify-between shadow-2xl hover:border-white/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] tracking-wider text-white/45 uppercase font-sans font-semibold">
                        PRÓXIMA SESSÃO
                      </div>
                      <div className="text-sm font-sans text-white/90 font-medium">
                        {campaign.nextSession
                          ? `${campaign.nextSession.date} às ${campaign.nextSession.time}`
                          : 'Agendar uma sessão'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(true)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                    title="Agendar sessão"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="rounded-2xl bg-[#0c0c10]/85 backdrop-blur-md border border-white/10 p-4 flex flex-col gap-3 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] tracking-wider text-white/45 uppercase font-sans font-semibold">
                        NA MESA
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {campaign.participants.length} jogador{campaign.participants.length > 1 ? 'es' : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="bg-[#9d6efd] hover:bg-[#8b5cf6] text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md transition-all cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Convidar</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer shrink-0"
                        title={copiedLink ? 'Link copiado!' : 'Copiar link'}
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Link2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {campaign.participants.map((p) => (
                      <div
                        key={p.userId}
                        className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#52525b] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                            {p.userAvatar && !p.userAvatar.includes('unsplash') ? (
                              <img
                                src={p.userAvatar}
                                alt={p.userName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-gray-200 fill-gray-200" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{p.userName}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            </div>
                            <div className="text-[11px] text-[#c084fc] font-medium flex items-center gap-1">
                              {p.role === 'master' ? (
                                <>
                                  <Crown className="w-3 h-3 text-[#c084fc]" />
                                  <span>Mestre</span>
                                </>
                              ) : (
                                <span>Jogador</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {p.characterId && (
                          <button
                            type="button"
                            onClick={() => onOpenCharacterSheet(p.characterId!)}
                            className="text-[10px] text-purple-300 hover:text-white bg-purple-950/60 border border-purple-500/30 px-2 py-1 rounded-lg cursor-pointer transition-colors"
                          >
                            Ver Ficha
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-white/45 leading-relaxed pt-2 border-t border-white/5">
                    A mesa está vazia. Convide quem vai jogar com você, pela busca ou por um link.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="flex-1 flex flex-col justify-center max-w-[1720px] w-full mx-auto">
            <div className="rounded-2xl bg-[#0b0b0f]/85 backdrop-blur-md border border-white/10 p-6 flex flex-col gap-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCalendarFilter('padrao')}
                    className={`px-3.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                      calendarFilter === 'padrao'
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Padrão
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarFilter('lua')}
                    className={`px-3.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                      calendarFilter === 'lua'
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Lua
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarFilter('arcano')}
                    className={`px-3.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                      calendarFilter === 'arcano'
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Arcano
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarFilter('forja')}
                    className={`px-3.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                      calendarFilter === 'forja'
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Forja
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="p-1 text-white/50 hover:text-white cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-cinzel text-base font-bold text-white tracking-wide">
                    Novembro 2026
                  </span>
                  <button
                    type="button"
                    className="p-1 text-white/50 hover:text-white cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(true)}
                    className="bg-[#9d6efd] hover:bg-[#8b5cf6] text-white text-xs font-serif font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>AGENDAR</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 flex flex-col gap-4">
                  <div className="grid grid-cols-7 text-center border-b border-white/5 pb-2">
                    {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((day) => (
                      <div key={day} className="text-xs font-serif text-white/40 tracking-wider font-semibold">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((d) => {
                      const isSelected = d === selectedDay;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedDay(d)}
                          className={`min-h-[52px] rounded-xl flex items-center justify-center text-xs font-sans transition-all cursor-pointer ${
                            isSelected
                              ? 'border border-purple-500/60 bg-purple-500/10 text-purple-300 font-bold shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>

                  <div className="w-full py-5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-center gap-2 text-xs text-white/40 font-sans mt-2">
                    <Calendar className="w-4 h-4 text-white/30" />
                    <span>Selecione um dia para ver os eventos</span>
                  </div>
                </div>

                <div className="border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 flex flex-col gap-4">
                  <div className="text-xs font-serif text-white/40 tracking-widest uppercase font-semibold">
                    PRÓXIMOS EVENTOS
                  </div>
                  {campaign.nextSession ? (
                    <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 flex flex-col gap-1.5">
                      <div className="text-xs font-bold text-purple-300">
                        {campaign.nextSession.date} às {campaign.nextSession.time}
                      </div>
                      <div className="text-[11px] text-white/60">
                        Duração: {campaign.nextSession.durationHours}h · Semanal
                      </div>
                      {campaign.nextSession.notes && (
                        <div className="text-[11px] text-white/50 italic pt-1">
                          "{campaign.nextSession.notes}"
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-white/40 mt-2">
                      Nenhum evento neste mês.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chronicle' && (
          <div className="flex-1 flex flex-col justify-center max-w-[1720px] w-full mx-auto">
            <div className="rounded-2xl bg-[#0b0b0f]/85 backdrop-blur-md border border-white/10 p-10 sm:p-14 min-h-[560px] flex flex-col items-center justify-center text-center shadow-2xl">
              <div className="flex flex-col items-center mb-8">
                <div className="flex items-center gap-2 text-purple-300 font-cinzel text-xl font-bold tracking-[0.22em] uppercase">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <span>CRÔNICA</span>
                </div>
                <p className="text-xs text-white/50 font-sans mt-1">
                  Os acontecimentos desta jornada, em ordem cronológica
                </p>
              </div>

              {campaign.chronicle.length === 0 ? (
                <div className="flex flex-col items-center max-w-md">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400/80 mb-5">
                    <BookOpen className="w-7 h-7" />
                  </div>

                  <h3 className="font-cinzel text-lg font-bold text-white">
                    As páginas estão em branco
                  </h3>

                  <p className="text-xs text-white/50 mt-2 leading-relaxed">
                    Comece a registrar os acontecimentos da sua campanha: batalhas, descobertas, encontros e os marcos que definirão essa jornada.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowChapterModal(true)}
                    className="bg-[#9d6efd] hover:bg-[#8b5cf6] text-white font-serif text-xs font-bold px-6 py-2.5 rounded-full uppercase tracking-widest mt-6 shadow-[0_0_16px_rgba(157,110,253,0.4)] cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    + ESCREVER O PRIMEIRO CAPÍTULO
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-2xl flex flex-col gap-4 text-left">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowChapterModal(true)}
                      className="bg-[#9d6efd] hover:bg-[#8b5cf6] text-white font-serif text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Novo Capítulo</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {campaign.chronicle.map((chap) => (
                      <div
                        key={chap.id}
                        className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-cinzel font-bold text-sm text-purple-300">
                            {chap.title}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {chap.date}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          {chap.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel-elevated max-w-sm w-full rounded-2xl p-5 space-y-4 text-xs animate-modal-in border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-cinzel text-base font-bold text-white">Agendar Próxima Sessão</h4>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Data / Dia</label>
              <input
                type="text"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Horário de Início</label>
              <input
                type="text"
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Notas de Preparação</label>
              <textarea
                rows={2}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="glass-button px-3 py-1.5 rounded-lg text-gray-400"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveSchedule}
                className="btn-primary px-4 py-1.5 rounded-lg font-semibold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel-elevated max-w-md w-full rounded-2xl p-5 space-y-3 text-xs animate-modal-in border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-cinzel text-base font-bold text-white">Novo Capítulo da Crônica</h4>
              <button
                type="button"
                onClick={() => setShowChapterModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Título do Capítulo</label>
              <input
                type="text"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="Ex: Capítulo 1 — O Início da Jornada"
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Resumo Narrativo</label>
              <textarea
                rows={3}
                value={chapterSummary}
                onChange={(e) => setChapterSummary(e.target.value)}
                placeholder="Descreva o que os heróis enfrentaram..."
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowChapterModal(false)}
                className="glass-button px-3 py-1.5 rounded-lg text-gray-400"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveChapter}
                className="btn-primary px-4 py-1.5 rounded-lg font-semibold"
              >
                Publicar Capítulo
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel-elevated max-w-md w-full rounded-2xl p-5 space-y-3 text-xs animate-modal-in border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-cinzel text-base font-bold text-white">Editar Campanha</h4>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Título da Campanha</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Sinopse</label>
              <textarea
                rows={3}
                value={editSynopsis}
                onChange={(e) => setEditSynopsis(e.target.value)}
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Sistema RPG</label>
              <select
                value={editSystemId}
                onChange={(e) => setEditSystemId(e.target.value as RPGSystemId)}
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs bg-[#1a1b26]"
              >
                {RPG_SYSTEMS.map((sys) => (
                  <option key={sys.id} value={sys.id}>
                    {sys.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Máximo de Jogadores</label>
              <input
                type="number"
                min={1}
                max={10}
                value={editMaxPlayers}
                onChange={(e) => setEditMaxPlayers(parseInt(e.target.value, 10) || 5)}
                className="glass-input w-full px-2.5 py-1.5 rounded-lg text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="glass-button px-3 py-1.5 rounded-lg text-gray-400"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="btn-primary px-4 py-1.5 rounded-lg font-semibold"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
