export type UserPlan = 'explorador' | 'duque' | 'arquiduque';
export type UserStatus = 'online' | 'ausente' | 'ocupado' | 'invisivel';
export type UIStyleMode = 'glass' | 'opaque';

export interface DayAvailability {
  day: 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sab' | 'Dom';
  shifts: ('manha' | 'tarde' | 'noite')[];
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'invite' | 'friend' | 'system';
  actionData?: {
    campaignId?: string;
    friendCode?: string;
  };
}

export interface FriendContact {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  friendCode: string;
  discordTag?: string;
  currentActivity?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  friendCode: string;
  discordTag?: string;
  bio: string;
  coins: number;
  plan: UserPlan;
  status: UserStatus;
  
  // Customization
  themeMode: 'dark' | 'light' | 'system';
  accentColor: string; // Default #8b5cf6
  uiStyle: UIStyleMode; // 'glass' or 'opaque'
  activeBorderId?: string;
  activeBadgeId?: string;
  
  // Availability matrix
  availability: DayAvailability[];
  preferredGenres: string[];
  
  friends: FriendContact[];
  notifications: UserNotification[];
}
