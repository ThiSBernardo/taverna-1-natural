import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Dices, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  Skull, 
  CheckCircle2, 
  ChevronRight, 
  Activity,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { Dice3DEngine } from '../../engine/dice3d/engine';
import { 
  DiceType3D, 
  DiceTheme, 
  RollMode3D, 
  RollSettledResult3D, 
  Dice3DStatus,
  DiceEngineError
} from '../../engine/dice3d/types';

interface DicePrototypeViewProps {
  onClose?: () => void;
}

export const DicePrototypeView: React.FC<DicePrototypeViewProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Dice3DEngine | null>(null);

  const [status, setStatus] = useState<Dice3DStatus>('idle');
  const [theme, setTheme] = useState<DiceTheme>('obsidian');
  const [selectedType, setSelectedType] = useState<DiceType3D>('d20');
  const [quantity, setQuantity] = useState<number>(1);
  const [mode, setMode] = useState<RollMode3D>('normal');
  const [lastResult, setLastResult] = useState<RollSettledResult3D | null>(null);
  const [activeScenario, setActiveScenario] = useState<number | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addLog = (msg: string) => {
    setLogMessages(prev => [msg, ...prev.slice(0, 40)]);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Dice3DEngine(canvasRef.current, {
      theme,
      shadows: true,
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
        if (newStatus === 'cocked') {
          setErrorMessage('Dado tombado! Falha física de estabilização.');
        } else if (newStatus === 'rolling') {
          setErrorMessage(null);
        }
      },
      onRollSettled: (result) => {
        setLastResult(result);
        if (result.isValid) {
          addLog(`Rolagem concluída: ${result.formula} = ${result.total} em ${result.settledTimeMs}ms`);
        } else {
          addLog(`Rolagem rejeitada: Dado tombado ou não estabilizado.`);
        }
      },
      onRollError: (err) => {
        addLog(`Erro físico: ${err.message} (${err.code})`);
        setErrorMessage(err.message);
      },
      onRollCancelled: (reason) => {
        addLog(`Rolagem cancelada: ${reason || 'Ação do usuário'}`);
      },
    });

    engineRef.current = engine;

    const handleResize = () => {
      if (containerRef.current && engineRef.current) {
        engineRef.current.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    addLog('Motor de Dados 3D inicializado com sucesso.');

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const handleThemeChange = (newTheme: DiceTheme) => {
    setTheme(newTheme);
    if (engineRef.current) {
      engineRef.current.setTheme(newTheme);
    }
  };

  const handleRollCustom = async (typeOverride?: DiceType3D, qtyOverride?: number, modeOverride?: RollMode3D) => {
    if (!engineRef.current) return;
    const t = typeOverride || selectedType;
    const q = qtyOverride || quantity;
    const m = modeOverride || mode;

    addLog(`Lançando ${q}${t} (Modo: ${m}, Tema: ${theme})...`);
    try {
      await engineRef.current.roll([{ type: t, count: q }], { mode: m, theme });
    } catch (err) {
      if (err instanceof DiceEngineError) {
        addLog(`Resultado: ${err.code} — ${err.message}`);
      }
    }
  };

  const handleCancelRoll = () => {
    if (engineRef.current) {
      engineRef.current.cancelRoll('Cancelado pelo usuário');
    }
  };

  const runScenario = async (scenarioNumber: number) => {
    if (!engineRef.current) return;
    setActiveScenario(scenarioNumber);

    try {
      switch (scenarioNumber) {
        case 1:
          addLog('Cenário 1: Um único d20...');
          await engineRef.current.roll([{ type: 'd20', count: 1 }], { mode: 'normal', theme });
          break;
        case 2:
          addLog('Cenário 2: Auditoria matemática de face do d20...');
          await engineRef.current.roll([{ type: 'd20', count: 1 }], { mode: 'normal', theme });
          break;
        case 3:
          addLog('Cenário 3: 4d6 simultâneos com colisão múltipla...');
          await engineRef.current.roll([{ type: 'd6', count: 4 }], { mode: 'normal', theme });
          break;
        case 4:
          addLog('Cenário 4: Salada de dados (d2, d4, d6, d8, d10, d12, d20, d100)...');
          await engineRef.current.roll([
            { type: 'd2', count: 1 },
            { type: 'd4', count: 1 },
            { type: 'd6', count: 1 },
            { type: 'd8', count: 1 },
            { type: 'd10', count: 1 },
            { type: 'd12', count: 1 },
            { type: 'd20', count: 1 },
            { type: 'd100', count: 1 },
          ], { mode: 'normal', theme });
          break;
        case 5:
          addLog('Cenário 5: 2d20 com Vantagem (mantém o maior)...');
          await engineRef.current.roll([{ type: 'd20', count: 2 }], { mode: 'vantagem', theme });
          break;
        case 6:
          addLog('Cenário 6: 2d20 com Desvantagem (mantém o menor)...');
          await engineRef.current.roll([{ type: 'd20', count: 2 }], { mode: 'desvantagem', theme });
          break;
        case 7:
          addLog('Cenário 7: d100 percentil completo (dezenas 00-90 + unidades 0-9)...');
          await engineRef.current.roll([{ type: 'd100', count: 1 }], { mode: 'normal', theme });
          break;
        case 8:
          addLog('Cenário 8: Teste de estresse com 3 repetições rápidas seguidas...');
          for (let i = 0; i < 3; i++) {
            addLog(`Repetição ${i + 1}/3...`);
            try {
              engineRef.current.roll([{ type: 'd20', count: 2 }], { mode: 'normal', theme });
            } catch {
            }
            await new Promise(r => setTimeout(r, 600));
          }
          break;
        case 9:
          addLog('Cenário 9: Colisão forçada entre dados em alta energia...');
          await engineRef.current.roll([{ type: 'd20', count: 3 }, { type: 'd6', count: 3 }], { mode: 'normal', theme });
          break;
        case 10:
          addLog('Cenário 10: Redimensionamento e ajuste de viewport...');
          if (containerRef.current && engineRef.current) {
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            engineRef.current.resize(w * 0.9, h * 0.9);
            setTimeout(() => {
              if (containerRef.current && engineRef.current) {
                engineRef.current.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
              }
            }, 400);
          }
          await engineRef.current.roll([{ type: 'd20', count: 1 }], { mode: 'normal', theme });
          break;
      }
    } catch (err) {
      if (err instanceof DiceEngineError) {
        addLog(`Cenário ${scenarioNumber} encerrou com aviso: ${err.message}`);
      }
    }
  };

  const diceTypes: Array<{ type: DiceType3D; label: string }> = [
    { type: 'd2', label: 'd2 Moeda' },
    { type: 'd4', label: 'd4 Tetraedro' },
    { type: 'd6', label: 'd6 Cubo' },
    { type: 'd8', label: 'd8 Octaedro' },
    { type: 'd10', label: 'd10 Trapezoedro' },
    { type: 'd12', label: 'd12 Dodecaedro' },
    { type: 'd20', label: 'd20 Icosaedro' },
    { type: 'd100', label: 'd100 Par Percentil' },
  ];

  const scenarios = [
    { num: 1, title: '1. d20 Único', desc: 'Lança um único d20' },
    { num: 2, title: '2. Auditoria d20', desc: 'Verifica cálculo vetorial da face' },
    { num: 3, title: '3. 4d6 Simultâneos', desc: 'Múltiplos cubos colidindo' },
    { num: 4, title: '4. Salada Poliédrica', desc: 'Todos os 8 tipos de dados' },
    { num: 5, title: '5. d20 Vantagem', desc: '2d20 descartando o menor' },
    { num: 6, title: '6. d20 Desvantagem', desc: '2d20 descartando o maior' },
    { num: 7, title: '7. d100 Percentil', desc: 'Par dezenas 00-90 + unidades 0-9' },
    { num: 8, title: '8. Repetição Rápida', desc: '3 lançamentos rápidos sem travar' },
    { num: 9, title: '9. Colisão Forçada', desc: '6 dados convergindo no centro' },
    { num: 10, title: '10. Viewport Resize', desc: 'Ajuste de proporção de tela' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#09080e] text-gray-100 flex flex-col select-none overflow-hidden font-sans">
      <header className="h-14 border-b border-white/[0.08] bg-[#12101a]/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Dices className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-base font-bold text-white tracking-wide flex items-center gap-2">
              Taverna 1 Natural — Motor de Dados 3D com Física Real
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-400/40 text-purple-200 font-mono">
                Three.js + Cannon-es
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${
              status === 'rolling' ? 'bg-amber-400 animate-ping' : 
              status === 'settled' ? 'bg-emerald-400' : 
              status === 'cocked' ? 'bg-red-500 animate-pulse' :
              status === 'cancelled' ? 'bg-orange-400' : 'bg-gray-400'
            }`} />
            <span className="text-gray-300 capitalize">
              {status === 'rolling' ? 'Simulando Física...' : 
               status === 'settled' ? 'Repouso Confirmado' : 
               status === 'cocked' ? 'Dado Tombado / Falha' :
               status === 'cancelled' ? 'Rolagem Cancelada' : 'Pronto'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
            <button
              type="button"
              onClick={() => handleThemeChange('obsidian')}
              className={`w-6 h-6 rounded-full bg-[#181622] border transition-all ${
                theme === 'obsidian' ? 'ring-2 ring-purple-400 border-white scale-110' : 'border-white/20'
              }`}
              title="Obsidiana Ancestral"
            />
            <button
              type="button"
              onClick={() => handleThemeChange('gold')}
              className={`w-6 h-6 rounded-full bg-[#f59e0b] border transition-all ${
                theme === 'gold' ? 'ring-2 ring-purple-400 border-white scale-110' : 'border-white/20'
              }`}
              title="Ouro Épico"
            />
            <button
              type="button"
              onClick={() => handleThemeChange('amethyst')}
              className={`w-6 h-6 rounded-full bg-[#9333ea] border transition-all ${
                theme === 'amethyst' ? 'ring-2 ring-purple-400 border-white scale-110' : 'border-white/20'
              }`}
              title="Ametista Rúnica"
            />
            <button
              type="button"
              onClick={() => handleThemeChange('blood')}
              className={`w-6 h-6 rounded-full bg-[#ef4444] border transition-all ${
                theme === 'blood' ? 'ring-2 ring-purple-400 border-white scale-110' : 'border-white/20'
              }`}
              title="Sangue Paranormal"
            />
          </div>

          {status === 'rolling' && (
            <button
              type="button"
              onClick={handleCancelRoll}
              className="px-3 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-xs text-red-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancelar Rolagem
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              Voltar à Mesa
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div ref={containerRef} className="flex-1 relative bg-[#0c0b11] overflow-hidden flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full block" />

          <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-2">
            <div className="bg-[#12101a]/85 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl max-w-sm">
              <div className="text-[10px] uppercase font-mono tracking-widest text-purple-400 font-bold mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Telemetria de Física em Tempo Real
              </div>
              <div className="text-xs text-gray-300 font-mono space-y-0.5">
                <div>Gravidade: -32 m/s²</div>
                <div>Atrito da Bandeja: 0.55 | Restituição: 0.28</div>
                <div>Alinhamento Mínimo Face: ≥ 0.940</div>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-950/90 backdrop-blur-md border border-red-500/40 p-3 rounded-2xl shadow-xl max-w-sm text-red-200 text-xs font-mono flex items-center gap-2 animate-bounce">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {lastResult && (
              <div className={`backdrop-blur-md p-3.5 rounded-2xl shadow-2xl animate-modal-in max-w-sm border ${
                lastResult.isValid 
                  ? 'bg-[#14111d]/90 border-purple-500/30' 
                  : 'bg-red-950/90 border-red-500/50'
              }`}>
                <div className="text-[10px] uppercase tracking-wider text-amber-300 font-bold flex items-center justify-between mb-1">
                  <span>{lastResult.isValid ? 'Resultado Verificado' : 'Rolagem Inválida / Tombada'}</span>
                  <span className="font-mono text-gray-400">{lastResult.settledTimeMs}ms</span>
                </div>
                <div className="flex items-baseline gap-3 my-1">
                  <span className="text-4xl font-black font-serif text-white tracking-tight drop-shadow-md">
                    {lastResult.isValid ? lastResult.total : '—'}
                  </span>
                  <span className="text-xs text-purple-300 font-mono">
                    {lastResult.formula} {lastResult.mode !== 'normal' ? `(${lastResult.mode})` : ''}
                  </span>
                </div>

                {lastResult.percentilePairs && lastResult.percentilePairs.length > 0 && (
                  <div className="text-xs font-mono text-amber-300 bg-amber-950/40 p-1.5 rounded-lg border border-amber-500/30 my-1.5 space-y-0.5">
                    {lastResult.percentilePairs.map((pair, idx) => (
                      <div key={idx}>
                        d100 #{idx + 1}: {pair.tens === 0 ? '00' : pair.tens} + {pair.units} = <strong>{pair.total}</strong> {pair.is100 ? '(Crítico Máximo 100!)' : ''}
                      </div>
                    ))}
                  </div>
                )}

                {lastResult.isCritical && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" /> Acerto Crítico (20)!
                  </div>
                )}
                {lastResult.isFumble && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400">
                    <Skull className="w-3.5 h-3.5" /> Falha Crítica (1)!
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-white/[0.08] text-[10px] flex items-center justify-between font-mono">
                  {lastResult.isValid ? (
                    <div className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-400" />
                      <span>Face superior identificada geometricamente</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-400">
                      <ShieldAlert className="w-3 h-3 shrink-0 text-red-400" />
                      <span>Dado tombado rejeitado pelo motor de física</span>
                    </div>
                  )}
                  {lastResult.recoveredDiceCount > 0 && (
                    <span className="text-amber-300 font-sans text-[10px] bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                      {lastResult.recoveredDiceCount} recup. ({lastResult.totalNudgesApplied} impulsos)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="w-96 border-l border-white/[0.08] bg-[#12101a]/95 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-white/[0.08]">
            <h2 className="text-xs font-bold font-serif text-amber-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Dices className="w-4 h-4 text-purple-400" />
              Lançamento Livre
            </h2>

            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {diceTypes.map(({ type, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer text-center ${
                    selectedType === type
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/50'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-6 h-6 text-sm font-bold text-gray-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  —
                </button>
                <span className="w-8 text-center text-xs font-mono font-bold text-white">
                  {quantity}x
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.min(10, prev + 1))}
                  className="w-6 h-6 text-sm font-bold text-gray-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-xl border border-white/10 text-[11px] font-serif">
                <button
                  type="button"
                  onClick={() => setMode('normal')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    mode === 'normal' ? 'bg-purple-700 text-white font-bold' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setMode('vantagem')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    mode === 'vantagem' ? 'bg-purple-700 text-white font-bold' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Vant.
                </button>
                <button
                  type="button"
                  onClick={() => setMode('desvantagem')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    mode === 'desvantagem' ? 'bg-purple-700 text-white font-bold' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Desv.
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRollCustom()}
              disabled={status === 'rolling'}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-serif font-bold text-sm shadow-lg shadow-purple-900/40 border border-purple-400/40 active:scale-98 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Lançar na Bandeja
            </button>
          </div>

          <div className="p-4 border-b border-white/[0.08] flex-1">
            <h2 className="text-xs font-bold font-serif text-amber-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              Bateria de Testes (10 Cenários)
            </h2>

            <div className="space-y-1.5">
              {scenarios.map(({ num, title, desc }) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => runScenario(num)}
                  disabled={status === 'rolling'}
                  className={`w-full p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    activeScenario === num
                      ? 'bg-purple-950/40 border-purple-500/50 text-white'
                      : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.06] text-gray-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold">{title}</div>
                    <div className="text-[10px] text-gray-400">{desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {lastResult && (
            <div className="p-4 border-b border-white/[0.08]">
              <h3 className="text-[11px] font-bold font-serif text-gray-300 uppercase tracking-wider mb-2">
                Auditoria de Faces Superiores
              </h3>
              <div className="space-y-1 max-h-48 overflow-y-auto font-mono text-[11px]">
                {lastResult.dice.map((d, i) => (
                  <div 
                    key={d.id} 
                    className={`p-1.5 rounded-lg border flex items-center justify-between ${
                      d.dropped 
                        ? 'bg-black/30 border-white/5 text-gray-500 line-through' 
                        : d.isCocked
                        ? 'bg-red-950/40 border-red-500/30 text-red-300'
                        : 'bg-black/50 border-purple-500/20 text-gray-200'
                    }`}
                  >
                    <span>
                      #{i + 1} {d.type.toUpperCase()}{d.role === 'tens' ? ' (Dezenas)' : d.role === 'units' ? ' (Unidades)' : ''}: <strong className="text-white text-xs">{d.displayValue}</strong>
                    </span>
                    <span className={`text-[10px] ${d.faceNormalY >= 0.94 ? 'text-gray-400' : 'text-red-400 font-bold'}`}>
                      {d.wasRecovered && <span className="text-amber-400 font-mono text-[9px] mr-1">(Recup.)</span>}
                      Normal·Y: {d.faceNormalY.toFixed(3)} {d.isCocked ? '(Tombado)' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-black/40 text-[10px] font-mono text-gray-400 max-h-36 overflow-y-auto">
            <div className="text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">
              Registro de Eventos
            </div>
            {logMessages.map((msg, i) => (
              <div key={i} className="truncate">{msg}</div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
