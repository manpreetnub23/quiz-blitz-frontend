import socket from "../socket/socket";
import useGameStore from "../store/useGameStore";
import { initSocketListeners } from "../socket/listeners";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SPACE_FONT_IMPORT, createStars } from "../theme/space";

const STARS = createStars("home", 180);
const STAR_STEP = 3;

const S = `
${SPACE_FONT_IMPORT}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#070710;min-height:100vh;overflow-x:hidden;}

.h-root{min-height:100vh;background:#070710;font-family:'Exo 2',sans-serif;color:#fff;display:flex;align-items:stretch;position:relative;overflow:hidden;}
.h-sf{position:fixed;inset:0;pointer-events:none;z-index:0;}
.h-star{position:absolute;border-radius:50%;background:#fff;animation:tw ease-in-out infinite;}
@keyframes tw{0%,100%{opacity:var(--op,.2);transform:scale(1)}50%{opacity:1;transform:scale(1.8)}}

/* Crescent moon deco */
.h-moon-deco{
  position:fixed;top:-60px;right:-60px;
  width:260px;height:260px;border-radius:50%;
  background:transparent;
  box-shadow:inset -40px 10px 0 0 rgba(167,139,250,0.06);
  pointer-events:none;z-index:1;
}

.h-left{
  flex:1;display:flex;flex-direction:column;justify-content:center;
  padding:80px 64px 80px 80px;position:relative;z-index:10;
}
.h-eyebrow{
  display:inline-flex;align-items:center;gap:10px;
  font-family:'Orbitron',monospace;font-size:9px;font-weight:700;
  letter-spacing:3px;text-transform:uppercase;color:rgba(167,139,250,0.6);margin-bottom:30px;
}
.h-eb-dot{width:5px;height:5px;border-radius:50%;background:#A78BFA;animation:blink 2.5s ease infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}

.h-title{
  font-family:'Orbitron',monospace;
  font-size:clamp(42px,5.2vw,80px);
  font-weight:900;line-height:0.95;letter-spacing:-2px;
  color:#fff;margin-bottom:8px;
}
.h-title .accent{color:#A78BFA;}
.h-desc{font-size:16px;font-weight:400;color:rgba(255,255,255,0.35);line-height:1.85;max-width:380px;margin:26px 0 44px;}
.h-stats{display:flex;gap:40px;padding-top:36px;border-top:1px solid rgba(255,255,255,0.06);}
.h-sn{font-family:'Orbitron',monospace;font-size:26px;font-weight:900;color:#A78BFA;}
.h-sl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-top:4px;}

/* Right */
.h-right{
  width:460px;flex-shrink:0;display:flex;align-items:center;justify-content:center;
  padding:60px 60px 60px 32px;position:relative;z-index:10;
}
.h-card{
  width:100%;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.12);
  backdrop-filter:blur(20px);
  border-radius:24px;padding:38px 34px;
  box-shadow:0 14px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06);
  animation:cardIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes cardIn{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
.h-card-icon{
  width:46px;height:46px;border-radius:13px;
  background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2);
  display:flex;align-items:center;justify-content:center;margin-bottom:20px;
}
.h-card-title{font-family:'Orbitron',monospace;font-size:20px;font-weight:800;letter-spacing:-0.5px;margin-bottom:5px;}
.h-card-sub{font-size:13px;color:rgba(255,255,255,0.3);font-weight:500;margin-bottom:28px;}

.h-tabs{display:flex;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:13px;padding:4px;gap:4px;margin-bottom:24px;}
.h-tab{flex:1;padding:10px 6px;border:none;border-radius:9px;font-family:'Exo 2',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;letter-spacing:0.3px;}
.h-tab.on{background:rgba(167,139,250,0.2);color:#A78BFA;border:1px solid rgba(167,139,250,0.3);}
.h-tab:not(.on){background:transparent;color:rgba(255,255,255,0.25);}
.h-tab:not(.on):hover{color:rgba(255,255,255,0.55);}

.h-fl{margin-bottom:16px;}
.h-fl-lbl{display:block;font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-bottom:8px;}
.h-inp{width:100%;padding:13px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;color:#fff;font-family:'Exo 2',sans-serif;font-size:14px;font-weight:600;outline:none;transition:all 0.2s;}
.h-inp::placeholder{color:rgba(255,255,255,0.15);font-weight:400;}
.h-inp:focus{border-color:rgba(167,139,250,0.5);background:rgba(167,139,250,0.06);box-shadow:0 0 0 3px rgba(167,139,250,0.1);}
.h-inp.code{text-align:center;font-family:'Orbitron',monospace;font-size:22px;font-weight:800;letter-spacing:10px;text-transform:uppercase;padding:16px;}

.h-btn{width:100%;padding:15px;border:none;border-radius:13px;font-family:'Orbitron',monospace;font-size:12px;font-weight:800;cursor:pointer;transition:all 0.2s;letter-spacing:2px;margin-top:4px;}
.h-btn-create{background:rgba(167,139,250,0.15);border:1px solid rgba(167,139,250,0.35);color:#C4B5FD;}
.h-btn-create:hover{background:rgba(167,139,250,0.25);transform:translateY(-2px);box-shadow:0 8px 28px rgba(167,139,250,0.2);}
.h-btn-join{background:rgba(96,165,250,0.12);border:1px solid rgba(96,165,250,0.3);color:#93C5FD;}
.h-btn-join:hover{background:rgba(96,165,250,0.2);transform:translateY(-2px);box-shadow:0 8px 28px rgba(96,165,250,0.18);}

.h-err{background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.18);border-radius:11px;padding:10px 14px;color:#FCA5A5;font-size:13px;font-weight:600;margin-bottom:16px;}
.h-panel{animation:panelIn 0.22s ease both;}
@keyframes panelIn{from{opacity:0;transform:translateX(6px)}to{opacity:1;transform:translateX(0)}}

/* Vertical divider */
.h-divider{position:absolute;left:calc(100% - 460px);top:15%;bottom:15%;width:1px;background:rgba(255,255,255,0.05);}

@media(max-width:1000px){.h-right{width:400px;padding-right:40px;}}
@media(max-width:820px){
  .h-root{flex-direction:column;}
  .h-left{padding:80px 28px 36px;align-items:center;text-align:center;}
  .h-desc,.h-stats{text-align:center;justify-content:center;}
  .h-right{width:100%;padding:0 20px 64px;}
  .h-card{max-width:420px;margin:0 auto;}
  .h-divider{display:none;}
  .h-moon-deco{display:none;}
}
@media(max-width:480px){
  .h-left{padding:72px 16px 28px;}
  .h-title{font-size:38px;letter-spacing:-1.5px;}
  .h-right{padding:0 12px 48px;}
  .h-card{padding:26px 18px;}
}
`;

// SVG icons
const RocketIcon = () => (
	<svg
		width="22"
		height="22"
		viewBox="0 0 24 24"
		fill="none"
		stroke="#A78BFA"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
		<path d="m3.5 11.5 2 2.5 2.5 1.5M9.5 3.5C9.5 3.5 14 2 17.5 5.5S20.5 14.5 20.5 14.5L9.5 3.5z" />
		<path d="m14.5 8.5-5 5" />
	</svg>
);

export default function Home() {
	const [name, setName] = useState(
		() => localStorage.getItem("quiz_player_name") || "",
	);
	const [code, setCode] = useState("");
	const [tab, setTab] = useState("create");
	const navigate = useNavigate();
	const room = useGameStore((s) => s.room);
	const error = useGameStore((s) => s.error);
	const setError = useGameStore((s) => s.setError);
	const setPlayerName = useGameStore((s) => s.setPlayerName);

	useEffect(() => {
		initSocketListeners();
	}, []);
	useEffect(() => {
		if (room?.roomCode) navigate("/lobby");
	}, [room?.roomCode, navigate]);

	const create = () => {
		const t = name.trim();
		if (!t) {
			setError("Enter your name to continue");
			return;
		}
		setError("");
		setPlayerName(t);
		localStorage.setItem("quiz_player_name", t);
		if (!socket.connected) socket.connect();
		socket.emit("create_room");
	};

	const join = () => {
		const n = name.trim(),
			c = code.trim().toUpperCase();
		if (!n || !c) {
			setError("Name and room code required");
			return;
		}
		setError("");
		setPlayerName(n);
		localStorage.setItem("quiz_player_name", n);
		if (!socket.connected) socket.connect();
		socket.emit("join_room", {
			roomCode: c,
			name: n,
			playerId: localStorage.getItem("quiz_player_id") || undefined,
		});
	};

	return (
		<>
			<style>{S}</style>
			<div className="h-root">
				<div className="h-sf">
					{STARS.filter((_, i) => i % STAR_STEP === 0).map((s) => (
						<div
							key={s.id}
							className="h-star"
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
				<div className="h-moon-deco" />

				<div className="h-left">
					<div className="h-eyebrow">
						<span className="h-eb-dot" />
						Multiplayer · Real-Time
					</div>
					<h1 className="h-title">
						Quiz
						<br />
						<span className="accent">Blitz</span>
					</h1>
					<p className="h-desc">
						Host live quiz battles with your own questions. Invite your crew,
						answer fast, and claim the top spot.
					</p>
					<div className="h-stats">
						<div>
							<div className="h-sn">Live</div>
							<div className="h-sl">Real-time</div>
						</div>
						<div>
							<div className="h-sn">∞</div>
							<div className="h-sl">Questions</div>
						</div>
						<div>
							<div className="h-sn">#1</div>
							<div className="h-sl">Wins it all</div>
						</div>
					</div>
				</div>

				<div className="h-divider" />

				<div className="h-right">
					<div className="h-card">
						<div className="h-card-icon">
							<RocketIcon />
						</div>
						<div className="h-card-title">Jump In</div>
						<div className="h-card-sub">Create a room or join a friend's</div>

						{error && <div className="h-err">{error}</div>}

						<div className="h-tabs">
							<button
								className={`h-tab ${tab === "create" ? "on" : ""}`}
								onClick={() => setTab("create")}
							>
								Create Room
							</button>
							<button
								className={`h-tab ${tab === "join" ? "on" : ""}`}
								onClick={() => setTab("join")}
							>
								Join Room
							</button>
						</div>

						<div key={tab} className="h-panel">
							<div className="h-fl">
								<label className="h-fl-lbl">Your Name</label>
								<input
									className="h-inp"
									placeholder="Enter your name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									onKeyDown={(e) =>
										e.key === "Enter" && (tab === "create" ? create() : join())
									}
								/>
							</div>
							{tab === "join" && (
								<div className="h-fl">
									<label className="h-fl-lbl">Room Code</label>
									<input
										className="h-inp code"
										placeholder="......"
										value={code}
										onChange={(e) => setCode(e.target.value)}
										maxLength={6}
										onKeyDown={(e) => e.key === "Enter" && join()}
									/>
								</div>
							)}
							{tab === "create" ? (
								<button className="h-btn h-btn-create" onClick={create}>
									Create Room
								</button>
							) : (
								<button className="h-btn h-btn-join" onClick={join}>
									Enter Room
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

