/**
 * Formats a number into a compact string representation (K for thousands, M for millions).
 * @param {number} num The number to format.
 * @returns {string|number} The formatted string or the original number.
 */
export const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };
  