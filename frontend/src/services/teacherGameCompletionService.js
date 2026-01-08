import api from '../utils/api';
import { toast } from 'react-toastify';

/**
 * Teacher Game Completion Service
 * Handles CalmCoins for teacher games (no XP/Level system)
 */
class TeacherGameCompletionService {
  constructor() {
    this.completedGames = new Map();
  }

  /**
   * Complete a teacher game and award CalmCoins
   * @param {Object} gameData - Game completion data
   * @param {string} gameData.gameId - Unique game identifier
   * @param {string} gameData.gameType - Game category ('teacher-education')
   * @param {number} gameData.gameIndex - 1-based game index
   * @param {number} gameData.score - Number of correct answers (0-5)
   * @param {number} gameData.totalLevels - Total questions (always 5 for teacher games)
   * @param {number} gameData.totalCoins - CalmCoins for this game (5/10/15/20)
   * @param {boolean} gameData.isReplay - Whether this is a replay attempt
   * @returns {Promise<Object>} - Completion result with CalmCoins earned
   */
  async completeGame(gameData) {
    try {
      const {
        gameId,
        gameType = 'teacher-education',
        gameIndex,
        score = 0,
        totalLevels = 5,
        totalCoins = null,
        isReplay = false
      } = gameData;

      // Validate required data
      if (!gameId) {
        throw new Error('Game ID is required');
      }

      // Get current completion status from backend
      const progressResponse = await api.get(`/api/school/teacher/game/progress/${gameId}`);
      const currentProgress = progressResponse.data || {
        levelsCompleted: 0,
        totalCoinsEarned: 0,
        fullyCompleted: false,
        replayUnlocked: false
      };

      // Check if this is a replay attempt
      const isReplayAttempt = isReplay === true || 
        (currentProgress.fullyCompleted && currentProgress.replayUnlocked === true);

      // Send completion data to backend
      console.log('📤 Sending teacher game completion to backend:', {
        gameId,
        gameType,
        gameIndex,
        score,
        totalLevels,
        totalCoins,
        isReplayAttempt
      });

      const response = await api.post('/api/school/teacher/game/complete', {
        gameId,
        gameType,
        gameIndex,
        score,
        totalLevels,
        totalCoins,
        isFullCompletion: true,
        isReplay: isReplayAttempt
      });

      const result = response.data;

      if (result.success) {
        // Dispatch game completion event
        window.dispatchEvent(new CustomEvent('teacherGameCompleted', {
          detail: {
            gameId,
            fullyCompleted: true,
            isReplay: result.isReplay === true,
            replayUnlocked: result.replayUnlocked === true,
            calmCoinsEarned: result.calmCoinsEarned || 0
          }
        }));

        // If it was a replay, also dispatch replay event
        if (result.isReplay === true) {
          window.dispatchEvent(new CustomEvent('teacherGameReplayed', {
            detail: {
              gameId,
              replayUnlocked: result.replayUnlocked === true
            }
          }));
        }
      }

      return result;
    } catch (error) {
      console.error('Failed to complete teacher game:', error);
      toast.error('Failed to save progress. Please try again.');
      throw error;
    }
  }

  /**
   * Get game progress for a teacher game
   * @param {string} gameId - Game identifier
   * @returns {Promise<Object>} - Game progress data
   */
  async getGameProgress(gameId) {
    try {
      const response = await api.get(`/api/school/teacher/game/progress/${gameId}`);
      return response.data || {
        levelsCompleted: 0,
        totalCoinsEarned: 0,
        fullyCompleted: false,
        replayUnlocked: false
      };
    } catch (error) {
      console.error('Failed to get teacher game progress:', error);
      return {
        levelsCompleted: 0,
        totalCoinsEarned: 0,
        fullyCompleted: false,
        replayUnlocked: false
      };
    }
  }

  /**
   * Unlock replay for a completed teacher game
   * @param {string} gameId - Game identifier
   * @param {number} gameIndex - 1-based game index
   * @returns {Promise<Object>} - Unlock result
   */
  async unlockReplay(gameId, gameIndex) {
    try {
      const response = await api.post(`/api/school/teacher/game/unlock-replay/${gameId}`);
      
      if (response.data.success) {
        toast.success(`Replay unlocked! ${response.data.replayCost} CalmCoins deducted.`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to unlock replay:', error);
      const errorMessage = error.response?.data?.error || 'Failed to unlock replay';
      toast.error(errorMessage);
      throw error;
    }
  }
}

export default new TeacherGameCompletionService();

