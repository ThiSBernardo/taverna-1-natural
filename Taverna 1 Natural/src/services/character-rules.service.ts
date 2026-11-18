import type { RPGSystemId } from '../types/rpg-systems';
import type { Character, CharacterSkill, ProgressionEntry, SkillTrainingLevel } from '../types/character';
import type { CharacterAbility } from '../types/abilities';

export const ORDEM_ORIGINS = [
  { name: 'Acadêmico', skills: ['Ciências', 'Investigação'], power: 'Saber é Poder: Recebe +2 em testes de Intelecto ao pesquisar.' },
  { name: 'Agente de Saúde', skills: ['Medicina', 'Intuição'], power: 'Técnica Medicinal: Cura adicional ao aplicar primeiros socorros.' },
  { name: 'Amnésico', skills: ['Intuição', 'Sobrevivência'], power: 'Lembranças Súbitas: Uma vez por sessão, pode rolar com vantagem.' },
  { name: 'Artista', skills: ['Artes', 'Enganação'], power: 'Magnum Opus: Inspira aliados concedendo dados extras.' },
  { name: 'Atleta', skills: ['Acrobacia', 'Atletismo'], power: '110%: Pode gastar 1 PE para correr o dobro do deslocamento.' },
  { name: 'Chef', skills: ['Profissão', 'Fortitude'], power: 'Comida Reconfortante: Prato que recupera PE e Sanidade temporários.' },
  { name: 'Criminoso', skills: ['Crime', 'Furtividade'], power: 'O Crime Compensa: Começa com itens ilegais e conexões no submundo.' },
  { name: 'Cultista Arrependido', skills: ['Ocultismo', 'Religião'], power: 'Traços do Outro Lado: Resistência a efeitos paranormais.' },
  { name: 'Desgarrado', skills: ['Fortitude', 'Sobrevivência'], power: 'Calejado: Recebe +1 PV por 5% de NEX.' },
  { name: 'Engenheiro', skills: ['Tecnologia', 'Profissão'], power: 'Ferramentas Customizadas: Reduz espaço de itens em inventário.' },
  { name: 'Executivo', skills: ['Diplomacia', 'Profissão'], power: 'Processo Otimizado: Recursos financeiros extras por missão.' },
  { name: 'Investigador', skills: ['Investigação', 'Percepção'], power: 'Faro para Pistas: Uma vez por cena, gasta 1 PE para receber +5 ao procurar pistas.' },
  { name: 'Lutador', skills: ['Luta', 'Fortitude'], power: 'Mão Pesada: Soma bônus adicional em ataques desarmados.' },
  { name: 'Magnata', skills: ['Diplomacia', 'Atualidades'], power: 'Crédito Ilimitado: Limite de prestígio e itens de categoria superior.' },
  { name: 'Mercenário', skills: ['Pontaria', 'Iniciativa'], power: 'Posição de Combate: Bônus na primeira rodada de combate.' },
  { name: 'Militar', skills: ['Pontaria', 'Tática'], power: 'Para Bellum: Bônus de dano com armas de fogo.' },
  { name: 'Operário', skills: ['Fortitude', 'Atletismo'], power: 'Trabalho Duro: Pode usar ferramentas pesadas como armas letais.' },
  { name: 'Policial', skills: ['Pontaria', 'Percepção'], power: 'Patrulha: Bônus em Defesa contra inimigos à queima-roupa.' },
  { name: 'Religioso', skills: ['Religião', 'Vontade'], power: 'Acalentar: Recupera sanidade de aliados com orações.' },
  { name: 'Servidor Público', skills: ['Atualidades', 'Diplomacia'], power: 'Espírito Cívico: Conexões burocráticas para obter mandados.' },
  { name: 'Teórico da Conspiração', skills: ['Investigação', 'Ocultismo'], power: 'Eu Já Sabia: Resistência a surpresa e dano mental.' },
  { name: 'T.I.', skills: ['Tecnologia', 'Investigação'], power: 'Acesso Remoto: Hackear sistemas à distância gastando PE.' },
  { name: 'Trabalhador Rural', skills: ['Adestramento', 'Sobrevivência'], power: 'Vigor Campestre: Cura acelerada em descanso.' },
  { name: 'Trambiqueiro', skills: ['Crime', 'Enganação'], power: 'Impostor: Pode substituir testes de Enganação por Diplomacia e passar-se por qualquer autoridade.' },
  { name: 'Universitário', skills: ['Atualidades', 'Investigação'], power: 'Dedicação Acadêmica: Recebe +1 PE temporário ao solucionar enigmas.' },
  { name: 'Vítima', skills: ['Furtividade', 'Vontade'], power: 'Cicatrizes Psicológicas: Recebe Sanidade extra ao sobreviver a crises.' },
  { name: 'Avulso', skills: ['Percepção', 'Reflexos'], power: 'Sem Passado: Flexibilidade total para adquirir perícias gerais.' }
];

export const ORDEM_SKILLS = [
  { name: 'Acrobacia', key: 'acrobacia', attributeKey: 'AGI' },
  { name: 'Adestramento', key: 'adestramento', attributeKey: 'PRE' },
  { name: 'Artes', key: 'artes', attributeKey: 'PRE' },
  { name: 'Atletismo', key: 'atletismo', attributeKey: 'FOR' },
  { name: 'Atualidades', key: 'atualidades', attributeKey: 'INT' },
  { name: 'Ciências', key: 'ciencias', attributeKey: 'INT' },
  { name: 'Crime', key: 'crime', attributeKey: 'AGI' },
  { name: 'Diplomacia', key: 'diplomacia', attributeKey: 'PRE' },
  { name: 'Enganação', key: 'enganacao', attributeKey: 'PRE' },
  { name: 'Fortitude', key: 'fortitude', attributeKey: 'VIG' },
  { name: 'Furtividade', key: 'furtividade', attributeKey: 'AGI' },
  { name: 'Iniciativa', key: 'iniciativa', attributeKey: 'AGI' },
  { name: 'Intimidação', key: 'intimidacao', attributeKey: 'PRE' },
  { name: 'Intuição', key: 'intuicao', attributeKey: 'PRE' },
  { name: 'Investigação', key: 'investigacao', attributeKey: 'INT' },
  { name: 'Luta', key: 'luta', attributeKey: 'FOR' },
  { name: 'Medicina', key: 'medicina', attributeKey: 'INT' },
  { name: 'Ocultismo', key: 'ocultismo', attributeKey: 'INT' },
  { name: 'Percepção', key: 'percepcao', attributeKey: 'PRE' },
  { name: 'Pilotagem', key: 'pilotagem', attributeKey: 'AGI' },
  { name: 'Pontaria', key: 'pontaria', attributeKey: 'AGI' },
  { name: 'Profissão', key: 'profissao', attributeKey: 'INT' },
  { name: 'Reflexos', key: 'reflexos', attributeKey: 'AGI' },
  { name: 'Religião', key: 'religiao', attributeKey: 'PRE' },
  { name: 'Sobrevivência', key: 'sobrevivencia', attributeKey: 'INT' },
  { name: 'Tática', key: 'tatica', attributeKey: 'INT' },
  { name: 'Tecnologia', key: 'tecnologia', attributeKey: 'INT' },
  { name: 'Vontade', key: 'vontade', attributeKey: 'PRE' }
];

export const DND_SKILLS = [
  { name: 'Acrobacia', key: 'acrobatics', attributeKey: 'DES' },
  { name: 'Adestramento', key: 'animal_handling', attributeKey: 'SAB' },
  { name: 'Arcanismo', key: 'arcana', attributeKey: 'INT' },
  { name: 'Atletismo', key: 'athletics', attributeKey: 'FOR' },
  { name: 'Atuação', key: 'performance', attributeKey: 'CAR' },
  { name: 'Enganação', key: 'deception', attributeKey: 'CAR' },
  { name: 'Furtividade', key: 'stealth', attributeKey: 'DES' },
  { name: 'História', key: 'history', attributeKey: 'INT' },
  { name: 'Intimidação', key: 'intimidation', attributeKey: 'CAR' },
  { name: 'Intuição', key: 'insight', attributeKey: 'SAB' },
  { name: 'Investigação', key: 'investigation', attributeKey: 'INT' },
  { name: 'Medicina', key: 'medicine', attributeKey: 'SAB' },
  { name: 'Natureza', key: 'nature', attributeKey: 'INT' },
  { name: 'Percepção', key: 'perception', attributeKey: 'SAB' },
  { name: 'Persuasão', key: 'persuasion', attributeKey: 'CAR' },
  { name: 'Prestidigitação', key: 'sleight_of_hand', attributeKey: 'DES' },
  { name: 'Religião', key: 'religion', attributeKey: 'INT' },
  { name: 'Sobrevivência', key: 'survival', attributeKey: 'SAB' }
];

export const TORMENTA20_SKILLS = [
  { name: 'Acrobacia', key: 'acrobacia', attributeKey: 'DES' },
  { name: 'Adestramento', key: 'adestramento', attributeKey: 'CAR' },
  { name: 'Atletismo', key: 'atletismo', attributeKey: 'FOR' },
  { name: 'Atuação', key: 'atuacao', attributeKey: 'CAR' },
  { name: 'Cavalgar', key: 'cavalgar', attributeKey: 'DES' },
  { name: 'Conhecimento', key: 'conhecimento', attributeKey: 'INT' },
  { name: 'Cura', key: 'cura', attributeKey: 'SAB' },
  { name: 'Diplomacia', key: 'diplomacia', attributeKey: 'CAR' },
  { name: 'Enganação', key: 'enganacao', attributeKey: 'CAR' },
  { name: 'Fortitude', key: 'fortitude', attributeKey: 'CON' },
  { name: 'Furtividade', key: 'furtividade', attributeKey: 'DES' },
  { name: 'Guerra', key: 'guerra', attributeKey: 'INT' },
  { name: 'Iniciativa', key: 'iniciativa', attributeKey: 'DES' },
  { name: 'Intimidação', key: 'intimidacao', attributeKey: 'CAR' },
  { name: 'Intuição', key: 'intuicao', attributeKey: 'SAB' },
  { name: 'Investigação', key: 'investigacao', attributeKey: 'INT' },
  { name: 'Jogatina', key: 'jogatina', attributeKey: 'CAR' },
  { name: 'Ladinagem', key: 'ladinagem', attributeKey: 'DES' },
  { name: 'Luta', key: 'luta', attributeKey: 'FOR' },
  { name: 'Misticismo', key: 'misticismo', attributeKey: 'INT' },
  { name: 'Nobreza', key: 'nobreza', attributeKey: 'INT' },
  { name: 'Ofício', key: 'oficio', attributeKey: 'INT' },
  { name: 'Percepção', key: 'percepcao', attributeKey: 'SAB' },
  { name: 'Pilotagem', key: 'pilotagem', attributeKey: 'DES' },
  { name: 'Pontaria', key: 'pontaria', attributeKey: 'DES' },
  { name: 'Reflexos', key: 'reflexos', attributeKey: 'DES' },
  { name: 'Religião', key: 'religiao', attributeKey: 'SAB' },
  { name: 'Sobrevivência', key: 'sobrevivencia', attributeKey: 'SAB' },
  { name: 'Vontade', key: 'vontade', attributeKey: 'SAB' }
];

export class CharacterRulesService {
  static getDndModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  static getDndProficiencyBonus(level: number): number {
    return Math.ceil(level / 4) + 1;
  }

  static calculateOrdemStatus(className: string, nex: number, vig: number, pre: number) {
    const steps = Math.max(1, Math.floor(nex / 5));
    const additionalSteps = steps - 1;

    let baseHp = 20 + vig;
    let hpPerStep = 4 + vig;
    let basePe = 2 + pre;
    let pePerStep = 2 + pre;
    let baseSan = 12;
    let sanPerStep = 3;

    if (className === 'Especialista') {
      baseHp = 16 + vig;
      hpPerStep = 3 + vig;
      basePe = 3 + pre;
      pePerStep = 3 + pre;
      baseSan = 16;
      sanPerStep = 4;
    } else if (className === 'Ocultista') {
      baseHp = 12 + vig;
      hpPerStep = 2 + vig;
      basePe = 4 + pre;
      pePerStep = 4 + pre;
      baseSan = 20;
      sanPerStep = 5;
    }

    const maxHp = Math.max(1, baseHp + (additionalSteps * hpPerStep));
    const maxPe = Math.max(0, basePe + (additionalSteps * pePerStep));
    const maxSan = Math.max(0, baseSan + (additionalSteps * sanPerStep));
    const defense = 10;

    return { maxHp, maxPe, maxSan, defense };
  }

  static calculateTotalDefense(character: Character): number {
    const isOrdem = character.systemId.startsWith('ordem');
    let base = 10;
    if (isOrdem) {
      base += character.attributes['AGI'] ?? character.attributes['agi'] ?? 0;
    } else {
      const dex = character.attributes['DES'] ?? character.attributes['des'] ?? 10;
      base += this.getDndModifier(dex);
    }
    const equipmentBonus = (character.items || [])
      .filter(it => it.equipped)
      .reduce((sum, it) => {
        const itemDef = (it.passiveBonuses || [])
          .filter(b => b.statKey === 'defense')
          .reduce((bSum, b) => bSum + b.value, 0);
        return sum + itemDef;
      }, 0);
    return base + equipmentBonus;
  }

  static calculateDndStatus(className: string, level: number, conScore: number, dexScore: number) {
    const conMod = this.getDndModifier(conScore);
    const dexMod = this.getDndModifier(dexScore);
    const safeLevel = Math.max(1, level);

    let baseDie = 8;
    let avgPerLevel = 5;

    if (className === 'Bárbaro') {
      baseDie = 12;
      avgPerLevel = 7;
    } else if (className === 'Guerreiro' || className === 'Paladino' || className === 'Patrulheiro') {
      baseDie = 10;
      avgPerLevel = 6;
    } else if (className === 'Feiticeiro' || className === 'Mago') {
      baseDie = 6;
      avgPerLevel = 4;
    }

    const maxHp = Math.max(1, (baseDie + conMod) + ((safeLevel - 1) * Math.max(1, avgPerLevel + conMod)));
    const defense = 10 + dexMod;

    return { maxHp, defense };
  }

  static calculateT20Status(className: string, level: number, conScore: number, dexScore: number) {
    const conMod = this.getDndModifier(conScore);
    const dexMod = this.getDndModifier(dexScore);
    const safeLevel = Math.max(1, level);

    let baseHp = 16;
    let hpPerLevel = 4;
    let basePm = 3;
    let pmPerLevel = 3;

    if (className === 'Guerreiro' || className === 'Bárbaro' || className === 'Lutador') {
      baseHp = 20;
      hpPerLevel = 5;
      basePm = 3;
      pmPerLevel = 3;
    } else if (className === 'Arcanista') {
      baseHp = 8;
      hpPerLevel = 2;
      basePm = 6;
      pmPerLevel = 6;
    } else if (className === 'Clérigo' || className === 'Druida') {
      baseHp = 16;
      hpPerLevel = 4;
      basePm = 5;
      pmPerLevel = 5;
    }

    const maxHp = Math.max(1, (baseHp + conMod) + ((safeLevel - 1) * Math.max(1, hpPerLevel + conMod)));
    const maxPm = Math.max(1, basePm + ((safeLevel - 1) * pmPerLevel));
    const defense = 10 + dexMod;

    return { maxHp, maxPm, defense };
  }

  static calculateOrdemSkillTotal(training: SkillTrainingLevel, customBonus = 0): number {
    let trainingBonus = 0;
    if (training === 'treinado') trainingBonus = 5;
    if (training === 'veterano') trainingBonus = 10;
    if (training === 'expert') trainingBonus = 15;
    return trainingBonus + customBonus;
  }

  static calculateDndSkillTotal(attrValue: number, training: SkillTrainingLevel, profBonus: number, customBonus = 0): number {
    const mod = this.getDndModifier(attrValue);
    let trainingBonus = 0;
    if (training === 'treinado') trainingBonus = profBonus;
    if (training === 'veterano') trainingBonus = profBonus * 2;
    return mod + trainingBonus + customBonus;
  }

  static getInitialSkills(systemId: RPGSystemId): CharacterSkill[] {
    if (systemId === 'ordem-paranormal' || systemId === 'ordem-paranormal-2') {
      return ORDEM_SKILLS.map(s => ({
        name: s.name,
        key: s.key,
        attributeKey: s.attributeKey,
        training: 'destreinado',
        customBonus: 0,
        total: 0,
      }));
    }

    if (systemId === 'dnd-5e-2014') {
      return DND_SKILLS.map(s => ({
        name: s.name,
        key: s.key,
        attributeKey: s.attributeKey,
        training: 'destreinado',
        customBonus: 0,
        total: 0,
      }));
    }

    if (systemId === 'tormenta-20') {
      return TORMENTA20_SKILLS.map(s => ({
        name: s.name,
        key: s.key,
        attributeKey: s.attributeKey,
        training: 'destreinado',
        customBonus: 0,
        total: 0,
      }));
    }

    return [
      { name: 'Acrobacia', key: 'acrobacia', attributeKey: 'AGI', training: 'destreinado', total: 0 },
      { name: 'Atletismo', key: 'atletismo', attributeKey: 'FOR', training: 'destreinado', total: 0 },
      { name: 'Furtividade', key: 'furtividade', attributeKey: 'AGI', training: 'destreinado', total: 0 },
      { name: 'Investigação', key: 'investigacao', attributeKey: 'INT', training: 'destreinado', total: 0 },
      { name: 'Luta', key: 'luta', attributeKey: 'FOR', training: 'destreinado', total: 0 },
      { name: 'Percepção', key: 'percepcao', attributeKey: 'INT', training: 'destreinado', total: 0 },
      { name: 'Pontaria', key: 'pontaria', attributeKey: 'AGI', training: 'destreinado', total: 0 },
      { name: 'Vontade', key: 'vontade', attributeKey: 'INT', training: 'destreinado', total: 0 },
    ];
  }

  static recalculateSkills(skills: CharacterSkill[], attributes: Record<string, number>, systemId: RPGSystemId, levelOrNex: number): CharacterSkill[] {
    const isOrdem = systemId.startsWith('ordem');
    const profBonus = Math.ceil(levelOrNex / 4) + 1;

    return skills.map(skill => {
      const attrVal = attributes[skill.attributeKey] || attributes[skill.attributeKey.toUpperCase()] || 10;
      let total = 0;
      if (isOrdem) {
        total = this.calculateOrdemSkillTotal(skill.training, skill.customBonus || 0);
      } else {
        total = this.calculateDndSkillTotal(attrVal, skill.training, profBonus, skill.customBonus || 0);
      }
      return {
        ...skill,
        total,
      };
    });
  }

  static evolveCharacter(
    character: Character,
    targetLevelOrNex: number,
    options: {
      attributeUpgrade?: string;
      newSkillTraining?: { skillKey: string; training: SkillTrainingLevel };
      newAbility?: CharacterAbility;
      notes?: string;
    } = {}
  ): Character {
    const isOrdem = character.systemId.startsWith('ordem');
    const isDnd = character.systemId === 'dnd-5e-2014';
    const isT20 = character.systemId === 'tormenta-20';

    const updatedAttributes = { ...character.attributes };
    if (options.attributeUpgrade) {
      const current = updatedAttributes[options.attributeUpgrade] ?? (isOrdem ? 1 : 10);
      updatedAttributes[options.attributeUpgrade] = current + 1;
    }

    let nextHpMax = character.hp.max;
    let nextPeMax = character.energy ? character.energy.max : 0;
    let nextSanMax = character.sanity ? character.sanity.max : 0;
    let nextDefense = character.defense;

    if (character.autoCalculateStatus) {
      if (isOrdem) {
        const stats = this.calculateOrdemStatus(
          character.characterClass,
          targetLevelOrNex,
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
      } else if (isDnd) {
        const stats = this.calculateDndStatus(
          character.characterClass,
          targetLevelOrNex,
          updatedAttributes['CON'] || 10,
          updatedAttributes['DES'] || 10
        );
        nextHpMax = stats.maxHp;
        nextDefense = stats.defense;
      } else if (isT20) {
        const stats = this.calculateT20Status(
          character.characterClass,
          targetLevelOrNex,
          updatedAttributes['CON'] || 10,
          updatedAttributes['DES'] || 10
        );
        nextHpMax = stats.maxHp;
        nextPeMax = stats.maxPm;
        nextDefense = stats.defense;
      }
    } else {
      const steps = isOrdem ? Math.max(1, Math.floor((targetLevelOrNex - character.levelOrNex) / 5)) : targetLevelOrNex - character.levelOrNex;
      nextHpMax += steps * 4;
      if (character.energy) nextPeMax += steps * 2;
      if (character.sanity) nextSanMax += steps * 3;
    }

    const hpDelta = Math.max(0, nextHpMax - character.hp.max);
    const peDelta = character.energy ? Math.max(0, nextPeMax - character.energy.max) : 0;
    const sanDelta = character.sanity ? Math.max(0, nextSanMax - character.sanity.max) : 0;

    let updatedSkills = [...character.skills];
    if (options.newSkillTraining) {
      updatedSkills = updatedSkills.map(s => {
        if (s.key === options.newSkillTraining!.skillKey) {
          return { ...s, training: options.newSkillTraining!.training };
        }
        return s;
      });
    }
    updatedSkills = this.recalculateSkills(updatedSkills, updatedAttributes, character.systemId, targetLevelOrNex);

    const updatedAbilities = [...character.abilities];
    const newAbilityNames: string[] = [];

    if (options.newAbility) {
      updatedAbilities.push(options.newAbility);
      newAbilityNames.push(options.newAbility.name);
    }

    if (isOrdem) {
      if (character.levelOrNex < 10 && targetLevelOrNex >= 10 && character.subclass) {
        const trackAbilityName = `Trilha: ${character.subclass}`;
        if (!updatedAbilities.some(a => a.name === trackAbilityName)) {
          updatedAbilities.push({
            id: 'ab-track-' + Date.now(),
            name: trackAbilityName,
            description: `Habilidade fundamental desbloqueada ao atingir 10% de NEX na trilha ${character.subclass}.`,
            originType: 'Habilidade de Classe',
            isReaction: false,
            showDescriptionInChat: true,
            cost: { energyPoints: 1, actionType: 'Padrão' },
            actions: [],
            passiveBonuses: [],
          });
          newAbilityNames.push(trackAbilityName);
        }
      }
    }

    const entry: ProgressionEntry = {
      id: 'prog-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      levelOrNex: targetLevelOrNex,
      date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      description: isOrdem ? `Avanço de NEX para ${targetLevelOrNex}%` : `Evolução para Nível ${targetLevelOrNex}`,
      hpGain: hpDelta,
      energyGain: peDelta,
      sanityGain: sanDelta,
      attributeUpgrade: options.attributeUpgrade,
      newAbilities: newAbilityNames.length > 0 ? newAbilityNames : undefined,
    };

    const updatedHistory = [entry, ...(character.progressionHistory || [])];

    return {
      ...character,
      levelOrNex: targetLevelOrNex,
      attributes: updatedAttributes,
      defense: nextDefense,
      skills: updatedSkills,
      abilities: updatedAbilities,
      progressionHistory: updatedHistory,
      hp: {
        current: Math.min(nextHpMax, character.hp.current + hpDelta),
        max: nextHpMax,
      },
      energy: character.energy
        ? {
            current: Math.min(nextPeMax, character.energy.current + peDelta),
            max: nextPeMax,
          }
        : undefined,
      sanity: character.sanity
        ? {
            current: Math.min(nextSanMax, character.sanity.current + sanDelta),
            max: nextSanMax,
          }
        : undefined,
      updatedAt: new Date().toISOString(),
    };
  }
}
