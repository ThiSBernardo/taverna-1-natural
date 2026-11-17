export type GuildAccessType = 'livre' | 'aprovacao' | 'convite';

export interface Guild {
  id: string;
  name: string;
  tag: string; // 2 to 6 uppercase letters, e.g. "ORDEM", "VANG"
  description: string;
  crestIcon: string;
  bannerImage?: string;
  themeColor: string; // Hex color
  accessType: GuildAccessType;
  isVerified: boolean;
  memberCount: number;
  leaderId: string;
  leaderName: string;
  rules: string;
  isMember?: boolean;
}
