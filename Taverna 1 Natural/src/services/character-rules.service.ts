import { RPGSystemId } from '../types/rpg-systems';
import { CharacterSkill, SkillTrainingLevel } from '../types/character';

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

// D&D 5e Canonic Skills
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

export class CharacterRulesService {
  /**
   * Calculates D&D 5e ability modifier from score (e.g. 10 -> 0, 14 -> +2, 8 -> -1)
   */
  static getDndModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  /**
   * Calculates proficiency bonus for D&D 5e based on character level
   */
  static getDndProficiencyBonus(level: number): number {
    return Math.ceil(level / 4) + 1;
  }

  /**
   * Calculates Ordem Paranormal derived status
   */
  static calculateOrdemStatus(className: string, nex: number, vig: number, pre: number) {
    const steps = Math.max(1, Math.floor(nex / 5)); // 5% = 1 step, 10% = 2 steps...
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

    const maxHp = baseHp + (additionalSteps * hpPerStep);
    const maxPe = basePe + (additionalSteps * pePerStep);
    const maxSan = baseSan + (additionalSteps * sanPerStep);
    const defense = 10; // plus Agility

    return { maxHp, maxPe, maxSan, defense };
  }

  /**
   * Calculates total bonus for a skill in Ordem Paranormal
   */
  static calculateOrdemSkillTotal(training: SkillTrainingLevel, customBonus = 0): number {
    let trainingBonus = 0;
    if (training === 'treinado') trainingBonus = 5;
    if (training === 'veterano') trainingBonus = 10;
    if (training === 'expert') trainingBonus = 15;
    return trainingBonus + customBonus;
  }

  /**
   * Calculates total bonus for a skill in D&D 5e
   */
  static calculateDndSkillTotal(attrValue: number, training: SkillTrainingLevel, profBonus: number, customBonus = 0): number {
    const mod = this.getDndModifier(attrValue);
    let trainingBonus = 0;
    if (training === 'treinado') trainingBonus = profBonus;
    if (training === 'veterano') trainingBonus = profBonus * 2; // Expertise
    return mod + trainingBonus + customBonus;
  }

  /**
   * Get initial blank skill list for a chosen system
   */
  static getInitialSkills(systemId: RPGSystemId): CharacterSkill[] {
    if (systemId === 'ordem-paranormal' || systemId === 'ordem-paranormal-2') {
      return ORDEM_SKILLS.map(s => ({
        name: s.name,
        key: s.key,
        attributeKey: s.attributeKey,
        training: 'destreinado',
        customBonus: 0,
        total: 0
      }));
    }

    if (systemId === 'dnd-5e-2014') {
      return DND_SKILLS.map(s => ({
        name: s.name,
        key: s.key,
        attributeKey: s.attributeKey,
        training: 'destreinado',
        customBonus: 0,
        total: 0
      }));
    }

    // Default universal skills
    return [
      { name: 'Acrobacia', key: 'acrobacia', attributeKey: 'AGI', training: 'destreinado', total: 0 },
      { name: 'Atletismo', key: 'atletismo', attributeKey: 'FOR', training: 'destreinado', total: 0 },
      { name: 'Furtividade', key: 'furtividade', attributeKey: 'AGI', training: 'destreinado', total: 0 },
      { name: 'Investigação', key: 'investigacao', attributeKey: 'INT', training: 'destreinado', total: 0 },
      { name: 'Luta', key: 'luta', attributeKey: 'FOR', training: 'destreinado', total: 0 },
      { name: 'Percepção', key: 'percepcao', attributeKey: 'INT', training: 'destreinado', total: 0 },
      { name: 'Pontaria', key: 'pontaria', attributeKey: 'AGI', training: 'destreinado', total: 0 },
      { name: 'Vontade', key: 'vontade', attributeKey: 'INT', training: 'destreinado', total: 0 }
    ];
  }
}
