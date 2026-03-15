import { describe, test, expect } from 'vitest'
import { irisLabelToPercent, normalizePercent, progressBar } from './progress-bar.js'

describe('progressBar', () => {
	test('returns bar at 0%', () => {
		expect(progressBar(0, 10, 'W', 'T')).toBe('W|..........T')
	})

	test('returns bar at 100%', () => {
		expect(progressBar(100, 10, 'W', 'T')).toBe('W..........|T')
	})

	test('returns bar at 50%', () => {
		expect(progressBar(50, 10, 'W', 'T')).toBe('W.....|.....T')
	})

	test('returns --- for null', () => {
		expect(progressBar(null)).toBe('---')
	})

	test('returns --- for negative percentage', () => {
		expect(progressBar(-1)).toBe('---')
	})

	test('returns --- for percentage over 100', () => {
		expect(progressBar(101)).toBe('---')
	})

	test('works without prefix/suffix', () => {
		expect(progressBar(50, 10)).toBe('.....|.....')
	})
})

describe('normalizePercent', () => {
	test('normalizes value within range', () => {
		expect(normalizePercent(2570, 0, 5140)).toBeCloseTo(50, 0)
	})

	test('returns 0 at min', () => {
		expect(normalizePercent(0, 0, 5140)).toBe(0)
	})

	test('returns 100 at max', () => {
		expect(normalizePercent(5140, 0, 5140)).toBe(100)
	})

	test('returns null below range', () => {
		expect(normalizePercent(-1, 0, 5140)).toBeNull()
	})

	test('returns null above range', () => {
		expect(normalizePercent(5141, 0, 5140)).toBeNull()
	})

	test('returns null for equal min/max', () => {
		expect(normalizePercent(5, 5, 5)).toBeNull()
	})
})

describe('irisLabelToPercent', () => {
	test('CLOSED returns 0%', () => {
		expect(irisLabelToPercent('CLOSED')).toBe(0)
	})

	test('ƒ 1.8 returns 100%', () => {
		expect(irisLabelToPercent('ƒ 1.8')).toBe(100)
	})

	test('ƒ 4.0 returns ~58%', () => {
		expect(irisLabelToPercent('ƒ 4.0')).toBeCloseTo(58.3, 0)
	})

	test('unknown label returns null', () => {
		expect(irisLabelToPercent('unknown')).toBeNull()
	})
})
