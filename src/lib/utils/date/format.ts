/**
 * Date formatting utilities
 * Pure functions for formatting dates in various formats
 */

/**
 * Format date range for display
 * Formats two dates as a range (e.g., "01.09.2024 - 31.05.2025")
 * @param startDate - Start date string (ISO format or date string)
 * @param endDate - End date string (ISO format or date string)
 * @returns Formatted date range string
 * @example
 * formatDateRange('2024-09-01', '2025-05-31') // '01.09.2024 - 31.05.2025'
 */
export function formatDateRange(startDate: string, endDate: string): string {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startFormatted = start.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const endFormatted = end.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return `${startFormatted} - ${endFormatted}`;
  } catch {
    return `${startDate} - ${endDate}`;
  }
}

/**
 * Format date for display
 * Formats a date string according to provided options or default format
 * @param dateString - Date string (ISO format or date string)
 * @param options - Optional Intl.DateTimeFormatOptions for custom formatting
 * @returns Formatted date string
 * @example
 * formatDate('2024-09-01') // '01.09.2024'
 * formatDate('2024-09-01', { year: 'numeric', month: 'long', day: 'numeric' }) // '1 сентября 2024 г.'
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const date = new Date(dateString);
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    return date.toLocaleDateString('ru-RU', options || defaultOptions);
  } catch {
    return dateString;
  }
}

/**
 * Format date with time for display
 * Formats a date string with time information
 * @param dateString - Date string (ISO format or date string)
 * @returns Formatted date string with time
 * @example
 * formatDateTime('2024-09-01T10:30:00') // '1 сентября 2024 г., 10:30'
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

