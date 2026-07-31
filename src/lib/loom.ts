/**
 * Geometry for the hero. One shape family, walked from one end to the other.
 *
 * The Lattice mark is eight ellipses rotated about a shared center. Here each of those
 * eight is a polyline of the same point count as every other shape in the panel, so any
 * two of them can be interpolated point by point. That is the whole trick: the mark
 * unravels into three braided strands and five threads lying flat, each of which runs on to a
 * product — all of it one function of one progress value per thread.
 *
 * `threadPath(i, m)`: m runs 0 → 1, and one thread of the mark is paid out into its finished
 * position - a level line, or a braided strand that runs on out to its product.
 *
 * Both the static render and the animation call the same function; the finished picture is
 * `threadPath(i, 1)`. Nothing here reads the DOM or the clock, so the server renders
 * the resolved state and the client animates toward it with no second implementation.
 *
 * The panel is a fixed 11:5 box, which is why these are plain numbers and not fractions of a
 * measured element: one user unit is the same length across and down, so the mark stays round
 * at every width. The ratio is a compromise - flat enough that the panel is a band on a wide
 * screen, tall enough that the mark is still a mark on a phone.
 */

export const VW = 220;
export const VH = 100;
const MID = VH / 2;

export const ROWS = 3;
/** Row centers, which the lockups also sit on — see .loom-rows. */
export const rowCenter = (i: number) => ((i + 0.5) * VH) / ROWS;

/** Where a strand stops and its lockup starts. Drives --loom-anchor. */
export const ANCHOR_X = 137;

// ===== The braid =====
export const BRAID_END = 70;
// Whole turns, so the braid ends as it began: strands spread, no crossing on the seam.
const TURNS = 2;
const AMP = 5;
const OMEGA = (TURNS * 2 * Math.PI) / BRAID_END;

// A third harmonic, which is what separates a braid from a sine wave: it flattens the run
// where a strand travels alongside its neighbour and steepens the moment it crosses. Odd
// harmonics only, because the crossing math depends on f(π - u) = f(u). 1/9 is where the
// peak goes exactly flat; past it the peak develops a dip.
const H3 = 0.1;
const wave = (u: number) => Math.sin(u) + H3 * Math.sin(3 * u);
const waveSlope = (u: number) => Math.cos(u) + 3 * H3 * Math.cos(3 * u);

// Phases 120° apart — the three-strand rope. Assigned so that at both ends of the braid the
// strands sit in the same top-to-bottom order as the rows they unwind into, which is what
// keeps the unwinding from crossing itself.
const PHASE = [(4 * Math.PI) / 3, 0, (2 * Math.PI) / 3];

const braidY = (p: number, x: number) => MID + AMP * wave(OMEGA * x + PHASE[p]!);
const braidSlope = (p: number, x: number) => AMP * OMEGA * waveSlope(OMEGA * x + PHASE[p]!);

// ===== The unwinding =====
// How far a strand follows the braid's exit tangent before turning for its row, as a
// fraction of the unwinding's width. It scales with how far the strand has to travel:
// enough to leave no kink at the seam, but the middle strand, already level with its row,
// settles instead of bulging.
const LEVER_MIN = 0.04;
const LEVER_MAX = 0.16;
const FAN_W = ANCHOR_X - BRAID_END;

type Pt = [number, number];

interface Cubic {
	x0: number;
	y0: number;
	c1x: number;
	c1y: number;
	c2x: number;
	c2y: number;
	x1: number;
	y1: number;
}

const MAX_TRAVEL = Math.max(
	...[0, 1, 2].map((p) => Math.abs(rowCenter(p) - braidY(p, BRAID_END)))
);

// Leaves the braid along its tangent and arrives horizontally, so a strand is level where
// it meets its lockup.
const fan = (p: number): Cubic => {
	const y0 = braidY(p, BRAID_END);
	const m = braidSlope(p, BRAID_END);
	const y1 = rowCenter(p);
	const lever = LEVER_MIN + (LEVER_MAX - LEVER_MIN) * (Math.abs(y1 - y0) / MAX_TRAVEL);
	return {
		x0: BRAID_END,
		y0,
		c1x: BRAID_END + FAN_W * lever,
		c1y: y0 + m * FAN_W * lever,
		c2x: ANCHOR_X - FAN_W * 0.42,
		c2y: y1,
		x1: ANCHOR_X,
		y1,
	};
};

const at = (a: number, b: number, c: number, d: number, t: number) => {
	const u = 1 - t;
	return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};

const cubicPoint = (c: Cubic, t: number): Pt => [
	at(c.x0, c.c1x, c.c2x, c.x1, t),
	at(c.y0, c.c1y, c.c2y, c.y1, t),
];

// Where the braid stops, in the shared parameter.
const S_BREAK = BRAID_END / ANCHOR_X;
/** The same, exported so a crossing's x can be turned into a position along a strand. */
export const sAt = (x: number) => x / ANCHOR_X;

// A strand at rest: braid, then the run out to its lockup. `s` is the same fraction of the
// thread's length throughout, so the pay-out crosses from one into the other without a seam.
const strandShape = (p: number, s: number): Pt => {
	if (s >= S_BREAK) return cubicPoint(fan(p), (s - S_BREAK) / (1 - S_BREAK));
	const x = s * ANCHOR_X;
	return [x, braidY(p, x)];
};

// ===== The threads that stay behind =====
// The five ellipses that are not products settle into level lines. They are the ground the
// braid reads against, and they are the mark's own material rather than a texture dropped in
// behind it. They stop shortly after the braid does: run out under the unwinding as well and
// they stop being ground and start looking like ruled paper.
export const GROUND_END = 96;
const groundShape = (y: number, s: number): Pt => [s * GROUND_END, y];

// ===== The mark =====
// rosette.tsx' numbers, in this panel's units. The ellipse is parameterized from its far
// end so a loop unrolls from the left, in the direction everything else travels.
const RX = 250;
const RY = 95;
const MARK_SPAN = 515.6;
const MARK_STROKE_UNITS = 15.635;
// Centered on the picture as a whole, not on the panel: the lockups take up the right of it,
// and .loom shifts the whole composition to sit centered in whatever width it is given.
const MARK_C: Pt = [96, 50];
const MARK_D = 80;
const F = MARK_D / MARK_SPAN;

/** The mark's stroke in panel units, so the logo carries the weight it has everywhere else. */
export const MARK_STROKE = MARK_STROKE_UNITS * F;

const markShape = (rot: number, s: number, spin: number): Pt => {
	const a = (rot * Math.PI) / 180 + spin;
	const u = Math.PI + 2 * Math.PI * s;
	const ex = RX * Math.cos(u);
	const ey = RY * Math.sin(u);
	return [
		MARK_C[0] + F * (ex * Math.cos(a) - ey * Math.sin(a)),
		MARK_C[1] + F * (ex * Math.sin(a) + ey * Math.cos(a)),
	];
};

// ===== The eight =====
export interface Thread {
	/** Its rotation in the mark. */
	rot: number;
	/** Index in `products`, or null if it settles into the ground. */
	product: number | null;
	/** Resting height, for the ones that settle. */
	groundY: number | null;
	/** Position in the unravelling. The uprights let go first; the products are the last
	 * three to leave, which is what makes them read as what the mark came apart into. */
	order: number;
}

// The three near-horizontal ellipses become the products, and each already leans the way
// its row lies: 157.5° rises to the right, 0° is level, 22.5° falls.
export const threads: Thread[] = [
	{ rot: 0, product: 1, groundY: null, order: 6 },
	{ rot: 22.5, product: 2, groundY: null, order: 7 },
	{ rot: 45, product: null, groundY: 30, order: 3 },
	{ rot: 67.5, product: null, groundY: 66, order: 1 },
	{ rot: 90, product: null, groundY: 44, order: 0 },
	{ rot: 112.5, product: null, groundY: 9, order: 2 },
	{ rot: 135, product: null, groundY: 88, order: 4 },
	{ rot: 157.5, product: 0, groundY: null, order: 5 },
];

/** Draw order for the mark: the same sequence rosette.tsx uses, by rotation. */
export const drawOrder = (i: number) => i;

// ===== The unravelling =====
// A thread is paid out, not morphed. One progress value per thread runs a narrow window along
// it: everything behind the window is lying in its finished position, everything ahead is still
// coiled in the mark and still turning, and the window itself is the bend where the thread
// leaves the coil. At every instant the thread is one continuous line, which is why there is no
// seam between the mark coming apart, the braid, and the run out to a lockup — they are the
// same move, seen at three points along it.
//
// LAG sets how far the tail trails the head; the window is 1/LAG of the thread, so a larger
// LAG is a tighter bend travelling faster. The ease is per point, so every part of the thread
// decelerates into place instead of the whole thread arriving on one ramp.
const LAG = 4;
const SPIN = 0.6;
const settle = (t: number) => 1 - (1 - t) ** 3;

/**
 * How far along a given point of a thread is, for a thread whose overall progress is `m`.
 * Exported because everything else in the hero hangs off it: a crossing resolves when both its
 * strands have settled there, and a lockup arrives just before its strand reaches it.
 */
export const settledAt = (m: number, s: number) =>
	settle(Math.min(1, Math.max(0, m * (1 + LAG) - LAG * s)));

/**
 * Where the thread is halfway through leaving the coil, as a fraction along it. Behind this it
 * is a product's line and takes the accent; ahead of it, it is still the mark and still ink.
 */
export const bendAt = (m: number) => Math.min(1, Math.max(0, (m * (1 + LAG) - 0.5) / LAG));

// ===== Paths =====
// Enough samples that a braid crossing reads as a curve and few enough that every shape can
// be rebuilt each frame.
const SAMPLES = 72;

const round = (n: number) => Math.round(n * 100) / 100;
const poly = (pts: Pt[]) =>
	pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${round(x)} ${round(y)}`).join(' ');

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPt = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

/** A point at a fractional sample index, for ends that fall between samples. */
const sampleAt = (point: (s: number) => Pt, n: number): Pt => {
	const whole = Math.floor(n);
	if (n === whole) return point(whole / SAMPLES);
	return lerpPt(point(whole / SAMPLES), point((whole + 1) / SAMPLES), n - whole);
};

/**
 * One thread of the mark, somewhere between the logo and the finished picture.
 *
 * @param m    0 the mark, 1 paid out
 * @param to   how much of the thread exists yet, and
 * @param from where it starts. The line is cut at both ends rather than dashed: a dash measures
 *             in screen space once a stroke stops scaling, so a pathLength-normalized one would
 *             drift with the panel's width. Cutting also lets the ink and the accent copy hold
 *             the two sides of the bend without overlapping, which no crossfade could do.
 */
export const threadPath = (i: number, m: number, to = 1, from = 0) => {
	const th = threads[i]!;
	const pts: Pt[] = [];
	const point = (s: number): Pt => {
		const rest = th.product !== null ? strandShape(th.product, s) : groundShape(th.groundY!, s);
		if (m >= 1) return rest;
		const l = settledAt(m, s);
		// Still coiled here, so still turning here.
		return l >= 1 ? rest : lerpPt(markShape(th.rot, s, SPIN * (1 - l)), rest, l);
	};

	const head = Math.max(0, Math.min(1, from)) * SAMPLES;
	const tail = Math.max(0, Math.min(1, to)) * SAMPLES;
	if (tail <= head) return '';
	// Both ends land between samples, so the line grows and gives way smoothly rather than in
	// steps of one segment.
	pts.push(sampleAt(point, head));
	for (let n = Math.floor(head) + 1; n <= Math.floor(tail); n += 1) pts.push(point(n / SAMPLES));
	if (tail > Math.floor(tail)) pts.push(sampleAt(point, tail));
	return poly(pts);
};

// ===== Crossings =====
// Where two strands meet. f(wx + a) = f(wx + b) resolves to a closed form, so the crossings are
// exact rather than searched for. The geometry is fixed - a crossing is at rest the moment both
// its strands have been paid out through it - so only its opacity is ever animated.
export interface Crossing {
	x: number;
	/** The strand drawn in front here. */
	over: number;
	/** Both strands that meet here. It resolves only once each of them has settled through it. */
	pair: [number, number];
	d: string;
}

// Half-length of a fragment, along x. Short enough that a strand reads as continuous and
// only momentarily in front, rather than chopped into pieces.
const FRAG = 2.05;
const FRAG_SAMPLES = 8;

// The strand descending through a crossing passes in front. Because the two strands' phases
// are reflections about the crossing, their slopes there are exactly opposite, so the rule
// is always decisive and alternates on its own — which is what makes three lines read as a
// rope instead of a plaid.
export const crossings = (): Crossing[] => {
	const out: Crossing[] = [];
	for (let i = 0; i < ROWS; i += 1) {
		for (let j = i + 1; j < ROWS; j += 1) {
			// A pair meets wherever their phases reflect about π, which is once every half turn
			// from this base angle.
			const base = (Math.PI - PHASE[i]! - PHASE[j]!) / 2;
			const first = Math.ceil(-base / Math.PI);
			const last = Math.floor((TURNS * 2 * Math.PI - base) / Math.PI);
			for (let n = first; n <= last; n += 1) {
				const x = (base + n * Math.PI) / OMEGA;
				// A fragment that would hang off either end of the braid is not a crossing.
				if (x - FRAG < 0 || x + FRAG > BRAID_END) continue;
				const over = braidSlope(i, x) > 0 ? i : j;
				const pts: Pt[] = [];
				for (let f = 0; f <= FRAG_SAMPLES; f += 1) {
					const fx = x - FRAG + (2 * FRAG * f) / FRAG_SAMPLES;
					pts.push([fx, braidY(over, fx)]);
				}
				out.push({ x, over, pair: [i, j], d: poly(pts) });
			}
		}
	}
	// Left to right, so the weave sets itself in the order the strands were drawn.
	return out.sort((a, b) => a.x - b.x);
};
