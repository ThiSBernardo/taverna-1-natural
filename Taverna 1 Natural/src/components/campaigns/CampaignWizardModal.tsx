import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Castle, 
  Users, 
  Sparkles, 
  BookOpen, 
  Check, 
  Eye, 
  Lock 
} from 'lucide-react';
import { Campaign } from '../../types/campaign';
import { RPGSystemId, RPG_SYSTEMS } from '../../types/rpg-systems';

interface CampaignWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: (campaign: Campaign) => void;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
}

const GENRE_TAGS = [
  'Terror', 'Dark Fantasy', 'Investigação', 'Suspense', 
  'Fantasia Clássica', 'Horror Cósmico', 'Cyberpunk', 
  'Pós-Apocalíptico', 'Mistério', 'Ficção Científica'
];

const PLAY_STYLES = [
  'Por Voz', 'Por Texto', 'Discord', 'Imersão Total', 
  'Com Gore', 'Sem Gore', 'Alta Dificuldade', 'Casual', 
  'One-shot', 'Campanha Longa'
];

export const CampaignWizardModal: React.FC<CampaignWizardModalProps> = ({
  isOpen,
  onClose,
  onCampaignCreated,
  currentUserId,
  currentUserName,
  currentUserAvatar,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Identidade
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop'
  );

  // Step 2: Sistema
  const [systemId, setSystemId] = useState<RPGSystemId>('ordem-paranormal');

  // Step 3: Atmosfera
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Terror', 'Investigação']);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Por Voz', 'Discord']);

  // Step 4: Mesa & Vagas
  const [maxPlayers, setMaxPlayers] = useState<number>(5);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [requiresApproval, setRequiresApproval] = useState<boolean>(true);

  if (!isOpen) return null;

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const handleFinish = () => {
    if (!title.trim()) {
      alert('Por favor, informe o título da campanha no Passo 1.');
      return;
    }

    const newCampaign: Campaign = {
      id: 'camp-' + Date.now(),
      title: title.trim(),
      synopsis: synopsis.trim(),
      coverImage,
      systemId,
      masterId: currentUserId,
      masterName: currentUserName,
      masterAvatar: currentUserAvatar,
      isMasterOnline: true,
      isPublic,
      requiresApproval,
      maxPlayers,
      genres: selectedGenres,
      playStyles: selectedStyles,
      isSessionActive: false,
      sessionsHistory: [],
      participants: [
        {
          userId: currentUserId,
          userName: currentUserName,
          userAvatar: currentUserAvatar,
          role: 'master',
          isOnline: true
        }
      ],
      chronicle: [],
      inviteCode: 'DARK-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onCampaignCreated(newCampaign);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="glass-panel-elevated max-w-2xl w-full rounded-2xl p-6 relative animate-modal-in border border-white/10 shadow-2xl max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Castle className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">
                Nova Mesa
              </span>
            </div>
            <h3 className="font-cinzel text-lg font-bold text-white tracking-wide mt-0.5">
              {currentStep === 1 && '1. Identidade da Campanha'}
              {currentStep === 2 && '2. Escolha o Sistema de Regras'}
              {currentStep === 3 && '3. Atmosfera & Estilo de Jogo'}
              {currentStep === 4 && '4. Mesa, Vagas & Visibilidade'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="py-2.5 flex items-center gap-2 border-b border-white/5">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${
                currentStep >= s 
                  ? 'bg-purple-500 shadow-sm shadow-purple-500/50' 
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Step Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
          
          {/* STEP 1: IDENTIDADE */}
          {currentStep === 1 && (
            <div className="space-y-3.5">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  Nome da Campanha *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: O Segredo da Floresta Sombria, O Chamado de Baróvia..."
                  className="glass-input w-full px-3 py-2 text-xs rounded-xl font-cinzel font-bold text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  Sinopse / Gancho Narrativo
                </label>
                <textarea
                  rows={4}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Apresente a premissa da aventura para atrair aventureiros corajosos..."
                  className="glass-input w-full px-3 py-2 text-xs rounded-xl leading-relaxed"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  URL da Capa de Fundo
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="glass-input w-full px-3 py-1.5 text-xs rounded-lg mb-2"
                />
                
                {/* Image Preview */}
                <div className="h-28 rounded-xl overflow-hidden border border-white/10 relative">
                  <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs text-white font-cinzel font-bold">{title || 'Título da Mesa'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SISTEMA */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <p className="text-gray-300">
                Selecione as regras e fichas que serão utilizadas nesta campanha:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {RPG_SYSTEMS.map(sys => (
                  <button
                    key={sys.id}
                    type="button"
                    onClick={() => setSystemId(sys.id)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      systemId === sys.id
                        ? 'border-purple-500 bg-purple-600/20 text-white shadow-md'
                        : 'border-white/5 bg-black/30 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <img src={sys.coverImage} alt={sys.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-200">{sys.name}</div>
                      <div className="text-[10px] text-purple-400 font-medium">{sys.badge}</div>
                      <div className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{sys.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: ATMOSFERA */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 font-semibold block mb-2">Gêneros Narrativos</label>
                <div className="flex flex-wrap gap-1.5">
                  {GENRE_TAGS.map(tag => {
                    const isSelected = selectedGenres.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleGenre(tag)}
                        className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                          isSelected
                            ? 'bg-purple-600 border-purple-400 text-white font-semibold'
                            : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-2">Estilo de Sessão</label>
                <div className="flex flex-wrap gap-1.5">
                  {PLAY_STYLES.map(style => {
                    const isSelected = selectedStyles.includes(style);
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleStyle(style)}
                        className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-400 text-white font-semibold'
                            : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MESA, VAGAS & VISIBILIDADE */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-gray-300 font-semibold">Limite de Vagas (Jogadores)</label>
                  <span className="font-bold text-sm text-purple-400 font-mono">{maxPlayers} aventureiros</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-gray-300 font-semibold block">Visibilidade da Campanha</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isPublic
                        ? 'border-purple-500 bg-purple-600/20 text-white'
                        : 'border-white/10 bg-black/30 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <Eye className="w-4 h-4 text-purple-400" />
                      <span>Pública (Descubra)</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Aparece nas buscas e na página inicial para novos jogadores solicitarem vaga.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      !isPublic
                        ? 'border-purple-500 bg-purple-600/20 text-white'
                        : 'border-white/10 bg-black/30 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <Lock className="w-4 h-4 text-yellow-400" />
                      <span>Privada (Convite)</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Apenas jogadores com seu link ou código único poderão acessar.
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-white/10 bg-black/30 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-200">Requer aprovação do mestre</div>
                  <div className="text-[10px] text-gray-400">Você aprova manualmente cada ficha antes de liberar a mesa.</div>
                </div>
                <input
                  type="checkbox"
                  checked={requiresApproval}
                  onChange={(e) => setRequiresApproval(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="glass-button px-4 py-2 rounded-xl text-xs text-gray-300 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="glass-button px-4 py-2 rounded-xl text-xs text-gray-400"
            >
              Cancelar
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn-primary px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Continuar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="btn-primary px-6 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-600/50"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Criar Mesa Oficial</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
