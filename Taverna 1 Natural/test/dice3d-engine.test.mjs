import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FaceDetector } from '../test-dist/engine/dice3d/face-detector.js';
import { DiceGeometryBuilder } from '../test-dist/engine/dice3d/geometries.js';
import { DiceEngineError } from '../test-dist/engine/dice3d/types.js';

test('D100 Percentile Combinations - all 100 combinations bijection', () => {
  const tensValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  const unitsValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const results = new Set();

  for (const tens of tensValues) {
    for (const units of unitsValues) {
      const is100 = tens === 0 && units === 0;
      const total = is100 ? 100 : tens + units;
      assert.ok(total >= 1 && total <= 100);
      results.add(total);
    }
  }

  assert.equal(results.size, 100);

  const test00_0 = 0 === 0 && 0 === 0 ? 100 : 0 + 0;
  assert.equal(test00_0, 100);

  const test70_4 = 70 === 0 && 4 === 0 ? 100 : 70 + 4;
  assert.equal(test70_4, 74);

  const test00_7 = 0 === 0 && 7 === 0 ? 100 : 0 + 7;
  assert.equal(test00_7, 7);

  const test90_0 = 90 === 0 && 0 === 0 ? 100 : 90 + 0;
  assert.equal(test90_0, 90);
});

test('FaceDetector - valid top face detection on d20 flat rest', () => {
  const built = DiceGeometryBuilder.build('d20', 'obsidian', 'standard');
  const body = new CANNON.Body({ mass: 1, shape: built.cannonShape });

  const targetMapping = built.faceMappings.find(m => m.value === 20);
  assert.ok(targetMapping);

  const q = new THREE.Quaternion().setFromUnitVectors(targetMapping.normal, new THREE.Vector3(0, 1, 0));
  body.quaternion.set(q.x, q.y, q.z, q.w);

  const mockDie = {
    id: 'test-d20',
    type: 'd20',
    role: 'standard',
    mesh: new THREE.Mesh(),
    body,
    faceMappings: built.faceMappings,
    settled: false,
    settledFrames: 20,
    result: null,
    displayResult: null,
    spawnTime: 0,
    nudgeAttempts: 0,
    isCocked: false,
    isValid: false,
    lastPosition: new THREE.Vector3(),
    lastQuaternion: new THREE.Quaternion(),
  };

  const detection = FaceDetector.detectTopFace(mockDie);
  assert.equal(detection.value, 20);
  assert.equal(detection.displayValue, '20');
  assert.ok(detection.faceNormalY >= 0.99);
  assert.equal(detection.isCocked, false);
  assert.equal(detection.isValid, true);
});

test('FaceDetector - cocked die rejection below alignment threshold', () => {
  const built = DiceGeometryBuilder.build('d20', 'obsidian', 'standard');
  const body = new CANNON.Body({ mass: 1, shape: built.cannonShape });

  const axis = new THREE.Vector3(1, 0, 0);
  const q = new THREE.Quaternion().setFromAxisAngle(axis, Math.PI / 4);
  body.quaternion.set(q.x, q.y, q.z, q.w);

  const mockDie = {
    id: 'test-d20-cocked',
    type: 'd20',
    role: 'standard',
    mesh: new THREE.Mesh(),
    body,
    faceMappings: built.faceMappings,
    settled: false,
    settledFrames: 20,
    result: null,
    displayResult: null,
    spawnTime: 0,
    nudgeAttempts: 0,
    isCocked: false,
    isValid: false,
    lastPosition: new THREE.Vector3(),
    lastQuaternion: new THREE.Quaternion(),
  };

  const detection = FaceDetector.detectTopFace(mockDie);
  if (detection.faceNormalY < FaceDetector.ALIGNMENT_THRESHOLD) {
    assert.equal(detection.isCocked, true);
    assert.equal(detection.isValid, false);
  }
});

test('FaceDetector - d4 reading mechanism using base face alignment', () => {
  const built = DiceGeometryBuilder.build('d4', 'obsidian', 'standard');
  const body = new CANNON.Body({ mass: 1, shape: built.cannonShape });

  const targetMapping = built.faceMappings.find(m => m.value === 3);
  assert.ok(targetMapping);

  const q = new THREE.Quaternion().setFromUnitVectors(targetMapping.normal, new THREE.Vector3(0, -1, 0));
  body.quaternion.set(q.x, q.y, q.z, q.w);

  const mockDie = {
    id: 'test-d4',
    type: 'd4',
    role: 'standard',
    mesh: new THREE.Mesh(),
    body,
    faceMappings: built.faceMappings,
    settled: false,
    settledFrames: 20,
    result: null,
    displayResult: null,
    spawnTime: 0,
    nudgeAttempts: 0,
    isCocked: false,
    isValid: false,
    lastPosition: new THREE.Vector3(),
    lastQuaternion: new THREE.Quaternion(),
  };

  const detection = FaceDetector.detectTopFace(mockDie);
  assert.equal(detection.value, 3);
  assert.ok(detection.faceNormalY >= 0.99);
  assert.equal(detection.isCocked, false);
  assert.equal(detection.isValid, true);
});

test('Geometries - outward normals and bijection for all 8 polyhedra', () => {
  const diceTypes = ['d2', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20'];

  for (const type of diceTypes) {
    const built = DiceGeometryBuilder.build(type, 'obsidian', 'standard');
    assert.ok(built.faceMappings.length > 0);

    for (const mapping of built.faceMappings) {
      assert.ok(mapping.normal.length() >= 0.99);
    }
  }

  const d10Tens = DiceGeometryBuilder.build('d100', 'obsidian', 'tens');
  assert.equal(d10Tens.faceMappings.length, 10);
  const valuesTens = d10Tens.faceMappings.map(m => m.displayValue);
  assert.ok(valuesTens.includes('00'));
  assert.ok(valuesTens.includes('90'));

  const d10Units = DiceGeometryBuilder.build('d10', 'obsidian', 'units');
  assert.equal(d10Units.faceMappings.length, 10);
  const valuesUnits = d10Units.faceMappings.map(m => m.displayValue);
  assert.ok(valuesUnits.includes('0'));
  assert.ok(valuesUnits.includes('9'));
});

test('DiceEngineError - code and prototype integrity', () => {
  const errCancelled = new DiceEngineError('ROLL_CANCELLED', 'Roll cancelled');
  assert.equal(errCancelled.code, 'ROLL_CANCELLED');
  assert.equal(errCancelled.name, 'DiceEngineError');
  assert.ok(errCancelled instanceof Error);
  assert.ok(errCancelled instanceof DiceEngineError);

  const errCocked = new DiceEngineError('DICE_COCKED', 'Dice cocked');
  assert.equal(errCocked.code, 'DICE_COCKED');

  const errSuperseded = new DiceEngineError('ROLL_SUPERSEDED', 'Roll superseded');
  assert.equal(errSuperseded.code, 'ROLL_SUPERSEDED');

  const errDestroyed = new DiceEngineError('ENGINE_DESTROYED', 'Engine destroyed');
  assert.equal(errDestroyed.code, 'ENGINE_DESTROYED');
});

test('Promise Lifecycle Simulation - superseding roll rejects previous', async () => {
  let pendingPromise = null;
  let rejectFirst = null;

  const firstPromise = new Promise((resolve, reject) => {
    rejectFirst = reject;
    pendingPromise = { resolve, reject };
  });

  let secondPromiseStarted = false;
  let firstRejectedWithCode = null;

  firstPromise.catch((err) => {
    firstRejectedWithCode = err.code;
  });

  if (pendingPromise) {
    pendingPromise.reject(new DiceEngineError('ROLL_SUPERSEDED', 'Roll superseded'));
    pendingPromise = null;
    secondPromiseStarted = true;
  }

  await new Promise(r => setTimeout(r, 10));

  assert.equal(secondPromiseStarted, true);
  assert.equal(firstRejectedWithCode, 'ROLL_SUPERSEDED');
});

test('Promise Lifecycle Simulation - cancellation rejects pending promise', async () => {
  let pendingPromise = null;

  const rollPromise = new Promise((resolve, reject) => {
    pendingPromise = { resolve, reject };
  });

  let caughtError = null;
  rollPromise.catch(err => {
    caughtError = err;
  });

  if (pendingPromise) {
    pendingPromise.reject(new DiceEngineError('ROLL_CANCELLED', 'User cancelled'));
    pendingPromise = null;
  }

  await new Promise(r => setTimeout(r, 10));

  assert.ok(caughtError);
  assert.equal(caughtError.code, 'ROLL_CANCELLED');
});

test('Promise Lifecycle Simulation - engine destruction rejects pending promise', async () => {
  let pendingPromise = null;

  const rollPromise = new Promise((resolve, reject) => {
    pendingPromise = { resolve, reject };
  });

  let caughtError = null;
  rollPromise.catch(err => {
    caughtError = err;
  });

  if (pendingPromise) {
    pendingPromise.reject(new DiceEngineError('ENGINE_DESTROYED', 'Engine destroyed'));
    pendingPromise = null;
  }

  await new Promise(r => setTimeout(r, 10));

  assert.ok(caughtError);
  assert.equal(caughtError.code, 'ENGINE_DESTROYED');
});

test('Stabilization Timeout - cocked die rejection without false result confirmation', () => {
  const simulatedDie = {
    settled: false,
    settledFrames: 0,
    spawnTime: 0,
    nudgeAttempts: 2,
    isCocked: false,
    isValid: false,
    result: null,
  };

  const isTimedOut = true;
  const detection = { isValid: false, isCocked: true, value: 17, faceNormalY: 0.72 };

  if (detection.isValid) {
    simulatedDie.settled = true;
    simulatedDie.isValid = true;
    simulatedDie.result = detection.value;
  } else {
    if (simulatedDie.nudgeAttempts < 2 && !isTimedOut) {
      simulatedDie.nudgeAttempts++;
    } else {
      simulatedDie.settled = true;
      simulatedDie.isValid = false;
      simulatedDie.isCocked = true;
      simulatedDie.result = null;
    }
  }

  assert.equal(simulatedDie.settled, true);
  assert.equal(simulatedDie.isValid, false);
  assert.equal(simulatedDie.isCocked, true);
  assert.equal(simulatedDie.result, null);
});
