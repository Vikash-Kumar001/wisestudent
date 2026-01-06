import api from "../utils/api";

/**
 * Unified Dashboard API Service
 * Provides centralized API calls for all dashboard types with consistent error handling
 */

// ================== STUDENT DASHBOARD APIs ==================
export const fetchStudentDashboardData = async () => {
  try {
    const [stats, achievements, activities] = await Promise.all([
      api.get("/api/stats/student"),
      api.get("/api/student/achievements"), 
      api.get("/api/activity/my-activities?limit=5")
    ]);

    return {
      stats: stats.data,
      achievements: achievements.data,
      activities: activities.data,
      challenges: [] // Challenges removed - return empty array
    };
  } catch (error) {
    console.error("Error fetching student dashboard data:", error);
    throw error;
  }
};

export const fetchStudentStats = async () => {
  try {
    const response = await api.get("/api/stats/student");
    return response.data;
  } catch (error) {
    console.error("Error fetching student stats:", error);
    // Return default stats if API fails
    return {
      xp: 0,
      level: 1,
      nextLevelXp: 1000,
      todayMood: "😊",
      streak: 0,
      rank: 0,
      weeklyXP: 0,
      totalActivities: 0,
      completedChallenges: 0
    };
  }
};

export const fetchStudentActivities = async (limit = 10) => {
  try {
    const response = await api.get(`/api/activity/user?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student activities:", error);
    return [];
  }
};

// fetchStudentChallenges removed - daily challenges functionality removed

// New Analytics Metrics
export const fetchPillarMastery = async () => {
  try {
    const response = await api.get("/api/stats/pillar-mastery");
    return response.data;
  } catch (error) {
    console.error("Error fetching pillar mastery:", error);
    return {
      overallMastery: 0,
      totalPillars: 0,
      pillars: [],
      weakPillars: []
    };
  }
};

export const fetchEmotionalScore = async () => {
  try {
    const response = await api.get("/api/stats/emotional-score");
    return response.data;
  } catch (error) {
    console.error("Error fetching emotional score:", error);
    return {
      averageScore: 3,
      trend: 'stable',
      trendData: [],
      totalEntries: 0,
      entriesThisWeek: 0
    };
  }
};

export const fetchEngagementMinutes = async () => {
  try {
    const response = await api.get("/api/stats/engagement-minutes");
    return response.data;
  } catch (error) {
    console.error("Error fetching engagement minutes:", error);
    return {
      totalMinutes: 0,
      avgMinutesPerDay: 0,
      daysActive: 0,
      streak: 0,
      dailyEngagement: [],
      goalMinutes: 30,
      goalProgress: 0
    };
  }
};

export const fetchActivityHeatmap = async () => {
  try {
    const response = await api.get("/api/stats/activity-heatmap");
    return response.data;
  } catch (error) {
    console.error("Error fetching activity heatmap:", error);
    return { heatmapData: [], totalActivities: 0 };
  }
};

export const fetchMoodTimeline = async () => {
  try {
    const response = await api.get("/api/stats/mood-timeline");
    return response.data;
  } catch (error) {
    console.error("Error fetching mood timeline:", error);
    return { timeline: [], totalEntries: 0 };
  }
};

export const fetchRecommendations = async () => {
  try {
    const response = await api.get("/api/stats/recommendations");
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return { recommendations: [] };
  }
};

export const fetchLeaderboardSnippet = async () => {
  try {
    const response = await api.get("/api/stats/leaderboard-snippet");
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { leaderboard: [], currentUserRank: 0, currentUserXP: 0, totalUsers: 0 };
  }
};

export const fetchAchievementTimeline = async () => {
  try {
    const response = await api.get("/api/stats/achievement-timeline");
    return response.data;
  } catch (error) {
    console.error("Error fetching achievement timeline:", error);
    return { achievements: [], totalAchievements: 0 };
  }
};

export const fetchDailyActions = async () => {
  try {
    const response = await api.get("/api/stats/daily-actions");
    return response.data;
  } catch (error) {
    console.error("Error fetching daily actions:", error);
    return { dailyCheckIn: false, missionStarted: false, quizCompleted: false, inboxCount: 0 };
  }
};


// ================== ADMIN DASHBOARD APIs ==================
export const fetchAdminDashboardData = async () => {
  try {
    const [stats, analytics, recentActivity, systemHealth] = await Promise.all([
      api.get("/api/admin/stats"),
      api.get("/api/admin/analytics"),
      api.get("/api/activity/summary?days=7"),
      api.get("/api/admin/system-health")
    ]);

    return {
      stats: stats.data,
      analytics: analytics.data,
      recentActivity: recentActivity.data,
      systemHealth: systemHealth.data
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    throw error;
  }
};

export const fetchAdminStats = async () => {
  try {
    const response = await api.get("/api/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalUsers: 0,
      totalStudents: 0,
      redemptions: 0,
      systemStatus: "Unknown"
    };
  }
};

export const fetchAdminAnalytics = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/admin/analytics?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    return {
      userGrowth: [],
      engagementMetrics: [],
      platformActivity: [],
      performanceMetrics: []
    };
  }
};

export const fetchSystemHealth = async () => {
  try {
    const response = await api.get("/api/admin/system-health");
    return response.data;
  } catch (error) {
    console.warn("System health endpoint not available, using mock data:", error.message);
    return {
      status: "Operational",
      uptime: "99.9%",
      responseTime: "245ms",
      memoryUsage: "67%",
      cpuUsage: "23%",
      activeConnections: 145
    };
  }
};

// ================== COMMON APIS ==================
export const fetchNotifications = async (role = null, unreadOnly = false) => {
  try {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (unreadOnly) params.append('unread', 'true');
    
    const response = await api.get(`/api/notifications?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const fetchRecentActivities = async (limit = 10, userId = null) => {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (userId) params.append('userId', userId);
    
    const response = await api.get(`/api/activity/my-activities?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
};

// ================== UTILITY FUNCTIONS ==================
export const refreshDashboardData = async (dashboardType) => {
  try {
    switch (dashboardType) {
      case 'student':
        return await fetchStudentDashboardData();
      case 'admin':
        return await fetchAdminDashboardData();
      default:
        throw new Error(`Unknown dashboard type: ${dashboardType}`);
    }
  } catch (error) {
    console.error(`Error refreshing ${dashboardType} dashboard data:`, error);
    throw error;
  }
};

export const cacheDashboardData = (dashboardType, data) => {
  try {
    const cacheKey = `dashboard_${dashboardType}_${Date.now()}`;
    localStorage.setItem(cacheKey, JSON.stringify(data));
    
    // Clean old cache entries
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`dashboard_${dashboardType}_`)) {
        const timestamp = parseInt(key.split('_').pop());
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        if (timestamp < fiveMinutesAgo) {
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.warn("Error caching dashboard data:", error);
  }
};

// ================== PROFILE INTEGRATION ==================
export const fetchUserProfile = async () => {
  try {
    const response = await api.get("/api/user/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put("/api/user/profile", profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const uploadUserAvatar = async (formData) => {
  try {
    const response = await api.post("/api/user/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading user avatar:", error);
    throw error;
  }
};

export const updateUserPassword = async (passwordData) => {
  try {
    const response = await api.put("/api/user/password", passwordData);
    return response.data;
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
};
