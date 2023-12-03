import { expect, test, describe } from 'bun:test';
import { head, tail } from './array-util';

describe('array-util', () => {
  describe('head', () => {
    test('should return undefined for an empty array', () => {
      expect(head([])).toBeUndefined();
    });

    test('should return undefined for null', () => {
      expect(head(null as unknown as any)).toBeUndefined();
    });

    test('should return undefined for undefined', () => {
      expect(head(undefined as unknown as any)).toBeUndefined();
    });

    test('should return the first element of the array', () => {
      expect(head([1, 2, 3])).toBe(1);
    });
  });

  describe('tail', () => {
    test('should return undefined for an empty array', () => {
      expect(tail([])).toBeUndefined();
    });

    test('should return undefined for null', () => {
      expect(tail(null as unknown as any)).toBeUndefined();
    });

    test('should return undefined for undefined', () => {
      expect(tail(undefined as unknown as any)).toBeUndefined();
    });

    test('should return the last element of the array', () => {
      expect(tail([1, 2, 3])).toBe(3);
    });
  });
});
