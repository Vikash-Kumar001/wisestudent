import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Play, Wind, Sparkles, Heart, CheckCircle } from "lucide-react";

const BreathingWithAwareness = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-44";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentSession, setCurrentSession] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathCycle, setBreathCycle] = useState(0); // 0-9 (10 cycles total)
  const [breathPhase, setBreathPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cycleTimes, setCycleTimes] = useState([]); // Track consistency
  const [consistencyScore, setConsistencyScore] = useState(0);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const timerRef = useRef(null);
  const cycleStartTimeRef = useRef(null);

  // Breathing phases timing (consistent 4-2-6 pattern)
  const breathingTimings = {
    inhale: 4,   // 4 seconds inhale
    hold: 2,     // 2 seconds hold
    exhale: 6    // 6 seconds exhale
  };

  const totalCycleTime = breathingTimings.inhale + breathingTimings.hold + breathingTimings.exhale; // 12 seconds per cycle

  // Session contexts
  const sessions = [
    {
      id: 1,
      title: "Morning Clarity",
      description: "Start your day with 10 cycles of mindful breathing. Feel every breath fully to restore balance and clarity.",
      context: "Before the day begins, take time to breathe with full awareness. This sets the tone for calm presence throughout your day.",
      parentTip: "Teach your children this breathing before tests or stressful talks. The 10-cycle pattern helps them find calm in challenging moments."
    },
    {
      id: 2,
      title: "Pre-Conversation Calm",
      description: "Prepare for important conversations with 10 cycles of awareness breathing. Feel the breath restoring your clarity.",
      context: "Before difficult conversations with your child or partner, these 10 cycles help you arrive with calm, clear presence.",
      parentTip: "When your child is anxious about a test or talk, guide them through these 10 breaths. It teaches them how to find calm through awareness."
    },
    {
      id: 3,
      title: "Afternoon Balance",
      description: "Restore balance in the middle of your day with 10 cycles of full-breath awareness.",
      context: "Midday can feel chaotic. These 10 cycles help you reconnect with your breath and restore inner balance.",
      parentTip: "Children feel stress before tests or presentations too. Teaching them these 10 cycles gives them a tool they can use anywhere—before tests, talks, or any stressful moment."
    },
    {
      id: 4,
      title: "Evening Restoration",
      description: "Release the day's tension with 10 cycles of breathing with awareness. Feel every breath fully.",
      context: "Evening is a time to let go and restore. These 10 cycles help you transition from doing mode to being mode.",
      parentTip: "Practice these 10 cycles yourself, then teach your child. When they see you use it, they'll want to learn. Share it before their tests or stressful moments."
    },
    {
      id: 5,
      title: "Pre-Sleep Deep Calm",
      description: "Prepare for restful sleep with 10 cycles of deep, aware breathing. Feel every breath restoring your peace.",
      context: "Before sleep, these 10 cycles help your body and mind find deep calm. This is perfect for teaching your child too.",
      parentTip: "Use these 10 cycles before bed, and teach them to your child. Before tests, before talks, before sleep—this breathing pattern becomes their anchor for calm."
    }
  ];

  const currentSessionData = sessions[currentSession];

  // Start the breathing exercise
  const startBreathing = () => {
    setIsPlaying(true);
    setBreathCycle(0);
    setBreathPhase('inhale');
    setTimeRemaining(breathingTimings.inhale);
    setCycleTimes([]);
    cycleStartTimeRef.current = Date.now();
    speakPrompt("Breathe in. Feel every breath fully.");
  };

  // Handle breathing cycle
  useEffect(() => {
    if (!isPlaying) return;

    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else {
      // Move to next phase
      if (breathPhase === 'inhale') {
        setBreathPhase('hold');
        setTimeRemaining(breathingTimings.hold);
        speakPrompt("Hold. Feel the pause.");
      } else if (breathPhase === 'hold') {
        setBreathPhase('exhale');
        setTimeRemaining(breathingTimings.exhale);
        speakPrompt("Breathe out. Release fully.");
      } else if (breathPhase === 'exhale') {
        // Cycle complete
        const cycleTime = Date.now() - cycleStartTimeRef.current;
        setCycleTimes(prev => [...prev, cycleTime]);
        cycleStartTimeRef.current = Date.now();
        
        if (breathCycle < 9) {
          // Start next cycle
          setBreathCycle(prev => prev + 1);
          setBreathPhase('inhale');
          setTimeRemaining(breathingTimings.inhale);
          speakPrompt(`Cycle ${breathCycle + 2} of 10. Breathe in.`);
        } else {
          // All 10 cycles complete
          setIsPlaying(false);
          setBreathPhase('idle');
          calculateConsistency();
          speakPrompt("All 10 cycles complete. Well done.");
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining, breathPhase, breathCycle]);

  // Calculate consistency score
  const calculateConsistency = () => {
    if (cycleTimes.length < 10) return;
    
    // Calculate average cycle time
    const avgCycleTime = cycleTimes.reduce((sum, time) => sum + time, 0) / cycleTimes.length;
    const expectedCycleTime = totalCycleTime * 1000; // Convert to milliseconds
    
    // Calculate variance (lower variance = more consistent)
    const variance = cycleTimes.reduce((sum, time) => {
      const diff = Math.abs(time - avgCycleTime);
      return sum + (diff * diff);
    }, 0) / cycleTimes.length;
    
    // Score based on how close to expected time and how consistent
    const timeAccuracy = 1 - Math.min(Math.abs(avgCycleTime - expectedCycleTime) / expectedCycleTime, 1);
    const consistency = 1 - Math.min(variance / (expectedCycleTime * expectedCycleTime), 1);
    
    const finalScore = Math.round((timeAccuracy * 0.5 + consistency * 0.5) * 100);
    setConsistencyScore(finalScore);
    setScore(prev => prev + Math.min(Math.floor(finalScore / 20), 5)); // Up to 5 points based on consistency
  };

  // Text-to-speech for guided audio
  const speakPrompt = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Calculate orb size based on breath phase
  const getOrbSize = () => {
    if (breathPhase === 'inhale') {
      const progress = 1 - (timeRemaining / breathingTimings.inhale);
      return 100 + (progress * 150); // Grows from 100px to 250px
    } else if (breathPhase === 'hold') {
      return 250; // Maintains full size
    } else if (breathPhase === 'exhale') {
      const progress = 1 - (timeRemaining / breathingTimings.exhale);
      return 250 - (progress * 150); // Shrinks from 250px to 100px
    }
    return 150; // Default/resting size
  };

  // Get orb color based on phase
  const getOrbColor = () => {
    if (breathPhase === 'inhale') {
      return 'from-blue-400 via-cyan-400 to-teal-400';
    } else if (breathPhase === 'hold') {
      return 'from-teal-400 via-emerald-400 to-green-400';
    } else if (breathPhase === 'exhale') {
      return 'from-green-400 via-emerald-400 to-teal-400';
    }
    return 'from-indigo-400 via-purple-400 to-pink-400';
  };

  // Get phase instruction text
  const getPhaseText = () => {
    if (breathPhase === 'inhale') {
      return 'Breathe In';
    } else if (breathPhase === 'hold') {
      return 'Hold';
    } else if (breathPhase === 'exhale') {
      return 'Breathe Out';
    }
    return 'Ready';
  };

  const progress = ((currentSession + 1) / totalLevels) * 100;
  const allCyclesComplete = breathCycle === 9 && breathPhase === 'idle' && !isPlaying;

  // Handle next session
  const handleNext = () => {
    if (currentSession < sessions.length - 1) {
      setCurrentSession(prev => prev + 1);
      setBreathCycle(0);
      setIsPlaying(false);
      setBreathPhase('idle');
      setTimeRemaining(0);
      setCycleTimes([]);
      setConsistencyScore(0);
    } else {
      setShowGameOver(true);
    }
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Breathing with Awareness"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= totalLevels * 3}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🌬️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Breathing with Awareness Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've learned to feel every breath fully to restore balance and clarity. Remember: teach your children this breathing before tests or stressful talks.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Teach your children this breathing before tests or stressful talks. The 10-cycle pattern helps them find calm in challenging moments. When they see you practice it, they'll want to learn. Share this tool—inhale, hold, exhale—and watch them use it to restore balance and clarity when they need it most.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Breathing with Awareness"}
      subtitle={`Session ${currentSession + 1} of ${totalLevels}: ${currentSessionData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentSession + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          key={currentSession}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Session {currentSession + 1} of {totalLevels}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Session context */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{currentSessionData.title}</h3>
            <p className="text-gray-700 mb-2">{currentSessionData.description}</p>
            <p className="text-sm text-gray-600 italic mb-3">{currentSessionData.context}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> {currentSessionData.parentTip}
              </p>
            </div>
          </div>

          {!isPlaying && !allCyclesComplete && (
            /* Start screen */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">10 Cycles of Breathing with Awareness</h3>
                <p className="text-gray-700 mb-6">
                  Follow the glowing orb and guided audio for 10 complete breath cycles. Feel every breath fully—inhale for 4 seconds, hold for 2 seconds, exhale for 6 seconds.
                </p>
                <div className="flex items-center justify-center gap-6 mb-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Wind className="w-5 h-5" />
                    <span>10 cycles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Guided audio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span>Feel every breath</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startBreathing}
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mx-auto"
                >
                  <Play className="w-6 h-6" />
                  Start 10 Cycles
                </motion.button>
              </div>
            </div>
          )}

          {isPlaying && (
            /* Breathing exercise in progress */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-blue-300">
                {/* Cycle counter */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    Cycle {breathCycle + 1} of 10
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((breathCycle + 1) / 10) * 100}%` }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Glowing breathing orb */}
                <div className="flex items-center justify-center mb-6">
                  <motion.div
                    animate={{
                      width: `${getOrbSize()}px`,
                      height: `${getOrbSize()}px`,
                    }}
                    transition={{
                      duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 2 : 6,
                      ease: "easeInOut"
                    }}
                    className={`rounded-full bg-gradient-to-br ${getOrbColor()} shadow-2xl flex items-center justify-center relative`}
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
                      boxShadow: '0 0 30px rgba(59, 130, 246, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <Wind className="w-16 h-16 text-white" />
                    {/* Pulsing glow effect */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 rounded-full bg-white opacity-30"
                    />
                  </motion.div>
                </div>

                {/* Phase instruction */}
                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-800 mb-2">{getPhaseText()}</p>
                  {timeRemaining > 0 && (
                    <p className="text-lg text-gray-600">{timeRemaining} seconds</p>
                  )}
                </div>

                {/* Instructions */}
                <p className="text-sm text-gray-600 italic">
                  Follow the rhythm. Feel every breath fully. Let it restore your balance and clarity.
                </p>
              </div>
            </div>
          )}

          {allCyclesComplete && (
            /* Completion screen with consistency score */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">All 10 Cycles Complete!</h3>
                <p className="text-gray-700 mb-6">
                  Excellent! You've completed 10 cycles of breathing with awareness.
                </p>
                
                {/* Consistency score */}
                {consistencyScore > 0 && (
                  <div className="bg-white rounded-lg p-6 mb-6 max-w-md mx-auto">
                    <h4 className="font-semibold text-gray-800 mb-2">Consistency Score</h4>
                    <div className="text-4xl font-bold text-indigo-600 mb-2">{consistencyScore}%</div>
                    <p className="text-sm text-gray-600">
                      {consistencyScore >= 80
                        ? "Excellent consistency! You maintained steady rhythm throughout."
                        : consistencyScore >= 60
                        ? "Good consistency! You followed the breathing pattern well."
                        : "Keep practicing! The more you practice, the more consistent you'll become."}
                    </p>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-800">
                    <strong>💡 Parent Tip:</strong> {currentSessionData.parentTip}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {currentSession < sessions.length - 1 ? 'Next Session' : 'Complete Practice'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default BreathingWithAwareness;

