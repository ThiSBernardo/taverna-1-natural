import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Send, 
  Users, 
  MessageSquare, 
  Dices, 
  ChevronRight,
  Trash2,
  Sparkles
} from 'lucide-react';
import { DiceRollResult } from '../../types/dice';

interface VttRightSidebarProps {
  participants: { id: string; name: string; avatar: string; role: 'master' | 'player'; isOnline: boolean }[];
  recentRolls: DiceRollResult[];
  onRollDice: (formula: string, title: string) => void;
  onSelectCharacterSheet?: (charId: string) => void;
  onClearRolls?: () => void;
}

export const VttRightSidebar: React.FC<VttRightSidebarProps> = ({
  participants,
  recentRolls,
  onRollDice,
  onSelectCharacterSheet,
  onClearRolls,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'players'>('chat');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([
    { id: 'm1', sender: 'Sistema', text: 'Sessão iniciada na Mesa Virtual.', time: '20:00' },
    { id: 'm2', sender: 'ThiSBernardo', text: 'Todos prontos? Podem posicionar seus tokens.', time: '20:01' }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (message.startsWith('/r ') || message.startsWith('/rolar ')) {
      const formula = message.replace(/^\/(r|rolar)\s+/, '');
      onRollDice(formula, 'Comando de Chat');
    } else {
      setChatMessages(prev => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          sender: 'ThiSBernardo',
          text: message.trim(),
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
    setMessage('');
  };

  const handleClearChat = () => {
    setChatMessages([]);
    if (onClearRolls) {
      onClearRolls();
    }
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 z-40 flex select-none pointer-events-auto">
      {isExpanded && (
        <div className="w-80 sm:w-96 bg-[#12111a]/96 backdrop-blur-2xl border-l border-white/[0.09] shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-in-right">
          <div>
            <div className="h-12 px-4 border-b border-white/[0.08] flex items-center justify-between">
              <span className="font-cinzel text-xs font-bold text-white tracking-wide">
                Painel da Mesa
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Limpar chat e histórico"
                  className="px-2 py-1 rounded-lg text-[10px] font-spectral text-red-300 hover:text-white bg-red-950/30 hover:bg-red-900/40 border border-red-500/20 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Limpar chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex border-b border-white/[0.08] text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer ${
                  activeTab === 'chat' ? 'border-b-2 border-purple-500 text-purple-300 bg-white/[0.03]' : 'text-gray-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat & Rolagens</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('players')}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer ${
                  activeTab === 'players' ? 'border-b-2 border-purple-500 text-purple-300 bg-white/[0.03]' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Combatentes ({participants.length})</span>
              </button>
            </div>
          </div>

          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden p-3">
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05] text-xs">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                      <span className="font-bold text-purple-400">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className="text-gray-200 leading-relaxed">{msg.text}</div>
                  </div>
                ))}

                {recentRolls.slice(0, 10).map(roll => (
                  <div
                    key={roll.id}
                    className={`p-3 rounded-2xl border text-xs shadow-md transition-all ${
                      roll.isCritical
                        ? 'border-yellow-500/60 bg-yellow-950/25 text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                        : roll.isFumble
                          ? 'border-red-500/60 bg-red-950/25 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                          : 'border-purple-500/40 bg-purple-950/20 text-purple-100'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                      <span className="text-gray-200">{roll.rollerName || 'Jogador'}</span>
                      <span className="font-mono text-purple-300 text-[10px]">{roll.timestamp}</span>
                    </div>

                    <div className="text-[10px] text-amber-200/70 font-spectral mb-1">
                      {roll.sourceTitle}
                    </div>

                    <div className="flex items-baseline justify-between mt-1">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-mono">
                          {roll.formula}
                        </span>
                        {roll.diceResults && roll.diceResults.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 mt-1">
                            {roll.diceResults.map((dieRes, idx) => (
                              <span
                                key={idx}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                                  dieRes.dropped
                                    ? 'line-through opacity-40 text-gray-400 bg-white/[0.02] border-white/10'
                                    : 'text-purple-200 bg-purple-900/30 border-purple-500/30 font-bold'
                                }`}
                                title={dieRes.dropped ? `d${dieRes.die}: ${dieRes.result} (Descartado)` : `d${dieRes.die}: ${dieRes.result}`}
                              >
                                {dieRes.result}
                              </span>
                            ))}
                            {roll.modifierTotal !== 0 && (
                              <span className="text-[10px] font-mono text-gray-300">
                                {roll.modifierTotal > 0 ? `+ ${roll.modifierTotal}` : `- ${Math.abs(roll.modifierTotal)}`}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="font-cinzel text-xl font-bold text-white tracking-wide">
                        {roll.total}
                      </span>
                    </div>

                    {roll.isCritical && (
                      <div className="text-[10px] text-yellow-400 font-bold mt-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>ACERTO CRÍTICO!</span>
                      </div>
                    )}

                    {roll.isFumble && (
                      <div className="text-[10px] text-red-400 font-bold mt-1.5">
                        💀 FALHA CRÍTICA / DESASTRE
                      </div>
                    )}

                    {roll.notes && (
                      <div className="text-[9px] text-purple-300/80 font-spectral mt-1 italic">
                        {roll.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="pt-2 border-t border-white/[0.08] flex gap-1.5">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mensagem ou /rolar 1d20..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#1b1825] border border-white/[0.08] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'players' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {participants.map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectCharacterSheet && onSelectCharacterSheet(p.id)}
                  className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] hover:border-purple-500/40 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-black ${
                        p.isOnline ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-200">{p.name}</div>
                      <div className="text-[10px] text-gray-500">
                        {p.role === 'master' ? 'Mestre' : 'Jogador'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="w-12 bg-[#14121b]/92 backdrop-blur-xl border-l border-white/[0.08] flex flex-col items-center justify-between py-4 text-gray-400">
        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="flex flex-col items-center gap-1 text-[9px] font-sans hover:text-white transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/10 flex items-center justify-center">
            <Menu className="w-4 h-4" />
          </div>
          <span className="font-medium text-[8px] tracking-wider uppercase">Menu</span>
        </button>

        <div className="flex flex-col items-center gap-4 my-auto">
          {recentRolls.slice(0, 2).map((roll, idx) => (
            <div key={idx} className="flex flex-col items-center gap-0.5">
              <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-gray-300">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-[10px] font-bold text-white">
                {roll.total}
              </span>
              <span className="font-mono text-[8px] text-gray-500">
                {roll.formula}
              </span>
            </div>
          ))}

          {recentRolls.length === 0 && (
            <>
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-gray-300">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-[10px] font-bold text-white">74</span>
                <span className="font-mono text-[8px] text-gray-500">1d100</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-gray-300">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-[10px] font-bold text-white">2</span>
                <span className="font-mono text-[8px] text-gray-500">1d20</span>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRollDice('1d20', 'Rolagem Rápida d20')}
          className="w-8 h-8 rounded-full bg-purple-600/30 hover:bg-purple-600/60 border border-purple-500/40 text-purple-300 hover:text-white flex items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Rolar d20 Rápido"
        >
          <Dices className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
