import * as THREE from 'three';
import { DiceTheme } from './types';

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

  static createFaceTexture(value: string | number, theme: DiceTheme, shape: 'triangle' | 'square' | 'pentagon' | 'circle' = 'triangle'): THREE.CanvasTexture {
    const text = String(value);
    const cacheKey = `${theme}_${shape}_${text}`;

    const cached = this.textureCache.get(cacheKey);
    if (cached) return cached;

    const size = 512;
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

  static createMaterial(value: string | number, theme: DiceTheme, shape: 'triangle' | 'square' | 'pentagon' | 'circle' = 'triangle'): THREE.MeshStandardMaterial {
    const cfg = this.getThemeConfig(theme);
    const texture = this.createFaceTexture(value, theme, shape);

    return new THREE.MeshStandardMaterial({
      map: texture,
      color: 0xffffff,
      roughness: cfg.roughness,
      metalness: cfg.metalness,
      bumpMap: texture,
      bumpScale: 0.02,
    });
  }

  static createTrayFloorMaterial(): THREE.MeshStandardMaterial {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.7);
      grad.addColorStop(0, '#15131d');
      grad.addColorStop(1, '#09080d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, size - 40, size - 40);
      ctx.strokeRect(35, 35, size - 70, size - 70);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.85,
      metalness: 0.1,
    });
  }

  static createTrayWallMaterial(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0x1a1824,
      roughness: 0.5,
      metalness: 0.35,
    });
  }
}
