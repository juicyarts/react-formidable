import { DateTimeFormat, formatDateTimeString } from './time.helper';

describe('TimeHelper', () => {
  describe('formatDateTimeString', () => {
    it('should return date in format YYYY-MM-DD', () => {
      expect(
        formatDateTimeString('2021-03-12T12:38:04.0371616+00:00', DateTimeFormat.YYYYMMDD),
      ).toBe('2021-03-12');
    });

    it('should return date in format HH:MM', () => {
      expect(formatDateTimeString('2021-03-12T12:38:04.0371616', DateTimeFormat.HHMM)).toBe(
        '12:38',
      );
    });

    it('should return empty string when given undefined args', () => {
      expect(formatDateTimeString(undefined, DateTimeFormat.YYYYMMDD)).toBe('');
    });

    it('should parse dates with 1-3 digit years correctly', () => {
      expect(
        formatDateTimeString('0001-12-10T12:38:04.0371616+00:00', DateTimeFormat.YYYYMMDD),
      ).toBe('0001-12-10');
    });
  });
});
