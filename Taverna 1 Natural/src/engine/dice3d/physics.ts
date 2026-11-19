import * as CANNON from 'cannon-es';

export interface TrayDimensions {
  width: number;
  depth: number;
  wallHeight: number;
}

export class DicePhysicsWorld {
  public world: CANNON.World;
  public diceMaterial: CANNON.Material;
  public floorMaterial: CANNON.Material;
  public wallMaterial: CANNON.Material;

  private floorBody: CANNON.Body | null = null;
  private wallBodies: CANNON.Body[] = [];
  private ceilingBody: CANNON.Body | null = null;

  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -32, 0);
    this.world.allowSleep = true;

    this.diceMaterial = new CANNON.Material('dice');
    this.floorMaterial = new CANNON.Material('floor');
    this.wallMaterial = new CANNON.Material('wall');

    const diceFloorContact = new CANNON.ContactMaterial(this.diceMaterial, this.floorMaterial, {
      friction: 0.55,
      restitution: 0.28,
      contactEquationStiffness: 1e7,
      contactEquationRelaxation: 3.0,
    });

    const diceDiceContact = new CANNON.ContactMaterial(this.diceMaterial, this.diceMaterial, {
      friction: 0.4,
      restitution: 0.3,
      contactEquationStiffness: 1e7,
      contactEquationRelaxation: 3.0,
    });

    const diceWallContact = new CANNON.ContactMaterial(this.diceMaterial, this.wallMaterial, {
      friction: 0.25,
      restitution: 0.38,
      contactEquationStiffness: 1e7,
      contactEquationRelaxation: 3.0,
    });

    this.world.addContactMaterial(diceFloorContact);
    this.world.addContactMaterial(diceDiceContact);
    this.world.addContactMaterial(diceWallContact);
  }

  setupTray(dimensions: TrayDimensions) {
    if (this.floorBody) this.world.removeBody(this.floorBody);
    for (const w of this.wallBodies) this.world.removeBody(w);
    if (this.ceilingBody) this.world.removeBody(this.ceilingBody);

    this.wallBodies = [];

    const hw = dimensions.width / 2;
    const hd = dimensions.depth / 2;
    const physWallHeight = 16.0;
    const hh = physWallHeight / 2;
    const thickness = 2.0;

    const floorShape = new CANNON.Box(new CANNON.Vec3(hw + thickness * 2, 1.0, hd + thickness * 2));
    this.floorBody = new CANNON.Body({ mass: 0, material: this.floorMaterial });
    this.floorBody.addShape(floorShape);
    this.floorBody.position.set(0, -1.0, 0);
    this.world.addBody(this.floorBody);

    const wallNorth = new CANNON.Body({ mass: 0, material: this.wallMaterial });
    wallNorth.addShape(new CANNON.Box(new CANNON.Vec3(hw + thickness * 2, hh, thickness / 2)));
    wallNorth.position.set(0, hh, -hd - thickness / 2);
    this.world.addBody(wallNorth);
    this.wallBodies.push(wallNorth);

    const wallSouth = new CANNON.Body({ mass: 0, material: this.wallMaterial });
    wallSouth.addShape(new CANNON.Box(new CANNON.Vec3(hw + thickness * 2, hh, thickness / 2)));
    wallSouth.position.set(0, hh, hd + thickness / 2);
    this.world.addBody(wallSouth);
    this.wallBodies.push(wallSouth);

    const wallEast = new CANNON.Body({ mass: 0, material: this.wallMaterial });
    wallEast.addShape(new CANNON.Box(new CANNON.Vec3(thickness / 2, hh, hd + thickness * 2)));
    wallEast.position.set(hw + thickness / 2, hh, 0);
    this.world.addBody(wallEast);
    this.wallBodies.push(wallEast);

    const wallWest = new CANNON.Body({ mass: 0, material: this.wallMaterial });
    wallWest.addShape(new CANNON.Box(new CANNON.Vec3(thickness / 2, hh, hd + thickness * 2)));
    wallWest.position.set(-hw - thickness / 2, hh, 0);
    this.world.addBody(wallWest);
    this.wallBodies.push(wallWest);

    const ceilingShape = new CANNON.Box(new CANNON.Vec3(hw + thickness * 2, 1.0, hd + thickness * 2));
    this.ceilingBody = new CANNON.Body({ mass: 0, material: this.wallMaterial });
    this.ceilingBody.addShape(ceilingShape);
    this.ceilingBody.position.set(0, physWallHeight + 1.0, 0);
    this.world.addBody(this.ceilingBody);
  }

  createDieBody(shape: CANNON.Shape, mass: number = 1.0): CANNON.Body {
    const body = new CANNON.Body({
      mass,
      shape,
      material: this.diceMaterial,
      linearDamping: 0.2,
      angularDamping: 0.22,
      allowSleep: true,
      sleepSpeedLimit: 0.14,
      sleepTimeLimit: 0.35,
    });
    return body;
  }

  step(dt: number) {
    this.world.step(1 / 60, dt, 5);
  }

  destroy() {
    if (this.floorBody) this.world.removeBody(this.floorBody);
    for (const w of this.wallBodies) this.world.removeBody(w);
    if (this.ceilingBody) this.world.removeBody(this.ceilingBody);
  }
}
