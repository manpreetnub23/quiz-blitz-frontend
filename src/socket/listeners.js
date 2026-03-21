import socket from "./socket";
import useGameStore from "../store/useGameStore";

let initialized = false;

export const initSocketListeners = () => {
	if (initialized) return;

	const {
		setPhase,
		setQuestion,
		setResult,
		setLeaderboard,
		setRoom,
		setRound,
		setPlayerId,
		setError,
	} =
		useGameStore.getState();

	socket.on("connect", () => {
		setError("");
	});

	socket.on("connect_error", (err) => {
		setError(err?.message || "Connection failed");
	});

	socket.on("player_identity", ({ playerId }) => {
		if (!playerId) return;
		setPlayerId(playerId);
		localStorage.setItem("quiz_player_id", playerId);
	});

	socket.on("room_created", (room) => {
		setRoom(room);
		if (room?.roomCode) localStorage.setItem("quiz_room_code", room.roomCode);
	});

	// ROOM UPDATE
	socket.on("player_joined", (room) => {
		setRoom(room);
		if (room?.roomCode) localStorage.setItem("quiz_room_code", room.roomCode);
	});

	socket.on("question_added", (payload) => {
		if (Array.isArray(payload)) {
			const previous = useGameStore.getState().room || {};
			setRoom({ ...previous, questions: payload || [] });
			return;
		}
		if (payload && typeof payload === "object") {
			setRoom(payload);
		}
	});

	socket.on("room_state", (room) => {
		const previous = useGameStore.getState().room || {};
		const merged = { ...previous, ...room };
		setRoom(merged);
		if (merged?.roomCode) localStorage.setItem("quiz_room_code", merged.roomCode);
	});

	// PREPARE
	socket.on("question_prepare", (payload) => {
		setPhase("prepare");
		setRound(payload);
	});

	// QUESTION
	socket.on("question_start", (payload) => {
		setPhase("question");
		setQuestion(payload.question);
		setRound(payload);
	});

	// RESULT
	socket.on("question_result", (result) => {
		setPhase("result");
		setResult(result);
	});

	// FINAL
	socket.on("quiz_finished", (leaderboard) => {
		setPhase("finished");
		setLeaderboard(leaderboard);
	});

	socket.on("answer_rejected", ({ reason }) => {
		setError(reason || "Answer rejected");
	});

	socket.on("error", (payload) => {
		const message = payload?.message || payload || "Something went wrong";
		setError(message);
	});

	initialized = true;
};
