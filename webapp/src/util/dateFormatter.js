/**
 * Formats a date string or object into a human-readable format.
 * @param {string|Date} date - The date to format.
 * @returns {string} - The formatted date string (e.g., 1/25/2026).
 */
export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
};

/**
 * Formats a date into a long format.
 * @param {string|Date} date - The date to format.
 * @returns {string} - The long formatted date string (e.g., Sunday, January 25, 2026).
 */
export const formatLongDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Formats a date into a short format with month abbreviations.
 * @param {string|Date} date - The date to format.
 * @returns {string} - The short formatted date string (e.g., Jan 25, 2026).
 */
export const formatShortDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
