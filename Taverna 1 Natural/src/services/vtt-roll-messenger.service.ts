import { DiceRollResult, SingleDieResult, DiceRollMode } from '../types/dice';
import { RollSettledResult3D, DiceType3D, RollMode3D } from '../engine/dice3d/types';
import { StorageService } from './storage.service.js';

export interface ParsedVttFormula {
  diceRequests: Array<{ type: DiceType3D; count: number }>;
  mode: RollMode3D;
  modifier: number;
  originalFormula: string;
}

export type VttRollListener = (roll: DiceRollResult) => void;

export class VttRollMessengerService {
  private static listeners: Set<VttRollListener> = new Set();

  static subscribe(listener: VttRollListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  static parseFormula(
    rawFormula: string,
    forcedMode?: 'normal' | 'oculto' | 'maior' | 'menor' | 'vantagem' | 'desvantagem'
  ): ParsedVttFormula {
    const formula = rawFormula.trim();
    let detectedMode: RollMode3D = 'normal';

    if (forcedMode === 'vantagem' || forcedMode === 'maior') {
      detectedMode = 'vantagem';
    } else if (forcedMode === 'desvantagem' || forcedMode === 'menor') {
      detectedMode = 'desvantagem';
    }

    const diceRegex = /([0-9]*)d([0-9]+|moeda)(k[hl]?[0-9]*)?/gi;
    const diceRequests: Array<{ type: DiceType3D; count: number }> = [];

    let match: RegExpExecArray | null;
    while ((match = diceRegex.exec(formula)) !== null) {
      const count = match[1] ? parseInt(match[1], 10) : 1;
      const rawSides = match[2].toLowerCase();
      const keep = match[3] ? match[3].toLowerCase() : '';

      if (keep.includes('l')) {
        detectedMode = 'desvantagem';
      } else if (keep.includes('k')) {
        detectedMode = 'vantagem';
      }

      let type: DiceType3D = 'd20';
      if (rawSides === 'moeda' || rawSides === '2') {
        type = 'd2';
      } else if (rawSides === '4') {
        type = 'd4';
      } else if (rawSides === '6') {
        type = 'd6';
      } else if (rawSides === '8') {
        type = 'd8';
      } else if (rawSides === '10') {
        type = 'd10';
      } else if (rawSides === '12') {
        type = 'd12';
      } else if (rawSides === '20') {
        type = 'd20';
      } else if (rawSides === '100') {
        type = 'd100';
      }

      diceRequests.push({ type, count });
    }

    if (diceRequests.length === 0) {
      diceRequests.push({ type: 'd20', count: 1 });
    }

    let modifier = 0;
    const strippedFormula = formula.replace(diceRegex, '').trim();
    if (strippedFormula.length > 0) {
      try {
        const sanitized = strippedFormula.replace(/[^0-9+\-*/().\s]/g, '');
        if (sanitized.trim().length > 0) {
          const modVal = Function(`'use strict'; return (${sanitized})`)();
          if (typeof modVal === 'number' && !Number.isNaN(modVal)) {
            modifier = Math.round(modVal);
          }
        }
      } catch {
        modifier = 0;
      }
    }

    return {
      diceRequests,
      mode: detectedMode,
      modifier,
      originalFormula: formula,
    };
  }

  static formatRollSettled(
    settled: RollSettledResult3D,
    options: {
      rollerName?: string;
      sourceTitle?: string;
      modifier?: number;
      overrideFormula?: string;
    } = {}
  ): DiceRollResult | null {
    if (!settled.isValid) {
      return null;
    }

    const rollerName = options.rollerName || 'Jogador';
    const sourceTitle = options.sourceTitle || 'Rolagem de Dados';
    const modifier = options.modifier || 0;

    const diceResults: SingleDieResult[] = [];

    if (settled.percentilePairs && settled.percentilePairs.length > 0) {
      for (const pair of settled.percentilePairs) {
        diceResults.push({
          die: 100,
          result: pair.total,
          dropped: false,
        });
      }
    } else {
      for (const d of settled.dice) {
        const sides = d.type === 'd100' ? 100 : d.type === 'd2' ? 2 : parseInt(d.type.replace('d', ''), 10) || 20;
        diceResults.push({
          die: sides,
          result: d.value,
          dropped: !!d.dropped,
        });
      }
    }

    const subtotal = settled.total;
    const total = subtotal + modifier;

    let displayMode: DiceRollMode = 'normal';
    if (settled.mode === 'vantagem') {
      displayMode = 'maior';
    } else if (settled.mode === 'desvantagem') {
      displayMode = 'menor';
    }

    const rollResult: DiceRollResult = {
      id: 'roll-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rollerName,
      sourceTitle,
      mode: displayMode,
      formula: options.overrideFormula || settled.formula + (modifier !== 0 ? ` ${modifier > 0 ? '+' : '-'} ${Math.abs(modifier)}` : ''),
      diceResults,
      subtotal,
      modifierTotal: modifier,
      total,
      isCritical: settled.isCritical,
      isFumble: settled.isFumble,
      notes: settled.recoveredDiceCount > 0 ? `Recuperado por nudges (${settled.totalNudgesApplied}x)` : undefined,
    };

    return rollResult;
  }

  static publishRoll(roll: DiceRollResult): void {
    StorageService.addDiceRoll(roll);
    for (const listener of this.listeners) {
      listener(roll);
    }
  }
}
