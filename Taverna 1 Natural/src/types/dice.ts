export type DiceRollMode = 'normal' | 'oculto' | 'maior' | 'menor';

export interface DiceExpression {
  count: number;
  sides: number; // 4, 6, 8, 10, 12, 20, 100
  modifier: number;
  variableNames?: string[]; // e.g. ['@FOR', '@Luta']
}

export interface SingleDieResult {
  die: number; // sides
  result: number;
  dropped?: boolean; // for advantage/disadvantage or keep highest
}

export interface DiceRollResult {
  id: string;
  timestamp: string;
  rollerName: string;
  sourceTitle: string; // e.g. "Ataque com Espada Ágil" or "Teste de Percepção"
  mode: DiceRollMode;
  formula: string;
  diceResults: SingleDieResult[];
  subtotal: number;
  modifierTotal: number;
  total: number;
  isCritical: boolean;
  isFumble: boolean;
  notes?: string;
  damageResults?: {
    formula: string;
    total: number;
    damageType?: string;
    statusTarget?: string;
  };
}
