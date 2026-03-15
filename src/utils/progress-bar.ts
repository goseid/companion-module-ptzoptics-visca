/**
 * Generate a text-based position bar for displaying on Companion buttons.
 *
 * @param pct - Position as a percentage (0-100), or null if unknown
 * @param width - Number of dot positions in the bar (default 10)
 * @param start - Prefix label character (e.g., 'W' for Wide)
 * @param end - Suffix label character (e.g., 'T' for Tele)
 * @returns A string like "W.....|.....T", or "---" if the percentage is invalid
 */
export function progressBar(pct: number | null, width = 10, start = '', end = ''): string {
	if (pct === null || pct < 0 || pct > 100) return '---'
	const pos = Math.floor((pct * width) / 100)
	return start + '.'.repeat(pos) + '|' + '.'.repeat(width - pos) + end
}

/**
 * Normalize a value to a percentage (0-100) within a given range.
 *
 * @returns The percentage, or null if the value is outside the range
 */
export function normalizePercent(value: number, min: number, max: number): number | null {
	if (max === min) return null
	if (value < min || value > max) return null
	return ((value - min) / (max - min)) * 100
}

/** Map of iris labels to their ordinal position index (0=CLOSED, 12=ƒ 1.8). */
const IRIS_LABEL_INDEX = new Map<string, number>([
	['CLOSED', 0],
	['ƒ 11.0', 1],
	['ƒ 9.6', 2],
	['ƒ 8.0', 3],
	['ƒ 6.8', 4],
	['ƒ 5.6', 5],
	['ƒ 4.8', 6],
	['ƒ 4.0', 7],
	['ƒ 3.4', 8],
	['ƒ 2.8', 9],
	['ƒ 2.4', 10],
	['ƒ 2.0', 11],
	['ƒ 1.8', 12],
])

const IRIS_MAX_INDEX = 12

/**
 * Convert an iris label (e.g., "ƒ 2.0") to a percentage for the position bar.
 * CLOSED = 0%, ƒ 1.8 = 100%.
 */
export function irisLabelToPercent(label: string): number | null {
	const index = IRIS_LABEL_INDEX.get(label)
	if (index === undefined) return null
	return (index / IRIS_MAX_INDEX) * 100
}
