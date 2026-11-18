import React, { useState } from 'react';
import { X, Sparkles, TrendingUp, Shield, Zap, Heart, Brain, Check, Plus } from 'lucide-react';
import { Character, SkillTrainingLevel } from '../../types/character';
import { CharacterRulesService } from '../../services/character-rules.service';
import { RPG_SYSTEMS } from '../../types/rpg-systems';

interface CharacterEvolutionModalProps {
  isOpen: boolean;
  character: Character;
  onClose: () => void;
  onConfirmEvolution: (updated: Character) => void;
}

export const CharacterEvolutionModal: React.FC<CharacterEvolutionModalProps> = ({
  isOpen,
  character,
  onClose,
  onConfirmEvolution,
}) => {
  const isOrdem = character.systemId.startsWith('ordem');
  const systemInfo = RPG_SYSTEMS.find(s => s.id === character.systemId) || RPG_SYSTEMS[0];

  const currentLevel = character.levelOrNex;
  const initialTarget = isOrdem
    ? Math.min(99, currentLevel < 95 ? currentLevel + 5 : 99)
    : Math.min(20, currentLevel + 1);

  const [targetLevel, setTargetLevel] = useState<number>(initialTarget);
  const [selectedAttrUpgrade, setSelectedAttrUpgrade] = useState<string>('');
  const [newSkillKey, setNewSkillKey] = useState<string>('');
  const [newSkillTraining, setNewSkillTraining] = useState<SkillTrainingLevel>('treinado');
  const [newAbilityName, setNewAbilityName] = useState<string>('');
  const [newAbilityDesc, setNewAbilityDesc] = useState<string>('');

  if (!isOpen) return null;

  const previewCharacter = CharacterRulesService.evolveCharacter(character, targetLevel, {
    attributeUpgrade: selectedAttrUpgrade || undefined,
    newSkillTraining: newSkillKey ? { skillKey: newSkillKey, training: newSkillTraining } : undefined,
    newAbility: newAbilityName.trim()
      ? {
          id: 'ab-evo-' + Date.now(),
          name: newAbilityName.trim(),
          description: newAbilityDesc.trim() || 'Habilidade adquirida durante a evolução.',
          originType: 'Poder Geral',
          isReaction: false,
          showDescriptionInChat: true,
          cost: { energyPoints: 1, actionType: 'Padrão' },
          actions: [],
          passiveBonuses: [],
        }
      : undefined,
  });

  const hpDiff = previewCharacter.hp.max - character.hp.max;
  const peDiff = (previewCharacter.energy?.max || 0) - (character.energy?.max || 0);
  const sanDiff = (previewCharacter.sanity?.max || 0) - (character.sanity?.max || 0);

  const handleApply = () => {
    onConfirmEvolution(previewCharacter);
    onClose();
  };

  const availableOrdemSteps = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99].filter(
    n => n > currentLevel
  );

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-elevated max-w-2xl w-full rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-6 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                Evoluir Personagem
              </h3>
              <p className="text-xs text-gray-400">
                {character.name} · {character.characterClass} ({isOrdem ? `${currentLevel}% NEX` : `Nível ${currentLevel}`})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-5 text-xs text-gray-300 pr-1">
          <div>
            <label className="text-gray-200 font-semibold block mb-2">
              Selecione o Novo Estágio ({isOrdem ? 'NEX' : 'Nível'})
            </label>
            {isOrdem ? (
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {availableOrdemSteps.map(step => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setTargetLevel(step)}
                    className={`py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      targetLevel === step
                        ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.6)] ring-1 ring-purple-400'
                        : 'bg-black/40 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {step}%
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={currentLevel + 1}
                  max={20}
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(Number(e.target.value))}
                  className="flex-1 accent-purple-600 cursor-pointer"
                />
                <span className="font-mono text-base font-bold text-purple-300 px-3 py-1 rounded-lg bg-black/40 border border-white/10">
                  Nível {targetLevel}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
            <div className="text-center">
              <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1 mb-1">
                <Heart className="w-3 h-3 fill-current" /> Pontos de Vida
              </span>
              <div className="font-mono text-lg font-bold text-white">
                {character.hp.max} <span className="text-purple-400">→</span> {previewCharacter.hp.max}
              </div>
              <span className="text-[10px] text-green-400 font-bold">+{hpDiff} PV Máximo</span>
            </div>

            {character.energy && (
              <div className="text-center">
                <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1 mb-1">
                  <Zap className="w-3 h-3 fill-current" /> {systemInfo.energyName || 'PE'}
                </span>
                <div className="font-mono text-lg font-bold text-white">
                  {character.energy.max} <span className="text-purple-400">→</span> {previewCharacter.energy?.max}
                </div>
                <span className="text-[10px] text-green-400 font-bold">+{peDiff} {systemInfo.energyName || 'PE'}</span>
              </div>
            )}

            {character.sanity && (
              <div className="text-center">
                <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1 mb-1">
                  <Brain className="w-3 h-3" /> Sanidade
                </span>
                <div className="font-mono text-lg font-bold text-white">
                  {character.sanity.max} <span className="text-purple-400">→</span> {previewCharacter.sanity?.max}
                </div>
                <span className="text-[10px] text-green-400 font-bold">+{sanDiff} Sanidade</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-gray-200 font-semibold block mb-2">
              Aprimoramento de Atributo (Opcional)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {systemInfo.attributeKeys.map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedAttrUpgrade(selectedAttrUpgrade === k ? '' : k)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedAttrUpgrade === k
                      ? 'border-purple-500 bg-purple-600/30 text-white shadow-md'
                      : 'border-white/10 bg-black/30 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase">{systemInfo.attributeNames[k] || k}</div>
                  <div className="font-rajdhani text-xl font-bold text-white">
                    {character.attributes[k] || 0}
                    {selectedAttrUpgrade === k && (
                      <span className="text-green-400 ml-1 text-sm font-sans">+1</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-200 font-semibold block mb-2">
              Treinar ou Elevar Grau de Perícia (Opcional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={newSkillKey}
                onChange={(e) => setNewSkillKey(e.target.value)}
                className="glass-input px-3 py-2 rounded-xl text-xs bg-[#10111a]"
              >
                <option value="">Nenhuma perícia selecionada...</option>
                {character.skills.map(s => (
                  <option key={s.key} value={s.key}>
                    {s.name} ({s.training})
                  </option>
                ))}
              </select>

              <select
                value={newSkillTraining}
                onChange={(e) => setNewSkillTraining(e.target.value as SkillTrainingLevel)}
                className="glass-input px-3 py-2 rounded-xl text-xs bg-[#10111a]"
                disabled={!newSkillKey}
              >
                <option value="treinado">Treinado (+5)</option>
                <option value="veterano">Veterano (+10)</option>
                <option value="expert">Expert (+15)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-gray-200 font-semibold block mb-2">
              Novo Poder ou Habilidade Adquirida (Opcional)
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={newAbilityName}
                onChange={(e) => setNewAbilityName(e.target.value)}
                placeholder="Ex: Golpe Pesado, Ritual Paranormal, Surto de Adrenalina..."
                className="glass-input w-full px-3 py-2 rounded-xl text-xs"
              />
              <textarea
                rows={2}
                value={newAbilityDesc}
                onChange={(e) => setNewAbilityDesc(e.target.value)}
                placeholder="Descrição dos efeitos e custos da nova habilidade..."
                className="glass-input w-full px-3 py-2 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="glass-button px-4 py-2 rounded-xl text-xs text-gray-300 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/50"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar Evolução ({isOrdem ? `${targetLevel}% NEX` : `Nível ${targetLevel}`})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
