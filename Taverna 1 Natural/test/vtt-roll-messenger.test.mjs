import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VttRollMessengerService } from '../test-dist/services/vtt-roll-messenger.service.js';

test('VttRollMessengerService.parseFormula - standard formulas', () => {
  const d20 = VttRollMessengerService.parseFormula('1d20');
  assert.equal(d20.diceRequests.length, 1);
  assert.equal(d20.diceRequests[0].type, 'd20');
  assert.equal(d20.diceRequests[0].count, 1);
  assert.equal(d20.mode, 'normal');
  assert.equal(d20.modifier, 0);

  const multiD6 = VttRollMessengerService.parseFormula('4d6');
  assert.equal(multiD6.diceRequests.length, 1);
  assert.equal(multiD6.diceRequests[0].type, 'd6');
  assert.equal(multiD6.diceRequests[0].count, 4);
  assert.equal(multiD6.mode, 'normal');
  assert.equal(multiD6.modifier, 0);

  const d100 = VttRollMessengerService.parseFormula('1d100');
  assert.equal(d100.diceRequests.length, 1);
  assert.equal(d100.diceRequests[0].type, 'd100');
  assert.equal(d100.diceRequests[0].count, 1);

  const coin = VttRollMessengerService.parseFormula('2dmoeda');
  assert.equal(coin.diceRequests.length, 1);
  assert.equal(coin.diceRequests[0].type, 'd2');
  assert.equal(coin.diceRequests[0].count, 2);
});

test('VttRollMessengerService.parseFormula - advantage, disadvantage and modifiers', () => {
  const adv = VttRollMessengerService.parseFormula('2d20k1 + 3');
  assert.equal(adv.diceRequests.length, 1);
  assert.equal(adv.diceRequests[0].type, 'd20');
  assert.equal(adv.diceRequests[0].count, 2);
  assert.equal(adv.mode, 'vantagem');
  assert.equal(adv.modifier, 3);

  const dis = VttRollMessengerService.parseFormula('2d20kl1 - 2');
  assert.equal(dis.diceRequests.length, 1);
  assert.equal(dis.diceRequests[0].type, 'd20');
  assert.equal(dis.diceRequests[0].count, 2);
  assert.equal(dis.mode, 'desvantagem');
  assert.equal(dis.modifier, -2);

  const forcedAdv = VttRollMessengerService.parseFormula('1d20', 'vantagem');
  assert.equal(forcedAdv.mode, 'vantagem');
});

test('VttRollMessengerService.formatRollSettled - valid roll formatting', () => {
  const mockSettled = {
    total: 18,
    dice: [
      { id: 'd1', type: 'd20', value: 18, displayValue: '18', role: 'standard', dropped: false, isCocked: false, isValid: true, nudgesApplied: 0, wasRecovered: false, faceNormalY: 1, position: { x: 0, y: 0, z: 0 } },
      { id: 'd2', type: 'd20', value: 7, displayValue: '7', role: 'standard', dropped: true, isCocked: false, isValid: true, nudgesApplied: 0, wasRecovered: false, faceNormalY: 1, position: { x: 0, y: 0, z: 0 } }
    ],
    mode: 'vantagem',
    formula: '2d20k1',
    isCritical: false,
    isFumble: false,
    settledTimeMs: 1400,
    isValid: true,
    hasCockedDice: false,
    recoveredDiceCount: 0,
    totalNudgesApplied: 0
  };

  const formatted = VttRollMessengerService.formatRollSettled(mockSettled, {
    rollerName: 'Arthur Veríssimo',
    sourceTitle: 'Ataque com Vantagem',
    modifier: 4,
    overrideFormula: '2d20k1 + 4'
  });

  assert.ok(formatted !== null);
  assert.equal(formatted.rollerName, 'Arthur Veríssimo');
  assert.equal(formatted.sourceTitle, 'Ataque com Vantagem');
  assert.equal(formatted.formula, '2d20k1 + 4');
  assert.equal(formatted.subtotal, 18);
  assert.equal(formatted.modifierTotal, 4);
  assert.equal(formatted.total, 22);
  assert.equal(formatted.diceResults.length, 2);
  assert.equal(formatted.diceResults[0].result, 18);
  assert.equal(formatted.diceResults[0].dropped, false);
  assert.equal(formatted.diceResults[1].result, 7);
  assert.equal(formatted.diceResults[1].dropped, true);
});

test('VttRollMessengerService.formatRollSettled - rejects invalid/cocked rolls', () => {
  const invalidSettled = {
    total: 0,
    dice: [],
    mode: 'normal',
    formula: '1d20',
    isCritical: false,
    isFumble: false,
    settledTimeMs: 3000,
    isValid: false,
    hasCockedDice: true,
    recoveredDiceCount: 0,
    totalNudgesApplied: 3
  };

  const formatted = VttRollMessengerService.formatRollSettled(invalidSettled);
  assert.equal(formatted, null);
});

test('VttRollMessengerService.formatRollSettled - critical detection and nudges note', () => {
  const critSettled = {
    total: 20,
    dice: [
      { id: 'd1', type: 'd20', value: 20, displayValue: '20', role: 'standard', dropped: false, isCocked: false, isValid: true, nudgesApplied: 1, wasRecovered: true, faceNormalY: 1, position: { x: 0, y: 0, z: 0 } }
    ],
    mode: 'normal',
    formula: '1d20',
    isCritical: true,
    isFumble: false,
    settledTimeMs: 1600,
    isValid: true,
    hasCockedDice: false,
    recoveredDiceCount: 1,
    totalNudgesApplied: 1
  };

  const formatted = VttRollMessengerService.formatRollSettled(critSettled, {
    rollerName: 'ThiSBernardo (Mestre)',
    sourceTitle: 'Rolagem de d20'
  });

  assert.ok(formatted !== null);
  assert.equal(formatted.isCritical, true);
  assert.equal(formatted.total, 20);
  assert.ok(formatted.notes && formatted.notes.includes('Recuperado por nudges'));
});
