import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Castle, 
  Users, 
  Dices, 
  MessageSquare, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Shield,
  BookOpen,
  Award
} from 'lucide-react';

export interface PublicPlayerProfile {
  id: string;
  name: string;
  friendCode: string;
  discordTag: string;
  avatar: string;
  bannerImage: string;
  titleBadge: string;
  bio: string;
  likesCount: number;
  campaignsCount: number;
  charactersCount: number;
  chatMessagesCount: number;
  diceRollsCount: number;
  badges: { id: string; name: string; icon: string; rarity: string }[];
  rpgDna: { genre: string; percentage: number; color: string }[];
  favoriteSystem: { name: string; poster: string; badge: string };
  currentCampaign: { title: string; system: string; role: string; cover: string };
  guild: { name: string; tag: string; color: string; memberCount: number };
  characters: {
    id: string;
    name: string;
    className: string;
    levelOrNex: string;
    system: string;
    cutoutImage: string;
    fullArt: string;
  }[];
}

interface PublicProfileModalProps {
  isOpen: boolean;
  profile: PublicPlayerProfile | null;
  onClose: () => void;
  onAddFriend: (code: string) => void;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onAddFriend,
}) => {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(profile?.likesCount || 5);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [selectedCharacterArt, setSelectedCharacterArt] = useState<string | null>(null);

  if (!isOpen || !profile) return null;

  const handleToggleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      
      {/* 1. SPLASH SCREEN CINEMATOGRÁFICA DE ABERTURA */}
      {!hasEntered ? (
        <div className="relative max-w-2xl w-full rounded-3xl overflow-hidden border border-purple-500/30 glass-panel-elevated shadow-2xl p-8 sm:p-12 text-center space-y-6">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
            style={{ backgroundImage: `url(${profile.bannerImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent pointer-events-none" />

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white p-1 rounded-full bg-black/40"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 space-y-4">
            <div className="relative w-28 h-28 mx-auto">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-full h-full rounded-full object-cover ring-4 ring-purple-500/60 shadow-2xl"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] bg-purple-600 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-md">
                {profile.titleBadge}
              </span>
            </div>

            <div>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                {profile.name}
              </h2>
              <p className="text-xs text-purple-300 font-mono mt-0.5">
                {profile.discordTag} · #{profile.friendCode}
              </p>
            </div>

            {/* Badges Preview */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {profile.badges.slice(0, 5).map(b => (
                <div 
                  key={b.id} 
                  className="w-9 h-9 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-base shadow-md"
                  title={b.name}
                >
                  {b.icon}
                </div>
              ))}
            </div>

            <p className="font-spectral text-sm text-gray-300 max-w-md mx-auto italic leading-relaxed pt-2">
              "{profile.bio}"
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setHasEntered(true)}
                className="w-full sm:w-auto btn-primary px-8 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase shadow-xl shadow-purple-600/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Ver Biblioteca</span>
              </button>

              <button
                onClick={() => onAddFriend(profile.friendCode)}
                className="w-full sm:w-auto glass-button px-6 py-3 rounded-2xl text-xs font-semibold text-gray-200 hover:text-white"
              >
                + Adicionar Amigo
              </button>
            </div>
          </div>
        </div>
      ) : (

        /* 2. VITRINE COMPLETA DA BIBLIOTECA PÚBLICA */
        <div className="relative max-w-5xl w-full rounded-3xl overflow-hidden border border-white/10 glass-panel-elevated shadow-2xl max-h-[94vh] flex flex-col">
          
          {/* Header Superior com Banner e Avatar */}
          <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-purple-950/40 shrink-0">
            <img 
              src={profile.bannerImage} 
              alt={profile.name}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10111a] via-[#10111a]/40 to-transparent" />

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 text-gray-300 hover:text-white p-2 rounded-full bg-black/60 backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Bar in Banner */}
            <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-purple-500/70 shadow-2xl shrink-0 bg-black">
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
                      {profile.name}
                    </h3>
                    <span className="text-[10px] bg-purple-600/40 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
                      {profile.titleBadge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5">
                    {profile.campaignsCount} Campanhas · {profile.charactersCount} Personagens
                  </p>
                </div>
              </div>

              {/* Botão de Curtir & Amizade */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleLike}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    hasLiked
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-lg shadow-red-500/20'
                      : 'glass-button text-gray-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-400 text-red-400' : ''}`} />
                  <span>{likes}</span>
                </button>

                <button
                  onClick={() => onAddFriend(profile.friendCode)}
                  className="btn-primary px-4 py-1.5 rounded-xl text-xs font-semibold"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* Corpo Rolável da Vitrine */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Grid 2x2 de Estatísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Campanhas</div>
                <div className="font-rajdhani text-2xl sm:text-3xl font-bold text-white mt-1">
                  {profile.campaignsCount}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Personagens</div>
                <div className="font-rajdhani text-2xl sm:text-3xl font-bold text-purple-300 mt-1">
                  {profile.charactersCount}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Mensagens</div>
                <div className="font-rajdhani text-2xl sm:text-3xl font-bold text-indigo-300 mt-1">
                  {profile.chatMessagesCount.toLocaleString()}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-center">
                <div className="text-[10px] text-yellow-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1">
                  <Dices className="w-3 h-3" />
                  <span>Rolagens de Dados</span>
                </div>
                <div className="font-rajdhani text-2xl sm:text-3xl font-bold text-yellow-300 mt-1">
                  {profile.diceRollsCount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Carrossel de Personagens Recortados (Cutout PNG) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <h4 className="font-cinzel text-base font-bold text-white tracking-wide">
                    Personagens Criados
                  </h4>
                </div>
                <span className="text-xs text-gray-400">Clique para ver arte completa em alta resolução</span>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
                {profile.characters.map(char => (
                  <div
                    key={char.id}
                    onClick={() => setSelectedCharacterArt(char.fullArt)}
                    className="group relative w-44 shrink-0 rounded-2xl border border-white/10 bg-black/40 p-3 hover:border-purple-500/60 transition-all cursor-pointer flex flex-col items-center text-center shadow-lg hover:scale-105"
                  >
                    <div className="w-28 h-36 relative flex items-center justify-center overflow-hidden">
                      <img 
                        src={char.cutoutImage} 
                        alt={char.name}
                        className="max-h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-2 w-full">
                      <div className="font-cinzel text-xs font-bold text-white truncate group-hover:text-purple-300">
                        {char.name}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate">
                        {char.className} · {char.levelOrNex}
                      </div>
                      <span className="text-[9px] text-purple-400 font-mono mt-1 block">
                        {char.system}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DNA de RPG & Sistema Favorito */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* DNA de RPG (Gráfico de Barras) */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h4 className="font-cinzel text-sm font-bold text-white">DNA de RPG</h4>
                </div>
                <div className="space-y-2.5">
                  {profile.rpgDna.map(dna => (
                    <div key={dna.genre} className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-300">
                        <span>{dna.genre}</span>
                        <span className="font-mono font-bold text-purple-300">{dna.percentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${dna.percentage}%`,
                            backgroundColor: dna.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informações Auxiliares: Sistema, Campanha e Guilda */}
              <div className="space-y-3">
                
                {/* Sistema Favorito */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
                  <img 
                    src={profile.favoriteSystem.poster} 
                    alt={profile.favoriteSystem.name}
                    className="w-12 h-16 rounded-lg object-cover ring-1 ring-white/10 shrink-0" 
                  />
                  <div>
                    <span className="text-[10px] text-purple-400 font-bold uppercase">Sistema Favorito</span>
                    <div className="font-cinzel font-bold text-sm text-white">{profile.favoriteSystem.name}</div>
                    <span className="text-[9px] bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {profile.favoriteSystem.badge}
                    </span>
                  </div>
                </div>

                {/* Campanha Atual */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
                  <img 
                    src={profile.currentCampaign.cover} 
                    alt={profile.currentCampaign.title}
                    className="w-12 h-12 rounded-lg object-cover ring-1 ring-white/10 shrink-0" 
                  />
                  <div>
                    <span className="text-[10px] text-yellow-400 font-bold uppercase">Campanha em Andamento</span>
                    <div className="font-bold text-xs text-white truncate max-w-xs">{profile.currentCampaign.title}</div>
                    <div className="text-[10px] text-gray-400">
                      {profile.currentCampaign.system} · {profile.currentCampaign.role}
                    </div>
                  </div>
                </div>

                {/* Guilda */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="font-bold text-xs text-white">{profile.guild.name}</div>
                      <div className="text-[10px] text-gray-400">
                        Tag: <strong className="text-purple-300 font-mono">[{profile.guild.tag}]</strong> · {profile.guild.memberCount} membros
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>

              </div>

            </div>

            {/* Coleção Completa de Insígnias */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <h4 className="font-cinzel text-base font-bold text-white tracking-wide">
                  Vitrine de Insígnias Conquistadas
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {profile.badges.map(b => (
                  <div key={b.id} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
                    <span className="text-xl">{b.icon}</span>
                    <div className="truncate">
                      <div className="font-bold text-[11px] text-gray-200 truncate">{b.name}</div>
                      <div className="text-[9px] text-purple-400 capitalize">{b.rarity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Player de Trilha Sonora Flutuante Fiel ao Dark Age */}
          <div className="p-3 px-6 border-t border-white/10 bg-[#0d0e14] flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md hover:scale-105"
              >
                {isPlayingMusic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-purple-300 font-medium">♫ Main Theme (Dark Fantasy)</span>
                {isPlayingMusic && (
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-purple-500 rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-purple-400 rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-2 bg-purple-600 rounded-full animate-pulse delay-150" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={onClose}
                className="glass-button px-4 py-1.5 rounded-xl text-gray-300 hover:text-white"
              >
                Fechar
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 3. LIGHTBOX MODAL DE ARTE EM ALTA RESOLUÇÃO */}
      {selectedCharacterArt && (
        <div 
          onClick={() => setSelectedCharacterArt(null)}
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fadeIn cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img 
              src={selectedCharacterArt} 
              alt="Personagem em Alta Resolução"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <button 
              onClick={() => setSelectedCharacterArt(null)}
              className="absolute top-3 right-3 text-white p-2 rounded-full bg-black/70 hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
