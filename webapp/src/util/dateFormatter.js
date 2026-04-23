/**
 * Formats a date string or object into a human-readable format using Sri Lankan timezone.
 * @param {string|Date} date - The date to format.
 * @returns {string} - The formatted date string (e.g., 1/25/2026).
 */
export const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timeZone: 'Asia/Colombo'
    };
    return d.toLocaleDateString('en-US', options);
};

/**
 * Formats a date into a long format using Sri Lankan timezone.
 * @param {string|Date} date - The date to format.
 * @returns {string} - The long formatted date string (e.g., Sunday, January 25, 2026).
 */
export const formatLongDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Colombo'
    };
    return d.toLocaleDateString('en-US', options);
};

/**
 * Formats a date into a short format with month abbreviations using UTC.
 * @param {string|Date} date - The date to format.
 * @returns {string} - The short formatted date string (e.g., Jan 25, 2026).
 */
export const formatShortDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Colombo'
    };
    return d.toLocaleDateString('en-US', options);
};

/**
 * Formats a date into a relative time string (e.g., "2 days ago").
 * Note: For durations, we still use local time comparison.
 * @param {string|Date} date - The date to format.
 * @returns {string} - The relative time string.
 */
export const formatTimeAgo = (date) => {
    if (!date) return '';

    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};
