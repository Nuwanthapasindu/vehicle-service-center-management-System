/**
 * Time utility functions for formatting and parsing times within the mobile app.
 */

/**
 * Parses a "HH:mm" formatted time string into a JavaScript Date object.
 * 
 * @param {string} timeString - The "HH:mm" formatted time string.
 * @returns {Date} - A Date object with the specified hours and minutes.
 */
export const parseTimeString = (timeString) => {
  if (!timeString) return new Date();
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return date;
};

/**
 * Formats a Date object into a user-friendly display string (e.g., "09:00 AM").
 * 
 * @param {Date} date - The Date object to format.
 * @returns {string} - The formatted time string for display.
 */
export const formatDisplayTime = (date) => {
  if (!date || !(date instanceof Date)) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

/**
 * Formats a Date object into a "HH:mm" string for API synchronization.
 * 
 * @param {Date} date - The Date object to format.
 * @returns {string} - The "HH:mm" formatted string.
 */
export const formatSyncTime = (date) => {
  if (!date || !(date instanceof Date)) return "";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * Directly formats a "HH:mm" time string into a user-friendly display string (e.g., "09:00 AM").
 * 
 * @param {string} timeString - The "HH:mm" formatted time string.
 * @returns {string} - The formatted time string for display.
 */
export const formatTimeStringForDisplay = (timeString) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHours = h % 12 || 12;
  return `${formattedHours}:${minutes} ${ampm}`;
};
