const SYDNEY_TIME_ZONE = 'Australia/Sydney';

type DateParts = { year: number; month: number; day: number };

export class DateUtil {
  static todayInSydney(now: Date = new Date()): DateParts {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: SYDNEY_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(now);
    return {
      year: Number(this.part(parts, 'year')),
      month: Number(this.part(parts, 'month')),
      day: Number(this.part(parts, 'day'))
    };
  }

  static addDaysInSydney(days: number, now: Date = new Date()): string {
    const today = this.todayInSydney(now);
    const date = new Date(Date.UTC(today.year, today.month - 1, today.day + days));
    return this.toIsoDate({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() });
  }

  static todayPlusThreeDays(now: Date = new Date()): string {
    return this.addDaysInSydney(3, now);
  }

  static nextWeekendDate(now: Date = new Date()): string {
    const today = this.todayInSydney(now);
    const date = new Date(Date.UTC(today.year, today.month - 1, today.day));
    const day = date.getUTCDay();
    const daysToSaturday = day === 0 ? 6 : 6 - day;
    return this.addDaysToIsoDate(this.toIsoDate(today), daysToSaturday || 7);
  }

  static rollToNextBusinessDay(isoDate: string): string {
    const date = this.parseIsoDate(isoDate);
    const day = new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
    return this.addDaysToIsoDate(isoDate, day === 6 ? 2 : day === 0 ? 1 : 0);
  }

  static isValidIsoDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    return this.toIsoDate(this.parseIsoDate(value)) === value;
  }

  static isOnOrAfterToday(value: string, now: Date = new Date()): boolean {
    return this.isValidIsoDate(value) && value >= this.toIsoDate(this.todayInSydney(now));
  }

  private static addDaysToIsoDate(isoDate: string, days: number): string {
    const date = this.parseIsoDate(isoDate);
    const shifted = new Date(Date.UTC(date.year, date.month - 1, date.day + days));
    return this.toIsoDate({ year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1, day: shifted.getUTCDate() });
  }

  private static parseIsoDate(value: string): DateParts {
    const [year, month, day] = value.split('-').map(Number);
    return { year, month, day };
  }

  private static toIsoDate(date: DateParts): string {
    return `${date.year.toString().padStart(4, '0')}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
  }

  private static part(parts: Intl.DateTimeFormatPart[], type: string): string {
    const value = parts.find((part) => part.type === type)?.value;
    if (!value) throw new Error(`Missing date part: ${type}`);
    return value;
  }
}