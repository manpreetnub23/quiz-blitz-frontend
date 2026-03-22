export const SPACE_FONT_IMPORT =
	"@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Exo+2:wght@300;400;500;600;700;800&display=swap');";

const hashSeed = (seed) => {
	let h = 2166136261;
	for (let i = 0; i < seed.length; i += 1) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
};

const mulberry32 = (seed) => {
	let t = seed >>> 0;
	return () => {
		t += 0x6d2b79f5;
		let n = Math.imul(t ^ (t >>> 15), t | 1);
		n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
		return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
	};
};

const round2 = (n) => Number(n.toFixed(2));

export const createStars = (seed, count = 120) => {
	const rand = mulberry32(hashSeed(seed));
	return Array.from({ length: count }, (_, id) => ({
		id,
		x: round2(rand() * 100),
		y: round2(rand() * 100),
		s: round2(0.4 + rand() * 1.2),
		dur: round2(1.8 + rand() * 4.2),
		delay: round2(rand() * 7),
		op: round2(0.1 + rand() * 0.55),
	}));
};
