export type User = {
  id: string;
  username: string;
  avatar: string;
  email?: string;
  telegramHandle?: string;
  followers?: number;
  following?: string[];
  verified?: boolean;
  ownedChannels?: string[]; // IDs des canaux que l'utilisateur possède
  followingChannels?: string[]; // IDs des canaux que l'utilisateur suit
};

export type Channel = {
  id: string;
  title: string;
  handle: string;
  avatar: string;
  followers: number;
  verified?: boolean;
  description?: string;
  coverImage?: string;
  language?: string;
  category?: string;
};

export type Media = {
  url: string;
  type: 'image' | 'video' | 'audio';
  durationSec?: number;
  thumbnailUrl?: string;
};

export type PostSource = 'site' | 'channel';

export type Post = {
  id: string;
  author: Channel;
  body: string;
  media?: Media;
  createdAt: string;
  metrics: {
    views?: number;
    shares: number;
    reactions: number;
    comments: number;
  };
  pinned?: boolean;
  comments?: Comment[];
  likedBy?: string[];
  source: PostSource;
  telegramDeepLink?: string; // requis si source="channel"
};

export type Comment = {
  id: string;
  author: User;
  text: string;
  createdAt: string;
};

export type Kpis = {
  followers: number;
  growth24hPct: number;
  viewsPerPost?: number;
  engagementRate: number;
  postsPerDay: number;
  sparklineData?: number[];
};

export type GameSnapshot = {
  state: 'LOBBY' | 'NIGHT' | 'DAY' | 'VOTE' | 'RESOLUTION' | 'END';
  phaseEndsAt: string;
  round: number;
  players: {
    id: string;
    name: string;
    alive: boolean;
    roleSelf?: 'wolf' | 'villager';
  }[];
  tally?: {
    targetId: string;
    count: number;
  }[];
  winner?: 'wolves' | 'villagers';
};

export type GroupMessage = {
  id: string;
  userId: string;
  username: string;
  type: 'text' | 'sticker' | 'gif' | 'audio' | 'image';
  text?: string;
  fileUrl?: string;
  createdAt: string;
};