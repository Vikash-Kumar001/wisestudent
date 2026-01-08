import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Clock, Save, Bell, CheckCircle, AlertCircle, Briefcase, Home, PhoneOff, Calendar } from "lucide-react";

const WorkFamilyBoundaryPlanner = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-39";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [boundaries, setBoundaries] = useState({});
  const [planSaved, setPlanSaved] = useState(false);
  const [remindersSet, setRemindersSet] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Boundary scenarios with different work-life contexts
  const scenarios = [
    {
      id: 1,
      title: "Standard Work Week",
      description: "Set boundaries for a typical Monday-Friday work week with regular hours.",
      context: "You work 9 AM to 5 PM in an office. It's easy to let work bleed into evening time. Define clear boundaries to protect family time.",
      challenge: "Create boundaries that allow you to fully transition from work mode to family mode.",
      parentTip: "Treat boundaries as family commitments, not restrictions. When you set 'Work Ends At 5 PM,' you're committing to your family, not restricting your work.",
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 2,
      title: "Remote Work Setup",
      description: "Define boundaries when working from home. Physical boundaries are harder when home and office are the same space.",
      context: "Working from home makes it harder to separate work and family life. Emails at dinner, calls during playtime—boundaries are crucial.",
      challenge: "Set time-based boundaries and physical boundaries (like closing office door) to protect family time.",
      parentTip: "Boundaries aren't restrictions—they're commitments to your family. When work ends at 6 PM, that's a promise to your children that you're fully present.",
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 3,
      title: "Flexible Schedule",
      description: "Plan boundaries around a flexible or irregular work schedule.",
      context: "Your work hours vary. Some days start early, some end late. Setting consistent boundaries helps create stability for your family.",
      challenge: "Create adaptable boundaries that work with varying schedules while protecting core family time.",
      parentTip: "Even with flexible schedules, set non-negotiable family boundaries. For example, 'No work calls after 7 PM' regardless of when work starts.",
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    {
      id: 4,
      title: "High-Stress Project Period",
      description: "Maintain boundaries during a busy, high-pressure work period.",
      context: "You have a major project deadline. Work feels urgent, and it's tempting to extend hours and take calls anytime. But family still needs you.",
      challenge: "Protect family boundaries even when work pressure is high. Boundaries matter most during stress.",
      parentTip: "During high-stress periods, boundaries become even more important. They're not luxuries—they're essentials that protect your well-being and family connection.",
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 5,
      title: "Sustainable Long-Term Boundaries",
      description: "Create boundaries you can maintain consistently over time.",
      context: "The goal isn't perfect boundaries—it's sustainable ones. Create boundaries that you can honor consistently, not just during good weeks.",
      challenge: "Design boundaries that work for your real life and can become permanent habits.",
      parentTip: "Boundaries are family commitments. When you honor them, you teach your children that they matter. When you break them, you teach them that work comes first. Make boundaries non-negotiable family appointments.",
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  ];

  // Time options for work end and family start
  const timeOptions = [
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'
  ];

  // Time options for no calls after
  const noCallAfterOptions = [
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
  ];

  const currentScenarioData = scenarios[currentScenario];
  const currentBoundaries = boundaries[currentScenario] || {
    workEndsAt: '',
    noCallsAfter: '',
    familyStartsAt: ''
  };

  const handleBoundaryChange = (field, value) => {
    setBoundaries(prev => ({
      ...prev,
      [currentScenario]: {
        ...prev[currentScenario],
        [field]: value
      }
    }));
    setPlanSaved(false);
    setRemindersSet(false);
  };

  const validateBoundaries = () => {
    const { workEndsAt, noCallsAfter, familyStartsAt } = currentBoundaries;
    
    if (!workEndsAt || !noCallsAfter || !familyStartsAt) {
      return { valid: false, message: "Please fill in all boundary fields." };
    }

    // Convert times to comparable format (minutes since midnight)
    const timeToMinutes = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = hours * 60 + minutes;
      if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
      if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60;
      return totalMinutes;
    };

    const workEndMinutes = timeToMinutes(workEndsAt);
    const noCallsMinutes = timeToMinutes(noCallsAfter);
    const familyStartMinutes = timeToMinutes(familyStartsAt);

    // Work should end before or at family start time
    if (workEndMinutes > familyStartMinutes) {
      return { valid: false, message: "Work end time should be before or equal to family start time." };
    }

    // No calls after should be at or after work ends
    if (noCallsMinutes < workEndMinutes) {
      return { valid: false, message: "'No Calls After' should be at or after work end time." };
    }

    return { valid: true, message: "" };
  };

  const handleSaveBoundaries = () => {
    const validation = validateBoundaries();
    if (validation.valid) {
      setPlanSaved(true);
      setScore(prev => prev + 1);
    } else {
      alert(validation.message);
    }
  };

  const handleSetReminders = () => {
    if (planSaved) {
      setRemindersSet(true);
      setTimeout(() => {
        if (currentScenario < scenarios.length - 1) {
          setCurrentScenario(currentScenario + 1);
          setPlanSaved(false);
          setRemindersSet(false);
          setBoundaries(prev => ({
            ...prev,
            [currentScenario + 1]: {
              workEndsAt: '',
              noCallsAfter: '',
              familyStartsAt: ''
            }
          }));
        } else {
          setShowGameOver(true);
        }
      }, 2000);
    }
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Work–Family Boundary Planner"}
        subtitle="Boundary Planning Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= totalLevels * 0.8}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Boundaries Set Successfully!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've defined clear boundaries between work and family life. Remember: treat boundaries as family commitments, not restrictions.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Boundaries are family commitments. When you honor them, you teach your children that they matter. When you set "Work Ends At 5 PM," you're committing to your family, not restricting your work. Make boundaries non-negotiable family appointments that you protect like important meetings.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Work–Family Boundary Planner"}
      subtitle={`Scenario ${currentScenario + 1} of ${totalLevels}: ${currentScenarioData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentScenario + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Scenario Context */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{currentScenarioData.title}</h3>
            <p className="text-gray-600 mb-2">{currentScenarioData.description}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
              <p className="text-sm text-blue-800">{currentScenarioData.context}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
              <p className="text-sm text-amber-800">
                <strong>Challenge:</strong> {currentScenarioData.challenge}
              </p>
            </div>
          </div>

          {!planSaved ? (
            /* Boundary Planning Form */
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                  Define Your Boundaries
                </h4>
                
                <div className="space-y-6">
                  {/* Work Ends At */}
                  <div className="bg-white rounded-lg p-5 border-2 border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                      Work Ends At
                    </label>
                    <p className="text-xs text-gray-500 mb-3">The official time your workday ends each day</p>
                    <select
                      value={currentBoundaries.workEndsAt}
                      onChange={(e) => handleBoundaryChange('workEndsAt', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg font-medium"
                    >
                      <option value="">Select work end time</option>
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    {currentBoundaries.workEndsAt && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 flex items-center gap-2 text-sm text-green-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Work will end at {currentBoundaries.workEndsAt} each day</span>
                      </motion.div>
                    )}
                  </div>

                  {/* No Calls After */}
                  <div className="bg-white rounded-lg p-5 border-2 border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <PhoneOff className="w-5 h-5 text-red-600" />
                      No Calls After
                    </label>
                    <p className="text-xs text-gray-500 mb-3">The latest time you'll accept work calls or respond to work messages</p>
                    <select
                      value={currentBoundaries.noCallsAfter}
                      onChange={(e) => handleBoundaryChange('noCallsAfter', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg font-medium"
                    >
                      <option value="">Select no-call-after time</option>
                      {noCallAfterOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    {currentBoundaries.noCallsAfter && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 flex items-center gap-2 text-sm text-green-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>No work calls after {currentBoundaries.noCallsAfter}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Family Start Time */}
                  <div className="bg-white rounded-lg p-5 border-2 border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Home className="w-5 h-5 text-green-600" />
                      Family Start Time
                    </label>
                    <p className="text-xs text-gray-500 mb-3">The time you fully transition into family mode—present, available, and engaged</p>
                    <select
                      value={currentBoundaries.familyStartsAt}
                      onChange={(e) => handleBoundaryChange('familyStartsAt', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg font-medium"
                    >
                      <option value="">Select family start time</option>
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    {currentBoundaries.familyStartsAt && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 flex items-center gap-2 text-sm text-green-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Family time begins at {currentBoundaries.familyStartsAt}</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Boundary Summary */}
                {currentBoundaries.workEndsAt && currentBoundaries.noCallsAfter && currentBoundaries.familyStartsAt && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-300"
                  >
                    <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      Your Boundary Summary
                    </h5>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>• Work ends at <strong>{currentBoundaries.workEndsAt}</strong></p>
                      <p>• No work calls after <strong>{currentBoundaries.noCallsAfter}</strong></p>
                      <p>• Family time starts at <strong>{currentBoundaries.familyStartsAt}</strong></p>
                    </div>
                  </motion.div>
                )}

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveBoundaries}
                  disabled={!currentBoundaries.workEndsAt || !currentBoundaries.noCallsAfter || !currentBoundaries.familyStartsAt}
                  className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Boundaries
                </motion.button>
              </div>
            </div>
          ) : !remindersSet ? (
            /* Reminder Setup */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Boundaries Saved!
                </h4>
                <div className="bg-white rounded-lg p-5 mb-6">
                  <h5 className="font-semibold text-gray-800 mb-3">Your Boundaries:</h5>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      <span>Work Ends At: <strong>{currentBoundaries.workEndsAt}</strong></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <PhoneOff className="w-4 h-4 text-red-600" />
                      <span>No Calls After: <strong>{currentBoundaries.noCallsAfter}</strong></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-green-600" />
                      <span>Family Start Time: <strong>{currentBoundaries.familyStartsAt}</strong></span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    Daily Reminders
                  </h5>
                  <p className="text-sm text-gray-700 mb-3">
                    Set up daily reminders to honor your boundaries:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Reminder at <strong>{currentBoundaries.workEndsAt}</strong>: "Work ends now. Transition to family mode."</li>
                    <li>Reminder at <strong>{currentBoundaries.noCallsAfter}</strong>: "No work calls after this time."</li>
                    <li>Reminder at <strong>{currentBoundaries.familyStartsAt}</strong>: "Family time begins. Be fully present."</li>
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSetReminders}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Bell className="w-5 h-5" />
                  Set Daily Reminders
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Reminders Set Confirmation */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  ✓
                </motion.div>
                <h4 className="text-2xl font-semibold text-gray-800 mb-3">Reminders Set!</h4>
                <p className="text-gray-600 mb-4">
                  You'll receive daily reminders to honor your boundaries. Treat these boundaries as family commitments, not restrictions.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-amber-800">
                    <strong>💡 Parent Tip:</strong> {currentScenarioData.parentTip}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default WorkFamilyBoundaryPlanner;

