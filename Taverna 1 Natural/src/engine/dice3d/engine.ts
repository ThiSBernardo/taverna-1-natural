import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { 
  DiceType3D, 
  DiceTheme, 
  RollMode3D, 
  DieInstance, 
  SingleDieSettledResult, 
  RollSettledResult3D, 
  Dice3DEngineOptions 
} from './types';
import { DiceGeometryBuilder } from './geometries';
import { DiceMaterialFactory } from './materials';
import { DicePhysicsWorld, TrayDimensions } from './physics';
import { FaceDetector } from './face-detector';

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
  private rollPromiseResolver: ((result: RollSettledResult3D) => void) | null = null;

  private options: Dice3DEngineOptions;
  private trayMeshGroup: THREE.Group | null = null;

  private readonly trayDimensions: TrayDimensions = {
    width: 22,
    depth: 16,
    wallHeight: 3.5,
  };

  constructor(canvas: HTMLCanvasElement, options: Dice3DEngineOptions = {}) {
    this.canvas = canvas;
    this.options = options;
    if (options.theme) {
      this.currentTheme = options.theme;
    }

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c0b11);

    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 500;

    this.camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    this.camera.position.set(0, 20, 6.5);
    this.camera.lookAt(0, 0, -0.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
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

    this.scene.add(this.trayMeshGroup);
  }

  resize(width: number, height: number) {
    if (width <= 0 || height <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  clearDice() {
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
    this.clearDice();
    this.isRolling = true;
    this.currentMode = options.mode || 'normal';
    if (options.theme) {
      this.currentTheme = options.theme;
    }

    if (this.options.onStatusChange) {
      this.options.onStatusChange('rolling');
    }

    this.rollStartTime = performance.now();

    const formulaParts: string[] = [];
    let dieIdx = 0;

    for (const req of diceRequests) {
      const { type, count } = req;
      formulaParts.push(`${count}${type}`);

      for (let c = 0; c < count; c++) {
        const id = `die-${type}-${dieIdx}-${Date.now()}`;
        const built = DiceGeometryBuilder.build(type, this.currentTheme);

        const mesh = new THREE.Mesh(built.geometry, built.materials);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const body = this.physics.createDieBody(built.cannonShape, 1.0);

        const spawnX = (Math.random() - 0.5) * 8;
        const spawnY = 5.5 + (dieIdx % 4) * 0.6;
        const spawnZ = 2.0 + Math.random() * 3.0;

        body.position.set(spawnX, spawnY, spawnZ);

        const targetX = (Math.random() - 0.5) * 3;
        const targetZ = -0.5 + (Math.random() - 0.5) * 2;
        const impulseX = (targetX - spawnX) * 1.3;
        const impulseY = -3.5 - Math.random() * 2.0;
        const impulseZ = (targetZ - spawnZ) * 1.4;

        body.velocity.set(impulseX, impulseY, impulseZ);

        const angSpeed = 18 + Math.random() * 14;
        body.angularVelocity.set(
          (Math.random() - 0.5) * angSpeed,
          (Math.random() - 0.5) * angSpeed,
          (Math.random() - 0.5) * angSpeed
        );

        this.scene.add(mesh);
        this.physics.world.addBody(body);

        this.activeDice.push({
          id,
          type,
          mesh,
          body,
          faceMappings: built.faceMappings,
          settled: false,
          settledFrames: 0,
          result: null,
          spawnTime: performance.now(),
          lastPosition: new THREE.Vector3(),
          lastQuaternion: new THREE.Quaternion(),
        });

        dieIdx++;
      }
    }

    this.currentFormula = formulaParts.join(' + ');

    return new Promise<RollSettledResult3D>((resolve) => {
      this.rollPromiseResolver = resolve;
    });
  }

  private checkSettledState(): boolean {
    if (!this.isRolling || this.activeDice.length === 0) return false;

    let allSettled = true;

    for (const die of this.activeDice) {
      if (die.settled) continue;

      const isStationary = FaceDetector.isDieSettled(die);
      if (isStationary) {
        die.settledFrames++;
      } else {
        die.settledFrames = 0;
      }

      const elapsed = performance.now() - die.spawnTime;
      const forceSettle = elapsed > 4500;

      if (die.settledFrames >= 14 || forceSettle) {
        const detection = FaceDetector.detectTopFace(die);

        if (detection.isCocked && !forceSettle) {
          die.body.angularVelocity.set(
            (Math.random() - 0.5) * 4,
            2 + Math.random() * 3,
            (Math.random() - 0.5) * 4
          );
          die.body.velocity.set((Math.random() - 0.5) * 1.5, 2, (Math.random() - 0.5) * 1.5);
          die.settledFrames = 0;
          allSettled = false;
          continue;
        }

        die.settled = true;
        die.result = detection.value;

        if (this.options.onDieSettled) {
          this.options.onDieSettled({
            id: die.id,
            type: die.type,
            value: detection.value,
            faceNormalY: detection.faceNormalY,
            position: { x: die.body.position.x, y: die.body.position.y, z: die.body.position.z },
          });
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

    const dieResults: SingleDieSettledResult[] = this.activeDice.map(die => {
      const detection = FaceDetector.detectTopFace(die);
      return {
        id: die.id,
        type: die.type,
        value: die.result !== null ? die.result : detection.value,
        faceNormalY: detection.faceNormalY,
        position: { x: die.body.position.x, y: die.body.position.y, z: die.body.position.z },
      };
    });

    if (this.currentMode === 'vantagem' && dieResults.length === 2 && dieResults[0].type === 'd20' && dieResults[1].type === 'd20') {
      if (dieResults[0].value >= dieResults[1].value) {
        dieResults[1].dropped = true;
      } else {
        dieResults[0].dropped = true;
      }
    } else if (this.currentMode === 'desvantagem' && dieResults.length === 2 && dieResults[0].type === 'd20' && dieResults[1].type === 'd20') {
      if (dieResults[0].value <= dieResults[1].value) {
        dieResults[1].dropped = true;
      } else {
        dieResults[0].dropped = true;
      }
    }

    let total = 0;
    let hasKeptD20 = false;
    let isCritical = false;
    let isFumble = false;

    for (const r of dieResults) {
      if (!r.dropped) {
        total += r.value;
        if (r.type === 'd20') {
          hasKeptD20 = true;
          if (r.value === 20) isCritical = true;
          if (r.value === 1 && !isCritical) isFumble = true;
        }
      }
    }

    const finalResult: RollSettledResult3D = {
      total,
      dice: dieResults,
      mode: this.currentMode,
      formula: this.currentFormula,
      isCritical,
      isFumble,
      settledTimeMs,
    };

    if (this.options.onStatusChange) {
      this.options.onStatusChange('settled');
    }

    if (this.options.onRollSettled) {
      this.options.onRollSettled(finalResult);
    }

    if (this.rollPromiseResolver) {
      this.rollPromiseResolver(finalResult);
      this.rollPromiseResolver = null;
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
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.clearDice();
    this.physics.destroy();
    this.renderer.dispose();
  }
}
