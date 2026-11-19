import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { DiceMaterialFactory } from './materials.js';
CANNON.ConvexPolyhedron.prototype.computeLocalAABB = function (aabbmin, aabbmax) {
    const vertices = this.vertices;
    aabbmin.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    aabbmax.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    for (let i = 0; i < vertices.length; i++) {
        const v = vertices[i];
        if (v.x < aabbmin.x)
            aabbmin.x = v.x;
        if (v.x > aabbmax.x)
            aabbmax.x = v.x;
        if (v.y < aabbmin.y)
            aabbmin.y = v.y;
        if (v.y > aabbmax.y)
            aabbmax.y = v.y;
        if (v.z < aabbmin.z)
            aabbmin.z = v.z;
        if (v.z > aabbmax.z)
            aabbmax.z = v.z;
    }
};
function ensureCCW(vertices, faces) {
    return faces.map(face => {
        if (face.length < 3)
            return face;
        const v0 = vertices[face[0]];
        const v1 = vertices[face[1]];
        const v2 = vertices[face[2]];
        const edge1 = new CANNON.Vec3();
        const edge2 = new CANNON.Vec3();
        v1.vsub(v0, edge1);
        v2.vsub(v0, edge2);
        const normal = new CANNON.Vec3();
        edge1.cross(edge2, normal);
        const centroid = new CANNON.Vec3();
        for (const idx of face) {
            centroid.vadd(vertices[idx], centroid);
        }
        centroid.scale(1 / face.length, centroid);
        if (normal.dot(centroid) < 0) {
            return [...face].reverse();
        }
        return face;
    });
}
function computeTriangleNormal(a, b, c) {
    const ab = new THREE.Vector3().subVectors(b, a);
    const ac = new THREE.Vector3().subVectors(c, a);
    return new THREE.Vector3().crossVectors(ab, ac).normalize();
}
function computeOutwardTriangleNormal(a, b, c) {
    const norm = computeTriangleNormal(a, b, c);
    const centroid = new THREE.Vector3().add(a).add(b).add(c).multiplyScalar(1 / 3);
    if (norm.dot(centroid) < 0) {
        norm.negate();
    }
    return norm;
}
export class DiceGeometryBuilder {
    static build(type, theme, role = 'standard') {
        switch (type) {
            case 'd2':
                return this.buildD2(theme);
            case 'd4':
                return this.buildD4(theme);
            case 'd6':
                return this.buildD6(theme);
            case 'd8':
                return this.buildD8(theme);
            case 'd10':
                return this.buildD10(theme, role === 'tens' ? 'tens' : role === 'units' ? 'units' : 'standard');
            case 'd100':
                return this.buildD10(theme, 'tens');
            case 'd12':
                return this.buildD12(theme);
            case 'd20':
            default:
                return this.buildD20(theme);
        }
    }
    static buildD2(theme) {
        const radius = 1.35;
        const height = 0.28;
        const segments = 24;
        const geometry = new THREE.CylinderGeometry(radius, radius, height, segments);
        const matSide = new THREE.MeshStandardMaterial({
            color: theme === 'gold' ? 0xd97706 : theme === 'blood' ? 0x7f1d1d : 0x2e2c38,
            metalness: 0.8,
            roughness: 0.3,
        });
        const matTop = DiceMaterialFactory.createMaterial('1', theme, 'circle');
        const matBottom = DiceMaterialFactory.createMaterial('2', theme, 'circle');
        const materials = [matSide, matTop, matBottom];
        const cannonShape = new CANNON.Cylinder(radius, radius, height, 16);
        const faceMappings = [
            { value: 1, displayValue: '1', normal: new THREE.Vector3(0, 1, 0) },
            { value: 2, displayValue: '2', normal: new THREE.Vector3(0, -1, 0) },
        ];
        return { geometry, materials, cannonShape, faceMappings, radius };
    }
    static buildD4(theme) {
        const radius = 1.35;
        const s = radius / Math.sqrt(3);
        const v = [
            new THREE.Vector3(s, s, s),
            new THREE.Vector3(-s, -s, s),
            new THREE.Vector3(-s, s, -s),
            new THREE.Vector3(s, -s, -s),
        ];
        const faceIndices = [
            [0, 2, 1],
            [0, 3, 2],
            [0, 1, 3],
            [1, 2, 3],
        ];
        const values = [1, 2, 3, 4];
        const positions = [];
        const normals = [];
        const uvs = [];
        const materials = [];
        const faceMappings = [];
        const uvCoords = [
            [0.5, 0.9],
            [0.1, 0.15],
            [0.9, 0.15],
        ];
        const cannonVerts = v.map(p => new CANNON.Vec3(p.x, p.y, p.z));
        const cannonFaces = ensureCCW(cannonVerts, faceIndices);
        const cannonShape = new CANNON.ConvexPolyhedron({ vertices: cannonVerts, faces: cannonFaces });
        for (let f = 0; f < faceIndices.length; f++) {
            const idx = faceIndices[f];
            const p0 = v[idx[0]];
            const p1 = v[idx[1]];
            const p2 = v[idx[2]];
            const norm = computeOutwardTriangleNormal(p0, p1, p2);
            faceMappings.push({ value: values[f], displayValue: String(values[f]), normal: norm.clone() });
            materials.push(DiceMaterialFactory.createMaterial(values[f], theme, 'triangle'));
            positions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
            normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z);
            uvs.push(uvCoords[0][0], uvCoords[0][1], uvCoords[1][0], uvCoords[1][1], uvCoords[2][0], uvCoords[2][1]);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        for (let f = 0; f < faceIndices.length; f++) {
            geometry.addGroup(f * 3, 3, f);
        }
        return { geometry, materials, cannonShape, faceMappings, radius };
    }
    static buildD6(theme) {
        const size = 1.35;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const faceValues = [2, 5, 1, 6, 3, 4];
        const materials = faceValues.map(val => DiceMaterialFactory.createMaterial(val, theme, 'square'));
        const h = size / 2;
        const cannonShape = new CANNON.Box(new CANNON.Vec3(h, h, h));
        const faceMappings = [
            { value: 2, displayValue: '2', normal: new THREE.Vector3(1, 0, 0) },
            { value: 5, displayValue: '5', normal: new THREE.Vector3(-1, 0, 0) },
            { value: 1, displayValue: '1', normal: new THREE.Vector3(0, 1, 0) },
            { value: 6, displayValue: '6', normal: new THREE.Vector3(0, -1, 0) },
            { value: 3, displayValue: '3', normal: new THREE.Vector3(0, 0, 1) },
            { value: 4, displayValue: '4', normal: new THREE.Vector3(0, 0, -1) },
        ];
        return { geometry, materials, cannonShape, faceMappings, radius: size * 0.86 };
    }
    static buildD8(theme) {
        const radius = 1.35;
        const v = [
            new THREE.Vector3(radius, 0, 0),
            new THREE.Vector3(-radius, 0, 0),
            new THREE.Vector3(0, radius, 0),
            new THREE.Vector3(0, -radius, 0),
            new THREE.Vector3(0, 0, radius),
            new THREE.Vector3(0, 0, -radius),
        ];
        const faceIndices = [
            [2, 4, 0],
            [2, 0, 5],
            [2, 5, 1],
            [2, 1, 4],
            [3, 0, 4],
            [3, 5, 0],
            [3, 1, 5],
            [3, 4, 1],
        ];
        const values = [1, 2, 3, 4, 5, 6, 7, 8];
        const positions = [];
        const normals = [];
        const uvs = [];
        const materials = [];
        const faceMappings = [];
        const uvCoords = [
            [0.5, 0.9],
            [0.1, 0.15],
            [0.9, 0.15],
        ];
        const cannonVerts = v.map(p => new CANNON.Vec3(p.x, p.y, p.z));
        const cannonFaces = ensureCCW(cannonVerts, faceIndices);
        const cannonShape = new CANNON.ConvexPolyhedron({ vertices: cannonVerts, faces: cannonFaces });
        for (let f = 0; f < faceIndices.length; f++) {
            const idx = faceIndices[f];
            const p0 = v[idx[0]];
            const p1 = v[idx[1]];
            const p2 = v[idx[2]];
            const norm = computeOutwardTriangleNormal(p0, p1, p2);
            faceMappings.push({ value: values[f], displayValue: String(values[f]), normal: norm.clone() });
            materials.push(DiceMaterialFactory.createMaterial(values[f], theme, 'triangle'));
            positions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
            normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z);
            uvs.push(uvCoords[0][0], uvCoords[0][1], uvCoords[1][0], uvCoords[1][1], uvCoords[2][0], uvCoords[2][1]);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        for (let f = 0; f < faceIndices.length; f++) {
            geometry.addGroup(f * 3, 3, f);
        }
        return { geometry, materials, cannonShape, faceMappings, radius };
    }
    static buildD10(theme, variant = 'standard') {
        const radius = 1.35;
        const h = radius * 1.15;
        const s1 = Math.sin(Math.PI / 5);
        const s2 = Math.sin(2 * Math.PI / 5);
        const hEq = h * ((2 * s1 - s2) / (2 * s1 + s2));
        const rEq = radius * 0.95;
        const v = [];
        v.push(new THREE.Vector3(0, h, 0));
        v.push(new THREE.Vector3(0, -h, 0));
        for (let i = 0; i < 5; i++) {
            const a = (i * 2 * Math.PI) / 5;
            v.push(new THREE.Vector3(rEq * Math.cos(a), hEq, rEq * Math.sin(a)));
        }
        for (let i = 0; i < 5; i++) {
            const a = (i * 2 * Math.PI) / 5 + Math.PI / 5;
            v.push(new THREE.Vector3(rEq * Math.cos(a), -hEq, rEq * Math.sin(a)));
        }
        const kites = [];
        for (let i = 0; i < 5; i++) {
            kites.push([0, 2 + i, 7 + i, 2 + ((i + 1) % 5)]);
        }
        for (let i = 0; i < 5; i++) {
            kites.push([1, 7 + ((i + 1) % 5), 2 + ((i + 1) % 5), 7 + i]);
        }
        let displayStrings;
        let numericValues;
        if (variant === 'tens') {
            displayStrings = ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'];
            numericValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
        }
        else if (variant === 'units') {
            displayStrings = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            numericValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        }
        else {
            displayStrings = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            numericValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        }
        const positions = [];
        const normals = [];
        const uvs = [];
        const materials = [];
        const faceMappings = [];
        const cannonFacesTriangles = [];
        const cannonVerts = v.map(p => new CANNON.Vec3(p.x, p.y, p.z));
        for (let k = 0; k < kites.length; k++) {
            const [top, left, bot, right] = kites[k];
            const pTop = v[top];
            const pLeft = v[left];
            const pBot = v[bot];
            const pRight = v[right];
            const n1 = computeTriangleNormal(pTop, pLeft, pBot);
            const n2 = computeTriangleNormal(pTop, pBot, pRight);
            const avgNorm = new THREE.Vector3().addVectors(n1, n2).normalize();
            const centroid = new THREE.Vector3().add(pTop).add(pLeft).add(pBot).add(pRight).multiplyScalar(0.25);
            if (avgNorm.dot(centroid) < 0) {
                avgNorm.negate();
            }
            faceMappings.push({
                value: numericValues[k],
                displayValue: displayStrings[k],
                normal: avgNorm.clone(),
            });
            materials.push(DiceMaterialFactory.createMaterial(displayStrings[k], theme, 'kite'));
            positions.push(pTop.x, pTop.y, pTop.z, pLeft.x, pLeft.y, pLeft.z, pBot.x, pBot.y, pBot.z);
            normals.push(avgNorm.x, avgNorm.y, avgNorm.z, avgNorm.x, avgNorm.y, avgNorm.z, avgNorm.x, avgNorm.y, avgNorm.z);
            uvs.push(0.5, 0.95, 0.05, 0.4, 0.5, 0.05);
            positions.push(pTop.x, pTop.y, pTop.z, pBot.x, pBot.y, pBot.z, pRight.x, pRight.y, pRight.z);
            normals.push(avgNorm.x, avgNorm.y, avgNorm.z, avgNorm.x, avgNorm.y, avgNorm.z, avgNorm.x, avgNorm.y, avgNorm.z);
            uvs.push(0.5, 0.95, 0.5, 0.05, 0.95, 0.4);
            cannonFacesTriangles.push([top, left, bot], [top, bot, right]);
        }
        const fixedFaces = ensureCCW(cannonVerts, kites);
        const cannonShape = new CANNON.ConvexPolyhedron({ vertices: cannonVerts, faces: fixedFaces });
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        for (let f = 0; f < kites.length; f++) {
            geometry.addGroup(f * 6, 6, f);
        }
        return { geometry, materials, cannonShape, faceMappings, radius: h };
    }
    static buildD12(theme) {
        const radius = 1.35;
        const phi = (1 + Math.sqrt(5)) / 2;
        const a = radius / Math.sqrt(3);
        const b = a / phi;
        const c = a * phi;
        const v = [
            new THREE.Vector3(a, a, a), new THREE.Vector3(a, a, -a),
            new THREE.Vector3(a, -a, a), new THREE.Vector3(a, -a, -a),
            new THREE.Vector3(-a, a, a), new THREE.Vector3(-a, a, -a),
            new THREE.Vector3(-a, -a, a), new THREE.Vector3(-a, -a, -a),
            new THREE.Vector3(0, b, c), new THREE.Vector3(0, b, -c),
            new THREE.Vector3(0, -b, c), new THREE.Vector3(0, -b, -c),
            new THREE.Vector3(b, c, 0), new THREE.Vector3(b, -c, 0),
            new THREE.Vector3(-b, c, 0), new THREE.Vector3(-b, -c, 0),
            new THREE.Vector3(c, 0, b), new THREE.Vector3(c, 0, -b),
            new THREE.Vector3(-c, 0, b), new THREE.Vector3(-c, 0, -b),
        ];
        const pentagons = [
            [0, 8, 10, 2, 16],
            [0, 16, 17, 1, 12],
            [0, 12, 14, 4, 8],
            [8, 4, 18, 6, 10],
            [10, 6, 15, 13, 2],
            [2, 13, 3, 17, 16],
            [1, 17, 3, 11, 9],
            [1, 9, 5, 14, 12],
            [4, 14, 5, 19, 18],
            [6, 18, 19, 7, 15],
            [15, 7, 11, 3, 13],
            [7, 19, 5, 9, 11],
        ];
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const positions = [];
        const normals = [];
        const uvs = [];
        const materials = [];
        const faceMappings = [];
        const cannonTriangles = [];
        const cannonVerts = v.map(p => new CANNON.Vec3(p.x, p.y, p.z));
        for (let f = 0; f < pentagons.length; f++) {
            const pent = pentagons[f];
            const p0 = v[pent[0]];
            const p1 = v[pent[1]];
            const p2 = v[pent[2]];
            const p3 = v[pent[3]];
            const p4 = v[pent[4]];
            const norm = computeOutwardTriangleNormal(p0, p1, p2);
            faceMappings.push({ value: values[f], displayValue: String(values[f]), normal: norm.clone() });
            materials.push(DiceMaterialFactory.createMaterial(values[f], theme, 'pentagon'));
            const tris = [
                [p0, p1, p2],
                [p0, p2, p3],
                [p0, p3, p4],
            ];
            const pentUVs = [
                [0.5, 0.9],
                [0.1, 0.6],
                [0.25, 0.15],
                [0.75, 0.15],
                [0.9, 0.6],
            ];
            for (let t = 0; t < tris.length; t++) {
                const tri = tris[t];
                positions.push(tri[0].x, tri[0].y, tri[0].z, tri[1].x, tri[1].y, tri[1].z, tri[2].x, tri[2].y, tri[2].z);
                normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z);
            }
            uvs.push(pentUVs[0][0], pentUVs[0][1], pentUVs[1][0], pentUVs[1][1], pentUVs[2][0], pentUVs[2][1], pentUVs[0][0], pentUVs[0][1], pentUVs[2][0], pentUVs[2][1], pentUVs[3][0], pentUVs[3][1], pentUVs[0][0], pentUVs[0][1], pentUVs[3][0], pentUVs[3][1], pentUVs[4][0], pentUVs[4][1]);
            cannonTriangles.push([pent[0], pent[1], pent[2]], [pent[0], pent[2], pent[3]], [pent[0], pent[3], pent[4]]);
        }
        const fixedFaces = ensureCCW(cannonVerts, pentagons);
        const cannonShape = new CANNON.ConvexPolyhedron({ vertices: cannonVerts, faces: fixedFaces });
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        for (let f = 0; f < pentagons.length; f++) {
            geometry.addGroup(f * 9, 9, f);
        }
        return { geometry, materials, cannonShape, faceMappings, radius };
    }
    static buildD20(theme) {
        const radius = 1.4;
        const phi = (1 + Math.sqrt(5)) / 2;
        const s = radius / Math.sqrt(1 + phi * phi);
        const v = [
            new THREE.Vector3(-s, phi * s, 0),
            new THREE.Vector3(s, phi * s, 0),
            new THREE.Vector3(-s, -phi * s, 0),
            new THREE.Vector3(s, -phi * s, 0),
            new THREE.Vector3(0, -s, phi * s),
            new THREE.Vector3(0, s, phi * s),
            new THREE.Vector3(0, -s, -phi * s),
            new THREE.Vector3(0, s, -phi * s),
            new THREE.Vector3(phi * s, 0, -s),
            new THREE.Vector3(phi * s, 0, s),
            new THREE.Vector3(-phi * s, 0, -s),
            new THREE.Vector3(-phi * s, 0, s),
        ];
        const faceIndices = [
            [0, 11, 5],
            [0, 5, 1],
            [0, 1, 7],
            [0, 7, 10],
            [0, 10, 11],
            [1, 5, 9],
            [5, 11, 4],
            [11, 10, 2],
            [10, 7, 6],
            [7, 1, 8],
            [3, 9, 4],
            [3, 4, 2],
            [3, 2, 6],
            [3, 6, 8],
            [3, 8, 9],
            [4, 9, 5],
            [2, 4, 11],
            [6, 2, 10],
            [8, 6, 7],
            [9, 8, 1],
        ];
        const values = [20, 1, 19, 2, 18, 3, 17, 4, 16, 5, 15, 6, 14, 7, 13, 8, 12, 9, 11, 10];
        const positions = [];
        const normals = [];
        const uvs = [];
        const materials = [];
        const faceMappings = [];
        const uvCoords = [
            [0.5, 0.9],
            [0.1, 0.15],
            [0.9, 0.15],
        ];
        const cannonVerts = v.map(p => new CANNON.Vec3(p.x, p.y, p.z));
        const cannonFaces = ensureCCW(cannonVerts, faceIndices);
        const cannonShape = new CANNON.ConvexPolyhedron({ vertices: cannonVerts, faces: cannonFaces });
        for (let f = 0; f < faceIndices.length; f++) {
            const idx = faceIndices[f];
            const p0 = v[idx[0]];
            const p1 = v[idx[1]];
            const p2 = v[idx[2]];
            const norm = computeOutwardTriangleNormal(p0, p1, p2);
            faceMappings.push({ value: values[f], displayValue: String(values[f]), normal: norm.clone() });
            materials.push(DiceMaterialFactory.createMaterial(values[f], theme, 'triangle'));
            positions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
            normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z);
            uvs.push(uvCoords[0][0], uvCoords[0][1], uvCoords[1][0], uvCoords[1][1], uvCoords[2][0], uvCoords[2][1]);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        for (let f = 0; f < faceIndices.length; f++) {
            geometry.addGroup(f * 3, 3, f);
        }
        return { geometry, materials, cannonShape, faceMappings, radius };
    }
}
