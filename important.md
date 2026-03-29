# Quiz Blitz Interview Notes

## 1 Minute Project Summary

Quiz Blitz is a real-time multiplayer quiz app built with React, Node.js, Socket.IO, and Redis. One user becomes the host, creates a room, adds questions, and starts the game. Players join with a room code, receive questions at the same time, submit answers in real time, and the backend calculates scores based on correctness plus speed. After all questions, the server sends the final leaderboard.

## Most Important Interview Questions

### Why did you use Socket.IO?

Because this is a real-time multiplayer app. When the host starts the quiz or a new question begins, every player should get that update instantly. Polling would be slower and less synchronized.

### Why did you use Redis?

Redis is fast and fits temporary game data very well. I used it for room state, per-question answers, and leaderboard scores. It also gives useful data structures like hashes and sorted sets.

### Why Redis and not only MongoDB / SQL?

Because this project is latency-sensitive and mostly works with short-lived live state. Redis is better for that. If I wanted long-term history, analytics, or user accounts, I would add a persistent database as well.

### What exactly is stored in Redis?

- Room state
- Answers for each question
- Leaderboard scores

### Why did you use a Redis hash for answers?

Each question needs one answer per player, so a hash is a clean `playerId -> answer` structure.

### Why did you use a Redis sorted set for scores?

Because leaderboards are ranking problems, and sorted sets are built exactly for score ordering and fast retrieval.

### Why React on the frontend?

Because the app has multiple UI states like home, lobby, game, and result, and React makes it easier to manage those screens cleanly.

### Why Zustand instead of Redux?

The state was shared, but not complex enough to need Redux. Zustand is lighter, simpler, and good for socket-driven updates.

### Why localStorage also?

Zustand resets on refresh, but localStorage keeps player and room info, which helps with reconnect and rejoin flow.

### Why Express if you already used Socket.IO?

Socket.IO handles real-time events, but Express is still useful for normal HTTP APIs. In this project, AI question generation and file-based processing fit better as HTTP endpoints.

## How The App Works

1. Host creates a room.
2. Players join using the room code.
3. Host adds questions and starts the quiz.
4. Backend sends a prepare phase, then sends the question.
5. Players submit one answer each.
6. Backend checks correctness and response time.
7. Scores are updated in Redis.
8. After all questions, backend emits the final leaderboard.

## Important “Why” Questions

### Why score based on speed?

To make the game more competitive and engaging. If scoring was only correct or wrong, the quiz would feel less dynamic.

### Why calculate score on the backend?

Because the backend is the trusted source. If score logic stayed on the client, it could be manipulated.

### Why validate answers on the backend if frontend already validates?

Frontend validation is only for user experience. Backend validation is required for security and correctness.

### Why not allow multiple answers?

To keep the game fair. The backend uses Redis `HSETNX`, so one player can submit only once for a question.

### How do you prevent late answers?

The backend checks the current time against the question start time and question duration. If time is over, the answer is rejected.

### Why are sockets better than REST here?

Because quiz rounds are synchronized events. The server needs to push updates immediately to everyone in the room.

## Honest Limitations

### What are the current limitations?

- Timers are in one backend process
- No authentication yet
- No rate limiting yet
- Room state is stored as one JSON object
- Not fully ready for multi-server scale

### What would you improve next?

- Add authentication
- Add tests
- Add Socket.IO Redis adapter for scaling
- Move timers to shared/durable orchestration
- Add room expiry and cleanup

## Best Short Answers To Remember

### Why Redis?

Because it is fast, in-memory, and a strong fit for real-time temporary quiz data.

### Why Socket.IO?

Because the app needs instant server-to-client updates for synchronized gameplay.

### Why Zustand?

Because it manages shared real-time state with less boilerplate than Redux.

### Why backend scoring?

Because scoring must be trusted and cannot depend on the client.

### Why not only REST?

Because REST is not ideal for live multiplayer synchronization.
