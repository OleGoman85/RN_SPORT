# RN Sport

RN Sport is a mobile app for finding people to play sports with, creating local sport events, joining games, saving useful contacts, and chatting with players.

The app is built as a full-stack TypeScript project:

- `FrontEnd`: Expo / React Native mobile application.
- `BackEnd`: Express REST API connected to Neon PostgreSQL.

## Screenshots

| Home and Events | Discovery Filters |
| --- | --- |
| <img src="docs/screenshots/home-events.png" width="420" alt="Home and Events screens" /> | <img src="docs/screenshots/discovery-filters.png" width="420" alt="Events filters and nearby search" /> |

| Event Details | Chat Rooms |
| --- | --- |
| <img src="docs/screenshots/event-details.png" width="420" alt="Event details modal and public player profile" /> | <img src="docs/screenshots/chat-room.png" width="420" alt="Private and event chat rooms" /> |

| Create Event | Event Location Picker |
| --- | --- |
| <img src="docs/screenshots/create-event-form.png" width="260" alt="Create event form" /> | <img src="docs/screenshots/event-location-picker.png" width="260" alt="Map-based event location picker" /> |

| Contacts | Profile |
| --- | --- |
| <img src="docs/screenshots/contacts-tab.png" width="260" alt="Contacts tab with messages and saved players" /> | <img src="docs/screenshots/profile-main.png" width="260" alt="Editable profile form" /> |

| Sports and Languages | Edit Event |
| --- | --- |
| <img src="docs/screenshots/profile-sports.png" width="260" alt="Profile sports, levels, and languages" /> | <img src="docs/screenshots/edit-event.png" width="260" alt="Edit existing event form" /> |

## Main Features

- Clerk authentication: sign up, sign in, persistent mobile session.
- Editable player profile with avatar, about text, birth date, sex, country, city, sports, levels, languages, and optional coordinates.
- Avatar upload through the backend to Cloudinary.
- Public player profile previews from event details and contacts.
- Sport event discovery on Home and Events tabs.
- Event filters by day, sport search, event format, and nearby radius.
- Event formats: `1v1` and `team`.
- Map-based event location picker using `react-native-maps`.
- Create, edit, and soft-delete own events.
- Join events and view joined players.
- Save players to one-way contacts/address book.
- Private chats between saved contacts.
- Event chats for event creators and joined players.
- Unread message badges on Home, Messages, Event Chats, and chat cards.
- Polling-based message refresh in active chat rooms.
- Ability to hide past event chats from the current user's list.

## Tech Stack

### Frontend

- Expo
- React Native
- Expo Router
- TypeScript
- Clerk Expo SDK
- React Navigation tabs
- Expo Location
- Expo Image Picker
- React Native Maps
- React Native Calendars
- Ionicons

### Backend

- Node.js
- Express
- TypeScript
- Neon PostgreSQL
- Cloudinary
- Multer
- Upstash Redis
- Upstash Ratelimit

### External Services

- Clerk: authentication and current user identity.
- Neon: PostgreSQL database.
- Cloudinary: hosted avatar images.
- Upstash Redis: rate limiting storage.
- Expo: mobile development runtime.

## Library Reference

### Frontend Libraries

| Library | Purpose |
| --- | --- |
| `expo` | Main React Native framework and development runtime. |
| `react` | Component model, state, hooks, and rendering logic. |
| `react-native` | Core mobile UI primitives such as `View`, `Text`, `Image`, `Pressable`, `FlatList`. |
| `expo-router` | File-based routing and navigation structure. |
| `@react-navigation/native` | Navigation foundation used by Expo Router and tabs. |
| `@react-navigation/bottom-tabs` | Bottom tab navigation. |
| `@react-navigation/elements` | Navigation UI helpers. |
| `@clerk/expo` | Authentication, current user session, and Clerk user identity. |
| `expo-secure-store` | Secure local token/session storage for Clerk. |
| `expo-location` | Current device location and reverse geocoding support. |
| `react-native-maps` | Map view and marker selection for event locations. |
| `expo-image-picker` | Selecting avatar images from gallery or camera. |
| `expo-image` | Optimized image rendering. |
| `@expo/vector-icons` | Icon set used for tabs, buttons, and metadata rows. |
| `expo-symbols` | Native symbol support for Expo UI where available. |
| `react-native-calendars` | Calendar UI support. |
| `@react-native-community/datetimepicker` | Native date/time picker support. |
| `@react-native-community/slider` | Slider UI support. |
| `react-native-safe-area-context` | Safe area handling for iOS/Android screen edges. |
| `react-native-screens` | Native screen primitives used by navigation. |
| `react-native-gesture-handler` | Gesture support for React Native navigation/UI interactions. |
| `react-native-reanimated` | Animation support. |
| `react-native-worklets` | Worklet runtime used by React Native animation infrastructure. |
| `react-native-keyboard-aware-scroll-view` | Keyboard-aware form scrolling. |
| `react-dom` / `react-native-web` | Web runtime support when running the Expo app in a browser. |
| `expo-font` | Font loading. |
| `expo-splash-screen` | Splash screen control during app startup. |
| `expo-status-bar` | Status bar configuration. |
| `expo-constants` | App/environment constants. |
| `expo-linking` | Deep linking support. |
| `expo-web-browser` | Browser session support used by auth flows. |
| `expo-system-ui` | System UI configuration. |
| `expo-haptics` | Haptic feedback support. |
| `typescript` | Static typing and compile-time checks. |
| `@types/node` / `@types/react` | TypeScript type definitions for Node and React. |
| `eslint` / `eslint-config-expo` | Frontend linting. |

### Backend Libraries

| Library | Purpose |
| --- | --- |
| `express` | HTTP server, API routes, request/response handling. |
| `@clerk/express` | Clerk backend integration for auth-aware API logic. |
| `dotenv` | Loads backend environment variables from `.env`. |
| `@neondatabase/serverless` | Serverless PostgreSQL client for Neon. |
| `cloudinary` | Uploads and hosts user avatar images. |
| `multer` | Handles multipart file uploads before sending images to Cloudinary. |
| `@upstash/redis` | Redis client used by rate limiting. |
| `@upstash/ratelimit` | Request rate limiting middleware support. |
| `cors` | Cross-origin request support. |
| `tsx` | Runs TypeScript directly in development. |
| `typescript` | Static typing and backend type checks. |
| `nodemon` | Development auto-restart helper. |
| `@types/express`, `@types/multer`, `@types/node` | TypeScript type definitions for backend libraries/runtime. |

## Project Structure

```text
RN_SPORT/
  BackEnd/
    src/
      config/          Database, Cloudinary, Upstash configuration
      routes/          Public REST API endpoints
      services/        Database/business logic
      utils/           Validation helpers
      server.ts        Express server startup

  FrontEnd/
    app/               Expo Router screens and navigation layouts
    components/        Reusable UI components
    hooks/             Screen/domain behavior hooks
    services/          Frontend API services using fetch
    styles/            React Native StyleSheet files
    types/             Shared frontend TypeScript types
    utils/             Formatting and form helpers
```

## Architecture Overview

The app uses a classic mobile client plus REST API structure.

```text
React Native screen
  -> frontend hook
  -> frontend API service
  -> Express route
  -> backend service
  -> Neon PostgreSQL
  -> JSON response
  -> frontend state update
  -> UI re-render
```

Example: sending a chat message.

```text
User types message
  -> ChatComposer calls handleSendPress
  -> useChatRoom calls sendChatMessage
  -> POST /api/chats/:chatId/messages
  -> chatMessages service validates participant access
  -> INSERT INTO chat_messages
  -> update chats.updated_at
  -> return inserted message
  -> frontend appends message to state
```

## Chat System

Chats are stored with one shared model:

- `chats`: chat room metadata.
- `chat_participants`: users inside each chat, read state, and archive state.
- `chat_messages`: individual messages.

There are two chat types:

- `private`: direct chat between two users.
- `event`: shared chat for one sport event.

Unread messages are calculated by comparing message creation time with each participant's `last_read_at`.

```text
message.sender_user_id != currentUser.id
and message.created_at > currentParticipant.last_read_at
```

The current implementation uses polling:

- Chat room messages refresh every 5 seconds.
- Contacts chat lists refresh every 12 seconds.
- Home unread badge refreshes every 12 seconds.

This is simpler than WebSocket/realtime infrastructure and works well for an MVP. A future upgrade could replace polling with WebSocket, Socket.IO, Supabase Realtime, Pusher, Ably, or another realtime service.

## Environment Variables

Create local `.env` files from the examples:

```bash
cp BackEnd/.env.example BackEnd/.env
cp FrontEnd/.env.example FrontEnd/.env
```

### Backend `.env`

```env
PORT=5001
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Where to get them:

- `DATABASE_URL`: Neon Console -> Project -> Connection details.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: Upstash Console -> Redis database -> REST API.
- `CLOUDINARY_*`: Cloudinary Console -> Dashboard / API Keys.

### Frontend `.env`

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5001
```

Where to get them:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk Dashboard -> Application -> API keys.
- `EXPO_PUBLIC_API_URL`: the backend base URL. For a physical phone or simulator on the same network, use the LAN IP of the computer running the backend.

Do not put secrets in `EXPO_PUBLIC_*` variables. They are bundled into the mobile app.

## Installation

Install backend dependencies:

```bash
cd BackEnd
npm install
```

Install frontend dependencies:

```bash
cd FrontEnd
npm install
```

## Running Locally

Start the backend:

```bash
cd BackEnd
npm run dev
```

Start the Expo frontend:

```bash
cd FrontEnd
npx expo start
```

Then choose iOS simulator, Android emulator, Expo Go, or a development build depending on your setup.

## Available Scripts

Backend:

```bash
npm run dev      # Start backend in watch mode
npm run check    # TypeScript check
npm run build    # Compile TypeScript
npm run start    # Start compiled backend
```

Frontend:

```bash
npm run start    # Start Expo
npm run ios      # Start Expo for iOS
npm run android  # Start Expo for Android
npm run web      # Start Expo for web
npm run lint     # Expo lint
```

## Useful Checks

From `BackEnd`:

```bash
npm run check -- --pretty false
```

From `FrontEnd`:

```bash
./node_modules/.bin/tsc --noEmit --pretty false
npm run lint
```

## REST API Overview

Main backend route groups:

```text
/api/users       Profile and public player profiles
/api/sports      Events, event details, joining, My Events
/api/contacts    Saved contacts/address book
/api/chats       Private chats, event chats, messages, unread counts
/api/upload      Avatar uploads
```

## Database Overview

Main tables:

- `users`: player profiles and Clerk identity.
- `user_sports`: sports and levels selected by each user.
- `user_languages`: languages selected by each user.
- `sport_events`: created events.
- `sport_event_members`: joined event members.
- `user_contacts`: one-way saved contacts.
- `chats`: private/event chat rooms.
- `chat_participants`: chat membership, read state, hidden state.
- `chat_messages`: chat messages.

The backend initializes required tables and indexes on startup through `initDB()`.

## Notes for Development

- Frontend does not talk to the database directly. It only calls the backend API.
- Backend services contain database logic.
- Frontend `services/*Api.ts` files wrap `fetch` calls.
- Frontend hooks own screen behavior and state.
- Frontend components should stay mostly presentational.
- Event deletion is a soft delete through `is_active = false`, so historical activity can still be counted.
- Event chat hiding is per user through `chat_participants.archived_at`; it does not delete messages for other participants.

## Future Improvements

- Replace polling chat updates with WebSocket or realtime service.
- Add push notifications for new messages.
- Add message delivery/read indicators.
- Add image messages or event attachments.
- Add richer map search and place autocomplete.
- Add automated tests for backend services and frontend hooks.
- Add production deployment instructions.
