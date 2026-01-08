import api from '../utils/api';
import { toast } from 'react-toastify';

/**
 * Parent Badge Service
 * Handles badge checking and retrieval for parents
 */
class ParentBadgeService {
  /**
   * Get Self-Aware Parent Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getSelfAwareBadgeStatus() {
    try {
      const response = await api.get('/api/parent/badge/self-aware-parent');
      return response.data;
    } catch (error) {
      console.error('Failed to get Self-Aware Parent Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Calm Parent Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getCalmParentBadgeStatus() {
    try {
      const response = await api.get('/api/parent/badge/calm-parent');
      return response.data;
    } catch (error) {
      console.error('Failed to get Calm Parent Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Compassionate Parent Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getCompassionateParentBadgeStatus() {
    try {
      const response = await api.get('/api/parent/badge/compassionate-parent');
      return response.data;
    } catch (error) {
      console.error('Failed to get Compassionate Parent Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Present Parent Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getPresentParentBadgeStatus() {
    try {
      const response = await api.get('/api/parent/badge/present-parent');
      return response.data;
    } catch (error) {
      console.error('Failed to get Present Parent Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Mindful Parent Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getMindfulParentBadgeStatus() {
    try {
      const response = await api.get('/api/parent/badge/mindful-parent');
      return response.data;
    } catch (error) {
      console.error('Failed to get Mindful Parent Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Resilient Parent Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getResilientParentBadgeStatus() {
    try {
      const response = await api.get('/api/parent/badge/resilient-parent');
      return response.data;
    } catch (error) {
      console.error('Failed to get Resilient Parent Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Peaceful Communicator Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getPeacefulCommunicatorBadgeStatus() {
    try {
      const response = await api.get('/api/parent/badge/peaceful-communicator');
      return response.data;
    } catch (error) {
      console.error('Failed to get Peaceful Communicator Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Connected Parent Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getConnectedParentBadgeStatus() {
    try {
      const response = await api.get('/api/parent/badge/connected-parent');
      return response.data;
    } catch (error) {
      console.error('Failed to get Connected Parent Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get Purposeful Parent Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getPurposefulParentBadgeStatus() {
    try {
      const response = await api.get('/api/parent/badge/purposeful-parent');
      return response.data;
    } catch (error) {
      console.error('Failed to get Purposeful Parent Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }

  /**
   * Get all parent badges
   * @returns {Promise<Object>} All badges
   */
  async getAllBadges() {
    try {
      const response = await api.get('/api/parent/badges');
      return response.data;
    } catch (error) {
      console.error('Failed to get parent badges:', error);
      return {
        success: false,
        badges: [],
        selfAwareBadge: {
          hasBadge: false,
          newlyEarned: false
        },
        calmParentBadge: {
          hasBadge: false,
          newlyEarned: false
        },
        compassionateParentBadge: {
          hasBadge: false,
          newlyEarned: false
        },
        presentParentBadge: {
          hasBadge: false,
          newlyEarned: false
        },
        mindfulParentBadge: {
          hasBadge: false,
          newlyEarned: false
        },
        resilientParentBadge: {
          hasBadge: false,
          newlyEarned: false
        },
        peacefulCommunicatorBadge: {
          hasBadge: false,
          newlyEarned: false
        },
        connectedParentBadge: {
          hasBadge: false,
          newlyEarned: false
        },
        purposefulParentBadge: {
          hasBadge: false,
          newlyEarned: false
        },
        selfCareChampionBadge: {
          hasBadge: false,
          newlyEarned: false
        }
      };
    }
  }

  /**
   * Get Self-Care Champion Badge status
   * @returns {Promise<Object>} Badge status
   */
  async getSelfCareChampionBadgeStatus() {
    try {
      const response = await api.get('/api/parent/badge/self-care-champion');
      return response.data;
    } catch (error) {
      console.error('Failed to get Self-Care Champion Badge status:', error);
      return {
        success: false,
        hasBadge: false,
        newlyEarned: false
      };
    }
  }
}

export default new ParentBadgeService();

