import { RPGSystemId } from './rpg-systems';
import { CharacterItem } from './items';
import { CharacterAbility } from './abilities';

export type CharacterOwnerType = 'player' | 'master';

export type SkillTrainingLevel = 
  | 'destreinado' // +0
  | 'treinado'    // +5 (Ordem) ou +Prof (D&D) ou +2+metade nivel (T20)
  | 'veterano'    // +10 (Ordem) ou +Dobro (D&D Expertise)
  | 'expert';     // +15 (Ordem)

export interface CharacterSkill {
  name: string;
  key: string;
  attributeKey: string;
  training: SkillTrainingLevel;
  customBonus?: number;
  total?: number;
}

export interface CharacterStatusPool {
  current: number;
  max: number;
  temp?: number;
}

export interface CharacterTokenConfig {
  imageUrl: string;
  borderStyleId?: string;
  isAnimated?: boolean;
  scale: number; // 0.5 to 2.0, default 1.0 (Médio)
}

export interface Character {
  id: string;
  name: string;
  systemId: RPGSystemId;
  ownerType: CharacterOwnerType;
  assignedUser?: string;
  campaignId?: string | null; // null = "Sem campanha"
  folder?: string;
  
  // Progression
  characterClass: string;
  subclass?: string;
  levelOrNex: number; // e.g. 15 for 15% NEX, or 3 for Level 3
  isMultiClass?: boolean;
  multiclassDetails?: { className: string; level: number }[];
  
  // Origin & Race
  originOrBackground?: string;
  raceOrAncestry?: string;

  // Attributes (e.g. AGI, FOR, INT, PRE, VIG or FOR, DES, CON...)
  attributes: Record<string, number>;
  
  // Status Derivados
  autoCalculateStatus: boolean;
  hp: CharacterStatusPool;
  energy?: CharacterStatusPool; // PE or PM
  sanity?: CharacterStatusPool; // Ordem Paranormal / Slasher
  determination?: number; // Ordem Paranormal
  defense: number;
  initiative: number;
  speed: string; // e.g. "9m"
  savingThrowProficiencies?: string[]; // D&D 5e

  // Skills
  skills: CharacterSkill[];

  // Token & Visual Identity
  token: CharacterTokenConfig;
  biography: string;

  // Inventory & Powers
  items: CharacterItem[];
  abilities: CharacterAbility[];
  
  // Economy
  coins: number;
  currencyUnit: string;

  createdAt: string;
  updatedAt: string;
}
