export type GuildAccessType = 'livre' | 'aprovacao' | 'convite';

export interface Guild {
  id: string;
  name: string;
  tag: string;
  description: string;
  crestIcon?: string;
  avatarUrl?: string;
  bannerImage?: string;
  themeColor: string;
  accessType: GuildAccessType;
  isVerified: boolean;
  memberCount: number;
  campaignsCount?: number;
  leaderId: string;
  leaderName: string;
  rules?: string;
  isMember?: boolean;
}
