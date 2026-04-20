const CX = 100;
const CY = 100;
const R_OUTER = 95;

function onCircle(r: number, deg: number): [number, number] {
	const rad = ((deg - 90) * Math.PI) / 180;
	return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

function fmt(n: number): string {
	return n.toFixed(2);
}

export function renderClockSVG(hour: number, minute: number): string {
	const parts: string[] = [];

	parts.push(
		`<circle cx="${CX}" cy="${CY}" r="${R_OUTER}" fill="white" stroke="black" stroke-width="3"/>`,
	);

	for (let i = 0; i < 60; i++) {
		const angle = i * 6;
		const isHour = i % 5 === 0;
		const innerR = isHour ? 82 : 88;
		const [x1, y1] = onCircle(innerR, angle);
		const [x2, y2] = onCircle(R_OUTER - 2, angle);
		const sw = isHour ? 3 : 1.5;
		parts.push(
			`<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="black" stroke-width="${sw}" stroke-linecap="round"/>`,
		);
	}

	for (let n = 1; n <= 12; n++) {
		const [x, y] = onCircle(70, n * 30);
		parts.push(
			`<text x="${fmt(x)}" y="${fmt(y)}" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="black">${n}</text>`,
		);
	}

	const hourAngle = (hour % 12) * 30 + minute * 0.5;
	const [hx, hy] = onCircle(45, hourAngle);
	parts.push(
		`<line x1="${CX}" y1="${CY}" x2="${fmt(hx)}" y2="${fmt(hy)}" stroke="black" stroke-width="6" stroke-linecap="round"/>`,
	);

	const minuteAngle = minute * 6;
	const [mx, my] = onCircle(78, minuteAngle);
	parts.push(
		`<line x1="${CX}" y1="${CY}" x2="${fmt(mx)}" y2="${fmt(my)}" stroke="black" stroke-width="3" stroke-linecap="round"/>`,
	);

	parts.push(`<circle cx="${CX}" cy="${CY}" r="4" fill="black"/>`);

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="clock-svg">${parts.join("")}</svg>`;
}
