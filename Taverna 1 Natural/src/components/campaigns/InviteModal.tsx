import React, { useState } from 'react';
import { X, Link as LinkIcon, ArrowRight } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinInviteCode: (code: string) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  onJoinInviteCode,
}) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onJoinInviteCode(code.trim());
      setCode('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-elevated max-w-md w-full rounded-2xl p-6 relative animate-modal-in border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-purple-400" />
            <h3 className="font-cinzel text-lg font-bold text-white">Recebi um link de convite</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <p className="text-gray-300">
            Cole abaixo o link completo de convite ou a chave da mesa (ex: <code>DARK-FOREST-77</code>):
          </p>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Cole aqui o link ou código..."
            className="glass-input w-full px-3 py-2.5 rounded-xl text-xs font-mono"
            autoFocus
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="glass-button px-4 py-2 rounded-xl text-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!code.trim()}
              className="btn-primary px-5 py-2 rounded-xl font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>Ingressar na Mesa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
