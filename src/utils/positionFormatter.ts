/**
 * Position Formatter Utility
 * Formats user position values for display in the UI
 */

/**
 * Formats a user's position for display
 *
 * @param position - The user's position in the waitlist
 * @returns Formatted position string. Returns "calculating" for -1, otherwise returns "#N" format
 *
 * @example
 * formatPosition(5) // Returns "#5"
 * formatPosition(-1) // Returns "calculating"
 * formatPosition(1234) // Returns "#1234"
 */
export function formatPosition(position: number): string {
	return position === -1 ? "calculating" : `#${position}`;
}

/**
 * Formats a user's position for display with localization
 *
 * @param position - The user's position in the waitlist
 * @returns Formatted position string with thousand separators. Returns "calculating" for -1
 *
 * @example
 * formatPositionWithLocale(5) // Returns "#5"
 * formatPositionWithLocale(-1) // Returns "calculating"
 * formatPositionWithLocale(1234) // Returns "#1,234"
 */
export function formatPositionWithLocale(position: number): string {
	return position === -1 ? "calculating" : `#${position.toLocaleString()}`;
}

/**
 * Formats position for CSV export
 *
 * @param position - The user's position in the waitlist
 * @returns Position value as string. Returns "calculating" for -1, otherwise returns the number as string
 *
 * @example
 * formatPositionForCSV(5) // Returns "5"
 * formatPositionForCSV(-1) // Returns "calculating"
 */
export function formatPositionForCSV(position: number): string {
	return position === -1 ? "calculating" : String(position);
}
