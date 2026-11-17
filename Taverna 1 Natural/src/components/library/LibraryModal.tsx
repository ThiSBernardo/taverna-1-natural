import React, { useState } from 'react';
import { 
  X, 
  FolderGit2, 
  User, 
  Swords, 
  Image as ImageIcon, 
  Plus, 
  Copy, 
  Trash2, 
  BookOpen, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Character } from '../../types/character';
import { RPG_SYSTEMS } from '../../types/rpg-systems';

interface LibraryModalProps {
  isOpen: boolean;
  characters: Character[];
  userCode: string;
  onClose: () => void;
  onOpenCharacterSheet: (character: Character) => void;
  onStartCreateCharacter: () => void;
  onCloneCharacter: (character: Character) => void;
  onDeleteCharacter: (characterId: string) => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  characters,
  userCode,
  onClose,
  onOpenCharacterSheet,
  onStartCreateCharacter,
  onCloneCharacter,
  onDeleteCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'chars' | 'items' | 'media'>('chars');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');

  if (!isOpen) return null;

  // Group characters by folder
  const folders = Array.from(new Set(characters.map(c => c.folder || 'Sem campanha')));

  const filteredChars = characters.filter(c => {
    if (selectedFolder !== 'all' && (c.folder || 'Sem campanha') !== selectedFolder) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="glass-panel-elevated max-w-4xl w-full rounded-2xl p-6 relative animate-modal-in border border-white/10 shadow-2xl max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-white">Minha Biblioteca</h3>
              <p className="text-xs text-purple-400 font-mono">darkagerpg.com/Biblioteca/{userCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs & Storage bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 py-3 text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('chars')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-colors ${
                activeTab === 'chars'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Personagens ({characters.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-colors ${
                activeTab === 'media'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Galeria de Mídias</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-gray-400 text-[11px]">
            <span>Uso de Nuvem: <strong className="text-purple-300">320 MB</strong> / 5 GB (Plano Duque)</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          
          {/* TAB 1: PERSONAGENS */}
          {activeTab === 'chars' && (
            <div className="space-y-4">
              
              {/* Folder Filter & New Character Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex gap-1.5 overflow-x-auto py-1">
                  <button
                    onClick={() => setSelectedFolder('all')}
                    className={`px-3 py-1 rounded-lg border transition-all ${
                      selectedFolder === 'all'
                        ? 'bg-purple-600 border-purple-400 text-white font-semibold'
                        : 'bg-black/30 border-white/10 text-gray-400'
                    }`}
                  >
                    Todos ({characters.length})
                  </button>
                  {folders.map(f => (
                    <button
                      key={f}
                      onClick={() => setSelectedFolder(f)}
                      className={`px-3 py-1 rounded-lg border transition-all ${
                        selectedFolder === f
                          ? 'bg-purple-600 border-purple-400 text-white font-semibold'
                          : 'bg-black/30 border-white/10 text-gray-400'
                      }`}
                    >
                      📁 {f} ({characters.filter(c => (c.folder || 'Sem campanha') === f).length})
                    </button>
                  ))}
                </div>

                <button
                  onClick={onStartCreateCharacter}
                  className="btn-primary px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Criar Personagem</span>
                </button>
              </div>

              {/* Character Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredChars.map(char => {
                  const sys = RPG_SYSTEMS.find(s => s.id === char.systemId);
                  return (
                    <div 
                      key={char.id}
                      className="p-4 rounded-2xl border border-white/10 bg-[#141520]/80 glass-panel flex flex-col justify-between group hover:border-purple-500/40 transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={char.token.imageUrl} 
                            alt={char.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/40" 
                          />
                          <div>
                            <h4 className="font-cinzel font-bold text-sm text-white group-hover:text-purple-300">
                              {char.name}
                            </h4>
                            <div className="text-[10px] text-purple-400 font-semibold">
                              {char.characterClass}
                              {char.systemId.startsWith('ordem') ? ` · ${char.levelOrNex}% NEX` : ` · Nv.${char.levelOrNex}`}
                            </div>
                            <span className="text-[9px] bg-white/5 text-gray-400 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                              {sys?.name || 'RPG'}
                            </span>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-[10px] text-gray-400 flex items-center justify-between">
                          <span>Pasta: <strong className="text-gray-300">{char.folder || 'Sem campanha'}</strong></span>
                          <span>PV: <strong className="text-red-400">{char.hp.current}/{char.hp.max}</strong></span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-1.5 mt-3">
                        <button
                          onClick={() => onOpenCharacterSheet(char)}
                          className="btn-primary flex-1 py-1.5 rounded-xl text-xs font-semibold"
                        >
                          Abrir Ficha
                        </button>

                        <button
                          onClick={() => onCloneCharacter(char)}
                          className="p-1.5 glass-button text-gray-400 hover:text-white rounded-lg"
                          title="Clonar ficha para outra campanha"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Tem certeza que deseja excluir ${char.name}?`)) {
                              onDeleteCharacter(char.id);
                            }
                          }}
                          className="p-1.5 glass-button text-gray-400 hover:text-red-400 rounded-lg"
                          title="Excluir ficha"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: GALERIA DE MÍDIAS */}
          {activeTab === 'media' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-semibold">Suas Imagens, Retratos e Mapas</span>
                <button 
                  onClick={() => alert('Selecione uma imagem do seu dispositivo para upload.')}
                  className="btn-primary px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enviar Nova Imagem</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop',
                ].map((imgUrl, i) => (
                  <div key={i} className="h-28 rounded-xl overflow-hidden border border-white/10 relative group">
                    <img src={imgUrl} alt={`Mídia ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={() => alert('URL copiada para uso em tokens ou handouts!')}
                        className="glass-button p-1.5 rounded-lg text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
