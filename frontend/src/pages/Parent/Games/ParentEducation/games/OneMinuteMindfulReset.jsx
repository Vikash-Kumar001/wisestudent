import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Play, Wind, Clock, Heart, Sparkles } from "lucide-react";

const OneMinuteMindfulReset = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-42";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds
  const [breathPhase, setBreathPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [breathCycleTime, setBreathCycleTime] = useState(0);
  const [calmRatings, setCalmRatings] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  const timerRef = useRef(null);
  const breathTimerRef = useRef(null);

  // Breathing phases timing (inhale-hold-exhale pattern)
  const breathingTimings = {
    inhale: 4,   // 4 seconds inhale
    hold: 2,     // 2 seconds hold
    exhale: 6    // 6 seconds exhale
  };

  const totalBreathCycle = breathingTimings.inhale + breathingTimings.hold + breathingTimings.exhale; // 12 seconds per cycle

  // Round contexts for different scenarios
  const roundContexts = [
    {
      title: "Before Entering Child's Room",
      description: "Take a one-minute mindful reset before entering your child's room or workspace. This helps you arrive with calm presence.",
      tip: "Try one mindful minute before entering your child's room or workspace. Your calm energy will be felt immediately."
    },
    {
      title: "Pre-Conversation Reset",
      description: "Reset your mind and body before an important conversation with your child. One minute of breathing prepares you to listen fully.",
      tip: "Before difficult conversations, take this minute. It helps you listen with your whole being, not just your ears."
    },
    {
      title: "After-Work Transition",
      description: "Transition from work mode to family mode with this mindful reset. Let go of work stress before connecting with your child.",
      tip: "Use this reset as a bridge between work and family. One minute to let work go, one minute to arrive fully present."
    },
    {
      title: "Midday Reconnection",
      description: "Reconnect with yourself and prepare for afternoon activities. One minute to ground yourself in the present moment.",
      tip: "Even in the middle of a busy day, one minute of mindful breathing can reset your entire nervous system."
    },
    {
      title: "Pre-Bedtime Calm",
      description: "End your day with a one-minute mindful reset. Prepare your body and mind for restful sleep and connection.",
      tip: "Use this before bedtime to transition from doing mode to being mode. One minute can shift your entire evening energy."
    }
  ];

  const currentContext = roundContexts[currentRound];

  // Start the 60-second breathing exercise
  const startExercise = () => {
    setIsPlaying(true);
    setTimeRemaining(60);
    setBreathPhase('inhale');
    setBreathCycleTime(breathingTimings.inhale);
    setExerciseCompleted(false);
  };

  // Handle main 60-second timer
  useEffect(() => {
    if (!isPlaying) return;

    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Timer completed
      setIsPlaying(false);
      setBreathPhase('idle');
      setBreathCycleTime(0);
      setExerciseCompleted(true);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  // Handle breathing cycle (repeats every 12 seconds)
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) return;

    if (breathCycleTime > 0) {
      breathTimerRef.current = setTimeout(() => {
        setBreathCycleTime(breathCycleTime - 1);
      }, 1000);
    } else {
      // Move to next breath phase
      if (breathPhase === 'inhale') {
        setBreathPhase('hold');
        setBreathCycleTime(breathingTimings.hold);
      } else if (breathPhase === 'hold') {
        setBreathPhase('exhale');
        setBreathCycleTime(breathingTimings.exhale);
      } else if (breathPhase === 'exhale') {
        // Start new cycle (inhale)
        setBreathPhase('inhale');
        setBreathCycleTime(breathingTimings.inhale);
      }
    }

    return () => {
      if (breathTimerRef.current) {
        clearTimeout(breathTimerRef.current);
      }
    };
  }, [isPlaying, breathPhase, breathCycleTime, timeRemaining]);

  // Handle calm level rating
  const handleRateCalm = (rating) => {
    const roundKey = `round${currentRound}`;
    setCalmRatings(prev => ({
      ...prev,
      [roundKey]: rating
    }));

    // Give points for participation (learning-focused game)
    setScore(prev => prev + 1);
    setExerciseCompleted(false);

    // Move to next round or finish
    setTimeout(() => {
      if (currentRound < totalLevels - 1) {
        setCurrentRound(prev => prev + 1);
        setIsPlaying(false);
        setTimeRemaining(60);
        setBreathPhase('idle');
        setBreathCycleTime(0);
        setExerciseCompleted(false);
      } else {
        setShowGameOver(true);
      }
    }, 1500);
  };

  // Calculate orb size based on breath phase
  const getOrbSize = () => {
    if (breathPhase === 'inhale') {
      const progress = 1 - (breathCycleTime / breathingTimings.inhale);
      return 100 + (progress * 150); // Grows from 100px to 250px
    } else if (breathPhase === 'hold') {
      return 250; // Maintains full size
    } else if (breathPhase === 'exhale') {
      const progress = 1 - (breathCycleTime / breathingTimings.exhale);
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

  const progress = ((currentRound + 1) / totalLevels) * 100;
  const currentRating = calmRatings[`round${currentRound}`];
  const orbSize = getOrbSize();

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "One-Minute Mindful Reset"}
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
            <div className="text-6xl mb-4">🌬️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">One-Minute Reset Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've learned to reconnect body and mind through short, intentional breathing. Remember: one mindful minute can transform your entire energy.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Try one mindful minute before entering your child's room or workspace. Your calm energy will be felt immediately. This simple practice—inhale, hold, exhale—reconnects your body and mind, allowing you to arrive fully present. Practice this daily, and it becomes automatic—your pause button for calm presence.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "One-Minute Mindful Reset"}
      subtitle={`Round ${currentRound + 1} of ${totalLevels}: ${currentContext.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentRound + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          key={currentRound}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Round {currentRound + 1} of {totalLevels}</span>
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

          {/* Context description */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{currentContext.title}</h3>
            <p className="text-gray-700 mb-3">{currentContext.description}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
              <p className="text-sm text-amber-800">
                <strong>💡 Tip:</strong> {currentContext.tip}
              </p>
            </div>
          </div>

          {!isPlaying && !currentRating && (
            /* Start screen */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">One-Minute Mindful Reset</h3>
                <p className="text-gray-700 mb-6">
                  Follow the breathing animation for 60 seconds. Let the rhythm guide you—inhale for 4 seconds, hold for 2 seconds, exhale for 6 seconds.
                </p>
                <div className="flex items-center justify-center gap-4 mb-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>60 seconds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-5 h-5" />
                    <span>Follow the rhythm</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startExercise}
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mx-auto"
                >
                  <Play className="w-6 h-6" />
                  Start One-Minute Reset
                </motion.button>
              </div>
            </div>
          )}

          {isPlaying && !currentRating && (
            /* Breathing exercise in progress */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-blue-300">
                {/* Timer display */}
                <div className="mb-6">
                  <div className="text-6xl font-bold text-gray-800 mb-2">{timeRemaining}</div>
                  <p className="text-sm text-gray-600">seconds remaining</p>
                </div>

                {/* Breathing orb animation */}
                <div className="flex items-center justify-center mb-6">
                  <motion.div
                    animate={{
                      width: `${orbSize}px`,
                      height: `${orbSize}px`,
                    }}
                    transition={{
                      duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 2 : 6,
                      ease: "easeInOut"
                    }}
                    className={`rounded-full bg-gradient-to-br ${getOrbColor()} shadow-2xl flex items-center justify-center`}
                  >
                    <Wind className="w-16 h-16 text-white" />
                  </motion.div>
                </div>

                {/* Phase instruction */}
                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-800 mb-2">{getPhaseText()}</p>
                  {breathCycleTime > 0 && (
                    <p className="text-sm text-gray-600">{breathCycleTime} seconds</p>
                  )}
                </div>

                {/* Instructions */}
                <p className="text-sm text-gray-600 italic">
                  Follow the rhythm. Let your breath guide you back to the present moment.
                </p>
              </div>
            </div>
          )}

          {!isPlaying && currentRating && (
            /* Rating screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Reset Complete!</h3>
                <p className="text-gray-600 mb-6">
                  You rated your calm level: <strong className="text-green-700">{currentRating} out of 5</strong>
                </p>
                <p className="text-sm text-gray-600 italic">
                  Great work! Your one-minute mindful reset has reconnected your body and mind.
                </p>
              </div>
            </motion.div>
          )}

          {exerciseCompleted && !currentRating && (
            /* Rating after completion */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  How calm do you feel now?
                </h3>
                
                <div className="grid grid-cols-5 gap-3 mb-6 max-w-md mx-auto">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <motion.button
                      key={rating}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRateCalm(rating)}
                      disabled={!!currentRating}
                      className={`
                        aspect-square rounded-lg border-2 font-bold text-lg transition-all
                        ${currentRating === rating
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 text-white shadow-lg scale-110'
                          : currentRating
                          ? 'bg-gray-100 border-gray-300 text-gray-400 opacity-50'
                          : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 text-blue-700 hover:shadow-md cursor-pointer'
                        }
                      `}
                    >
                      {rating}
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-between text-sm text-gray-600 max-w-md mx-auto">
                  <span>Not calm</span>
                  <span>Very calm</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default OneMinuteMindfulReset;

