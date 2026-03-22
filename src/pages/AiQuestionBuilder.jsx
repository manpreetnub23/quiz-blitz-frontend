import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import { initSocketListeners } from "../socket/listeners";
import useGameStore from "../store/useGameStore";
import { SPACE_FONT_IMPORT, createStars } from "../theme/space";

const baseURL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").trim();
const STARS = createStars("ai-builder", 70);
const styles = `
${SPACE_FONT_IMPORT}
*,*::before,*::after{box-sizing:border-box}
.ai-root{min-height:100vh;background:#070710;color:#fff;font-family:'Exo 2',sans-serif;padding:28px 14px 40px;position:relative;overflow:hidden}
.ai-sf{position:fixed;inset:0;pointer-events:none;z-index:0}
.ai-star{position:absolute;border-radius:50%;background:#fff;animation:tw ease-in-out infinite}
@keyframes tw{0%,100%{opacity:var(--op,.2);transform:scale(1)}50%{opacity:1;transform:scale(1.75)}}
.ai-wrap{max-width:980px;margin:0 auto;}
.ai-top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px;position:relative;z-index:2}
.ai-title{font-family:'Orbitron',monospace;font-size:22px;letter-spacing:1px}
.ai-sub{font-size:13px;color:rgba(255,255,255,.55)}
.ai-back{border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#fff;border-radius:10px;padding:10px 14px;cursor:pointer}
.ai-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;position:relative;z-index:2}
.ai-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(18px);box-shadow:0 10px 30px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.05);border-radius:16px;padding:16px}
.ai-card ::-webkit-scrollbar{width:4px;height:4px}
.ai-card ::-webkit-scrollbar-thumb{background:rgba(96,165,250,.35);border-radius:8px}
.ai-card ::-webkit-scrollbar-track{background:rgba(255,255,255,.04)}
.ai-label{display:block;font-family:'Orbitron',monospace;font-size:10px;letter-spacing:2px;color:rgba(255,255,255,.55);margin-bottom:8px;text-transform:uppercase}
.ai-input,.ai-text{width:100%;border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.25);color:#fff;border-radius:10px;padding:11px 12px;font-size:14px;outline:none}
.ai-text{min-height:120px;resize:vertical}
.ai-input:focus,.ai-text:focus{border-color:rgba(96,165,250,.9)}
.ai-row{display:flex;gap:10px;align-items:center}
.ai-row-between{display:flex;align-items:center;justify-content:space-between;gap:10px}
.ai-mini-btn{border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:rgba(255,255,255,.75);border-radius:8px;padding:6px 10px;cursor:pointer;font-size:12px}
.ai-mini-btn:hover{background:rgba(96,165,250,.12);color:#bfdbfe;border-color:rgba(96,165,250,.35)}
.ai-file{font-size:12px;color:rgba(255,255,255,.6)}
.ai-btn{border:1px solid rgba(96,165,250,.45);background:rgba(96,165,250,.18);color:#bfdbfe;font-family:'Orbitron',monospace;letter-spacing:1px;border-radius:10px;padding:12px 14px;cursor:pointer;width:100%;margin-top:12px}
.ai-btn:disabled{opacity:.5;cursor:not-allowed}
.ai-btn-save{border-color:rgba(52,211,153,.4);background:rgba(52,211,153,.16);color:#86efac}
.ai-err{margin-top:12px;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);color:#fecaca;padding:10px 12px;border-radius:10px;font-size:13px}
.ai-ok{margin-top:12px;background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.3);color:#86efac;padding:10px 12px;border-radius:10px;font-size:13px}
.ai-list{display:flex;flex-direction:column;gap:10px;max-height:520px;overflow:auto;padding-right:4px}
.ai-q{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);border-radius:12px;padding:12px}
.ai-qt{font-weight:700;margin-bottom:8px}
.ai-op{font-size:13px;color:rgba(255,255,255,.8);margin-bottom:4px}
.ai-correct{font-size:12px;color:#86efac;margin-top:6px}
.ai-input[type="number"]::-webkit-outer-spin-button,
.ai-input[type="number"]::-webkit-inner-spin-button{opacity:1;filter:invert(1) brightness(1.2)}
.ai-input[type="number"]{-moz-appearance:textfield;appearance:textfield}
@media (max-width: 860px){.ai-grid{grid-template-columns:1fr}}
`;

const emitAddQuestion = ({ roomCode, question, playerId }) =>
	new Promise((resolve) => {
		let resolved = false;
		const timeoutId = setTimeout(() => {
			if (resolved) return;
			resolved = true;
			resolve({ ok: false, message: "Timed out while saving question" });
		}, 10000);

		socket.emit(
			"add_question",
			{ roomCode, question, playerId },
			(ack) => {
				if (resolved) return;
				resolved = true;
				clearTimeout(timeoutId);
				resolve(ack || { ok: false, message: "No response from server" });
			},
		);
	});

export default function AiQuestionBuilder() {
	const navigate = useNavigate();
	const room = useGameStore((s) => s.room);
	const playerId = useGameStore((s) => s.playerId);
	const phase = useGameStore((s) => s.phase);
	const [prompt, setPrompt] = useState("");
	const [questionCount, setQuestionCount] = useState(5);
	const [contextText, setContextText] = useState("");
	const [fileName, setFileName] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");
	const [questions, setQuestions] = useState([]);

	const isHost = useMemo(
		() => Boolean(room?.hostId && playerId && room.hostId === playerId),
		[room?.hostId, playerId],
	);

	useEffect(() => {
		initSocketListeners();
		if (!socket.connected) socket.connect();
	}, []);

	useEffect(() => {
		if (["prepare", "question", "result"].includes(phase)) navigate("/game");
		if (phase === "finished") navigate("/result");
	}, [phase, navigate]);

	useEffect(() => {
		if (!room?.roomCode) navigate("/");
		else if (!isHost) navigate("/lobby");
	}, [room?.roomCode, isHost, navigate]);

	const onUpload = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setError("");
		setInfo("");
		setFileName(file.name);

		if (file.size > 10 * 1024 * 1024) {
			setError("File is too large. Keep uploads under 10MB.");
			return;
		}

		try {
			const form = new FormData();
			form.append("file", file);

			const response = await fetch(`${baseURL}/api/ai/extract-text`, {
				method: "POST",
				body: form,
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data?.message || "Failed to parse uploaded file");
			}

			const extracted = data?.text || "";
			if (!extracted.trim()) {
				setError("Could not extract useful text from this file.");
				return;
			}
			setContextText((prev) => (prev ? `${prev}\n\n${extracted}` : extracted));
			setInfo(
				`Loaded ${data?.meta?.fileType?.toUpperCase() || "file"} text from ${file.name}${data?.meta?.truncated ? " (truncated to limit)" : ""}.`,
			);
		} catch (err) {
			setError(err?.message || "This file type is not supported. Use PDF, DOCX, TXT, or MD.");
		}
	};

	const generateQuestions = async () => {
		if (!prompt.trim()) {
			setError("Enter a prompt/topic first.");
			return;
		}

		setError("");
		setInfo("");
		setIsGenerating(true);
		try {
			const response = await fetch(`${baseURL}/api/ai/generate-mcq`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					prompt: prompt.trim(),
					questionCount: Number(questionCount),
					contextText,
				}),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data?.message || "Failed to generate");

			setQuestions(Array.isArray(data?.questions) ? data.questions : []);
			setInfo(
				`Generated ${data?.meta?.generatedCount || 0} questions using ${data?.meta?.provider || "AI"}.`,
			);
		} catch (err) {
			setError(err?.message || "Failed to generate questions");
		} finally {
			setIsGenerating(false);
		}
	};

	const addToRoom = async () => {
		if (!room?.roomCode || !questions.length) return;

		setError("");
		setInfo("");
		setIsSaving(true);

		let successCount = 0;
		for (const question of questions) {
			const ack = await emitAddQuestion({
				roomCode: room.roomCode,
				question,
				playerId,
			});
			if (ack?.ok) {
				successCount += 1;
				continue;
			}
			setError(ack?.message || "Some questions could not be saved");
			break;
		}

		setIsSaving(false);
		if (successCount > 0) {
			setInfo(`${successCount} questions added to the room.`);
			navigate("/lobby");
		}
	};

	return (
		<>
			<style>{styles}</style>
			<div className="ai-root">
				<div className="ai-sf">
					{STARS.map((s) => (
						<div
							key={s.id}
							className="ai-star"
							style={{
								left: `${s.x}%`,
								top: `${s.y}%`,
								width: s.s,
								height: s.s,
								"--op": s.op,
								animationDuration: `${s.dur}s`,
								animationDelay: `${s.delay}s`,
								opacity: s.op,
							}}
						/>
					))}
				</div>
				<div className="ai-wrap">
					<div className="ai-top">
						<div>
							<div className="ai-title">AI Question Builder</div>
							<div className="ai-sub">
								Generate MCQ questions, preview them, then add to room{" "}
								{room?.roomCode}.
							</div>
						</div>
						<button className="ai-back" onClick={() => navigate("/lobby")}>
							Back to Lobby
						</button>
					</div>

					<div className="ai-grid">
						<div className="ai-card">
							<label className="ai-label">Prompt or Topic</label>
							<textarea
								className="ai-text"
								placeholder="Example: Class 8 science chapter on friction, moderate difficulty"
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
							/>

							<div style={{ marginTop: 12 }}>
								<label className="ai-label">Number of MCQs</label>
								<input
									type="number"
									min={1}
									max={30}
									className="ai-input"
									value={questionCount}
									onChange={(e) => setQuestionCount(e.target.value)}
								/>
							</div>

							<div style={{ marginTop: 12 }}>
								<div className="ai-row-between">
									<label className="ai-label">Optional Context / Chapter Text</label>
									<button
										type="button"
										className="ai-mini-btn"
										onClick={() => setContextText("")}
									>
										Clear
									</button>
								</div>
								<textarea
									className="ai-text"
									placeholder="Paste chapter text, notes, or constraints here..."
									value={contextText}
									onChange={(e) => setContextText(e.target.value)}
								/>
							</div>

							<div style={{ marginTop: 12 }}>
								<label className="ai-label">Upload Text File (Optional)</label>
								<div className="ai-row">
									<input
										type="file"
										className="ai-input"
										onChange={onUpload}
										accept=".pdf,.docx,.txt,.md,.markdown"
									/>
								</div>
								{fileName ? <div className="ai-file">Selected: {fileName}</div> : null}
							</div>

							<button
								className="ai-btn"
								onClick={generateQuestions}
								disabled={isGenerating}
							>
								{isGenerating ? "Generating..." : "Generate MCQs with AI"}
							</button>

							<button
								className="ai-btn ai-btn-save"
								onClick={addToRoom}
								disabled={isSaving || !questions.length}
							>
								{isSaving ? "Saving to Room..." : "Add Generated Questions to Room"}
							</button>

							{error ? <div className="ai-err">{error}</div> : null}
							{info ? <div className="ai-ok">{info}</div> : null}
						</div>

						<div className="ai-card">
							<label className="ai-label">Preview</label>
							<div className="ai-list">
								{questions.map((q, idx) => (
									<div className="ai-q" key={`${idx}-${q.text}`}>
										<div className="ai-qt">
											Q{idx + 1}. {q.text}
										</div>
										{q.options?.map((option) => (
											<div className="ai-op" key={option}>
												- {option}
											</div>
										))}
										<div className="ai-correct">Correct: {q.correctAnswer}</div>
									</div>
								))}
								{!questions.length ? (
									<div className="ai-sub">No questions generated yet.</div>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
