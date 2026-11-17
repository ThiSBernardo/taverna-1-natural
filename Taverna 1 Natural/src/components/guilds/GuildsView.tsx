import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Users, 
  Dices, 
  Sparkles, 
  Check, 
  X, 
  Castle, 
  Search,
  CheckCircle2,
  Lock,
  Unlock
} from 'lucide-react';
import { Guild, GuildAccessType } from '../../types/guild';

interface GuildsViewProps {
  guilds: Guild[];
  currentUserId: string;
  onJoinGuild: (guildId: string) => void;
  onCreateGuild: (guild: Guild) => void;
}

const GUILD_PALETTES = [
  '#8b5cf6', '#ef4444', '#eab308', '#10b981', 
  '#06b6d4', '#6366f1', '#ec4899', '#f97316', 
  '#14b8a6', '#64748b', '#84cc16', '#d946ef'
];

export const GuildsView: React.FC<GuildsViewProps> = ({
  guilds,
  currentUserId,
  onJoinGuild,
  onCreateGuild,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Guild Form State
  const [newGuildName, setNewGuildName] = useState('');
  const [newGuildTag, setNewGuildTag] = useState('');
  const [newGuildDesc, setNewGuildDesc] = useState('');
  const [newGuildColor, setNewGuildColor] = useState('#8b5cf6');
  const [newGuildAccess, setNewGuildAccess] = useState<GuildAccessType>('livre');

  const myGuilds = guilds.filter(g => g.isMember || g.leaderId === currentUserId);
  const discoverGuilds = guilds.filter(g => {
    if (filterType !== 'all') {
      if (filterType === 'livre' && g.accessType !== 'livre') return false;
      if (filterType === 'aprovacao' && g.accessType !== 'aprovacao') return false;
      if (filterType === 'verificadas' && !g.isVerified) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return g.name.toLowerCase().includes(q) || g.tag.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRandomGuild = () => {
    if (discoverGuilds.length === 0) return;
    const random = discoverGuilds[Math.floor(Math.random() * discoverGuilds.length)];
    alert(`Guilda Sorteada: [${random.tag}] ${random.name} — ${random.description}`);
  };

  const handleCreate = () => {
    if (!newGuildName.trim() || !newGuildTag.trim()) {
      alert('Preencha o nome e a sigla da guilda.');
      return;
    }

    const guild: Guild = {
      id: 'guild-' + Date.now(),
      name: newGuildName.trim(),
      tag: newGuildTag.trim().toUpperCase(),
      description: newGuildDesc.trim(),
      crestIcon: 'Castle',
      themeColor: newGuildColor,
      accessType: newGuildAccess,
      isVerified: false,
      memberCount: 1,
      leaderId: currentUserId,
      leaderName: 'ThiSBernardo',
      rules: 'Respeito mútuo e colaboração.',
      isMember: true
    };

    onCreateGuild(guild);
    setShowCreateModal(false);
    setNewGuildName('');
    setNewGuildTag('');
    setNewGuildDesc('');
  };

  return (
    <div className="space-y-6 pb-32 max-w-[1240px] mx-auto px-6 lg:px-12 pt-6 animate-fadeIn">
      
      {/* Top Banner / Mascot Nyx Tutorial */}
      <div className="relative rounded-3xl p-6 overflow-hidden border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-black/80 to-indigo-950/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs text-yellow-400 font-bold bg-yellow-500/10 px-2.5 py-0.5 rounded-full border border-yellow-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hub de Irmandades & Clãs</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
            Reúna seu Clã ou Encontre sua Guilda
          </h1>
          <p className="text-xs text-gray-300 leading-relaxed">
            As guildas reúnem mestres e aventureiros em torno de universos compartilhados, mesas contínuas e troca de suplementos e fichas.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl shadow-purple-600/40 hover:scale-105 transition-transform shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Fundar Nova Guilda</span>
        </button>
      </div>

      {/* SUAS GUILDAS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" />
          <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
            Suas Guildas ({myGuilds.length})
          </h2>
        </div>

        {myGuilds.length === 0 ? (
          <p className="text-xs text-gray-500 py-4">Você ainda não faz parte de nenhuma guilda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGuilds.map(guild => (
              <div 
                key={guild.id}
                className="p-5 rounded-2xl border border-white/10 bg-[#141520]/80 glass-panel flex items-start gap-4"
                style={{ borderColor: `${guild.themeColor}50` }}
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white font-cinzel font-bold text-sm shadow-lg"
                  style={{ backgroundColor: guild.themeColor }}
                >
                  {guild.tag}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-cinzel font-bold text-base text-white">{guild.name}</h3>
                    {guild.isVerified && (
                      <span title="Guilda Verificada">
                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{guild.description}</p>
                  <div className="flex items-center gap-4 pt-2 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span>{guild.memberCount} membros</span>
                    </span>
                    <span>Líder: <strong className="text-gray-200">{guild.leaderName}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DESCOBRIR GUILDAS */}
      <section className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Castle className="w-5 h-5 text-indigo-400" />
            <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
              Descobrir Guildas
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleRandomGuild}
              className="glass-button px-3 py-1.5 rounded-lg text-purple-300 flex items-center gap-1.5"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Sortear guilda</span>
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'livre', label: 'Entrada Livre' },
            { id: 'aprovacao', label: 'Pede Aprovação' },
            { id: 'verificadas', label: 'Verificadas' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                filterType === f.id
                  ? 'bg-purple-600 border-purple-400 text-white font-semibold'
                  : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Guilds List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discoverGuilds.map(guild => (
            <div 
              key={guild.id}
              className="p-4 rounded-2xl border border-white/10 bg-[#141520]/80 glass-panel flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-cinzel font-bold text-xs shadow-md"
                  style={{ backgroundColor: guild.themeColor }}
                >
                  {guild.tag}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-cinzel font-bold text-sm text-white line-clamp-1">{guild.name}</h3>
                    {guild.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{guild.description}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400">
                  {guild.memberCount} membros · {guild.accessType === 'livre' ? 'Livre' : 'Moderação'}
                </span>

                <button
                  onClick={() => onJoinGuild(guild.id)}
                  className="btn-primary text-xs px-3 py-1.5 rounded-xl font-semibold"
                >
                  {guild.isMember ? 'Membro' : 'Ingressar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL: CRIAR GUILDA (Com Live Preview) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-panel-elevated max-w-xl w-full rounded-2xl p-6 relative animate-modal-in border border-white/10 shadow-2xl max-h-[92vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-white">Fundar Nova Guilda</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              
              {/* LIVE PREVIEW CARD */}
              <div className="p-4 rounded-2xl border border-white/15 bg-black/50 space-y-2">
                <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                  Pré-Visualização em Tempo Real
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-cinzel font-bold text-sm text-white shadow-lg transition-colors"
                    style={{ backgroundColor: newGuildColor }}
                  >
                    {newGuildTag || 'TAG'}
                  </div>
                  <div>
                    <div className="font-cinzel text-base font-bold text-white">
                      {newGuildName || 'Nome da Guilda'}
                    </div>
                    <div className="text-xs text-gray-400 line-clamp-1">
                      {newGuildDesc || 'Descrição da sua comunidade de jogadores...'}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Nome da Guilda *</label>
                <input
                  type="text"
                  value={newGuildName}
                  onChange={(e) => setNewGuildName(e.target.value)}
                  placeholder="Ex: Irmandade dos Arcanos, Guardiões de Baróvia..."
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Sigla / Tag (2 a 6 letras) *</label>
                <input
                  type="text"
                  maxLength={6}
                  value={newGuildTag}
                  onChange={(e) => setNewGuildTag(e.target.value.toUpperCase())}
                  placeholder="Ex: ARCANO, BAROV"
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Descrição & Manifesto</label>
                <textarea
                  rows={3}
                  value={newGuildDesc}
                  onChange={(e) => setNewGuildDesc(e.target.value)}
                  placeholder="Qual o objetivo da guilda e que tipos de mesas organizam?"
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-2">Cor Temática da Guilda</label>
                <div className="flex flex-wrap gap-2">
                  {GUILD_PALETTES.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewGuildColor(color)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        newGuildColor === color ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Tipo de Entrada</label>
                <select
                  value={newGuildAccess}
                  onChange={(e) => setNewGuildAccess(e.target.value as GuildAccessType)}
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs bg-black/40 text-gray-200"
                >
                  <option value="livre">Entrada Livre (Qualquer um pode ingressar)</option>
                  <option value="aprovacao">Requer Aprovação de Líderes</option>
                  <option value="convite">Apenas por Convite</option>
                </select>
              </div>

            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button 
                type="button" 
                onClick={() => setShowCreateModal(false)}
                className="glass-button px-4 py-2 rounded-xl text-xs text-gray-300"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={handleCreate}
                className="btn-primary px-6 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Fundar Guilda</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
