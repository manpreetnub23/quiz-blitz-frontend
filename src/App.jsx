import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Result from "./pages/Result";
import AiQuestionBuilder from "./pages/AiQuestionBuilder";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/lobby" element={<Lobby />} />
				<Route path="/ai-questions" element={<AiQuestionBuilder />} />
				<Route path="/game" element={<Game />} />
				<Route path="/result" element={<Result />} />
			</Routes>
		</BrowserRouter>
	);
}
