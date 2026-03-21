import { io } from "socket.io-client";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const socket = io(baseURL, {
	autoConnect: false,
	reconnection: true,
});

export default socket;
