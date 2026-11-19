import * as THREE from 'three';
import { DiceTheme } from './types.js';

interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  foreground: string;
  accent: string;
  border: string;
  metalness: number;
  roughness: number;
}

const THEME_PRESETS: Record<DiceTheme, ThemeColors> = {
  obsidian: {
    background: '#181622',
    backgroundSecondary: '#0d0c14',
    foreground: '#f3f4f6',
    accent: '#a855f7',
    border: '#3b2f52',
    metalness: 0.25,
    roughness: 0.28,
  },
  gold: {
    background: '#241b10',
    backgroundSecondary: '#140e08',
    foreground: '#fef08a',
    accent: '#f59e0b',
    border: '#b45309',
    metalness: 0.65,
    roughness: 0.2,
  },
  amethyst: {
    background: '#281338',
    backgroundSecondary: '#150a1e',
    foreground: '#f3e8ff',
    accent: '#d8b4fe',
    border: '#6b21a8',
    metalness: 0.35,
    roughness: 0.18,
  },
  blood: {
    background: '#2b0f12',
    backgroundSecondary: '#160608',
    foreground: '#fee2e2',
    accent: '#ef4444',
    border: '#991b1b',
    metalness: 0.2,
    roughness: 0.32,
  },
};

export class DiceMaterialFactory {
  private static textureCache = new Map<string, THREE.CanvasTexture>();

  static getThemeConfig(theme: DiceTheme): ThemeColors {
    return THEME_PRESETS[theme] || THEME_PRESETS.obsidian;
  }

  static createFaceTexture(
    value: string | number,
    theme: DiceTheme,
    shape: 'triangle' | 'square' | 'pentagon' | 'circle' | 'kite' = 'triangle'
  ): THREE.CanvasTexture {
    const text = String(value);
    const cacheKey = `${theme}_${shape}_${text}`;

    const cached = this.textureCache.get(cacheKey);
    if (cached) return cached;

    const size = 512;
    if (typeof document === 'undefined') {
      const texture = new THREE.CanvasTexture();
      this.textureCache.set(cacheKey, texture);
      return texture;
    }
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return new THREE.CanvasTexture(canvas);
    }

    const cfg = this.getThemeConfig(theme);

    const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.65);
    grad.addColorStop(0, cfg.background);
    grad.addColorStop(1, cfg.backgroundSecondary);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.translate(size / 2, size / 2);

    ctx.strokeStyle = cfg.border;
    ctx.lineWidth = 14;
    ctx.fillStyle = cfg.background;

    if (shape === 'triangle') {
      ctx.beginPath();
      const r = size * 0.42;
      for (let i = 0; i < 3; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    } else if (shape === 'pentagon') {
      ctx.beginPath();
      const r = size * 0.42;
      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    } else if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape === 'kite') {
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.42);
      ctx.lineTo(size * 0.36, size * 0.04);
      ctx.lineTo(0, size * 0.42);
      ctx.lineTo(-size * 0.36, size * 0.04);
      ctx.closePath();
      ctx.stroke();
    } else {
      ctx.strokeRect(-size * 0.38, -size * 0.38, size * 0.76, size * 0.76);
    }

    ctx.shadowColor = cfg.accent;
    ctx.shadowBlur = 18;
    ctx.fillStyle = cfg.foreground;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSize = text.length >= 3 ? 120 : text.length === 2 ? 140 : 180;
    ctx.font = `bold ${fontSize}px "Spectral", "Cinzel", serif`;
    ctx.fillText(text, 0, 0);

    if (text === '6' || text === '9') {
      ctx.beginPath();
      ctx.arc(0, fontSize * 0.48, 12, 0, Math.PI * 2);
      ctx.fillStyle = cfg.accent;
      ctx.fill();
    }

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    this.textureCache.set(cacheKey, texture);
    return texture;
  }

  static createMaterial(
    value: string | number,
    theme: DiceTheme,
    shape: 'triangle' | 'square' | 'pentagon' | 'circle' | 'kite' = 'triangle'
  ): THREE.MeshStandardMaterial {
    const cfg = this.getThemeConfig(theme);
    const texture = this.createFaceTexture(value, theme, shape);

    return new THREE.MeshStandardMaterial({
      map: texture,
      color: 0xffffff,
      roughness: cfg.roughness,
      metalness: cfg.metalness,
    });
  }

  static createTrayFloorMaterial(): THREE.MeshStandardMaterial {
    if (typeof document === 'undefined') {
      return new THREE.MeshStandardMaterial({
        color: 0x110f17,
        roughness: 0.88,
        metalness: 0.05,
      });
    }
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#110f17';
      ctx.fillRect(0, 0, 512, 512);

      const grad = ctx.createRadialGradient(256, 256, 80, 256, 256, 320);
      grad.addColorStop(0, '#231c33');
      grad.addColorStop(1, '#0e0c14');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
      ctx.lineWidth = 4;
      ctx.strokeRect(32, 32, 448, 448);
      ctx.strokeRect(40, 40, 432, 432);

      ctx.beginPath();
      ctx.moveTo(256, 40);
      ctx.lineTo(256, 472);
      ctx.moveTo(40, 256);
      ctx.lineTo(472, 256);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.88,
      metalness: 0.05,
    });
  }

  static createTrayWallMaterial(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0x171420,
      roughness: 0.6,
      metalness: 0.25,
    });
  }
}
