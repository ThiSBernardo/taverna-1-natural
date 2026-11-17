import React, { useState } from 'react';
import { X, Copy, Check, Search, UserPlus, Circle, MessageSquare } from 'lucide-react';
import { UserProfile, UserStatus } from '../../types/user';

interface FriendsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateStatus: (newStatus: UserStatus) => void;
}

export const FriendsDrawer: React.FC<FriendsDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateStatus,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newFriendCode, setNewFriendCode] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.friendCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const statusColors: Record<UserStatus, string> = {
    online: 'text-green-500 fill-green-500',
    ausente: 'text-yellow-500 fill-yellow-500',
    ocupado: 'text-red-500 fill-red-500',
    invisivel: 'text-gray-500 fill-gray-500'
  };

  const statusLabels: Record<UserStatus, string> = {
    online: 'Disponível',
    ausente: 'Ausente',
    ocupado: 'Ocupado',
    invisivel: 'Invisível'
  };

  const filteredFriends = user.friends.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.friendCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineFriends = filteredFriends.filter(f => f.status === 'online');
  const offlineFriends = filteredFriends.filter(f => f.status !== 'online');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div 
        className="absolute inset-y-0 right-0 max-w-sm w-full glass-panel-elevated bg-[#12131a]/95 border-l border-white/10 p-5 flex flex-col animate-slide-in-right shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <h3 className="font-cinzel text-lg font-bold text-white">Amigos & Grupo</h3>
            <span className="text-xs bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full">
              {user.friends.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Status & Friend Code Bar */}
        <div className="py-4 border-b border-white/10 space-y-3">
          {/* Status selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Seu status:</span>
            <select
              value={user.status}
              onChange={(e) => onUpdateStatus(e.target.value as UserStatus)}
              className="glass-input text-xs rounded-lg px-2 py-1 bg-black/40 text-gray-200 cursor-pointer"
            >
              <option value="online">🟢 Disponível</option>
              <option value="ausente">🟡 Ausente</option>
              <option value="ocupado">🔴 Ocupado</option>
              <option value="invisivel">⚪ Invisível</option>
            </select>
          </div>

          {/* Personal Code */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Seu Código de Amigo</div>
              <div className="text-xs font-mono font-bold text-purple-300 tracking-wider mt-0.5">
                {user.friendCode}
              </div>
            </div>
            <button
              onClick={handleCopyCode}
              className="glass-button px-2.5 py-1.5 rounded-lg text-xs text-gray-200 flex items-center gap-1.5 hover:text-purple-300"
              title="Copiar código"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Search & Add Friend */}
        <div className="pt-4 pb-2 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar amigo por nome ou código..."
              className="glass-input w-full pl-9 pr-3 py-1.5 text-xs rounded-xl"
            />
          </div>

          <button
            onClick={() => setShowAddFriend(!showAddFriend)}
            className="w-full text-xs py-2 px-3 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 flex items-center justify-center gap-1.5 font-medium transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Adicionar novo amigo</span>
          </button>

          {showAddFriend && (
            <div className="p-3 bg-black/40 rounded-xl border border-purple-500/30 space-y-2 text-xs">
              <label className="text-gray-300 block">Cole o código do amigo:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFriendCode}
                  onChange={(e) => setNewFriendCode(e.target.value)}
                  placeholder="Ex: GM892KL"
                  className="glass-input flex-1 px-2.5 py-1 rounded-lg text-xs"
                />
                <button
                  onClick={() => {
                    if (newFriendCode.trim()) {
                      alert(`Solicitação de amizade enviada para ${newFriendCode}!`);
                      setNewFriendCode('');
                      setShowAddFriend(false);
                    }
                  }}
                  className="btn-primary px-3 py-1 rounded-lg font-semibold"
                >
                  Enviar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mt-2">
          
          {/* Online Section */}
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Disponíveis</span>
              <span className="text-green-400 font-bold">({onlineFriends.length})</span>
            </div>
            {onlineFriends.length === 0 ? (
              <p className="text-xs text-gray-500 py-2">Nenhum amigo online no momento.</p>
            ) : (
              <div className="space-y-1.5">
                {onlineFriends.map(friend => (
                  <div 
                    key={friend.id}
                    className="p-2 rounded-xl bg-black/30 border border-white/5 hover:border-purple-500/30 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img 
                          src={friend.avatar} 
                          alt={friend.name}
                          className="w-8 h-8 rounded-full object-cover" 
                        />
                        <Circle className={`w-2.5 h-2.5 absolute bottom-0 right-0 ${statusColors[friend.status]}`} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-200 group-hover:text-purple-300">
                          {friend.name}
                        </div>
                        {friend.currentActivity ? (
                          <div className="text-[10px] text-purple-400/90 truncate max-w-[150px]">
                            {friend.currentActivity}
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-400 font-mono">
                            {friend.friendCode}
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Abrindo chat privado com ${friend.name}`)}
                      className="p-1.5 text-gray-400 hover:text-white glass-button rounded-lg opacity-80 group-hover:opacity-100"
                      title="Enviar mensagem"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offline / Busy Section */}
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Ausentes / Offline</span>
              <span className="text-gray-500 font-bold">({offlineFriends.length})</span>
            </div>
            <div className="space-y-1.5">
              {offlineFriends.map(friend => (
                <div 
                  key={friend.id}
                  className="p-2 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img 
                        src={friend.avatar} 
                        alt={friend.name}
                        className="w-8 h-8 rounded-full object-cover grayscale" 
                      />
                      <Circle className={`w-2.5 h-2.5 absolute bottom-0 right-0 ${statusColors[friend.status]}`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-300">{friend.name}</div>
                      <div className="text-[10px] text-gray-400">{statusLabels[friend.status]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
