/**
 * Format number as LKR currency string
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g. "1,234.56 LKR")
 */
const currencyFormatter = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "0.00";
  }

  const formatter = new Intl.NumberFormat("en-LK", {
    style: "decimal",
  });

  return `${formatter.format(amount)}`;
};

export default currencyFormatter;
