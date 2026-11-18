export type ShopCategory = 
  | 'Bordas'
  | 'Dados'
  | 'Pacotes'
  | 'Campanhas'
  | 'Mapas'
  | 'Tokens'
  | 'Livros';

export interface ShopItem {
  id: string;
  title: string;
  category: ShopCategory;
  priceCoins: number;
  priceReal: number; // in R$
  imageUrl: string;
  previewUrl?: string;
  isOfficial: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  inWishlist?: boolean;
}

export interface SubscriptionPlan {
  id: 'explorador' | 'duque' | 'arquiduque';
  name: string;
  priceMonthly: number;
  priceAnnually?: number;
  badgeText: string;
  cloudStorage: string; // "200 MB", "5 GB", "10 GB"
  maxCampaigns: number; // 3, 10, unlimited
  features: string[];
}
