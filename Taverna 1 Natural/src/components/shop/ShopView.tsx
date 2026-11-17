import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Coins, 
  Crown, 
  Heart, 
  Sparkles, 
  Check, 
  Search, 
  Dices, 
  X,
  CreditCard
} from 'lucide-react';
import { ShopItem, ShopCategory, SubscriptionPlan } from '../../types/shop';
import { SUBSCRIPTION_PLANS } from '../../services/storage.service';

interface ShopViewProps {
  items: ShopItem[];
  userCoins: number;
  userPlan: string;
  onBuyItem: (item: ShopItem) => void;
  onUpgradePlan: (planId: 'explorador' | 'duque' | 'arquiduque') => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  items,
  userCoins,
  userPlan,
  onBuyItem,
  onUpgradePlan,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim() && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-32 max-w-[1240px] mx-auto px-6 lg:px-12 pt-6 animate-fadeIn">
      
      {/* Top Banner: Loja Oficial & Saldo */}
      <div className="p-6 rounded-3xl border border-yellow-500/30 bg-gradient-to-r from-yellow-950/40 via-black/80 to-purple-950/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs text-yellow-400 font-bold bg-yellow-500/10 px-2.5 py-0.5 rounded-full border border-yellow-500/30">
            <Crown className="w-3.5 h-3.5" />
            <span>Marketplace Oficial Dark Age</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
            Cosméticos, Dados 3D & Assinaturas
          </h1>
          <p className="text-xs text-gray-300 leading-relaxed">
            Personalize suas sessões com bordas animadas para avatares, dados poliédricos com física realista e recursos ilimitados de mesa virtual.
          </p>
        </div>

        {/* Saldo de Moedas & Planos Trigger */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="p-3 rounded-2xl bg-black/60 border border-yellow-500/40 flex items-center gap-3">
            <Coins className="w-6 h-6 text-yellow-400" />
            <div>
              <div className="text-[10px] text-yellow-500 uppercase font-bold tracking-wider">Saldo de Moedas</div>
              <div className="font-mono text-base font-bold text-white">{userCoins} moedas</div>
            </div>
            <button
              onClick={() => alert('Recarga de Moedas: Escolha pacotes a partir de R$ 9,90 no checkout.')}
              className="btn-gold text-xs px-3 py-1.5 rounded-xl ml-2 font-bold shadow-md"
            >
              Obter moedas
            </button>
          </div>

          <button
            onClick={() => setShowPlansModal(true)}
            className="btn-primary text-xs px-4 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-purple-600/30"
          >
            <Crown className="w-4 h-4 text-yellow-300" />
            <span>Ver Planos Duque</span>
          </button>
        </div>
      </div>

      {/* Category Chips & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto text-xs w-full sm:w-auto py-1">
          {['all', 'Bordas', 'Dados', 'Campanhas', 'Mapas'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 border-purple-400 text-white font-semibold shadow-md'
                  : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              {cat === 'all' ? 'Todos os Produtos' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar na loja..."
            className="glass-input w-full pl-9 pr-3 py-1.5 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-[#141520]/80 glass-panel overflow-hidden hover:border-purple-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="h-44 w-full relative overflow-hidden bg-gradient-to-br from-purple-950/60 to-black/80 flex items-center justify-center">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <Sparkles className="w-10 h-10 text-purple-400/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141520] via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-purple-300 z-10">
                  {item.category}
                </span>
              </div>

              <div className="p-4 space-y-1">
                <h3 className="font-cinzel text-sm font-bold text-white group-hover:text-purple-300 line-clamp-1">
                  {item.title}
                </h3>
                <div className="text-xs text-yellow-400 font-mono font-bold flex items-center gap-1.5 pt-1">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{item.priceCoins} moedas</span>
                  <span className="text-gray-400 font-normal">· ou R$ {item.priceReal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
              <button
                onClick={() => alert(`Item "${item.title}" adicionado à sua Lista de Desejos!`)}
                className="p-2 text-gray-400 hover:text-red-400 glass-button rounded-xl"
                title="Adicionar à lista de desejos"
              >
                <Heart className="w-4 h-4" />
              </button>

              <button
                onClick={() => onBuyItem(item)}
                className="btn-primary flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <span>Comprar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: PLANOS DE ASSINATURA */}
      {showPlansModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-panel-elevated max-w-4xl w-full rounded-2xl p-6 relative animate-modal-in border border-white/10 shadow-2xl max-h-[92vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-white">Planos de Apoio Dark Age</h3>
                <p className="text-xs text-purple-400">Escolha o nível ideal de armazenamento e recursos para o seu grupo</p>
              </div>
              <button onClick={() => setShowPlansModal(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4 pr-1">
              {SUBSCRIPTION_PLANS.map(plan => {
                const isCurrent = userPlan === plan.id;
                return (
                  <div 
                    key={plan.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                      plan.id === 'duque' 
                        ? 'border-yellow-500/60 bg-gradient-to-b from-yellow-950/20 to-black/60 shadow-xl shadow-yellow-900/20' 
                        : 'border-white/10 bg-black/40'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-cinzel text-lg font-bold text-white">{plan.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          plan.id === 'duque' 
                            ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' 
                            : 'bg-white/10 border-white/20 text-gray-300'
                        }`}>
                          {plan.badgeText}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="font-mono text-2xl font-extrabold text-white">
                          {plan.priceMonthly === 0 ? 'Gratuito' : `R$ ${plan.priceMonthly.toFixed(2)}`}
                        </div>
                        {plan.priceMonthly > 0 && (
                          <div className="text-[10px] text-gray-400">por mês, cancele quando quiser</div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                        <div className="font-semibold text-purple-300">
                          {plan.cloudStorage} de nuvem
                        </div>
                        {plan.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2 text-gray-300 text-[11px]">
                            <Check className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onUpgradePlan(plan.id);
                        setShowPlansModal(false);
                      }}
                      disabled={isCurrent}
                      className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isCurrent 
                          ? 'bg-white/10 text-gray-400 cursor-not-allowed' 
                          : plan.id === 'duque' 
                            ? 'btn-gold shadow-lg' 
                            : 'btn-primary'
                      }`}
                    >
                      {isCurrent ? 'Plano Atual' : `Assinar ${plan.name}`}
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
