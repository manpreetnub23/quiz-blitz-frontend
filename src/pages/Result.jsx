import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "../store/useGameStore";
import socket from "../socket/socket";
import { SPACE_FONT_IMPORT, createStars } from "../theme/space";

const STARS = createStars("result", 180);
const STAR_STEP = 3;
const AV = ["#A78BFA", "#60A5FA", "#34D399", "#F472B6", "#FBBF24", "#06B6D4"];

const S = `
${SPACE_FONT_IMPORT}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#070710;min-height:100vh;overflow-x:hidden;}
.r-root{min-height:100vh;background:#070710;font-family:'Exo 2',sans-serif;color:#fff;position:relative;overflow-x:hidden;}
.r-sf{position:fixed;inset:0;pointer-events:none;z-index:0;}
.r-star{position:absolute;border-radius:50%;background:#fff;animation:tw ease-in-out infinite;}
@keyframes tw{0%,100%{opacity:var(--op,.2);transform:scale(1)}50%{opacity:1;transform:scale(1.8)}}

/* Shimmer particles on complete */
.r-shimmer{position:fixed;pointer-events:none;z-index:1;border-radius:50%;animation:drift linear infinite;}
@keyframes drift{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(105vh) rotate(360deg);opacity:0}}

.r-nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(7,7,16,0.92);border-bottom:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(24px);padding:0 40px;height:60px;display:flex;align-items:center;justify-content:space-between;}
.r-brand{font-family:'Orbitron',monospace;font-size:14px;font-weight:900;letter-spacing:3px;color:#fff;}
.r-brand span{color:#A78BFA;}
.r-nav-tag{font-family:'Orbitron',monospace;font-size:8px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.2);}

.r-body{position:relative;z-index:10;max-width:680px;margin:0 auto;padding:80px 24px 60px;}

/* Hero */
.r-hero{text-align:center;margin-bottom:48px;animation:heroIn 0.8s cubic-bezier(0.22,1,0.36,1) both;}
@keyframes heroIn{from{opacity:0;transform:scale(0.75) translateY(36px)}to{opacity:1;transform:scale(1) translateY(0)}}
.r-moon-scene{
  position:relative;width:220px;height:220px;margin:0 auto 32px;
}
/* Big moon */
.r-moon{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:140px;height:140px;border-radius:50%;
  background:radial-gradient(circle at 38% 35%,#E8E4FF,#C4B5FD 35%,#7C3AED 70%,#2D1B69 100%);
  box-shadow:0 0 0 1px rgba(167,139,250,0.2),0 0 40px rgba(167,139,250,0.3),0 0 80px rgba(167,139,250,0.15);
  animation:moonGlow 4s ease-in-out infinite;
}
/* Craters */
.r-crater{position:absolute;border-radius:50%;background:rgba(0,0,0,0.15);border:1px solid rgba(0,0,0,0.1);}
/* Rocket orbit path (invisible) */
.r-orbit-path{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:200px;height:200px;border-radius:50%;
  border:1px dashed rgba(167,139,250,0.12);
}
/* Rocket wrapper spins */
.r-rocket-arm{
  position:absolute;top:50%;left:50%;
  width:0;height:0;transform-origin:0 0;
  animation:rocketOrbit 6s linear infinite;
}
@keyframes rocketOrbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
/* Rocket sits at end of arm */
.r-rocket{
  position:absolute;
  top:-8px;left:96px;
  width:18px;height:18px;
  animation:rocketCounter 6s linear infinite;
}
@keyframes rocketCounter{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
/* Shooting star */
.r-shoot{
  position:absolute;height:1.5px;border-radius:2px;
  background:linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0));
  animation:shoot linear infinite;
  transform-origin:right center;
}
@keyframes shoot{0%{opacity:0;transform:translateX(0) rotate(var(--ang,-25deg)) scaleX(0);transform-origin:right center}20%{opacity:1}80%{opacity:1}100%{opacity:0;transform:translateX(-220px) rotate(var(--ang,-25deg)) scaleX(1);transform-origin:right center}}15%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translateX(-120px) rotate(var(--ang,-25deg)) scaleX(1)}}
@keyframes moonGlow{0%,100%{box-shadow:0 0 0 1px rgba(167,139,250,0.2),0 0 40px rgba(167,139,250,0.3),0 0 80px rgba(167,139,250,0.15);}50%{box-shadow:0 0 0 2px rgba(167,139,250,0.35),0 0 60px rgba(167,139,250,0.5),0 0 120px rgba(167,139,250,0.25);}}50%{transform:translateY(-10px)}}
.r-title{font-family:'Orbitron',monospace;font-size:clamp(32px,5.5vw,58px);font-weight:900;letter-spacing:-2px;line-height:0.95;color:#fff;margin-bottom:12px;}
.r-title .dim{color:rgba(255,255,255,0.35);}
.r-sub{font-size:13px;color:rgba(255,255,255,0.25);font-weight:500;letter-spacing:1px;font-family:'Orbitron',monospace;}

/* Podium */
.r-podium{display:flex;align-items:flex-end;justify-content:center;gap:12px;margin-bottom:40px;animation:fadeUp 0.6s ease 0.2s both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
.r-pod{display:flex;flex-direction:column;align-items:center;gap:7px;}
.r-pod-av{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-size:17px;font-weight:900;color:#fff;}
.r-pod-name{font-size:11px;font-weight:700;text-align:center;max-width:84px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(255,255,255,0.5);}
.r-pod-medal{font-family:'Orbitron',monospace;font-size:11px;font-weight:800;letter-spacing:1px;}
.r-pod-pts{font-family:'Orbitron',monospace;font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);}
.r-pod-bar{width:80px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;border:1px solid;}
.r-pod-rank{font-family:'Orbitron',monospace;font-size:22px;font-weight:900;}

/* Leaderboard */
.r-lb{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(18px);box-shadow:0 10px 30px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.05);border-radius:20px;overflow:hidden;margin-bottom:24px;animation:fadeUp 0.6s ease 0.28s both;}
.r-lb-head{padding:16px 22px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:space-between;}
.r-lb-title{font-family:'Orbitron',monospace;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);}
.r-lb-cnt{font-family:'Orbitron',monospace;font-size:10px;font-weight:700;color:rgba(255,255,255,0.18);}
.r-lb-body{padding:12px;}
.r-row{display:flex;align-items:center;gap:13px;padding:11px 13px;border-radius:12px;margin-bottom:7px;border:1px solid;transition:border-color 0.2s;animation:rowIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;}
@keyframes rowIn{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:translateX(0)}}
.r-row:nth-child(1){animation-delay:.04s;background:rgba(167,139,250,0.05);border-color:rgba(167,139,250,0.18);}
.r-row:nth-child(2){animation-delay:.08s;background:rgba(96,165,250,0.04);border-color:rgba(96,165,250,0.14);}
.r-row:nth-child(3){animation-delay:.12s;background:rgba(52,211,153,0.04);border-color:rgba(52,211,153,0.14);}
.r-row:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3)){animation-delay:calc(.12s + var(--i)*0.04s);background:rgba(255,255,255,0.015);border-color:rgba(255,255,255,0.05);}
.r-row:hover{border-color:rgba(167,139,250,0.22);}
.r-rank{font-family:'Orbitron',monospace;font-size:14px;width:30px;text-align:center;flex-shrink:0;color:rgba(255,255,255,0.35);}
.r-av{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-size:14px;font-weight:900;color:#fff;flex-shrink:0;}
.r-name{flex:1;font-size:13px;font-weight:700;}
.r-score{font-family:'Orbitron',monospace;font-size:18px;font-weight:900;letter-spacing:-1px;}
.r-score.s0{color:#A78BFA;}.r-score.s1{color:#60A5FA;}.r-score.s2{color:#34D399;}.r-score.sn{color:rgba(255,255,255,0.3);}

.r-cta{width:100%;padding:16px;border:1px solid rgba(167,139,250,0.35);border-radius:13px;background:rgba(167,139,250,0.1);color:#C4B5FD;font-family:'Orbitron',monospace;font-size:11px;font-weight:800;letter-spacing:2px;cursor:pointer;transition:all 0.2s;box-shadow:0 0 28px rgba(167,139,250,0.08);animation:fadeUp 0.6s ease 0.45s both;}
.r-cta:hover{background:rgba(167,139,250,0.18);border-color:rgba(167,139,250,0.55);transform:translateY(-2px);box-shadow:0 8px 28px rgba(167,139,250,0.2);}

@media(max-width:768px){.r-nav{padding:0 18px;}.r-body{padding:72px 18px 48px;}.r-podium{gap:8px;}}
@media(max-width:480px){.r-body{padding:68px 12px 40px;}.r-title{font-size:30px;letter-spacing:-1.5px;}.r-moon-scene{
  position:relative;width:220px;height:220px;margin:0 auto 32px;
}
/* Big moon */
.r-moon{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:140px;height:140px;border-radius:50%;
  background:radial-gradient(circle at 38% 35%,#E8E4FF,#C4B5FD 35%,#7C3AED 70%,#2D1B69 100%);
  box-shadow:0 0 0 1px rgba(167,139,250,0.2),0 0 40px rgba(167,139,250,0.3),0 0 80px rgba(167,139,250,0.15);
  animation:moonGlow 4s ease-in-out infinite;
}
/* Craters */
.r-crater{position:absolute;border-radius:50%;background:rgba(0,0,0,0.15);border:1px solid rgba(0,0,0,0.1);}
/* Rocket orbit path (invisible) */
.r-orbit-path{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:200px;height:200px;border-radius:50%;
  border:1px dashed rgba(167,139,250,0.12);
}
/* Rocket wrapper spins */
.r-rocket-arm{
  position:absolute;top:50%;left:50%;
  width:0;height:0;transform-origin:0 0;
  animation:rocketOrbit 6s linear infinite;
}
@keyframes rocketOrbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
/* Rocket sits at end of arm */
.r-rocket{
  position:absolute;
  top:-8px;left:96px;
  width:18px;height:18px;
  animation:rocketCounter 6s linear infinite;
}
@keyframes rocketCounter{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
/* Shooting star */
.r-shoot{
  position:absolute;height:1.5px;border-radius:2px;
  background:linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0));
  animation:shoot linear infinite;
  transform-origin:right center;
}
@keyframes shoot{0%{opacity:0;transform:translateX(0) rotate(var(--ang,-25deg)) scaleX(0);transform-origin:right center}20%{opacity:1}80%{opacity:1}100%{opacity:0;transform:translateX(-220px) rotate(var(--ang,-25deg)) scaleX(1);transform-origin:right center}}15%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translateX(-120px) rotate(var(--ang,-25deg)) scaleX(1)}}
@keyframes moonGlow{0%,100%{box-shadow:0 0 0 1px rgba(167,139,250,0.2),0 0 40px rgba(167,139,250,0.3),0 0 80px rgba(167,139,250,0.15);}50%{box-shadow:0 0 0 2px rgba(167,139,250,0.35),0 0 60px rgba(167,139,250,0.5),0 0 120px rgba(167,139,250,0.25);}}.r-pod-bar{width:64px;}.r-pod-av{width:40px;height:40px;font-size:14px;}.r-lb-head{padding:13px 16px;}.r-lb-body{padding:9px;}}
`;

export default function Result() {
	const navigate = useNavigate();
	const leaderboard = useGameStore((s) => s.leaderboard);
	const room = useGameStore((s) => s.room);
	const reset = useGameStore((s) => s.reset);
	const nameById = useMemo(() => {
		const m = new Map();
		for (const p of room?.players || []) m.set(p.id, p.name || p.id);
		return m;
	}, [room?.players]);
	const playAgain = () => {
		reset();
		localStorage.removeItem("quiz_room_code");
		socket.disconnect();
		navigate("/");
	};

	const pOrder = leaderboard?.length >= 3 ? [1, 0, 2] : [];
	const pH = [76, 106, 56];
	const pColors = [
		"rgba(96,165,250,0.15)",
		"rgba(167,139,250,0.15)",
		"rgba(52,211,153,0.12)",
	];
	const pBorders = [
		"rgba(96,165,250,0.25)",
		"rgba(167,139,250,0.3)",
		"rgba(52,211,153,0.22)",
	];
	const pText = ["#60A5FA", "#A78BFA", "#34D399"];
	const medals = ["01", "02", "03"];

	return (
		<>
			<style>{S}</style>
			<div className="r-root">
				<div className="r-sf">
					{STARS.filter((_, i) => i % STAR_STEP === 0).map((s) => (
						<div
							key={s.id}
							className="r-star"
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
				<nav className="r-nav">
					<div className="r-brand">
						QUIZ<span>BLITZ</span>
					</div>
					<span className="r-nav-tag">Mission Complete</span>
				</nav>
				<div className="r-body">
					<div className="r-hero">
						{/* Moon scene */}
						<div className="r-moon-scene">
							<div className="r-orbit-path" />
							{/* Rocket arm + rocket SVG */}
							<div className="r-rocket-arm">
								<div className="r-rocket">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
									>
										<path
											d="M12 2C12 2 7 6 7 13h2l-2 4h10l-2-4h2c0-7-5-11-5-11z"
											fill="#C4B5FD"
											stroke="#A78BFA"
											strokeWidth="0.5"
										/>
										<path d="M9 13c0 0-2 1-2 4h2" fill="#7C3AED" />
										<path d="M15 13c0 0 2 1 2 4h-2" fill="#7C3AED" />
										<circle cx="12" cy="10" r="1.5" fill="#E8E4FF" />
									</svg>
								</div>
							</div>
							{/* Moon body */}
							<div className="r-moon">
								{/* Craters */}
								<div
									className="r-crater"
									style={{ width: 18, height: 18, top: "22%", left: "20%" }}
								/>
								<div
									className="r-crater"
									style={{ width: 10, height: 10, top: "55%", left: "55%" }}
								/>
								<div
									className="r-crater"
									style={{ width: 14, height: 14, top: "65%", left: "25%" }}
								/>
								<div
									className="r-crater"
									style={{ width: 7, height: 7, top: "30%", left: "60%" }}
								/>
							</div>
							{/* Shooting stars */}
							{[
								{
									top: "12%",
									left: "8%",
									w: 60,
									ang: "-20deg",
									dur: "3.5s",
									delay: "0s",
								},
								{
									top: "70%",
									left: "55%",
									w: 40,
									ang: "-30deg",
									dur: "5s",
									delay: "1.8s",
								},
								{
									top: "35%",
									left: "70%",
									w: 50,
									ang: "-15deg",
									dur: "4.2s",
									delay: "3s",
								},
							].map((s, i) => (
								<div
									key={i}
									className="r-shoot"
									style={{
										top: s.top,
										left: s.left,
										width: s.w,
										"--ang": s.ang,
										animationDuration: s.dur,
										animationDelay: s.delay,
									}}
								/>
							))}
						</div>
						<div className="r-title">
							Results
							<br />
							<span className="dim">Transmitted</span>
						</div>
						<p className="r-sub">Final scores locked in</p>
					</div>

					{leaderboard?.length >= 3 && (
						<div className="r-podium">
							{pOrder.map((ri) => {
								const e = leaderboard[ri];
								if (!e) return null;
								const name = nameById.get(e.playerId) || e.playerId;
								return (
									<div
										key={ri}
										className="r-pod"
										style={{ flex: ri === 0 ? "1.15" : "1" }}
									>
										<div
											className="r-pod-av"
											style={{
												background: AV[ri % AV.length] + "33",
												color: AV[ri % AV.length],
												border: `1px solid ${AV[ri % AV.length]}44`,
											}}
										>
											{(name || "?")[0].toUpperCase()}
										</div>
										<div className="r-pod-name">{name}</div>
										<div className="r-pod-medal" style={{ color: pText[ri] }}>
											{medals[ri]}
										</div>
										<div className="r-pod-pts">{e.score} pts</div>
										<div
											className="r-pod-bar"
											style={{
												height: pH[ri],
												background: pColors[ri],
												borderColor: pBorders[ri],
											}}
										>
											<span className="r-pod-rank" style={{ color: pText[ri] }}>
												{ri + 1}
											</span>
										</div>
									</div>
								);
							})}
						</div>
					)}

					<div className="r-lb">
						<div className="r-lb-head">
							<span className="r-lb-title">Final Standings</span>
							<span className="r-lb-cnt">
								{leaderboard?.length || 0} pilots
							</span>
						</div>
						<div className="r-lb-body">
							{leaderboard?.length ? (
								leaderboard.map((e, i) => {
									const name = nameById.get(e.playerId) || e.playerId;
									const sc =
										i === 0 ? "s0" : i === 1 ? "s1" : i === 2 ? "s2" : "sn";
									return (
										<div
											key={e.playerId}
											className="r-row"
											style={{ "--i": i }}
										>
											<div className="r-rank">
												{String(i + 1).padStart(2, "0")}
											</div>
											<div
												className="r-av"
												style={{
													background: AV[i % AV.length] + "22",
													color: AV[i % AV.length],
												}}
											>
												{(name || "?")[0].toUpperCase()}
											</div>
											<div className="r-name">{name}</div>
											<div className={`r-score ${sc}`}>{e.score}</div>
										</div>
									);
								})
							) : (
								<p
									style={{
										color: "rgba(255,255,255,0.12)",
										textAlign: "center",
										padding: "28px",
										fontSize: 12,
										fontFamily: "'Orbitron',monospace",
										letterSpacing: "1.5px",
									}}
								>
									No data
								</p>
							)}
						</div>
					</div>

					<button className="r-cta" onClick={playAgain}>
						New Mission
					</button>
				</div>
			</div>
		</>
	);
}
