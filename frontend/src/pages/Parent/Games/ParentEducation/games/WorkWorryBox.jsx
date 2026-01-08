import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Box, Plus, X, CheckCircle, Sparkles, Lock } from "lucide-react";

const WorkWorryBox = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-34";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [worries, setWorries] = useState([]);
  const [newWorry, setNewWorry] = useState('');
  const [worriesInBox, setWorriesInBox] = useState([]);
  const [draggedWorry, setDraggedWorry] = useState(null);
  const [boxAnimating, setBoxAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const audioRef = useRef(null);

  // Scenarios with different work stress situations
  const scenarios = [
    {
      id: 1,
      title: "End of Workday",
      description: "You're leaving the office after a stressful day. Write down your work worries and park them in the box before entering home.",
      context: "You have unfinished tasks, an important meeting tomorrow, and received critical feedback. Your mind is racing with work thoughts as you approach home.",
      prompt: "What work worries are you carrying? Type them one by one.",
      parentTip: "Try this mentally at your doorstep—'Work stays in the box.' Physically visualize placing your work worries in a box before you enter. This mental ritual creates a boundary.",
      explanation: "The physical act of writing worries and placing them in a box helps your brain shift from work mode to family mode. Your mind needs this transition, just like your body needs to change out of work clothes.",
      minWorries: 2
    },
    {
      id: 2,
      title: "Difficult Day",
      description: "You've had a particularly challenging day at work. Capture your worries and release them.",
      context: "A project didn't go well, you had a conflict with a colleague, and you're worried about the impact. These thoughts are following you home.",
      prompt: "What specific work worries are weighing on you?",
      parentTip: "Worries written down and 'boxed' lose their power. Your family doesn't need to carry your work stress. Practice this ritual—it gets easier with time.",
      explanation: "When we physically externalize worries by writing them and putting them away, we're telling our brain: 'These concerns exist, but they don't need to occupy my mind right now.' This creates space for presence.",
      minWorries: 3
    },
    {
      id: 3,
      title: "Monday Anxiety",
      description: "It's Sunday evening and Monday's workload is already on your mind. Park those worries.",
      context: "You're thinking about the week ahead—deadlines, meetings, responsibilities. Work anxiety is creeping into your weekend.",
      prompt: "What work anxieties are you carrying about the upcoming week?",
      parentTip: "Weekends are for recharging and connecting. When work worries invade your weekend, they steal your present moment. Practice boxing them—they'll still be there Monday, but your weekend won't be lost.",
      explanation: "Anxiety about the future keeps us from enjoying the present. By boxing these worries, we acknowledge them without letting them consume our now. Your family deserves your weekend presence.",
      minWorries: 2
    },
    {
      id: 4,
      title: "Critical Deadline",
      description: "You have an important deadline tomorrow. Separate work urgency from family time.",
      context: "You're stressed about tomorrow's deadline. The urgency feels overwhelming, and you're struggling to be present with your family tonight.",
      prompt: "What deadline-related worries can you park for now?",
      parentTip: "Even with urgent deadlines, you can't work 24/7. Boxing your worries doesn't mean ignoring them—it means creating boundaries. You'll be more effective tomorrow if you're rested and connected tonight.",
      explanation: "Work urgency can feel like an emergency, but most work can wait a few hours. Your family connection can't. Boxing worries before family time makes you more effective at both work and parenting.",
      minWorries: 3
    },
    {
      id: 5,
      title: "Mastering the Ritual",
      description: "Practice the worry box ritual. Make it a habit before entering your home each day.",
      context: "This is about creating a sustainable practice—a daily ritual that helps you transition from work mode to family mode.",
      prompt: "What work worries would you normally bring home? Practice boxing them all.",
      parentTip: "The worry box ritual works best when it becomes automatic. Try it physically at first—write worries, visualize boxing them, take a deep breath. Eventually, you can do it mentally at your doorstep. Work stays in the box—home is for presence.",
      explanation: "Rituals create psychological boundaries. When you consistently practice boxing work worries, your brain learns to shift modes. Your family feels the difference—they get the version of you who is fully present, not the version carrying work stress.",
      minWorries: 4
    }
  ];

  const currentScenarioData = scenarios[currentScenario];

  const handleAddWorry = () => {
    if (newWorry.trim()) {
      const worry = {
        id: Date.now(),
        text: newWorry.trim(),
        isInBox: false
      };
      setWorries([...worries, worry]);
      setNewWorry('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddWorry();
    }
  };

  const handleDragStart = (e, worry) => {
    setDraggedWorry(worry);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', worry.id.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    if (draggedWorry) {
      // Play release sound effect (using Web Audio API)
      playReleaseSound();
      
      // Move worry to box
      setWorries(prev => prev.filter(w => w.id !== draggedWorry.id));
      setWorriesInBox(prev => [...prev, draggedWorry]);
      
      // Animate box
      setBoxAnimating(true);
      setTimeout(() => setBoxAnimating(false), 1000);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      setDraggedWorry(null);
    }
  };

  const playReleaseSound = () => {
    try {
      // Create a simple release sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 200; // Start at low frequency
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      // Fallback if audio context not available
      console.log('Audio context not available');
    }
  };

  const handleRemoveWorry = (worryId) => {
    setWorries(prev => prev.filter(w => w.id !== worryId));
  };

  const handleNext = () => {
    const allWorriesInBox = worries.length === 0 && worriesInBox.length >= currentScenarioData.minWorries;
    
    if (allWorriesInBox) {
      if (worriesInBox.length >= currentScenarioData.minWorries) {
        setScore(prev => prev + 1);
      }
      
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setWorries([]);
        setWorriesInBox([]);
        setShowSuccess(false);
      } else {
        setShowGameOver(true);
      }
    }
  };

  const canProceed = worries.length === 0 && worriesInBox.length >= currentScenarioData.minWorries;

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Work Worry Box"}
        subtitle="Practice Complete!"
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
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Work Worry Box Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've practiced parking work tension before entering home. Remember: try this mentally at your doorstep—"Work stays in the box."
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> The worry box ritual works best when it becomes automatic. Practice it physically first—write worries, visualize boxing them, take a deep breath. Eventually, you can do it mentally at your doorstep. Work stays in the box—home is for presence.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Work Worry Box"}
      subtitle={`Scenario ${currentScenario + 1} of ${totalLevels}: ${currentScenarioData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentScenario + 1}
    >
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
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
              <strong>📋 Instructions:</strong> Type your work worries below. Then drag each worry into the box to release it. Box at least <strong>{currentScenarioData.minWorries} worries</strong> to continue.
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentScenarioData.prompt}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newWorry}
                onChange={(e) => setNewWorry(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a work worry here... (e.g., 'Meeting tomorrow makes me anxious')"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddWorry}
                disabled={!newWorry.trim()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </motion.button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Worries List */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Your Work Worries</h4>
              {worries.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <p className="text-gray-400">No worries yet. Add your work worries above.</p>
                </div>
              ) : (
                <div className="space-y-2 min-h-[200px]">
                  {worries.map((worry) => (
                    <motion.div
                      key={worry.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, worry)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      whileDrag={{ scale: 1.1, rotate: 5 }}
                      className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-4 cursor-move hover:shadow-lg transition-all flex items-center justify-between group"
                    >
                      <p className="text-gray-700 font-medium flex-1">{worry.text}</p>
                      <button
                        onClick={() => handleRemoveWorry(worry.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      >
                        <X className="w-5 h-5 text-red-500 hover:text-red-700" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Worry Box */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Worry Box</h4>
              <motion.div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                animate={boxAnimating ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0],
                  boxShadow: [
                    "0 10px 25px rgba(0,0,0,0.1)",
                    "0 20px 40px rgba(99, 102, 241, 0.3)",
                    "0 10px 25px rgba(0,0,0,0.1)"
                  ]
                } : {}}
                transition={{ duration: 0.5 }}
                className={`relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 border-4 border-indigo-400 rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center transition-all ${
                  draggedWorry ? 'border-indigo-600 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200' : ''
                }`}
              >
                {/* Box Icon */}
                <motion.div
                  animate={boxAnimating ? {
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-4"
                >
                  📦
                </motion.div>

                {/* Success Animation */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="bg-green-500 text-white rounded-full p-4">
                        <CheckCircle className="w-12 h-12" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Box Label */}
                <p className="text-lg font-bold text-indigo-800 mb-2">Drop Worries Here</p>
                <p className="text-sm text-indigo-600 text-center">
                  Drag your work worries into this box to release them
                </p>

                {/* Worries in Box */}
                {worriesInBox.length > 0 && (
                  <div className="mt-4 w-full">
                    <div className="bg-white/50 rounded-lg p-3 max-h-32 overflow-y-auto">
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Worries Released: {worriesInBox.length}
                      </p>
                      <div className="space-y-1">
                        {worriesInBox.map((worry) => (
                          <div
                            key={worry.id}
                            className="text-xs text-gray-500 line-through opacity-60"
                          >
                            {worry.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {worriesInBox.length === 0 && draggedWorry && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex items-center gap-2 text-indigo-600"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium">Release to park this worry</span>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Progress and Next Button */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">Progress</h4>
                <p className="text-sm text-gray-600">
                  Worries Boxed: <span className={`font-bold ${worriesInBox.length >= currentScenarioData.minWorries ? 'text-green-600' : 'text-orange-600'}`}>
                    {worriesInBox.length}/{currentScenarioData.minWorries} minimum
                  </span>
                </p>
              </div>
              {canProceed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-green-100 border-2 border-green-300 rounded-full p-3"
                >
                  <Lock className="w-6 h-6 text-green-600" />
                </motion.div>
              )}
            </div>

            {canProceed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  ✓ Great! You've boxed all your worries. Ready to proceed.
                </p>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-orange-800">
                  {worries.length > 0 
                    ? `Box all ${worries.length} remaining ${worries.length === 1 ? 'worry' : 'worries'} to continue.`
                    : `Box at least ${currentScenarioData.minWorries} ${currentScenarioData.minWorries === 1 ? 'worry' : 'worries'} to continue.`
                  }
                </p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={!canProceed}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Complete Practice'}
            </motion.button>
          </div>

          {/* Explanation and Tip */}
          <div className="mt-6 space-y-4">
            <div className="bg-white border-2 border-indigo-200 rounded-xl p-4">
              <p className="text-gray-700 text-sm mb-2">
                <strong>Why This Works:</strong> {currentScenarioData.explanation}
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> {currentScenarioData.parentTip}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default WorkWorryBox;

