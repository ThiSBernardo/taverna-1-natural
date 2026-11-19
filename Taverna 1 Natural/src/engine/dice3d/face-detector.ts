import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { DieInstance } from './types';

export interface FaceDetectionResult {
  value: number;
  faceNormalY: number;
  isCocked: boolean;
  bestFaceIndex: number;
}

export class FaceDetector {
  private static readonly UP = new CANNON.Vec3(0, 1, 0);

  static detectTopFace(die: DieInstance): FaceDetectionResult {
    let bestValue = 0;
    let maxDot = -Infinity;
    let bestFaceIndex = -1;

    const q = die.body.quaternion;

    for (let i = 0; i < die.faceMappings.length; i++) {
      const mapping = die.faceMappings[i];
      const localNormal = new CANNON.Vec3(mapping.normal.x, mapping.normal.y, mapping.normal.z);
      const worldNormal = new CANNON.Vec3();
      q.vmult(localNormal, worldNormal);

      let dot = worldNormal.dot(this.UP);

      if (die.type === 'd4') {
        dot = -dot;
      }

      if (dot > maxDot) {
        maxDot = dot;
        bestValue = mapping.value;
        bestFaceIndex = i;
      }
    }

    const isCocked = maxDot < 0.65;

    return {
      value: bestValue,
      faceNormalY: maxDot,
      isCocked,
      bestFaceIndex,
    };
  }

  static isDieSettled(die: DieInstance): boolean {
    const v = die.body.velocity;
    const w = die.body.angularVelocity;

    const linearSpeedSq = v.x * v.x + v.y * v.y + v.z * v.z;
    const angularSpeedSq = w.x * w.x + w.y * w.y + w.z * w.z;

    const isSleeping = die.body.sleepState === CANNON.Body.SLEEPING;
    const isStationary = linearSpeedSq < 0.008 && angularSpeedSq < 0.015;

    return isSleeping || isStationary;
  }
}
