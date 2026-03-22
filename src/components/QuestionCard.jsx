import { useState } from "react";
import socket from "../socket/socket";
import { SPACE_FONT_IMPORT } from "../theme/space";

const OPT = [
	{
		label: "A",
		color: "#A78BFA",
		dimBg: "rgba(167,139,250,0.08)",
		dimBorder: "rgba(167,139,250,0.22)",
		selBg: "#A78BFA",
		selBorder: "#A78BFA",
		glow: "rgba(167,139,250,0.45)",
	},
	{
		label: "B",
		color: "#60A5FA",
		dimBg: "rgba(96,165,250,0.08)",
		dimBorder: "rgba(96,165,250,0.22)",
		selBg: "#60A5FA",
		selBorder: "#60A5FA",
		glow: "rgba(96,165,250,0.45)",
	},
	{
		label: "C",
		color: "#34D399",
		dimBg: "rgba(52,211,153,0.08)",
		dimBorder: "rgba(52,211,153,0.22)",
		selBg: "#34D399",
		selBorder: "#34D399",
		glow: "rgba(52,211,153,0.45)",
	},
	{
		label: "D",
		color: "#F472B6",
		dimBg: "rgba(244,114,182,0.08)",
		dimBorder: "rgba(244,114,182,0.22)",
		selBg: "#F472B6",
		selBorder: "#F472B6",
		glow: "rgba(244,114,182,0.45)",
	},
];

const S = `
${SPACE_FONT_IMPORT}
.qc{animation:qcIn 0.5s cubic-bezier(0.22,1,0.36,1) both;}
@keyframes qcIn{from{opacity:0;transform:scale(0.94) translateY(24px)}to{opacity:1;transform:scale(1) translateY(0)}}

.qc-box{
  background:rgba(255,255,255,0.02);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:20px;padding:44px 36px;
  text-align:center;margin-bottom:16px;
  position:relative;overflow:hidden;
}
.qc-box::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(167,139,250,0.35),transparent);}
.qc-tag{
  display:inline-block;font-family:'Orbitron',monospace;
  font-size:8px;font-weight:700;letter-spacing:3px;text-transform:uppercase;
  color:rgba(167,139,250,0.5);background:rgba(167,139,250,0.06);
  border:1px solid rgba(167,139,250,0.12);border-radius:100px;
  padding:5px 14px;margin-bottom:20px;
}
.qc-text{
  font-family:'Exo 2',sans-serif;
  font-size:clamp(18px,3.2vw,28px);
  font-weight:800;color:#fff;line-height:1.35;
}

.qc-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}

.qc-opt{
  display:flex;align-items:center;gap:13px;
  padding:18px 20px;border-radius:15px;
  border:1.5px solid;
  cursor:pointer;
  font-family:'Exo 2',sans-serif;font-size:14px;font-weight:700;
  text-align:left;
  transition:transform 0.18s, box-shadow 0.18s, background 0.15s, border-color 0.15s;
  animation:optIn 0.42s cubic-bezier(0.34,1.56,0.64,1) both;
  position:relative;overflow:hidden;
}
.qc-opt::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.04),transparent);pointer-events:none;}
@keyframes optIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.qc-opt:nth-child(1){animation-delay:0.05s}
.qc-opt:nth-child(2){animation-delay:0.1s}
.qc-opt:nth-child(3){animation-delay:0.15s}
.qc-opt:nth-child(4){animation-delay:0.2s}

/* Hover only when not picked */
.qc-opt.idle:hover{transform:translateY(-3px);}
.qc-opt.idle:active{transform:translateY(-1px);}

/* Picked state */
.qc-opt.picked{
  transform:scale(0.98);
  color:#fff !important;
}
.qc-opt.dim{
  opacity:0.38;
  transform:none !important;
  cursor:not-allowed;
}

/* Letter badge */
.qc-letter{
  width:38px;height:38px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  font-family:'Orbitron',monospace;font-size:13px;font-weight:800;
  flex-shrink:0;transition:all 0.15s;
}
/* When picked: letter bg is white, text is the color */
.qc-opt.picked .qc-letter{background:#fff !important;}

.qc-opttext{flex:1;line-height:1.4;}
.qc-check{margin-left:auto;flex-shrink:0;}

.qc-footer{
  margin-top:14px;padding:13px;
  background:rgba(167,139,250,0.04);border:1px solid rgba(167,139,250,0.1);border-radius:12px;
  display:flex;align-items:center;justify-content:center;gap:9px;
  font-family:'Exo 2',sans-serif;font-size:12px;font-weight:600;color:rgba(255,255,255,0.3);
}
.qc-dot{width:6px;height:6px;border-radius:50%;background:#A78BFA;animation:blink 1.3s ease infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.1}}

@media(max-width:600px){.qc-grid{grid-template-columns:1fr}.qc-box{padding:28px 18px}}
@media(max-width:380px){.qc-opt{padding:13px 13px;gap:10px}.qc-letter{width:32px;height:32px;font-size:11px}}
`;

const CheckIcon = ({ color }) => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth="3"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="20 6 9 17 4 12" />
	</svg>
);

export default function QuestionCard({ question, roomCode }) {
	const [picked, setPicked] = useState(null);

	const pick = (index, opt) => {
		if (picked !== null) return;
		setPicked(index);
		socket.emit("submit_answer", { roomCode, answer: opt });
	};

	return (
		<>
			<style>{S}</style>
			<div className="qc">
				<div className="qc-box">
					<div className="qc-tag">Question</div>
					<div className="qc-text">{question.text || question.question}</div>
				</div>

				<div className="qc-grid">
					{question.options.map((opt, i) => {
						const s = OPT[i % OPT.length];
						const isPicked = picked === i;
						const isDim = picked !== null && !isPicked;
						const stateClass = isPicked ? "picked" : isDim ? "dim" : "idle";

						return (
							<button
								key={`${i}-${opt}`}
								className={`qc-opt ${stateClass}`}
								onClick={() => pick(i, opt)}
								disabled={picked !== null}
								style={{
									// Default (not picked): subtle tinted bg
									background: isPicked ? s.selBg : s.dimBg,
									borderColor: isPicked ? s.selBorder : s.dimBorder,
									color: isPicked ? "#fff" : "rgba(255,255,255,0.85)",
									boxShadow: isPicked
										? `0 0 32px ${s.glow}, 0 4px 16px rgba(0,0,0,0.3)`
										: "none",
								}}
							>
								<div
									className="qc-letter"
									style={{
										// Not picked: colored bg with 20% opacity, colored text
										// Picked: white bg, colored text
										background: isPicked ? "#fff" : s.color + "28",
										color: s.color,
										boxShadow: isPicked ? `0 0 0 2px ${s.color}` : "none",
									}}
								>
									{s.label}
								</div>
								<span className="qc-opttext">{opt}</span>
								{isPicked && (
									<span className="qc-check">
										<CheckIcon color="#fff" />
									</span>
								)}
							</button>
						);
					})}
				</div>

				{picked !== null && (
					<div className="qc-footer">
						<span className="qc-dot" />
						Answer locked — waiting for others
					</div>
				)}
			</div>
		</>
	);
}
