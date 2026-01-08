import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { CheckCircle, XCircle, Smartphone, Mail, Coffee, Home, TrendingUp, Eye } from "lucide-react";

const PresenceDetector = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-32";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedDistractions, setSelectedDistractions] = useState({});
  const [showChart, setShowChart] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // All 12 distractions that can steal family time
  const allDistractions = [
    { id: 'phone', label: 'Phone Notifications', icon: '📱', impact: 15, category: 'technology' },
    { id: 'emails', label: 'Work Emails', icon: '📧', impact: 12, category: 'work' },
    { id: 'fatigue', label: 'Fatigue/Exhaustion', icon: '😴', impact: 18, category: 'physical' },
    { id: 'chores', label: 'Household Chores', icon: '🧹', impact: 10, category: 'responsibilities' },
    { id: 'social-media', label: 'Social Media', icon: '📲', impact: 14, category: 'technology' },
    { id: 'worry', label: 'Worry/Anxiety', icon: '😰', impact: 16, category: 'mental' },
    { id: 'tv', label: 'TV/Streaming', icon: '📺', impact: 8, category: 'entertainment' },
    { id: 'work-thoughts', label: 'Work Thoughts', icon: '💼', impact: 13, category: 'work' },
    { id: 'to-do-list', label: 'Mental To-Do Lists', icon: '📝', impact: 11, category: 'mental' },
    { id: 'guilt', label: 'Parent Guilt', icon: '😔', impact: 9, category: 'emotional' },
    { id: 'comparison', label: 'Comparing to Others', icon: '👥', impact: 7, category: 'social' },
    { id: 'perfectionism', label: 'Perfectionism', icon: '✨', impact: 12, category: 'mental' }
  ];

  // Scenarios with different family time situations
  const scenarios = [
    {
      id: 1,
      title: "Dinner Time",
      description: "You're sitting at the dinner table with your family. What are your top 3 distractions right now?",
      context: "It's 6:30 PM. You've just finished cooking, everyone is at the table, but your mind is racing and your phone keeps buzzing.",
      idealDistractions: ['phone', 'work-thoughts', 'chores'], // Common distractions for this scenario
      parentTip: "Even 15 minutes of undivided attention beats hours of distracted time. Put your phone in another room during dinner. Those notifications can wait.",
      explanation: "Dinner time is prime family connection time. When phones, work thoughts, or chores dominate, you're physically present but mentally absent. Your children notice this, even if they don't say it."
    },
    {
      id: 2,
      title: "Bedtime Routine",
      description: "You're helping your child get ready for bed. What distracts you most during this time?",
      context: "It's 8 PM. You're reading a bedtime story, but your mind is on tomorrow's meeting, the dishes in the sink, and the emails you haven't answered.",
      idealDistractions: ['work-thoughts', 'chores', 'to-do-list'],
      parentTip: "Bedtime is sacred. This is when children feel safest and most connected. Let everything else wait. Even 10 minutes of full presence during bedtime stories creates lasting memories.",
      explanation: "Bedtime routines are when children are most vulnerable and open. Distractions during this time can make children feel unimportant. Your undivided attention here builds security and trust."
    },
    {
      id: 3,
      title: "Weekend Morning",
      description: "It's Saturday morning and you're all together. What pulls your attention away?",
      context: "You have the whole day ahead, but you're already thinking about what needs to be done, checking social media, and feeling guilty about not being productive enough.",
      idealDistractions: ['social-media', 'to-do-list', 'guilt'],
      parentTip: "Weekend mornings are for presence, not productivity. Let go of the to-do list for the first hour. Your children will remember the quality time, not the clean house.",
      explanation: "Weekend mornings are opportunities for relaxed connection. When social media, to-do lists, or guilt take over, you miss the spontaneous moments that create family bonds."
    },
    {
      id: 4,
      title: "After School Pickup",
      description: "You're picking up your child from school. What distracts you during this transition?",
      context: "You're in the car, running errands, thinking about dinner, and your phone keeps notifying you about work updates. Your child is trying to tell you about their day.",
      idealDistractions: ['phone', 'chores', 'work-emails'],
      parentTip: "The first 10 minutes after school pickup are crucial. Your child needs to download their day. Put the phone away and listen. This small window of presence prevents bigger emotional disconnects later.",
      explanation: "After school, children need to process their day. When you're distracted by phones, chores, or work, they learn that their experiences don't matter. Full presence in these moments teaches them they're valued."
    },
    {
      id: 5,
      title: "Family Game Night",
      description: "You've planned a family game night. What gets in the way of being fully present?",
      context: "You're playing a board game, but you're tired, thinking about work, and feeling like you should be doing something more 'productive' with your time.",
      idealDistractions: ['fatigue', 'work-thoughts', 'guilt'],
      parentTip: "Family game nights are investments in connection, not wasted time. When you're fully present, even 30 minutes creates more connection than hours of distracted time. Let go of productivity guilt.",
      explanation: "Intentional family activities are where memories are made. When fatigue, work thoughts, or guilt interfere, you miss the joy of the moment. Presence during play teaches children that they're worth your full attention."
    }
  ];

  const currentScenarioData = scenarios[currentScenario];

  // Initialize selections for current scenario
  React.useEffect(() => {
    if (!selectedDistractions[currentScenario]) {
      setSelectedDistractions(prev => ({ ...prev, [currentScenario]: [] }));
    }
  }, [currentScenario]);

  const handleDistractionToggle = (distractionId) => {
    const currentSelections = selectedDistractions[currentScenario] || [];
    
    if (currentSelections.includes(distractionId)) {
      // Deselect
      setSelectedDistractions(prev => ({
        ...prev,
        [currentScenario]: currentSelections.filter(id => id !== distractionId)
      }));
    } else if (currentSelections.length < 3) {
      // Select (max 3)
      setSelectedDistractions(prev => ({
        ...prev,
        [currentScenario]: [...currentSelections, distractionId]
      }));
    }
    setShowChart(false);
  };

  const calculatePresencePercentage = () => {
    const currentSelections = selectedDistractions[currentScenario] || [];
    
    if (currentSelections.length === 0) {
      return 100; // If no distractions selected, assume full presence
    }
    
    // Calculate total impact of selected distractions
    const totalImpact = currentSelections.reduce((sum, id) => {
      const distraction = allDistractions.find(d => d.id === id);
      return sum + (distraction?.impact || 0);
    }, 0);
    
    // Presence percentage = 100 - (total impact / number of selections * adjustment factor)
    // More distractions = lower presence
    const baseReduction = totalImpact / currentSelections.length;
    const presencePercentage = Math.max(0, Math.min(100, 100 - baseReduction));
    
    return Math.round(presencePercentage);
  };

  const getPresenceLevel = (percentage) => {
    if (percentage >= 80) return { level: 'High', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-300', emoji: '😊' };
    if (percentage >= 60) return { level: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300', emoji: '😐' };
    if (percentage >= 40) return { level: 'Low', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-300', emoji: '😔' };
    return { level: 'Very Low', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-300', emoji: '😫' };
  };

  const handleShowChart = () => {
    const currentSelections = selectedDistractions[currentScenario] || [];
    if (currentSelections.length > 0) {
      setShowChart(true);
    }
  };

  const handleNext = () => {
    const presencePercentage = calculatePresencePercentage();
    // Score based on awareness (selecting distractions) and presence level
    // Higher presence = higher score
    if (presencePercentage >= 60) {
      setScore(prev => prev + 1);
    }

    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setShowChart(false);
    } else {
      setShowGameOver(true);
    }
  };

  const currentSelections = selectedDistractions[currentScenario] || [];
  const presencePercentage = calculatePresencePercentage();
  const presenceLevel = getPresenceLevel(presencePercentage);
  const canProceed = currentSelections.length === 3 && showChart;

  return (
    <ParentGameShell
      title={gameData?.title || "Presence Detector"}
      subtitle={`Scenario ${currentScenario + 1} of ${totalLevels}: ${currentScenarioData.title}`}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentScenario + 1}
      allAnswersCorrect={score >= totalLevels * 0.6} // At least 60% presence in most scenarios
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
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800 font-medium">
              <strong>📋 Instructions:</strong> Select your <strong>top 3 distractions</strong> that steal your attention during this family time. Then view your Presence Percentage.
            </p>
          </div>

          {/* Distractions Grid */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Select Your Top 3 Distractions:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {allDistractions.map((distraction, index) => {
                const isSelected = currentSelections.includes(distraction.id);
                const isDisabled = !isSelected && currentSelections.length >= 3;
                
                return (
                  <motion.button
                    key={distraction.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    onClick={() => handleDistractionToggle(distraction.id)}
                    disabled={isDisabled}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-indigo-600 shadow-lg'
                        : isDisabled
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{distraction.icon}</span>
                      {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                    </div>
                    <div className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                      {distraction.label}
                    </div>
                    {isSelected && (
                      <div className="text-xs text-indigo-100 mt-1">
                        Impact: {distraction.impact}%
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Selection Counter */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Selected: <span className="font-bold text-indigo-600">{currentSelections.length}/3</span>
              </p>
            </div>
          </div>

          {/* Presence Percentage Chart */}
          {showChart && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`${presenceLevel.bgColor} border-2 ${presenceLevel.borderColor} rounded-xl p-6 mb-6`}
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-600" />
                  Presence Percentage Analysis
                </h4>
                
                {/* Percentage Display */}
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold mb-2">{presenceLevel.emoji}</div>
                  <div className={`text-5xl font-bold ${presenceLevel.color} mb-2`}>
                    {presencePercentage}%
                  </div>
                  <div className={`text-xl font-semibold ${presenceLevel.color}`}>
                    {presenceLevel.level} Presence
                  </div>
                </div>

                {/* Visual Bar Chart */}
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${presencePercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        presencePercentage >= 80
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : presencePercentage >= 60
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : presencePercentage >= 40
                          ? 'bg-gradient-to-r from-orange-500 to-red-500'
                          : 'bg-gradient-to-r from-red-500 to-rose-600'
                      }`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">
                        {presencePercentage}% Present
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selected Distractions Impact */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h5 className="font-semibold text-gray-700 mb-3">Your Top 3 Distractions:</h5>
                  <div className="space-y-2">
                    {currentSelections.map((id, index) => {
                      const distraction = allDistractions.find(d => d.id === id);
                      return (
                        <div key={id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{distraction?.icon}</span>
                            <span className="text-sm font-medium text-gray-700">{distraction?.label}</span>
                          </div>
                          <span className="text-sm font-bold text-red-600">-{distraction?.impact}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Insight */}
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Insight:</strong> {currentScenarioData.explanation}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShowChart}
              disabled={currentSelections.length !== 3 || showChart}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              View Presence Percentage
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={!canProceed}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Complete Assessment'}
            </motion.button>
          </div>

          {/* Parent Tip */}
          {showChart && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200"
            >
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> {currentScenarioData.parentTip}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default PresenceDetector;

