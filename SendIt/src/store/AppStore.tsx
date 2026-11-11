import React, { createContext, useContext, useState, type ReactNode } from 'react';

// In-memory app state. There is no backend yet, so everything resets when the
// app reloads. Swap these actions for API calls once a server exists.

export type User = {
  id: string;
  username: string;
  bio: string;
  climbingSince: number;
  avatarUri: string | null;
};

export type Comment = {
  id: string;
  userId: string;
  text: string;
  createdAt: number;
};

export type Post = {
  id: string;
  userId: string;
  imageUri: string | null;
  title: string;
  grade: string;
  location: string;
  notes: string;
  createdAt: number;
  likedBy: string[];
  comments: Comment[];
};

export type NewPost = Pick<Post, 'imageUri' | 'title' | 'grade' | 'location' | 'notes'>;

const CURRENT_USER_ID = 'me';

const SEED_USERS: Record<string, User> = {
  me: {
    id: 'me',
    username: 'you',
    bio: '',
    climbingSince: new Date().getFullYear(),
    avatarUri: null,
  },
  alex: {
    id: 'alex',
    username: 'alex_crimps',
    bio: 'Boulderer. Slab hater.',
    climbingSince: 2018,
    avatarUri: null,
  },
  sam: {
    id: 'sam',
    username: 'sam_sends',
    bio: 'Sport climbing in the Red every fall.',
    climbingSince: 2015,
    avatarUri: null,
  },
};

const now = Date.now();
const SEED_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'alex',
    imageUri: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1080',
    title: 'Midnight Lightning',
    grade: 'V8',
    location: 'Camp 4, Yosemite',
    notes: 'Finally stuck the lightning bolt move. Took 3 sessions.',
    createdAt: now - 1000 * 60 * 60 * 3,
    likedBy: ['sam'],
    comments: [
      { id: 'c1', userId: 'sam', text: 'Huge! Congrats 🔥', createdAt: now - 1000 * 60 * 60 * 2 },
    ],
  },
  {
    id: 'p2',
    userId: 'sam',
    imageUri: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1080',
    title: 'Golden Ticket',
    grade: '5.12c',
    location: 'Red River Gorge, KY',
    notes: 'Pumpy finish. Rest at the third bolt.',
    createdAt: now - 1000 * 60 * 60 * 26,
    likedBy: [],
    comments: [],
  },
];

type AppStore = {
  currentUser: User;
  users: Record<string, User>;
  posts: Post[];
  getUser: (id: string) => User | undefined;
  createPost: (post: NewPost) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  updateProfile: (changes: Partial<Omit<User, 'id'>>) => void;
};

const AppStoreContext = createContext<AppStore | null>(null);

let idCounter = 0;
const makeId = (prefix: string) => `${prefix}_${Date.now()}_${idCounter++}`;

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState(SEED_USERS);
  const [posts, setPosts] = useState(SEED_POSTS);

  const updatePost = (postId: string, update: (p: Post) => Post) =>
    setPosts((prev) => prev.map((p) => (p.id === postId ? update(p) : p)));

  const store: AppStore = {
    currentUser: users[CURRENT_USER_ID],
    users,
    posts,
    getUser: (id) => users[id],
    createPost: (post) =>
      setPosts((prev) => [
        {
          ...post,
          id: makeId('post'),
          userId: CURRENT_USER_ID,
          createdAt: Date.now(),
          likedBy: [],
          comments: [],
        },
        ...prev,
      ]),
    toggleLike: (postId) =>
      updatePost(postId, (p) => ({
        ...p,
        likedBy: p.likedBy.includes(CURRENT_USER_ID)
          ? p.likedBy.filter((id) => id !== CURRENT_USER_ID)
          : [...p.likedBy, CURRENT_USER_ID],
      })),
    addComment: (postId, text) =>
      updatePost(postId, (p) => ({
        ...p,
        comments: [
          ...p.comments,
          { id: makeId('comment'), userId: CURRENT_USER_ID, text, createdAt: Date.now() },
        ],
      })),
    updateProfile: (changes) =>
      setUsers((prev) => ({
        ...prev,
        [CURRENT_USER_ID]: { ...prev[CURRENT_USER_ID], ...changes },
      })),
  };

  return <AppStoreContext.Provider value={store}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const store = useContext(AppStoreContext);
  if (!store) throw new Error('useAppStore must be used inside AppStoreProvider');
  return store;
}

export function timeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(timestamp).toLocaleDateString();
}
