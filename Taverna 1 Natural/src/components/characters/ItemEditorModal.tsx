import React, { useState } from 'react';
import { X, Check, Swords, Plus, Trash2 } from 'lucide-react';
import { CharacterItem, ItemCategory, ItemAction } from '../../types/items';

interface ItemEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveItem: (item: CharacterItem) => void;
  initialItem?: CharacterItem;
}

export const ItemEditorModal: React.FC<ItemEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveItem,
  initialItem,
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'custo' | 'bonus' | 'acoes' | 'receitas'>('geral');

  const [name, setName] = useState(initialItem?.name || '');
  const [category, setCategory] = useState<ItemCategory>(initialItem?.category || 'Arma');
  const [subcategory, setSubcategory] = useState(initialItem?.subcategory || '');
  const [description, setDescription] = useState(initialItem?.description || '');
  const [showInDiceRolls, setShowInDiceRolls] = useState(initialItem?.showInDiceRolls ?? true);

  const [weight, setWeight] = useState(initialItem?.weight || 1);
  const [price, setPrice] = useState(initialItem?.price || 10);
  const [quantity, setQuantity] = useState(initialItem?.quantity || 1);

  const [passiveBonusKey, setPassiveBonusKey] = useState(initialItem?.passiveBonuses[0]?.statKey || 'defense');
  const [passiveBonusVal, setPassiveBonusVal] = useState(initialItem?.passiveBonuses[0]?.value || 0);

  // Ações de ataque
  const [actions, setActions] = useState<ItemAction[]>(
    initialItem?.actions || [
      {
        id: 'act-new-1',
        name: 'Ataque Padrão',
        type: 'attack',
        formula: '1d20 + @AGI',
        criticalMargin: 20,
        range: 'Curto (9m)',
        targetStatusAffected: 'hp'
      }
    ]
  );

  if (!isOpen) return null;

  const handleAddAction = () => {
    setActions([
      ...actions,
      {
        id: 'act-' + Date.now(),
        name: 'Novo Ataque',
        type: 'attack',
        formula: '1d8 + @FOR',
        criticalMargin: 20,
        range: 'Corpo a corpo',
        targetStatusAffected: 'hp'
      }
    ]);
  };

  const handleUpdateAction = (idx: number, updated: Partial<ItemAction>) => {
    const list = [...actions];
    list[idx] = { ...list[idx], ...updated };
    setActions(list);
  };

  const handleRemoveAction = (idx: number) => {
    setActions(actions.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Informe o nome do item.');
      return;
    }

    const item: CharacterItem = {
      id: initialItem?.id || 'item-' + Date.now(),
      name: name.trim(),
      category,
      subcategory,
      description,
      equipped: initialItem?.equipped ?? true,
      quantity,
      weight,
      price,
      showInDiceRolls,
      passiveBonuses: passiveBonusVal !== 0 ? [{ statKey: passiveBonusKey, value: passiveBonusVal }] : [],
      actions
    };

    onSaveItem(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-elevated max-w-xl w-full rounded-2xl p-6 relative animate-modal-in border border-white/10 shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-purple-400" />
            <h3 className="font-cinzel text-lg font-bold text-white">
              {initialItem ? 'Editar Item' : 'Criar Novo Item'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Tabs */}
        <div className="flex gap-1.5 border-b border-white/10 py-2.5 text-xs">
          {(['geral', 'custo', 'bonus', 'acoes', 'receitas'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab === 'acoes' ? 'Ações' : tab === 'bonus' ? 'Bônus' : tab}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
          
          {/* TAB 1: GERAL */}
          {activeTab === 'geral' && (
            <div className="space-y-3">
              <div>
                <label className="text-gray-300 block mb-1">Nome do Item *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Machado de Guerra, Pistola .40, Amuleto..."
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ItemCategory)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs bg-black/40 text-gray-200"
                  >
                    <option value="Arma">Arma</option>
                    <option value="Munição">Munição</option>
                    <option value="Escudo">Escudo</option>
                    <option value="Armadura">Armadura</option>
                    <option value="Acessório">Acessório</option>
                    <option value="Consumível">Consumível</option>
                    <option value="Matéria-prima">Matéria-prima</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1">Subtipo</label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="Ex: Curto alcance, Duas mãos"
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Propriedades e história do objeto..."
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div className="p-3 rounded-xl border border-white/10 bg-black/30 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-200">Exibir em rolagem de dados</div>
                  <div className="text-[10px] text-gray-400">Ativa o botão de rolagem rápida na ficha.</div>
                </div>
                <input
                  type="checkbox"
                  checked={showInDiceRolls}
                  onChange={(e) => setShowInDiceRolls(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CUSTO */}
          {activeTab === 'custo' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1">Quantidade</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1">Peso / Espaço (kg)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1">Preço em Moedas</label>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BÔNUS */}
          {activeTab === 'bonus' && (
            <div className="space-y-3">
              <p className="text-gray-400">
                Bônus passivos atribuídos ao personagem enquanto o item estiver equipado:
              </p>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-white/10 bg-black/30">
                <div>
                  <label className="text-gray-300 block mb-1">Atributo ou Defesa</label>
                  <select
                    value={passiveBonusKey}
                    onChange={(e) => setPassiveBonusKey(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs bg-black/40 text-gray-200"
                  >
                    <option value="defense">Defesa / CA</option>
                    <option value="AGI">Agilidade / Destreza</option>
                    <option value="FOR">Força</option>
                    <option value="VIG">Vigor / Constituição</option>
                    <option value="INT">Intelecto / Inteligência</option>
                    <option value="PRE">Presença / Sabedoria</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1">Valor do Bônus</label>
                  <input
                    type="number"
                    value={passiveBonusVal}
                    onChange={(e) => setPassiveBonusVal(Number(e.target.value))}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AÇÕES & FÓRMULAS */}
          {activeTab === 'acoes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-semibold">Fórmulas de Ataque e Dano</span>
                <button
                  type="button"
                  onClick={handleAddAction}
                  className="glass-button text-xs px-2.5 py-1 rounded-lg text-purple-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Ação</span>
                </button>
              </div>

              {actions.map((act, idx) => (
                <div key={act.id || idx} className="p-3.5 rounded-xl border border-white/10 bg-black/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={act.name}
                      onChange={(e) => handleUpdateAction(idx, { name: e.target.value })}
                      placeholder="Nome da ação (ex: Disparo)"
                      className="glass-input px-2 py-1 rounded-lg text-xs font-semibold w-1/2"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAction(idx)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Excluir ação"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-400 block">Fórmula de Dano</label>
                      <input
                        type="text"
                        value={act.formula}
                        onChange={(e) => handleUpdateAction(idx, { formula: e.target.value })}
                        placeholder="Ex: 2d8 + @AGI"
                        className="glass-input w-full px-2 py-1 rounded-lg text-xs font-mono text-purple-300 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 block">Margem Crítica</label>
                      <input
                        type="number"
                        value={act.criticalMargin || 20}
                        onChange={(e) => handleUpdateAction(idx, { criticalMargin: Number(e.target.value) })}
                        className="glass-input w-full px-2 py-1 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 block">Alcance</label>
                      <input
                        type="text"
                        value={act.range || ''}
                        onChange={(e) => handleUpdateAction(idx, { range: e.target.value })}
                        placeholder="Curto (9m)"
                        className="glass-input w-full px-2 py-1 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: RECEITAS / CRAFTING */}
          {activeTab === 'receitas' && (
            <div className="space-y-3 text-gray-400">
              <p>Sistema de fabricação e ofício de itens de acordo com as regras do sistema.</p>
              <div className="p-4 rounded-xl border border-white/5 bg-black/20 text-center text-xs">
                Receita padrão: 2x Matéria-prima metálica · Teste de Profissão CD 15.
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <button 
            type="button" 
            onClick={onClose}
            className="glass-button px-4 py-2 rounded-xl text-xs text-gray-300"
          >
            Cancelar
          </button>
          
          <button 
            type="button" 
            onClick={handleSave}
            className="btn-primary px-6 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Salvar Item</span>
          </button>
        </div>

      </div>
    </div>
  );
};
