/**
 * Formats a number consistently as a currency string.
 * @param {number|string} amount - The numeric value to format.
 * @param {string} currency - The currency prefix (default: 'LKR').
 * @returns {string} - Formatted string like "LKR 1,234.50"
 */
export default function formatPrice(amount, currency = '') {
  const numericAmount = Number(amount) || 0;
  
  const formattedNumber = numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${currency} ${formattedNumber}`;
}
