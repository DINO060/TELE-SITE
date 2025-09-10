import { User, Channel, Post, Media, Kpis, GameSnapshot, GroupMessage, Comment, PostSource } from '../types';

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const generateId = () => Math.random().toString(36).substr(2, 9);

// Storage keys
const STORAGE_KEYS = {
  currentUser: 'currentUser',
  users: 'users',
  channels: 'channels',
  posts: 'posts',
  kpisByChannel: 'kpisByChannel',
  game: 'game',
  settings: 'settings',
  groupMessages: 'groupMessages',
};

// Initialize mock data if not exists
const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.channels)) {
    const mockChannels: Channel[] = [
      {
        id: '1',
        title: 'Tech Actualités',
        handle: 'techactu',
        avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200',
        followers: 125000,
        verified: true,
        description: 'Les dernières actualités tech 🚀',
        coverImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200',
        category: 'Technology',
      },
      {
        id: '2',
        title: 'Crypto Daily',
        handle: 'cryptodaily',
        avatar: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=200',
        followers: 89000,
        verified: true,
        description: 'Analyses crypto quotidiennes 📊',
        category: 'Finance',
      },
      {
        id: '3',
        title: 'Design Inspiration',
        handle: 'designinsp',
        avatar: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200',
        followers: 45000,
        description: 'Inspiration design quotidienne 🎨',
        category: 'Design',
      },
      {
        id: '4',
        title: 'Dev Tips',
        handle: 'devtips',
        avatar: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=200',
        followers: 67000,
        verified: true,
        description: 'Astuces de développement 💻',
        category: 'Programming',
      },
      {
        id: '5',
        title: 'Marketing Pro',
        handle: 'marketingpro',
        avatar: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=200',
        followers: 34000,
        description: 'Stratégies marketing gagnantes 📈',
        category: 'Marketing',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.channels, JSON.stringify(mockChannels));

    const channelPosts: Post[] = [
      {
        id: '1',
        author: mockChannels[0],
        body: '🚀 Nouveau record ! Notre canal vient de dépasser les 125K abonnés ! Merci à tous pour votre soutien incroyable. On continue l\'aventure ensemble !',
        media: {
          url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
          type: 'image',
        },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        metrics: {
          views: 15420,
          shares: 234,
          reactions: 1892,
          comments: 89,
        },
        likedBy: [],
        comments: [],
        source: 'channel',
        telegramDeepLink: 'https://t.me/techactu/1234',
      },
      {
        id: '2',
        author: mockChannels[1],
        body: '📊 Analyse du jour : Bitcoin franchit les 50K$ ! Les indicateurs techniques sont au vert. Thread complet ⬇️',
        media: {
          url: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800',
          type: 'image',
        },
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        metrics: {
          views: 28900,
          shares: 567,
          reactions: 3421,
          comments: 234,
        },
        likedBy: [],
        comments: [],
        source: 'channel',
        telegramDeepLink: 'https://t.me/cryptodaily/5678',
      },
      {
        id: '3',
        author: mockChannels[2],
        body: '💡 Astuce design : Utilisez le nombre d\'or (1.618) pour créer des proportions harmonieuses dans vos compositions',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        metrics: {
          views: 8900,
          shares: 123,
          reactions: 892,
          comments: 45,
        },
        likedBy: [],
        comments: [],
        source: 'channel',
        telegramDeepLink: 'https://t.me/designinsp/9012',
      },
      {
        id: '4',
        author: mockChannels[3],
        body: '🎯 Thread : Comment j\'ai optimisé mon app React et divisé le bundle size par 3 (1/8)',
        media: {
          url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
          type: 'image',
        },
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        metrics: {
          views: 12300,
          shares: 345,
          reactions: 1567,
          comments: 123,
        },
        likedBy: [],
        comments: [],
        source: 'channel',
        telegramDeepLink: 'https://t.me/devtips/3456',
      },
      {
        id: '5',
        author: mockChannels[4],
        body: '📈 Les posts avec émojis ont 43% plus d\'engagement ! Voici notre étude complète sur 10K posts analysés',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        metrics: {
          views: 6700,
          shares: 89,
          reactions: 456,
          comments: 34,
        },
        likedBy: [],
        comments: [],
        source: 'channel',
        telegramDeepLink: 'https://t.me/marketingpro/7890',
      },
    ];

    // Ajouter quelques posts de site (créés par les utilisateurs)
    const sitePosts: Post[] = [
      {
        id: 'site1',
        author: {
          id: 'user1',
          title: 'JohnDoe',
          handle: 'johndoe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
          followers: 1234,
          verified: false,
        },
        body: 'Premier post sur la plateforme ! Hâte de partager mes découvertes tech avec vous 🚀',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        metrics: {
          views: 245,
          shares: 12,
          reactions: 34,
          comments: 5,
        },
        likedBy: [],
        comments: [],
        source: 'site',
      },
      {
        id: 'site2',
        author: {
          id: 'user2',
          title: 'Alice Dev',
          handle: 'alicedev',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
          followers: 567,
          verified: false,
        },
        body: 'Vient de terminer mon projet React ! Les hooks sont vraiment puissants pour gérer l\'état 💻',
        media: {
          url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
          type: 'image',
        },
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        metrics: {
          views: 189,
          shares: 8,
          reactions: 23,
          comments: 3,
        },
        likedBy: [],
        comments: [],
        source: 'site',
      },
    ];

    const allPosts = [...channelPosts, ...sitePosts];
    localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(allPosts));

    // Initialize KPIs
    const kpis: Record<string, Kpis> = {};
    mockChannels.forEach(channel => {
      kpis[channel.handle] = {
        followers: channel.followers,
        growth24hPct: Math.random() * 10 - 2,
        viewsPerPost: Math.floor(Math.random() * 20000) + 5000,
        engagementRate: Math.random() * 8 + 2,
        postsPerDay: Math.random() * 3 + 0.5,
        sparklineData: Array.from({ length: 30 }, () => Math.random() * 100 + 50),
      };
    });
    localStorage.setItem(STORAGE_KEYS.kpisByChannel, JSON.stringify(kpis));

    // Initialize game
    const initialGame: GameSnapshot = {
      state: 'LOBBY',
      phaseEndsAt: new Date(Date.now() + 60 * 1000).toISOString(),
      round: 0,
      players: [
        { id: 'bot1', name: 'Alice', alive: true },
        { id: 'bot2', name: 'Bob', alive: true },
        { id: 'bot3', name: 'Charlie', alive: true },
      ],
    };
    localStorage.setItem(STORAGE_KEYS.game, JSON.stringify(initialGame));

    // Initialize messages
    const messages: GroupMessage[] = [
      {
        id: '1',
        userId: 'bot1',
        username: 'Alice',
        type: 'text',
        text: 'Salut tout le monde ! 👋',
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        userId: 'bot2',
        username: 'Bob',
        type: 'text',
        text: 'On commence quand la partie ?',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.groupMessages, JSON.stringify(messages));

    // Ajouter quelques posts épinglés et avec vidéos pour la démo des canaux
    const posts: Post[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.posts) || '[]');
    
    // Marquer certains posts comme épinglés
    const channelPostsFromStorage = posts.filter(p => p.source === 'channel');
    if (channelPostsFromStorage.length > 0) {
      channelPostsFromStorage[0].pinned = true; // Premier post de canal épinglé
    }
    
    // Ajouter un post avec vidéo longue
    const videoPost: Post = {
      id: generateId(),
      author: mockChannels[1], // Crypto Daily
      body: '🎥 Analyse complète du marché crypto - Vidéo de 8 minutes avec tous les détails ! Cliquez pour voir sur notre canal Telegram 📺',
      media: {
        url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        type: 'video',
        durationSec: 480, // 8 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      },
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      metrics: {
        views: 45200,
        shares: 892,
        reactions: 5431,
        comments: 324,
      },
      pinned: true,
      likedBy: [],
      comments: [],
      source: 'channel',
      telegramDeepLink: 'https://t.me/cryptodaily/9999',
    };
    
    posts.unshift(videoPost);
    localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(posts));
  }
};

// Initialize on load
initializeMockData();

// API Functions
export const registerWithEmail = async (email: string, password: string, username: string): Promise<User> => {
  await delay(1000);
  
  // Check if user already exists
  const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  if (existingUsers.find((u: any) => u.email === email)) {
    throw new Error('Un compte avec cet email existe déjà');
  }
  
  const user: User = {
    id: generateId(),
    username,
    avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=200&h=200&fit=crop&crop=face`,
    email,
    followers: 0,
    following: [],
    verified: false,
    ownedChannels: [],
    followingChannels: ['2', '4', '5'], // Auto-follow some channels
  };
  
  // Store user credentials
  existingUsers.push({ email, password, user });
  localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
  
  return user;
};

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  await delay(800);
  
  const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const userRecord = existingUsers.find((u: any) => u.email === email && u.password === password);
  
  if (!userRecord) {
    throw new Error('Email ou mot de passe incorrect');
  }
  
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(userRecord.user));
  return userRecord.user;
};

export const loginWithTelegramMock = async (): Promise<User> => {
  await delay(500);
  const user: User = {
    id: generateId(),
    username: 'JohnDoe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    telegramHandle: '@johndoe',
    followers: 1234,
    following: [],
    verified: false,
    ownedChannels: ['1', '3'], // Possède Tech Actualités et Design Inspiration
    followingChannels: ['2', '4', '5'], // Suit Crypto Daily, Dev Tips, Marketing Pro
  };
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));

  // Auto-join werewolf game
  const game = getStoredGame();
  if (game && game.state === 'LOBBY') {
    game.players.push({
      id: user.id,
      name: user.username,
      alive: true,
    });
    localStorage.setItem(STORAGE_KEYS.game, JSON.stringify(game));
  }

  return user;
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.currentUser);
  return stored ? JSON.parse(stored) : null;
};

export const getFeed = async (options?: {
  afterId?: string;
  filter?: 'all' | 'pinned' | 'media' | 'videos';
  sort?: 'recent' | 'views' | 'reactions';
  source?: PostSource;
  q?: string;
}): Promise<{ items: Post[] }> => {
  await delay(300);
  const posts: Post[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.posts) || '[]');

  let filtered = [...posts];

  // Filtrer par source si spécifié
  if (options?.source) {
    filtered = filtered.filter(p => p.source === options.source);
  }

  // Filtrer par recherche si spécifié
  if (options?.q) {
    const query = options.q.toLowerCase();
    filtered = filtered.filter(p => 
      p.body.toLowerCase().includes(query) ||
      p.author.title.toLowerCase().includes(query) ||
      p.author.handle.toLowerCase().includes(query)
    );
  }

  if (options?.filter === 'pinned') {
    filtered = filtered.filter(p => p.pinned);
  } else if (options?.filter === 'media') {
    filtered = filtered.filter(p => p.media);
  } else if (options?.filter === 'videos') {
    filtered = filtered.filter(p => p.media?.type === 'video');
  }

  if (options?.sort === 'views') {
    filtered.sort((a, b) => (b.metrics.views || 0) - (a.metrics.views || 0));
  } else if (options?.sort === 'reactions') {
    filtered.sort((a, b) => b.metrics.reactions - a.metrics.reactions);
  } else {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return { items: filtered.slice(0, 10) };
};

export const createPost = async (data: {
  body: string;
  media?: Media;
}): Promise<Post> => {
  await delay(1000);

  // Validate video duration
  if (data.media?.type === 'video' && data.media.durationSec && data.media.durationSec > 300) {
    throw new Error(`Vidéo trop longue (${Math.floor(data.media.durationSec / 60)}:${(data.media.durationSec % 60).toString().padStart(2, '0')}). Max 5:00`);
  }

  const user = getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  const channel: Channel = {
    id: user.id,
    title: user.username,
    handle: user.telegramHandle?.replace('@', '') || user.username.toLowerCase(),
    avatar: user.avatar,
    followers: user.followers || 0,
    verified: user.verified,
  };

  const post: Post = {
    id: generateId(),
    author: channel,
    body: data.body,
    media: data.media,
    createdAt: new Date().toISOString(),
    metrics: {
      views: 0,
      shares: 0,
      reactions: 0,
      comments: 0,
    },
    likedBy: [],
    comments: [],
    source: 'site', // Les posts créés via l'interface sont des posts de site
  };

  const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.posts) || '[]');
  posts.unshift(post);
  localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(posts));

  return post;
};

export const toggleLike = async (postId: string): Promise<void> => {
  await delay(100);
  const user = getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  const posts: Post[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.posts) || '[]');
  const post = posts.find(p => p.id === postId);
  if (!post) throw new Error('Post non trouvé');

  if (!post.likedBy) post.likedBy = [];

  const index = post.likedBy.indexOf(user.id);
  if (index > -1) {
    post.likedBy.splice(index, 1);
    post.metrics.reactions--;
  } else {
    post.likedBy.push(user.id);
    post.metrics.reactions++;
  }

  localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(posts));
};

export const addComment = async (postId: string, text: string): Promise<Comment> => {
  await delay(300);
  const user = getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  const posts: Post[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.posts) || '[]');
  const post = posts.find(p => p.id === postId);
  if (!post) throw new Error('Post non trouvé');

  const comment: Comment = {
    id: generateId(),
    author: user,
    text,
    createdAt: new Date().toISOString(),
  };

  if (!post.comments) post.comments = [];
  post.comments.push(comment);
  post.metrics.comments++;

  localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(posts));
  return comment;
};

export const getChannels = async (): Promise<Channel[]> => {
  await delay(200);
  const channels = localStorage.getItem(STORAGE_KEYS.channels);
  return channels ? JSON.parse(channels) : [];
};

export const getChannelKpis = async (handle: string): Promise<Kpis | null> => {
  await delay(200);
  const kpis = localStorage.getItem(STORAGE_KEYS.kpisByChannel);
  if (!kpis) return null;
  const parsed = JSON.parse(kpis);
  return parsed[handle] || null;
};

// Game API
const getStoredGame = (): GameSnapshot | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.game);
  return stored ? JSON.parse(stored) : null;
};

export const getGameSnapshot = async (): Promise<GameSnapshot | null> => {
  await delay(100);
  return getStoredGame();
};

export const joinGame = async (): Promise<void> => {
  await delay(300);
  const user = getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  const game = getStoredGame();
  if (!game || game.state !== 'LOBBY') throw new Error('Impossible de rejoindre');

  if (!game.players.find(p => p.id === user.id)) {
    game.players.push({
      id: user.id,
      name: user.username,
      alive: true,
    });
    localStorage.setItem(STORAGE_KEYS.game, JSON.stringify(game));
  }
};

export const startGame = async (): Promise<void> => {
  await delay(500);
  const game = getStoredGame();
  if (!game || game.players.length < 4) throw new Error('Pas assez de joueurs');

  // Assign roles randomly
  const shuffled = [...game.players].sort(() => Math.random() - 0.5);
  const wolfCount = Math.floor(game.players.length / 3);
  
  shuffled.forEach((player, i) => {
    player.roleSelf = i < wolfCount ? 'wolf' : 'villager';
  });

  game.state = 'NIGHT';
  game.round = 1;
  game.phaseEndsAt = new Date(Date.now() + 60 * 1000).toISOString();

  localStorage.setItem(STORAGE_KEYS.game, JSON.stringify(game));
};

export const sendGameMessage = async (text: string): Promise<GroupMessage> => {
  await delay(200);
  const user = getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  const message: GroupMessage = {
    id: generateId(),
    userId: user.id,
    username: user.username,
    type: 'text',
    text,
    createdAt: new Date().toISOString(),
  };

  const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.groupMessages) || '[]');
  messages.push(message);
  localStorage.setItem(STORAGE_KEYS.groupMessages, JSON.stringify(messages));

  return message;
};

export const getGameMessages = async (): Promise<GroupMessage[]> => {
  await delay(100);
  const messages = localStorage.getItem(STORAGE_KEYS.groupMessages);
  return messages ? JSON.parse(messages) : [];
};

export const logout = async (): Promise<void> => {
  await delay(200);
  localStorage.removeItem(STORAGE_KEYS.currentUser);
};