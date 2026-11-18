import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Footprints, 
  Heart, 
  Zap, 
  Brain, 
  Moon, 
  Sun, 
  Dices, 
  Search, 
  Swords, 
  Sparkles, 
  Briefcase, 
  ListChecks, 
  BarChart2, 
  BookOpen,
  TrendingUp,
  History,
  Edit,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { Character, CharacterSkill, SkillTrainingLevel } from '../../types/character';
import { ItemAction } from '../../types/items';
import { CharacterRulesService } from '../../services/character-rules.service';
import { CharacterEvolutionModal } from '../characters/CharacterEvolutionModal';

interface VttCharacterSheetOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  allCharacters?: Character[];
  onSelectCharacter?: (char: Character) => void;
  isMasterView: boolean;
  onRollDice: (formula: string, title: string) => void;
  onUpdateCharacter: (char: Character) => void;
  onShowToast: (msg: string) => void;
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

export const VttCharacterSheetOverlay: React.FC<VttCharacterSheetOverlayProps> = ({
  isOpen,
  onClose,
  character,
  allCharacters = [],
  onSelectCharacter,
  isMasterView,
  onRollDice,
  onUpdateCharacter,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'attacks' | 'abilities' | 'inventory' | 'skills' | 'stats' | 'bio' | 'history'>('attacks');
  const [skillSearch, setSkillSearch] = useState('');
  const [skillAttrFilter, setSkillAttrFilter] = useState<string>('todos');
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [isEditingAttributes, setIsEditingAttributes] = useState(false);

  const [damageInput, setDamageInput] = useState<string>('');
  const [healInput, setHealInput] = useState<string>('');
  const [energySpendInput, setEnergySpendInput] = useState<string>('');

  if (!isOpen) return null;

  const isOrdem = character.systemId.startsWith('ordem');
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
    onShowToast(`Dano de ${amount} PV aplicado a ${character.name}!`);
    setDamageInput('');
  };

  const handleApplyHeal = () => {
    const amount = parseInt(healInput, 10);
    if (Number.isNaN(amount) || amount <= 0) return;
    handleAdjustHp(amount);
    onShowToast(`Cura de ${amount} PV aplicada a ${character.name}!`);
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
      onShowToast(`Pontos de energia insuficientes!`);
      return;
    }
    handleAdjustEnergy(-amount);
    onShowToast(`${amount} PE consumidos!`);
    setEnergySpendInput('');
  };

  const handleShortRest = () => {
    const vigBonus = character.attributes['VIG'] || character.attributes['vig'] || 1;
    const preBonus = character.attributes['PRE'] || character.attributes['pre'] || 1;
    const healedHp = Math.min(character.hp.max, character.hp.current + Math.max(1, vigBonus));
    const healedEnergy = character.energy 
      ? Math.min(character.energy.max, character.energy.current + Math.max(1, preBonus)) 
      : undefined;

    onUpdateCharacter({
      ...character,
      hp: { ...character.hp, current: healedHp },
      energy: healedEnergy ? { ...character.energy!, current: healedEnergy } : character.energy
    });
    onShowToast(`Descanso Curto concluído: ${character.name} recuperou PV e PE!`);
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
    onShowToast(`Descanso Longo concluído: ${character.name} totalmente revigorado!`);
  };

  const currentWeight = character.items.reduce((acc, item) => acc + (item.weight * item.quantity), 0);
  const forValue = character.attributes['FOR'] || character.attributes['for'] || 1;
  const maxWeight = Math.max(10, forValue * 5);
  const isOverburdened = currentWeight > maxWeight;

  const filteredSkills = character.skills.filter(sk => {
    const matchesSearch = !skillSearch.trim() || sk.name.toLowerCase().includes(skillSearch.toLowerCase());
    const matchesAttr = skillAttrFilter === 'todos' || sk.attributeKey.toLowerCase() === skillAttrFilter.toLowerCase();
    return matchesSearch && matchesAttr;
  });

  const allAttacks: { item: string; action: ItemAction }[] = [];
  character.items.forEach(item => {
    if (item.actions && item.actions.length > 0) {
      item.actions.forEach(action => {
        allAttacks.push({ item: item.name, action });
      });
    }
  });

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

    if (character.autoCalculateStatus && isOrdem) {
      const stats = CharacterRulesService.calculateOrdemStatus(
        character.characterClass,
        character.levelOrNex,
        updatedAttributes['VIG'] || 1,
        updatedAttributes['PRE'] || 1
      );
      nextHpMax = stats.maxHp;
      nextPeMax = stats.maxPe;
      nextSanMax = stats.maxSan;
      const equipDef = (character.items || [])
        .filter(it => it.equipped)
        .reduce((sum, it) => {
          const itemDef = (it.passiveBonuses || [])
            .filter(b => b.statKey === 'defense')
            .reduce((bSum, b) => bSum + b.value, 0);
          return sum + itemDef;
        }, 0);
      nextDefense = 10 + (updatedAttributes['AGI'] ?? 0) + equipDef;
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

  const handleToggleEquipItem = (itemId: string) => {
    const updatedItems = character.items.map(i => i.id === itemId ? { ...i, equipped: !i.equipped } : i);
    const updatedChar: Character = {
      ...character,
      items: updatedItems,
      defense: CharacterRulesService.calculateTotalDefense({
        ...character,
        items: updatedItems
      })
    };
    onUpdateCharacter(updatedChar);
  };

  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = character.items.find(i => i.id === itemId);
    const updatedItems = character.items.filter(i => i.id !== itemId);
    const updatedChar: Character = {
      ...character,
      items: updatedItems,
      defense: CharacterRulesService.calculateTotalDefense({
        ...character,
        items: updatedItems
      })
    };
    onUpdateCharacter(updatedChar);
    if (itemToRemove) {
      onShowToast(`Item "${itemToRemove.name}" removido do inventário!`);
    }
  };

  const handleRemoveAbility = (abilityId: string) => {
    const abToRemove = character.abilities.find(a => a.id === abilityId);
    const updatedAbilities = character.abilities.filter(a => a.id !== abilityId);
    onUpdateCharacter({
      ...character,
      abilities: updatedAbilities
    });
    if (abToRemove) {
      onShowToast(`Habilidade "${abToRemove.name}" removida da ficha!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm select-none animate-modal-in">
      <div className="w-full max-w-5xl h-[92vh] max-h-[860px] bg-[#121118]/98 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-gray-200">
        
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#171422]/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={character.token?.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                alt={character.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-500/50 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-black/90 border border-purple-500/40 text-[9px] font-mono text-purple-300 px-1 rounded-full">
                {isOrdem ? `${character.levelOrNex}%` : `Nv.${character.levelOrNex}`}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">
                  {character.name}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowEvolutionModal(true)}
                  className="btn-primary px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm cursor-pointer hover:scale-105 transition-all"
                >
                  <TrendingUp className="w-3 h-3" />
                  <span>Evoluir</span>
                </button>
                {isMasterView && allCharacters.length > 1 && (
                  <select
                    value={character.id}
                    onChange={(e) => {
                      const found = allCharacters.find(c => c.id === e.target.value);
                      if (found && onSelectCharacter) onSelectCharacter(found);
                    }}
                    className="bg-[#211b30] border border-purple-500/40 text-purple-200 text-[10px] rounded px-1.5 py-0.5 cursor-pointer ml-1"
                  >
                    {allCharacters.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.ownerType === 'master' ? 'Mestre' : 'Jogador'})</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
                <span className="text-purple-300 font-semibold">{character.characterClass}</span>
                <span>·</span>
                <span>{character.originOrBackground || 'Sem Origem'}</span>
                <span>·</span>
                <span className="text-gray-500">{isOrdem ? `${character.levelOrNex}% NEX` : `Nível ${character.levelOrNex}`}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col gap-1 min-w-[125px] p-2 rounded-xl bg-black/40 border border-red-500/30">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-current" /> PV
                </span>
                <span className="font-mono text-gray-200 font-bold">
                  {character.hp.current}/{character.hp.max}
                </span>
                <div className="flex gap-1 ml-1">
                  <button onClick={() => handleAdjustHp(1)} className="w-3.5 h-3.5 rounded bg-white/10 text-white flex items-center justify-center text-[10px] cursor-pointer">+</button>
                  <button onClick={() => handleAdjustHp(-1)} className="w-3.5 h-3.5 rounded bg-white/10 text-white flex items-center justify-center text-[10px] cursor-pointer">-</button>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, (character.hp.current / character.hp.max) * 100))}%` }}
                />
              </div>
              <div className="flex items-center gap-1 mt-1">
                <input
                  type="number"
                  min="1"
                  placeholder="Qtd"
                  value={damageInput}
                  onChange={(e) => setDamageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyDamage()}
                  className="w-9 px-1 py-0.2 text-[9px] bg-black/50 border border-red-500/30 rounded text-white font-mono text-center"
                />
                <button type="button" onClick={handleApplyDamage} className="px-1 rounded bg-red-600/30 hover:bg-red-600/50 text-red-200 text-[9px] font-bold cursor-pointer">Dano</button>
                <button type="button" onClick={handleApplyHeal} className="px-1 rounded bg-green-600/30 hover:bg-green-600/50 text-green-200 text-[9px] font-bold cursor-pointer">Cura</button>
              </div>
            </div>

            {character.energy && (
              <div className="flex flex-col gap-1 min-w-[115px] p-2 rounded-xl bg-black/40 border border-purple-500/30">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-purple-400 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" /> PE
                  </span>
                  <span className="font-mono text-gray-200 font-bold">
                    {character.energy.current}/{character.energy.max}
                  </span>
                  <div className="flex gap-1 ml-1">
                    <button onClick={() => handleAdjustEnergy(1)} className="w-3.5 h-3.5 rounded bg-white/10 text-white flex items-center justify-center text-[10px] cursor-pointer">+</button>
                    <button onClick={() => handleAdjustEnergy(-1)} className="w-3.5 h-3.5 rounded bg-white/10 text-white flex items-center justify-center text-[10px] cursor-pointer">-</button>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, (character.energy.current / character.energy.max) * 100))}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qtd"
                    value={energySpendInput}
                    onChange={(e) => setEnergySpendInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplySpendEnergy()}
                    className="w-10 px-1 py-0.2 text-[9px] bg-black/50 border border-purple-500/30 rounded text-white font-mono text-center"
                  />
                  <button type="button" onClick={handleApplySpendEnergy} className="px-1.5 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-[9px] font-bold cursor-pointer">Gastar</button>
                </div>
              </div>
            )}

            {character.sanity && (
              <div className="flex flex-col gap-1 min-w-[90px] p-2 rounded-xl bg-black/40 border border-cyan-500/30">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Brain className="w-3 h-3" /> SAN
                  </span>
                  <span className="font-mono text-gray-200 font-bold">
                    {character.sanity.current}/{character.sanity.max}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, (character.sanity.current / character.sanity.max) * 100))}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded-lg" title="Defesa Passiva">
                <Shield className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-white">{character.defense}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded-lg" title="Deslocamento">
                <Footprints className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-white">{character.speed}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShortRest}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                title="Descanso Curto"
              >
                <Moon className="w-3 h-3 text-purple-400" />
                <span>Curto</span>
              </button>
              <button
                type="button"
                onClick={handleLongRest}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                title="Descanso Longo"
              >
                <Sun className="w-3 h-3 text-amber-400" />
                <span>Longo</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-4 py-1.5 bg-[#100f17] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto text-[10px]">
          <span className="text-gray-500 font-bold uppercase shrink-0">Condições:</span>
          {COMMON_CONDITIONS.map(cond => {
            const isAuto = (cond === 'Machucado' && isHpHalfOrLess) || (cond === 'Inconsciente' && isHpZero);
            const isSelected = activeConditions.includes(cond) || isAuto;
            return (
              <button
                key={cond}
                type="button"
                onClick={() => handleToggleCondition(cond)}
                className={`px-2 py-0.5 rounded-full border transition-all cursor-pointer whitespace-nowrap font-medium ${
                  isSelected
                    ? 'bg-red-500/20 border-red-500 text-red-200'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {cond}
              </button>
            );
          })}
        </div>

        <div className="flex border-b border-white/[0.08] px-4 bg-[#14121c]/50 text-xs shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('attacks')}
            className={`py-2.5 px-3.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'attacks' ? 'border-purple-500 text-purple-300 bg-white/[0.03]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Ataques & Ações</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('abilities')}
            className={`py-2.5 px-3.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'abilities' ? 'border-purple-500 text-purple-300 bg-white/[0.03]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Poderes & Magias</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`py-2.5 px-3.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory' ? 'border-purple-500 text-purple-300 bg-white/[0.03]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Inventário ({currentWeight}/{maxWeight}kg)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`py-2.5 px-3.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'skills' ? 'border-purple-500 text-purple-300 bg-white/[0.03]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>Perícias ({character.skills.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`py-2.5 px-3.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'stats' ? 'border-purple-500 text-purple-300 bg-white/[0.03]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Atributos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-3.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'history' ? 'border-purple-500 text-purple-300 bg-white/[0.03]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Progressão ({(character.progressionHistory || []).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bio')}
            className={`py-2.5 px-3.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'bio' ? 'border-purple-500 text-purple-300 bg-white/[0.03]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>História</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-[#0e0d14]/40">
          {activeTab === 'attacks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Armas e Golpes Preparados</span>
                <button
                  type="button"
                  onClick={() => onRollDice('1d20k1+5', `${character.name} — Teste de Ataque Geral`)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>Rolar Ataque Rápido</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allAttacks.length > 0 ? (
                  allAttacks.map(({ item, action }) => (
                    <div
                      key={action.id}
                      className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-purple-500/40 transition-colors flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold text-sm text-white font-cinzel">{action.name}</span>
                          <div className="text-[10px] text-gray-500">{item}</div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded">
                          {action.damageType || 'Balístico'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mb-3 font-mono">
                        <div>
                          <span className="text-[10px] text-gray-500 block">TESTE</span>
                          {action.formula || '1d20 + 5'}
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block">CRÍTICO</span>
                          {action.criticalMargin ? `${action.criticalMargin}/x${action.criticalMultiplier || 2}` : '20/x2'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRollDice(action.formula || '1d20+5', `${character.name} — Ataque com ${action.name}`)}
                        className="w-full py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Dices className="w-3.5 h-3.5" />
                        <span>Rolar no Chat da Mesa</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-6 text-center text-gray-500 text-xs">
                    Nenhum ataque configurado nas armas desta ficha. Use o botão acima para rolagem rápida.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'abilities' && (
            <div className="space-y-3">
              <span className="text-xs text-gray-400">Poderes de Classe, Origem e Rituais</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {character.abilities.map(ab => (
                  <div key={ab.id} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm text-white">{ab.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-purple-300 bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded">
                            {ab.originType}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAbility(ab.id)}
                            className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                            title="Remover habilidade"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed mb-2">
                        {ab.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[10px] text-gray-400">
                      <span>Custo: {ab.cost?.energyPoints ? `${ab.cost.energyPoints} PE` : 'Sem custo'}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (ab.cost?.energyPoints && character.energy) {
                            if (character.energy.current < ab.cost.energyPoints) {
                              onShowToast(`Pontos de energia insuficientes para [${ab.name}]!`);
                              return;
                            }
                            handleAdjustEnergy(-ab.cost.energyPoints);
                          }
                          onRollDice('1d20', `${character.name} ativou [${ab.name}]`);
                          onShowToast(`Habilidade [${ab.name}] ativada na mesa!`);
                        }}
                        className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                      >
                        Ativar na Mesa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.07]">
                <div>
                  <span className="text-xs font-semibold text-gray-200">Rastreador de Carga</span>
                  <div className="text-[11px] text-gray-400">
                    Capacidade Máxima: Força × 5 kg ({maxWeight} kg)
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold font-mono ${isOverburdened ? 'text-red-400' : 'text-gray-200'}`}>
                    {currentWeight} / {maxWeight} kg
                  </span>
                </div>
              </div>

              {isOverburdened && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Sobrecarga ativa: -2m no Deslocamento e desvantagem em testes de Força e Agilidade.</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {character.items.map(it => (
                  <div key={it.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleEquipItem(it.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                          it.equipped ? 'bg-purple-600 border-purple-400 text-white' : 'border-white/20 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <div>
                        <span className="font-semibold text-gray-200">{it.name}</span>
                        <span className="text-gray-500 ml-1.5 font-mono">x{it.quantity}</span>
                        <div className="text-[10px] text-gray-400">{it.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-400">{it.weight * it.quantity} kg</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(it.id)}
                        className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                        title="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    placeholder="Buscar perícia..."
                    className="w-full pl-8 pr-3 py-1 rounded-xl bg-[#1b1924] border border-white/[0.08] text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono">
                  {['todos', 'AGI', 'FOR', 'INT', 'PRE', 'VIG'].map(attr => (
                    <button
                      key={attr}
                      type="button"
                      onClick={() => setSkillAttrFilter(attr)}
                      className={`px-2 py-0.5 rounded-lg uppercase cursor-pointer ${
                        skillAttrFilter.toLowerCase() === attr.toLowerCase() ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {attr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredSkills.map(sk => {
                  const bonus = sk.total || 0;
                  const attrVal = character.attributes[sk.attributeKey] ?? 1;
                  const formula = attrVal <= 0 ? `2d20kl1+${bonus}` : `${attrVal}d20k1+${bonus}`;
                  return (
                    <div
                      key={sk.key}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs hover:border-purple-500/40 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-gray-200">{sk.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {sk.attributeKey} · <span className="text-purple-300 capitalize">{sk.training}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRollDice(formula, `${character.name} — Teste de ${sk.name}`)}
                        className="px-2 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title={`Rolar ${formula}`}
                      >
                        <Dices className="w-3 h-3" />
                        <span>+{bonus}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Atributos Primários (Apresentação Canônica Rajdhani)</span>
                <button
                  type="button"
                  onClick={() => setIsEditingAttributes(!isEditingAttributes)}
                  className="px-3 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3 h-3" />
                  <span>{isEditingAttributes ? 'Concluir' : 'Editar'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { key: 'AGI', label: 'Agilidade', value: character.attributes['AGI'] ?? 1 },
                  { key: 'FOR', label: 'Força', value: character.attributes['FOR'] ?? 1 },
                  { key: 'INT', label: 'Intelecto', value: character.attributes['INT'] ?? 1 },
                  { key: 'PRE', label: 'Presença', value: character.attributes['PRE'] ?? 1 },
                  { key: 'VIG', label: 'Vigor', value: character.attributes['VIG'] ?? 1 },
                ].map(stat => (
                  <div
                    key={stat.key}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-purple-500/50 flex flex-col items-center justify-center transition-all"
                  >
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {stat.label}
                    </span>
                    
                    {isEditingAttributes ? (
                      <div className="flex items-center justify-between bg-black/60 rounded-full px-2 py-0.5 border border-white/10 my-2 w-full">
                        <button
                          type="button"
                          onClick={() => handleModifyAttribute(stat.key, -1)}
                          className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-rajdhani text-2xl font-bold text-white px-1">
                          {stat.value}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleModifyAttribute(stat.key, 1)}
                          className="w-5 h-5 rounded-full bg-purple-600/40 hover:bg-purple-600/70 flex items-center justify-center text-white cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const formula = stat.value <= 0 ? '2d20kl1' : `${stat.value}d20k1`;
                          onRollDice(formula, `${character.name} — Teste de ${stat.label} (${stat.key})`);
                        }}
                        className="my-1 group cursor-pointer text-center"
                      >
                        <span className="font-rajdhani text-4xl font-bold text-white block group-hover:scale-110 transition-transform">
                          {stat.value}
                        </span>
                        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded mt-1 inline-block">
                          {stat.value <= 0 ? '2d20kl1' : `${stat.value}d20k1`}
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
                  <p className="text-gray-400">Auditoria dos estágios alcançados, incrementos e poderes.</p>
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
                  Nenhum registro de evolução gravado ainda. Utilize o botão Evoluir para registrar o avanço!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {character.progressionHistory.map(entry => (
                    <div key={entry.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1.5">
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
                          <span className="text-purple-400 font-mono font-semibold">+{entry.energyGain} PE</span>
                        )}
                        {entry.sanityGain > 0 && (
                          <span className="text-cyan-400 font-mono font-semibold">+{entry.sanityGain} SAN</span>
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
            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
              <div>
                <h4 className="font-semibold text-white mb-1 font-cinzel">Biografia</h4>
                <p className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  {character.biography || 'Nenhuma história registrada ainda para este personagem.'}
                </p>
              </div>
            </div>
          )}
        </div>

        <CharacterEvolutionModal
          isOpen={showEvolutionModal}
          character={character}
          onClose={() => setShowEvolutionModal(false)}
          onConfirmEvolution={(updated) => {
            onUpdateCharacter(updated);
            onShowToast(`Evolução concluída para ${isOrdem ? `${updated.levelOrNex}% NEX` : `Nível ${updated.levelOrNex}`}!`);
          }}
        />

      </div>
    </div>
  );
};
