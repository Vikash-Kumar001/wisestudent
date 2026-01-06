import User from '../models/User.js';
import UserProgress from '../models/UserProgress.js';
import XPLog from '../models/XPLog.js';
import leaderboardCache from './leaderboardCache.js';

/**
 * Broadcast leaderboard updates to all subscribers for all periods
 * This function should be called whenever XP changes (game completion, etc.)
 */
export const broadcastLeaderboardUpdate = async (io) => {
  if (!io) {
    console.warn('⚠️ Socket.IO instance not available for leaderboard broadcast');
    return;
  }

  try {
    // Broadcast updated leaderboard for each period
    const periods = ['daily', 'weekly', 'monthly', 'allTime'];
    
    for (const period of periods) {
      let leaderboard = [];

      if (period === 'allTime') {
        // For allTime, use UserProgress total XP - optimized with .lean()
        const top = await UserProgress.find()
          .sort({ xp: -1 })
          .limit(50)
          .populate('userId', 'name username email fullName avatar')
          .lean();

        const validTop = top.filter(entry => entry.userId && entry.userId._id);

        leaderboard = validTop.map((entry, index) => {
          const userData = entry.userId;
          let displayName = userData.name || userData.fullName || userData.username || (userData.email ? userData.email.split('@')[0] : 'User');
          let displayUsername = userData.username || (userData.email ? userData.email.split('@')[0] : 'user');

          return {
            rank: index + 1,
            _id: userData._id,
            name: displayName,
            username: displayUsername,
            avatar: userData.avatar,
            xp: entry.xp || 0,
            level: entry.level || Math.floor((entry.xp || 0) / 1000) + 1,
            // Note: isCurrentUser will be set on the client side based on their own user ID
            isCurrentUser: false
          };
        });
      } else {
        // For daily, weekly, monthly - aggregate XP from XPLog
        const now = new Date();
        let startDate;

        switch(period) {
          case 'daily':
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            startDate.setMinutes(0, 0, 0);
            break;
          case 'weekly':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay());
            startDate.setHours(0, 0, 0, 0);
            startDate.setMinutes(0, 0, 0);
            break;
          case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            startDate.setHours(0, 0, 0, 0);
            startDate.setMinutes(0, 0, 0);
            break;
        }

        const xpAggregation = await XPLog.aggregate([
          {
            $match: {
              date: { $gte: startDate }
            }
          },
          {
            $group: {
              _id: '$userId',
              totalXP: { $sum: '$xp' }
            }
          },
          {
            $sort: { totalXP: -1 }
          },
          {
            $limit: 50
          }
        ]);

        // Get user details for top XP earners - optimized with .lean()
        const userIds = xpAggregation.map(item => item._id);
        const users = await User.find({ _id: { $in: userIds } })
          .select('name username email fullName avatar')
          .lean();

        const userMap = new Map(users.map(u => [u._id.toString(), u]));

        leaderboard = xpAggregation.map((item, index) => {
          const userData = userMap.get(item._id.toString());
          if (!userData) return null;

          let displayName = userData.name || userData.fullName || userData.username || (userData.email ? userData.email.split('@')[0] : 'User');
          let displayUsername = userData.username || (userData.email ? userData.email.split('@')[0] : 'user');

          return {
            rank: index + 1,
            _id: userData._id,
            name: displayName,
            username: displayUsername,
            avatar: userData.avatar,
            xp: item.totalXP || 0,
            level: Math.floor((item.totalXP || 0) / 1000) + 1,
            // Note: isCurrentUser will be set on the client side based on their own user ID
            isCurrentUser: false
          };
        }).filter(Boolean);
      }

      // Calculate position changes using cache
      const leaderboardWithChanges = leaderboardCache.calculatePositionChanges(period, leaderboard);
      
      // Update cache with current positions for next comparison
      leaderboardCache.updatePositions(period, leaderboard);

      // Broadcast to subscribers of this period
      io.to(`leaderboard-${period}`).emit('student:leaderboard:data', {
        period,
        leaderboard: leaderboardWithChanges
      });
    }
  } catch (err) {
    console.error('Error broadcasting leaderboard update:', err);
  }
};

