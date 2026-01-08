import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const BreatheToReset = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-12";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentRound, setCurrentRound] = useState(0);
  const [breathPhase, setBreathPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [calmRatings, setCalmRatings] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  
  const timerRef = useRef(null);
  const cycleCountRef = useRef(0);

  // Breathing phases timing (4-2-6 pattern)
  const breathingTimings = {
    inhale: 4,   // 4 seconds
    hold: 2,     // 2 seconds
    exhale: 6    // 6 seconds
  };

  // Total time for one complete breath cycle
  const cycleDuration = breathingTimings.inhale + breathingTimings.hold + breathingTimings.exhale;

  // Start breathing exercise
  const startBreathing = () => {
    setIsPlaying(true);
    setBreathPhase('inhale');
    setTimeRemaining(breathingTimings.inhale);
    cycleCountRef.current = 0;
    setBreathCount(0);
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
      } else if (breathPhase === 'hold') {
        setBreathPhase('exhale');
        setTimeRemaining(breathingTimings.exhale);
        setBreathCount(prev => prev + 1);
      } else if (breathPhase === 'exhale') {
        cycleCountRef.current += 1;
        
        // Complete 3 breath cycles per round
        if (cycleCountRef.current < 3) {
          setBreathPhase('inhale');
          setTimeRemaining(breathingTimings.inhale);
        } else {
          // Completed 3 cycles, move to rating
          setIsPlaying(false);
          setBreathPhase('idle');
          cycleCountRef.current = 0;
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining, breathPhase]);

  // Handle calm level rating
  const handleRateCalm = (rating) => {
    const roundKey = `round${currentRound}`;
    setCalmRatings(prev => ({
      ...prev,
      [roundKey]: rating
    }));

    // Give points for any participation (learning-focused game)
    setScore(prev => prev + 1);

    // Move to next round or finish
    setTimeout(() => {
      if (currentRound < totalLevels - 1) {
        setCurrentRound(prev => prev + 1);
        setBreathCount(0);
        cycleCountRef.current = 0;
      } else {
        setShowGameOver(true);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentRound(0);
    setCalmRatings({});
    setScore(0);
    setShowGameOver(false);
    setIsPlaying(false);
    setBreathPhase('idle');
    setTimeRemaining(0);
    setBreathCount(0);
    cycleCountRef.current = 0;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
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

  const progress = ((currentRound + 1) / totalLevels) * 100;
  const currentRating = calmRatings[`round${currentRound}`];
  const hasCompletedBreaths = breathCount >= 3 || currentRating;

  // Instructions for each round
  const roundInstructions = [
    {
      title: "Round 1: Morning Calm",
      description: "Start your day with 3 calming breaths. Focus on slow, steady breathing.",
      tip: "Practice this before starting your morning routine."
    },
    {
      title: "Round 2: Midday Reset",
      description: "Take a moment to reset during your busy day. Let the rhythm guide you.",
      tip: "Use this when you feel overwhelmed or need a moment to pause."
    },
    {
      title: "Round 3: Pre-Meeting Calm",
      description: "Calm your nerves before an important conversation or meeting.",
      tip: "Practice this before difficult conversations with family or colleagues."
    },
    {
      title: "Round 4: Evening Wind-Down",
      description: "Release the stress of the day with gentle, controlled breathing.",
      tip: "Perfect for transitioning from work to family time."
    },
    {
      title: "Round 5: Pre-Sleep Relaxation",
      description: "Prepare your body and mind for restful sleep with calming breaths.",
      tip: "Teach this to your child - use the same 4-2-6 pattern before bedtime."
    }
  ];

  const currentInstruction = roundInstructions[currentRound];

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentRound}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
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
              className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Round instructions */}
        <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl p-6 mb-8 shadow-xl border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentInstruction.title}
          </h2>
          <p className="text-lg text-gray-700 mb-3">
            {currentInstruction.description}
          </p>
          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              💡 <strong>Tip:</strong> {currentInstruction.tip}
            </p>
          </div>
        </div>

        {/* Breathing orb animation */}
        <div className="flex flex-col items-center justify-center mb-8">
          {!isPlaying && !hasCompletedBreaths ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startBreathing}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start Breathing Exercise
            </motion.button>
          ) : isPlaying ? (
            <div className="flex flex-col items-center gap-6">
              {/* Breathing orb */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: getOrbSize() / 150,
                  }}
                  transition={{
                    duration: breathPhase === 'inhale' ? breathingTimings.inhale : 
                             breathPhase === 'hold' ? breathingTimings.hold : 
                             breathingTimings.exhale,
                    ease: breathPhase === 'exhale' ? "easeIn" : "easeOut"
                  }}
                  className={`w-48 h-48 rounded-full bg-gradient-to-br ${getOrbColor()} shadow-2xl flex items-center justify-center`}
                >
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [0.9, 1, 0.9]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-32 h-32 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                  >
                    <span className="text-4xl">
                      {breathPhase === 'inhale' ? '🌬️' : 
                       breathPhase === 'hold' ? '✨' : 
                       '💨'}
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Instructions */}
              <div className="text-center">
                <motion.div
                  key={breathPhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <h3 className="text-3xl font-bold text-gray-900">
                    {breathPhase === 'inhale' ? 'Breathe In' :
                     breathPhase === 'hold' ? 'Hold' :
                     'Breathe Out'}
                  </h3>
                  <p className="text-6xl font-bold text-blue-600">
                    {timeRemaining}
                  </p>
                  <p className="text-lg text-gray-600">
                    {breathPhase === 'inhale' ? 'Fill your lungs slowly (4 seconds)' :
                     breathPhase === 'hold' ? 'Hold your breath (2 seconds)' :
                     'Release slowly (6 seconds)'}
                  </p>
                </motion.div>
              </div>

              {/* Breath counter */}
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Breath {breathCount} of 3 complete
                </p>
              </div>
            </div>
          ) : (
            /* Rating section after completing breaths */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
                  How calm do you feel now?
                </h3>
                
                <div className="grid grid-cols-5 gap-3 mb-6">
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
                          : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 text-blue-700 hover:shadow-md cursor-pointer'
                        }
                      `}
                    >
                      {rating}
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Not calm</span>
                  <span>Very calm</span>
                </div>

                {currentRating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-center"
                  >
                    <p className="text-green-600 font-semibold">
                      ✓ Rated: {currentRating}/5
                    </p>
                    {currentRating >= 4 && (
                      <p className="text-sm text-gray-600 mt-2">
                        Great! You're feeling more relaxed. 🎉
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Breathing pattern guide */}
        {!isPlaying && !hasCompletedBreaths && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-blue-200"
          >
            <h4 className="font-bold text-gray-900 mb-3 text-center">
              The 4-2-6 Breathing Pattern
            </h4>
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 text-center">
                <div className="text-2xl mb-2">🌬️</div>
                <div className="font-bold text-blue-600">Inhale</div>
                <div className="text-sm text-gray-600">4 seconds</div>
              </div>
              <div className="w-1 h-12 bg-gray-300"></div>
              <div className="flex-1 text-center">
                <div className="text-2xl mb-2">✨</div>
                <div className="font-bold text-green-600">Hold</div>
                <div className="text-sm text-gray-600">2 seconds</div>
              </div>
              <div className="w-1 h-12 bg-gray-300"></div>
              <div className="flex-1 text-center">
                <div className="text-2xl mb-2">💨</div>
                <div className="font-bold text-purple-600">Exhale</div>
                <div className="text-sm text-gray-600">6 seconds</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800 text-center">
                <strong>💡 Parent Tip:</strong> Teach your child the same "4–2–6" breathing before exams or sleep. It's a simple technique they can use anywhere!
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );

  return (
    <ParentGameShell
      gameId={gameId}
      gameData={gameData}
      totalCoins={totalCoins}
      totalLevels={totalLevels}
      currentLevel={currentRound + 1}
      score={score}
      showGameOver={showGameOver}
      onRestart={handleRestart}
      progress={progress}
    >
      {gameContent}
    </ParentGameShell>
  );
};

export default BreatheToReset;

