import { create } from "zustand";

const useGameStore = create((set) => ({
	room: null,
	playerId: "",
	playerName: "",
	players: [],
	question: null,
	phase: "waiting", // waiting | prepare | question | result | finished
	result: null,
	leaderboard: [],
	round: null,
	error: "",

	setRoom: (room) => set({ room }),
	setPlayerId: (playerId) => set({ playerId }),
	setPlayerName: (playerName) => set({ playerName }),
	setPlayers: (players) => set({ players }),
	setQuestion: (question) => set({ question }),
	setPhase: (phase) => set({ phase }),
	setResult: (result) => set({ result }),
	setLeaderboard: (leaderboard) => set({ leaderboard }),
	setRound: (round) => set({ round }),
	setError: (error) => set({ error }),
	clearError: () => set({ error: "" }),
	reset: () =>
		set({
			room: null,
			playerId: "",
			playerName: "",
			players: [],
			question: null,
			phase: "waiting",
			result: null,
			leaderboard: [],
			round: null,
			error: "",
		}),
}));

export default useGameStore;
