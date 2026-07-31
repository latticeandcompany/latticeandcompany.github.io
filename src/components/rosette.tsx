import { useEffect, useRef } from 'react';

// The Lattice mark: 8 ellipses (rx 250, ry 95) rotated in even 22.5° steps around a
// shared center, forming the woven-sphere rosette.
//
// The parent-company artwork draws the same ellipse at 16 rotations. That density reads
// as a solid disc at anything under about 200px and as a doily above it, so the site uses
// the 8-rotation mark everywhere, including the pattern band.

const CENTER = 350;
const RX = 250;
const RY = 95;
const STROKE_WIDTH = 15.635;

/** Rotation angles in degrees for a rosette of `count` ellipses. */
export const rotations = (count: number) => Array.from({ length: count }, (_, i) => (i * 180) / count);

export const PRODUCT_ROTATIONS = 8;

interface RosetteProps {
	/** Rendered size (square). */
	size?: number | string;
	/** Rotation count. 8 everywhere; see the note above before changing it. */
	count?: number;
	/** Draw the strokes on mount; false renders the finished mark. */
	animate?: boolean;
	/** Force a stroke color (used on the always-dark pattern band). Defaults to the theme mark color. */
	stroke?: string;
	className?: string;
	title?: string;
}

const Rosette = ({
	size = '3rem',
	count = PRODUCT_ROTATIONS,
	animate = true,
	stroke,
	className,
	title = 'Lattice & Company',
}: RosetteProps) => {
	const groupRef = useRef<SVGGElement>(null);

	// Replay the draw after an Astro view-transition swap so returning to a page
	// re-animates the mark rather than showing it statically.
	useEffect(() => {
		if (!animate) return;
		const replay = () => {
			const group = groupRef.current;
			if (!group) return;
			group.querySelectorAll<SVGEllipseElement>('.rosette-stroke').forEach((el) => {
				el.style.animation = 'none';
				void el.getBoundingClientRect();
				el.style.animation = '';
			});
		};
		document.addEventListener('astro:after-swap', replay);
		return () => document.removeEventListener('astro:after-swap', replay);
	}, [animate]);

	// A denser rosette draws for longer if every stroke keeps the product mark's stagger,
	// so the per-stroke delay scales down with the count and the whole mark lands in
	// roughly the same time either way.
	const stagger = 0.72 / count;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="60 60 580 580"
			className={className}
			style={{ width: size, height: size, overflow: 'visible' }}
			role="img"
			aria-label={title}
		>
			<g ref={groupRef}>
				{rotations(count).map((deg, i) => (
					<ellipse
						key={deg}
						className={animate ? 'rosette-stroke' : undefined}
						cx={CENTER}
						cy={CENTER}
						rx={RX}
						ry={RY}
						pathLength={1}
						transform={`rotate(${deg} ${CENTER} ${CENTER})`}
						fill="none"
						stroke={stroke ?? (animate ? undefined : 'var(--mark)')}
						strokeWidth={STROKE_WIDTH}
						strokeLinecap="round"
						style={animate ? { animationDelay: `${i * stagger}s`, stroke } : undefined}
					/>
				))}
			</g>
		</svg>
	);
};

export default Rosette;
