/**
 * Converts a dd/mm/yyyy date into a comparable UTC timestamp
 * @param date The date to convert
 * @returns The UTC timestamp for the date
 */
export function dateValue(date: string): number {
   const [day, month, year] = date.split('/').map(Number);
   return Date.UTC(year, month - 1, day);
}

/**
 * Formats the data into more human readable version
 * @param date The date to format
 * @returns The formatted date
 */
export const formatDate = (date: string) => {
   const [day, month, year] = date.split('/').map(Number);

   return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
      year: 'numeric'
   });
};
