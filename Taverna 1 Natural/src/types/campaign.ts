import { RPGSystemId } from './rpg-systems';

export interface CampaignParticipant {
  userId: string;
  userName: string;
  userAvatar: string;
  role: 'master' | 'player';
  characterId?: string;
  characterName?: string;
  isOnline: boolean;
}

export interface ChronicleChapter {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

export interface ScheduledSession {
  id: string;
  date: string;
  time: string;
  durationHours: number;
  notes?: string;
  recurrence?: 'none' | 'weekly' | 'biweekly' | 'monthly';
}

export interface Campaign {
  id: string;
  title: string;
  synopsis: string;
  coverImage: string;
  systemId: RPGSystemId;
  masterId: string;
  masterName: string;
  masterAvatar: string;
  isMasterOnline: boolean;
  
  isPublic: boolean;
  requiresApproval: boolean;
  maxPlayers: number;
  genres: string[];
  playStyles: string[];
  
  isSessionActive: boolean;
  nextSession?: ScheduledSession;
  sessionsHistory: ScheduledSession[];
  
  participants: CampaignParticipant[];
  chronicle: ChronicleChapter[];
  inviteCode: string;
  
  createdAt: string;
  updatedAt: string;
}
