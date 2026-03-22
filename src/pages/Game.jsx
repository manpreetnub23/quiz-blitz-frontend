import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "../store/useGameStore";
import { initSocketListeners } from "../socket/listeners";
import QuestionCard from "../components/QuestionCard";
import { SPACE_FONT_IMPORT, createStars } from "../theme/space";

const STARS = createStars("game", 220);
const STAR_STEP = 4;

const PLANETS = [
	{ r: 70, sz: 9, color: "#A78BFA", speed: 7, startDeg: 20 },
	{ r: 108, sz: 14, color: "#60A5FA", speed: 12, startDeg: 130 },
	{ r: 145, sz: 7, color: "#34D399", speed: 18, startDeg: 250 },
	{ r: 178, sz: 12, color: "#F472B6", speed: 14, startDeg: 55 },
	{ r: 208, sz: 5, color: "#94A3B8", speed: 22, startDeg: 310 },
];

const S = `
${SPACE_FONT_IMPORT}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#070710;min-height:100vh;overflow-x:hidden;}
.g-root{min-height:100vh;background:#070710;font-family:'Exo 2',sans-serif;color:#fff;position:relative;overflow:hidden;}

/* Starfield */
.g-sf{position:fixed;inset:0;pointer-events:none;z-index:0;}
.g-s{position:absolute;border-radius:50%;background:#fff;animation:tw ease-in-out infinite;}
@keyframes tw{0%,100%{opacity:var(--op,.3)}50%{opacity:1;transform:scale(1.5)}}

/* Nav */
.g-nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(7,7,16,0.9);border-bottom:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(24px);height:60px;padding:0 40px;display:flex;align-items:center;justify-content:space-between;}
.g-brand{font-family:'Orbitron',monospace;font-size:15px;font-weight:900;letter-spacing:3px;}
.g-brand span{color:#A78BFA;}
.g-code-pill{font-family:'Orbitron',monospace;font-size:12px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.4);background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:5px 14px;}

/* Prepare screen */
.g-prep{position:fixed;inset:0;z-index:100;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#070710;}

/* Solar system container — everything positioned relative to its center */
.g-solar{position:relative;flex-shrink:0;}

/* Orbit rings: centered using negative margin equal to half the diameter */
.g-oring{position:absolute;top:50%;left:50%;border-radius:50%;border:1px solid rgba(255,255,255,0.05);pointer-events:none;}

/* Each planet uses CSS animation on a wrapper that rotates around the sun center.
   Key fix: wrapper is 0x0 positioned at center, transform-origin 0 0,
   planet sits at (orbitRadius, 0) in the wrapper's local space */
.g-parm{
  position:absolute;
  top:50%;left:50%;
  width:0;height:0;
  transform-origin:0 0;
  animation:pSpin linear infinite;
}
@keyframes pSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

.g-pball{
  position:absolute;
  border-radius:50%;
  /* planet centered at (orbitRadius, 0) — y offset by -half size */
}
.g-pball::after{
  content:'';position:absolute;inset:0;border-radius:50%;
  background:radial-gradient(circle at 35% 28%,rgba(255,255,255,0.5),transparent 60%);
}

/* Sun */
.g-sun{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:110px;height:110px;border-radius:50%;
  background:#09091A;
  border:1.5px solid rgba(167,139,250,0.4);
  box-shadow:0 0 0 10px rgba(167,139,250,0.05),0 0 0 22px rgba(167,139,250,0.025),0 0 70px rgba(167,139,250,0.3);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  z-index:30;
  animation:sunPulse 3s ease-in-out infinite;
}
@keyframes sunPulse{
  0%,100%{box-shadow:0 0 0 10px rgba(167,139,250,0.05),0 0 0 22px rgba(167,139,250,0.025),0 0 70px rgba(167,139,250,0.3);}
  50%{box-shadow:0 0 0 14px rgba(167,139,250,0.09),0 0 0 30px rgba(167,139,250,0.045),0 0 110px rgba(167,139,250,0.5);}
}
.g-sun-num{font-family:'Orbitron',monospace;font-size:40px;font-weight:900;color:#fff;line-height:1;animation:numPop 0.45s cubic-bezier(0.34,1.56,0.64,1);}
@keyframes numPop{from{transform:scale(1.8);opacity:0.3}to{transform:scale(1);opacity:1}}
.g-sun-lbl{font-family:'Orbitron',monospace;font-size:7px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(167,139,250,0.5);margin-top:4px;}

/* Progress ring SVG centered over sun */
.g-prog-ring{position:absolute;top:50%;left:50%;z-index:31;pointer-events:none;}

.g-prep-lbl{margin-top:28px;font-family:'Orbitron',monospace;font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,0.2);animation:breathe 2.5s ease-in-out infinite;}
@keyframes breathe{0%,100%{opacity:0.2}50%{opacity:0.5}}

/* Game body */
.g-body{position:relative;z-index:10;max-width:820px;margin:0 auto;padding:80px 24px 48px;}
.g-error{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.18);border-radius:12px;padding:12px 18px;color:#FCA5A5;font-size:13px;font-weight:600;margin-bottom:24px;}

/* Result */
.g-result{animation:fadeUp 0.5s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.g-rc{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:20px;overflow:hidden;margin-bottom:14px;}
.g-rc-head{padding:18px 24px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:12px;}
.g-rc-icon{width:34px;height:34px;border-radius:9px;background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2);display:flex;align-items:center;justify-content:center;}
.g-rc-title{font-family:'Orbitron',monospace;font-size:12px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.5);}
.g-ca{padding:10px 24px 12px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;gap:10px;}
.g-ca-lbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.25);}
.g-ca-val{font-size:13px;font-weight:700;color:#34D399;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.18);border-radius:7px;padding:3px 10px;}
.g-rc-body{padding:14px 18px;}
.g-rr{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;margin-bottom:7px;border:1px solid;animation:rowIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;}
@keyframes rowIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
.g-rr:nth-child(1){animation-delay:.04s}.g-rr:nth-child(2){animation-delay:.08s}.g-rr:nth-child(3){animation-delay:.12s}.g-rr:nth-child(4){animation-delay:.16s}
.g-rr.ok{background:rgba(52,211,153,0.05);border-color:rgba(52,211,153,0.18);}
.g-rr.bad{background:rgba(239,68,68,0.04);border-color:rgba(239,68,68,0.12);}
.g-rr-st{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.g-rr.ok .g-rr-st{background:rgba(52,211,153,0.12);}
.g-rr.bad .g-rr-st{background:rgba(239,68,68,0.1);}
.g-rr-info{flex:1;min-width:0;}
.g-rr-name{font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.g-rr-ans{font-size:11px;color:rgba(255,255,255,0.28);margin-top:2px;}
.g-rr-pts{font-family:'Orbitron',monospace;font-size:16px;font-weight:800;flex-shrink:0;}
.g-rr-pts.pos{color:#34D399;}.g-rr-pts.neg{color:rgba(255,255,255,0.18);}
.g-next{display:flex;align-items:center;justify-content:center;gap:9px;padding:14px;border-radius:13px;background:rgba(167,139,250,0.04);border:1px solid rgba(167,139,250,0.1);font-size:12px;font-weight:600;color:rgba(255,255,255,0.28);}
.g-ndot{width:6px;height:6px;border-radius:50%;background:#A78BFA;animation:blink 1.4s ease infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.1}}
@media(max-width:768px){.g-nav{padding:0 16px;height:54px;}.g-body{padding:72px 14px 40px;}}
@media(max-width:480px){.g-body{padding:64px 10px 36px;}}
`;

const ChartIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="rgba(167,139,250,0.8)"
		strokeWidth="2"
		strokeLinecap="round"
	>
		<line x1="18" y1="20" x2="18" y2="10" />
		<line x1="12" y1="20" x2="12" y2="4" />
		<line x1="6" y1="20" x2="6" y2="14" />
	</svg>
);

export default function Game() {
	const navigate = useNavigate();
	const room = useGameStore((s) => s.room);
	const question = useGameStore((s) => s.question);
	const phase = useGameStore((s) => s.phase);
	const result = useGameStore((s) => s.result);
	const round = useGameStore((s) => s.round);
	const error = useGameStore((s) => s.error);

	const [countdown, setCountdown] = useState(5);
	const [pct, setPct] = useState(1);
	const [popKey, setPopKey] = useState(0);
	const ivRef = useRef(null);
	const prevRef = useRef(null);

	useEffect(() => {
		initSocketListeners();
	}, []);

	useEffect(() => {
		if (!room?.roomCode) {
			navigate("/");
			return;
		}
		if (phase === "finished") navigate("/result");
	}, [room?.roomCode, phase, navigate]);

	useEffect(() => {
		clearInterval(ivRef.current);
		if (phase !== "prepare") return;
		const tick = () => {
			let s, p;
			if (round?.startTime && round?.duration) {
				const left = Math.max(
					round.duration - (Date.now() - round.startTime),
					0,
				);
				s = Math.ceil(left / 1000);
				p = left / round.duration;
			} else {
				s = countdown > 0 ? countdown : 5;
				p = s / 5;
			}
			if (s !== prevRef.current) {
				setPopKey((k) => k + 1);
				prevRef.current = s;
			}
			setCountdown(s);
			setPct(p);
		};
		tick();
		ivRef.current = setInterval(tick, 100);
		return () => clearInterval(ivRef.current);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [phase, round?.startTime, round?.duration]);

	const rows = (() => {
		if (!result) return [];
		if (Array.isArray(result)) return result;
		if (result.results && Array.isArray(result.results)) return result.results;
		return [];
	})();
	const correctAnswer = result?.correctAnswer ?? null;
	const nameById = new Map();
	for (const p of room?.players || []) nameById.set(p.id, p.name || p.id);

	// Responsive solar size
	const solarD = Math.min(
		480,
		(typeof window !== "undefined" ? window.innerWidth : 480) * 0.84,
	);
	const sc = solarD / 480;

	// Progress ring geometry
	const ringR = 62,
		ringC = 2 * Math.PI * ringR;
	const ringDiam = ringR * 2 + 20;

	return (
		<>
			<style>{S}</style>
			<div className="g-root">
				<div className="g-sf">
					{STARS.filter((_, i) => i % STAR_STEP === 0).map((s) => (
						<div
							key={s.id}
							className="g-s"
							style={{
								left: `${s.x}%`,
								top: `${s.y}%`,
								width: s.s,
								height: s.s,
								"--op": s.op,
								animationDuration: `${s.dur}s`,
								animationDelay: `${s.delay}s`,
							}}
						/>
					))}
				</div>

				<nav className="g-nav">
					<div className="g-brand">
						QUIZ<span>BLITZ</span>
					</div>
					<div className="g-code-pill">{room?.roomCode}</div>
				</nav>

				{phase === "prepare" && (
					<div className="g-prep">
						{/* Stars behind solar system */}
						<div className="g-sf" style={{ position: "absolute" }}>
							{STARS.filter((_, i) => i % STAR_STEP === 0).map((s) => (
								<div
									key={s.id}
									className="g-s"
									style={{
										left: `${s.x}%`,
										top: `${s.y}%`,
										width: s.s,
										height: s.s,
										"--op": s.op,
										animationDuration: `${s.dur}s`,
										animationDelay: `${s.delay}s`,
									}}
								/>
							))}
						</div>

						<div className="g-solar" style={{ width: solarD, height: solarD }}>
							{/* Orbit rings — each centered via negative margin */}
							{PLANETS.map((p, i) => {
								const d = p.r * 2 * sc;
								return (
									<div
										key={`or${i}`}
										className="g-oring"
										style={{
											width: d,
											height: d,
											marginLeft: -d / 2,
											marginTop: -d / 2,
										}}
									/>
								);
							})}

							{/* Planets — arm rotates around center (top:50%, left:50%), planet at end of arm */}
							{PLANETS.map((p, i) => {
								const orbitR = p.r * sc;
								const ps = p.sz * sc;
								return (
									<div
										key={`pa${i}`}
										className="g-parm"
										style={{
											animationDuration: `${p.speed}s`,
											animationDirection: i % 2 === 0 ? "normal" : "reverse",
											animationDelay: `-${(p.startDeg / 360) * p.speed}s`, // offset start angle
										}}
									>
										{/* Planet at distance orbitR along positive X axis, centered vertically */}
										<div
											className="g-pball"
											style={{
												width: ps,
												height: ps,
												left: orbitR - ps / 2,
												top: -ps / 2,
												background: `radial-gradient(circle at 35% 28%, ${p.color}cc, ${p.color} 55%, ${p.color}44 100%)`,
												boxShadow: `0 0 ${ps * 2.5}px ${ps * 0.8}px ${p.color}55`,
											}}
										/>
									</div>
								);
							})}

							{/* SVG progress ring — centered */}
							<svg
								className="g-prog-ring"
								width={ringDiam * sc}
								height={ringDiam * sc}
								viewBox={`0 0 ${ringDiam} ${ringDiam}`}
								style={{
									marginLeft: -(ringDiam * sc) / 2,
									marginTop: -(ringDiam * sc) / 2,
								}}
							>
								<circle
									cx={ringDiam / 2}
									cy={ringDiam / 2}
									r={ringR}
									fill="none"
									stroke="rgba(167,139,250,0.07)"
									strokeWidth="2"
								/>
								<circle
									cx={ringDiam / 2}
									cy={ringDiam / 2}
									r={ringR}
									fill="none"
									stroke="rgba(167,139,250,0.7)"
									strokeWidth="2"
									strokeLinecap="round"
									strokeDasharray={`${ringC * pct} ${ringC}`}
									transform={`rotate(-90 ${ringDiam / 2} ${ringDiam / 2})`}
									style={{
										transition: "stroke-dasharray 0.12s linear",
										filter: "drop-shadow(0 0 5px rgba(167,139,250,0.9))",
									}}
								/>
							</svg>

							{/* Sun core — centered via transform */}
							<div className="g-sun">
								<div className="g-sun-num" key={popKey}>
									{countdown}
								</div>
								<div className="g-sun-lbl">seconds</div>
							</div>
						</div>

						<div className="g-prep-lbl">Get ready · Next question incoming</div>
					</div>
				)}

				<div className="g-body">
					{error && <div className="g-error">{error}</div>}

					{phase === "question" && question && (
						<QuestionCard
							key={question.id ?? `${question.text ?? question.question}-${room?.currentQuestionIndex ?? ""}`}
							question={question}
							roomCode={room?.roomCode}
						/>
					)}

					{phase === "result" && (
						<div className="g-result">
							<div className="g-rc">
								<div className="g-rc-head">
									<div className="g-rc-icon">
										<ChartIcon />
									</div>
									<span className="g-rc-title">Round Results</span>
								</div>
								{correctAnswer && (
									<div className="g-ca">
										<span className="g-ca-lbl">Correct Answer</span>
										<span className="g-ca-val">{correctAnswer}</span>
									</div>
								)}
								<div className="g-rc-body">
									{rows.length > 0 ? (
										rows.map((e, i) => {
											const name =
												nameById.get(e.playerId) || e.playerId || "Player";
											return (
												<div
													key={e.playerId || i}
													className={`g-rr ${e.correct ? "ok" : "bad"}`}
													style={{ animationDelay: `${i * 0.04}s` }}
												>
													<div className="g-rr-st">
														<svg
															width="13"
															height="13"
															viewBox="0 0 24 24"
															fill="none"
															stroke={e.correct ? "#34D399" : "#F87171"}
															strokeWidth="3"
															strokeLinecap="round"
														>
															{e.correct ? (
																<polyline points="20 6 9 17 4 12" />
															) : (
																<>
																	<line x1="18" y1="6" x2="6" y2="18" />
																	<line x1="6" y1="6" x2="18" y2="18" />
																</>
															)}
														</svg>
													</div>
													<div className="g-rr-info">
														<div className="g-rr-name">{name}</div>
														{e.answer && (
															<div className="g-rr-ans">
																Answered: {e.answer}
															</div>
														)}
													</div>
													<div
														className={`g-rr-pts ${e.correct ? "pos" : "neg"}`}
													>
														{e.correct ? `+${e.score || e.points || 0}` : "—"}
													</div>
												</div>
											);
										})
									) : (
										<div
											style={{
												textAlign: "center",
												padding: "28px 0",
												color: "rgba(255,255,255,0.18)",
												fontSize: 13,
											}}
										>
											Calculating...
										</div>
									)}
								</div>
							</div>
							<div className="g-next">
								<span className="g-ndot" />
								Next question incoming
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
