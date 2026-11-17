import React, { useState } from 'react';
import { 
  X, 
  Palette, 
  User, 
  Calendar, 
  Dices, 
  Check, 
  Crown, 
  Copy, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, UIStyleMode, DayAvailability } from '../../types/user';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveUser: (updatedUser: UserProfile) => void;
  onTestRoll: (formula: string, title: string) => void;
}

const PALETTES = [
  { name: 'Púrpura Místico', color: '#8b5cf6' },
  { name: 'Carmesim Sangue', color: '#ef4444' },
  { name: 'Dourado Real', color: '#eab308' },
  { name: 'Esmeralda Antiga', color: '#10b981' },
  { name: 'Ciano Arcano', color: '#06b6d4' },
  { name: 'Índigo Profundo', color: '#6366f1' },
  { name: 'Rosa Feérico', color: '#ec4899' },
  { name: 'Âmbar Solar', color: '#f59e0b' },
  { name: 'Violeta Obscuro', color: '#7c3aed' },
  { name: 'Prata Espiritual', color: '#94a3b8' },
  { name: 'Turquesa Cósmica', color: '#14b8a6' },
  { name: 'Laranja Flamejante', color: '#f97316' },
  { name: 'Verde Necrótico', color: '#84cc16' },
  { name: 'Azul Abissal', color: '#3b82f6' },
  { name: 'Cobre Envelhecido', color: '#d97706' },
  { name: 'Fúcsia Astral', color: '#d946ef' },
  { name: 'Gelo Glacial', color: '#38bdf8' },
  { name: 'Carvão Estelar', color: '#64748b' },
  { name: 'Sangue Vampírico', color: '#b91c1c' },
];

const DAYS: DayAvailability['day'][] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
const SHIFTS: ('manha' | 'tarde' | 'noite')[] = ['manha', 'tarde', 'noite'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveUser,
  onTestRoll,
}) => {
  const [activeTab, setActiveTab] = useState<'custom' | 'account' | 'card'>('custom');
  const [profile, setProfile] = useState<UserProfile>({ ...user });
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.friendCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleToggleShift = (day: DayAvailability['day'], shift: 'manha' | 'tarde' | 'noite') => {
    const updated = profile.availability.map(d => {
      if (d.day === day) {
        const hasShift = d.shifts.includes(shift);
        const newShifts = hasShift 
          ? d.shifts.filter(s => s !== shift)
          : [...d.shifts, shift];
        return { ...d, shifts: newShifts };
      }
      return d;
    });
    setProfile({ ...profile, availability: updated });
  };

  const handleSave = () => {
    onSaveUser(profile);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-elevated max-w-2xl w-full rounded-2xl p-6 relative animate-modal-in border border-white/10 shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img 
              src={profile.avatarUrl} 
              alt={profile.displayName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/50" 
            />
            <div>
              <h3 className="font-cinzel text-lg font-bold text-white leading-tight">
                {profile.displayName}
              </h3>
              <p className="text-xs text-purple-400 font-mono">Código: {profile.friendCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-white/10 py-3 text-xs">
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'custom' 
                ? 'bg-purple-600/30 text-purple-300 font-semibold border border-purple-500/40' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Customização & Ateliê</span>
          </button>
          
          <button
            onClick={() => setActiveTab('account')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'account' 
                ? 'bg-purple-600/30 text-purple-300 font-semibold border border-purple-500/40' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Dados da Conta</span>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'card' 
                ? 'bg-purple-600/30 text-purple-300 font-semibold border border-purple-500/40' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Cartão de Jogador</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          
          {/* TAB 1: CUSTOMIZAÇÃO */}
          {activeTab === 'custom' && (
            <div className="space-y-5 text-xs">
              
              {/* Estilo de Interface */}
              <div>
                <label className="font-semibold text-gray-300 block mb-2">Estilo de Interface</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, uiStyle: 'glass' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      profile.uiStyle === 'glass'
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-white/10 bg-black/30 text-gray-400'
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">✨ Vidro Fosco (Glassmorphism)</div>
                    <div className="text-[11px] text-gray-400">
                      Transparências, desfoque de fundo e bordas translúcidas imersivas.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, uiStyle: 'opaque' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      profile.uiStyle === 'opaque'
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-white/10 bg-black/30 text-gray-400'
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">🛡️ Interface Opaca</div>
                    <div className="text-[11px] text-gray-400">
                      Superfícies sólidas e escuras de alto contraste para máxima legibilidade.
                    </div>
                  </button>
                </div>
              </div>

              {/* 19 Paletas de Cor de Destaque */}
              <div>
                <label className="font-semibold text-gray-300 block mb-2">
                  Cor de Destaque da Interface (19 Paletas)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {PALETTES.map(p => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => setProfile({ ...profile, accentColor: p.color })}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                        profile.accentColor === p.color
                          ? 'border-white bg-white/10 shadow-lg'
                          : 'border-white/5 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <span 
                        className="w-4 h-4 rounded-full shadow-md shrink-0" 
                        style={{ backgroundColor: p.color }} 
                      />
                      <span className="text-[11px] text-gray-300 truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ateliê de Dados 3D */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-black/50 to-indigo-950/40 border border-purple-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Dices className="w-5 h-5 text-purple-400" />
                    <span className="font-cinzel text-sm font-bold text-white">Ateliê de Dados 3D</span>
                  </div>
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full font-bold">
                    Física em Tempo Real
                  </span>
                </div>
                <p className="text-gray-400 text-[11px] mb-3">
                  Teste seu conjunto de dados físicos em ação. Cada rolagem simula colisões e texturas espelhadas.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onTestRoll('1d20+5', 'Teste do Ateliê: 1d20+5')}
                    className="btn-primary text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 font-semibold"
                  >
                    <Dices className="w-4 h-4" />
                    <span>Rolar 1d20 + 5</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onTestRoll('3d20', 'Teste do Ateliê: 3d20 (Maior)')}
                    className="glass-button text-xs px-3 py-2 rounded-xl text-purple-300 font-semibold"
                  >
                    <span>Rolar 3d20 (Vantagem)</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DADOS DA CONTA */}
          {activeTab === 'account' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Nome de Exibição</label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">E-mail Cadastrado</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Identificador Discord</label>
                <input
                  type="text"
                  value={profile.discordTag || ''}
                  onChange={(e) => setProfile({ ...profile, discordTag: e.target.value })}
                  placeholder="Ex: Jogador#1234"
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="bg-black/30 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400">Código de Amigo Pessoal</div>
                  <div className="text-sm font-mono font-bold text-purple-300">{profile.friendCode}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="glass-button px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 text-gray-200"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              {/* Plano de Assinatura */}
              <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    <span>Plano Atual: {profile.plan === 'duque' ? 'Duque' : profile.plan === 'arquiduque' ? 'Arquiduque' : 'Explorador'}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">5 GB de armazenamento em nuvem e dados 3D ativos.</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CARTÃO DE JOGADOR */}
          {activeTab === 'card' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Biografia Pública</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                />
              </div>

              {/* Matriz Semanal de Disponibilidade */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-gray-300">
                    Matriz de Disponibilidade Semanal
                  </label>
                  <span className="text-[10px] text-purple-400">Clique para alternar horários livres</span>
                </div>
                
                <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/40">
                  <div className="grid grid-cols-8 text-center py-2 bg-white/5 border-b border-white/10 text-[11px] font-bold text-gray-300">
                    <div>Turno</div>
                    {DAYS.map(day => <div key={day}>{day}</div>)}
                  </div>

                  {SHIFTS.map(shift => (
                    <div key={shift} className="grid grid-cols-8 text-center py-2 border-b border-white/5 items-center">
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        {shift === 'manha' ? 'Manhã' : shift === 'tarde' ? 'Tarde' : 'Noite'}
                      </div>
                      {DAYS.map(day => {
                        const dayData = profile.availability.find(d => d.day === day);
                        const isFree = dayData?.shifts.includes(shift);
                        return (
                          <div key={day + shift} className="flex justify-center">
                            <button
                              type="button"
                              onClick={() => handleToggleShift(day, shift)}
                              className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center transition-all ${
                                isFree 
                                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/40 border border-purple-400' 
                                  : 'bg-white/5 text-gray-600 hover:bg-white/10'
                              }`}
                              title={`${day} - ${shift}`}
                            >
                              {isFree ? <Check className="w-3.5 h-3.5" /> : '—'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button 
            type="button" 
            onClick={onClose}
            className="glass-button px-4 py-2 rounded-xl text-xs text-gray-300"
          >
            Cancelar
          </button>
          
          <button 
            type="button" 
            onClick={handleSave}
            className="btn-primary px-6 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-green-300" />
                <span>Salvo com sucesso!</span>
              </>
            ) : (
              <span>Salvar Alterações</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
