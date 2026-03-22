# Quiz Frontend (React + Vite + Socket.IO)

Realtime multiplayer quiz frontend for creating/joining rooms, running live quizzes, and generating host questions with AI.

## Features

- Create room or join with name + room code
- Host controls in lobby:
  - add manual MCQ questions
  - delete added questions before launch
  - start quiz
- AI Question Builder page (`/ai-questions`):
  - prompt/topic + number of MCQs
  - optional chapter/context text
  - upload `PDF`, `DOCX`, `TXT`, `MD` to extract text
  - preview generated MCQs
  - add generated questions into the same room
- Realtime game phases:
  - prepare
  - question
  - result
  - finished leaderboard
- Socket sync with backend + Zustand global state

## Tech Stack

- React 19
- Vite
- React Router
- Socket.IO Client
- Zustand
- Tailwind CSS 4

## Routes

- `/` Home (create/join room)
- `/lobby` Lobby (players + host controls)
- `/ai-questions` AI MCQ generation and upload-assisted question creation
- `/game` Live quiz screen
- `/result` Final leaderboard

## Environment

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Install and Run

```bash
cd frontend
npm install
npm run dev
```

Other scripts:

- `npm run build`
- `npm run preview`
- `npm run lint`

## API Usage from Frontend

The AI page calls backend REST endpoints:

- `POST /api/ai/extract-text` (multipart form file upload)
- `POST /api/ai/generate-mcq` (JSON body)

After generation, questions are saved through socket `add_question` and appear in lobby immediately.

## Socket Flow

Socket client:
- `src/socket/socket.js`

Global listeners:
- `src/socket/listeners.js`

Main server events consumed:
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

Store:
- `src/store/useGameStore.js`

Important keys:
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

- Backend (Socket.IO + REST AI endpoints) must be running first.
- `playerId` and `roomCode` are cached in `localStorage` to support rejoin/reconnect.
