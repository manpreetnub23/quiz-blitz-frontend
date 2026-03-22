import socket from "../socket/socket";
import useGameStore from "../store/useGameStore";
import { initSocketListeners } from "../socket/listeners";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SPACE_FONT_IMPORT, createStars } from "../theme/space";

const STARS = createStars("lobby", 180);
const STAR_STEP = 3;
const OPT = [
	{
		label: "A",
		color: "#A78BFA",
		light: "rgba(167,139,250,0.1)",
		border: "rgba(167,139,250,0.28)",
	},
	{
		label: "B",
		color: "#60A5FA",
		light: "rgba(96,165,250,0.1)",
		border: "rgba(96,165,250,0.28)",
	},
	{
		label: "C",
		color: "#34D399",
		light: "rgba(52,211,153,0.1)",
		border: "rgba(52,211,153,0.28)",
	},
	{
		label: "D",
		color: "#F472B6",
		light: "rgba(244,114,182,0.1)",
		border: "rgba(244,114,182,0.28)",
	},
];
const AV = ["#A78BFA", "#60A5FA", "#34D399", "#F472B6", "#FBBF24", "#06B6D4"];

const S = `
${SPACE_FONT_IMPORT}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#070710;min-height:100vh;overflow-x:hidden;}
.lb-root{min-height:100vh;background:#070710;font-family:'Exo 2',sans-serif;color:#fff;position:relative;overflow-x:hidden;}
.lb-sf{position:fixed;inset:0;pointer-events:none;z-index:0;}
.lb-star{position:absolute;border-radius:50%;background:#fff;animation:tw ease-in-out infinite;}
@keyframes tw{0%,100%{opacity:var(--op,.2);transform:scale(1)}50%{opacity:1;transform:scale(1.8)}}

.lb-nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(7,7,16,0.92);border-bottom:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(24px);padding:0 40px;height:60px;display:flex;align-items:center;justify-content:space-between;}
.lb-brand{font-family:'Orbitron',monospace;font-size:14px;font-weight:900;letter-spacing:3px;color:#fff;}
.lb-brand span{color:#A78BFA;}
.lb-nav-mid{display:flex;align-items:center;gap:10px;}
.lb-code-lbl{font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.18);}
.lb-code-val{font-family:'Orbitron',monospace;font-size:18px;font-weight:900;letter-spacing:5px;color:rgba(255,255,255,0.7);}
.lb-copy-btn{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:7px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);cursor:pointer;transition:all 0.2s;flex-shrink:0;}
.lb-copy-btn:hover{background:rgba(167,139,250,0.12);border-color:rgba(167,139,250,0.3);}
.lb-copy-btn.copied{background:rgba(52,211,153,0.12);border-color:rgba(52,211,153,0.3);}
.lb-badge{padding:5px 12px;border-radius:100px;font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;}
.lb-badge-host{background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.25);color:#C4B5FD;}
.lb-badge-player{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.3);}
.lb-nav-r{display:flex;align-items:center;gap:10px;}

.lb-body{position:relative;z-index:10;max-width:1200px;margin:0 auto;padding:76px 36px 48px;display:grid;grid-template-columns:300px 1fr;gap:22px;align-items:start;}

/* Players panel */
.lb-pp{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(18px);box-shadow:0 10px 30px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.05);border-radius:18px;overflow:hidden;}
.lb-pp-head{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:space-between;}
.lb-pp-title{font-family:'Orbitron',monospace;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);}
.lb-pp-cnt{font-family:'Orbitron',monospace;font-size:11px;font-weight:800;color:#A78BFA;background:rgba(167,139,250,0.1);border-radius:100px;padding:2px 10px;}
.lb-pp-body{padding:12px;}

.lb-player{display:flex;align-items:center;gap:11px;padding:10px 11px;border-radius:11px;margin-bottom:7px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);transition:border-color 0.2s;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;}
.lb-player:last-child{margin-bottom:0;}
.lb-player:hover{border-color:rgba(167,139,250,0.18);}
@keyframes popIn{from{opacity:0;transform:scale(0.82) translateX(-6px)}to{opacity:1;transform:scale(1) translateX(0)}}
.lb-av{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-size:13px;font-weight:800;color:#fff;flex-shrink:0;}
.lb-pname{font-size:13px;font-weight:600;flex:1;}
.lb-ptag{font-family:'Orbitron',monospace;font-size:7px;font-weight:700;letter-spacing:1.5px;color:#A78BFA;background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2);border-radius:4px;padding:2px 7px;text-transform:uppercase;}

/* Code share */
.lb-share{margin-top:14px;background:rgba(167,139,250,0.04);border:1px solid rgba(167,139,250,0.1);border-radius:14px;padding:16px;text-align:center;}
.lb-share-lbl{font-family:'Orbitron',monospace;font-size:8px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.18);margin-bottom:10px;}
.lb-share-code-row{display:flex;align-items:center;justify-content:center;gap:12px;}
.lb-share-code{font-family:'Orbitron',monospace;font-size:28px;font-weight:900;letter-spacing:7px;color:rgba(255,255,255,0.6);}
.lb-share-copy{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);cursor:pointer;font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:1px;color:rgba(255,255,255,0.35);transition:all 0.2s;}
.lb-share-copy:hover{background:rgba(167,139,250,0.1);border-color:rgba(167,139,250,0.25);color:#C4B5FD;}
.lb-share-copy.done{background:rgba(52,211,153,0.1);border-color:rgba(52,211,153,0.25);color:#34D399;}

/* Right panel */
.lb-rp{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(18px);box-shadow:0 10px 30px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.05);border-radius:18px;overflow:hidden;}
.lb-rp-head{padding:16px 22px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:space-between;}
.lb-rp-head-r{display:flex;align-items:center;gap:10px;}
.lb-rp-title{font-family:'Orbitron',monospace;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);}
.lb-rp-cnt{font-family:'Orbitron',monospace;font-size:11px;font-weight:800;color:rgba(255,255,255,0.35);}
.lb-ai-btn{border:1px solid rgba(96,165,250,0.32);background:rgba(96,165,250,0.14);color:#bfdbfe;border-radius:9px;padding:7px 11px;font-family:'Orbitron',monospace;font-size:9px;font-weight:700;letter-spacing:1px;cursor:pointer;transition:all .2s}
.lb-ai-btn:hover{background:rgba(96,165,250,0.22);transform:translateY(-1px)}
.lb-rp-body{padding:24px;}

.lb-fl{margin-bottom:14px;}
.lb-fl-lbl{display:block;font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,0.18);margin-bottom:8px;}
.lb-inp{width:100%;padding:13px 15px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;color:#fff;font-family:'Exo 2',sans-serif;font-size:14px;font-weight:600;outline:none;transition:all 0.2s;}
.lb-inp::placeholder{color:rgba(255,255,255,0.14);font-weight:400;}
.lb-inp:focus{border-color:rgba(167,139,250,0.45);background:rgba(167,139,250,0.05);box-shadow:0 0 0 3px rgba(167,139,250,0.09);}

.lb-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;}
.lb-or{display:flex;align-items:center;gap:8px;}
.lb-opill{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-weight:700;font-size:11px;cursor:pointer;flex-shrink:0;border:1.5px solid;transition:all 0.18s;user-select:none;}
.lb-opill:hover{transform:scale(1.12);}
.lb-opill.sel{transform:scale(1.18);box-shadow:0 4px 14px rgba(0,0,0,0.3);}
.lb-oinp{flex:1;padding:8px 11px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;color:#fff;font-family:'Exo 2',sans-serif;font-size:13px;font-weight:600;outline:none;transition:all 0.2s;}
.lb-oinp::placeholder{color:rgba(255,255,255,0.13);font-weight:400;}
.lb-oinp:focus{border-color:rgba(167,139,250,0.35);}

.lb-hint{font-size:11px;font-weight:600;color:rgba(167,139,250,0.5);margin-bottom:12px;display:flex;align-items:center;gap:6px;}

.lb-sep{height:1px;background:rgba(255,255,255,0.05);margin:18px 0;}

.lb-btn-add{width:100%;padding:12px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.6);font-family:'Orbitron',monospace;font-size:10px;font-weight:700;letter-spacing:1.5px;cursor:pointer;transition:all 0.2s;margin-bottom:18px;}
.lb-btn-add:hover{background:rgba(167,139,250,0.1);border-color:rgba(167,139,250,0.25);color:#C4B5FD;}
.lb-btn-add.fl{animation:flash 0.35s ease;}
@keyframes flash{0%{transform:scale(1)}40%{transform:scale(0.95)}70%{transform:scale(1.04)}100%{transform:scale(1)}}

.lb-q-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.lb-q-lbl{font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.2);}
.lb-q-num{font-family:'Orbitron',monospace;font-size:12px;font-weight:800;color:#A78BFA;}
.lb-qlist{max-height:200px;overflow-y:auto;margin-bottom:18px;}
.lb-qlist::-webkit-scrollbar{width:3px;}
.lb-qlist::-webkit-scrollbar-thumb{background:rgba(167,139,250,0.25);border-radius:3px;}
.lb-qi{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:10px 13px;margin-bottom:7px;transition:border-color 0.15s;}
.lb-qi:hover{border-color:rgba(167,139,250,0.18);}
.lb-qi-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;}
.lb-qi-del{width:22px;height:22px;border-radius:7px;border:1px solid rgba(239,68,68,0.24);background:rgba(239,68,68,0.08);color:#fca5a5;font-family:'Orbitron',monospace;font-size:11px;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .18s;flex-shrink:0}
.lb-qi-del:hover{background:rgba(239,68,68,0.16);border-color:rgba(239,68,68,0.4)}
.lb-qi-del:disabled{opacity:.45;cursor:not-allowed}
.lb-qi-n{font-family:'Orbitron',monospace;font-size:7px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.18);margin-bottom:4px;}
.lb-qi-t{font-size:12px;font-weight:600;color:rgba(255,255,255,0.75);margin-bottom:4px;}
.lb-qi-a{font-size:11px;font-weight:600;color:#34D399;}

.lb-btn-launch{width:100%;padding:16px;border:1px solid rgba(167,139,250,0.4);border-radius:13px;background:rgba(167,139,250,0.12);color:#C4B5FD;font-family:'Orbitron',monospace;font-size:12px;font-weight:800;letter-spacing:2px;cursor:pointer;transition:all 0.2s;box-shadow:0 0 32px rgba(167,139,250,0.1);}
.lb-btn-launch:hover{background:rgba(167,139,250,0.2);border-color:rgba(167,139,250,0.6);transform:translateY(-2px);box-shadow:0 8px 28px rgba(167,139,250,0.25);}
.lb-btn-launch:active{transform:translateY(0);}
.lb-btn-launch:disabled{background:rgba(255,255,255,0.03);border-color:rgba(255,255,255,0.06);color:rgba(255,255,255,0.18);box-shadow:none;cursor:not-allowed;transform:none;}

/* Waiting */
.lb-wait{text-align:center;padding:72px 24px;}
.lb-wait-ring{width:64px;height:64px;border-radius:50%;border:2px solid rgba(167,139,250,0.1);border-top-color:rgba(167,139,250,0.7);margin:0 auto 26px;animation:spin 1s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.lb-wait h3{font-family:'Orbitron',monospace;font-size:16px;font-weight:800;letter-spacing:1px;margin-bottom:10px;}
.lb-wait p{font-size:13px;color:rgba(255,255,255,0.25);font-weight:500;line-height:1.8;}

.lb-err{position:relative;z-index:10;background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.15);border-radius:11px;padding:10px 16px;color:#FCA5A5;font-size:13px;font-weight:600;margin:72px 36px -8px;}

@media(max-width:960px){.lb-body{grid-template-columns:260px 1fr;gap:16px;padding:72px 20px 40px;}}
@media(max-width:740px){
  .lb-body{grid-template-columns:1fr;}
  .lb-nav{padding:0 16px;}
  .lb-nav-mid{display:none;}
  .lb-err{margin-left:16px;margin-right:16px;}
  .lb-opts{grid-template-columns:1fr;}
}
@media(max-width:480px){.lb-body{padding:68px 10px 36px;}.lb-rp-body{padding:16px 14px;}}
`;

const CopyIcon = ({ size = 14 }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
	>
		<rect x="9" y="9" width="13" height="13" rx="2" />
		<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
	</svg>
);
const CheckIcon = ({ size = 14 }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
	>
		<polyline points="20 6 9 17 4 12" />
	</svg>
);

export default function Lobby() {
	const navigate = useNavigate();
	const room = useGameStore((s) => s.room);
	const phase = useGameStore((s) => s.phase);
	const playerId = useGameStore((s) => s.playerId);
	const playerName = useGameStore((s) => s.playerName);
	const error = useGameStore((s) => s.error);
	const setError = useGameStore((s) => s.setError);
	const [qText, setQText] = useState("");
	const [opts, setOpts] = useState(["", "", "", ""]);
	const [correct, setCorrect] = useState(null);
	const [flash, setFlash] = useState(false);
	const [copied, setCopied] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [deletingQuestionId, setDeletingQuestionId] = useState(null);

	const copy = () => {
		navigator.clipboard.writeText(room?.roomCode || "").then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	const startQuiz = () =>
		room?.roomCode && socket.emit("start_quiz", { roomCode: room.roomCode });

	const addQ = () => {
		if (!room?.roomCode) return;
		const text = qText.trim(),
			co = opts.map((o) => o.trim());
		if (!text || co.some((o) => !o) || correct === null) return;
		setIsAdding(true);
		socket.emit(
			"add_question",
			{
				roomCode: room.roomCode,
				question: { text, options: co, correctAnswer: co[correct] },
				playerId,
			},
			(ack) => {
				setIsAdding(false);
				if (!ack?.ok) return;
				setQText("");
				setOpts(["", "", "", ""]);
				setCorrect(null);
				setFlash(true);
				setTimeout(() => setFlash(false), 350);
			},
		);
	};

	const deleteQ = (questionId) => {
		if (!room?.roomCode || !questionId) return;
		setDeletingQuestionId(questionId);
		socket.emit(
			"delete_question",
			{ roomCode: room.roomCode, questionId, playerId },
			(ack) => {
				setDeletingQuestionId(null);
				if (!ack?.ok && ack?.message) setError(ack.message);
			},
		);
	};

	useEffect(() => {
		initSocketListeners();
		if (!socket.connected) socket.connect();
	}, []);
	useEffect(() => {
		if (!room?.roomCode) {
			navigate("/");
			return;
		}
		const id = playerId || localStorage.getItem("quiz_player_id");
		const name =
			playerName || localStorage.getItem("quiz_player_name") || "Player";
		if (id)
			socket.emit("rejoin_room", {
				roomCode: room.roomCode,
				playerId: id,
				name,
			});
	}, [room?.roomCode, playerId, playerName, navigate]);
	useEffect(() => {
		if (["prepare", "question", "result"].includes(phase)) navigate("/game");
		if (phase === "finished") navigate("/result");
	}, [phase, navigate]);

	const isHost = room?.hostId && playerId && room.hostId === playerId;

	return (
		<>
			<style>{S}</style>
			<div className="lb-root">
				<div className="lb-sf">
					{STARS.filter((_, i) => i % STAR_STEP === 0).map((s) => (
						<div
							key={s.id}
							className="lb-star"
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

				<nav className="lb-nav">
					<div className="lb-brand">
						QUIZ<span>BLITZ</span>
					</div>
					<div className="lb-nav-mid">
						<span className="lb-code-lbl">Room</span>
						<span className="lb-code-val">{room?.roomCode}</span>
						<button
							className={`lb-copy-btn ${copied ? "copied" : ""}`}
							onClick={copy}
							title="Copy code"
						>
							{copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
						</button>
					</div>
					<div className="lb-nav-r">
						<span
							style={{
								fontFamily: "'Orbitron',monospace",
								fontSize: 10,
								fontWeight: 700,
								color: "rgba(255,255,255,0.2)",
								letterSpacing: 1,
							}}
						>
							{room?.players?.length || 0} online
						</span>
						{isHost ? (
							<span className="lb-badge lb-badge-host">Commander</span>
						) : (
							<span className="lb-badge lb-badge-player">Crew</span>
						)}
					</div>
				</nav>

				{error && <div className="lb-err">{error}</div>}

				<div className="lb-body">
					<div>
						<div className="lb-pp">
							<div className="lb-pp-head">
								<span className="lb-pp-title">Crew</span>
								<span className="lb-pp-cnt">{room?.players?.length || 0}</span>
							</div>
							<div className="lb-pp-body">
								{room?.players?.length ? (
									room.players.map((p, i) => (
										<div
											key={p.id}
											className="lb-player"
											style={{ animationDelay: `${i * 0.06}s` }}
										>
											<div
												className="lb-av"
												style={{
													background: AV[i % AV.length] + "44",
													color: AV[i % AV.length],
												}}
											>
												{(p.name || "?")[0].toUpperCase()}
											</div>
											<span className="lb-pname">{p.name}</span>
											{room.hostId === p.id && (
												<span className="lb-ptag">CMD</span>
											)}
										</div>
									))
								) : (
									<div
										style={{
											color: "rgba(255,255,255,0.15)",
											fontSize: 12,
											fontFamily: "'Orbitron',monospace",
											letterSpacing: "1px",
											textAlign: "center",
											padding: "20px 0",
										}}
									>
										Awaiting crew...
									</div>
								)}
							</div>
						</div>

						<div className="lb-share">
							<div className="lb-share-lbl">Invite Code</div>
							<div className="lb-share-code-row">
								<div className="lb-share-code">{room?.roomCode}</div>
								<button
									className={`lb-share-copy ${copied ? "done" : ""}`}
									onClick={copy}
								>
									{copied ? (
										<>
											<CheckIcon size={11} />
											Copied
										</>
									) : (
										<>
											<CopyIcon size={11} />
											Copy
										</>
									)}
								</button>
							</div>
						</div>
					</div>

					<div>
						{isHost ? (
							<div className="lb-rp">
								<div className="lb-rp-head">
									<span className="lb-rp-title">Question Builder</span>
									<div className="lb-rp-head-r">
										<span className="lb-rp-cnt">
											{room?.questions?.length || 0} questions
										</span>
										<button
											className="lb-ai-btn"
											onClick={() => navigate("/ai-questions")}
										>
											Generate with AI
										</button>
									</div>
								</div>
								<div className="lb-rp-body">
									<div className="lb-fl">
										<label className="lb-fl-lbl">Question</label>
										<input
											className="lb-inp"
											value={qText}
											onChange={(e) => setQText(e.target.value)}
											placeholder="What is the capital of France?"
										/>
									</div>
									<div className="lb-fl">
										<label className="lb-fl-lbl">
											Options — tap letter to mark correct
										</label>
										<div className="lb-opts">
											{opts.map((o, i) => {
												const s = OPT[i],
													sel = correct === i;
												return (
													<div key={i} className="lb-or">
														<div
															className={`lb-opill${sel ? " sel" : ""}`}
															onClick={() => setCorrect(i)}
															style={{
																background: sel ? s.color + "33" : s.light,
																borderColor: s.border,
																color: sel ? s.color : s.color + "99",
															}}
														>
															{s.label}
														</div>
														<input
															className="lb-oinp"
															value={o}
															onChange={(e) => {
																const n = [...opts];
																n[i] = e.target.value;
																setOpts(n);
															}}
															placeholder={`Option ${s.label}`}
														/>
													</div>
												);
											})}
										</div>
									</div>
									{correct === null && (
										<div className="lb-hint">
											Select the correct answer above
										</div>
									)}
									<button
										className={`lb-btn-add${flash ? " fl" : ""}`}
										onClick={addQ}
										disabled={isAdding}
									>
										{isAdding ? "Saving..." : "+ Add Question"}
									</button>
									<div className="lb-sep" />
									<div className="lb-q-hdr">
										<span className="lb-q-lbl">Question Bank</span>
										<span className="lb-q-num">
											{room?.questions?.length || 0}
										</span>
									</div>
									<div className="lb-qlist">
										{(room?.questions || []).map((q, i) => (
											<div key={q.id} className="lb-qi">
												<div className="lb-qi-head">
													<div className="lb-qi-n">Q{i + 1}</div>
													<button
														className="lb-qi-del"
														onClick={() => deleteQ(q.id)}
														disabled={deletingQuestionId === q.id || isAdding}
														title="Delete question"
													>
														×
													</button>
												</div>
												<div className="lb-qi-t">{q.text}</div>
												<div className="lb-qi-a">{q.correctAnswer}</div>
											</div>
										))}
										{!room?.questions?.length && (
											<div
												style={{
													textAlign: "center",
													padding: "18px 0",
													color: "rgba(255,255,255,0.12)",
													fontSize: 12,
												}}
											>
												No questions yet
											</div>
										)}
									</div>
									<button
										className="lb-btn-launch"
										onClick={startQuiz}
										disabled={isAdding || deletingQuestionId !== null || !room?.questions?.length}
									>
										Launch Mission
									</button>
								</div>
							</div>
						) : (
							<div
								className="lb-rp"
								style={{
									minHeight: 380,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<div className="lb-wait">
									<div className="lb-wait-ring" />
									<h3>Awaiting Launch</h3>
									<p>
										The commander is building the quiz.
										<br />
										Stand by for liftoff.
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
