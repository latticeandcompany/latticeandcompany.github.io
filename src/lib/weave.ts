import { RX, RY } from './rosette';

// The hero background: a chain of half-rosettes. Every cell holds four strands of the mark,
// 45° apart, on a triangular grid tight enough that each cell's tips weave into its
// neighbours'. Alternate cells sit a half-step (22.5°) round, so between them they use all
// eight of the mark's rotations.
//
// The over-and-under comes from drawing every strand in two halves, each over a casing in
// the surface colour: all first halves, then all second halves. Within a pass the order is
// by cell class and strand, never by position, so a single repeating tile and a full canvas
// cross every pair of strands the same way.
//
// Pure — the server's SVG tile and the client's canvas both draw from these.

export const CELL = 128;
export const ROW = (CELL * Math.sqrt(3)) / 2;
export const STRAND_RX = CELL * 0.62;
export const STRAND_RY = STRAND_RX * (RY / RX);
export const STRANDS = 4;
export const CLASSES = 4;

/** Rows offset every other row and cells alternate their half-step, so the pattern repeats every 2 × 2 cells. */
export const TILE_W = CELL * 2;
export const TILE_H = ROW * 2;

export const LINE_WIDTH = 1;
export const CASING_WIDTH = 5;
export const REST_ALPHA = 0.2;
export const NEAR_ALPHA = 0.75;
export const REACH = 340;

/** Spinning a half-rosette by its own symmetry, 45°, lands it back where it started. */
export const MAX_SPIN = Math.PI / 4;

const parity = (n: number) => ((n % 2) + 2) % 2;

export interface Cell {
	x: number;
	y: number;
	base: number;
	cls: number;
}

export const cellAt = (col: number, row: number): Cell => {
	const shifted = parity(row);
	const turned = parity(col + row);
	return {
		x: (col + shifted * 0.5) * CELL,
		y: row * ROW,
		base: (turned * Math.PI) / 8,
		cls: shifted * 2 + turned,
	};
};

export const strandAngle = (cell: Cell, strand: number, spin = 0) => cell.base + (strand * Math.PI) / STRANDS + spin;

/** 1 at the pointer, 0 at REACH and beyond, eased so the edge is soft. */
export const influence = (distance: number) => {
	const t = Math.max(0, 1 - distance / REACH);
	return t * t * (3 - 2 * t);
};

/** Every cell whose strands reach into a box, from one row and column outside it. */
export const cellsCovering = (width: number, height: number) => {
	const cells: Cell[] = [];
	for (let row = -1; row <= Math.ceil(height / ROW) + 1; row++) {
		for (let col = -1; col <= Math.ceil(width / CELL) + 1; col++) cells.push(cellAt(col, row));
	}
	return cells;
};

/** Half an ellipse as an SVG path, matching canvas `ellipse(…, start, start + π)`. */
export const halfStrandPath = (cell: Cell, angle: number, half: 0 | 1) => {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	const sign = half === 0 ? 1 : -1;
	const sx = cell.x + sign * STRAND_RX * cos;
	const sy = cell.y + sign * STRAND_RX * sin;
	const ex = cell.x - sign * STRAND_RX * cos;
	const ey = cell.y - sign * STRAND_RX * sin;
	const deg = (angle * 180) / Math.PI;
	const f = (n: number) => n.toFixed(2);
	return `M${f(sx)} ${f(sy)}A${f(STRAND_RX)} ${f(STRAND_RY)} ${f(deg)} 0 1 ${f(ex)} ${f(ey)}`;
};
