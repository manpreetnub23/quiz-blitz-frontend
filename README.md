# Quiz Frontend (React + Vite + Socket.IO)

Realtime multiplayer quiz frontend for the QuizBlitz app.

## Features

- Create room / join room with name + room code
- Host-only lobby controls (add questions, launch quiz)
- Animated game phases:
  - prepare
  - question
  - result
  - final leaderboard
- Socket-based realtime sync with backend
- Zustand store for global game state

## Tech Stack

- React 19
- Vite
- React Router
- Socket.IO Client
- Zustand
- Tailwind CSS

## Routes

- `/` - Home (create/join room)
- `/lobby` - Lobby (players + host controls)
- `/game` - Live quiz screen
- `/result` - Final leaderboard

## Environment

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Install

```bash
cd frontend
npm install
```

## Run

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Socket Flow

Socket client is created in:
- `src/socket/socket.js`

Global listeners are registered once in:
- `src/socket/listeners.js`

Main incoming events handled:
- `player_identity`
- `room_created`
- `player_joined`
- `room_state`
- `question_added`
- `question_prepare`
- `question_start`
- `question_result`
- `quiz_finished`
- `answer_rejected`
- `error`

## State Management

Global state lives in:
- `src/store/useGameStore.js`

Important state keys:
- `room`
- `playerId`
- `playerName`
- `phase`
- `question`
- `result`
- `leaderboard`
- `round`
- `error`

## Notes

- This frontend expects the backend Socket.IO server to be running.
- `playerId` and `roomCode` are cached in `localStorage` for reconnect/rejoin behavior.
