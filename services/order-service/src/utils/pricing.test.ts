import { getDurationInDays, calculateRentCost } from './pricing';

describe('Order Service Pricing Utils', () => {
  describe('getDurationInDays', () => {
    test('should calculate duration correctly for same day (min 1 day)', () => {
      const start = new Date('2026-07-12T10:00:00.000Z');
      const end = new Date('2026-07-12T10:00:00.000Z');
      expect(getDurationInDays(start, end)).toBe(1);
    });

    test('should calculate duration for 1 day difference', () => {
      const start = new Date('2026-07-12T10:00:00.000Z');
      const end = new Date('2026-07-13T10:00:00.000Z');
      expect(getDurationInDays(start, end)).toBe(1);
    });

    test('should calculate duration for multiple days difference', () => {
      const start = new Date('2026-07-12T10:00:00.000Z');
      const end = new Date('2026-07-17T10:00:00.000Z');
      expect(getDurationInDays(start, end)).toBe(5);
    });
  });

  describe('calculateRentCost', () => {
    test('should calculate cost on daily basis if weekly rate is not provided', () => {
      const pricePerDay = 10;
      const pricePerWeek = null;
      const days = 10;
      expect(calculateRentCost(pricePerDay, pricePerWeek, days)).toBe(100);
    });

    test('should calculate cost on daily basis if duration is less than 7 days', () => {
      const pricePerDay = 10;
      const pricePerWeek = 50; // Discounted weekly rate: $50 instead of $70
      const days = 5;
      expect(calculateRentCost(pricePerDay, pricePerWeek, days)).toBe(50);
    });

    test('should apply weekly rate for a exact week duration', () => {
      const pricePerDay = 10;
      const pricePerWeek = 50;
      const days = 7;
      expect(calculateRentCost(pricePerDay, pricePerWeek, days)).toBe(50);
    });

    test('should combine weekly and daily rates for mixed duration', () => {
      const pricePerDay = 10;
      const pricePerWeek = 50;
      const days = 10; // 1 week ($50) + 3 days ($10 * 3) = $80
      expect(calculateRentCost(pricePerDay, pricePerWeek, days)).toBe(80);
    });

    test('should handle multiple weeks and remaining days', () => {
      const pricePerDay = 10;
      const pricePerWeek = 50;
      const days = 16; // 2 weeks ($100) + 2 days ($20) = $120
      expect(calculateRentCost(pricePerDay, pricePerWeek, days)).toBe(120);
    });
  });
});
