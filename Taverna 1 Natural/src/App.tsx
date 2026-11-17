import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Header, MainNavRoute } from './components/layout/Header';
import { FriendsDrawer } from './components/layout/FriendsDrawer';
import { ProfileModal } from './components/layout/ProfileModal';
import { CreateMenuModal } from './components/layout/CreateMenuModal';
import { ChangelogModal } from './components/layout/ChangelogModal';
import { SystemSelectorModal } from './components/characters/SystemSelectorModal';
import { CharacterWizardModal } from './components/characters/CharacterWizardModal';
import { CharacterSheetModal } from './components/characters/CharacterSheetModal';
import { ItemEditorModal } from './components/characters/ItemEditorModal';
import { AbilityEditorModal } from './components/characters/AbilityEditorModal';
import { CampaignList } from './components/campaigns/CampaignList';
import { CampaignWizardModal } from './components/campaigns/CampaignWizardModal';
import { CampaignDetailView } from './components/campaigns/CampaignDetailView';
import { VttSessionModal } from './components/campaigns/VttSessionModal';
import { InviteModal } from './components/campaigns/InviteModal';
import { DiscoverView } from './components/discover/DiscoverView';
import { GuildsView } from './components/guilds/GuildsView';
import { GameEntryView } from './components/game/GameEntryView';
import { LibraryModal } from './components/library/LibraryModal';
import { PublicProfileModal, PublicPlayerProfile } from './components/library/PublicProfileModal';
import { DiceOverlay } from './components/dice/DiceOverlay';

import { StorageService } from './services/storage.service';
import { DiceRollerService } from './services/dice-roller.service';

import { UserProfile, UserStatus } from './types/user';
import { Character } from './types/character';
import { Campaign } from './types/campaign';
import { Guild } from './types/guild';
import { DiceRollResult } from './types/dice';
import { RPGSystemId } from './types/rpg-systems';
import { CharacterItem } from './types/items';
import { CharacterAbility } from './types/abilities';

export const App: React.FC = () => {
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const rawParamRoute = queryParams.get('route');
  const paramRoute = (rawParamRoute === 'campanhas' || rawParamRoute === 'descubra' || rawParamRoute === 'guildas') ? (rawParamRoute as MainNavRoute) : null;
  const paramModal = queryParams.get('modal');
  const paramStep = queryParams.get('step') ? parseInt(queryParams.get('step')!, 10) : 1;
  const paramTab = queryParams.get('tab') as 'attacks' | 'abilities' | 'inventory' | 'skills' | 'stats' | 'bio' | null;
  const paramSystem = (queryParams.get('system') as RPGSystemId) || 'ordem-paranormal';

  const [currentRoute, setCurrentRoute] = useState<MainNavRoute>(paramRoute || 'campanhas');

  const [user, setUser] = useState<UserProfile>(StorageService.getUser());
  const [characters, setCharacters] = useState<Character[]>(StorageService.getCharacters());
  const [campaigns, setCampaigns] = useState<Campaign[]>(StorageService.getCampaigns());
  const [guilds, setGuilds] = useState<Guild[]>(StorageService.getGuilds());
  const [recentRolls, setRecentRolls] = useState<DiceRollResult[]>(StorageService.getDiceRolls());

  const [showGameEntry, setShowGameEntry] = useState(rawParamRoute === 'game_entry' || paramModal === 'game_entry');
  const [entryCampaign, setEntryCampaign] = useState<Campaign | null>(null);

  const [showProfileModal, setShowProfileModal] = useState(paramModal === 'profile');
  const [showFriendsDrawer, setShowFriendsDrawer] = useState(paramModal === 'friends');
  const [showChangelogModal, setShowChangelogModal] = useState(paramModal === 'changelog');
  const [showCreateMenuModal, setShowCreateMenuModal] = useState(paramModal === 'create');
  const [showInviteModal, setShowInviteModal] = useState(paramModal === 'invite');
  const [showLibraryModal, setShowLibraryModal] = useState(paramModal === 'library');

  const [showSystemSelectorModal, setShowSystemSelectorModal] = useState(paramModal === 'system');
  const [showCharacterWizardModal, setShowCharacterWizardModal] = useState(paramModal === 'wizard');
  const [wizardSystemId, setWizardSystemId] = useState<RPGSystemId>(paramSystem);
  const [wizardStep, setWizardStep] = useState<number>(paramStep);
  const [sheetTab, setSheetTab] = useState<'attacks' | 'abilities' | 'inventory' | 'skills' | 'stats' | 'bio'>(paramTab || 'attacks');
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(
    paramModal === 'sheet' && characters.length > 0 ? characters[0] : null
  );
  const [activePublicProfile, setActivePublicProfile] = useState<PublicPlayerProfile | null>(
    paramModal === 'public-profile' ? StorageService.getPublicProfile() : null
  );
  const [appToast, setAppToast] = useState<string | null>(null);

  // Item & Ability editors
  const [showItemEditorModal, setShowItemEditorModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CharacterItem | undefined>(undefined);
  const [showAbilityEditorModal, setShowAbilityEditorModal] = useState(false);
  const [editingAbility, setEditingAbility] = useState<CharacterAbility | undefined>(undefined);

  // Campaign flows
  const [showCampaignWizardModal, setShowCampaignWizardModal] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(() => {
    const list = StorageService.getCampaigns();
    const campParam = queryParams.get('campaign');
    if (campParam) {
      const match = list.find(c => c.id === campParam || c.title.toLowerCase().includes(campParam.toLowerCase()));
      if (match) return match;
    }
    if (paramModal === 'campaign') {
      return list.find(c => c.id === 'camp-test-mapping') || list[0] || null;
    }
    return null;
  });
  const [showVttSessionModal, setShowVttSessionModal] = useState(false);

  // Active Dice Overlay
  const [activeRoll, setActiveRoll] = useState<DiceRollResult | null>(null);

  // Apply custom theme CSS variables from user profile
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', user.accentColor);
  }, [user.accentColor]);

  // Dice roll handler
  const handleRollDice = (
    formula: string,
    title: string,
    options?: {
      mode?: 'normal' | 'oculto' | 'maior' | 'menor';
      criticalMargin?: number;
      damageFormula?: string;
    }
  ) => {
    const rollResult = DiceRollerService.rollFormula(formula, {
      rollerName: user.displayName,
      sourceTitle: title,
      mode: options?.mode,
      criticalMargin: options?.criticalMargin,
      damageFormula: options?.damageFormula
    });

    StorageService.addDiceRoll(rollResult);
    setRecentRolls(StorageService.getDiceRolls());
    setActiveRoll(rollResult);
  };

  // User Profile Update
  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    StorageService.saveUser(updated);
  };

  // Character Save / Update
  const handleUpdateCharacter = (updated: Character) => {
    StorageService.saveCharacter(updated);
    setCharacters(StorageService.getCharacters());
    if (activeCharacter?.id === updated.id) {
      setActiveCharacter(updated);
    }
  };

  const handleDeleteCharacter = (id: string) => {
    StorageService.deleteCharacter(id);
    setCharacters(StorageService.getCharacters());
    if (activeCharacter?.id === id) {
      setActiveCharacter(null);
    }
  };

  const showToast = (message: string) => {
    setAppToast(message);
    setTimeout(() => {
      setAppToast(prev => prev === message ? null : prev);
    }, 4000);
  };

  const handleCloneCharacter = (char: Character) => {
    const clone: Character = {
      ...char,
      id: 'char-clone-' + Date.now(),
      name: `${char.name} (Cópia)`,
      folder: 'Sem campanha',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    StorageService.saveCharacter(clone);
    setCharacters(StorageService.getCharacters());
    showToast(`Ficha clonada com sucesso: "${clone.name}" salva na pasta Sem campanha!`);
  };

  const handleUpdateCampaign = (updated: Campaign) => {
    StorageService.saveCampaign(updated);
    setCampaigns(StorageService.getCampaigns());
    if (activeCampaign?.id === updated.id) {
      setActiveCampaign(updated);
    }
  };

  const handleJoinInviteCode = (code: string) => {
    const found = campaigns.find(c => 
      c.inviteCode.toLowerCase() === code.toLowerCase() || 
      code.includes(c.inviteCode)
    );
    if (found) {
      const isAlreadyParticipant = found.participants.some(p => p.userId === user.id);
      if (!isAlreadyParticipant) {
        const updatedParticipants = [
          ...found.participants,
          {
            userId: user.id,
            userName: user.displayName,
            userAvatar: user.avatarUrl,
            role: 'player' as const,
            isOnline: true
          }
        ];
        handleUpdateCampaign({ ...found, participants: updatedParticipants });
      }
      setActiveCampaign(found);
    } else {
      showToast(`Mesa não encontrada para o código "${code}". Verifique o link e tente novamente.`);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0b0e14] text-gray-100 flex flex-col font-sans overflow-x-hidden ${user.uiStyle === 'opaque' ? 'ui-opaque' : ''}`}>
      
      {appToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#141c2c]/95 border border-purple-500/60 text-purple-200 px-4 py-2.5 rounded-xl text-xs flex items-center gap-3 shadow-2xl backdrop-blur-md animate-fadeIn">
          <span>✨ {appToast}</span>
          <button
            type="button"
            onClick={() => setAppToast(null)}
            className="text-gray-400 hover:text-white p-0.5 cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      
      {showGameEntry ? (
        <GameEntryView
          campaign={entryCampaign || campaigns[0]}
          onEnterGame={(camp) => {
            setShowGameEntry(false);
            setActiveCampaign(camp);
            setShowVttSessionModal(true);
          }}
          onBack={() => setShowGameEntry(false)}
          onOpenLibrary={() => setShowLibraryModal(true)}
        />
      ) : (
        <>
          <Header
            user={user}
            currentRoute={currentRoute}
            onRouteChange={(route) => setCurrentRoute(route)}
            onOpenCreateMenu={() => setShowCreateMenuModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
            onOpenFriends={() => setShowFriendsDrawer(true)}
            onOpenLibrary={() => setShowLibraryModal(true)}
            onOpenChangelog={() => setShowChangelogModal(true)}
            onNavigateHome={() => setCurrentRoute('campanhas')}
          />

          <main className="flex-1">
            {currentRoute === 'campanhas' && (
              <CampaignList
                campaigns={campaigns}
                currentUserId={user.id}
                onOpenCampaignDetail={(camp) => setActiveCampaign(camp)}
                onEnterGame={(camp) => {
                  setEntryCampaign(camp);
                  setShowGameEntry(true);
                }}
                onOpenCreateCampaign={() => setShowCampaignWizardModal(true)}
                onOpenInviteModal={() => setShowInviteModal(true)}
                onNavigateToDiscover={() => setCurrentRoute('descubra')}
                onSelectSystemForCharacter={(sysId) => {
                  setWizardSystemId(sysId);
                  setShowCharacterWizardModal(true);
                }}
              />
            )}

            {currentRoute === 'descubra' && (
              <DiscoverView
                campaigns={campaigns}
                user={user}
                onOpenCampaignDetail={(camp) => setActiveCampaign(camp)}
                onRequestJoinCampaign={(camp) => {
                  handleJoinInviteCode(camp.inviteCode);
                  showToast(`Solicitação enviada para a mesa "${camp.title}"!`);
                }}
                onAddFriend={(code) => {
                  showToast(`Solicitação de amizade enviada para o código ${code}!`);
                }}
                onOpenPublicProfile={(code) => {
                  setActivePublicProfile(StorageService.getPublicProfile(code));
                }}
              />
            )}

            {currentRoute === 'guildas' && (
              <GuildsView
                guilds={guilds}
                currentUserId={user.id}
                onJoinGuild={(guildId) => {
                  const updated = guilds.map(g => g.id === guildId ? { ...g, isMember: true, memberCount: g.memberCount + 1 } : g);
                  setGuilds(updated);
                  StorageService.saveGuilds(updated);
                  showToast('Você ingressou na guilda com sucesso!');
                }}
                onCreateGuild={(newGuild) => {
                  const updated = [newGuild, ...guilds];
                  setGuilds(updated);
                  StorageService.saveGuilds(updated);
                  showToast(`Guilda [${newGuild.tag}] ${newGuild.name} fundada com sucesso!`);
                }}
              />
            )}
          </main>
        </>
      )}

      {/* FRIENDS DRAWER */}
      <FriendsDrawer
        isOpen={showFriendsDrawer}
        onClose={() => setShowFriendsDrawer(false)}
        user={user}
        onUpdateStatus={(st: UserStatus) => handleUpdateUser({ ...user, status: st })}
      />

      {/* USER PROFILE MODAL */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onSaveUser={handleUpdateUser}
        onTestRoll={handleRollDice}
      />

      {/* CREATE MENU MODAL (Triggered by bottom "+") */}
      <CreateMenuModal
        isOpen={showCreateMenuModal}
        onClose={() => setShowCreateMenuModal(false)}
        onSelectCreateCampaign={() => setShowCampaignWizardModal(true)}
        onSelectCreateCharacter={() => setShowSystemSelectorModal(true)}
        onOpenDiceAtelier={() => {
          setShowProfileModal(true);
        }}
        onOpenItemCreator={() => {
          setEditingItem(undefined);
          setShowItemEditorModal(true);
        }}
        onOpenAbilityCreator={() => {
          setEditingAbility(undefined);
          setShowAbilityEditorModal(true);
        }}
        onOpenPlayerCard={() => setShowProfileModal(true)}
        onOpenLibrary={() => setShowLibraryModal(true)}
        onJoinInviteCode={handleJoinInviteCode}
      />

      {/* SYSTEM SELECTOR MODAL */}
      <SystemSelectorModal
        isOpen={showSystemSelectorModal}
        onClose={() => setShowSystemSelectorModal(false)}
        onBack={() => {
          setShowSystemSelectorModal(false);
          setShowCreateMenuModal(true);
        }}
        onSelectSystem={(sysId) => {
          setShowSystemSelectorModal(false);
          setWizardSystemId(sysId);
          setShowCharacterWizardModal(true);
        }}
      />

      {/* CHARACTER CREATION WIZARD MODAL (5 STEPS) */}
      <CharacterWizardModal
        isOpen={showCharacterWizardModal}
        systemId={wizardSystemId}
        initialStep={wizardStep}
        onClose={() => setShowCharacterWizardModal(false)}
        onCharacterCreated={(newChar) => {
          StorageService.saveCharacter(newChar);
          setCharacters(StorageService.getCharacters());
          setShowCharacterWizardModal(false);
          setActiveCharacter(null);
          setShowLibraryModal(true);
        }}
      />

      {activeCharacter && (
        <CharacterSheetModal
          isOpen={!!activeCharacter}
          character={activeCharacter}
          initialTab={sheetTab}
          onClose={() => setActiveCharacter(null)}
          onUpdateCharacter={handleUpdateCharacter}
          onRollDice={handleRollDice}
          onOpenItemEditor={(item) => {
            setEditingItem(item);
            setShowItemEditorModal(true);
          }}
          onOpenAbilityEditor={(ability) => {
            setEditingAbility(ability);
            setShowAbilityEditorModal(true);
          }}
        />
      )}

      {/* ITEM EDITOR MODAL */}
      <ItemEditorModal
        isOpen={showItemEditorModal}
        initialItem={editingItem}
        onClose={() => setShowItemEditorModal(false)}
        onSaveItem={(savedItem) => {
          if (activeCharacter) {
            const existingIdx = activeCharacter.items.findIndex(i => i.id === savedItem.id);
            let updatedItems = [...activeCharacter.items];
            if (existingIdx >= 0) {
              updatedItems[existingIdx] = savedItem;
            } else {
              updatedItems.push(savedItem);
            }
            handleUpdateCharacter({ ...activeCharacter, items: updatedItems });
          } else {
            showToast(`Item "${savedItem.name}" salvo no arsenal global!`);
          }
        }}
      />

      {/* ABILITY EDITOR MODAL */}
      <AbilityEditorModal
        isOpen={showAbilityEditorModal}
        initialAbility={editingAbility}
        onClose={() => setShowAbilityEditorModal(false)}
        onSaveAbility={(savedAbility) => {
          if (activeCharacter) {
            const existingIdx = activeCharacter.abilities.findIndex(a => a.id === savedAbility.id);
            let updatedAbilities = [...activeCharacter.abilities];
            if (existingIdx >= 0) {
              updatedAbilities[existingIdx] = savedAbility;
            } else {
              updatedAbilities.push(savedAbility);
            }
            handleUpdateCharacter({ ...activeCharacter, abilities: updatedAbilities });
          } else {
            showToast(`Habilidade "${savedAbility.name}" salva com sucesso!`);
          }
        }}
      />

      {/* CAMPAIGN CREATION WIZARD MODAL */}
      <CampaignWizardModal
        isOpen={showCampaignWizardModal}
        currentUserId={user.id}
        currentUserName={user.displayName}
        currentUserAvatar={user.avatarUrl}
        onClose={() => setShowCampaignWizardModal(false)}
        onCampaignCreated={(newCamp) => {
          StorageService.saveCampaign(newCamp);
          setCampaigns(StorageService.getCampaigns());
          setShowCampaignWizardModal(false);
          setActiveCampaign(newCamp);
        }}
      />

      {activeCampaign && !showVttSessionModal && (
        <CampaignDetailView
          campaign={activeCampaign}
          currentUserId={user.id}
          initialTab={queryParams.get('tab') === 'calendar' ? 'calendar' : (queryParams.get('tab') === 'chronicle' ? 'chronicle' : 'overview')}
          onClose={() => setActiveCampaign(null)}
          onUpdateCampaign={handleUpdateCampaign}
          onOpenCharacterSheet={(charId: string) => {
            const char = StorageService.getCharacterById(charId);
            if (char) setActiveCharacter(char);
          }}
          onLaunchVtt={(_camp: Campaign) => {
            setShowVttSessionModal(true);
          }}
        />
      )}

      {/* VTT SESSION MODAL */}
      {activeCampaign && showVttSessionModal && (
        <VttSessionModal
          isOpen={showVttSessionModal}
          campaign={activeCampaign}
          onClose={() => setShowVttSessionModal(false)}
          onRollDice={handleRollDice}
          recentRolls={recentRolls}
        />
      )}

      {/* INVITE MODAL */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onJoinInviteCode={handleJoinInviteCode}
      />

      {/* USER LIBRARY MODAL */}
      <LibraryModal
        isOpen={showLibraryModal}
        characters={characters}
        user={user}
        campaigns={campaigns}
        recentRollsCount={recentRolls.length}
        onClose={() => setShowLibraryModal(false)}
        onOpenCharacterSheet={(char) => {
          setActiveCharacter(char);
        }}
        onStartCreateCharacter={() => {
          setShowLibraryModal(false);
          setShowSystemSelectorModal(true);
        }}
        onOpenProfile={() => {
          setShowProfileModal(true);
        }}
        onOpenShop={() => {
          setShowProfileModal(true);
        }}
        onOpenPublicProfile={() => {
          setActivePublicProfile(StorageService.getPublicProfile());
        }}
        onOpenCreateCampaign={() => {
          setShowLibraryModal(false);
          setShowCampaignWizardModal(true);
        }}
        onOpenCampaignDetail={(camp) => {
          setActiveCampaign(camp);
        }}
      />

      {/* CHANGELOG MODAL */}
      <ChangelogModal
        isOpen={showChangelogModal}
        onClose={() => setShowChangelogModal(false)}
      />

      {/* PUBLIC PROFILE MODAL */}
      <PublicProfileModal
        isOpen={!!activePublicProfile}
        profile={activePublicProfile}
        onClose={() => setActivePublicProfile(null)}
        onAddFriend={(code) => showToast(`Solicitação de amizade enviada para ${code}!`)}
      />

      {/* REAL-TIME 3D DICE OVERLAY */}
      <DiceOverlay
        roll={activeRoll}
        onClose={() => setActiveRoll(null)}
      />

    </div>
  );
};
