import React, { useState } from 'react';
import { X, Check, Flame, Plus, Trash2 } from 'lucide-react';
import { CharacterAbility, AbilityOriginType, ActionEconomy } from '../../types/abilities';

interface AbilityEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAbility: (ability: CharacterAbility) => void;
  initialAbility?: CharacterAbility;
}

export const AbilityEditorModal: React.FC<AbilityEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveAbility,
  initialAbility,
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'origem' | 'custo' | 'bonus' | 'acoes'>('geral');

  const [name, setName] = useState(initialAbility?.name || '');
  const [description, setDescription] = useState(initialAbility?.description || '');
  const [circleOrLevel, setCircleOrLevel] = useState(initialAbility?.circleOrLevel || 1);
  const [isReaction, setIsReaction] = useState(initialAbility?.isReaction ?? false);
  const [showDescriptionInChat, setShowDescriptionInChat] = useState(initialAbility?.showDescriptionInChat ?? true);

  const [originType, setOriginType] = useState<AbilityOriginType>(initialAbility?.originType || 'Habilidade de Classe');
  const [energyPoints, setEnergyPoints] = useState(initialAbility?.cost.energyPoints || 1);
  const [actionType, setActionType] = useState<ActionEconomy>(initialAbility?.cost.actionType || 'Padrão');

  const [actions, setActions] = useState(
    initialAbility?.actions || [
      {
        id: 'ab-act-1',
        name: 'Efeito Principal',
        formula: '2d6 + @INT',
        testType: 'sem_teste' as const,
        targetStatus: 'hp' as const,
        isHealing: false
      }
    ]
  );

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      alert('Informe o nome da habilidade ou magia.');
      return;
    }

    const ability: CharacterAbility = {
      id: initialAbility?.id || 'ab-' + Date.now(),
      name: name.trim(),
      description,
      circleOrLevel,
      originType,
      isReaction,
      showDescriptionInChat,
      cost: {
        energyPoints,
        actionType,
      },
      passiveBonuses: [],
      actions
    };

    onSaveAbility(ability);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-elevated max-w-xl w-full rounded-2xl p-6 relative animate-modal-in border border-white/10 shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-purple-400" />
            <h3 className="font-cinzel text-lg font-bold text-white">
              {initialAbility ? 'Editar Habilidade / Magia' : 'Nova Habilidade / Ritual'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Tabs */}
        <div className="flex gap-1.5 border-b border-white/10 py-2.5 text-xs">
          {(['geral', 'origem', 'custo', 'bonus', 'acoes'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab === 'acoes' ? 'Ações' : tab === 'bonus' ? 'Bônus' : tab}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
          
          {/* TAB 1: GERAL */}
          {activeTab === 'geral' && (
            <div className="space-y-3">
              <div>
                <label className="text-gray-300 block mb-1">Nome da Habilidade ou Ritual *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Cicatrização, Decadência, Ataque Furtivo..."
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Círculo ou Nível</label>
                <input
                  type="number"
                  min={1}
                  max={9}
                  value={circleOrLevel}
                  onChange={(e) => setCircleOrLevel(Number(e.target.value))}
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Descrição Completa</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Efeitos, alcance, alvos e regras detalhadas..."
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl border border-white/10 bg-black/30 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-200">Reação imediata</div>
                  <div className="text-[10px] text-gray-400">Ativada fora do seu turno em resposta a um gatilho.</div>
                </div>
                <input
                  type="checkbox"
                  checked={isReaction}
                  onChange={(e) => setIsReaction(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ORIGEM */}
          {activeTab === 'origem' && (
            <div className="space-y-3">
              <label className="text-gray-300 block">Classificação da Habilidade</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(['Habilidade de Classe', 'Poder Geral', 'Ritual/Magia', 'Habilidade de Raça', 'Poder de Origem'] as AbilityOriginType[]).map(orig => (
                  <button
                    key={orig}
                    type="button"
                    onClick={() => setOriginType(orig)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      originType === orig
                        ? 'border-purple-500 bg-purple-600/20 text-white shadow-md'
                        : 'border-white/5 bg-black/30 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    <div className="font-semibold text-xs text-gray-200">{orig}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTO */}
          {activeTab === 'custo' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1">Custo de Energia (PE / PM)</label>
                  <input
                    type="number"
                    min={0}
                    value={energyPoints}
                    onChange={(e) => setEnergyPoints(Number(e.target.value))}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs font-mono font-bold text-purple-300"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1">Economia de Ação</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as ActionEconomy)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs bg-black/40 text-gray-200"
                  >
                    <option value="Padrão">Ação Padrão</option>
                    <option value="Movimento">Ação de Movimento</option>
                    <option value="Completa">Ação Completa</option>
                    <option value="Livre">Ação Livre</option>
                    <option value="Reação">Reação</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BÔNUS */}
          {activeTab === 'bonus' && (
            <div className="space-y-3 text-gray-400">
              <p>Modificadores passivos enquanto o poder estiver ativo ou sustentado.</p>
              <div className="p-4 rounded-xl border border-white/5 bg-black/20 text-center text-xs">
                Nenhum bônus passivo configurado.
              </div>
            </div>
          )}

          {/* TAB 5: AÇÕES & FÓRMULAS */}
          {activeTab === 'acoes' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-white/10 bg-black/40 space-y-2.5">
                <label className="text-gray-300 font-semibold block">Fórmula de Efeito / Dano / Cura</label>
                <input
                  type="text"
                  value={actions[0]?.formula || ''}
                  onChange={(e) => {
                    const next = [...actions];
                    next[0] = { ...next[0], formula: e.target.value };
                    setActions(next);
                  }}
                  placeholder="Ex: 3d8 + @INT ou 2d10"
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs font-mono font-bold text-purple-300"
                />

                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={actions[0]?.isHealing}
                      onChange={(e) => {
                        const next = [...actions];
                        next[0] = { ...next[0], isHealing: e.target.checked };
                        setActions(next);
                      }}
                      className="accent-purple-600 rounded"
                    />
                    <span className="text-gray-300">Esta ação é de Cura (recupera PV)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
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
            <Check className="w-4 h-4" />
            <span>Salvar Habilidade</span>
          </button>
        </div>

      </div>
    </div>
  );
};
