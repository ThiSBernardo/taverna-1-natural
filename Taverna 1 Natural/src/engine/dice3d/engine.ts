import * as THREE from 'three';
import { 
  DiceType3D, 
  DiceTheme, 
  RollMode3D, 
  DieInstance, 
  SingleDieSettledResult, 
  RollSettledResult3D, 
  Dice3DEngineOptions,
  PercentilePairResult,
  DiceEngineError
} from './types.js';
import { DiceGeometryBuilder } from './geometries.js';
import { DiceMaterialFactory } from './materials.js';
import { DicePhysicsWorld, TrayDimensions } from './physics.js';
import { FaceDetector } from './face-detector.js';

export class Dice3DEngine {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private physics: DicePhysicsWorld;

  private activeDice: DieInstance[] = [];
  private isRolling = false;
  private animFrameId: number | null = null;
  private lastTime = 0;

  private currentTheme: DiceTheme = 'obsidian';
  private currentMode: RollMode3D = 'normal';
  private currentFormula = '';
  private rollStartTime = 0;

  private pendingRoll: {
    resolve: (result: RollSettledResult3D) => void;
    reject: (error: DiceEngineError) => void;
  } | null = null;

  private options: Dice3DEngineOptions;
  private trayMeshGroup: THREE.Group | null = null;

  private readonly trayDimensions: TrayDimensions = {
    width: 22,
    depth: 16,
    wallHeight: 3.5,
  };

  private totalNudgesApplied = 0;

  constructor(canvas: HTMLCanvasElement, options: Dice3DEngineOptions = {}) {
    this.canvas = canvas;
    this.options = options;
    if (options.theme) {
      this.currentTheme = options.theme;
    }

    this.scene = new THREE.Scene();
    if (!options.transparent) {
      this.scene.background = new THREE.Color(0x0c0b11);
    }

    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 500;

    this.camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    this.camera.position.set(0, 20, 6.5);
    this.camera.lookAt(0, 0, -0.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: !!options.transparent,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = options.shadows !== false;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.physics = new DicePhysicsWorld();
    this.physics.setupTray(this.trayDimensions);

    this.setupLighting();
    this.setupTrayVisuals();

    this.animate = this.animate.bind(this);
    this.startLoop();
  }

  get isBusy(): boolean {
    return this.isRolling || this.pendingRoll !== null;
  }

  setTheme(theme: DiceTheme) {
    this.currentTheme = theme;
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x281a38, 1.4);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 3.4);
    keyLight.position.set(10, 24, 12);
    keyLight.castShadow = this.options.shadows !== false;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 60;
    const d = 16;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0008;
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9333ea, 2.0);
    rimLight.position.set(-14, 16, -10);
    this.scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xd8b4fe, 0.8, 30);
    fillLight.position.set(0, 8, 0);
    this.scene.add(fillLight);
  }

  private setupTrayVisuals() {
    if (this.trayMeshGroup) {
      this.scene.remove(this.trayMeshGroup);
    }

    this.trayMeshGroup = new THREE.Group();
    const { width, depth, wallHeight } = this.trayDimensions;

    const floorGeo = new THREE.PlaneGeometry(width, depth);

    if (this.options.transparent) {
      const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
      const floorMesh = new THREE.Mesh(floorGeo, shadowMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.y = 0.01;
      floorMesh.receiveShadow = true;
      this.trayMeshGroup.add(floorMesh);
    } else {
      const floorMat = DiceMaterialFactory.createTrayFloorMaterial();
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.y = 0.01;
      floorMesh.receiveShadow = true;
      this.trayMeshGroup.add(floorMesh);

      const wallMat = DiceMaterialFactory.createTrayWallMaterial();
      const thickness = 0.9;

      const northGeo = new THREE.BoxGeometry(width + thickness * 2, wallHeight, thickness);
      const northMesh = new THREE.Mesh(northGeo, wallMat);
      northMesh.position.set(0, wallHeight / 2, -depth / 2 - thickness / 2);
      northMesh.castShadow = true;
      northMesh.receiveShadow = true;
      this.trayMeshGroup.add(northMesh);

      const southMesh = northMesh.clone();
      southMesh.position.set(0, wallHeight / 2, depth / 2 + thickness / 2);
      this.trayMeshGroup.add(southMesh);

      const eastGeo = new THREE.BoxGeometry(thickness, wallHeight, depth + thickness * 2);
      const eastMesh = new THREE.Mesh(eastGeo, wallMat);
      eastMesh.position.set(width / 2 + thickness / 2, wallHeight / 2, 0);
      eastMesh.castShadow = true;
      eastMesh.receiveShadow = true;
      this.trayMeshGroup.add(eastMesh);

      const westMesh = eastMesh.clone();
      westMesh.position.set(-width / 2 - thickness / 2, wallHeight / 2, 0);
      this.trayMeshGroup.add(westMesh);
    }

    this.scene.add(this.trayMeshGroup);
  }

  resize(width: number, height: number) {
    if (width <= 0 || height <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  cancelRoll(reason?: string) {
    if (this.pendingRoll) {
      const reject = this.pendingRoll.reject;
      this.pendingRoll = null;
      this.isRolling = false;
      if (this.options.onStatusChange) {
        this.options.onStatusChange('cancelled');
      }
      if (this.options.onRollCancelled) {
        this.options.onRollCancelled(reason);
      }
      reject(new DiceEngineError('ROLL_CANCELLED', reason || 'Roll was cancelled.'));
    }
  }

  clearDice() {
    if (this.pendingRoll) {
      const reject = this.pendingRoll.reject;
      this.pendingRoll = null;
      this.isRolling = false;
      if (this.options.onStatusChange) {
        this.options.onStatusChange('idle');
      }
      reject(new DiceEngineError('ROLL_CLEARED', 'Dice cleared while rolling.'));
    }

    for (const die of this.activeDice) {
      this.scene.remove(die.mesh);
      die.mesh.geometry.dispose();
      this.physics.world.removeBody(die.body);
    }
    this.activeDice = [];
    this.isRolling = false;
  }

  async roll(
    diceRequests: Array<{ type: DiceType3D; count: number }>,
    options: { mode?: RollMode3D; theme?: DiceTheme } = {}
  ): Promise<RollSettledResult3D> {
    if (this.pendingRoll) {
      const prevReject = this.pendingRoll.reject;
      this.pendingRoll = null;
      prevReject(new DiceEngineError('ROLL_SUPERSEDED', 'A new roll was initiated before previous roll completed.'));
    }

    this.clearDiceInternal();
    this.isRolling = true;
    this.totalNudgesApplied = 0;
    this.currentMode = options.mode || 'normal';
    if (options.theme) {
      this.currentTheme = options.theme;
    }

    if (this.options.onStatusChange) {
      this.options.onStatusChange('rolling');
    }

    this.rollStartTime = performance.now();

    let totalDiceCount = 0;
    for (const req of diceRequests) {
      totalDiceCount += req.type === 'd100' ? req.count * 2 : req.count;
    }

    const formulaParts: string[] = [];
    let dieIdx = 0;

    for (const req of diceRequests) {
      const { type, count } = req;
      formulaParts.push(`${count}${type}`);

      for (let c = 0; c < count; c++) {
        if (type === 'd100') {
          this.spawnDie('d100', 'tens', dieIdx, totalDiceCount);
          dieIdx++;
          this.spawnDie('d10', 'units', dieIdx, totalDiceCount);
          dieIdx++;
        } else {
          this.spawnDie(type, 'standard', dieIdx, totalDiceCount);
          dieIdx++;
        }
      }
    }

    this.currentFormula = formulaParts.join(' + ');

    return new Promise<RollSettledResult3D>((resolve, reject) => {
      this.pendingRoll = { resolve, reject };
    });
  }

  private clearDiceInternal() {
    for (const die of this.activeDice) {
      this.scene.remove(die.mesh);
      die.mesh.geometry.dispose();
      this.physics.world.removeBody(die.body);
    }
    this.activeDice = [];
    this.isRolling = false;
  }

  private spawnDie(type: DiceType3D, role: 'standard' | 'tens' | 'units', dieIdx: number, totalDiceCount: number) {
    const id = `die-${type}-${role}-${dieIdx}-${Date.now()}`;
    const built = DiceGeometryBuilder.build(type, this.currentTheme, role);

    const mesh = new THREE.Mesh(built.geometry, built.materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const body = this.physics.createDieBody(built.cannonShape, 1.0);

    let spawnX = 0;
    let spawnZ = 2.5;

    if (totalDiceCount <= 1) {
      spawnX = (Math.random() - 0.5) * 4.0;
      spawnZ = 2.5 + (Math.random() - 0.5) * 1.5;
    } else {
      const horizontalSpan = Math.min(16.0, Math.max(5.0, (totalDiceCount - 1) * 2.2));
      const stepX = horizontalSpan / (totalDiceCount - 1);
      spawnX = ((dieIdx - (totalDiceCount - 1) / 2) * stepX) + (Math.random() - 0.5) * 0.5;
      spawnX = Math.max(-8.5, Math.min(8.5, spawnX));

      const row = dieIdx % 2;
      spawnZ = 2.5 + row * 1.8 + (Math.random() - 0.5) * 0.4;
    }

    const spawnY = 6.0 + (dieIdx % 3) * 0.6;
    body.position.set(spawnX, spawnY, spawnZ);

    let targetX = 0;
    let targetZ = -1.5;

    if (totalDiceCount <= 1) {
      targetX = (Math.random() - 0.5) * 3.0;
      targetZ = -1.5 + (Math.random() - 0.5) * 2.5;
    } else {
      targetX = (spawnX * 0.45) + (Math.random() - 0.5) * 3.0;
      targetX = Math.max(-8.0, Math.min(8.0, targetX));
      targetZ = -1.5 + ((dieIdx % 2 === 0 ? -1 : 1) * 1.2) + (Math.random() - 0.5) * 2.0;
      targetZ = Math.max(-6.0, Math.min(2.0, targetZ));
    }

    const impulseX = (targetX - spawnX) * (1.25 + Math.random() * 0.25);
    const impulseY = -3.5 - Math.random() * 2.0;
    const impulseZ = (targetZ - spawnZ) * (1.25 + Math.random() * 0.25);

    body.velocity.set(impulseX, impulseY, impulseZ);

    const u1 = Math.random();
    const u2 = Math.random();
    const u3 = Math.random();
    const sq1 = Math.sqrt(1 - u1);
    const sq2 = Math.sqrt(u1);
    body.quaternion.set(
      sq1 * Math.sin(2 * Math.PI * u2),
      sq1 * Math.cos(2 * Math.PI * u2),
      sq2 * Math.sin(2 * Math.PI * u3),
      sq2 * Math.cos(2 * Math.PI * u3)
    );
    mesh.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);

    const uAng = Math.random();
    const vAng = Math.random();
    const thetaAng = uAng * 2.0 * Math.PI;
    const phiAng = Math.acos(2.0 * vAng - 1.0);
    const angSpeed = 16.0 + Math.random() * 16.0;
    body.angularVelocity.set(
      Math.sin(phiAng) * Math.cos(thetaAng) * angSpeed,
      Math.sin(phiAng) * Math.sin(thetaAng) * angSpeed,
      Math.cos(phiAng) * angSpeed
    );

    this.scene.add(mesh);
    this.physics.world.addBody(body);

    this.activeDice.push({
      id,
      type,
      role,
      mesh,
      body,
      faceMappings: built.faceMappings,
      settled: false,
      settledFrames: 0,
      result: null,
      displayResult: null,
      spawnTime: performance.now(),
      nudgeAttempts: 0,
      wasRecovered: false,
      isCocked: false,
      isValid: false,
      lastPosition: new THREE.Vector3(),
      lastQuaternion: new THREE.Quaternion(),
    });
  }

  private checkSettledState(): boolean {
    if (!this.isRolling || this.activeDice.length === 0) return false;

    let allSettled = true;
    const maxNudges = this.options.maxNudgeAttempts ?? 3;
    const maxSimTime = this.options.maxSimulationTimeMs ?? 9500;

    for (const die of this.activeDice) {
      if (die.settled) continue;

      const isStationary = FaceDetector.isDieSettled(die);
      if (isStationary) {
        die.settledFrames++;
      } else {
        die.settledFrames = 0;
      }

      const elapsed = performance.now() - die.spawnTime;
      const isTimedOut = elapsed > maxSimTime;

      if (die.settledFrames >= 14 || isTimedOut) {
        const detection = FaceDetector.detectTopFace(die);

        if (detection.isValid) {
          die.settled = true;
          die.isValid = true;
          die.isCocked = false;
          die.result = detection.value;
          die.displayResult = detection.displayValue;
          if (die.nudgeAttempts > 0) {
            die.wasRecovered = true;
          }

          if (this.options.onDieSettled) {
            this.options.onDieSettled({
              id: die.id,
              type: die.type,
              role: die.role,
              value: detection.value,
              displayValue: detection.displayValue,
              isValid: true,
              isCocked: false,
              nudgesApplied: die.nudgeAttempts,
              wasRecovered: die.wasRecovered,
              faceNormalY: detection.faceNormalY,
              position: { x: die.body.position.x, y: die.body.position.y, z: die.body.position.z },
            });
          }
        } else {
          if (die.nudgeAttempts < maxNudges && !isTimedOut) {
            die.nudgeAttempts++;
            this.totalNudgesApplied++;

            let repulseX = (Math.random() - 0.5) * 1.5;
            let repulseZ = (Math.random() - 0.5) * 1.5;

            if (die.body.position.x > 7.5) repulseX -= 2.0;
            else if (die.body.position.x < -7.5) repulseX += 2.0;

            if (die.body.position.z > 5.5) repulseZ -= 2.0;
            else if (die.body.position.z < -5.5) repulseZ += 2.0;

            for (const other of this.activeDice) {
              if (other.id === die.id) continue;
              const dx = die.body.position.x - other.body.position.x;
              const dz = die.body.position.z - other.body.position.z;
              const distSq = dx * dx + dz * dz;
              if (distSq < 6.0 && distSq > 0.001) {
                const dist = Math.sqrt(distSq);
                repulseX += (dx / dist) * 1.8;
                repulseZ += (dz / dist) * 1.8;
                other.body.wakeUp();
                other.settled = false;
                other.settledFrames = 0;
              }
            }

            const pushLen = Math.sqrt(repulseX * repulseX + repulseZ * repulseZ);
            if (pushLen > 0.01) {
              repulseX = (repulseX / pushLen) * 2.2;
              repulseZ = (repulseZ / pushLen) * 2.2;
            }

            die.settledFrames = 0;
            die.body.wakeUp();
            die.body.velocity.set(repulseX, 3.0 + Math.random() * 0.8, repulseZ);

            const uNudge = Math.random();
            const vNudge = Math.random();
            const thetaNudge = uNudge * 2.0 * Math.PI;
            const phiNudge = Math.acos(2.0 * vNudge - 1.0);
            const nudgeSpeed = 14.0 + Math.random() * 12.0;
            die.body.angularVelocity.set(
              Math.sin(phiNudge) * Math.cos(thetaNudge) * nudgeSpeed,
              Math.sin(phiNudge) * Math.sin(thetaNudge) * nudgeSpeed,
              Math.cos(phiNudge) * nudgeSpeed
            );

            if (this.options.onNudgeApplied) {
              this.options.onNudgeApplied(die.id, die.nudgeAttempts, this.totalNudgesApplied);
            }

            allSettled = false;
            continue;
          } else {
            die.settled = true;
            die.isValid = false;
            die.isCocked = true;
            die.result = null;
            die.displayResult = null;

            if (this.options.onDieSettled) {
              this.options.onDieSettled({
                id: die.id,
                type: die.type,
                role: die.role,
                value: 0,
                displayValue: '?',
                isValid: false,
                isCocked: true,
                nudgesApplied: die.nudgeAttempts,
                wasRecovered: false,
                faceNormalY: detection.faceNormalY,
                position: { x: die.body.position.x, y: die.body.position.y, z: die.body.position.z },
              });
            }
          }
        }
      } else {
        allSettled = false;
      }
    }

    return allSettled;
  }

  private finishRoll() {
    this.isRolling = false;
    const settledTimeMs = Math.round(performance.now() - this.rollStartTime);

    const hasCockedDice = this.activeDice.some(d => d.isCocked || !d.isValid || d.result === null);
    const recoveredDiceCount = this.activeDice.filter(d => d.wasRecovered && d.isValid).length;

    const dieResults: SingleDieSettledResult[] = this.activeDice.map(die => {
      const detection = FaceDetector.detectTopFace(die);
      return {
        id: die.id,
        type: die.type,
        role: die.role,
        value: die.result !== null ? die.result : 0,
        displayValue: die.displayResult !== null ? die.displayResult : '?',
        isValid: die.isValid,
        isCocked: die.isCocked,
        nudgesApplied: die.nudgeAttempts,
        wasRecovered: die.wasRecovered,
        faceNormalY: detection.faceNormalY,
        position: { x: die.body.position.x, y: die.body.position.y, z: die.body.position.z },
      };
    });

    if (hasCockedDice) {
      const failedResult: RollSettledResult3D = {
        total: 0,
        dice: dieResults,
        mode: this.currentMode,
        formula: this.currentFormula,
        isCritical: false,
        isFumble: false,
        settledTimeMs,
        isValid: false,
        hasCockedDice: true,
        recoveredDiceCount,
        totalNudgesApplied: this.totalNudgesApplied,
      };

      if (this.options.onRollSettled) {
        this.options.onRollSettled(failedResult);
      }

      if (this.options.onStatusChange) {
        this.options.onStatusChange('cocked');
      }

      const error = new DiceEngineError('DICE_COCKED', 'One or more dice remained cocked and could not produce a valid face.');
      if (this.options.onRollError) {
        this.options.onRollError(error);
      }

      if (this.pendingRoll) {
        const reject = this.pendingRoll.reject;
        this.pendingRoll = null;
        reject(error);
      }
      return;
    }

    const standardDice = dieResults.filter(d => d.role === 'standard');
    if (this.currentMode === 'vantagem' && standardDice.length === 2 && standardDice[0].type === 'd20' && standardDice[1].type === 'd20') {
      if (standardDice[0].value >= standardDice[1].value) {
        standardDice[1].dropped = true;
      } else {
        standardDice[0].dropped = true;
      }
    } else if (this.currentMode === 'desvantagem' && standardDice.length === 2 && standardDice[0].type === 'd20' && standardDice[1].type === 'd20') {
      if (standardDice[0].value <= standardDice[1].value) {
        standardDice[1].dropped = true;
      } else {
        standardDice[0].dropped = true;
      }
    }

    const percentilePairs: PercentilePairResult[] = [];
    const tensDice = dieResults.filter(d => d.role === 'tens');
    const unitsDice = dieResults.filter(d => d.role === 'units');
    const pairCount = Math.min(tensDice.length, unitsDice.length);

    for (let p = 0; p < pairCount; p++) {
      const tensVal = tensDice[p].value;
      const unitsVal = unitsDice[p].value;
      const is100 = tensVal === 0 && unitsVal === 0;
      const pairTotal = is100 ? 100 : tensVal + unitsVal;
      percentilePairs.push({
        tens: tensVal,
        units: unitsVal,
        total: pairTotal,
        is100,
      });
    }

    let total = 0;
    let hasKeptD20 = false;
    let isCritical = false;
    let isFumble = false;

    for (const r of dieResults) {
      if (r.role === 'standard' && !r.dropped) {
        total += r.value;
        if (r.type === 'd20') {
          hasKeptD20 = true;
          if (r.value === 20) isCritical = true;
          if (r.value === 1 && !isCritical) isFumble = true;
        }
      }
    }

    for (const pair of percentilePairs) {
      total += pair.total;
    }

    const finalResult: RollSettledResult3D = {
      total,
      dice: dieResults,
      mode: this.currentMode,
      formula: this.currentFormula,
      isCritical,
      isFumble,
      settledTimeMs,
      isValid: true,
      hasCockedDice: false,
      recoveredDiceCount,
      totalNudgesApplied: this.totalNudgesApplied,
      percentilePairs: percentilePairs.length > 0 ? percentilePairs : undefined,
    };

    if (this.options.onStatusChange) {
      this.options.onStatusChange('settled');
    }

    if (this.options.onRollSettled) {
      this.options.onRollSettled(finalResult);
    }

    if (this.pendingRoll) {
      const resolve = this.pendingRoll.resolve;
      this.pendingRoll = null;
      resolve(finalResult);
    }
  }

  private animate(time: number) {
    this.animFrameId = requestAnimationFrame(this.animate);

    if (this.lastTime === 0) {
      this.lastTime = time;
      return;
    }

    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    this.physics.step(dt);

    for (const die of this.activeDice) {
      if (die.body.position.y < -3 || Math.abs(die.body.position.x) > 16 || Math.abs(die.body.position.z) > 13) {
        die.body.position.set(0, 4, 0);
        die.body.velocity.set(0, -2, 0);
      }

      die.mesh.position.set(die.body.position.x, die.body.position.y, die.body.position.z);
      die.mesh.quaternion.set(die.body.quaternion.x, die.body.quaternion.y, die.body.quaternion.z, die.body.quaternion.w);
    }

    if (this.isRolling) {
      const allDone = this.checkSettledState();
      if (allDone) {
        this.finishRoll();
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  private startLoop() {
    this.lastTime = performance.now();
    this.animFrameId = requestAnimationFrame(this.animate);
  }

  destroy() {
    if (this.pendingRoll) {
      const reject = this.pendingRoll.reject;
      this.pendingRoll = null;
      this.isRolling = false;
      reject(new DiceEngineError('ENGINE_DESTROYED', 'Dice engine destroyed.'));
    }

    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.clearDiceInternal();
    this.physics.destroy();
    this.renderer.dispose();
  }
}
