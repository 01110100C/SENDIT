# SendIt

A social app for climbers. Log the climbs you send, share them with the community, get a personalized training plan, and see how you stack up against other climbers.

## Features

### Community feed (Home)
- Scrollable feed of climbs posted by the community
- Each post shows the climber, location, title and grade, a photo, and notes
- Like posts and join the conversation in the comments
- Quick "Log a climb..." bar at the top of the feed

### Log a climb
- Upload a photo of the climb
- Title
- Grade, picked from either scale:
  - **Boulder:** V0 – V17
  - **Route:** 5.6 – 5.15d
- Location (crag, gym, or area)
- Notes for beta, conditions, or how it felt

### Profile
- Profile picture
- Username, with a "Climbing since YYYY" line underneath
- Bio section to write about yourself
- Stats for number of climbs logged and years climbing
- Grid of every climb you've posted; tap one to open it with its full photo and comments

### Train
- A climbing coach chatbot built into the app
- Tell it your current grade, goals, schedule, and any injuries, and it generates a personalized training plan
- Ask follow-up questions about technique, finger strength, recovery, and projecting
- Adjust the plan as you progress

### Finder
- Find crags, gyms, and climbing partners near you

### Rank
- Leaderboards that rank climbers by their logged sends

## Tech stack

| | |
|---|---|
| **Language** | TypeScript |
| **Framework** | [React Native](https://reactnative.dev) 0.86 with [React](https://react.dev) 19 |
| **Platform / tooling** | [Expo](https://expo.dev) SDK 57 |
| **Navigation** | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing, typed routes) |
| **Backend** | [Supabase](https://supabase.com): Postgres database, authentication, and photo storage |
| **Images** | `expo-image` for display, `expo-image-picker` for uploads |
| **Icons** | `@expo/vector-icons` (Ionicons) |
| **State** | React Context (`src/store/AppStore.tsx`) |

Runs on iOS, Android, and web.

## Getting started

### Prerequisites
- [Node.js](https://nodejs.org) 20 or newer
- The [Expo Go](https://expo.dev/go) app on your phone, or an iOS Simulator / Android Emulator

### Install and run

```bash
cd SendIt
npm install
npm start
```

Then scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `i` for the iOS Simulator, `a` for the Android Emulator, or `w` for web.

Other scripts:

| Command | What it does |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run ios` | Start and open the iOS Simulator |
| `npm run android` | Start and open the Android Emulator |
| `npm run web` | Start and open in the browser |
| `npm run lint` | Run the linter |

## Project structure

```
SendIt/
├── app.json                  Expo app config
├── assets/                   App icons and splash images
└── src/
    ├── app/                  Screens (each file is a route)
    │   ├── _layout.tsx       Root stack and app-wide providers
    │   ├── (tabs)/           Bottom tab screens
    │   │   ├── _layout.tsx   Tab bar setup
    │   │   ├── index.tsx     Home / community feed
    │   │   ├── profile.tsx   Profile
    │   │   ├── train.tsx     Training chatbot
    │   │   ├── finder.tsx    Crag, gym, and partner finder
    │   │   └── ranked.tsx    Leaderboards
    │   ├── create-climb.tsx  Log a climb (opens as a modal)
    │   └── post/[id].tsx     Single climb with all comments
    ├── components/           Reusable UI (PostCard, Avatar, CreatePostPrompt)
    ├── constants/theme.ts    Colors, spacing, font sizes, grade lists
    ├── store/AppStore.tsx    App data and actions
    └── utils/pickImage.ts    Photo library picker helper
```

## Theme

The app uses a forest green background with beige and stone grey accents. All colors are defined in one place, [`src/constants/theme.ts`](SendIt/src/constants/theme.ts). Screens use role names (`background`, `surface`, `text`, `primary`, …) rather than raw colors, so the look can be changed from that one file.

## Database

SendIt uses Supabase for its backend:
- **Auth:** sign up and log in with Supabase Auth
- **Storage:** buckets for climb photos and profile pictures
- **Tables:**

| Table | Columns |
|---|---|
| `profiles` | `id` (matches the auth user), `username`, `bio`, `climbing_since`, `avatar_url` |
| `posts` | `id`, `user_id`, `image_url`, `title`, `grade`, `location`, `notes`, `created_at` |
| `likes` | `post_id`, `user_id` (one like per user per post) |
| `comments` | `id`, `post_id`, `user_id`, `text`, `created_at` |

Row Level Security ensures users can only edit their own profile, posts, likes, and comments.
