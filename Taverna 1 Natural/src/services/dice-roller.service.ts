import { DiceRollMode, DiceRollResult, SingleDieResult } from '../types/dice';

export class DiceRollerService {
  /**
   * Rolls a physical or virtual die with N sides
   */
  static rollDie(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
  }

  /**
   * Evaluates a dice formula such as "1d20+5", "3d6+@FOR", "2d20 (maior)"
   */
  static rollFormula(
    rawFormula: string,
    options: {
      rollerName?: string;
      sourceTitle?: string;
      mode?: DiceRollMode;
      variables?: Record<string, number>;
      criticalMargin?: number;
      damageFormula?: string;
    } = {}
  ): DiceRollResult {
    const rollerName = options.rollerName || 'Jogador';
    const sourceTitle = options.sourceTitle || 'Rolagem de Dados';
    const mode = options.mode || 'normal';
    const variables = options.variables || {};
    const criticalMargin = options.criticalMargin || 20;

    // Replace dynamic variables like @FOR, @AGI, @Pontaria with their numeric values
    let formula = rawFormula.trim();
    for (const [key, val] of Object.entries(variables)) {
      const regex = new RegExp(`@${key}\\b`, 'gi');
      formula = formula.replace(regex, String(val));
    }

    // Default parser for expressions: e.g. "3d20 + 5", "1d8 + 3"
    // Match: ([0-9]*)d([0-9]+)
    const diceMatch = formula.match(/([0-9]*)d([0-9]+)/i);
    const diceResults: SingleDieResult[] = [];
    let count = 1;
    let sides = 20;

    if (diceMatch) {
      count = diceMatch[1] ? parseInt(diceMatch[1], 10) : 1;
      sides = parseInt(diceMatch[2], 10);
    }

    // Roll all dice
    for (let i = 0; i < count; i++) {
      const val = this.rollDie(sides);
      diceResults.push({ die: sides, result: val });
    }

    // Calculate modifier from the rest of the formula
    // Strip the NdS part and evaluate remaining math, e.g. "+ 5 - 2"
    const modString = formula.replace(/([0-9]*)d([0-9]+)/i, '').replace(/\s+/g, '');
    let modifierTotal = 0;
    if (modString) {
      try {
        // Safe evaluation of pure arithmetic (only digits, +, -)
        if (/^[0-9+\-*()]+$/.test(modString)) {
          // eslint-disable-next-line no-eval
          modifierTotal = Function(`'use strict'; return (${modString})`)();
        }
      } catch (e) {
        modifierTotal = 0;
      }
    }

    let subtotal = 0;
    let isCritical = false;
    let isFumble = false;

    if (mode === 'maior' && count > 1) {
      // Find highest die and drop others
      let maxVal = -1;
      let maxIdx = -1;
      diceResults.forEach((d, idx) => {
        if (d.result > maxVal) {
          maxVal = d.result;
          maxIdx = idx;
        }
      });
      diceResults.forEach((d, idx) => {
        d.dropped = (idx !== maxIdx);
      });
      subtotal = maxVal;
      isCritical = (maxVal >= criticalMargin);
      isFumble = (maxVal === 1);
    } else if (mode === 'menor' && count > 1) {
      // Find lowest die and drop others
      let minVal = 9999;
      let minIdx = -1;
      diceResults.forEach((d, idx) => {
        if (d.result < minVal) {
          minVal = d.result;
          minIdx = idx;
        }
      });
      diceResults.forEach((d, idx) => {
        d.dropped = (idx !== minIdx);
      });
      subtotal = minVal;
      isCritical = (minVal >= criticalMargin);
      isFumble = (minVal === 1);
    } else {
      // Normal sum
      subtotal = diceResults.reduce((acc, curr) => acc + curr.result, 0);
      // For d20 rolls, check if any die hit critical margin
      if (sides === 20) {
        isCritical = diceResults.some(d => d.result >= criticalMargin);
        isFumble = diceResults.some(d => d.result === 1);
      }
    }

    const total = subtotal + modifierTotal;

    // Optional damage roll if specified
    let damageResults: DiceRollResult['damageResults'] = undefined;
    if (options.damageFormula) {
      let dmgForm = options.damageFormula;
      for (const [k, v] of Object.entries(variables)) {
        dmgForm = dmgForm.replace(new RegExp(`@${k}\\b`, 'gi'), String(v));
      }
      const dmgRoll = this.rollFormula(dmgForm, { mode: 'normal' });
      damageResults = {
        formula: options.damageFormula,
        total: dmgRoll.total,
      };
    }

    return {
      id: 'roll-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rollerName,
      sourceTitle,
      mode,
      formula: rawFormula,
      diceResults,
      subtotal,
      modifierTotal,
      total,
      isCritical,
      isFumble,
      damageResults
    };
  }
}
