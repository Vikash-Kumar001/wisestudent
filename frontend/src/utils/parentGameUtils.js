/**
 * Utility functions for parent games
 * Handles CalmCoins calculation and game index extraction
 */

/**
 * Calculate CalmCoins reward based on game index
 * @param {number} gameIndex - 1-based game index
 * @returns {number} CalmCoins reward
 */
export const getCalmCoinsForGame = (gameIndex) => {
  if (!gameIndex || gameIndex <= 0) return 5; // Default
  if (gameIndex <= 25) return 5;   // Games 1-25: 5 CalmCoins
  if (gameIndex <= 50) return 10;  // Games 26-50: 10 CalmCoins
  if (gameIndex <= 75) return 15;  // Games 51-75: 15 CalmCoins
  return 20;                        // Games 76-100: 20 CalmCoins
};

/**
 * Calculate replay cost based on game index
 * @param {number} gameIndex - 1-based game index
 * @returns {number} CalmCoins required for replay
 */
export const getReplayCostForGame = (gameIndex) => {
  if (!gameIndex || gameIndex <= 0) return 2; // Default
  if (gameIndex <= 25) return 2;   // Games 1-25: 2 CalmCoins
  if (gameIndex <= 50) return 4;   // Games 26-50: 4 CalmCoins
  if (gameIndex <= 75) return 6;   // Games 51-75: 6 CalmCoins
  return 8;                        // Games 76-100: 8 CalmCoins
};

/**
 * Extract game index from gameId
 * @param {string} gameId - Game ID (e.g., "parent-education-26")
 * @returns {number|null} - 1-based game index or null
 */
export const getGameIndexFromId = (gameId) => {
  if (!gameId) return null;
  const parts = gameId.split('-');
  const index = parseInt(parts[parts.length - 1], 10);
  return isNaN(index) ? null : index;
};

