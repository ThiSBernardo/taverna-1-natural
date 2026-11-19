import type * as THREE from 'three';
import type * as CANNON from 'cannon-es';

export type DiceType3D = 'd2' | 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
export type DiceTheme = 'obsidian' | 'gold' | 'amethyst' | 'blood';
export type RollMode3D = 'normal' | 'vantagem' | 'desvantagem';
export type DieRole = 'standard' | 'tens' | 'units';
export type Dice3DStatus = 'idle' | 'rolling' | 'settled' | 'cocked' | 'cancelled' | 'error';
export type DiceEngineErrorCode = 'DICE_COCKED' | 'ROLL_CANCELLED' | 'ROLL_SUPERSEDED' | 'ROLL_CLEARED' | 'ENGINE_DESTROYED';

export class DiceEngineError extends Error {
  public readonly code: DiceEngineErrorCode;

  constructor(code: DiceEngineErrorCode, message: string) {
    super(message);
    this.name = 'DiceEngineError';
    this.code = code;
    Object.setPrototypeOf(this, DiceEngineError.prototype);
  }
}

export interface FaceNormalMapping {
  value: number;
  displayValue?: string;
  normal: THREE.Vector3;
}

export interface DieInstance {
  id: string;
  type: DiceType3D;
  role: DieRole;
  mesh: THREE.Mesh;
  body: CANNON.Body;
  faceMappings: FaceNormalMapping[];
  settled: boolean;
  settledFrames: number;
  result: number | null;
  displayResult: string | null;
  spawnTime: number;
  nudgeAttempts: number;
  wasRecovered: boolean;
  isCocked: boolean;
  isValid: boolean;
  lastPosition: THREE.Vector3;
  lastQuaternion: THREE.Quaternion;
}

export interface PercentilePairResult {
  tens: number;
  units: number;
  total: number;
  is100: boolean;
}

export interface SingleDieSettledResult {
  id: string;
  type: DiceType3D;
  value: number;
  displayValue: string;
  role: DieRole;
  dropped?: boolean;
  isCocked: boolean;
  isValid: boolean;
  nudgesApplied: number;
  wasRecovered: boolean;
  faceNormalY: number;
  position: { x: number; y: number; z: number };
}

export interface RollSettledResult3D {
  total: number;
  dice: SingleDieSettledResult[];
  mode: RollMode3D;
  formula: string;
  isCritical: boolean;
  isFumble: boolean;
  settledTimeMs: number;
  isValid: boolean;
  hasCockedDice: boolean;
  recoveredDiceCount: number;
  totalNudgesApplied: number;
  percentilePairs?: PercentilePairResult[];
}

export interface Dice3DEngineOptions {
  theme?: DiceTheme;
  shadows?: boolean;
  transparent?: boolean;
  maxNudgeAttempts?: number;
  maxSimulationTimeMs?: number;
  onRollSettled?: (result: RollSettledResult3D) => void;
  onDieSettled?: (die: SingleDieSettledResult) => void;
  onStatusChange?: (status: Dice3DStatus) => void;
  onRollError?: (error: DiceEngineError) => void;
  onRollCancelled?: (reason?: string) => void;
  onNudgeApplied?: (dieId: string, attempt: number, totalNudges: number) => void;
}
