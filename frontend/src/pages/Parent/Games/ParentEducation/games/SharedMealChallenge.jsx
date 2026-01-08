import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { UtensilsCrossed, Sun, Moon, Coffee, Heart, CheckCircle, Calendar } from "lucide-react";

const SharedMealChallenge = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-36";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentDay, setCurrentDay] = useState(0);
  const [mealLogs, setMealLogs] = useState({});
  const [showReflection, setShowReflection] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Meal types
  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅', time: 'Morning', lucideIcon: Sun, color: 'from-orange-400 to-amber-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-300' },
    { id: 'lunch', label: 'Lunch', icon: '☀️', time: 'Midday', lucideIcon: Coffee, color: 'from-yellow-400 to-orange-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300' },
    { id: 'dinner', label: 'Dinner', icon: '🌙', time: 'Evening', lucideIcon: Moon, color: 'from-indigo-500 to-purple-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-300' }
  ];

  // 3 days of challenge
  const challengeDays = [
    {
      id: 1,
      dayNumber: 1,
      title: "Day 1: Starting the Challenge",
      description: "Begin your shared meal challenge. Log at least one shared meal today with a gratitude moment.",
      context: "Today marks the start of your 3-day shared meal challenge. Focus on being present during at least one meal together.",
      parentTip: "Keep mealtime screen-free; food and laughter recharge everyone. Even one shared meal a day makes a difference.",
      goal: "Log at least 1 shared meal"
    },
    {
      id: 2,
      dayNumber: 2,
      title: "Day 2: Building the Habit",
      description: "Continue building your shared meal practice. Aim for at least one shared meal with gratitude.",
      context: "You're building a habit. Each shared meal strengthens family connection. Notice how presence during meals changes the energy.",
      parentTip: "Shared meals don't have to be perfect. The goal is connection, not perfection. Even 15 minutes of focused time together matters.",
      goal: "Log at least 1 shared meal"
    },
    {
      id: 3,
      dayNumber: 3,
      title: "Day 3: Reflecting on Connection",
      description: "Complete your 3-day challenge. Log your final shared meal and prepare for reflection.",
      context: "This is your final day of the challenge. Reflect on what you've noticed about connection during shared meals.",
      parentTip: "After this challenge, notice how shared meals feel different when they're intentional. Food and laughter truly recharge everyone.",
      goal: "Log at least 1 shared meal"
    }
  ];

  const currentDayData = challengeDays[currentDay];
  const dayMealLogs = mealLogs[currentDay] || {};

  const handleMealLog = (mealId, wasShared, gratitude) => {
    setMealLogs(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        [mealId]: {
          wasShared,
          gratitude: gratitude || '',
          timestamp: new Date().toISOString()
        }
      }
    }));
  };

  const getSharedMealsCount = (dayIndex) => {
    const dayLogs = mealLogs[dayIndex] || {};
    return Object.values(dayLogs).filter(log => log.wasShared === true).length;
  };

  const getTotalSharedMeals = () => {
    let total = 0;
    challengeDays.forEach((_, index) => {
      total += getSharedMealsCount(index);
    });
    return total;
  };

  const handleDayComplete = () => {
    const sharedCount = getSharedMealsCount(currentDay);
    if (sharedCount >= 1) {
      setScore(prev => prev + 1);
      
      if (currentDay < challengeDays.length - 1) {
        setCurrentDay(currentDay + 1);
      } else {
        // All 3 days complete - show reflection
        setShowReflection(true);
      }
    }
  };

  const handleCompleteReflection = () => {
    setShowGameOver(true);
  };

  const generateReflection = () => {
    const totalShared = getTotalSharedMeals();
    const allGratitudes = [];
    
    challengeDays.forEach((_, dayIndex) => {
      const dayLogs = mealLogs[dayIndex] || {};
      Object.values(dayLogs).forEach(log => {
        if (log.wasShared && log.gratitude) {
          allGratitudes.push(log.gratitude);
        }
      });
    });

    let reflection = `Over the past 3 days, you logged ${totalShared} shared meal${totalShared !== 1 ? 's' : ''} with your family.\n\n`;
    
    if (totalShared >= 3) {
      reflection += "Excellent! You've consistently prioritized shared meals and family connection.\n\n";
    } else if (totalShared >= 2) {
      reflection += "Great effort! You've made shared meals a priority. Consider building on this practice.\n\n";
    } else {
      reflection += "You've started the practice of shared meals. Every shared meal creates connection—build on this foundation.\n\n";
    }

    if (allGratitudes.length > 0) {
      reflection += "Your gratitude moments:\n";
      allGratitudes.forEach((gratitude, index) => {
        reflection += `• ${gratitude}\n`;
      });
      reflection += "\n";
    }

    reflection += "Shared meals are powerful connection moments. When screens are away and presence is intentional, families recharge, laugh, and connect. Keep this practice going—even one shared meal a day transforms family relationships.";

    return reflection;
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Shared Meal Challenge"}
        subtitle="Challenge Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= 2} // At least 2 out of 3 days completed
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Shared Meal Challenge Complete!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've completed 3 days of shared meal practice. Remember: keep mealtime screen-free; food and laughter recharge everyone.
            </p>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Shared meals don't have to be elaborate or long. Even 15-20 minutes of screen-free, present mealtime creates lasting connections. Your consistency in showing up matters more than perfection.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  if (showReflection) {
    return (
      <ParentGameShell
        title={gameData?.title || "Shared Meal Challenge"}
        subtitle="Reflection"
        showGameOver={false}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
      >
        <div className="w-full max-w-5xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-3 text-center">3-Day Challenge Reflection</h3>
              <p className="text-center text-gray-600 mb-6">
                Reflect on your shared meal experience
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {challengeDays.map((day, index) => {
                const sharedCount = getSharedMealsCount(index);
                return (
                  <div key={day.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{sharedCount}</div>
                    <div className="text-sm text-gray-600">Day {day.dayNumber} Meals</div>
                    {sharedCount > 0 && (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto mt-2" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reflection Text */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-indigo-600" />
                Your Reflection
              </h4>
              <div className="bg-white rounded-lg p-6 border border-indigo-100">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {generateReflection()}
                </p>
              </div>
            </div>

            {/* All Gratitude Moments */}
            {(() => {
              const allGratitudes = [];
              challengeDays.forEach((_, dayIndex) => {
                const dayLogs = mealLogs[dayIndex] || {};
                Object.entries(dayLogs).forEach(([mealId, log]) => {
                  if (log.wasShared && log.gratitude) {
                    const meal = mealTypes.find(m => m.id === mealId);
                    allGratitudes.push({
                      day: dayIndex + 1,
                      meal: meal?.label || mealId,
                      gratitude: log.gratitude,
                      icon: meal?.icon || '🍽️'
                    });
                  }
                });
              });

              if (allGratitudes.length > 0) {
                return (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Heart className="w-6 h-6 text-amber-600" />
                      Gratitude Moments
                    </h4>
                    <div className="space-y-3">
                      {allGratitudes.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-amber-100">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{item.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-gray-600 mb-1">
                                Day {item.day} - {item.meal}
                              </div>
                              <div className="text-gray-700">"{item.gratitude}"</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCompleteReflection}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Complete Challenge
            </motion.button>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  const sharedCount = getSharedMealsCount(currentDay);
  const canCompleteDay = sharedCount >= 1;

  return (
    <ParentGameShell
      title={gameData?.title || "Shared Meal Challenge"}
      subtitle={`Day ${currentDay + 1} of 3: ${currentDayData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentDay + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Day Context */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{currentDayData.title}</h3>
            <p className="text-gray-600 mb-2">{currentDayData.description}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
              <p className="text-sm text-blue-800">{currentDayData.context}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800 font-medium">
              <strong>📋 Instructions:</strong> Log your meals below. Mark which meals were shared with family, and add a gratitude moment ("One good thing about today..."). Goal: <strong>{currentDayData.goal}</strong>
            </p>
          </div>

          {/* Meal Logging */}
          <div className="space-y-4 mb-6">
            {mealTypes.map((meal, index) => {
              const mealLog = dayMealLogs[meal.id] || {};
              const MealIcon = meal.lucideIcon;
              
              return (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${meal.bgColor} border-2 ${meal.borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${meal.color} flex items-center justify-center text-white shadow-lg`}>
                      <MealIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800">{meal.label}</h4>
                      <p className="text-sm text-gray-600">{meal.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{meal.icon}</span>
                      {mealLog.wasShared && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* Shared Meal Toggle */}
                  <div className="mb-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mealLog.wasShared || false}
                        onChange={(e) => handleMealLog(meal.id, e.target.checked, mealLog.gratitude)}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 font-medium">
                        This meal was shared with family (screen-free)
                      </span>
                    </label>
                  </div>

                  {/* Gratitude Prompt (only if meal was shared) */}
                  {mealLog.wasShared && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 bg-white rounded-lg p-4 border-2 border-indigo-200"
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-500" />
                        One good thing about today...
                      </label>
                      <textarea
                        value={mealLog.gratitude || ''}
                        onChange={(e) => handleMealLog(meal.id, true, e.target.value)}
                        placeholder="What's one thing you're grateful for today? (e.g., 'Seeing my child laugh', 'Having time together', 'A calm moment')"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[80px] resize-none"
                      />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">Day {currentDay + 1} Progress</h4>
                <p className="text-sm text-gray-600">
                  Shared meals logged: <span className={`font-bold ${canCompleteDay ? 'text-green-600' : 'text-orange-600'}`}>
                    {sharedCount}/1 minimum
                  </span>
                </p>
              </div>
              <div className="text-3xl font-bold text-indigo-600">{sharedCount}</div>
            </div>

            {/* 3-Day Overview */}
            <div className="bg-white rounded-lg p-4 border border-indigo-100">
              <p className="text-sm font-semibold text-gray-700 mb-2">3-Day Challenge Progress:</p>
              <div className="flex gap-2">
                {challengeDays.map((day, index) => {
                  const daySharedCount = getSharedMealsCount(index);
                  const isCompleted = daySharedCount >= 1;
                  const isCurrent = index === currentDay;
                  
                  return (
                    <div
                      key={day.id}
                      className={`flex-1 h-3 rounded-full ${
                        isCompleted
                          ? 'bg-green-500'
                          : isCurrent
                          ? 'bg-indigo-400'
                          : 'bg-gray-300'
                      }`}
                      title={`Day ${day.dayNumber}: ${isCompleted ? 'Complete' : 'In Progress'}`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">
                Total shared meals: {getTotalSharedMeals()} / 3 days
              </p>
            </div>

            {canCompleteDay ? (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  ✓ Great! You've logged at least one shared meal for Day {currentDay + 1}. You can complete this day or add more meals.
                </p>
              </div>
            ) : (
              <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-800">
                  Log at least one shared meal to complete Day {currentDay + 1}.
                </p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDayComplete}
              disabled={!canCompleteDay}
              className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              {currentDay < challengeDays.length - 1 ? 'Complete Day & Continue' : 'Complete Day & View Reflection'}
            </motion.button>
          </div>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>💡 Parent Tip:</strong> {currentDayData.parentTip}
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default SharedMealChallenge;

