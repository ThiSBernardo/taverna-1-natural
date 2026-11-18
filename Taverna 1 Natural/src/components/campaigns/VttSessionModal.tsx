import React, { useState, useEffect } from 'react';
import { Campaign } from '../../types/campaign';
import { DiceRollResult } from '../../types/dice';
import { Character } from '../../types/character';
import { StorageService } from '../../services/storage.service';
import { VttTopToolbar, VttToolType } from '../vtt/VttTopToolbar';
import { VttLeftToolbar } from '../vtt/VttLeftToolbar';
import { VttQuickBar } from '../vtt/VttQuickBar';
import { VttGroupStatusPanel } from '../vtt/VttGroupStatusPanel';
import { VttDiceTray, DiceType } from '../vtt/VttDiceTray';
import { VttSkillsCatalogModal, VttSkillItem } from '../vtt/VttSkillsCatalogModal';
import { VttCreateSkillModal } from '../vtt/VttCreateSkillModal';
import { VttCharacterSheetOverlay } from '../vtt/VttCharacterSheetOverlay';
import { VttCampaignShopModal } from '../vtt/VttCampaignShopModal';
import { VttRightSidebar } from '../vtt/VttRightSidebar';
import { VttRulerOverlay } from '../vtt/VttRulerOverlay';
import { CharacterItem } from '../../types/items';
import { CharacterAbility } from '../../types/abilities';
import { CharacterRulesService } from '../../services/character-rules.service';

interface VttSessionModalProps {
  isOpen: boolean;
  campaign: Campaign;
  onClose: () => void;
  onRollDice: (formula: string, title: string, options?: { mode?: 'normal' | 'oculto' | 'maior' | 'menor' }) => void;
  recentRolls: DiceRollResult[];
}

interface VttToken {
  id: string;
  name: string;
  avatar: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  isSelected?: boolean;
}

export const VttSessionModal: React.FC<VttSessionModalProps> = ({
  isOpen,
  campaign,
  onClose,
  onRollDice,
  recentRolls,
}) => {
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const paramPanel = queryParams.get('panel');

  const [activeTool, setActiveTool] = useState<VttToolType | null>('ruler');
  const [activeColor, setActiveColor] = useState<string>('#8b5cf6');
  const [isAnchored, setIsAnchored] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'combat' | 'camp' | 'items' | null>('combat');

  const [isDiceTrayOpen, setIsDiceTrayOpen] = useState<boolean>(paramPanel !== 'tray_collapsed');
  const [isGroupStatusOpen, setIsGroupStatusOpen] = useState<boolean>(paramPanel === 'status');
  const [isSkillsCatalogOpen, setIsSkillsCatalogOpen] = useState<boolean>(paramPanel === 'skills' || paramPanel === 'new_skill');
  const [isCreateSkillOpen, setIsCreateSkillOpen] = useState<boolean>(paramPanel === 'new_skill');
  const [isCampaignShopOpen, setIsCampaignShopOpen] = useState<boolean>(paramPanel === 'shop');
  const [isCharacterSheetOpen, setIsCharacterSheetOpen] = useState<boolean>(paramPanel === 'sheet');

  const [characters, setCharacters] = useState<Character[]>(() => StorageService.getCharacters());
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(() => {
    const chars = StorageService.getCharacters();
    return chars[0] || {
      id: 'char-arthur',
      name: 'Arthur Veríssimo',
      systemId: 'ordem-paranormal',
      ownerType: 'player',
      assignedUser: 'ThiSBernardo',
      characterClass: 'Combatente',
      levelOrNex: 10,
      originOrBackground: 'Agente de Saúde',
      token: { imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', scale: 1.0 },
      hp: { current: 36, max: 36 },
      energy: { current: 14, max: 14 },
      sanity: { current: 28, max: 32 },
      defense: 14,
      speed: '9m',
      initiative: 2,
      autoCalculateStatus: true,
      attributes: { AGI: 2, FOR: 3, INT: 2, PRE: 1, VIG: 3 },
      skills: [],
      items: [],
      abilities: [],
      biography: '',
      coins: 100,
      currencyUnit: 'Créditos',
      folder: 'Mesa Ativa',
      createdAt: '',
      updatedAt: ''
    };
  });

  const [vttToast, setVttToast] = useState<string | null>(null);

  const [tokens, setTokens] = useState<VttToken[]>([
    {
      id: 't1',
      name: 'Arthur',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      x: 360,
      y: 330,
      hp: 36,
      maxHp: 36
    },
    {
      id: 't2',
      name: 'Thorgrim',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
      x: 440,
      y: 360,
      hp: 34,
      maxHp: 34
    },
    {
      id: 't3',
      name: 'Aberração de Sangue',
      avatar: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=200&auto=format&fit=crop',
      x: 680,
      y: 280,
      hp: 80,
      maxHp: 100
    }
  ]);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === 'l' || e.key === 'L') {
        setIsCampaignShopOpen(prev => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        setIsCharacterSheetOpen(prev => !prev);
      } else if (e.key === 'h' || e.key === 'H') {
        setIsSkillsCatalogOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        if (isCreateSkillOpen) {
          setIsCreateSkillOpen(false);
        } else if (isSkillsCatalogOpen) {
          setIsSkillsCatalogOpen(false);
        } else if (isCampaignShopOpen) {
          setIsCampaignShopOpen(false);
        } else if (isCharacterSheetOpen) {
          setIsCharacterSheetOpen(false);
        } else if (isGroupStatusOpen) {
          setIsGroupStatusOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreateSkillOpen, isSkillsCatalogOpen, isCampaignShopOpen, isCharacterSheetOpen, isGroupStatusOpen]);

  if (!isOpen) return null;

  const showToast = (message: string) => {
    setVttToast(message);
    setTimeout(() => {
      setVttToast(prev => prev === message ? null : prev);
    }, 4000);
  };

  useEffect(() => {
    if (selectedCharacter && selectedCharacter.id === 'char-arthur') {
      setTokens(prev => prev.map(t => {
        if (t.id === 't1') {
          return {
            ...t,
            hp: selectedCharacter.hp.current,
            maxHp: selectedCharacter.hp.max
          };
        }
        return t;
      }));
    }
  }, [selectedCharacter?.hp?.current, selectedCharacter?.hp?.max]);

  const handleUpdateCharacter = (updated: Character) => {
    StorageService.saveCharacter(updated);
    setCharacters(StorageService.getCharacters());
    setSelectedCharacter(updated);
  };

  const handleShareSkillInChat = (skill: VttSkillItem) => {
    onRollDice('1d20', `Habilidade exibida: ${skill.name} (${skill.type})`);
    showToast(`"${skill.name}" exibida no chat da mesa!`);
  };

  const handleAddSkillFromCatalog = (skill: VttSkillItem) => {
    if (selectedCharacter) {
      const alreadyHas = selectedCharacter.abilities.some(a => a.name.toLowerCase() === skill.name.toLowerCase());
      if (alreadyHas) {
        showToast(`O personagem ${selectedCharacter.name} já possui a habilidade "${skill.name}"!`);
        return;
      }
      const newAbility: CharacterAbility = {
        id: 'ab-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: skill.name,
        originType: skill.category === 'Origem' ? 'Poder de Origem' : 'Habilidade de Classe',
        description: skill.description,
        isReaction: false,
        showDescriptionInChat: true,
        cost: {
          energyPoints: skill.cost.includes('PE') ? parseInt(skill.cost, 10) || 1 : 0,
          actionType: 'Padrão'
        },
        actions: [],
        passiveBonuses: []
      };
      const updated: Character = {
        ...selectedCharacter,
        abilities: [...selectedCharacter.abilities, newAbility]
      };
      handleUpdateCharacter(updated);
      showToast(`Habilidade "${skill.name}" adicionada à ficha de ${selectedCharacter.name}!`);
    }
  };

  const handleEquipItemFromShop = (item: CharacterItem) => {
    if (selectedCharacter) {
      const updatedItems = [...selectedCharacter.items, item];
      const updatedChar: Character = {
        ...selectedCharacter,
        items: updatedItems,
        defense: CharacterRulesService.calculateTotalDefense({
          ...selectedCharacter,
          items: updatedItems
        })
      };
      handleUpdateCharacter(updatedChar);
      showToast(`Item "${item.name}" adicionado ao inventário de ${selectedCharacter.name}!`);
    }
  };

  const participantsList = [
    {
      id: 'p1',
      name: campaign.masterName || 'ThiSBernardo (Mestre)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      role: 'master' as const,
      isOnline: true
    },
    ...campaign.participants.map(p => ({
      id: p.userId,
      name: p.userName,
      avatar: p.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      role: p.role,
      isOnline: p.isOnline
    }))
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0a0f] text-white flex flex-col overflow-hidden select-none animate-fadeIn">
      
      {/* AUTHENTIC TABLETOP BACKGROUND SCENE */}
      <div className="absolute inset-0 select-none overflow-hidden">
        {/* Base Layer: Vintage Desk, Scrolls, Candlestick, Pipe, Books */}
        <img
          src="/assets/tabletop_desk.jpg"
          alt="Dark Age Virtual Tabletop"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Seamless Clean Layer for Open Book and Pages on Bottom-Right */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ clipPath: 'polygon(55% 45%, 100% 45%, 100% 100%, 55% 100%)' }}
        >
          <img
            src="/assets/tabletop_desk_alt.jpg"
            alt="Table Surface Detail"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>


        {/* Ambient Warm Candlelight & Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/30" />
      </div>

      <div className="fixed top-1.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20 z-40 pointer-events-none" />


      {/* INTERACTIVE MEASUREMENT RULER (Matches Screenshot 3) */}
      <VttRulerOverlay
        isActive={activeTool === 'ruler'}
        color={activeColor}
      />

      {/* TACTICAL BATTLEMAP TOKENS (Interactive on Desk) */}
      <div className="absolute inset-0 pointer-events-auto z-20">
        {tokens.map(token => {
          const isSelected = selectedTokenId === token.id;
          const isMonster = token.maxHp >= 100;
          return (
            <div
              key={token.id}
              onClick={() => setSelectedTokenId(token.id)}
              style={{ left: `${token.x}px`, top: `${token.y}px` }}
              className={`absolute w-12 h-12 rounded-full cursor-pointer transition-transform duration-100 flex items-center justify-center ${
                isSelected 
                  ? 'scale-110 ring-4 ring-purple-400 z-30 shadow-[0_0_25px_rgba(168,85,247,0.8)]' 
                  : 'hover:scale-105 ring-2 ring-white/50 z-20 shadow-xl'
              }`}
            >
              <img
                src={token.avatar}
                alt={token.name}
                className="w-full h-full rounded-full object-cover pointer-events-none"
              />

              {/* Mini Health Bar */}
              <div className="absolute -bottom-2 w-10 h-1.5 rounded-full bg-black/80 overflow-hidden border border-white/20">
                <div
                  className={`h-full ${isMonster ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${(token.hp / token.maxHp) * 100}%` }}
                />
              </div>


              {/* Name Tag */}
              <div className="absolute -top-4 bg-black/85 px-1.5 py-0.2 rounded text-[9px] font-bold text-gray-200 whitespace-nowrap border border-white/10 pointer-events-none">
                {token.name}
              </div>

            </div>

          );
        })}
      </div>


      {/* FLOATING TOP TOOLBAR */}
      <VttTopToolbar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        activeColor={activeColor}
        onSelectColor={setActiveColor}
        isAnchored={isAnchored}
        onToggleAnchor={() => setIsAnchored(prev => !prev)}
        isPinned={isPinned}
        onTogglePin={() => setIsPinned(prev => !prev)}
        onClose={onClose}
      />

      {/* TOP-LEFT QUICK ACTIONS BAR */}
      <VttQuickBar
        isGroupStatusOpen={isGroupStatusOpen}
        onToggleGroupStatus={() => setIsGroupStatusOpen(prev => !prev)}
        onOpenPartyList={() => setIsGroupStatusOpen(true)}
        onOpenCharacterSheet={() => setIsCharacterSheetOpen(true)}
        onOpenInventory={() => setIsCampaignShopOpen(true)}
        onOpenChronicle={() => showToast('Diário da Crônica acessado.')}
      />

      {/* GROUP STATUS PANEL (Matches Screenshot 4) */}
      <VttGroupStatusPanel
        isOpen={isGroupStatusOpen}
        onClose={() => setIsGroupStatusOpen(false)}
        activeCharacters={characters.slice(0, 3)}
        onOpenCharacterSheet={(char) => {
          setSelectedCharacter(char);
          setIsCharacterSheetOpen(true);
        }}
      />

      {/* LEFT VERTICAL TOOLBAR (Matches Screenshot 3) */}
      <VttLeftToolbar
        isLocked={isLocked}
        onToggleLock={() => setIsLocked(prev => !prev)}
        activeMode={activeMode}
        onSelectMode={setActiveMode}
        onOpenShop={() => setIsCampaignShopOpen(true)}
        onOpenSkills={() => setIsSkillsCatalogOpen(true)}
      />

      {/* FLOATING DICE TRAY (Matches Screenshot 2) */}
      <VttDiceTray
        isOpen={isDiceTrayOpen}
        onToggle={() => setIsDiceTrayOpen(prev => !prev)}
        onRoll={onRollDice}
      />

      {/* RIGHT SIDEBAR STRIP & CHAT DRAWER (Matches Screenshot 3 & 4) */}
      <VttRightSidebar
        participants={participantsList}
        recentRolls={recentRolls}
        onRollDice={onRollDice}
        onSelectCharacterSheet={(charId) => {
          const found = characters.find(c => c.id === charId);
          if (found) setSelectedCharacter(found);
          setIsCharacterSheetOpen(true);
        }}
      />

      {/* SKILLS CATALOG MODAL (Matches Screenshot 0) */}
      <VttSkillsCatalogModal
        isOpen={isSkillsCatalogOpen}
        onClose={() => setIsSkillsCatalogOpen(false)}
        onOpenCreateSkill={() => setIsCreateSkillOpen(true)}
        onShareInChat={handleShareSkillInChat}
        onAddSkillToCharacter={handleAddSkillFromCatalog}
        characterName={selectedCharacter?.name}
      />

      {/* CREATE SKILL MODAL (Matches Screenshot 1) */}
      <VttCreateSkillModal
        isOpen={isCreateSkillOpen}
        onClose={() => setIsCreateSkillOpen(false)}
        onSaveSkill={(newSkill) => {
          showToast(`Habilidade "${newSkill.name}" criada com sucesso!`);
        }}
      />

      {/* CHARACTER SHEET OVERLAY (Canonical 6-Tabs, GM & Player view) */}
      <VttCharacterSheetOverlay
        isOpen={isCharacterSheetOpen}
        onClose={() => setIsCharacterSheetOpen(false)}
        character={selectedCharacter}
        allCharacters={characters}
        onSelectCharacter={setSelectedCharacter}
        isMasterView={true}
        onRollDice={onRollDice}
        onUpdateCharacter={handleUpdateCharacter}
        onShowToast={showToast}
      />

      {/* CAMPAIGN ITEM SHOP MODAL */}
      <VttCampaignShopModal
        isOpen={isCampaignShopOpen}
        onClose={() => setIsCampaignShopOpen(false)}
        onEquipItem={handleEquipItemFromShop}
        onShowToast={showToast}
      />

      {/* IN-APP GLASSMORPHISM TOAST */}
      {vttToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-60 bg-[#161322]/95 border border-purple-500/60 text-purple-200 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-2xl backdrop-blur-md animate-fadeIn">
          <span>✨ {vttToast}</span>
        </div>

      )}

    </div>
  );
};
