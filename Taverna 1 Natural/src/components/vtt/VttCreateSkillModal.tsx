import React, { useState } from 'react';
import { 
  X, 
  Leaf, 
  Sliders, 
  Sparkles, 
  Coins, 
  TrendingUp, 
  Zap, 
  ChevronDown, 
  Quote, 
  Code, 
  Link2, 
  List, 
  ListOrdered, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Eraser 
} from 'lucide-react';
import { VttSkillItem } from './VttSkillsCatalogModal';
import { ORDEM_ORIGINS } from '../../services/character-rules.service';

interface VttCreateSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSkill: (skill: VttSkillItem) => void;
}

export const VttCreateSkillModal: React.FC<VttCreateSkillModalProps> = ({
  isOpen,
  onClose,
  onSaveSkill,
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'origem' | 'custo' | 'bonus' | 'acoes'>('geral');
  
  const [title, setTitle] = useState('');
  const [skillType, setSkillType] = useState<'Passiva' | 'Ativa'>('Passiva');
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  const [originCategory, setOriginCategory] = useState<'Origem' | 'Classe'>('Origem');
  const [selectedOrigin, setSelectedOrigin] = useState('Agente de Saúde');
  const [level, setLevel] = useState<number>(5);
  const [energyCost, setEnergyCost] = useState<string>('Sem custo');
  const [actionEconomy, setActionEconomy] = useState<string>('Padrão');

  if (!isOpen) return null;

  const isFormValid = title.trim().length > 0 && description.trim().length > 0 && selectedOrigin.length > 0;

  const handleCreate = () => {
    if (!isFormValid) return;

    const newSkill: VttSkillItem = {
      id: 'skill-' + Date.now(),
      name: title.trim(),
      level: level,
      cost: skillType === 'Passiva' ? 'Sem custo' : energyCost,
      type: skillType,
      category: originCategory,
      categoryName: selectedOrigin,
      source: `${originCategory}: ${selectedOrigin}`,
      description: description.trim(),
      additionalInfo: additionalInfo.trim() || undefined,
      isFavorite: false
    };

    onSaveSkill(newSkill);
    onClose();
  };

  const renderRichTextToolbar = () => (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171420] border-b border-white/[0.06] text-gray-400 text-xs">
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.04] text-[11px] text-gray-300">
        <span>Normal</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </div>
      <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
      <button type="button" className="p-1 hover:text-white transition-colors" title="Citação">
        <Quote className="w-3.5 h-3.5" />
      </button>
      <button type="button" className="p-1 hover:text-white transition-colors" title="Código">
        <Code className="w-3.5 h-3.5" />
      </button>
      <button type="button" className="p-1 hover:text-white transition-colors" title="Link">
        <Link2 className="w-3.5 h-3.5" />
      </button>
      <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
      <button type="button" className="p-1 hover:text-white transition-colors" title="Lista com marcadores">
        <List className="w-3.5 h-3.5" />
      </button>
      <button type="button" className="p-1 hover:text-white transition-colors" title="Lista numerada">
        <ListOrdered className="w-3.5 h-3.5" />
      </button>
      <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
      <button type="button" className="p-1 hover:text-white transition-colors font-bold" title="Negrito">
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button type="button" className="p-1 hover:text-white transition-colors italic" title="Itálico">
        <Italic className="w-3.5 h-3.5" />
      </button>
      <button type="button" className="p-1 hover:text-white transition-colors underline" title="Sublinhado">
        <Underline className="w-3.5 h-3.5" />
      </button>
      <button type="button" className="p-1 hover:text-white transition-colors line-through" title="Tachado">
        <Strikethrough className="w-3.5 h-3.5" />
      </button>
      <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
      <button type="button" className="p-1 hover:text-white transition-colors" title="Alinhar à esquerda">
        <AlignLeft className="w-3.5 h-3.5" />
      </button>
      <button type="button" className="p-1 hover:text-white transition-colors" title="Centralizar">
        <AlignCenter className="w-3.5 h-3.5" />
      </button>
      <button type="button" className="p-1 hover:text-white transition-colors" title="Alinhar à direita">
        <AlignRight className="w-3.5 h-3.5" />
      </button>
      <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
      <button type="button" className="p-1 hover:text-white transition-colors" title="Limpar formatação">
        <Eraser className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md select-none animate-modal-in">
      
      {/* MODAL WINDOW */}
      <div className="w-full max-w-4xl h-[82vh] max-h-[740px] bg-[#121118]/98 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-gray-200">
        
        {/* HEADER */}
        <div className="h-16 px-6 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#161320]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-900/30 border border-green-500/40 text-green-400 flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                NOVA HABILIDADE
              </div>
              <h3 className="font-cinzel text-base font-bold text-white tracking-wide">
                {title.trim() ? title : 'Sem título'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY: STEP NAVIGATION & FORM */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* STEP NAVIGATION (Left) */}
          <div className="w-48 border-r border-white/[0.08] p-3 space-y-1 bg-[#14121c]/40 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('geral')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'geral'
                  ? 'bg-[#2c263c] border border-purple-500/40 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>Geral</span>
              </div>
              {(!title.trim() || !description.trim()) && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('origem')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'origem'
                  ? 'bg-[#2c263c] border border-purple-500/40 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Origem</span>
              </div>
              {!selectedOrigin && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('custo')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'custo'
                  ? 'bg-[#2c263c] border border-purple-500/40 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Coins className="w-3.5 h-3.5" />
                <span>Custo</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bonus')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'bonus'
                  ? 'bg-[#2c263c] border border-purple-500/40 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Bônus</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('acoes')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'acoes'
                  ? 'bg-[#2c263c] border border-purple-500/40 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Ações</span>
              </div>
            </button>
          </div>

          {/* MAIN FORM CONTENT */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#0f0e15]/50">
            {activeTab === 'geral' && (
              <div className="space-y-5">
                
                {/* ROW 1: TITLE & TYPE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1.5">
                      Título da habilidade <span className="text-red-400 text-[10px]">obrigatório</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex.: Golpe poderoso"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#181622] border border-white/[0.09] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1.5">
                      Tipo
                    </label>
                    <div className="flex items-center gap-1 bg-[#181622] p-1 rounded-xl border border-white/[0.09]">
                      <button
                        type="button"
                        onClick={() => setSkillType('Passiva')}
                        className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          skillType === 'Passiva' ? 'bg-[#5b4d75] text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Passiva
                      </button>
                      <button
                        type="button"
                        onClick={() => setSkillType('Ativa')}
                        className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          skillType === 'Ativa' ? 'bg-[#5b4d75] text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Ativa
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {skillType === 'Passiva' ? 'Passiva: age sozinha, sem ser usada.' : 'Ativa: exige consumo de ação ou recursos para ativação.'}
                    </p>
                  </div>
                </div>

                {/* ROW 2: DESCRIPTION (RICH TEXT EDITOR) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-gray-300">
                      Descrição <span className="text-red-400 text-[10px]">obrigatório</span>
                    </label>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {description.length} caracteres
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/[0.09] overflow-hidden bg-[#181622]">
                    {renderRichTextToolbar()}
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva o efeito principal da habilidade..."
                      className="w-full p-3 text-xs text-white placeholder-gray-500 bg-transparent resize-none focus:outline-none leading-relaxed"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Texto principal lido pelos jogadores. Use [colchetes] para destacar termos em negrito.
                  </p>
                </div>

                {/* ROW 3: ADDITIONAL INFO (RICH TEXT EDITOR) */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1.5">
                    Informação adicional
                  </label>
                  <div className="rounded-xl border border-white/[0.09] overflow-hidden bg-[#181622]">
                    {renderRichTextToolbar()}
                    <textarea
                      rows={3}
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Requisitos, efeitos condicionais, notas do mestre..."
                      className="w-full p-3 text-xs text-white placeholder-gray-500 bg-transparent resize-none focus:outline-none leading-relaxed"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Opcional. Aparece em itálico logo abaixo do título: requisitos, condições, exemplos de uso.
                  </p>
                </div>

              </div>
            )}

            {activeTab === 'origem' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setOriginCategory('Origem')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      originCategory === 'Origem' ? 'bg-[#5b4d75] text-white' : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    Origens do Sistema
                  </button>
                  <button
                    type="button"
                    onClick={() => setOriginCategory('Classe')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      originCategory === 'Classe' ? 'bg-[#5b4d75] text-white' : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    Classes de Personagem
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
                  {originCategory === 'Origem' ? (
                    ORDEM_ORIGINS.map(orig => (
                      <button
                        key={orig.name}
                        type="button"
                        onClick={() => setSelectedOrigin(orig.name)}
                        className={`p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer border ${
                          selectedOrigin === orig.name
                            ? 'bg-[#2c263c] border-purple-500/50 text-white font-semibold'
                            : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {orig.name}
                      </button>
                    ))
                  ) : (
                    ['Combatente', 'Ocultista', 'Especialista'].map(cls => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setSelectedOrigin(cls)}
                        className={`p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer border ${
                          selectedOrigin === cls
                            ? 'bg-[#2c263c] border-purple-500/50 text-white font-semibold'
                            : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {cls}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'custo' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1.5">Nível / NEX Requerido</label>
                    <input
                      type="number"
                      value={level}
                      onChange={(e) => setLevel(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-white/[0.09] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1.5">Custo de Energia (PE/PM)</label>
                    <input
                      type="text"
                      value={energyCost}
                      onChange={(e) => setEnergyCost(e.target.value)}
                      placeholder="Ex: 2 PE ou Sem custo"
                      className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-white/[0.09] text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bonus' && (
              <div className="py-8 text-center text-gray-500 text-xs">
                Configure bônus passivos adicionados automaticamente a atributos e perícias.
              </div>
            )}

            {activeTab === 'acoes' && (
              <div className="py-8 text-center text-gray-500 text-xs">
                Configure macros e fórmulas de ataque/cura integradas a esta habilidade.
              </div>
            )}

          </div>

        </div>

        {/* FOOTER */}
        <div className="h-14 px-6 border-t border-white/[0.08] flex items-center justify-between shrink-0 bg-[#15131d]/90">
          <div className="text-xs text-gray-400">
            {!isFormValid ? (
              <span className="text-amber-300/80">Falta preencher o título, a descrição, a origem.</span>
            ) : (
              <span className="text-green-400">Todos os campos obrigatórios preenchidos.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-white/10 text-gray-300 hover:text-white text-xs cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!isFormValid}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isFormValid
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40 cursor-pointer active:scale-95'
                  : 'bg-purple-950/30 border border-purple-500/20 text-purple-400/50 cursor-not-allowed'
              }`}
            >
              + Criar habilidade
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
