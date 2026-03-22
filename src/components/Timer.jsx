import { useEffect, useState } from "react";
import { SPACE_FONT_IMPORT } from "../theme/space";
const S = `
${SPACE_FONT_IMPORT}
.tmr{display:flex;align-items:center;gap:9px;padding:6px 12px 6px 6px;border-radius:12px;border:1.5px solid;transition:all 0.3s;}
.tmr-ring{position:relative;width:44px;height:44px;flex-shrink:0;}
.tmr-ring svg{transform:rotate(-90deg);}
.tmr-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-size:15px;font-weight:900;transition:color 0.3s;}
.tmr.urg .tmr-num{animation:shake 0.15s ease-in-out infinite alternate;}
@keyframes shake{from{transform:scale(1)}to{transform:scale(1.2)}}
.tmr-lbl{font-family:'Orbitron',monospace;font-size:7px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.2);}
.tmr-val{font-family:'Orbitron',monospace;font-size:12px;font-weight:800;transition:color 0.3s;}
`;
export default function Timer({ startTime, duration }) {
	const [tl, setTl] = useState(duration);
	useEffect(() => {
		const iv = setInterval(
			() => setTl(Math.max(duration - (Date.now() - startTime), 0)),
			100,
		);
		return () => clearInterval(iv);
	}, [startTime, duration]);
	const s = Math.ceil(tl / 1000),
		pct = tl / duration,
		r = 18,
		c = 2 * Math.PI * r;
	const urg = s <= 5,
		warn = s <= 10;
	const col = urg ? "#F87171" : warn ? "#FBBF24" : "#A78BFA";
	const bg = urg
		? "rgba(248,113,113,0.07)"
		: warn
			? "rgba(251,191,36,0.06)"
			: "rgba(167,139,250,0.06)";
	const bc = urg
		? "rgba(248,113,113,0.22)"
		: warn
			? "rgba(251,191,36,0.18)"
			: "rgba(167,139,250,0.2)";
	return (
		<>
			<style>{S}</style>
			<div
				className={`tmr${urg ? " urg" : ""}`}
				style={{ background: bg, borderColor: bc }}
			>
				<div className="tmr-ring">
					<svg width="44" height="44" viewBox="0 0 44 44">
						<circle
							cx="22"
							cy="22"
							r={r}
							fill="none"
							stroke="rgba(255,255,255,0.05)"
							strokeWidth="2.5"
						/>
						<circle
							cx="22"
							cy="22"
							r={r}
							fill="none"
							stroke={col}
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeDasharray={`${c * pct} ${c}`}
							style={{
								transition: "stroke-dasharray 0.1s linear,stroke 0.3s",
								filter: `drop-shadow(0 0 3px ${col})`,
							}}
						/>
					</svg>
					<div className="tmr-num" style={{ color: col }}>
						{s}
					</div>
				</div>
				<div>
					<div className="tmr-lbl">Time Left</div>
					<div className="tmr-val" style={{ color: col }}>
						{s}s
					</div>
				</div>
			</div>
		</>
	);
}
