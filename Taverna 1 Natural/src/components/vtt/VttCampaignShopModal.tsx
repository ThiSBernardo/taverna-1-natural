import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Package, 
  Plus
} from 'lucide-react';
import { CharacterItem, ItemCategory } from '../../types/items';

interface VttCampaignShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEquipItem?: (item: CharacterItem) => void;
  onShowToast?: (msg: string) => void;
}

export const VttCampaignShopModal: React.FC<VttCampaignShopModalProps> = ({
  isOpen,
  onClose,
  onEquipItem,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const shopCatalog: CharacterItem[] = [
    {
      id: 'shop-item-1',
      name: 'Revólver Calibre .38',
      category: 'Arma',
      weight: 1,
      quantity: 1,
      equipped: false,
      price: 150,
      showInDiceRolls: true,
      passiveBonuses: [],
      description: 'Arma de fogo portátil de fácil manuseio. Dano: 2d6 Balístico, Crítico 19/x3.',
      actions: [
        {
          id: 'act-rev',
          name: 'Disparo de Revólver',
          type: 'attack',
          formula: '1d20 + 5',
          damageType: 'Balístico',
          criticalMargin: 19,
          criticalMultiplier: 3
        }
      ]
    },
    {
      id: 'shop-item-2',
      name: 'Faca Tática Militar',
      category: 'Arma',
      weight: 0.5,
      quantity: 1,
      equipped: false,
      price: 50,
      showInDiceRolls: true,
      passiveBonuses: [],
      description: 'Lâmina de combate em aço forjado. Dano: 1d4 + FOR Cortante, Crítico 19/x2.',
      actions: [
        {
          id: 'act-knife',
          name: 'Golpe de Faca',
          type: 'attack',
          formula: '1d20 + 5',
          damageType: 'Corte',
          criticalMargin: 19,
          criticalMultiplier: 2
        }
      ]
    },
    {
      id: 'shop-item-3',
      name: 'Colete Balístico Leve',
      category: 'Armadura',
      weight: 2,
      quantity: 1,
      equipped: false,
      price: 300,
      showInDiceRolls: false,
      passiveBonuses: [{ statKey: 'defense', value: 2 }],
      description: 'Proteção corporal de fibra de aramida. Defesa +2, Resistência a Balístico 2.',
      actions: []
    },
    {
      id: 'shop-item-4',
      name: 'Kit de Primeiros Socorros',
      category: 'Consumível',
      weight: 1,
      quantity: 3,
      equipped: false,
      price: 80,
      showInDiceRolls: false,
      passiveBonuses: [],
      description: 'Bandagens, torniquetes e antisséptico. Permite testes de Medicina para curar 2d8+INT PV.',
      actions: []
    },
    {
      id: 'shop-item-5',
      name: 'Lanterna Tática de Alta Potência',
      category: 'Acessório',
      weight: 0.5,
      quantity: 1,
      equipped: false,
      price: 45,
      showInDiceRolls: false,
      passiveBonuses: [],
      description: 'Alcance de iluminação de 15 metros em cone.',
      actions: []
    },
    {
      id: 'shop-item-6',
      name: 'Amuleto de Sangue Paranormal',
      category: 'Outro',
      weight: 0.2,
      quantity: 1,
      equipped: false,
      price: 500,
      showInDiceRolls: false,
      passiveBonuses: [],
      description: 'Relíquia menor imbuída pelo Outro Lado. Concede resistência a dano mental.',
      actions: []
    }
  ];

  if (!isOpen) return null;

  const categories = ['todos', 'Arma', 'Armadura', 'Consumível', 'Acessório', 'Outro'];

  const filteredItems = shopCatalog.filter(it => {
    const matchesSearch = !searchTerm.trim() || 
      it.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      it.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || it.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleAcquire = (item: CharacterItem) => {
    if (onEquipItem) onEquipItem(item);
    if (onShowToast) onShowToast(`"${item.name}" adicionado à mochila da campanha!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm select-none animate-modal-in">
      
      {/* WINDOW CONTAINER */}
      <div className="w-full max-w-4xl h-[80vh] max-h-[720px] bg-[#121118]/98 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-gray-200">
        
        {/* HEADER */}
        <div className="h-16 px-6 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#161320]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/25 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-md">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-base font-bold text-white tracking-wide">
                Loja de Itens da Campanha
              </h2>
              <p className="text-[10px] text-gray-400 font-sans">
                Arsenal, utilitários e relíquias para a crônica ativa
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar item ou equipamento..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full text-xs bg-[#1a1724]/90 border border-white/[0.08] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CATEGORY BAR */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-white/[0.06] bg-[#14121c]/40 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full capitalize transition-colors cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#5b4d75] text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat === 'todos' ? 'Todos os Itens' : cat}
            </button>
          ))}
        </div>

        {/* ITEMS LIST */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#0f0e15]/40 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-purple-500/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-semibold text-sm text-white font-cinzel">
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-purple-300 bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded-md font-mono">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.05] text-xs">
                <span className="text-gray-400 font-mono text-[11px]">
                  Peso: {item.weight} kg · Preço: {item.price} {item.currencyUnit || 'Créditos'}
                </span>

                <button
                  type="button"
                  onClick={() => handleAcquire(item)}
                  className="px-3 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adquirir</span>
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-2 py-16 text-center text-gray-500 text-xs">
              Nenhum item encontrado nesta categoria.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
