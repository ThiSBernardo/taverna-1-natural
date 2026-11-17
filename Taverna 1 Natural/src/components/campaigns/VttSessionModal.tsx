import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Dices, 
  Shield, 
  Heart, 
  Zap, 
  MapPin, 
  Maximize2, 
  Eye, 
  Users, 
  MessageSquare, 
  Layers, 
  Sparkles,
  Move
} from 'lucide-react';
import { Campaign } from '../../types/campaign';
import { DiceRollResult } from '../../types/dice';

interface VttSessionModalProps {
  isOpen: boolean;
  campaign: Campaign;
  onClose: () => void;
  onRollDice: (formula: string, title: string) => void;
  recentRolls: DiceRollResult[];
}

interface VttToken {
  id: string;
  name: string;
  avatar: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  isSelected?: boolean;
}

export const VttSessionModal: React.FC<VttSessionModalProps> = ({
  isOpen,
  campaign,
  onClose,
  onRollDice,
  recentRolls,
}) => {
  const [activeRightTab, setActiveRightTab] = useState<'chat' | 'tokens'>('chat');
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ id: string; sender: string; text: string; time: string }[]>([
    { id: '1', sender: 'Sistema', text: `Bem-vindos à mesa virtual de ${campaign.title}!`, time: '20:00' },
    { id: '2', sender: campaign.masterName, text: 'A névoa começa a se adensar. Preparem suas armas.', time: '20:01' }
  ]);

  // Virtual Tokens on the tactical grid
  const [tokens, setTokens] = useState<VttToken[]>([
    { id: 't1', name: 'Arthur', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', x: 200, y: 150, hp: 36, maxHp: 36 },
    { id: 't2', name: 'Thorgrim', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop', x: 260, y: 180, hp: 34, maxHp: 34 },
    { id: 't3', name: 'Aberração de Sangue (Vilão)', avatar: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=200&auto=format&fit=crop', x: 420, y: 220, hp: 80, maxHp: 100 }
  ]);

  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setChatLog([
      ...chatLog,
      {
        id: 'msg-' + Date.now(),
        sender: 'ThiSBernardo',
        text: chatMessage.trim(),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatMessage('');
  };

  const handleDragToken = (id: string, deltaX: number, deltaY: number) => {
    setTokens(prev => prev.map(t => 
      t.id === id ? { ...t, x: Math.max(20, Math.min(600, t.x + deltaX)), y: Math.max(20, Math.min(400, t.y + deltaY)) } : t
    ));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0d12] flex flex-col text-white overflow-hidden animate-fadeIn select-none">
      
      {/* VTT TOP BAR */}
      <div className="h-12 bg-[#12131a] border-b border-white/10 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <h2 className="font-cinzel text-sm font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">
              {campaign.title}
            </h2>
          </div>
          <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 hidden sm:inline">
            Grid Tático · 1.5m por quadrado
          </span>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-2 text-xs">
          <button 
            onClick={() => onRollDice('1d20', 'Rolagem Rápida na Mesa')}
            className="btn-primary px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold shadow-md shadow-purple-600/40"
          >
            <Dices className="w-4 h-4" />
            <span>Rolar d20</span>
          </button>

          <button
            onClick={() => alert('Fog of War alternado: área visível calculada dinamicamente.')}
            className="glass-button p-2 text-gray-300 hover:text-white rounded-lg"
            title="Alternar Névoa de Guerra"
          >
            <Eye className="w-4 h-4 text-purple-400" />
          </button>

          <button
            onClick={onClose}
            className="glass-button px-3 py-1.5 text-xs text-red-400 hover:text-red-300 border-red-500/30 flex items-center gap-1.5 rounded-lg"
          >
            <X className="w-4 h-4" />
            <span>Sair da Sessão</span>
          </button>
        </div>
      </div>

      {/* VTT WORKSPACE: MAP CANVAS + RIGHT CHAT/TOKENS PANE */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* TACTICAL MAP CANVAS (Battlemap Grid) */}
        <div className="flex-1 relative bg-[#08090d] overflow-hidden flex items-center justify-center p-4">
          
          {/* Tactical Grid Background */}
          <div 
            className="w-full h-full max-w-4xl max-h-[650px] rounded-2xl border-2 border-white/10 relative shadow-2xl overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(139, 92, 246, 0.08) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          >
            {/* Ambient Lighting & Map Elements */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-purple-950/20 via-transparent to-black/40" />
            
            {/* Map Title Tag */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-[11px] text-gray-300 font-cinzel">
              Masmorra Subterrânea — Nível 1
            </div>

            {/* Tokens placed on Map */}
            {tokens.map(token => {
              const isSelected = selectedTokenId === token.id;
              const isMonster = token.maxHp >= 100;
              return (
                <div
                  key={token.id}
                  onClick={() => setSelectedTokenId(token.id)}
                  style={{ left: `${token.x}px`, top: `${token.y}px` }}
                  className={`absolute w-12 h-12 rounded-full cursor-pointer transition-transform duration-100 flex items-center justify-center ${
                    isSelected ? 'scale-110 ring-4 ring-purple-400 z-30 shadow-2xl shadow-purple-600/80' : 'hover:scale-105 ring-2 ring-white/40 z-20'
                  }`}
                >
                  <img 
                    src={token.avatar} 
                    alt={token.name} 
                    className="w-full h-full rounded-full object-cover pointer-events-none" 
                  />

                  {/* Token mini health bar */}
                  <div className="absolute -bottom-2 w-10 h-1.5 rounded-full bg-black/80 overflow-hidden border border-white/20">
                    <div 
                      className={`h-full ${isMonster ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${(token.hp / token.maxHp) * 100}%` }}
                    />
                  </div>

                  {/* Token Name Tag */}
                  <div className="absolute -top-4 bg-black/80 px-1.5 py-0.2 rounded text-[9px] font-bold text-gray-200 whitespace-nowrap border border-white/10 pointer-events-none">
                    {token.name}
                  </div>
                </div>
              );
            })}

            {/* Movement Controls Overlay for Selected Token */}
            {selectedTokenId && (
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md p-2.5 rounded-xl border border-purple-500/40 flex items-center gap-2 text-xs">
                <span className="font-bold text-purple-300">
                  {tokens.find(t => t.id === selectedTokenId)?.name}:
                </span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleDragToken(selectedTokenId, -40, 0)} 
                    className="w-6 h-6 glass-button rounded flex items-center justify-center font-bold"
                  >
                    ←
                  </button>
                  <button 
                    onClick={() => handleDragToken(selectedTokenId, 40, 0)} 
                    className="w-6 h-6 glass-button rounded flex items-center justify-center font-bold"
                  >
                    →
                  </button>
                  <button 
                    onClick={() => handleDragToken(selectedTokenId, 0, -40)} 
                    className="w-6 h-6 glass-button rounded flex items-center justify-center font-bold"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={() => handleDragToken(selectedTokenId, 0, 40)} 
                    className="w-6 h-6 glass-button rounded flex items-center justify-center font-bold"
                  >
                    ↓
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT DRAWER: CHAT & TOKENS */}
        <div className="w-80 sm:w-96 bg-[#12131a] border-l border-white/10 flex flex-col shrink-0 z-20">
          
          {/* Tabs */}
          <div className="flex border-b border-white/10 text-xs">
            <button
              onClick={() => setActiveRightTab('chat')}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 font-semibold transition-colors ${
                activeRightTab === 'chat' 
                  ? 'border-b-2 border-purple-500 text-purple-300 bg-white/5' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat & Rolagens</span>
            </button>

            <button
              onClick={() => setActiveRightTab('tokens')}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 font-semibold transition-colors ${
                activeRightTab === 'tokens' 
                  ? 'border-b-2 border-purple-500 text-purple-300 bg-white/5' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Combatentes ({tokens.length})</span>
            </button>
          </div>

          {/* TAB: CHAT & LIVE DICE LOG */}
          {activeRightTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden p-3">
              
              {/* Message List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {chatLog.map(msg => (
                  <div key={msg.id} className="p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                      <span className="font-bold text-purple-400">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className="text-gray-200 leading-relaxed">{msg.text}</div>
                  </div>
                ))}

                {/* Recent Dice Rolls Cards in Chat */}
                {recentRolls.slice(0, 5).map(roll => (
                  <div 
                    key={roll.id} 
                    className={`p-3 rounded-xl border text-xs shadow-md ${
                      roll.isCritical 
                        ? 'border-yellow-500/60 bg-yellow-950/20 text-yellow-200' 
                        : roll.isFumble 
                          ? 'border-red-500/60 bg-red-950/20 text-red-200' 
                          : 'border-purple-500/40 bg-purple-950/20 text-purple-100'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                      <span>{roll.sourceTitle}</span>
                      <span className="font-mono text-purple-300">{roll.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-mono">Fórmula: {roll.formula}</span>
                      <span className="font-cinzel text-lg font-bold text-white">
                        Resultado: {roll.total}
                      </span>
                    </div>

                    {roll.isCritical && (
                      <div className="text-[10px] text-yellow-400 font-bold mt-1">
                        ✨ ACERTO CRÍTICO!
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="pt-2 border-t border-white/10 flex gap-1.5">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Mensagem para a mesa ou /rolar..."
                  className="glass-input flex-1 px-3 py-2 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="btn-primary p-2 rounded-xl text-white flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          )}

          {/* TAB: COMBATENTES & TOKENS */}
          {activeRightTab === 'tokens' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {tokens.map(token => (
                <div 
                  key={token.id}
                  onClick={() => setSelectedTokenId(token.id)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    selectedTokenId === token.id 
                      ? 'border-purple-500 bg-purple-600/20 shadow-md' 
                      : 'border-white/5 bg-black/30 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={token.avatar} alt={token.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-xs text-gray-200">{token.name}</div>
                      <div className="text-[10px] text-gray-400">
                        PV: {token.hp} / {token.maxHp}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setTokens(prev => prev.map(t => t.id === token.id ? { ...t, hp: Math.max(0, t.hp - 5) } : t));
                      }}
                      className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 border border-red-500/40 rounded hover:bg-red-500/30"
                      title="Sofrer 5 de dano"
                    >
                      -5 PV
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setTokens(prev => prev.map(t => t.id === token.id ? { ...t, hp: Math.min(t.maxHp, t.hp + 5) } : t));
                      }}
                      className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 border border-green-500/40 rounded hover:bg-green-500/30"
                      title="Curar 5 de PV"
                    >
                      +5 PV
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
