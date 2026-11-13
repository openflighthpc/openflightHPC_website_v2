/**
 * Converts a dd/mm/yyyy date into a comparable UTC timestamp
 * @param date The date to convert
 * @returns The UTC timestamp for the date
 */
export function dateValue(date: string): number {
   const [day, month, year] = date.split('/').map(Number);
   return Date.UTC(year, month - 1, day);
}
