import test from 'node:test';
import assert from 'node:assert/strict';
import { DiceRollerService } from '../test-dist/services/dice-roller.service.js';
import { CharacterRulesService } from '../test-dist/services/character-rules.service.js';

test('DiceRollerService - rollDie bounds check', () => {
  for (let i = 0; i < 50; i++) {
    const d20 = DiceRollerService.rollDie(20);
    assert.ok(d20 >= 1 && d20 <= 20);
    const d6 = DiceRollerService.rollDie(6);
    assert.ok(d6 >= 1 && d6 <= 6);
  }
});

test('DiceRollerService - standard single die formula', () => {
  const result = DiceRollerService.rollFormula('1d20', { rollerName: 'Arthur' });
  assert.equal(result.rollerName, 'Arthur');
  assert.equal(result.diceResults.length, 1);
  assert.equal(result.diceResults[0].die, 20);
  assert.equal(result.diceResults[0].dropped, false);
  assert.equal(result.total, result.diceResults[0].result);
  assert.equal(result.modifierTotal, 0);
});

test('DiceRollerService - keep highest (Nd20k1 + bonus)', () => {
  const result = DiceRollerService.rollFormula('3d20k1 + 5', { rollerName: 'Arthur' });
  assert.equal(result.diceResults.length, 3);
  const kept = result.diceResults.filter(d => !d.dropped);
  const dropped = result.diceResults.filter(d => d.dropped);
  assert.equal(kept.length, 1);
  assert.equal(dropped.length, 2);
  for (const d of dropped) {
    assert.ok(kept[0].result >= d.result);
  }
  assert.equal(result.subtotal, kept[0].result);
  assert.equal(result.modifierTotal, 5);
  assert.equal(result.total, kept[0].result + 5);
});

test('DiceRollerService - keep lowest (Nd20kl1 + bonus)', () => {
  const result = DiceRollerService.rollFormula('2d20kl1 + 2');
  assert.equal(result.diceResults.length, 2);
  const kept = result.diceResults.filter(d => !d.dropped);
  const dropped = result.diceResults.filter(d => d.dropped);
  assert.equal(kept.length, 1);
  assert.equal(dropped.length, 1);
  assert.ok(kept[0].result <= dropped[0].result);
  assert.equal(result.total, kept[0].result + 2);
});

test('DiceRollerService - multi-dice expressions and negative modifiers', () => {
  const result = DiceRollerService.rollFormula('2d6 + 1d4 - 3');
  assert.equal(result.diceResults.length, 3);
  const sumDice = result.diceResults.reduce((acc, d) => acc + d.result, 0);
  assert.equal(result.subtotal, sumDice);
  assert.equal(result.total, sumDice - 3);
  assert.equal(result.modifierTotal, -3);
});

test('DiceRollerService - variable substitutions (@FOR, @Luta)', () => {
  const result = DiceRollerService.rollFormula('1d20 + @FOR + @Luta', {
    variables: { FOR: 3, Luta: 5 }
  });
  const die = result.diceResults[0].result;
  assert.equal(result.total, die + 8);
  assert.equal(result.modifierTotal, 8);
});

test('DiceRollerService - critical and fumble edge cases', () => {
  const originalRollDie = DiceRollerService.rollDie;
  try {
    DiceRollerService.rollDie = () => 20;
    const critResult = DiceRollerService.rollFormula('1d20 + 5', { criticalMargin: 20 });
    assert.equal(critResult.isCritical, true);
    assert.equal(critResult.isFumble, false);

    DiceRollerService.rollDie = () => 1;
    const fumbleResult = DiceRollerService.rollFormula('1d20 + 5');
    assert.equal(fumbleResult.isCritical, false);
    assert.equal(fumbleResult.isFumble, true);

    DiceRollerService.rollDie = () => 19;
    const margin19Result = DiceRollerService.rollFormula('1d20', { criticalMargin: 19 });
    assert.equal(margin19Result.isCritical, true);
  } finally {
    DiceRollerService.rollDie = originalRollDie;
  }
});

test('CharacterRulesService - Ordem Paranormal formulas', () => {
  const combatenteStats = CharacterRulesService.calculateOrdemStatus('Combatente', 20, 3, 2);
  assert.equal(combatenteStats.maxHp, 44);
  assert.equal(combatenteStats.maxPe, 16);
  assert.equal(combatenteStats.maxSan, 21);

  const especialistaStats = CharacterRulesService.calculateOrdemStatus('Especialista', 5, 1, 2);
  assert.equal(especialistaStats.maxHp, 17);
  assert.equal(especialistaStats.maxPe, 5);
  assert.equal(especialistaStats.maxSan, 16);

  const ocultistaStats = CharacterRulesService.calculateOrdemStatus('Ocultista', 10, 1, 3);
  assert.equal(ocultistaStats.maxHp, 16);
  assert.equal(ocultistaStats.maxPe, 14);
  assert.equal(ocultistaStats.maxSan, 25);
});

test('CharacterRulesService - recalculateSkills training bonuses', () => {
  const initialSkills = [
    { id: 's1', name: 'Luta', key: 'luta', attributeKey: 'FOR', training: 'treinado', customBonus: 0, total: 0 },
    { id: 's2', name: 'Pontaria', key: 'pontaria', attributeKey: 'AGI', training: 'veterano', customBonus: 2, total: 0 },
    { id: 's3', name: 'Ocultismo', key: 'ocultismo', attributeKey: 'INT', training: 'expert', customBonus: 0, total: 0 },
    { id: 's4', name: 'Acrobacia', key: 'acrobacia', attributeKey: 'AGI', training: 'destreinado', customBonus: 0, total: 0 },
  ];
  const attributes = { FOR: 3, AGI: 2, INT: 4 };

  const updated = CharacterRulesService.recalculateSkills(initialSkills, attributes, 'ordem-paranormal', 20);
  assert.equal(updated.find(s => s.key === 'luta').total, 5);
  assert.equal(updated.find(s => s.key === 'pontaria').total, 12);
  assert.equal(updated.find(s => s.key === 'ocultismo').total, 15);
  assert.equal(updated.find(s => s.key === 'acrobacia').total, 0);
});

test('CharacterRulesService - evolveCharacter progression & audit trail', () => {
  const baseCharacter = {
    id: 'char-test-1',
    name: 'Arthur Veríssimo',
    systemId: 'ordem-paranormal',
    characterClass: 'Combatente',
    subclass: 'Guerreiro',
    levelOrNex: 20,
    attributes: { AGI: 3, FOR: 3, INT: 1, PRE: 2, VIG: 2 },
    defense: 13,
    movementMeters: 9,
    hp: { current: 40, max: 40 },
    energy: { current: 14, max: 14 },
    sanity: { current: 20, max: 20 },
    conditions: [],
    skills: [
      { id: 's1', name: 'Luta', key: 'luta', attributeKey: 'FOR', training: 'treinado', bonus: 0, total: 5 },
      { id: 's2', name: 'Pontaria', key: 'pontaria', attributeKey: 'AGI', training: 'treinado', bonus: 0, total: 5 },
    ],
    inventory: [],
    abilities: [],
    progressionHistory: [],
    createdAt: '2026-11-18T12:00:00Z',
    updatedAt: '2026-11-18T12:00:00Z',
  };

  const evolved = CharacterRulesService.evolveCharacter(baseCharacter, 25, {
    attributeUpgrade: 'FOR',
    newSkillTraining: { skillKey: 'luta', training: 'veterano' },
  });

  assert.equal(evolved.levelOrNex, 25);
  assert.equal(evolved.attributes['FOR'], 4);
  assert.ok(evolved.hp.max > baseCharacter.hp.max);
  assert.ok(evolved.energy.max > baseCharacter.energy.max);
  assert.ok(evolved.sanity.max > baseCharacter.sanity.max);
  assert.equal(evolved.hp.current, evolved.hp.max);

  const lutaSkill = evolved.skills.find(s => s.key === 'luta');
  assert.equal(lutaSkill.training, 'veterano');
  assert.equal(lutaSkill.total, 10);

  assert.equal(evolved.progressionHistory.length, 1);
  const entry = evolved.progressionHistory[0];
  assert.equal(entry.levelOrNex, 25);
  assert.equal(entry.attributeUpgrade, 'FOR');
  assert.ok(entry.hpGain > 0);
  assert.ok(entry.energyGain > 0);
  assert.ok(entry.sanityGain > 0);
  assert.ok(entry.description.includes('25%'));
});

test('CharacterRulesService - milestone ability unlocks at 10% NEX', () => {
  const baseNovice = {
    id: 'char-novice',
    name: 'Novato',
    systemId: 'ordem-paranormal',
    characterClass: 'Combatente',
    subclass: 'Guerreiro',
    levelOrNex: 5,
    attributes: { AGI: 2, FOR: 2, INT: 1, PRE: 1, VIG: 2 },
    defense: 12,
    movementMeters: 9,
    hp: { current: 22, max: 22 },
    energy: { current: 3, max: 3 },
    sanity: { current: 12, max: 12 },
    skills: [],
    inventory: [],
    abilities: [],
    progressionHistory: [],
    createdAt: '2026-11-18T12:00:00Z',
    updatedAt: '2026-11-18T12:00:00Z',
  };

  const evolved10 = CharacterRulesService.evolveCharacter(baseNovice, 10, {});
  assert.equal(evolved10.levelOrNex, 10);
  const trackAbility = evolved10.abilities.find(a => a.name.includes('Trilha: Guerreiro'));
  assert.ok(trackAbility, 'Track ability should be automatically unlocked at 10% NEX');
  assert.ok(evolved10.progressionHistory[0].newAbilities.includes('Trilha: Guerreiro'));
});

test('Interactive Vitals & Conditions - damage, healing, resource consumption', () => {
  let hp = { current: 40, max: 40 };
  let conditions = [];

  const applyDamage = (amount) => {
    const nextCurrent = Math.max(0, hp.current - amount);
    hp = { ...hp, current: nextCurrent };
    const nextConds = new Set(conditions);
    if (nextCurrent <= hp.max / 2 && nextCurrent > 0) {
      nextConds.add('Machucado');
    }
    if (nextCurrent === 0) {
      nextConds.add('Morrendo');
      nextConds.add('Inconsciente');
    }
    conditions = Array.from(nextConds);
  };

  const applyHealing = (amount) => {
    const nextCurrent = Math.min(hp.max, hp.current + amount);
    hp = { ...hp, current: nextCurrent };
    const nextConds = new Set(conditions);
    if (nextCurrent > 0) {
      nextConds.delete('Morrendo');
    }
    if (nextCurrent > hp.max / 2) {
      nextConds.delete('Machucado');
    }
    conditions = Array.from(nextConds);
  };

  applyDamage(25);
  assert.equal(hp.current, 15);
  assert.ok(conditions.includes('Machucado'));
  assert.ok(!conditions.includes('Morrendo'));

  applyDamage(20);
  assert.equal(hp.current, 0);
  assert.ok(conditions.includes('Morrendo'));
  assert.ok(conditions.includes('Inconsciente'));

  applyHealing(10);
  assert.equal(hp.current, 10);
  assert.ok(!conditions.includes('Morrendo'));
  assert.ok(conditions.includes('Machucado'));

  applyHealing(35);
  assert.equal(hp.current, 40);
  assert.ok(!conditions.includes('Machucado'));
});

test('Persistence & Serialization - LocalStorage JSON roundtrip integrity', () => {
  const character = {
    id: 'char-storage-test',
    name: 'Arthur Veríssimo',
    systemId: 'ordem-paranormal',
    characterClass: 'Combatente',
    levelOrNex: 25,
    attributes: { AGI: 3, FOR: 4, INT: 1, PRE: 2, VIG: 2 },
    defense: 13,
    movementMeters: 9,
    hp: { current: 35, max: 47 },
    energy: { current: 12, max: 18 },
    sanity: { current: 18, max: 24 },
    conditions: ['Machucado'],
    skills: [
      { id: 's1', name: 'Luta', key: 'luta', attributeKey: 'FOR', training: 'veterano', customBonus: 0, total: 10 }
    ],
    inventory: [
      { id: 'it-1', name: 'Katana Cerimonial', category: 'Arma Tática', slots: 2, prestigeCategory: 'II', isEquipped: true }
    ],
    abilities: [
      {
        id: 'ab-1',
        name: 'Trilha: Guerreiro',
        description: 'Técnica de combate letal',
        originType: 'Habilidade de Classe',
        isReaction: false,
        showDescriptionInChat: true,
        cost: { energyPoints: 2, actionType: 'Padrão' },
        passiveBonuses: [],
        actions: []
      }
    ],
    progressionHistory: [
      {
        id: 'prog-1',
        levelOrNex: 25,
        date: '18/11/2026 16:00',
        description: 'Avanço de NEX para 25%',
        hpGain: 7,
        energyGain: 4,
        sanityGain: 3,
        attributeUpgrade: 'FOR'
      }
    ],
    createdAt: '2026-11-18T12:00:00Z',
    updatedAt: '2026-11-18T16:00:00Z'
  };

  const serialized = JSON.stringify(character);
  const deserialized = JSON.parse(serialized);

  assert.deepEqual(deserialized, character);
  assert.equal(deserialized.progressionHistory.length, 1);
  assert.equal(deserialized.progressionHistory[0].attributeUpgrade, 'FOR');
  assert.equal(deserialized.conditions[0], 'Machucado');
  assert.equal(deserialized.inventory[0].isEquipped, true);
});

test('CharacterRulesService - calculateTotalDefense with equipment', () => {
  const mockChar = {
    systemId: 'ordem-paranormal',
    attributes: { AGI: 3, FOR: 1, INT: 3, PRE: 2, VIG: 2 },
    items: [
      { id: 'it-1', name: 'Vestimenta Reforçada', equipped: true, passiveBonuses: [{ statKey: 'defense', value: 2 }] },
      { id: 'it-2', name: 'Escudo Tático', equipped: false, passiveBonuses: [{ statKey: 'defense', value: 2 }] }
    ]
  };
  const def = CharacterRulesService.calculateTotalDefense(mockChar);
  assert.equal(def, 15);

  mockChar.items[1].equipped = true;
  const defWithShield = CharacterRulesService.calculateTotalDefense(mockChar);
  assert.equal(defWithShield, 17);
});

test('End-to-End Playable Loop (12 Steps Verification)', () => {
  let character = {
    id: 'char-arthur',
    name: 'Arthur Veríssimo',
    systemId: 'ordem-paranormal',
    ownerType: 'player',
    assignedUser: 'ThiSBernardo',
    characterClass: 'Especialista',
    subclass: 'Atirador de Elite',
    levelOrNex: 20,
    originOrBackground: 'Investigador',
    attributes: { AGI: 3, FOR: 1, INT: 3, PRE: 2, VIG: 2 },
    autoCalculateStatus: true,
    hp: { current: 36, max: 36 },
    energy: { current: 15, max: 15 },
    sanity: { current: 32, max: 32 },
    defense: 15,
    initiative: 8,
    speed: '9m',
    skills: [
      { name: 'Pontaria', key: 'pontaria', attributeKey: 'AGI', training: 'veterano', customBonus: 0, total: 10 },
      { name: 'Investigação', key: 'investigacao', attributeKey: 'INT', training: 'veterano', customBonus: 2, total: 12 }
    ],
    items: [
      {
        id: 'item-1',
        name: 'Rifle de Precisão .308',
        category: 'Arma',
        equipped: true,
        quantity: 1,
        weight: 2,
        passiveBonuses: [],
        actions: [{ id: 'act-1', name: 'Disparo Mirado', type: 'attack', formula: '2d10 + @AGI' }]
      },
      {
        id: 'item-2',
        name: 'Vestimenta Reforçada',
        category: 'Armadura',
        equipped: true,
        quantity: 1,
        weight: 1,
        passiveBonuses: [{ statKey: 'defense', value: 2 }],
        actions: []
      }
    ],
    abilities: [
      {
        id: 'ab-1',
        name: 'Mira de Elite',
        originType: 'Habilidade de Classe',
        description: 'Ignora penalidades e gasta 2 PE.',
        cost: { energyPoints: 2, actionType: 'Movimento' },
        actions: [],
        passiveBonuses: []
      }
    ],
    progressionHistory: [],
    coins: 450,
    currencyUnit: 'Créditos',
    createdAt: '2026-11-18T12:00:00.000Z',
    updatedAt: '2026-11-18T12:00:00.000Z'
  };

  assert.equal(character.id, 'char-arthur');
  assert.equal(character.name, 'Arthur Veríssimo');

  const updatedAttrs = { ...character.attributes, AGI: 4 };
  const updatedSkills = CharacterRulesService.recalculateSkills(
    character.skills,
    updatedAttrs,
    character.systemId,
    character.levelOrNex
  );
  const updatedDefense = CharacterRulesService.calculateTotalDefense({
    ...character,
    attributes: updatedAttrs
  });
  character = {
    ...character,
    attributes: updatedAttrs,
    skills: updatedSkills,
    defense: updatedDefense
  };
  assert.equal(character.attributes.AGI, 4);
  assert.equal(character.defense, 16);

  const pontaria = character.skills.find(s => s.key === 'pontaria');
  assert.ok(pontaria);
  assert.equal(pontaria.total, 10);
  const dicePool = character.attributes[pontaria.attributeKey];
  assert.equal(dicePool, 4);
  const skillFormula = `${dicePool}d20k1+${pontaria.total}`;
  assert.equal(skillFormula, '4d20k1+10');

  const skillRoll = DiceRollerService.rollFormula(skillFormula, {
    rollerName: character.name,
    sourceTitle: 'Teste de Pontaria'
  });
  assert.ok(skillRoll.total >= 11 && skillRoll.total <= 30);
  assert.equal(skillRoll.diceResults.length, 4);
  const keptDie = skillRoll.diceResults.filter(d => !d.dropped);
  assert.equal(keptDie.length, 1);
  assert.equal(skillRoll.total, keptDie[0].result + 10);

  const damageAmount = 10;
  character = {
    ...character,
    hp: { ...character.hp, current: Math.max(0, character.hp.current - damageAmount) }
  };
  assert.equal(character.hp.current, 26);

  const healAmount = 10;
  character = {
    ...character,
    hp: { ...character.hp, current: Math.min(character.hp.max, character.hp.current + healAmount) }
  };
  assert.equal(character.hp.current, 36);

  const ability = character.abilities.find(a => a.name === 'Mira de Elite');
  assert.ok(ability);
  const peCost = ability.cost?.energyPoints || 0;
  assert.equal(peCost, 2);
  assert.ok(character.energy.current >= peCost);
  character = {
    ...character,
    energy: { ...character.energy, current: character.energy.current - peCost }
  };
  assert.equal(character.energy.current, 13);

  const newItem = {
    id: 'item-shop-shield',
    name: 'Escudo Balístico Pesado',
    category: 'Acessório',
    equipped: true,
    quantity: 1,
    weight: 3,
    passiveBonuses: [{ statKey: 'defense', value: 2 }],
    actions: []
  };
  const newItemsList = [...character.items, newItem];
  const newDefense = CharacterRulesService.calculateTotalDefense({
    ...character,
    items: newItemsList
  });
  character = {
    ...character,
    items: newItemsList,
    defense: newDefense
  };
  assert.equal(character.items.length, 3);
  assert.equal(character.defense, 18);
  const currentWeight = character.items.reduce((acc, it) => acc + (it.weight * it.quantity), 0);
  assert.equal(currentWeight, 6);

  const evolvedChar = CharacterRulesService.evolveCharacter(character, 25, {
    attributeUpgrade: 'VIG',
    newSkillTraining: { skillKey: 'pontaria', training: 'expert' }
  });
  character = evolvedChar;

  assert.equal(character.levelOrNex, 25);
  assert.equal(character.attributes.VIG, 3);
  const evolvedPontaria = character.skills.find(s => s.key === 'pontaria');
  assert.equal(evolvedPontaria.training, 'expert');
  assert.equal(evolvedPontaria.total, 15);
  assert.equal(character.hp.max, 43);
  assert.equal(character.energy.max, 25);
  assert.equal(character.sanity.max, 32);
  assert.equal(character.progressionHistory.length, 1);
  assert.equal(character.progressionHistory[0].levelOrNex, 25);
  assert.equal(character.progressionHistory[0].attributeUpgrade, 'VIG');

  const simulatedLocalStorage = JSON.stringify(character);

  const reloadedChar = JSON.parse(simulatedLocalStorage);
  assert.equal(reloadedChar.id, character.id);
  assert.equal(reloadedChar.name, 'Arthur Veríssimo');
  assert.equal(reloadedChar.levelOrNex, 25);
  assert.equal(reloadedChar.attributes.AGI, 4);
  assert.equal(reloadedChar.attributes.VIG, 3);
  assert.equal(reloadedChar.hp.max, 43);
  assert.equal(reloadedChar.hp.current, 43);
  assert.equal(reloadedChar.energy.max, 25);
  assert.equal(reloadedChar.energy.current, 23);
  assert.equal(reloadedChar.defense, 18);
  assert.equal(reloadedChar.items.length, 3);
  assert.equal(reloadedChar.progressionHistory.length, 1);
  assert.equal(reloadedChar.progressionHistory[0].levelOrNex, 25);
  assert.equal(reloadedChar.progressionHistory[0].attributeUpgrade, 'VIG');
});
