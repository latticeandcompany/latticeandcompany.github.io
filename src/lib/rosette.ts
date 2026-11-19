// The Lattice mark: ellipses rotated in even steps around a shared center. Eight on screen;
// sixteen collapses into a solid disc under about 200px.
export const CENTER = 350;
export const RX = 250;
export const RY = 95;
export const STROKE_WIDTH = 15.635;
export const VIEWBOX = '60 60 580 580';
export const VIEWBOX_SIZE = 580;
export const MARK_ROTATIONS = 8;

export const rotations = (count = MARK_ROTATIONS) => Array.from({ length: count }, (_, i) => (i * 180) / count);
