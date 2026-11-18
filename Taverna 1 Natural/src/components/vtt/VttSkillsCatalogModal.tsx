import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Plus, 
  Star, 
  Share2, 
  ChevronRight, 
  ChevronDown, 
  Leaf, 
  SlidersHorizontal, 
  ArrowUpDown, 
  List, 
  Grid 
} from 'lucide-react';
import { ORDEM_ORIGINS } from '../../services/character-rules.service';

export interface VttSkillItem {
  id: string;
  name: string;
  level: number;
  cost: string;
  type: 'Passiva' | 'Ativa';
  category: 'Classe' | 'Origem';
  categoryName: string;
  source: string;
  description: string;
  additionalInfo?: string;
  isFavorite?: boolean;
}

interface VttSkillsCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateSkill: () => void;
  onShareInChat: (skill: VttSkillItem) => void;
  onAddSkillToCharacter?: (skill: VttSkillItem) => void;
  characterName?: string;
}

export const VttSkillsCatalogModal: React.FC<VttSkillsCatalogModalProps> = ({
  isOpen,
  onClose,
  onOpenCreateSkill,
  onShareInChat,
  onAddSkillToCharacter,
  characterName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todas' | 'ativas' | 'passivas' | 'favoritas'>('todas');
  const [selectedCategoryType, setSelectedCategoryType] = useState<'classe' | 'origem'>('origem');
  const [selectedCategoryName, setSelectedCategoryName] = useState('Agente de Saúde');
  const [isClassesOpen, setIsClassesOpen] = useState(true);
  const [sortBy, setSortBy] = useState<'nivel' | 'nome'>('nivel');
  const [sortAsc, setSortAsc] = useState(true);
  const [viewMode, setViewMode] = useState<'lista' | 'cards'>('lista');

  const [skillsList, setSkillsList] = useState<VttSkillItem[]>([
    {
      id: 'skill-tecnica-medicinal',
      name: 'Técnica Medicinal',
      level: 5,
      cost: 'Sem custo',
      type: 'Passiva',
      category: 'Origem',
      categoryName: 'Agente de Saúde',
      source: 'Antecedente: Agente de Saúde Fonte: Ordem Paranormal RPG v1.3, pág. 16 (PDF 26)',
      description: 'Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados.',
      isFavorite: false
    },
    {
      id: 'skill-saber-e-poder',
      name: 'Saber é Poder',
      level: 5,
      cost: 'Sem custo',
      type: 'Passiva',
      category: 'Origem',
      categoryName: 'Acadêmico',
      source: 'Antecedente: Acadêmico Fonte: Ordem Paranormal RPG v1.3, pág. 16',
      description: 'Você recebe +2 em testes de Intelecto ao pesquisar pistas ou decifrar enigmas.',
      isFavorite: false
    },
    {
      id: 'skill-ataque-especial',
      name: 'Ataque Especial',
      level: 10,
      cost: '2 PE',
      type: 'Ativa',
      category: 'Classe',
      categoryName: 'Combatente',
      source: 'Classe: Combatente Fonte: Ordem Paranormal RPG v1.3, pág. 24',
      description: 'Gaste 2 PE para receber +5 no teste de ataque ou na rolagem de dano deste golpe.',
      isFavorite: true
    },
    {
      id: 'skill-escolhido-pelo-outro-lado',
      name: 'Escolhido pelo Outro Lado',
      level: 10,
      cost: 'Sem custo',
      type: 'Passiva',
      category: 'Classe',
      categoryName: 'Ocultista',
      source: 'Classe: Ocultista Fonte: Ordem Paranormal RPG v1.3, pág. 30',
      description: 'Você aprende um ritual de 1º círculo adicional e soma sua Presença nos Pontos de Esforço máximos.',
      isFavorite: false
    },
    {
      id: 'skill-perito',
      name: 'Perito',
      level: 10,
      cost: '2 PE',
      type: 'Ativa',
      category: 'Classe',
      categoryName: 'Especialista',
      source: 'Classe: Especialista Fonte: Ordem Paranormal RPG v1.3, pág. 36',
      description: 'Ao fazer um teste de uma de suas perícias escolhidas, pode gastar 2 PE para somar +1d6 no resultado.',
      isFavorite: false
    }
  ]);

  const [selectedSkillId, setSelectedSkillId] = useState<string>('skill-tecnica-medicinal');

  if (!isOpen) return null;

  const toggleFavorite = (id: string) => {
    setSkillsList(prev => prev.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s));
  };

  const filteredSkills = skillsList.filter(skill => {
    const matchesSearch = !searchTerm.trim() || 
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.cost.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilterType = 
      filterType === 'todas' ? true :
      filterType === 'ativas' ? skill.type === 'Ativa' :
      filterType === 'passivas' ? skill.type === 'Passiva' :
      filterType === 'favoritas' ? !!skill.isFavorite : true;

    const matchesCategory = 
      selectedCategoryType === 'origem' 
        ? (skill.category === 'Origem' && skill.categoryName.toLowerCase() === selectedCategoryName.toLowerCase())
        : (skill.category === 'Classe' && skill.categoryName.toLowerCase() === selectedCategoryName.toLowerCase());

    return matchesSearch && matchesFilterType && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'nivel') {
      return sortAsc ? a.level - b.level : b.level - a.level;
    }
    return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
  });

  const selectedSkill = skillsList.find(s => s.id === selectedSkillId) || filteredSkills[0] || skillsList[0];

  const totalCatalogCount = 258;
  const classesList = [
    { name: 'Combatente', count: 25 },
    { name: 'Ocultista', count: 22 },
    { name: 'Especialista', count: 23 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm select-none animate-modal-in">
      
      {/* MAIN MODAL WINDOW */}
      <div className="w-full max-w-6xl h-[88vh] max-h-[820px] bg-[#121118]/96 backdrop-blur-2xl border border-white/[0.09] rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.92)] flex flex-col overflow-hidden text-gray-200">
        
        {/* MODAL HEADER */}
        <div className="h-16 px-6 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#15131d]/60">
          
          {/* Title & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/25 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cinzel text-base font-bold text-white tracking-wide">
                Habilidades
              </h2>
              <p className="text-[10px] text-gray-400 font-sans">
                {totalCatalogCount} habilidades no catálogo
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-80 sm:w-96">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, texto, custo ou ação"
              className="w-full pl-9 pr-8 py-1.5 rounded-full text-xs bg-[#1a1724]/90 border border-white/[0.08] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 text-gray-400 text-[10px] font-mono px-1.5 py-0.5 rounded">
              /
            </span>
          </div>

          {/* Filter Pills, New Skill button, Close */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1 bg-black/40 p-0.5 rounded-full border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setFilterType('todas')}
                className={`px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
                  filterType === 'todas' ? 'bg-[#5b4d75] text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Todas 1
              </button>
              <button
                type="button"
                onClick={() => setFilterType('ativas')}
                className={`px-2.5 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
                  filterType === 'ativas' ? 'bg-[#5b4d75] text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Ativas 0
              </button>
              <button
                type="button"
                onClick={() => setFilterType('passivas')}
                className={`px-2.5 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
                  filterType === 'passivas' ? 'bg-[#5b4d75] text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Passivas 1
              </button>
              <button
                type="button"
                onClick={() => setFilterType('favoritas')}
                className={`px-2.5 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
                  filterType === 'favoritas' ? 'bg-[#5b4d75] text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Favoritas
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenCreateSkill}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-purple-900/40 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova habilidade</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 3-COLUMN BODY */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* COLUMN 1: LEFT ACCORDION NAVIGATION (Classes & Origens) */}
          <div className="w-56 border-r border-white/[0.08] p-3 flex flex-col justify-between overflow-y-auto bg-[#14121c]/40 shrink-0">
            <div className="space-y-4">
              
              {/* SECTION: CLASSES */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsClassesOpen(prev => !prev)}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-2 py-1 hover:text-gray-200 cursor-pointer"
                >
                  <span>CLASSES</span>
                  {isClassesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {isClassesOpen && (
                  <div className="space-y-0.5 pl-1">
                    {classesList.map(cls => {
                      const isSelected = selectedCategoryType === 'classe' && selectedCategoryName.toLowerCase() === cls.name.toLowerCase();
                      return (
                        <button
                          key={cls.name}
                          type="button"
                          onClick={() => { setSelectedCategoryType('classe'); setSelectedCategoryName(cls.name); }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#2c263c] border border-purple-500/40 text-white font-medium'
                              : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-500 text-[10px]">&gt;</span>
                            <span>{cls.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono">{cls.count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION: ORIGEM */}
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-2 py-1">
                  ORIGEM
                </div>
                <div className="space-y-0.5 pl-1 max-h-[380px] overflow-y-auto pr-1">
                  {ORDEM_ORIGINS.map(orig => {
                    const isSelected = selectedCategoryType === 'origem' && selectedCategoryName.toLowerCase() === orig.name.toLowerCase();
                    return (
                      <button
                        key={orig.name}
                        type="button"
                        onClick={() => { setSelectedCategoryType('origem'); setSelectedCategoryName(orig.name); }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#2c263c] border border-purple-500/40 text-white font-medium shadow-sm'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="truncate pr-1">{orig.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono shrink-0">1</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* "+ Nova estrutura" button */}
            <button
              type="button"
              onClick={onOpenCreateSkill}
              className="mt-3 w-full py-2 rounded-xl border border-dashed border-white/10 hover:border-purple-500/40 text-gray-400 hover:text-purple-300 text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova estrutura</span>
            </button>

          </div>

          {/* COLUMN 2: CENTER ABILITY LIST */}
          <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto bg-[#0f0e15]/40">
            <div>
              {/* Subheader and Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                <span className="text-xs text-gray-400">
                  {selectedCategoryName} · {filteredSkills.length} {filteredSkills.length === 1 ? 'habilidade' : 'habilidades'}
                </span>

                <div className="flex items-center gap-3">
                  {/* Sorting */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-gray-500">Ordenar</span>
                    <button
                      type="button"
                      onClick={() => setSortBy('nivel')}
                      className={`px-2.5 py-0.5 rounded-full text-xs transition-colors cursor-pointer ${
                        sortBy === 'nivel' ? 'bg-[#5b4d75] text-white font-semibold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Nível
                    </button>
                    <button
                      type="button"
                      onClick={() => setSortBy('nome')}
                      className={`px-2.5 py-0.5 rounded-full text-xs transition-colors cursor-pointer ${
                        sortBy === 'nome' ? 'bg-[#5b4d75] text-white font-semibold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Nome
                    </button>
                    <button
                      type="button"
                      onClick={() => setSortAsc(prev => !prev)}
                      className="p-1 text-gray-400 hover:text-white cursor-pointer"
                      title="Inverter ordem"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-white cursor-pointer"
                      title="Filtros avançados"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* View mode toggle */}
                  <div className="flex items-center gap-0.5 bg-black/40 p-0.5 rounded-full border border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => setViewMode('lista')}
                      className={`px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1 cursor-pointer ${
                        viewMode === 'lista' ? 'bg-[#5b4d75] text-white font-semibold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <List className="w-3 h-3" />
                      <span>Lista</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('cards')}
                      className={`px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1 cursor-pointer ${
                        viewMode === 'cards' ? 'bg-[#5b4d75] text-white font-semibold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Grid className="w-3 h-3" />
                      <span>Cards</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* LIST ITEMS */}
              <div className="space-y-2">
                {filteredSkills.map(skill => {
                  const isSelected = selectedSkill.id === skill.id;
                  return (
                    <div
                      key={skill.id}
                      onClick={() => setSelectedSkillId(skill.id)}
                      className={`rounded-2xl p-3 flex items-center gap-3.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border border-purple-500/50 bg-[#252033]/90 shadow-md shadow-purple-950/40'
                          : 'border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'
                      }`}
                    >
                      {/* NV circle badge */}
                      <div className="w-10 h-10 rounded-full border border-purple-400/40 flex flex-col items-center justify-center shrink-0 text-purple-200 bg-purple-950/20">
                        <span className="text-[8px] font-mono leading-none">NV</span>
                        <span className="text-xs font-bold leading-none mt-0.5">{skill.level}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-white truncate">
                          {skill.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5 truncate">
                          <Leaf className="w-3 h-3 text-green-400 shrink-0" />
                          <span className="truncate">{skill.type} · {skill.source}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredSkills.length === 0 && (
                  <div className="py-16 text-center text-gray-500 text-xs">
                    Nenhuma habilidade cadastrada para {selectedCategoryName} com os filtros atuais.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUMN 3: RIGHT DETAIL PANEL */}
          <div className="w-80 border-l border-white/[0.08] p-5 flex flex-col justify-between bg-[#15131e]/70 shrink-0">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-400" />
                  <h3 className="font-bold text-base text-white font-cinzel">
                    {selectedSkill.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFavorite(selectedSkill.id)}
                  className={`p-1 transition-colors cursor-pointer ${
                    selectedSkill.isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'
                  }`}
                  title={selectedSkill.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Type Badges */}
              <div className="flex items-center gap-1.5 mb-4">
                <span className="bg-green-950/40 text-green-400 border border-green-700/40 text-[10px] px-2 py-0.5 rounded-md font-medium">
                  {selectedSkill.type}
                </span>
                <span className="bg-white/5 text-gray-300 text-[10px] px-2 py-0.5 rounded-md">
                  Padrão do antecedente
                </span>
              </div>

              {/* Grid: Nível & Custo */}
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-white/[0.06] mb-3">
                <div>
                  <div className="text-[10px] text-gray-400 font-mono uppercase">NÍVEL</div>
                  <div className="text-sm font-bold text-gray-200 mt-0.5">{selectedSkill.level}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-mono uppercase">CUSTO</div>
                  <div className="text-sm font-bold text-gray-200 mt-0.5">{selectedSkill.cost}</div>
                </div>
              </div>

              {/* Source Note */}
              <div className="italic text-[11px] text-amber-200/50 leading-relaxed mb-3">
                {selectedSkill.source}
              </div>

              {/* Description */}
              <div className="text-xs text-gray-200 leading-relaxed">
                {selectedSkill.description}
              </div>

              {/* Origin tag */}
              <div className="mt-4">
                <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">ORIGEM</div>
                <span className="bg-white/5 px-2.5 py-1 rounded-lg text-xs text-gray-300 inline-block border border-white/[0.05]">
                  {selectedSkill.categoryName}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <p className="text-[11px] text-gray-500 text-center font-sans">
                {characterName ? `Adquirir para ${characterName}` : 'Escolha um personagem para adquirir habilidades.'}
              </p>
              {onAddSkillToCharacter && (
                <button
                  type="button"
                  onClick={() => onAddSkillToCharacter(selectedSkill)}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-95 shadow-md shadow-purple-900/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar à Ficha</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onShareInChat(selectedSkill)}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Mostrar no chat</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
