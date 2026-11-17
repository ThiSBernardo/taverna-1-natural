import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Crown, 
  Sparkles, 
  Search, 
  Check, 
  Sliders, 
  Plus, 
  Minus,
  Image as ImageIcon,
  Camera,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link2,
  AlignLeft,
  Info,
  Scroll
} from 'lucide-react';
import { RPGSystemId, RPG_SYSTEMS } from '../../types/rpg-systems';
import { Character, SkillTrainingLevel } from '../../types/character';
import { CharacterRulesService, ORDEM_ORIGINS, DND_SKILLS, ORDEM_SKILLS } from '../../services/character-rules.service';

import raceAnao from '../../assets/races_classes/race_anao.png';
import raceDraconato from '../../assets/races_classes/race_draconato.png';
import raceElfo from '../../assets/races_classes/race_elfo.png';
import raceGnomo from '../../assets/races_classes/race_gnomo.png';
import raceHumano from '../../assets/races_classes/race_humano.png';

import classBarbaro from '../../assets/races_classes/class_barbaro.png';
import classBardo from '../../assets/races_classes/class_bardo.png';
import classBruxo from '../../assets/races_classes/class_bruxo.png';
import classClerigo from '../../assets/races_classes/class_clerigo.png';
import classDruida from '../../assets/races_classes/class_druida.png';
import classFeiticeiro from '../../assets/races_classes/class_feiticeiro.png';

interface CharacterWizardModalProps {
  isOpen: boolean;
  systemId: RPGSystemId;
  initialStep?: number;
  onClose: () => void;
  onCharacterCreated: (character: Character) => void;
}

interface RaceOption {
  name: string;
  image: string;
  description: string;
}

interface ClassOption {
  name: string;
  image: string;
  description: string;
}

const DND_RACES: RaceOption[] = [
  { name: 'Anão', image: raceAnao, description: 'Resistentes e corajosos, mestres da forja e da pedra.' },
  { name: 'Draconato', image: raceDraconato, description: 'Nobreza dracônica com baforadas elementais ancestrais.' },
  { name: 'Elfo', image: raceElfo, description: 'Graça sobrenatural, sentidos aguçados e afinidade mágica.' },
  { name: 'Gnomo', image: raceGnomo, description: 'Curiosidade infinita, entusiasmo e intelecto inventivo.' },
  { name: 'Humano', image: raceHumano, description: 'Adaptáveis e ambiciosos, pioneiros em todas as terras.' },
  { name: 'Meio-Elfo', image: raceElfo, description: 'Combinam a diplomacia humana com a elegância élfica.' },
  { name: 'Meio-Orc', image: raceAnao, description: 'Fúria inabalável e grande resiliência física em combate.' },
  { name: 'Halfling', image: raceGnomo, description: 'Ágeis, corajosos e agraciados com sorte lendária.' },
  { name: 'Tiefling', image: raceDraconato, description: 'Herança infernal com carisma sombrio e magia ígnea.' }
];

const DND_CLASSES: ClassOption[] = [
  { name: 'Bárbaro', image: classBarbaro, description: 'Guerreiro impetuoso movido por fúria primitiva implacável.' },
  { name: 'Bardo', image: classBardo, description: 'Mestre da canção e da magia teatral inspiradora.' },
  { name: 'Bruxo', image: classBruxo, description: 'Pactuante com entidades cósmicas ou patronos obscuros.' },
  { name: 'Clérigo', image: classClerigo, description: 'Canalizador do poder divino e milagres sagrados.' },
  { name: 'Druida', image: classDruida, description: 'Guardião da natureza primordial capaz de metamorfose.' },
  { name: 'Feiticeiro', image: classFeiticeiro, description: 'Conjurador com magia inata correndo em suas veias.' },
  { name: 'Guerreiro', image: classBarbaro, description: 'Especialista incomparável em todas as artes bélicas.' },
  { name: 'Ladino', image: classBruxo, description: 'Furtividade letal, ataques precisos e mãos rápidas.' },
  { name: 'Mago', image: classFeiticeiro, description: 'Estudioso supremo das fórmulas arcanas universais.' },
  { name: 'Monge', image: classDruida, description: 'Canalizador do ki corporal e golpes desarmados velozes.' },
  { name: 'Paladino', image: classClerigo, description: 'Guerreiro sagrado vinculado por um juramento inquebrável.' },
  { name: 'Patrulheiro', image: classDruida, description: 'Rastreador experiente nas fronteiras selvagens do mundo.' }
];

const ORDEM_CLASSES: ClassOption[] = [
  { name: 'Combatente', image: classBarbaro, description: 'Especialista em confronto armado, blindagem física e poder bélico frontal.' },
  { name: 'Especialista', image: classBruxo, description: 'Mestre da perícia tática, investigação minuciosa e suporte analítico.' },
  { name: 'Ocultista', image: classFeiticeiro, description: 'Conhecedor de rituais proibidos e manipulação dos elementos do Outro Lado.' }
];

const DND_SUBCLASSES: Record<string, string[]> = {
  Bárbaro: ['Trilha do Berserker', 'Trilha do Totem', 'Trilha do Guerreiro Zealot'],
  Bardo: ['Colégio do Conhecimento', 'Colégio da Bravura', 'Colégio das Espadas'],
  Bruxo: ['O Corruptor', 'O Grande Antigo', 'A Arquifada'],
  Clérigo: ['Domínio da Vida', 'Domínio da Luz', 'Domínio da Guerra'],
  Druida: ['Círculo da Terra', 'Círculo da Lua', 'Círculo dos Pastores'],
  Feiticeiro: ['Linhagem Dracônica', 'Magia Selvagem', 'Alma Favorecida'],
  Guerreiro: ['Campeão', 'Mestre de Batalha', 'Cavaleiro Arcano'],
  Ladino: ['Ladrão', 'Assassino', 'Trapaceiro Arcano'],
  Mago: ['Evocação', 'Abjuração', 'Necromancia'],
  Monge: ['Caminho da Mão Aberta', 'Caminho das Sombras'],
  Paladino: ['Juramento de Devoção', 'Juramento dos Anciões'],
  Patrulheiro: ['Caçador', 'Mestre das Feras']
};

const ORDEM_SUBCLASSES: Record<string, string[]> = {
  Combatente: ['Aniquilador', 'Comandante de Campo', 'Guerreiro', 'Operações Especiais', 'Tropa de Choque'],
  Especialista: ['Atirador de Elite', 'Infiltrador', 'Médico de Campo', 'Negociador', 'Técnico'],
  Ocultista: ['Conduíte', 'Flagelador', 'Graduado', 'Intuitivo', 'Lâmina Paranormal']
};

export const CharacterWizardModal: React.FC<CharacterWizardModalProps> = ({
  isOpen,
  systemId,
  initialStep = 1,
  onClose,
  onCharacterCreated,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const systemInfo = RPG_SYSTEMS.find(s => s.id === systemId) || RPG_SYSTEMS[0];
  const isOrdem = systemId === 'ordem-paranormal' || systemId === 'ordem-paranormal-2';
  const isDnd = systemId === 'dnd-5e-2014';
  const isT20 = systemId === 'tormenta-20';

  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  const [ownerType, setOwnerType] = useState<'player' | 'master'>('player');
  const [assignedUser, setAssignedUser] = useState<string>('ThiSBernardo');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');

  const classList = isOrdem ? ORDEM_CLASSES : DND_CLASSES;
  const raceList = DND_RACES;

  const [selectedRace, setSelectedRace] = useState<string>(isOrdem ? 'Investigador' : 'Anão');
  const [selectedClass, setSelectedClass] = useState<string>(isOrdem ? 'Combatente' : 'Bárbaro');
  const [levelOrNex, setLevelOrNex] = useState<number>(isOrdem ? 5 : 4);
  const [subclass, setSubclass] = useState<string>(isOrdem ? 'Guerreiro' : 'Trilha do Berserker');

  const [modalDetailsTitle, setModalDetailsTitle] = useState<string | null>(null);
  const [modalDetailsText, setModalDetailsText] = useState<string | null>(null);

  const [attributes, setAttributes] = useState<Record<string, number>>(() => {
    const initialAttrs: Record<string, number> = isOrdem
      ? { AGI: 1, FOR: 1, INT: 1, PRE: 1, VIG: 1 }
      : { FOR: 8, DES: 8, CON: 8, INT: 8, SAB: 8, CAR: 8 };
    return initialAttrs;
  });

  const [proficiencyBonus, setProficiencyBonus] = useState<number>(2);

  const [savingThrows, setSavingThrows] = useState<Record<string, boolean>>({
    FOR: false,
    DES: false,
    CON: false,
    INT: false,
    SAB: false,
    CAR: false
  });

  const [skills, setSkills] = useState(() => CharacterRulesService.getInitialSkills(systemId));

  const [armorClass, setArmorClass] = useState<number>(10);
  const [hitPoints, setHitPoints] = useState<number>(0);

  const [name, setName] = useState<string>('');
  const [tokenUrl, setTokenUrl] = useState<string>('');
  const [tokenScale, setTokenScale] = useState<number>(1.0);
  const [biography, setBiography] = useState<string>('');

  useEffect(() => {
    if (initialStep >= 1 && initialStep <= 4) {
      setCurrentStep(initialStep);
    }
  }, [initialStep]);

  useEffect(() => {
    if (isOrdem) {
      const stats = CharacterRulesService.calculateOrdemStatus(
        selectedClass,
        levelOrNex,
        attributes['VIG'] || 1,
        attributes['PRE'] || 1
      );
      setHitPoints(stats.maxHp);
      setArmorClass(10 + (attributes['AGI'] || 1));
    } else {
      const conMod = CharacterRulesService.getDndModifier(attributes['CON'] || 8);
      const dexMod = CharacterRulesService.getDndModifier(attributes['DES'] || 8);
      const baseDie = selectedClass === 'Bárbaro' ? 12 : selectedClass === 'Guerreiro' || selectedClass === 'Paladino' || selectedClass === 'Patrulheiro' ? 10 : selectedClass === 'Mago' || selectedClass === 'Feiticeiro' ? 6 : 8;
      const calculatedHp = Math.max(1, baseDie + conMod + (levelOrNex - 1) * Math.max(1, Math.floor(baseDie / 2) + 1 + conMod));
      setHitPoints(calculatedHp);
      setArmorClass(10 + dexMod);
    }
  }, [selectedClass, levelOrNex, attributes, isOrdem]);

  if (!isOpen) return null;

  const currentSubclasses = isOrdem 
    ? (ORDEM_SUBCLASSES[selectedClass] || []) 
    : (DND_SUBCLASSES[selectedClass] || []);

  const handleAttrChange = (key: string, delta: number) => {
    const current = attributes[key] || 0;
    const min = isOrdem ? 0 : 3;
    const max = isOrdem ? 5 : 20;
    const nextVal = Math.max(min, Math.min(max, current + delta));
    setAttributes(prev => ({ ...prev, [key]: nextVal }));
  };

  const handleToggleSavingThrow = (key: string) => {
    setSavingThrows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleSkill = (skillKey: string) => {
    setSkills(prev => prev.map(s => {
      if (s.key === skillKey) {
        let nextTraining: SkillTrainingLevel = 'destreinado';
        if (s.training === 'destreinado') nextTraining = 'treinado';
        else if (s.training === 'treinado') nextTraining = 'expert';
        else if (s.training === 'expert') nextTraining = 'destreinado';

        const attrKey = s.attributeKey;
        const attrVal = attributes[attrKey] || (isOrdem ? 1 : 10);
        const bonus = isOrdem 
          ? CharacterRulesService.calculateOrdemSkillTotal(nextTraining)
          : CharacterRulesService.calculateDndSkillTotal(attrVal, nextTraining, proficiencyBonus);

        return { ...s, training: nextTraining, total: bonus };
      }
      return s;
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTokenUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    if (!name.trim()) return;

    const newCharacter: Character = {
      id: 'char-' + Date.now(),
      name: name.trim(),
      systemId,
      ownerType,
      assignedUser,
      campaignId: selectedCampaign || null,
      characterClass: selectedClass,
      subclass: subclass || undefined,
      levelOrNex,
      originOrBackground: isOrdem ? selectedRace : undefined,
      raceOrAncestry: !isOrdem ? selectedRace : undefined,
      attributes,
      autoCalculateStatus: true,
      hp: { current: hitPoints || 10, max: hitPoints || 10 },
      defense: armorClass,
      initiative: CharacterRulesService.getDndModifier(attributes['DES'] || 8),
      speed: '9m',
      skills,
      token: {
        imageUrl: tokenUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        scale: tokenScale,
        isAnimated: false
      },
      biography,
      items: [],
      abilities: [],
      coins: isOrdem ? 500 : 50,
      currencyUnit: isOrdem ? 'Créditos' : 'PO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onCharacterCreated(newCharacter);
  };

  const selectedClassData = classList.find(c => c.name === selectedClass);
  const selectedClassImage = selectedClassData?.image;

  const stepsList = [
    { num: 1, label: 'Tipo' },
    { num: 2, label: 'Raça e classe' },
    { num: 3, label: 'Atributos' },
    { num: 4, label: 'Final' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0D12] text-gray-100 flex flex-col justify-between overflow-hidden select-none">
      {selectedClassImage && currentStep >= 2 && (
        <div 
          className="fixed right-1/4 top-1/2 -translate-y-1/2 w-[580px] h-[720px] pointer-events-none opacity-[0.06] bg-contain bg-no-repeat bg-center mix-blend-screen transition-all duration-700"
          style={{ backgroundImage: `url(${selectedClassImage})` }}
        />
      )}

      <header className="h-16 px-4 sm:px-6 lg:px-12 flex items-center justify-between border-b border-white/5 bg-[#0A0D12]/95 backdrop-blur-md shrink-0 z-10">
        <div className="hidden md:block md:w-36 lg:w-48">
          <span className="font-serif tracking-[0.28em] text-xs text-gray-400 uppercase font-semibold">
            NOVO PERSONAGEM
          </span>
        </div>

        <nav className="flex items-center gap-1.5 sm:gap-4 lg:gap-6">
          {stepsList.map((st, idx) => {
            const isCompleted = currentStep > st.num;
            const isActive = currentStep === st.num;

            return (
              <React.Fragment key={st.num}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(st.num)}
                  className={`flex items-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer rounded-full ${
                    isActive && st.num === 1 
                      ? 'border border-[#388bfd] bg-[#1a2332]/60 px-2.5 sm:px-3 py-1 ring-1 ring-[#388bfd]/50'
                      : isActive 
                      ? 'px-2 py-1' 
                      : 'px-1.5 sm:px-2 py-1 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                      isCompleted
                        ? 'bg-[#8A4FFF] text-white shadow-[0_0_8px_rgba(138,79,255,0.6)]'
                        : isActive
                        ? 'bg-[#8A4FFF] text-white shadow-[0_0_10px_rgba(138,79,255,0.7)]'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.num}
                  </div>
                  <span
                    className={`text-xs sm:text-sm transition-colors whitespace-nowrap ${
                      isActive 
                        ? 'text-white font-semibold inline' 
                        : isCompleted 
                        ? 'text-gray-200 hidden sm:inline' 
                        : 'text-gray-500 hidden sm:inline'
                    }`}
                  >
                    {st.label}
                  </span>
                </button>

                {idx < stepsList.length - 1 && (
                  <div 
                    className={`w-3 sm:w-6 lg:w-12 h-px transition-all shrink-0 ${
                      currentStep > st.num ? 'bg-[#8A4FFF]/70 shadow-[0_0_6px_rgba(138,79,255,0.4)]' : 'bg-white/10'
                    }`} 
                  />
                )}
              </React.Fragment>
            );
          })}
        </nav>

        <div className="w-auto md:w-36 lg:w-48 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative z-10 px-6 sm:px-12 lg:px-20 py-8 justify-between gap-10">
        <section className="flex-1 overflow-y-auto pr-2 max-w-4xl custom-scrollbar">
          
          {currentStep === 1 && (
            <div className="max-w-2xl space-y-8 animate-fadeIn">
              <div>
                <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-wide">
                  Quem é esse personagem?
                </h1>
                <p className="text-sm text-gray-400 mt-2">
                  Define quem controla e onde ele aparece na mesa.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setOwnerType('master')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                    ownerType === 'master'
                      ? 'border-[#388bfd] bg-[#1a2332]/60 ring-1 ring-[#388bfd] shadow-lg shadow-blue-950/40'
                      : 'border-white/10 bg-[#12161F]/60 text-gray-400 hover:border-white/20 hover:bg-[#12161F]/90'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Personagem do mestre</div>
                    <div className="text-xs text-gray-400 mt-1 leading-relaxed">
                      NPCs, monstros e aliados que o mestre conduz.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setOwnerType('player')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                    ownerType === 'player'
                      ? 'border-[#388bfd] bg-[#1a2332]/60 ring-1 ring-[#388bfd] shadow-lg shadow-blue-950/40'
                      : 'border-white/10 bg-[#12161F]/60 text-gray-400 hover:border-white/20 hover:bg-[#12161F]/90'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-blue-950/80 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5 text-blue-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Personagem de jogador</div>
                    <div className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Controlado por uma pessoa da mesa, com ficha completa.
                    </div>
                  </div>
                </button>
              </div>

              <div className="pt-4 space-y-3">
                <h3 className="font-semibold text-sm text-white">
                  Quem joga com ele?
                </h3>
                <p className="text-xs text-gray-400">
                  Nenhuma pessoa entrou na campanha ainda.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                      Jogador Responsável
                    </label>
                    <input
                      type="text"
                      value={assignedUser}
                      onChange={(e) => setAssignedUser(e.target.value)}
                      placeholder="ThiSBernardo (Você)"
                      className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#10131B] border border-white/10 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                      Vincular à Campanha
                    </label>
                    <select
                      value={selectedCampaign}
                      onChange={(e) => setSelectedCampaign(e.target.value)}
                      className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#10131B] border border-white/10 focus:border-purple-500"
                    >
                      <option value="">Sem campanha (Criar avulso)</option>
                      <option value="camp-1">O Segredo da Floresta Sombria</option>
                      <option value="camp-2">A Cidadela dos Esquecidos</option>
                      <option value="camp-3">Campanha de Teste Mapeamento</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-7 animate-fadeIn">
              <div>
                <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-wide">
                  Construa seu personagem
                </h1>
                <p className="text-sm text-gray-400 mt-2">
                  {isOrdem 
                    ? 'Escolha sua classe, trilha e NEX inicial.' 
                    : 'Escolha raça, classe e nível. Dá para combinar mais de uma classe.'}
                </p>
              </div>

              {!isOrdem && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3 tracking-wide">
                    Raça
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar">
                    {raceList.map(race => {
                      const isSelected = selectedRace === race.name;
                      return (
                        <div
                          key={race.name}
                          onClick={() => setSelectedRace(race.name)}
                          className="w-24 sm:w-28 shrink-0 flex flex-col items-center cursor-pointer group"
                        >
                          <div
                            className={`w-full aspect-[3/4] rounded-xl overflow-hidden border transition-all relative ${
                              isSelected
                                ? 'border-2 border-[#8A4FFF] shadow-[0_0_15px_rgba(138,79,255,0.45)]'
                                : 'border-white/10 group-hover:border-white/30 bg-[#12161F]'
                            }`}
                          >
                            <img
                              src={race.image}
                              alt={race.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {isSelected && (
                              <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-[#8A4FFF] text-white flex items-center justify-center text-xs font-bold shadow-md">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-white mt-2 text-center truncate w-full">
                            {race.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalDetailsTitle(`Raça: ${race.name}`);
                              setModalDetailsText(race.description);
                            }}
                            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 mt-0.5 cursor-pointer"
                          >
                            <Info className="w-3 h-3 text-gray-500" />
                            <span>Detalhes</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-white mb-3 tracking-wide">
                  Classe
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar">
                  {classList.map(cls => {
                    const isSelected = selectedClass === cls.name;
                    return (
                      <div
                        key={cls.name}
                        onClick={() => {
                          setSelectedClass(cls.name);
                          if (isOrdem) {
                            const sub = ORDEM_SUBCLASSES[cls.name]?.[0] || '';
                            setSubclass(sub);
                          } else {
                            const sub = DND_SUBCLASSES[cls.name]?.[0] || '';
                            setSubclass(sub);
                          }
                        }}
                        className="w-24 sm:w-28 shrink-0 flex flex-col items-center cursor-pointer group"
                      >
                        <div
                          className={`w-full aspect-[3/4] rounded-xl overflow-hidden border transition-all relative ${
                            isSelected
                              ? 'border-2 border-[#8A4FFF] shadow-[0_0_15px_rgba(138,79,255,0.45)]'
                              : 'border-white/10 group-hover:border-white/30 bg-[#12161F]'
                          }`}
                        >
                          <img
                            src={cls.image}
                            alt={cls.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-[#8A4FFF] text-white flex items-center justify-center text-xs font-bold shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold text-white mt-2 text-center truncate w-full">
                          {cls.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalDetailsTitle(`Classe: ${cls.name}`);
                            setModalDetailsText(cls.description);
                          }}
                          className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 mt-0.5 cursor-pointer"
                        >
                          <Info className="w-3 h-3 text-gray-500" />
                          <span>Detalhes</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-3 tracking-wide">
                  {isOrdem ? `NEX de ${selectedClass}` : `Nível de ${selectedClass}`}
                </h3>
                {isOrdem ? (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setLevelOrNex(n)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          levelOrNex === n
                            ? 'bg-[#8A4FFF] text-white shadow-md shadow-purple-900/50'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {n}%
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setLevelOrNex(n)}
                        className={`text-sm font-medium transition-all cursor-pointer px-1.5 py-0.5 ${
                          levelOrNex === n
                            ? 'text-white font-bold underline decoration-[#8A4FFF] decoration-2 underline-offset-8 scale-110'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {currentSubclasses.length > 0 && (
                <div className="max-w-sm">
                  <h3 className="text-sm font-semibold text-white mb-2 tracking-wide">
                    {isOrdem ? 'Trilha opcional' : 'Subclasse opcional'}
                  </h3>
                  <select
                    value={subclass}
                    onChange={(e) => setSubclass(e.target.value)}
                    className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#10131B] border border-white/10 focus:border-purple-500"
                  >
                    <option value="">Nenhuma / Definir depois</option>
                    {currentSubclasses.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-wide">
                  Defina seus atributos
                </h1>
                <p className="text-sm text-gray-400 mt-2">
                  Bônus de raça, classe e origem aparecem ao lado de cada valor.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Atributos
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl">
                  {Object.keys(attributes).map(key => {
                    const val = attributes[key] || (isOrdem ? 1 : 8);
                    const mod = isOrdem ? val : CharacterRulesService.getDndModifier(val);
                    const modStr = mod >= 0 ? `+${mod}` : `${mod}`;

                    return (
                      <div
                        key={key}
                        className="rounded-2xl border border-white/10 bg-[#12161F]/60 p-3.5 flex flex-col items-center justify-between shadow-md"
                      >
                        <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                          {key === 'FOR' ? 'FORÇA' : key === 'DES' ? 'DESTREZA' : key === 'CON' ? 'CONSTITUIÇÃO' : key === 'INT' ? 'INTELIGÊNCIA' : key === 'SAB' ? 'SABEDORIA' : key === 'CAR' ? 'CARISMA' : key === 'AGI' ? 'AGILIDADE' : key === 'PRE' ? 'PRESENÇA' : key === 'VIG' ? 'VIGOR' : key}
                        </span>

                        <div className="flex items-center justify-between bg-black/50 rounded-full px-2.5 py-1 w-full border border-white/10 my-3">
                          <button
                            type="button"
                            onClick={() => handleAttrChange(key, -1)}
                            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-lg font-bold text-white font-rajdhani">
                            {val}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAttrChange(key, 1)}
                            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs text-gray-500 font-mono">
                          {isOrdem ? `${val}d20` : modStr}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {!isOrdem && (
                <div className="max-w-[140px]">
                  <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase block mb-2">
                    PROFICIÊNCIA
                  </span>
                  <div className="rounded-2xl border border-white/10 bg-[#12161F]/60 p-3 flex flex-col items-center shadow-md">
                    <div className="flex items-center justify-between bg-black/50 rounded-full px-2.5 py-1 w-full border border-white/10">
                      <button
                        type="button"
                        onClick={() => setProficiencyBonus(prev => Math.max(1, prev - 1))}
                        className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-base font-bold text-white font-rajdhani">
                        {proficiencyBonus}
                      </span>
                      <button
                        type="button"
                        onClick={() => setProficiencyBonus(prev => prev + 1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white">
                    Perícias
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8A4FFF]" />
                      <span>Proficiência</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full border-2 border-[#8A4FFF] bg-[#8A4FFF]/30" />
                      <span>Especialização</span>
                    </div>
                  </div>
                </div>

                {!isOrdem && (
                  <div>
                    <h4 className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">
                      TESTES DE RESISTÊNCIA
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {[
                        { key: 'FOR', name: 'Res. Força' },
                        { key: 'DES', name: 'Res. Destreza' },
                        { key: 'CON', name: 'Res. Constituição' },
                        { key: 'INT', name: 'Res. Inteligência' },
                        { key: 'SAB', name: 'Res. Sabedoria' },
                        { key: 'CAR', name: 'Res. Carisma' }
                      ].map(st => {
                        const isProf = savingThrows[st.key];
                        return (
                          <div
                            key={st.key}
                            onClick={() => handleToggleSavingThrow(st.key)}
                            className="rounded-xl border border-white/10 bg-[#12161F]/50 px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:border-white/20 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                                  isProf ? 'bg-[#8A4FFF] border-[#8A4FFF]' : 'border-gray-500'
                                }`}
                              >
                                {isProf && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <span className="text-xs font-medium text-gray-200">{st.name}</span>
                            </div>
                            <span className={`text-[11px] ${isProf ? 'text-[#c084fc] font-semibold' : 'text-gray-500'}`}>
                              {isProf ? 'Proficiência' : 'Sem proficiência'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">
                    PERÍCIAS
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {skills.map(s => {
                      const isTrained = s.training === 'treinado';
                      const isExpert = s.training === 'expert';

                      return (
                        <div
                          key={s.key}
                          onClick={() => handleToggleSkill(s.key)}
                          className="rounded-xl border border-white/10 bg-[#12161F]/50 px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:border-white/20 transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <div
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                                isExpert
                                  ? 'border-2 border-[#8A4FFF] bg-[#8A4FFF]/40'
                                  : isTrained
                                  ? 'bg-[#8A4FFF] border-[#8A4FFF]'
                                  : 'border-gray-500'
                              }`}
                            >
                              {(isTrained || isExpert) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs font-medium text-gray-200 truncate">{s.name}</span>
                          </div>
                          <span
                            className={`text-[11px] shrink-0 ${
                              isExpert
                                ? 'text-yellow-400 font-semibold'
                                : isTrained
                                ? 'text-[#c084fc] font-semibold'
                                : 'text-gray-500'
                            }`}
                          >
                            {isExpert ? 'Especialização' : isTrained ? 'Proficiência' : 'Sem proficiência'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8 animate-fadeIn max-w-2xl">
              <div>
                <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-wide">
                  Como se chama o seu personagem?
                </h1>
                <p className="text-sm text-gray-400 mt-2">
                  O nome e a imagem são obrigatórios. O resto você pode deixar para depois.
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kael, o Cinzento"
                  className="w-full bg-transparent font-cinzel text-3xl sm:text-4xl font-bold text-white placeholder:text-gray-600/70 border-b border-white/20 pb-3 focus:outline-none focus:border-[#8A4FFF] transition-colors"
                />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Tamanho do token</span>
                  <span className="font-mono text-gray-400">
                    {tokenScale.toFixed(2)} · {tokenScale <= 0.75 ? 'Pequeno' : tokenScale <= 1.25 ? 'Médio' : tokenScale <= 1.8 ? 'Grande' : 'Enorme'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.05"
                  value={tokenScale}
                  onChange={(e) => setTokenScale(Number(e.target.value))}
                  className="w-full accent-[#8A4FFF] cursor-pointer"
                />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">
                    História <span className="text-gray-400 font-normal">opcional</span>
                  </span>
                  <span className="text-gray-500 font-mono">
                    {9000 - biography.length} restantes
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 overflow-hidden bg-[#12161F]/60">
                  <div className="flex items-center flex-wrap gap-1 px-3 py-2 border-b border-white/10 bg-white/5 text-gray-400 text-xs">
                    <button type="button" className="px-2 py-1 rounded hover:bg-white/10 hover:text-white">
                      Normal ▾
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button type="button" className="p-1 rounded hover:bg-white/10 hover:text-white" aria-label="Negrito">
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-white/10 hover:text-white" aria-label="Itálico">
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-white/10 hover:text-white" aria-label="Sublinhado">
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-white/10 hover:text-white" aria-label="Tachado">
                      <Strikethrough className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button type="button" className="p-1 rounded hover:bg-white/10 hover:text-white" aria-label="Lista">
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-white/10 hover:text-white" aria-label="Lista ordenada">
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-white/10 hover:text-white" aria-label="Citação">
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-white/10 hover:text-white" aria-label="Link">
                      <Link2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button type="button" className="p-1 rounded hover:bg-white/10 hover:text-white" aria-label="Alinhamento">
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                    placeholder="A descrição aparece para todos os jogadores da campanha..."
                    className="w-full p-3.5 text-xs text-gray-200 placeholder:text-gray-500 bg-transparent focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

        </section>

        {currentStep === 3 ? (
          <aside className="w-[300px] shrink-0 hidden lg:block space-y-4">
            <h3 className="font-bold text-sm text-gray-200 tracking-wide">
              Status
            </h3>
            
            <div className="rounded-2xl border border-white/10 bg-[#12161F]/60 p-4 shadow-lg">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase text-center block mb-2">
                CLASSE DE ARMADURA (CA)
              </span>
              <div className="flex items-center justify-between bg-black/40 rounded-full px-4 py-1.5 border border-white/10 max-w-[160px] mx-auto">
                <button
                  type="button"
                  onClick={() => setArmorClass(prev => Math.max(0, prev - 1))}
                  className="text-gray-400 hover:text-white p-1 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-rajdhani text-2xl font-bold text-white px-2">
                  {armorClass}
                </span>
                <button
                  type="button"
                  onClick={() => setArmorClass(prev => prev + 1)}
                  className="text-gray-400 hover:text-white p-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#12161F]/60 p-4 shadow-lg">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase text-center block mb-2">
                PONTOS DE VIDA
              </span>
              <div className="flex items-center justify-between bg-black/40 rounded-full px-4 py-1.5 border border-white/10 max-w-[160px] mx-auto">
                <button
                  type="button"
                  onClick={() => setHitPoints(prev => Math.max(0, prev - 1))}
                  className="text-gray-400 hover:text-white p-1 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-rajdhani text-2xl font-bold text-white px-2">
                  {hitPoints}
                </span>
                <button
                  type="button"
                  onClick={() => setHitPoints(prev => prev + 1)}
                  className="text-gray-400 hover:text-white p-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </aside>
        ) : (
          <aside className="w-[360px] lg:w-[400px] shrink-0 hidden md:flex flex-col justify-start">
            <div
              className={`rounded-2xl border p-6 flex flex-col justify-between h-[480px] lg:h-[520px] backdrop-blur-md transition-all duration-300 ${
                currentStep === 4
                  ? 'border-[#8A4FFF] bg-[#12161F]/80 shadow-[0_0_25px_rgba(138,79,255,0.25)] ring-1 ring-[#8A4FFF]/50'
                  : 'border-white/10 bg-[#12161F]/60'
              }`}
            >
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                {tokenUrl ? (
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-[#8A4FFF]/50 shadow-2xl bg-purple-950/60 flex items-center justify-center">
                      <img
                        src={tokenUrl}
                        alt="Token Preview"
                        className="w-full h-full object-cover transition-transform"
                        style={{ transform: `scale(${tokenScale})` }}
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs text-white font-medium">
                      Trocar imagem
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full border border-dashed border-white/15 hover:border-purple-500/50 rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer group transition-colors bg-black/20"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-[#8A4FFF]/20 flex items-center justify-center mb-3 transition-colors">
                      <Camera className="w-6 h-6 text-gray-300 group-hover:text-purple-300 transition-colors" />
                    </div>
                    <span className="text-sm font-semibold text-white">Adicionar imagem</span>
                    <span className="text-xs text-gray-400 mt-1">Arraste uma imagem ou clique</span>

                    <div className="flex flex-col items-center gap-1.5 mt-5 text-xs text-gray-400">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTokenUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop');
                        }}
                        className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Usar da Galeria</span>
                      </button>
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Animar token</span>
                      </span>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="border-t border-white/5 pt-4">
                <div className="font-cinzel text-base font-bold text-gray-200 truncate">
                  {name.trim() || 'Seu personagem'}
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#2a1b4e] text-[#c084fc] border border-purple-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc]" />
                    <span>
                      {selectedClass || 'Classe'} {subclass ? `(${subclass})` : ''} · {isOrdem ? `${levelOrNex}% NEX` : `Nível ${levelOrNex}`}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2.5">
                  {ownerType === 'master' ? (
                    <>
                      <Crown className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Personagem do mestre</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span>Personagem de jogador</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </aside>
        )}
      </main>

      <footer className="h-18 px-4 sm:px-6 lg:px-12 border-t border-white/5 bg-[#0A0D12]/95 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
        <div>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="text-gray-300 hover:text-white text-xs font-medium flex items-center gap-2 px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xs font-medium px-4 py-2 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>

        <div className="text-xs text-gray-400">
          {currentStep === 2 && !selectedClass && 'Escolha uma classe e um nível para continuar.'}
          {currentStep === 4 && !name.trim() && 'Dê um nome ao personagem para continuar.'}
        </div>

        <div>
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="bg-[#8A4FFF] hover:bg-[#7839EE] text-white text-xs font-semibold px-8 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-purple-900/40 cursor-pointer"
            >
              <span>Continuar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!name.trim()}
              onClick={handleFinish}
              className="bg-[#8A4FFF] hover:bg-[#7839EE] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-8 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-purple-900/40 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Criar personagem</span>
            </button>
          )}
        </div>
      </footer>

      {modalDetailsTitle && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel-elevated max-w-md w-full rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Scroll className="w-5 h-5 text-purple-400" />
                <h4 className="font-cinzel text-lg font-bold text-white">{modalDetailsTitle}</h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setModalDetailsTitle(null);
                  setModalDetailsText(null);
                }}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {modalDetailsText}
            </p>
            <button
              type="button"
              onClick={() => {
                setModalDetailsTitle(null);
                setModalDetailsText(null);
              }}
              className="w-full bg-[#8A4FFF] hover:bg-[#7839EE] py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
