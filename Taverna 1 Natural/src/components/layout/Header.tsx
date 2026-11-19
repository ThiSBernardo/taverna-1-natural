import React, { useState } from 'react';
import { 
  Castle, 
  Coins, 
  Zap,
  Megaphone, 
  Users, 
  Bell, 
  User,
  Info, 
  LogOut, 
  Crown, 
  Palette, 
  FolderGit2, 
  X,
  ExternalLink,
  Home,
  Compass,
  Shield,
  Bookmark,
  BookOpen,
  Library,
  Plus,
  Dices,
  Menu
} from 'lucide-react';
import { UserProfile } from '../../types/user';

export type MainNavRoute = 'campanhas' | 'descubra' | 'guildas';

export interface HeaderProps {
  user: UserProfile;
  currentRoute: MainNavRoute;
  onRouteChange: (route: MainNavRoute) => void;
  onOpenCreateMenu: () => void;
  onOpenProfile: () => void;
  onOpenFriends: () => void;
  onOpenLibrary: () => void;
  onOpenChangelog: () => void;
  onNavigateHome: () => void;
  onLogout?: () => void;
  onOpenDice3D?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentRoute,
  onRouteChange,
  onOpenCreateMenu,
  onOpenProfile,
  onOpenFriends,
  onOpenLibrary,
  onOpenChangelog,
  onNavigateHome,
  onLogout,
  onOpenDice3D,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadNotifs = user.notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0B0E14]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 xl:px-[70px] py-2.5">
        <div className="w-full mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button 
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer shrink-0"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white group-hover:text-purple-300 transition-colors">
                <Castle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="h-5 w-px bg-white/20 hidden sm:block" />
            </button>

            <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs font-cinzel tracking-wider">
              <button
                type="button"
                onClick={() => onRouteChange('campanhas')}
                className={`flex items-center gap-2 py-1.5 transition-all cursor-pointer ${
                  currentRoute === 'campanhas'
                    ? 'text-white border-b-2 border-white pb-0.5 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Castle className="w-4 h-4" />
                <span>Início</span>
              </button>

              <button
                type="button"
                onClick={() => onRouteChange('descubra')}
                className={`flex items-center gap-2 transition-all cursor-pointer ${
                  currentRoute === 'descubra'
                    ? 'text-white border border-purple-500/70 bg-purple-950/30 px-3.5 py-1 rounded-full font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                    : 'text-slate-400 hover:text-white px-2 py-1.5'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Descubra</span>
              </button>

              <button
                type="button"
                onClick={() => onRouteChange('guildas')}
                className={`flex items-center gap-2 py-1.5 transition-all cursor-pointer ${
                  currentRoute === 'guildas'
                    ? 'text-white border-b-2 border-white pb-0.5 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Guildas</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 shrink-0">
            <button
              type="button"
              onClick={onOpenCreateMenu}
              className="bg-[#8A4FFF] hover:bg-[#7839EE] text-white font-serif font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full shadow-[0_0_18px_rgba(138,79,255,0.45)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 tracking-wide"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Criar</span>
            </button>

            <div
              className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-[#FFE380] via-[#DCA32E] to-[#8F590A] p-[2px] shadow-[0_2px_8px_rgba(220,163,46,0.45)] flex items-center justify-center cursor-default hover:scale-105 transition-transform"
              title={`${user.coins} moedas`}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FAD766] via-[#DE9D24] to-[#A3690B] flex items-center justify-center border border-[#FFECA6]/60 shadow-inner">
                <Zap className="w-3.5 h-3.5 fill-[#FFF8DC] text-[#FFF8DC] drop-shadow-[0_1px_1px_rgba(110,70,5,0.7)]" />
              </div>
            </div>

            {onOpenDice3D && (
              <button
                type="button"
                onClick={onOpenDice3D}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/30 flex items-center justify-center transition-colors cursor-pointer"
                title="Motor de Dados 3D (Física Real)"
              >
                <Dices className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenChangelog}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer hidden sm:flex"
              title="Áudio / Novidades"
            >
              <Megaphone className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onOpenLibrary}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer hidden sm:flex"
              title="Biblioteca"
            >
              <Library className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onOpenFriends}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer hidden sm:flex relative"
              title="Lista de Amigos"
            >
              <Users className="w-5 h-5" />
            </button>

            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setShowNotifPopover(!showNotifPopover)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer relative"
                title="Notificações"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-purple-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {showNotifPopover && (
                <div className="absolute right-0 mt-2 w-80 glass-panel-elevated rounded-xl p-3 z-50 animate-modal-in">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                    <span className="font-semibold text-xs text-gray-200">Notificações</span>
                    <button 
                      type="button"
                      onClick={() => setShowNotifPopover(false)}
                      className="text-gray-400 hover:text-gray-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {user.notifications.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">Nenhuma notificação recente.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {user.notifications.map(n => (
                        <div key={n.id} className="p-2 rounded-lg bg-black/30 border border-white/5 hover:border-purple-500/30 transition-all text-xs">
                          <div className="font-semibold text-purple-300">{n.title}</div>
                          <div className="text-gray-300 mt-0.5">{n.message}</div>
                          <div className="text-[10px] text-gray-500 mt-1">{n.date}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#CBD5E1] hover:bg-[#E2E8F0] flex items-center justify-center text-[#64748B] transition-all cursor-pointer shrink-0 shadow-sm border border-white/10"
                title={user.displayName}
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6 fill-[#64748B] text-[#64748B]" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 glass-panel-elevated rounded-xl p-2 z-50 animate-modal-in text-xs">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <div className="font-semibold text-gray-200">{user.displayName}</div>
                    <div className="text-[11px] text-purple-400">Código: {user.friendCode}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setShowUserDropdown(false); onOpenProfile(); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-gray-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Palette className="w-4 h-4 text-purple-400" />
                    <span>Personalizar perfil</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowUserDropdown(false); onOpenLibrary(); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-gray-200 flex items-center gap-2 cursor-pointer"
                  >
                    <FolderGit2 className="w-4 h-4 text-purple-400" />
                    <span>Minha Biblioteca</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowUserDropdown(false); setShowAboutModal(true); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 flex items-center gap-2 cursor-pointer"
                  >
                    <Info className="w-4 h-4 text-purple-400" />
                    <span>Sobre o Dark Age</span>
                  </button>

                  <div className="border-t border-white/10 my-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair da conta</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden glass-button p-2 text-gray-300 hover:text-white rounded-lg cursor-pointer"
              title="Menu de Navegação"
            >
              {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden pt-3 pb-2 border-t border-white/10 mt-2.5 space-y-1 animate-fadeIn">
            <button
              type="button"
              onClick={() => { onOpenCreateMenu(); setShowMobileMenu(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/40 cursor-pointer sm:hidden mb-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Criar (Personagem, Campanha, Item)</span>
            </button>

            <button
              type="button"
              onClick={() => { onOpenProfile(); setShowMobileMenu(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-200 hover:bg-white/5 cursor-pointer sm:hidden"
            >
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Personalizar Perfil ({user.displayName})</span>
            </button>

            <button
              type="button"
              onClick={() => { onRouteChange('campanhas'); setShowMobileMenu(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                currentRoute === 'campanhas'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4 text-purple-400" />
              <span>Início (Campanhas)</span>
            </button>

            <button
              type="button"
              onClick={() => { onRouteChange('descubra'); setShowMobileMenu(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                currentRoute === 'descubra'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Descubra</span>
            </button>

            <button
              type="button"
              onClick={() => { onRouteChange('guildas'); setShowMobileMenu(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                currentRoute === 'guildas'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Guildas</span>
            </button>

            <button
              type="button"
              onClick={() => { onOpenLibrary(); setShowMobileMenu(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Minha Biblioteca</span>
            </button>

            <button
              type="button"
              onClick={() => { onOpenFriends(); setShowMobileMenu(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 cursor-pointer sm:hidden"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Amigos</span>
            </button>

            <button
              type="button"
              onClick={() => { onOpenChangelog(); setShowMobileMenu(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 cursor-pointer sm:hidden"
            >
              <Megaphone className="w-4 h-4 text-purple-400" />
              <span>Novidades</span>
            </button>

            <button
              type="button"
              onClick={() => { setShowNotifPopover(!showNotifPopover); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 cursor-pointer md:hidden"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-purple-400" />
                <span>Notificações</span>
              </div>
              {unreadNotifs > 0 && (
                <span className="bg-purple-600 text-white rounded-full text-[10px] px-1.5 py-0.5 font-bold">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={() => { onLogout(); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da conta</span>
              </button>
            )}
          </div>
        )}
      </header>

      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-panel-elevated max-w-lg w-full rounded-2xl p-6 relative animate-modal-in">
            <button 
              type="button"
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
                <Castle className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">Sobre o Dark Age RPG</h3>
                <p className="text-xs text-purple-400">VTT Brasileiro Gratuito para Mesas Online</p>
              </div>
            </div>
            <div className="text-sm text-gray-300 space-y-3 leading-relaxed mb-6 font-spectral">
              <p>
                O Dark Age nasceu com a missão de entregar aos jogadores e mestres brasileiros um VTT completo, moderno, rápido e com integração nativa aos sistemas mais queridos do país, como <strong>Ordem Paranormal</strong>, <strong>Tormenta20</strong>, <strong>D&D 5e</strong> e <strong>Ficha Universal</strong>.
              </p>
              <p>
                Construído com interface em Glassmorphism refinado, dados 3D com física realista e ferramentas avançadas de automação de fichas e inventários.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <a 
                href="https://discord.gg/VWdS39R2jR" 
                target="_blank" 
                rel="noreferrer"
                className="btn-primary text-xs px-4 py-2 rounded-lg flex items-center gap-2 font-semibold"
              >
                <span>Discord Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button 
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="glass-button text-xs px-4 py-2 rounded-lg text-gray-300 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
