export type RPGSystemId = 
  | 'ordem-paranormal'
  | 'ordem-paranormal-2'
  | 'dnd-5e-2014'
  | 'tormenta-20'
  | 'fabula-ultima'
  | 'slasher'
  | 'feiticeiros-maldicoes-2-5'
  | 'feiticeiros-maldicoes-2-0'
  | 'ficha-universal';

export interface RPGSystemInfo {
  id: RPGSystemId;
  name: string;
  badge: string;
  isOfficial: boolean;
  coverImage: string;
  description: string;
  publisher?: string;
  edition?: string;
  attributeKeys: string[];
  attributeNames: Record<string, string>;
  hasSanity?: boolean;
  hasManaOrPE?: boolean;
  energyName?: string; // 'PE', 'PM', etc.
}

export const RPG_SYSTEMS: RPGSystemInfo[] = [
  {
    id: 'ordem-paranormal',
    name: 'Ordem Paranormal',
    badge: 'Oficial',
    isOfficial: true,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    description: 'Um sistema de investigação e horror paranormal brasileiro.',
    publisher: 'Jambô Editora & Cellbit',
    attributeKeys: ['AGI', 'FOR', 'INT', 'PRE', 'VIG'],
    attributeNames: {
      AGI: 'Agilidade',
      FOR: 'Força',
      INT: 'Intelecto',
      PRE: 'Presença',
      VIG: 'Vigor'
    },
    hasSanity: true,
    hasManaOrPE: true,
    energyName: 'PE'
  },
  {
    id: 'ordem-paranormal-2',
    name: 'Ordem Paranormal II (Playtest)',
    badge: 'Oficial',
    isOfficial: true,
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    description: 'Playtest Alpha das novas regras de Ordem Paranormal.',
    publisher: 'Arquivos Secretos',
    attributeKeys: ['AGI', 'FOR', 'INT', 'PRE', 'VIG'],
    attributeNames: {
      AGI: 'Agilidade',
      FOR: 'Força',
      INT: 'Intelecto',
      PRE: 'Presença',
      VIG: 'Vigor'
    },
    hasSanity: true,
    hasManaOrPE: true,
    energyName: 'PE'
  },
  {
    id: 'dnd-5e-2014',
    name: 'D&D 5e (2014)',
    badge: 'Oficial',
    isOfficial: true,
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',
    description: 'O maior RPG de mesa de fantasia do mundo (SRD).',
    publisher: 'Wizards of the Coast',
    attributeKeys: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'],
    attributeNames: {
      FOR: 'Força',
      DES: 'Destreza',
      CON: 'Constituição',
      INT: 'Inteligência',
      SAB: 'Sabedoria',
      CAR: 'Carisma'
    },
    hasSanity: false,
    hasManaOrPE: false,
    energyName: 'Espaços'
  },
  {
    id: 'fabula-ultima',
    name: 'Fabula Ultima',
    badge: 'Oficial',
    isOfficial: true,
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    description: 'O TTJRPG inspirado nos videogames clássicos de JRPG.',
    publisher: 'Need Games',
    attributeKeys: ['DES', 'INT', 'VIG', 'VON'],
    attributeNames: {
      DES: 'Destreza',
      INT: 'Intuição',
      VIG: 'Vigor',
      VON: 'Vontade'
    },
    hasSanity: false,
    hasManaOrPE: true,
    energyName: 'PM'
  },
  {
    id: 'tormenta-20',
    name: 'Tormenta20',
    badge: 'Oficial',
    isOfficial: true,
    coverImage: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop',
    description: 'O maior RPG do Brasil no cenário fantástico de Arton.',
    publisher: 'Jambô Editora',
    attributeKeys: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'],
    attributeNames: {
      FOR: 'Força',
      DES: 'Destreza',
      CON: 'Constituição',
      INT: 'Inteligência',
      SAB: 'Sabedoria',
      CAR: 'Carisma'
    },
    hasSanity: false,
    hasManaOrPE: true,
    energyName: 'PM'
  },
  {
    id: 'slasher',
    name: 'Slasher',
    badge: 'Oficial',
    isOfficial: true,
    coverImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop',
    description: 'Sobreviva a assassinos mascarados em filmes de terror dos anos 80 e 90.',
    attributeKeys: ['COR', 'AST', 'CAL', 'SOR'],
    attributeNames: {
      COR: 'Coragem',
      AST: 'Astúcia',
      CAL: 'Calma',
      SOR: 'Sorte'
    },
    hasSanity: true,
    hasManaOrPE: false
  },
  {
    id: 'feiticeiros-maldicoes-2-5',
    name: 'Feiticeiros & Maldições v2.5',
    badge: 'Oficial',
    isOfficial: true,
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',
    description: 'O RPG de feitiçaria e combate sobrenatural moderno.',
    attributeKeys: ['FOR', 'AGI', 'INT', 'PRE', 'VIG'],
    attributeNames: {
      FOR: 'Força',
      AGI: 'Agilidade',
      INT: 'Intelecto',
      PRE: 'Presença',
      VIG: 'Vigor'
    },
    hasSanity: false,
    hasManaOrPE: true,
    energyName: 'Energia Amaldiçoada'
  },
  {
    id: 'feiticeiros-maldicoes-2-0',
    name: 'Feiticeiros & Maldições v2.0',
    badge: 'Oficial',
    isOfficial: true,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    description: 'Versão clássica 2.0 do sistema Feiticeiros & Maldições.',
    attributeKeys: ['FOR', 'AGI', 'INT', 'PRE', 'VIG'],
    attributeNames: {
      FOR: 'Força',
      AGI: 'Agilidade',
      INT: 'Intelecto',
      PRE: 'Presença',
      VIG: 'Vigor'
    },
    hasSanity: false,
    hasManaOrPE: true,
    energyName: 'Energia'
  },
  {
    id: 'ficha-universal',
    name: 'Ficha Universal',
    badge: 'Universal',
    isOfficial: false,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    description: 'Sistema flexível para qualquer cenário, sistema próprio ou adaptação livre.',
    attributeKeys: ['FOR', 'AGI', 'INT', 'VIG', 'CAR'],
    attributeNames: {
      FOR: 'Força',
      AGI: 'Agilidade',
      INT: 'Intelecto',
      VIG: 'Vigor',
      CAR: 'Carisma'
    },
    hasSanity: true,
    hasManaOrPE: true,
    energyName: 'Recurso'
  }
];
