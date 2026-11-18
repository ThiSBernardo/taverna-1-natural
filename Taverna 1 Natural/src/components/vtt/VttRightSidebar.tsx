import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Send, 
  Users, 
  MessageSquare, 
  Dices, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { DiceRollResult } from '../../types/dice';
import { Character } from '../../types/character';

interface VttRightSidebarProps {
  participants: { id: string; name: string; avatar: string; role: 'master' | 'player'; isOnline: boolean }[];
  recentRolls: DiceRollResult[];
  onRollDice: (formula: string, title: string) => void;
  onSelectCharacterSheet?: (charId: string) => void;
}

export const VttRightSidebar: React.FC<VttRightSidebarProps> = ({
  participants,
  recentRolls,
  onRollDice,
  onSelectCharacterSheet,
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

  return (
    <div className="fixed right-0 top-0 bottom-0 z-40 flex select-none pointer-events-auto">
      
      {/* EXPANDED DRAWER */}
      {isExpanded && (
        <div className="w-80 sm:w-96 bg-[#12111a]/96 backdrop-blur-2xl border-l border-white/[0.09] shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-in-right">
          
          {/* Header & Tabs */}
          <div>
            <div className="h-12 px-4 border-b border-white/[0.08] flex items-center justify-between">
              <span className="font-cinzel text-xs font-bold text-white tracking-wide">
                Painel da Mesa
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
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

          {/* TAB 1: CHAT & ROLLS */}
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

                {/* RECENT DICE ROLLS */}
                {recentRolls.slice(0, 6).map(roll => (
                  <div
                    key={roll.id}
                    className={`p-3 rounded-2xl border text-xs shadow-md ${
                      roll.isCritical
                        ? 'border-yellow-500/60 bg-yellow-950/25 text-yellow-200'
                        : roll.isFumble
                          ? 'border-red-500/60 bg-red-950/25 text-red-200'
                          : 'border-purple-500/40 bg-purple-950/20 text-purple-100'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                      <span>{roll.sourceTitle}</span>
                      <span className="font-mono text-purple-300 text-[10px]">{roll.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-400 font-mono">Fórmula: {roll.formula}</span>
                      <span className="font-cinzel text-base font-bold text-white">
                        {roll.total}
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

          {/* TAB 2: PLAYERS & COMBATANTS */}
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

      {/* PINNED VERTICAL STRIP ON RIGHT EDGE (Matches Screenshot 3 & 4) */}
      <div className="w-12 bg-[#14121b]/92 backdrop-blur-xl border-l border-white/[0.08] flex flex-col items-center justify-between py-4 text-gray-400">
        
        {/* TOP: MENU BUTTON */}
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

        {/* RECENT PLAYERS / ROLL TAGS */}
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

        {/* BOTTOM: QUICK D20 TRIGGER */}
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
