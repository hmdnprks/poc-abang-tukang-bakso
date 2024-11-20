import { estimateDuration } from '../common';

describe('estimateDuration', () => {
  test('calculates duration for walking', () => {
    const result = estimateDuration(10, 'foot');
    expect(result).toBeCloseTo(120);
  });

  test('calculates duration for driving a car', () => {
    const result = estimateDuration(60, 'car');
    expect(result).toBeCloseTo(60);
  });

  test('calculates duration for riding a bike', () => {
    const result = estimateDuration(20, 'bike');
    expect(result).toBeCloseTo(60);
  });

  test('calculates duration for riding a motorcycle', () => {
    const result = estimateDuration(45, 'motorcycle');
    expect(result).toBeCloseTo(60);
  });

  test('throws an error for an unknown mode', () => {
    expect(() => estimateDuration(10, 'unknown' as any)).toThrow('Unknown mode: unknown');
  });

  test('handles zero distance', () => {
    const result = estimateDuration(0, 'foot');
    expect(result).toBe(0);
  });

  test('handles fractional distances', () => {
    const result = estimateDuration(2.5, 'bike');
    expect(result).toBeCloseTo(7.5);
  });
});
