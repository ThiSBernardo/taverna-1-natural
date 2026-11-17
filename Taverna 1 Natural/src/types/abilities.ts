export type AbilityOriginType = 
  | 'Habilidade de Classe' 
  | 'Poder Geral' 
  | 'Ritual/Magia' 
  | 'Habilidade de Raça' 
  | 'Poder de Origem';

export type ActionEconomy = 
  | 'Padrão' 
  | 'Movimento' 
  | 'Completa' 
  | 'Livre' 
  | 'Reação';

export interface AbilityCost {
  energyPoints: number; // PE or PM
  actionType: ActionEconomy;
  sanityCost?: number;
  customCostFormula?: string; // e.g. "1d4 de Sanidade"
}

export interface CharacterAbility {
  id: string;
  name: string;
  icon?: string;
  description: string;
  circleOrLevel?: number; // Círculo 1 a 4 em Ordem/T20, Nível 1 a 9 em D&D
  originType: AbilityOriginType;
  isReaction: boolean;
  showDescriptionInChat: boolean;
  cost: AbilityCost;
  passiveBonuses: {
    statKey: string;
    value: number;
  }[];
  actions: {
    id: string;
    name: string;
    formula: string; // e.g. "3d6 + @INT"
    testType: 'acerto' | 'resistencia' | 'sem_teste';
    targetStatus: 'hp' | 'sanity' | 'mana' | 'effect';
    isHealing: boolean;
    areaOfEffect?: string; // e.g. "Cone de 6m", "Alvo único"
    rangeMeters?: number;
  }[];
  // Self effects
  selfEffects?: {
    resourceConsumed: string;
    formula: string; // e.g. "1 * alvos"
    mode: 'dano' | 'cura';
  }[];
}
