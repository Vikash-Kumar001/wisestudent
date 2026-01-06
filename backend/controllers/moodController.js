import MoodLog from "../models/MoodLog.js";
import UserProgress from "../models/UserProgress.js";
import XPLog from "../models/XPLog.js";

export const logMood = async (req, res) => {
  const { emoji, journal } = req.body;
  const userId = req.user._id;

  try {
    // Check if mood already logged today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingMood = await MoodLog.findOne({
      userId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existingMood) {
      // Update existing mood for today
      existingMood.emoji = emoji;
      existingMood.journal = journal || existingMood.journal;
      await existingMood.save();

      // Emit socket event
      const io = req.app.get('io');
      if (io) {
        const { emitMoodLogged } = await import('../socketHandlers/moodSocket.js');
        await emitMoodLogged(io, userId, existingMood);
      }

      // Get current XP for response
      let userProgress = await UserProgress.findOne({ userId });
      const currentXP = userProgress ? userProgress.xp : 0;

      // Calculate streak
      const { calculateMoodStreak } = await import('../socketHandlers/moodSocket.js');
      const streak = await calculateMoodStreak(userId);

      return res.status(200).json({ 
        message: "Mood updated successfully", 
        mood: existingMood,
        isUpdate: true,
        totalXP: currentXP,
        streak
      });
    }

    // Create new mood log
    const newMood = await MoodLog.create({
      userId,
      emoji,
      journal,
      date: new Date(),
    });

    // Award XP for mood tracking (25 XP per log)
    const XP_REWARD = 25;
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      userProgress = await UserProgress.create({
        userId,
        xp: 0,
        level: 1,
        healCoins: 0,
        streak: 0
      });
    }

    userProgress.xp += XP_REWARD;
    userProgress.level = Math.floor(userProgress.xp / 1000) + 1;
    await userProgress.save();

    // Log XP gain
    await XPLog.create({
      userId,
      xp: XP_REWARD,
      reason: 'mood_tracking',
      description: 'Mood logged',
      date: new Date()
    });

    // Calculate streak
    const { calculateMoodStreak } = await import('../socketHandlers/moodSocket.js');
    const streak = await calculateMoodStreak(userId);

    // Emit socket events
    const io = req.app.get('io');
    if (io) {
      // Emit mood logged event
      const { emitMoodLogged } = await import('../socketHandlers/moodSocket.js');
      await emitMoodLogged(io, userId, newMood);

      // Emit XP update
      io.to(userId.toString()).emit('stats:updated', {
        userId: userId.toString(),
        xp: userProgress.xp,
        level: userProgress.level
      });
    }

    res.status(201).json({ 
      message: "Mood logged successfully", 
      mood: newMood,
      xpEarned: XP_REWARD,
      newXP: userProgress.xp,
      newLevel: userProgress.level,
      totalXP: userProgress.xp,
      streak
    });
  } catch (err) {
    console.error("❌ Error logging mood:", err);
    res.status(500).json({ error: "Failed to log mood" });
  }
};

export const getUserMoodLogs = async (req, res) => {
  try {
    const moods = await MoodLog.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(moods);
  } catch (err) {
    console.error("❌ Failed to fetch mood logs:", err);
    res.status(500).json({ error: "Failed to fetch mood logs" });
  }
};

export const getMoodAnalytics = async (req, res) => {
  try {
    const moods = await MoodLog.find({ userId: req.user._id });

    const moodCounts = {};
    const moodByWeek = {};

    moods.forEach((entry) => {
      const emoji = entry.emoji;
      const week = new Date(entry.date);
      week.setDate(week.getDate() - week.getDay()); // Sunday start
      const weekKey = week.toISOString().split("T")[0];

      moodCounts[emoji] = (moodCounts[emoji] || 0) + 1;

      if (!moodByWeek[weekKey]) moodByWeek[weekKey] = {};
      moodByWeek[weekKey][emoji] = (moodByWeek[weekKey][emoji] || 0) + 1;
    });

    res.status(200).json({ total: moodCounts, weekly: moodByWeek });
  } catch (err) {
    console.error("❌ Mood analytics error:", err);
    res.status(500).json({ error: "Failed to analyze mood data" });
  }
};

export const getWeeklyMoodStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

    const moods = await MoodLog.find({
      userId: req.user._id,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const moodByDay = {};

    moods.forEach((entry) => {
      const date = new Date(entry.date);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });

      if (!moodByDay[day]) moodByDay[day] = { total: 0, count: 0 };

      let score = 5;
      if (entry.emoji === "😊") score = 8;
      else if (entry.emoji === "😐") score = 5;
      else if (entry.emoji === "😢") score = 2;

      moodByDay[day].total += score;
      moodByDay[day].count += 1;
    });

    const response = Object.entries(moodByDay).map(([day, { total, count }]) => ({
      day,
      score: Math.round(total / count),
    }));

    res.status(200).json(response);
  } catch (err) {
    console.error("❌ Weekly mood stats error:", err);
    res.status(500).json({ error: "Failed to compute mood stats" });
  }
};

export const getMoodHistory = async (req, res) => {
  const { filter } = req.query;

  try {
    let startDate;
    const today = new Date();

    if (filter === "week") {
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
    } else if (filter === "month") {
      startDate = new Date();
      startDate.setMonth(today.getMonth() - 1);
    } else {
      return res.status(400).json({ error: "Invalid filter value" });
    }

    const moods = await MoodLog.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: today },
    }).sort({ date: -1 });

    res.status(200).json(moods);
  } catch (err) {
    console.error("❌ Mood history error:", err);
    res.status(500).json({ error: "Failed to fetch mood history" });
  }
};

// Get mood options (emoji list)
export const getMoodOptions = async (req, res) => {
  try {
    const moodOptions = [
      { emoji: "😄", value: "😄", label: "Happy", color: "from-yellow-400 to-orange-400", score: 5 },
      { emoji: "😊", value: "😊", label: "Content", color: "from-green-400 to-emerald-400", score: 4 },
      { emoji: "😐", value: "😐", label: "Neutral", color: "from-gray-400 to-slate-400", score: 3 },
      { emoji: "😢", value: "😢", label: "Sad", color: "from-blue-400 to-indigo-400", score: 2 },
      { emoji: "😠", value: "😠", label: "Angry", color: "from-red-400 to-pink-400", score: 1 },
      { emoji: "😰", value: "😰", label: "Anxious", color: "from-purple-400 to-violet-400", score: 1 }
    ];

    res.status(200).json(moodOptions);
  } catch (err) {
    console.error("❌ Failed to get mood options:", err);
    res.status(500).json({ error: "Failed to fetch mood options" });
  }
};
