export type ItemCategory = 
  | 'Arma' 
  | 'Munição' 
  | 'Escudo' 
  | 'Armadura' 
  | 'Acessório' 
  | 'Consumível' 
  | 'Matéria-prima' 
  | 'Moeda' 
  | 'Outro';

export interface ItemAction {
  id: string;
  name: string;
  type: 'attack' | 'damage' | 'utility' | 'heal';
  formula: string; // e.g. "1d8 + @FOR" or "2d6"
  damageType?: string; // 'Corte', 'Impacto', 'Balístico', 'Energia', 'Morte', 'Sangue', etc.
  criticalMargin?: number; // e.g. 19 or 20
  criticalMultiplier?: number; // e.g. 2 or 3
  range?: string; // e.g. "Curto (9m)", "Médio (18m)", "Corpo a corpo"
  targetStatusAffected?: 'hp' | 'mana' | 'sanity' | 'custom';
}

export interface ItemRecipe {
  materials: { name: string; quantity: number }[];
  craftTimeHours: number;
  testDifficultyDC: number;
  requiredProficiency?: string;
}

export interface CharacterItem {
  id: string;
  name: string;
  icon?: string;
  category: ItemCategory;
  subcategory?: string;
  description: string;
  equipped: boolean;
  quantity: number;
  weight: number; // in kg or spaces
  price: number; // in coins / credits
  currencyUnit?: string; // "Moedas", "R$", "Créditos", "T$"
  showInDiceRolls: boolean;
  passiveBonuses: {
    statKey: string; // e.g. "defense", "FOR", "Iniciativa"
    value: number;
  }[];
  actions: ItemAction[];
  recipe?: ItemRecipe;
}
