import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Calendar, Clock, Save, Bell, Plus, X, UtensilsCrossed, Gamepad2, MessageCircle, Plane } from "lucide-react";

const FamilyTimePlanner = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-33";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentWeek, setCurrentWeek] = useState(0);
  const [plannedTimes, setPlannedTimes] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [planSaved, setPlanSaved] = useState(false);
  const [remindersSet, setRemindersSet] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Activity types with icons
  const activities = [
    { id: 'meals', label: 'Family Meal', icon: '🍽️', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-300', borderColorClass: 'border-orange-300', lucideIcon: UtensilsCrossed },
    { id: 'games', label: 'Game Time', icon: '🎮', color: 'from-purple-500 to-indigo-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-300', borderColorClass: 'border-purple-300', lucideIcon: Gamepad2 },
    { id: 'talk', label: 'Family Talk', icon: '💬', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', borderColorClass: 'border-blue-300', lucideIcon: MessageCircle },
    { id: 'outing', label: 'Family Outing', icon: '🎢', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', borderColor: 'border-green-300', borderColorClass: 'border-green-300', lucideIcon: Plane }
  ];

  // Weekly scenarios with different scheduling challenges
  const weeks = [
    {
      id: 1,
      title: "Busy Work Week",
      description: "Plan family time around a demanding work schedule. Schedule at least 3 quality family moments this week.",
      context: "You have meetings, deadlines, and work commitments throughout the week. Finding time for family feels challenging, but it's crucial.",
      days: ['Monday', 'Wednesday', 'Friday'],
      parentTip: "Protect these times like meetings—nothing is more productive than presence. Even 30 minutes of planned family time creates connection that hours of distracted time cannot.",
      challenge: "Plan around work commitments while ensuring family moments happen regularly."
    },
    {
      id: 2,
      title: "School Activities Week",
      description: "Balance your child's school activities with intentional family time. Schedule meaningful moments.",
      context: "Your child has sports practice, homework, and school projects. It's easy to let family time slip in a busy schedule.",
      days: ['Tuesday', 'Thursday', 'Saturday'],
      parentTip: "Schedule family time first, then work around it. When it's in the calendar, it's protected. Even 20 minutes of undivided attention beats a whole evening of being in the same room but distracted.",
      challenge: "Create family time despite a packed schedule."
    },
    {
      id: 3,
      title: "Holiday Preparation Week",
      description: "Plan family moments during a busy holiday preparation week. Don't let logistics overshadow connection.",
      context: "You're preparing for a holiday, shopping, cooking, and organizing. It's easy to get caught up in tasks and miss family moments.",
      days: ['Monday', 'Wednesday', 'Sunday'],
      parentTip: "Include children in holiday preparations as family time. Baking together, decorating together—these are the moments children remember, not the perfect decorations.",
      challenge: "Transform holiday tasks into family connection time."
    },
    {
      id: 4,
      title: "Weekend Planning",
      description: "Plan a weekend full of intentional family moments. Make the weekend count.",
      context: "Weekends can slip away with chores, errands, and recovery from the week. Plan specific family activities.",
      days: ['Saturday', 'Sunday','Monday'],
      parentTip: "Weekend planning prevents the 'Where did the weekend go?' feeling. Even one planned family outing plus regular meals together creates lasting memories.",
      challenge: "Maximize weekend time for family connection."
    },
    {
      id: 5,
      title: "Maintaining Consistency",
      description: "Create a sustainable weekly family time plan. Build habits that last.",
      context: "This is about creating a rhythm—regular family times that become part of your routine, not special occasions.",
      days: ['Tuesday', 'Thursday', 'Sunday'],
      parentTip: "Consistency beats perfection. Three 30-minute family times per week are better than one perfect day. Protect these times like work meetings—they're non-negotiable.",
      challenge: "Build a sustainable pattern of family connection."
    }
  ];

  const currentWeekData = weeks[currentWeek];
  const weekPlannedTimes = plannedTimes[currentWeek] || {};

  // Time slots for selection
  const timeSlots = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
  ];

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setShowAddModal(true);
    setSelectedTime('');
    setSelectedActivity(null);
  };

  const handleAddFamilyTime = () => {
    if (!selectedDay || !selectedTime || !selectedActivity) {
      return;
    }

    const newTime = {
      id: Date.now(),
      day: selectedDay,
      time: selectedTime,
      activity: selectedActivity
    };

    setPlannedTimes(prev => ({
      ...prev,
      [currentWeek]: {
        ...(prev[currentWeek] || {}),
        [selectedDay]: [
          ...((prev[currentWeek] || {})[selectedDay] || []),
          newTime
        ]
      }
    }));

    setShowAddModal(false);
    setSelectedDay(null);
    setSelectedTime('');
    setSelectedActivity(null);
  };

  const handleRemoveFamilyTime = (day, timeId) => {
    setPlannedTimes(prev => ({
      ...prev,
      [currentWeek]: {
        ...prev[currentWeek],
        [day]: (prev[currentWeek][day] || []).filter(t => t.id !== timeId)
      }
    }));
  };

  const getTotalPlannedTimes = () => {
    const weekTimes = weekPlannedTimes || {};
    let total = 0;
    Object.values(weekTimes).forEach(dayTimes => {
      total += (dayTimes || []).length;
    });
    return total;
  };

  const handleSavePlan = () => {
    const total = getTotalPlannedTimes();
    if (total >= 3) {
      setPlanSaved(true);
      // Award 1 point for completing this scenario
      setScore(prev => prev + 1);
    }
  };

  const handleSetReminders = () => {
    if (planSaved) {
      setRemindersSet(true);
      setTimeout(() => {
        if (currentWeek < weeks.length - 1) {
          setCurrentWeek(currentWeek + 1);
          setPlanSaved(false);
          setRemindersSet(false);
        } else {
          setShowGameOver(true);
        }
      }, 2000);
    }
  };

  const getActivityDetails = (activityId) => {
    return activities.find(a => a.id === activityId) || activities[0];
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Family Time Planner"}
        subtitle="Planning Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= totalLevels} // Complete all scenarios
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Family Time Plans Complete!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've planned quality family moments across multiple weeks. Remember: protect these times like meetings—nothing is more productive than presence.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Consistency beats perfection. Three 30-minute family times per week are better than one perfect day. When it's in your calendar, it's protected. Nothing is more productive than presence.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Family Time Planner"}
      subtitle={`Week ${currentWeek + 1} of ${totalLevels}: ${currentWeekData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentWeek + 1}
    >
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Week Context */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{currentWeekData.title}</h3>
            <p className="text-gray-600 mb-2">{currentWeekData.description}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
              <p className="text-sm text-blue-800">{currentWeekData.context}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800 font-medium">
              <strong>📋 Instructions:</strong> Click on any day to add family time. Plan at least <strong>3 family moments</strong> this week. Then save your plan and set reminders.
            </p>
          </div>

          {/* Calendar View */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Weekly Calendar
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentWeekData.days.map((day, index) => {
                const dayTimes = weekPlannedTimes[day] || [];
                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-2 border-gray-200 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white hover:border-indigo-400 transition-all cursor-pointer"
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="font-bold text-gray-800 mb-3 flex items-center justify-between">
                      <span>{day}</span>
                      <Plus className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="space-y-2 min-h-[100px]">
                      {dayTimes.length > 0 ? (
                        dayTimes.map((time) => {
                          const activity = getActivityDetails(time.activity);
                          const ActivityIcon = activity.lucideIcon;
                          return (
                            <div
                              key={time.id}
                              className={`${activity.bgColor} border ${activity.borderColorClass} rounded-lg p-2 flex items-center justify-between group`}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-xl">{activity.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium text-gray-700 truncate">{time.time}</div>
                                  <div className="text-xs text-gray-600 truncate">{activity.label}</div>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFamilyTime(day, time.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4 text-red-500 hover:text-red-700" />
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-xs text-gray-400 text-center py-4">
                          Click to add family time
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Summary and Actions */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">Planned Family Times</h4>
                <p className="text-sm text-gray-600">
                  Total: <span className={`font-bold ${getTotalPlannedTimes() >= 3 ? 'text-green-600' : 'text-orange-600'}`}>
                    {getTotalPlannedTimes()}/3 minimum
                  </span>
                </p>
              </div>
              <div className="text-3xl font-bold text-indigo-600">{getTotalPlannedTimes()}</div>
            </div>

            {getTotalPlannedTimes() >= 3 && !planSaved && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  ✓ Great! You've planned at least 3 family times. Save your plan to continue.
                </p>
              </div>
            )}

            {getTotalPlannedTimes() < 3 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-orange-800">
                  Plan at least 3 family times this week to continue.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSavePlan}
                disabled={getTotalPlannedTimes() < 3 || planSaved}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {planSaved ? 'Plan Saved!' : 'Save Plan'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSetReminders}
                disabled={!planSaved || remindersSet}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Bell className="w-5 h-5" />
                {remindersSet ? 'Reminders Set!' : 'Set Reminders'}
              </motion.button>
            </div>

            {remindersSet && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-green-100 border-2 border-green-300 rounded-lg p-4"
              >
                <p className="text-sm text-green-800 font-medium text-center">
                  ✓ Reminders set! Your family time is now protected in your calendar.
                </p>
              </motion.div>
            )}
          </div>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>💡 Parent Tip:</strong> {currentWeekData.parentTip}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Add Family Time Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Add Family Time</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day: <span className="font-bold text-indigo-600">{selectedDay}</span>
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {activities.map(activity => {
                    const ActivityIcon = activity.lucideIcon;
                    return (
                      <button
                        key={activity.id}
                        onClick={() => setSelectedActivity(activity.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedActivity === activity.id
                            ? `bg-gradient-to-br ${activity.color} text-white border-transparent shadow-lg`
                            : `${activity.bgColor} ${activity.borderColorClass} text-gray-700 hover:shadow-md`
                        }`}
                      >
                        <div className="text-3xl mb-2">{activity.icon}</div>
                        <div className="text-sm font-medium">{activity.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddFamilyTime}
                disabled={!selectedTime || !selectedActivity}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Calendar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ParentGameShell>
  );
};

export default FamilyTimePlanner;

