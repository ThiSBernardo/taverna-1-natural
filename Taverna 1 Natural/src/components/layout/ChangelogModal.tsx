import React from 'react';
import { X, Megaphone, Sparkles, CheckCircle2 } from 'lucide-react';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const updates = [
    {
      version: 'v2.4.0 — Alpha Playtest Ordem Paranormal II',
      date: 'Novembro 2026',
      badge: 'Novo',
      items: [
        'Entrega oficial das novas regras de Ordem Paranormal II (Playtest Alpha).',
        'Novo motor de rolagens com modo "Maior" e "Menor" automático para atributos.',
        'Ateliê de Dados 3D com texturas reflexivas e simulação física acelerada.',
        'Sincronização em tempo real de tokens na mesa virtual com dano e cura instantâneos.'
      ]
    },
    {
      version: 'v2.3.2 — Modos de Interface & Acessibilidade',
      date: 'Outubro 2026',
      badge: 'Melhoria',
      items: [
        'Adicionada opção de Interface Opaca nas configurações de perfil para alto contraste.',
        '19 paletas de cores temáticas para customização completa de acentos visuais.',
        'Otimização do carregamento da Biblioteca e pastas de campanhas.'
      ]
    },
    {
      version: 'v2.2.0 — Sistema de Guildas & Comunidade',
      date: 'Setembro 2026',
      badge: 'Recurso',
      items: [
        'Lançamento oficial do Hub de Guildas com brasões, tags e sorteio de comunidades.',
        'Filtro de disponibilidade semanal cruzada na aba Descubra.',
        'Melhorias no VTT com névoa de guerra e movimentação com grid tático.'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-elevated max-w-lg w-full rounded-2xl p-6 relative animate-modal-in border border-white/10 shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-5 h-5 text-purple-400" />
            <h3 className="font-cinzel text-lg font-bold text-white">Novidades & Atualizações</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto space-y-5 text-xs pr-1">
          {updates.map((u, i) => (
            <div key={i} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-purple-300 font-cinzel">{u.version}</span>
                <span className="text-[10px] text-gray-500 font-mono">{u.date}</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {u.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-gray-300 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button onClick={onClose} className="btn-primary text-xs px-4 py-1.5 rounded-xl font-semibold">
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
