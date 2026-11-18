export class DiceRollerService {
    static rollDie(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }
    static rollFormula(rawFormula, options = {}) {
        const rollerName = options.rollerName || 'Jogador';
        const sourceTitle = options.sourceTitle || 'Rolagem de Dados';
        const mode = options.mode || 'normal';
        const variables = options.variables || {};
        const criticalMargin = options.criticalMargin || 20;
        let formula = rawFormula.trim();
        for (const [key, val] of Object.entries(variables)) {
            const regex = new RegExp(`@${key}\\b`, 'gi');
            formula = formula.replace(regex, String(val));
        }
        const diceRegex = /([0-9]*)d([0-9]+)(k[hl]?[0-9]*)?/gi;
        const allDiceResults = [];
        let subtotal = 0;
        let hasKeptD20 = false;
        let keptD20Max = 0;
        let keptD20Min = 999;
        const evaluatedFormula = formula.replace(diceRegex, (_match, countStr, sidesStr, keepStr) => {
            const count = countStr ? parseInt(countStr, 10) : 1;
            const sides = parseInt(sidesStr, 10);
            let keepCount = count;
            let keepType = 'high';
            if (keepStr) {
                const lowerKeep = keepStr.toLowerCase();
                if (lowerKeep.includes('l')) {
                    keepType = 'low';
                }
                const numPart = lowerKeep.replace(/[^0-9]/g, '');
                keepCount = numPart ? parseInt(numPart, 10) : 1;
            }
            else if (mode === 'maior' && count > 1) {
                keepCount = 1;
                keepType = 'high';
            }
            else if (mode === 'menor' && count > 1) {
                keepCount = 1;
                keepType = 'low';
            }
            const currentGroup = [];
            for (let i = 0; i < count; i++) {
                const rolled = this.rollDie(sides);
                currentGroup.push({ die: sides, result: rolled, originalIndex: i });
            }
            const sorted = [...currentGroup].sort((a, b) => {
                return keepType === 'high' ? b.result - a.result : a.result - b.result;
            });
            const keptIndices = new Set(sorted.slice(0, Math.min(keepCount, count)).map(item => item.originalIndex));
            let groupSum = 0;
            for (const item of currentGroup) {
                const isKept = keptIndices.has(item.originalIndex);
                allDiceResults.push({
                    die: item.die,
                    result: item.result,
                    dropped: !isKept,
                });
                if (isKept) {
                    groupSum += item.result;
                    if (item.die === 20) {
                        hasKeptD20 = true;
                        if (item.result > keptD20Max)
                            keptD20Max = item.result;
                        if (item.result < keptD20Min)
                            keptD20Min = item.result;
                    }
                }
            }
            subtotal += groupSum;
            return String(groupSum);
        });
        let total = subtotal;
        try {
            const sanitized = evaluatedFormula.replace(/[^0-9+\-*/().\s]/g, '');
            if (sanitized.trim().length > 0) {
                const mathResult = Function(`'use strict'; return (${sanitized})`)();
                if (typeof mathResult === 'number' && !Number.isNaN(mathResult)) {
                    total = Math.round(mathResult);
                }
            }
        }
        catch {
            total = subtotal;
        }
        const modifierTotal = total - subtotal;
        const isCritical = hasKeptD20 && keptD20Max >= criticalMargin;
        const isFumble = hasKeptD20 && keptD20Min === 1 && !isCritical;
        let damageResults = undefined;
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
            id: 'roll-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            rollerName,
            sourceTitle,
            mode,
            formula: rawFormula,
            diceResults: allDiceResults,
            subtotal,
            modifierTotal,
            total,
            isCritical,
            isFumble,
            damageResults,
        };
    }
}
