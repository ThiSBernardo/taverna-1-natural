import React, { useState, useRef } from 'react';
import { 
  Bookmark,
  Plus, 
  Key, 
  Search, 
  Dices, 
  Users, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  User, 
  Globe, 
  X, 
  Image as ImageIcon,
  Copy,
  Sparkles
} from 'lucide-react';
import { Guild, GuildAccessType } from '../../types/guild';

interface GuildsViewProps {
  guilds: Guild[];
  currentUserId: string;
  onJoinGuild: (guildId: string) => void;
  onCreateGuild: (guild: Guild) => void;
}

const GUILD_COLOR_PALETTE = [
  '#E4BA81',
  '#E07A5F',
  '#E89D71',
  '#E9D874',
  '#81B29A',
  '#74C69D',
  '#64B5F6',
  '#9D81BA',
  '#A3B18A',
  '#DDA15E',
  '#E5989B',
  '#A855F7'
];

export const GuildsView: React.FC<GuildsViewProps> = ({
  guilds,
  currentUserId,
  onJoinGuild,
  onCreateGuild,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedDetailGuild, setSelectedDetailGuild] = useState<Guild | null>(null);

  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'featured' | 'members' | 'name'>('featured');

  const [inviteInput, setInviteInput] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formBanner, setFormBanner] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formColor, setFormColor] = useState('#E4BA81');
  const [formAccess, setFormAccess] = useState<GuildAccessType>('livre');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const myGuilds = guilds.filter(g => g.isMember || g.leaderId === currentUserId);

  const filteredDiscoverGuilds = guilds.filter(g => {
    if (filterType === 'livre' && g.accessType !== 'livre') return false;
    if (filterType === 'aprovacao' && g.accessType !== 'aprovacao') return false;
    if (filterType === 'convite' && g.accessType !== 'convite') return false;
    if (filterType === 'verificadas' && !g.isVerified) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = g.name.toLowerCase().includes(q);
      const matchTag = g.tag.toLowerCase().includes(q);
      const matchDesc = g.description.toLowerCase().includes(q);
      if (!matchName && !matchTag && !matchDesc) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortOption === 'featured') {
      if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
      return b.memberCount - a.memberCount;
    }
    if (sortOption === 'members') {
      return b.memberCount - a.memberCount;
    }
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const handleRandomGuild = () => {
    if (filteredDiscoverGuilds.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredDiscoverGuilds.length);
    setSelectedDetailGuild(filteredDiscoverGuilds[randomIndex]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setFormImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setFormBanner(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getMissingFields = () => {
    const missing: string[] = [];
    if (!formName.trim()) missing.push('um nome');
    if (!formImage.trim() && !formTag.trim()) missing.push('a imagem');
    if (!formDesc.trim()) missing.push('a descrição');
    if (!formTag.trim() || formTag.length < 2) missing.push('uma sigla');
    return missing;
  };

  const isFormValid = formName.trim().length > 0 && formDesc.trim().length > 0 && formTag.trim().length >= 2;

  const handleCreateGuild = () => {
    if (!isFormValid) return;

    const newGuild: Guild = {
      id: 'guild-' + Date.now(),
      name: formName.trim(),
      tag: formTag.trim().toUpperCase(),
      description: formDesc.trim(),
      avatarUrl: formImage || undefined,
      bannerImage: formBanner || undefined,
      themeColor: formColor,
      accessType: formAccess,
      isVerified: false,
      memberCount: 1,
      campaignsCount: 0,
      leaderId: currentUserId,
      leaderName: 'ThiSBernardo',
      rules: 'Respeito e colaboração entre aventureiros.',
      isMember: true
    };

    onCreateGuild(newGuild);
    setShowCreateModal(false);
    setFormName('');
    setFormTag('');
    setFormDesc('');
    setFormImage('');
    setFormBanner('');
    setFormColor('#E4BA81');
    setFormAccess('livre');
  };

  const handlePasteInvite = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInviteInput(text.trim());
      }
    } catch {
      setInviteError('Não foi possível acessar a área de transferência.');
    }
  };

  const handleJoinByInvite = () => {
    if (!inviteInput.trim()) return;

    const cleaned = inviteInput.trim().toUpperCase();
    const target = guilds.find(g => 
      g.tag.toUpperCase() === cleaned || 
      g.id.toUpperCase() === cleaned ||
      g.name.toUpperCase().includes(cleaned)
    );

    if (target) {
      onJoinGuild(target.id);
      setShowInviteModal(false);
      setInviteInput('');
      setInviteError(null);
    } else {
      const matchedFirst = guilds[0];
      if (matchedFirst) {
        onJoinGuild(matchedFirst.id);
        setShowInviteModal(false);
        setInviteInput('');
        setInviteError(null);
      } else {
        setInviteError('Código de convite não encontrado.');
      }
    }
  };

  const renderAccessBadge = (type: GuildAccessType) => {
    if (type === 'livre') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-[10px] text-emerald-400 font-medium">
          <Globe className="w-2.5 h-2.5 text-emerald-400" />
          <span>Entrada livre</span>
        </span>
      );
    }
    if (type === 'aprovacao') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 text-[10px] text-gray-300 font-medium">
          <User className="w-2.5 h-2.5 text-gray-400" />
          <span>Pede aprovação</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 text-[10px] text-gray-300 font-medium">
        <Lock className="w-2.5 h-2.5 text-gray-400" />
        <span>Só por convite</span>
      </span>
    );
  };

  const missingFields = getMissingFields();

  return (
    <div className="w-full mx-auto px-4 sm:px-8 xl:px-[70px] pt-14 pb-16 select-none animate-fadeIn space-y-8">
      
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-700/40 flex items-center justify-center text-purple-400 shadow-[0_0_16px_rgba(139,92,246,0.3)] shrink-0">
            <Bookmark className="w-5 h-5 fill-purple-400 text-purple-400" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Guildas
            </h1>
            <p className="text-xs text-gray-400 font-sans mt-0.5">
              Reúna sua gente em um só lugar.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4.5 py-2 rounded-full bg-[#181524] hover:bg-[#231e33] border border-white/10 text-xs text-gray-200 transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <Key className="w-3.5 h-3.5 text-gray-400" />
            <span>Entrar com convite</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#8A4FFF] hover:bg-[#7839EE] text-white text-xs font-serif font-bold shadow-[0_0_16px_rgba(138,79,255,0.4)] transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nova guilda</span>
          </button>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-serif text-base font-bold text-white tracking-wide">
          Suas guildas
        </h2>

        {myGuilds.length === 0 ? (
          <div className="w-full h-[307px] min-h-[307px] bg-[#100d1a]/85 border border-white/[0.06] rounded-2xl px-6 text-center flex flex-col items-center justify-center shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#23143c] border border-purple-800/40 flex items-center justify-center mb-4 text-[#a855f7] shadow-[0_0_24px_rgba(138,79,255,0.25)]">
              <Bookmark className="w-6 h-6 fill-[#a855f7] text-[#a855f7]" />
            </div>

            <h3 className="text-base font-bold text-white font-sans tracking-tight">
              Você ainda não faz parte de nenhuma guilda
            </h3>

            <p className="text-xs text-gray-400 max-w-lg mt-1.5 mb-6 text-center leading-relaxed font-sans">
              Crie sua própria irmandade, entre com um código de convite ou veja as que estão abertas logo abaixo.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#8A4FFF] hover:bg-[#7839EE] text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Nova guilda</span>
              </button>

              <button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#181524] hover:bg-[#241f35] border border-white/10 text-gray-300 text-xs transition-colors cursor-pointer active:scale-95"
              >
                <Key className="w-3.5 h-3.5 text-gray-400" />
                <span>Entrar com convite</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent snap-x">
            {myGuilds.map(guild => (
              <div
                key={guild.id}
                className="w-[265px] sm:w-[280px] shrink-0 h-[440px] rounded-2xl overflow-hidden bg-[#0e0c18] border border-white/[0.08] hover:border-purple-500/40 hover:shadow-[0_0_24px_rgba(138,79,255,0.2)] transition-all flex flex-col justify-between relative group snap-start shadow-xl"
              >
                <div className="h-[185px] w-full relative overflow-hidden bg-black/60 shrink-0">
                  {guild.bannerImage ? (
                    <img 
                      src={guild.bannerImage} 
                      alt={guild.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div 
                      className="w-full h-full"
                      style={{ 
                        background: `radial-gradient(circle at 30% 30%, ${guild.themeColor}88 0%, rgba(14,12,24,0.95) 75%)` 
                      }} 
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c18] via-[#0e0c18]/40 to-transparent" />

                  <div className="absolute top-3.5 left-3.5 z-10">
                    <div 
                      className="w-14 h-14 rounded-2xl bg-black/85 border border-white/15 p-1 flex items-center justify-center shadow-lg overflow-hidden"
                      style={{ borderColor: `${guild.themeColor}60` }}
                    >
                      {guild.avatarUrl ? (
                        <img src={guild.avatarUrl} alt={guild.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="font-serif font-bold text-base text-white" style={{ color: guild.themeColor }}>
                          {guild.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-serif text-3xl font-extrabold text-white/[0.14] absolute top-4 right-4 pointer-events-none tracking-widest uppercase">
                    {guild.tag}
                  </span>
                </div>

                <div className="px-4 pt-2 pb-3 flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif text-base font-bold text-white truncate leading-tight">
                      {guild.name}
                    </h3>
                    {guild.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-[#38bdf8] fill-[#0284c7] shrink-0" />
                    )}
                  </div>

                  <div className="mt-1.5">
                    {renderAccessBadge(guild.accessType)}
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-4 leading-relaxed mt-2.5">
                    {guild.description}
                  </p>
                </div>

                <div className="border-t border-white/[0.06] pt-3 px-4 pb-3.5 flex items-center justify-between text-[11px] text-gray-400 mt-auto">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-purple-300">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span>{guild.memberCount} membro{guild.memberCount !== 1 ? 's' : ''}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-purple-300">
                      <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                      <span>{guild.campaignsCount ?? 0} campanha{guild.campaignsCount !== 1 ? 's' : ''}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedDetailGuild(guild)}
                    className="text-gray-300 hover:text-white flex items-center gap-1 font-medium transition-colors cursor-pointer"
                  >
                    <span>Detalhes</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 pt-9">
        <div>
          <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <span>Descobrir</span>
            <span className="bg-[#120f1e] border border-white/10 text-gray-400 text-xs font-sans px-2.5 py-0.5 rounded-full font-normal">
              20
            </span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'livre', label: 'Entrada livre' },
              { id: 'aprovacao', label: 'Pede aprovação' },
              { id: 'convite', label: 'Só convite' },
              { id: 'verificadas', label: 'Verificadas' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  filterType === f.id
                    ? 'bg-[#241d38] border border-purple-500/60 text-purple-200 shadow-[0_0_12px_rgba(138,79,255,0.25)]'
                    : 'bg-[#120f1e] hover:bg-[#1b172a] border border-white/5 text-gray-400 hover:text-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
            <div className="relative flex items-center bg-[#120f1e] border border-white/10 rounded-full px-3.5 py-1.5 text-xs shadow-inner">
              <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome ou tem"
                className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-36 sm:w-44"
              />
              <kbd className="text-[10px] text-gray-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded ml-1 font-mono">
                /
              </kbd>
            </div>

            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'featured' | 'members' | 'name')}
                className="bg-[#120f1e] hover:bg-[#1b172a] border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-300 focus:outline-none cursor-pointer appearance-none pr-8 shadow-sm"
              >
                <option value="featured" className="bg-[#120f1e] text-white">Em destaque</option>
                <option value="members" className="bg-[#120f1e] text-white">Mais membros</option>
                <option value="name" className="bg-[#120f1e] text-white">Nome (A-Z)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-[10px]">
                ▼
              </div>
            </div>

            <button
              type="button"
              onClick={handleRandomGuild}
              className="bg-[#120f1e] hover:bg-[#1b172a] border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-300 flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 shadow-sm"
            >
              <Dices className="w-3.5 h-3.5 text-purple-400" />
              <span>Sortear</span>
            </button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent snap-x"
        >
          {filteredDiscoverGuilds.map(guild => (
            <div
              key={guild.id}
              className="w-[280px] shrink-0 h-[440px] rounded-2xl overflow-hidden bg-[#0e0c18] border border-white/[0.08] hover:border-purple-500/40 hover:shadow-[0_0_24px_rgba(138,79,255,0.2)] transition-all flex flex-col justify-between relative group snap-start shadow-xl"
            >
              <div className="h-[185px] w-full relative overflow-hidden bg-black/60 shrink-0">
                {guild.bannerImage ? (
                  <img 
                    src={guild.bannerImage} 
                    alt={guild.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div 
                    className="w-full h-full"
                    style={{ 
                      background: `radial-gradient(circle at 30% 30%, ${guild.themeColor}88 0%, rgba(14,12,24,0.95) 75%)` 
                    }} 
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c18] via-[#0e0c18]/40 to-transparent" />

                <div className="absolute top-3.5 left-3.5 z-10">
                  <div 
                    className="w-14 h-14 rounded-2xl bg-black/85 border border-white/15 p-1 flex items-center justify-center shadow-lg overflow-hidden"
                    style={{ borderColor: `${guild.themeColor}60` }}
                  >
                    {guild.avatarUrl ? (
                      <img src={guild.avatarUrl} alt={guild.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="font-serif font-bold text-base text-white" style={{ color: guild.themeColor }}>
                        {guild.tag}
                      </span>
                    )}
                  </div>
                </div>

                <span className="font-serif text-3xl font-extrabold text-white/[0.14] absolute top-4 right-4 pointer-events-none tracking-widest uppercase">
                  {guild.tag}
                </span>
              </div>

              <div className="px-4 pt-2 pb-3 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-base font-bold text-white truncate leading-tight">
                    {guild.name}
                  </h3>
                  {guild.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-[#38bdf8] fill-[#0284c7] shrink-0" />
                  )}
                </div>

                <div className="mt-1.5">
                  {renderAccessBadge(guild.accessType)}
                </div>

                <p className="text-xs text-gray-400 line-clamp-4 leading-relaxed mt-2.5">
                  {guild.description}
                </p>
              </div>

              <div className="border-t border-white/[0.06] pt-3 px-4 pb-3.5 flex items-center justify-between text-[11px] text-gray-400 mt-auto">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-purple-300">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>{guild.memberCount} membro{guild.memberCount !== 1 ? 's' : ''}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-300">
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    <span>{guild.campaignsCount ?? 0} campanha{guild.campaignsCount !== 1 ? 's' : ''}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDetailGuild(guild)}
                  className="text-gray-300 hover:text-white flex items-center gap-1 font-medium transition-colors cursor-pointer"
                >
                  <span>Detalhes</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-[1020px] bg-[#110e1c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-modal-in">
            <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-white/[0.08] shrink-0">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Nova guilda
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Monte sua irmandade e chame aventureiros.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 flex flex-col space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                  COMO ELA VAI APARECER
                </span>

                <div 
                  className="rounded-3xl overflow-hidden bg-[#100d1c] border border-white/10 relative flex flex-col justify-between p-6 min-h-[430px] shadow-2xl"
                  style={{ borderTop: `4px solid ${formColor}` }}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div 
                        className="w-20 h-20 rounded-2xl flex items-center justify-center font-serif text-3xl font-bold shadow-lg overflow-hidden shrink-0 border border-white/15"
                        style={{ backgroundColor: formColor }}
                      >
                        {formImage ? (
                          <img src={formImage} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-black/85 font-bold tracking-wider">
                            {formTag || 'ND'}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className="bg-black/60 text-[10px] text-gray-300 px-2.5 py-0.5 rounded-full border border-white/10">
                          Nova
                        </span>
                        <span className="font-serif text-3xl font-extrabold text-white/[0.14] pointer-events-none tracking-widest">
                          {formTag || '??'}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-serif text-2xl font-bold text-white mt-6 truncate">
                      {formName || 'Nome da guilda'}
                    </h4>

                    <div className="mt-2.5">
                      {renderAccessBadge(formAccess)}
                    </div>

                    <p className="text-xs text-gray-400 mt-3 line-clamp-4 leading-relaxed">
                      {formDesc || 'A descrição da guilda aparece aqui.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-2.5">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span>1 membro</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                        <span>0 campanhas</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500">
                      {formAccess === 'livre' && 'Qualquer pessoa entra na hora.'}
                      {formAccess === 'aprovacao' && 'Entrada sujeita à aprovação de um moderador.'}
                      {formAccess === 'convite' && 'Somente quem tiver link ou convite entra.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4.5">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                    NOME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ex.: Ordem da Chama"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <div className="absolute right-3 top-3 flex items-center gap-1 text-[10px] text-blue-300 bg-[#161226] border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                      <span>&gt;</span>
                      <span>{formName.length}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3.5 items-center">
                  <div className="col-span-4">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                      IMAGEM
                    </label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-2xl border border-dashed border-white/20 hover:border-purple-500/50 bg-black/40 hover:bg-black/60 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden"
                    >
                      {formImage ? (
                        <img src={formImage} alt="Guild" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-[10px] text-gray-500 mt-0.5">+</span>
                        </>
                      )}
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </div>
                  </div>

                  <div className="col-span-8">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                      SIGLA <span className="text-gray-500 normal-case font-sans">2 a 6 letras</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                      placeholder="O C"
                      className="w-full text-center uppercase font-mono tracking-widest text-base bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                      DESCRIÇÃO
                    </label>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {formDesc.length}/500
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Quem joga aqui, que tipo de mesa aparece e que clima o grupo procura..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                    BANNER <span className="text-gray-500 normal-case font-sans">opcional</span>
                  </label>
                  <div 
                    onClick={() => bannerInputRef.current?.click()}
                    className="border border-dashed border-purple-500/40 bg-purple-950/15 hover:bg-purple-950/25 rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 text-xs text-gray-300 cursor-pointer transition-colors relative overflow-hidden"
                  >
                    {formBanner ? (
                      <span className="text-purple-200 truncate">Banner carregado com sucesso</span>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 text-purple-400" />
                        <span>Adicionar banner</span>
                      </>
                    )}
                    <div className="absolute right-3 w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <input 
                      ref={bannerInputRef} 
                      type="file" 
                      accept="image/*" 
                      onChange={handleBannerUpload} 
                      className="hidden" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                    QUEM PODE ENTRAR
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFormAccess('livre')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        formAccess === 'livre'
                          ? 'border-purple-500 bg-purple-950/40 text-purple-200 shadow-[0_0_12px_rgba(138,79,255,0.25)]'
                          : 'border-white/5 bg-black/30 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Pública</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Entrada livre</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormAccess('aprovacao')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        formAccess === 'aprovacao'
                          ? 'border-purple-500 bg-purple-950/40 text-purple-200 shadow-[0_0_12px_rgba(138,79,255,0.25)]'
                          : 'border-white/5 bg-black/30 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <User className="w-3.5 h-3.5" />
                        <span>Moderada</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Pede aprovação</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormAccess('convite')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        formAccess === 'convite'
                          ? 'border-purple-500 bg-purple-950/40 text-purple-200 shadow-[0_0_12px_rgba(138,79,255,0.25)]'
                          : 'border-white/5 bg-black/30 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Privada</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Só por convite</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                    COR DA GUILDA
                  </label>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {GUILD_COLOR_PALETTE.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormColor(color)}
                        className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                          formColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#110e1c]' : 'hover:scale-110 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20 cursor-pointer opacity-80 hover:opacity-100 hover:scale-110 transition-transform"
                      style={{
                        background: 'conic-gradient(from 180deg, #ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee, #ff0000)'
                      }}
                      title="Personalizado"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 border-t border-white/[0.08] bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-gray-400 text-center sm:text-left">
                {isFormValid ? (
                  <span className="text-emerald-400 font-medium">Tudo pronto para fundar a guilda!</span>
                ) : (
                  <span>Falta {missingFields.join(', ')}.</span>
                )}
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={!isFormValid}
                  onClick={handleCreateGuild}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#8A4FFF] hover:bg-[#7839EE] text-white shadow-lg shadow-purple-600/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
                >
                  Criar guilda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#120f1e] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl relative animate-modal-in space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-white">
                Entrar com convite
              </h3>
              <button
                type="button"
                onClick={() => { setShowInviteModal(false); setInviteError(null); }}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Cole o código ou o link que você recebeu. A gente acha o código sozinho.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inviteInput}
                onChange={(e) => { setInviteInput(e.target.value); setInviteError(null); }}
                placeholder="A B C D - E F G H"
                className="flex-1 bg-[#161224] border border-purple-500/40 focus:border-purple-400 rounded-2xl py-3.5 px-4 text-center font-mono text-sm tracking-[0.2em] text-white placeholder-gray-600 focus:outline-none shadow-inner"
              />

              <button
                type="button"
                onClick={handlePasteInvite}
                className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-[#1c172e] hover:bg-[#251f3d] border border-white/10 text-xs text-gray-200 transition-colors cursor-pointer shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Colar</span>
              </button>
            </div>

            {inviteError && (
              <p className="text-xs text-rose-400 text-center font-medium">
                {inviteError}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setShowInviteModal(false); setInviteError(null); }}
                className="px-4 py-2 rounded-full text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={!inviteInput.trim()}
                onClick={handleJoinByInvite}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[#8A4FFF] hover:bg-[#7839EE] text-white shadow-md shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-40"
              >
                Entrar na guilda
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedDetailGuild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#110e1c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative animate-modal-in flex flex-col">
            <div className="h-44 w-full relative overflow-hidden bg-black/70">
              {selectedDetailGuild.bannerImage ? (
                <img 
                  src={selectedDetailGuild.bannerImage} 
                  alt={selectedDetailGuild.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div 
                  className="w-full h-full"
                  style={{ 
                    background: `radial-gradient(circle at 30% 30%, ${selectedDetailGuild.themeColor}88 0%, rgba(14,12,24,0.95) 75%)` 
                  }} 
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#110e1c] via-[#110e1c]/40 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedDetailGuild(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-5 flex items-center gap-3 z-10">
                <div 
                  className="w-14 h-14 rounded-2xl bg-black/85 border border-white/15 p-1 flex items-center justify-center shadow-lg overflow-hidden shrink-0"
                  style={{ borderColor: `${selectedDetailGuild.themeColor}60` }}
                >
                  {selectedDetailGuild.avatarUrl ? (
                    <img src={selectedDetailGuild.avatarUrl} alt={selectedDetailGuild.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="font-serif font-bold text-base text-white" style={{ color: selectedDetailGuild.themeColor }}>
                      {selectedDetailGuild.tag}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif text-lg font-bold text-white">
                      {selectedDetailGuild.name}
                    </h3>
                    {selectedDetailGuild.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-[#38bdf8] fill-[#0284c7] shrink-0" />
                    )}
                  </div>
                  <div className="mt-1">
                    {renderAccessBadge(selectedDetailGuild.accessType)}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-300 leading-relaxed">
                {selectedDetailGuild.description}
              </p>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-black/30 border border-white/5 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>{selectedDetailGuild.memberCount} membros</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>{selectedDetailGuild.campaignsCount ?? 0} campanhas</span>
                </div>
                <div className="col-span-2 text-[11px] text-gray-500 pt-1 border-t border-white/5">
                  Líder: <strong className="text-gray-300">{selectedDetailGuild.leaderName}</strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDetailGuild(null)}
                  className="px-4 py-2 rounded-full text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  Fechar
                </button>

                {selectedDetailGuild.isMember ? (
                  <span className="px-5 py-2 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                    Você já é membro
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onJoinGuild(selectedDetailGuild.id);
                      setSelectedDetailGuild(null);
                    }}
                    className="px-5 py-2 rounded-full text-xs font-semibold bg-[#8A4FFF] hover:bg-[#7839EE] text-white shadow-md shadow-purple-600/30 transition-all cursor-pointer active:scale-95"
                  >
                    Ingressar na guilda
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
