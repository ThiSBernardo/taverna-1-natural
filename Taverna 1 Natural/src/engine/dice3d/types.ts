import type * as THREE from 'three';
import type * as CANNON from 'cannon-es';

export type DiceType3D = 'd2' | 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
export type DiceTheme = 'obsidian' | 'gold' | 'amethyst' | 'blood';
export type RollMode3D = 'normal' | 'vantagem' | 'desvantagem';

export interface FaceNormalMapping {
  value: number;
  normal: THREE.Vector3;
}

export interface DieInstance {
  id: string;
  type: DiceType3D;
  mesh: THREE.Mesh;
  body: CANNON.Body;
  faceMappings: FaceNormalMapping[];
  settled: boolean;
  settledFrames: number;
  result: number | null;
  spawnTime: number;
  lastPosition: THREE.Vector3;
  lastQuaternion: THREE.Quaternion;
}

export interface SingleDieSettledResult {
  id: string;
  type: DiceType3D;
  value: number;
  dropped?: boolean;
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
}

export interface Dice3DEngineOptions {
  theme?: DiceTheme;
  shadows?: boolean;
  onRollSettled?: (result: RollSettledResult3D) => void;
  onDieSettled?: (die: SingleDieSettledResult) => void;
  onStatusChange?: (status: 'idle' | 'rolling' | 'settled') => void;
}
