import React, { useState } from 'react';
import { 
  X, 
  Swords, 
  Flame, 
  Backpack, 
  BookOpen, 
  Dices, 
  ScrollText, 
  Plus, 
  Heart, 
  Zap, 
  Brain, 
  Shield, 
  Footprints, 
  Minus,
  Edit,
  Sparkles,
  Check,
  TrendingUp,
  History,
  AlertTriangle
} from 'lucide-react';
import { Character, CharacterSkill } from '../../types/character';
import { CharacterItem } from '../../types/items';
import { CharacterAbility } from '../../types/abilities';
import { RPG_SYSTEMS } from '../../types/rpg-systems';
import { CharacterRulesService } from '../../services/character-rules.service';
import { CharacterEvolutionModal } from './CharacterEvolutionModal';

interface CharacterSheetModalProps {
  isOpen: boolean;
  character: Character;
  initialTab?: 'attacks' | 'abilities' | 'inventory' | 'skills' | 'stats' | 'bio' | 'history';
  onClose: () => void;
  onUpdateCharacter: (updated: Character) => void;
  onRollDice: (formula: string, title: string, options?: { mode?: 'normal' | 'oculto' | 'maior' | 'menor'; criticalMargin?: number; damageFormula?: string }) => void;
  onOpenItemEditor: (itemToEdit?: CharacterItem) => void;
  onOpenAbilityEditor: (abilityToEdit?: CharacterAbility) => void;
}

const COMMON_CONDITIONS = [
  'Machucado',
  'Sangrando',
  'Inconsciente',
  'Morrendo',
  'Abalado',
  'Atordoado',
  'Vulnerável',
  'Cego',
  'Imóvel'
];

export const CharacterSheetModal: React.FC<CharacterSheetModalProps> = ({
  isOpen,
  character,
  initialTab = 'attacks',
  onClose,
  onUpdateCharacter,
  onRollDice,
  onOpenItemEditor,
  onOpenAbilityEditor,
}) => {
  const [activeTab, setActiveTab] = useState<'attacks' | 'abilities' | 'inventory' | 'skills' | 'stats' | 'bio' | 'history'>(initialTab);
  const [skillSearch, setSkillSearch] = useState('');
  const [skillAttrFilter, setSkillAttrFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [isEditingAttributes, setIsEditingAttributes] = useState(false);

  const [damageInput, setDamageInput] = useState<string>('');
  const [healInput, setHealInput] = useState<string>('');
  const [energySpendInput, setEnergySpendInput] = useState<string>('');

  const systemInfo = RPG_SYSTEMS.find(s => s.id === character.systemId) || RPG_SYSTEMS[0];

  const currentWeight = character.items.reduce((acc, i) => acc + (i.weight * i.quantity), 0);
  const maxCarryWeight = (character.attributes['FOR'] || 1) * 5 || 10;
  const isOverburdened = currentWeight > maxCarryWeight;

  if (!isOpen) return null;

  const activeConditions = character.conditions || [];
  const isHpHalfOrLess = character.hp.current <= Math.floor(character.hp.max / 2);
  const isHpZero = character.hp.current <= 0;

  const handleToggleCondition = (cond: string) => {
    let nextConditions = [...activeConditions];
    if (nextConditions.includes(cond)) {
      nextConditions = nextConditions.filter(c => c !== cond);
    } else {
      nextConditions.push(cond);
    }
    onUpdateCharacter({
      ...character,
      conditions: nextConditions,
    });
  };

  const handleAdjustHp = (delta: number) => {
    const nextCurrent = Math.max(0, Math.min(character.hp.max, character.hp.current + delta));
    const nextConditions = [...activeConditions];
    if (nextCurrent <= 0 && !nextConditions.includes('Inconsciente')) {
      nextConditions.push('Inconsciente');
    }
    onUpdateCharacter({
      ...character,
      hp: { ...character.hp, current: nextCurrent },
      conditions: nextConditions,
    });
  };

  const handleApplyDamage = () => {
    const amount = parseInt(damageInput, 10);
    if (Number.isNaN(amount) || amount <= 0) return;
    handleAdjustHp(-amount);
    setToastMessage(`Dano de ${amount} PV aplicado a ${character.name}!`);
    setDamageInput('');
  };

  const handleApplyHeal = () => {
    const amount = parseInt(healInput, 10);
    if (Number.isNaN(amount) || amount <= 0) return;
    handleAdjustHp(amount);
    setToastMessage(`Cura de ${amount} PV aplicada a ${character.name}!`);
    setHealInput('');
  };

  const handleAdjustEnergy = (delta: number) => {
    if (!character.energy) return;
    const nextCurrent = Math.max(0, Math.min(character.energy.max, character.energy.current + delta));
    onUpdateCharacter({
      ...character,
      energy: { ...character.energy, current: nextCurrent }
    });
  };

  const handleApplySpendEnergy = () => {
    const amount = parseInt(energySpendInput, 10);
    if (Number.isNaN(amount) || amount <= 0) return;
    if (character.energy && character.energy.current < amount) {
      setToastMessage(`Pontos de ${systemInfo.energyName || 'PE'} insuficientes!`);
      return;
    }
    handleAdjustEnergy(-amount);
    setToastMessage(`${amount} ${systemInfo.energyName || 'PE'} consumidos!`);
    setEnergySpendInput('');
  };

  const handleAdjustSanity = (delta: number) => {
    if (!character.sanity) return;
    const nextCurrent = Math.max(0, Math.min(character.sanity.max, character.sanity.current + delta));
    onUpdateCharacter({
      ...character,
      sanity: { ...character.sanity, current: nextCurrent }
    });
  };

  const handleShortRest = () => {
    if (character.energy) {
      handleAdjustEnergy(Math.floor(character.energy.max / 2));
    }
    setToastMessage('Descanso curto realizado: recuperação parcial de energia.');
  };

  const handleLongRest = () => {
    const healedConditions = activeConditions.filter(c => c !== 'Inconsciente' && c !== 'Morrendo');
    onUpdateCharacter({
      ...character,
      hp: { ...character.hp, current: character.hp.max },
      energy: character.energy ? { ...character.energy, current: character.energy.max } : undefined,
      sanity: character.sanity ? { ...character.sanity, current: character.sanity.max } : undefined,
      conditions: healedConditions,
    });
    setToastMessage('Descanso longo concluído: Vida e Recursos recuperados ao máximo!');
  };

  const handleRollSkill = (skill: CharacterSkill) => {
    const isOrdem = character.systemId.startsWith('ordem');
    const attrVal = character.attributes[skill.attributeKey] || 1;
    const bonus = skill.total || 0;

    if (isOrdem) {
      const diceCount = Math.max(1, attrVal);
      const formula = `${diceCount}d20k1 + ${bonus}`;
      onRollDice(formula, `Teste de ${skill.name}`, {
        mode: diceCount > 1 ? 'maior' : 'normal',
        criticalMargin: 20
      });
    } else {
      const formula = `1d20 + ${bonus}`;
      onRollDice(formula, `Teste de ${skill.name}`);
    }
  };

  const handleRollAttribute = (attrKey: string, attrName: string) => {
    const val = character.attributes[attrKey] || 1;
    const isOrdem = character.systemId.startsWith('ordem');

    if (isOrdem) {
      const diceCount = Math.max(1, val);
      onRollDice(`${diceCount}d20k1`, `Teste Puro de ${attrName}`, {
        mode: diceCount > 1 ? 'maior' : 'normal',
        criticalMargin: 20
      });
    } else {
      const mod = Math.floor((val - 10) / 2);
      const sign = mod >= 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`;
      onRollDice(`1d20 ${sign}`, `Teste Puro de ${attrName}`);
    }
  };

  const handleRollAttackAction = (item: CharacterItem, actionIdx: number) => {
    const act = item.actions[actionIdx];
    if (!act) return;

    onRollDice(act.formula, `${item.name} — ${act.name}`, {
      criticalMargin: act.criticalMargin || 20,
      damageFormula: act.formula
    });
  };

  const handleCastAbility = (ability: CharacterAbility) => {
    if (ability.cost.energyPoints > 0 && character.energy) {
      if (character.energy.current < ability.cost.energyPoints) {
        setToastMessage(`Pontos insuficientes de ${systemInfo.energyName || 'Energia'}! Requer ${ability.cost.energyPoints}.`);
        return;
      }
      handleAdjustEnergy(-ability.cost.energyPoints);
    }

    if (ability.actions.length > 0) {
      const act = ability.actions[0];
      onRollDice(act.formula, `${ability.name} — Ação`, {
        damageFormula: act.formula
      });
    } else {
      setToastMessage(`Habilidade [${ability.name}] ativada com sucesso! Custo de ${ability.cost.energyPoints} ${systemInfo.energyName || 'PE'}.`);
    }
  };

  const handleModifyAttribute = (attrKey: string, delta: number) => {
    const current = character.attributes[attrKey] ?? 1;
    const nextVal = Math.max(0, current + delta);
    const updatedAttributes = { ...character.attributes, [attrKey]: nextVal };

    const updatedSkills = CharacterRulesService.recalculateSkills(
      character.skills,
      updatedAttributes,
      character.systemId,
      character.levelOrNex
    );

    let nextHpMax = character.hp.max;
    let nextPeMax = character.energy ? character.energy.max : 0;
    let nextSanMax = character.sanity ? character.sanity.max : 0;
    let nextDefense = character.defense;

    if (character.autoCalculateStatus) {
      if (character.systemId.startsWith('ordem')) {
        const stats = CharacterRulesService.calculateOrdemStatus(
          character.characterClass,
          character.levelOrNex,
          updatedAttributes['VIG'] || 1,
          updatedAttributes['PRE'] || 1
        );
        nextHpMax = stats.maxHp;
        nextPeMax = stats.maxPe;
        nextSanMax = stats.maxSan;
        nextDefense = 10 + (updatedAttributes['AGI'] || 1);
      }
    }

    onUpdateCharacter({
      ...character,
      attributes: updatedAttributes,
      skills: updatedSkills,
      defense: nextDefense,
      hp: {
        current: Math.min(nextHpMax, character.hp.current),
        max: nextHpMax,
      },
      energy: character.energy
        ? {
            current: Math.min(nextPeMax, character.energy.current),
            max: nextPeMax,
          }
        : undefined,
      sanity: character.sanity
        ? {
            current: Math.min(nextSanMax, character.sanity.current),
            max: nextSanMax,
          }
        : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="glass-panel-elevated max-w-5xl w-[96vw] sm:w-full rounded-2xl relative animate-modal-in border border-white/10 shadow-2xl max-h-[96vh] flex flex-col overflow-hidden">
        
        {toastMessage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-[#121826]/95 border border-purple-500/60 text-purple-200 px-4 py-2 rounded-xl text-xs flex items-center gap-3 shadow-2xl backdrop-blur-md animate-fadeIn">
            <span>✨ {toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-gray-400 hover:text-white p-0.5 cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        
        <div className="p-3 sm:p-5 bg-gradient-to-r from-purple-950/60 via-[#181924] to-black/60 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 shrink-0">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-purple-500/50 shadow-xl bg-purple-950/40 flex items-center justify-center">
                <img 
                  src={character.token.imageUrl} 
                  alt={character.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="absolute -bottom-1 -right-1 text-[10px] bg-purple-700 text-white px-1.5 py-0.2 rounded font-bold font-mono">
                {character.systemId.startsWith('ordem') ? `${character.levelOrNex}%` : `Nv.${character.levelOrNex}`}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
                  {character.name}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-500/40 bg-purple-500/20 text-purple-300">
                  {systemInfo.name}
                </span>
                <button
                  type="button"
                  onClick={() => setShowEvolutionModal(true)}
                  className="btn-primary px-2.5 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md cursor-pointer hover:scale-105 transition-all"
                  title="Evoluir Nível / NEX"
                >
                  <TrendingUp className="w-3 h-3" />
                  <span>Evoluir</span>
                </button>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                {character.characterClass}
                {character.subclass ? ` · ${character.subclass}` : ''}
                {character.originOrBackground ? ` · ${character.originOrBackground}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="p-2.5 rounded-xl bg-black/40 border border-red-500/30 flex flex-col min-w-[155px]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <Heart className="w-3.5 h-3.5 fill-red-400/40" />
                </div>
                <div>
                  <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Vida (PV)</div>
                  <div className="font-mono text-sm font-bold text-white">
                    {character.hp.current} / {character.hp.max}
                  </div>
                </div>
                <div className="flex flex-col gap-1 ml-auto">
                  <button 
                    onClick={() => handleAdjustHp(1)} 
                    className="w-4 h-4 text-xs bg-white/10 hover:bg-white/20 text-white rounded flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => handleAdjustHp(-1)} 
                    className="w-4 h-4 text-xs bg-white/10 hover:bg-white/20 text-white rounded flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                </div>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div 
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, (character.hp.current / (character.hp.max || 1)) * 100))}%` }}
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2 pt-1 border-t border-white/5">
                <input
                  type="number"
                  min="1"
                  placeholder="Qtd"
                  value={damageInput}
                  onChange={(e) => setDamageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyDamage()}
                  className="w-12 px-1 py-0.5 text-[10px] bg-black/50 border border-red-500/30 rounded text-white font-mono text-center"
                />
                <button
                  type="button"
                  onClick={handleApplyDamage}
                  className="px-1.5 py-0.5 rounded bg-red-600/30 hover:bg-red-600/50 text-red-200 text-[10px] font-bold cursor-pointer"
                >
                  Dano
                </button>
                <button
                  type="button"
                  onClick={handleApplyHeal}
                  className="px-1.5 py-0.5 rounded bg-green-600/30 hover:bg-green-600/50 text-green-200 text-[10px] font-bold cursor-pointer"
                >
                  Cura
                </button>
              </div>
            </div>

            {character.energy && (
              <div className="p-2.5 rounded-xl bg-black/40 border border-purple-500/30 flex flex-col min-w-[155px]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5 fill-purple-400/40" />
                  </div>
                  <div>
                    <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                      {systemInfo.energyName || 'Esforço'}
                    </div>
                    <div className="font-mono text-sm font-bold text-white">
                      {character.energy.current} / {character.energy.max}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ml-auto">
                    <button 
                      onClick={() => handleAdjustEnergy(1)} 
                      className="w-4 h-4 text-xs bg-white/10 hover:bg-white/20 text-white rounded flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => handleAdjustEnergy(-1)} 
                      className="w-4 h-4 text-xs bg-white/10 hover:bg-white/20 text-white rounded flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                  </div>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="h-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, (character.energy.current / (character.energy.max || 1)) * 100))}%` }}
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-2 pt-1 border-t border-white/5">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qtd"
                    value={energySpendInput}
                    onChange={(e) => setEnergySpendInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplySpendEnergy()}
                    className="w-12 px-1 py-0.5 text-[10px] bg-black/50 border border-purple-500/30 rounded text-white font-mono text-center"
                  />
                  <button
                    type="button"
                    onClick={handleApplySpendEnergy}
                    className="px-2 py-0.5 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-[10px] font-bold cursor-pointer"
                  >
                    Gastar
                  </button>
                </div>
              </div>
            )}

            {character.sanity && (
              <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/30 flex flex-col min-w-[130px]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Brain className="w-3.5 h-3.5 fill-cyan-400/40" />
                  </div>
                  <div>
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Sanidade</div>
                    <div className="font-mono text-sm font-bold text-white">
                      {character.sanity.current} / {character.sanity.max}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ml-auto">
                    <button 
                      onClick={() => handleAdjustSanity(1)} 
                      className="w-4 h-4 text-xs bg-white/10 hover:bg-white/20 text-white rounded flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => handleAdjustSanity(-1)} 
                      className="w-4 h-4 text-xs bg-white/10 hover:bg-white/20 text-white rounded flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                  </div>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, (character.sanity.current / (character.sanity.max || 1)) * 100))}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pl-2">
              <div className="text-center px-2.5 py-1.5 rounded-xl bg-black/30 border border-white/10">
                <span className="text-[10px] text-gray-400 block">Defesa</span>
                <span className="font-mono text-xs font-bold text-yellow-300">{character.defense}</span>
              </div>
              <div className="text-center px-2.5 py-1.5 rounded-xl bg-black/30 border border-white/10">
                <span className="text-[10px] text-gray-400 block">Desloc.</span>
                <span className="font-mono text-xs font-bold text-gray-200">{character.speed}</span>
              </div>
            </div>

            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 ml-2 cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-2 bg-[#100f17] border-b border-white/5 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-gray-500 font-bold uppercase shrink-0 text-[10px]">Condições:</span>
          {COMMON_CONDITIONS.map(cond => {
            const isAutoCondition = (cond === 'Machucado' && isHpHalfOrLess) || (cond === 'Inconsciente' && isHpZero);
            const isSelected = activeConditions.includes(cond) || isAutoCondition;
            return (
              <button
                key={cond}
                type="button"
                onClick={() => handleToggleCondition(cond)}
                className={`px-2 py-0.5 rounded-full border transition-all cursor-pointer whitespace-nowrap text-[10px] font-semibold ${
                  isSelected
                    ? 'bg-red-500/20 border-red-500 text-red-200 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {cond}
              </button>
            );
          })}
        </div>

        <div className="px-4 sm:px-6 py-2 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 bg-[#12131a] shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto text-xs py-1 no-scrollbar">
            <button
              onClick={() => setActiveTab('attacks')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                activeTab === 'attacks' 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Ataques ({character.items.flatMap(i => i.actions).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('abilities')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                activeTab === 'abilities' 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Poderes ({character.abilities.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                activeTab === 'inventory' 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Backpack className="w-3.5 h-3.5" />
              <span>Inventário ({character.items.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                activeTab === 'skills' 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Perícias ({character.skills.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                activeTab === 'stats' 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Atributos</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                activeTab === 'history' 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Progressão ({(character.progressionHistory || []).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bio')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                activeTab === 'bio' 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>História</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShortRest}
              className="glass-button text-[11px] px-2.5 py-1 rounded-lg text-gray-300 hover:text-purple-300 cursor-pointer"
            >
              Descanso Curto
            </button>
            <button
              onClick={handleLongRest}
              className="glass-button text-[11px] px-2.5 py-1 rounded-lg text-yellow-400 hover:text-yellow-300 border-yellow-500/20 cursor-pointer"
            >
              Descanso Longo
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'attacks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cinzel text-base font-bold text-white">Ataques e Ações Diretas</h4>
                  <p className="text-xs text-gray-400">Clique em qualquer ação para rolar dados diretamente.</p>
                </div>
                <button
                  onClick={() => onOpenItemEditor()}
                  className="btn-primary text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Arma / Ataque</span>
                </button>
              </div>

              {character.items.flatMap(item => item.actions.map(act => ({ item, act }))).length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-white/5 bg-black/20 text-gray-400 text-xs">
                  Nenhuma arma ou ação de ataque equipada. Crie um item com ação para rolar no combate!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {character.items.flatMap(item => 
                    item.actions.map((act, actIdx) => (
                      <div 
                        key={act.id + actIdx}
                        className="p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-purple-500/40 flex items-center justify-between group transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-200 group-hover:text-purple-300">
                              {act.name}
                            </span>
                            <span className="text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.2 rounded font-mono">
                              {item.name}
                            </span>
                          </div>
                          <div className="text-xs text-purple-400 font-mono font-bold">
                            Fórmula: {act.formula}
                          </div>
                          <div className="text-[10px] text-gray-400 flex items-center gap-2">
                            <span>Crítico: {act.criticalMargin || 20}</span>
                            {act.range && <span>· Alcance: {act.range}</span>}
                          </div>
                        </div>

                        <button
                          onClick={() => handleRollAttackAction(item, actIdx)}
                          className="btn-primary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
                        >
                          <Dices className="w-4 h-4" />
                          <span>Rolar Ataque</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'abilities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cinzel text-base font-bold text-white">Habilidades, Magias e Rituais</h4>
                  <p className="text-xs text-gray-400">Poderes ativáveis com consumo de recursos e efeitos.</p>
                </div>
                <button
                  onClick={() => onOpenAbilityEditor()}
                  className="btn-primary text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Habilidade / Ritual</span>
                </button>
              </div>

              {character.abilities.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-white/5 bg-black/20 text-gray-400 text-xs">
                  Nenhuma habilidade adicionada. Clique em Nova Habilidade para cadastrar seus rituais e poderes de classe!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {character.abilities.map(ab => (
                    <div 
                      key={ab.id}
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-purple-500/40 flex flex-col justify-between space-y-3 group transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-gray-200 group-hover:text-purple-300">
                            {ab.name}
                          </span>
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                            {ab.cost.energyPoints} {systemInfo.energyName || 'PE'} · {ab.cost.actionType}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{ab.originType}</div>
                        <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                          {ab.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <button
                          onClick={() => onOpenAbilityEditor(ab)}
                          className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleCastAbility(ab)}
                          className="btn-primary px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Conjurar / Ativar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cinzel text-base font-bold text-white">Inventário e Mochila</h4>
                  <div className="text-xs text-gray-400 flex items-center gap-3 mt-0.5">
                    <span>
                      Peso total:{' '}
                      <strong className={isOverburdened ? 'text-red-400' : 'text-gray-200'}>
                        {currentWeight} / {maxCarryWeight} kg
                      </strong>
                    </span>
                    <span>·</span>
                    <span>
                      Moedas:{' '}
                      <strong className="text-yellow-400 font-mono font-bold">
                        {character.coins} {character.currencyUnit}
                      </strong>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onOpenItemEditor()}
                  className="btn-primary text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Item</span>
                </button>
              </div>

              {isOverburdened && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Sobrecarga ativa: Carga acima de {maxCarryWeight}kg reduz velocidade e impõe desvantagens táticas.</span>
                </div>
              )}

              {character.items.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">Nenhum item no inventário.</p>
              ) : (
                <div className="space-y-2">
                  {character.items.map(item => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between group hover:border-purple-500/30 transition-all text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            const updatedItems = character.items.map(i => 
                              i.id === item.id ? { ...i, equipped: !i.equipped } : i
                            );
                            onUpdateCharacter({ ...character, items: updatedItems });
                          }}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                            item.equipped 
                              ? 'bg-purple-600 border-purple-400 text-white' 
                              : 'bg-white/5 border-white/10 text-gray-600'
                          }`}
                          title="Alternar equipar"
                        >
                          {item.equipped && <Check className="w-3.5 h-3.5" />}
                        </button>

                        <div>
                          <div className="font-semibold text-gray-200 flex items-center gap-2">
                            <span>{item.name}</span>
                            <span className="text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.2 rounded">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-mono">
                          Qtd: {item.quantity} · {item.weight * item.quantity}kg
                        </span>
                        <button
                          onClick={() => onOpenItemEditor(item)}
                          className="p-1.5 text-gray-400 hover:text-white glass-button rounded-lg cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-cinzel text-base font-bold text-white">Tabela de Perícias</h4>
                  <p className="text-xs text-gray-400">Clique na perícia para rolar dados automáticos.</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    placeholder="Buscar perícia..."
                    className="glass-input px-2.5 py-1 rounded-lg text-xs w-36"
                  />
                  <div className="flex items-center gap-1">
                    {['ALL', ...systemInfo.attributeKeys].map(attrKey => (
                      <button
                        key={attrKey}
                        type="button"
                        onClick={() => setSkillAttrFilter(attrKey)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                          skillAttrFilter === attrKey
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {attrKey === 'ALL' ? 'Todos' : attrKey}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {character.skills
                  .filter(s => (skillAttrFilter === 'ALL' || s.attributeKey === skillAttrFilter) && s.name.toLowerCase().includes(skillSearch.toLowerCase()))
                  .map(s => {
                    const isTrained = s.training !== 'destreinado';
                    return (
                      <button
                        key={s.key}
                        onClick={() => handleRollSkill(s)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all group cursor-pointer ${
                          isTrained
                            ? 'border-purple-500/40 bg-purple-600/15 hover:bg-purple-600/25'
                            : 'border-white/5 bg-black/30 hover:border-white/20'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-semibold text-xs text-gray-200 group-hover:text-purple-300">
                            {s.name}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {s.attributeKey} · <span className="text-purple-300 capitalize">{s.training}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-purple-400 shrink-0">
                          <Dices className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                          <span>{s.total !== undefined && s.total > 0 ? `+${s.total}` : '+0'}</span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cinzel text-base font-bold text-white">Valores de Atributos</h4>
                  <p className="text-xs text-gray-400">Clique na caixa do atributo para rolar um teste puro.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingAttributes(!isEditingAttributes)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isEditingAttributes
                      ? 'bg-purple-600 text-white'
                      : 'glass-button text-gray-300 hover:text-white'
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>{isEditingAttributes ? 'Concluir Edição' : 'Editar Atributos'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {systemInfo.attributeKeys.map(k => (
                  <div
                    key={k}
                    className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-purple-500/60 text-center transition-all flex flex-col justify-between"
                  >
                    <span className="text-xs text-purple-400 font-bold uppercase tracking-wider block">
                      {systemInfo.attributeNames[k] || k}
                    </span>
                    
                    {isEditingAttributes ? (
                      <div className="flex items-center justify-between bg-black/50 rounded-full px-2 py-1 border border-white/10 my-2">
                        <button
                          type="button"
                          onClick={() => handleModifyAttribute(k, -1)}
                          className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-rajdhani text-2xl font-bold text-white px-1">
                          {character.attributes[k] || 0}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleModifyAttribute(k, 1)}
                          className="w-6 h-6 rounded-full bg-purple-600/40 hover:bg-purple-600/70 flex items-center justify-center text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRollAttribute(k, systemInfo.attributeNames[k] || k)}
                        className="my-1 group cursor-pointer"
                      >
                        <span className="font-rajdhani text-4xl font-bold text-white block group-hover:text-purple-300 group-hover:scale-105 transition-all">
                          {character.attributes[k] || 0}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
                          Rolar {k} →
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cinzel text-base font-bold text-white">Histórico de Progressão</h4>
                  <p className="text-gray-400">Auditoria dos estágios alcançados, incrementos de recursos e poderes.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEvolutionModal(true)}
                  className="btn-primary text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Novo Avanço</span>
                </button>
              </div>

              {(!character.progressionHistory || character.progressionHistory.length === 0) ? (
                <div className="p-8 text-center rounded-2xl border border-white/5 bg-black/20 text-gray-400">
                  Nenhum registro de evolução gravado ainda. Utilize o botão Evoluir para registrar o avanço do personagem!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {character.progressionHistory.map(entry => (
                    <div key={entry.id} className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-purple-300 font-cinzel">
                          {entry.description}
                        </span>
                        <span className="font-mono text-[10px] text-gray-500">
                          {entry.date}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px] text-gray-300">
                        {entry.hpGain > 0 && (
                          <span className="text-red-400 font-mono font-semibold">+{entry.hpGain} PV</span>
                        )}
                        {entry.energyGain > 0 && (
                          <span className="text-purple-400 font-mono font-semibold">+{entry.energyGain} {systemInfo.energyName || 'PE'}</span>
                        )}
                        {entry.sanityGain > 0 && (
                          <span className="text-cyan-400 font-mono font-semibold">+{entry.sanityGain} Sanidade</span>
                        )}
                        {entry.attributeUpgrade && (
                          <span className="text-green-400 font-semibold">+1 {entry.attributeUpgrade}</span>
                        )}
                      </div>
                      {entry.newAbilities && entry.newAbilities.length > 0 && (
                        <div className="text-[10px] text-yellow-300">
                          Habilidades adquiridas: {entry.newAbilities.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bio' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-cinzel text-base font-bold text-white mb-2">Biografia & Anotações</h4>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {character.biography || 'Nenhuma história cadastrada ainda.'}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-white/10 bg-[#12131a] flex items-center justify-between text-xs text-gray-400 shrink-0">
          <span>Dark Age RPG · Taverna 1 Natural</span>
          <button onClick={onClose} className="glass-button px-4 py-1.5 rounded-xl text-gray-200 cursor-pointer">
            Fechar Ficha
          </button>
        </div>

        <CharacterEvolutionModal
          isOpen={showEvolutionModal}
          character={character}
          onClose={() => setShowEvolutionModal(false)}
          onConfirmEvolution={(updated) => {
            onUpdateCharacter(updated);
            setToastMessage(`Evolução concluída com sucesso para ${character.systemId.startsWith('ordem') ? `${updated.levelOrNex}% NEX` : `Nível ${updated.levelOrNex}`}!`);
          }}
        />

      </div>
    </div>
  );
};
