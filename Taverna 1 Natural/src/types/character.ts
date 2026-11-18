import { RPGSystemId } from './rpg-systems';
import { CharacterItem } from './items';
import { CharacterAbility } from './abilities';

export type CharacterOwnerType = 'player' | 'master';

export type SkillTrainingLevel = 
  | 'destreinado'
  | 'treinado'
  | 'veterano'
  | 'expert';

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
  scale: number;
}

export interface ProgressionEntry {
  id: string;
  levelOrNex: number;
  date: string;
  description: string;
  hpGain: number;
  energyGain: number;
  sanityGain: number;
  attributeUpgrade?: string;
  newAbilities?: string[];
}

export interface Character {
  id: string;
  name: string;
  systemId: RPGSystemId;
  ownerType: CharacterOwnerType;
  assignedUser?: string;
  campaignId?: string | null;
  folder?: string;
  
  characterClass: string;
  subclass?: string;
  levelOrNex: number;
  isMultiClass?: boolean;
  multiclassDetails?: { className: string; level: number }[];
  
  originOrBackground?: string;
  raceOrAncestry?: string;

  attributes: Record<string, number>;
  
  autoCalculateStatus: boolean;
  conditions?: string[];
  progressionHistory?: ProgressionEntry[];
  hp: CharacterStatusPool;
  energy?: CharacterStatusPool;
  sanity?: CharacterStatusPool;
  determination?: number;
  defense: number;
  initiative: number;
  speed: string;
  savingThrowProficiencies?: string[];

  skills: CharacterSkill[];

  token: CharacterTokenConfig;
  biography: string;

  items: CharacterItem[];
  abilities: CharacterAbility[];
  
  coins: number;
  currencyUnit: string;

  createdAt: string;
  updatedAt: string;
}
