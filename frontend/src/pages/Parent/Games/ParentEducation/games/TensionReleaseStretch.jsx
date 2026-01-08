import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const TensionReleaseStretch = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-14";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentStretch, setCurrentStretch] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isStretching, setIsStretching] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [relaxationRatings, setRelaxationRatings] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Stretching routines
  const stretches = [
    {
      id: 1,
      title: "Neck Release Stretch",
      description: "Release tension in your neck and upper shoulders",
      bodyPart: "Neck",
      steps: [
        {
          name: "Neck Side Bend",
          instruction: "Slowly tilt your head to the right, bringing your right ear toward your right shoulder. Hold for 15 seconds.",
          duration: 15,
          emoji: "👂",
          position: "right",
          tip: "Keep your shoulders relaxed and breathe deeply"
        },
        {
          name: "Neck Side Bend (Other Side)",
          instruction: "Slowly tilt your head to the left, bringing your left ear toward your left shoulder. Hold for 15 seconds.",
          duration: 15,
          emoji: "👂",
          position: "left",
          tip: "Feel the stretch along the opposite side"
        },
        {
          name: "Neck Forward Stretch",
          instruction: "Gently lower your chin toward your chest. Hold for 15 seconds and breathe deeply.",
          duration: 15,
          emoji: "⬇️",
          position: "forward",
          tip: "This releases tension in the back of your neck"
        }
      ],
      tip: "Neck stretches are perfect for releasing tension after a stressful conversation or long day of work."
    },
    {
      id: 2,
      title: "Shoulder Release Stretch",
      description: "Relieve tension in your shoulders and upper back",
      bodyPart: "Shoulders",
      steps: [
        {
          name: "Shoulder Rolls",
          instruction: "Slowly roll your shoulders backward in a circular motion. Do 10 rolls.",
          duration: 10,
          emoji: "🔄",
          position: "roll-back",
          tip: "Move slowly and feel each movement"
        },
        {
          name: "Shoulder Rolls (Forward)",
          instruction: "Now roll your shoulders forward in a circular motion. Do 10 rolls.",
          duration: 10,
          emoji: "🔄",
          position: "roll-forward",
          tip: "Reverse the direction to release tension"
        },
        {
          name: "Cross-Body Shoulder Stretch",
          instruction: "Bring your right arm across your chest. Use your left hand to gently pull. Hold for 20 seconds.",
          duration: 20,
          emoji: "🤗",
          position: "cross",
          tip: "Don't pull too hard - gentle pressure is enough"
        }
      ],
      tip: "Shoulder stretches help release the physical tension that builds up when you're stressed or anxious."
    },
    {
      id: 3,
      title: "Upper Back Release",
      description: "Open your chest and release upper back tension",
      bodyPart: "Upper Back",
      steps: [
        {
          name: "Chest Opener",
          instruction: "Clasp your hands behind your back. Gently lift your arms and open your chest. Hold for 20 seconds.",
          duration: 20,
          emoji: "💪",
          position: "chest-open",
          tip: "Keep your shoulders down and back"
        },
        {
          name: "Upper Back Stretch",
          instruction: "Bring your arms in front of you, clasp hands, and round your upper back. Hold for 20 seconds.",
          duration: 20,
          emoji: "🤸",
          position: "round-back",
          tip: "Feel the stretch between your shoulder blades"
        }
      ],
      tip: "Upper back stretches counteract the forward-leaning posture we develop from stress and screen time."
    },
    {
      id: 4,
      title: "Lower Back Release",
      description: "Release tension in your lower back",
      bodyPart: "Lower Back",
      steps: [
        {
          name: "Knee to Chest",
          instruction: "Lie down or sit. Bring one knee toward your chest. Hold for 20 seconds, then switch.",
          duration: 20,
          emoji: "🦵",
          position: "knee-chest",
          tip: "Use your hands to gently pull your knee closer"
        },
        {
          name: "Spinal Twist",
          instruction: "Sitting or lying down, gently twist your torso to one side. Hold for 20 seconds, then switch.",
          duration: 20,
          emoji: "🌀",
          position: "twist",
          tip: "Keep your shoulders relaxed and breathe"
        }
      ],
      tip: "Lower back stretches help release the physical tension we hold when we're worried or stressed."
    },
    {
      id: 5,
      title: "Full Body Reset",
      description: "Complete tension release sequence",
      bodyPart: "Full Body",
      steps: [
        {
          name: "Standing Forward Fold",
          instruction: "Slowly bend forward from your hips. Let your head and arms hang. Hold for 30 seconds.",
          duration: 30,
          emoji: "🙏",
          position: "forward-fold",
          tip: "Bend your knees slightly if needed. Don't force the stretch."
        },
        {
          name: "Arms Overhead Stretch",
          instruction: "Reach your arms up toward the sky. Take a deep breath and hold for 15 seconds.",
          duration: 15,
          emoji: "🌅",
          position: "overhead",
          tip: "Stretch through your entire body and breathe deeply"
        }
      ],
      tip: "Full body stretches help reset your entire system after a stressful day. Great to do before bedtime!"
    }
  ];

  const startStretch = () => {
    setIsStretching(true);
    setCurrentStep(0);
    const currentStepData = stretches[currentStretch].steps[0];
    setTimeRemaining(currentStepData.duration);
  };

  // Timer for stretching
  useEffect(() => {
    if (!isStretching || timeRemaining <= 0) return;

    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isStretching, timeRemaining]);

  // Move to next step when timer reaches 0
  useEffect(() => {
    if (isStretching && timeRemaining === 0 && currentStep < stretches[currentStretch].steps.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1;
          const nextStepData = stretches[currentStretch].steps[nextStep];
          setTimeRemaining(nextStepData.duration);
          return nextStep;
        });
      }, 500);
    } else if (isStretching && timeRemaining === 0 && currentStep === stretches[currentStretch].steps.length - 1) {
      // Finished all steps
      setTimeout(() => {
        setIsStretching(false);
        setTimeRemaining(0);
      }, 500);
    }
  }, [timeRemaining, isStretching, currentStep, currentStretch]);

  const handleRateRelaxation = (rating) => {
    const stretchKey = `stretch${currentStretch}`;
    setRelaxationRatings(prev => ({
      ...prev,
      [stretchKey]: rating
    }));

    // Give points for participation
    setScore(prev => prev + 1);

    // Move to next stretch or finish
    setTimeout(() => {
      if (currentStretch < totalLevels - 1) {
        setCurrentStretch(prev => prev + 1);
        setCurrentStep(0);
        setIsStretching(false);
        setTimeRemaining(0);
      } else {
        setShowGameOver(true);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentStretch(0);
    setCurrentStep(0);
    setRelaxationRatings({});
    setScore(0);
    setShowGameOver(false);
    setIsStretching(false);
    setTimeRemaining(0);
  };

  const progress = ((currentStretch + 1) / totalLevels) * 100;
  const currentStretchData = stretches[currentStretch];
  const currentStepData = currentStretchData?.steps[currentStep];
  const currentRating = relaxationRatings[`stretch${currentStretch}`];
  const hasCompletedStretch = !isStretching && (currentStep === currentStretchData?.steps.length - 1 && timeRemaining === 0) || currentRating;

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentStretch}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Stretch {currentStretch + 1} of {totalLevels}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Stretch instructions */}
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-purple-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            {currentStretchData.title}
          </h2>
          <p className="text-lg text-gray-700 text-center mb-4">
            {currentStretchData.description}
          </p>
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-sm text-gray-700 text-center">
              💡 <strong>Tip:</strong> {currentStretchData.tip}
            </p>
          </div>
        </div>

        {!isStretching && !hasCompletedStretch ? (
          /* Start button */
          <div className="text-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startStretch}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start {currentStretchData.title}
            </motion.button>
            <p className="text-sm text-gray-600 mt-4">
              This stretch has {currentStretchData.steps.length} steps. Follow along and breathe deeply.
            </p>
          </div>
        ) : isStretching ? (
          /* Stretching in progress */
          <div className="flex flex-col items-center gap-6 mb-8">
            {/* Stretch visualization */}
            <div className="relative w-64 h-64">
              <motion.div
                key={currentStep}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 flex items-center justify-center shadow-2xl"
              >
                <div className="text-8xl">{currentStepData.emoji}</div>
              </motion.div>
              
              {/* Pulsing animation */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"
              />
            </div>

            {/* Instructions */}
            <div className="text-center space-y-4">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <h3 className="text-3xl font-bold text-gray-900">
                  {currentStepData.name}
                </h3>
                <p className="text-6xl font-bold text-purple-600">
                  {timeRemaining}
                </p>
                <p className="text-xl text-gray-700 max-w-2xl">
                  {currentStepData.instruction}
                </p>
                <p className="text-sm text-purple-600 font-medium">
                  💡 {currentStepData.tip}
                </p>
              </motion.div>
            </div>

            {/* Progress indicator */}
            <div className="flex gap-2">
              {currentStretchData.steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index < currentStep
                      ? 'bg-green-500 w-8'
                      : index === currentStep
                      ? 'bg-purple-600 w-8 animate-pulse'
                      : 'bg-gray-300 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Rating section after completing stretch */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto mb-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
                How relaxed do you feel now?
              </h3>
              
              <div className="grid grid-cols-5 gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRateRelaxation(rating)}
                    disabled={!!currentRating}
                    className={`
                      aspect-square rounded-lg border-2 font-bold text-lg transition-all
                      ${currentRating === rating
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 text-white shadow-lg scale-110'
                        : currentRating
                        ? 'bg-gray-100 border-gray-300 text-gray-400 opacity-50'
                        : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 text-purple-700 hover:shadow-md cursor-pointer'
                      }
                    `}
                  >
                    {rating}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Still tense</span>
                <span>Very relaxed</span>
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
                      Wonderful! You're feeling more relaxed. 🎉
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Parent tip */}
        {!isStretching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-6"
          >
            <p className="text-sm text-amber-800 leading-relaxed text-center">
              <strong>💡 Parent Tip:</strong> Stretching together with your child makes it fun and bonding. 
              Try doing these stretches as a family activity - kids love following along and it helps everyone release tension together!
            </p>
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
      currentLevel={currentStretch + 1}
      score={score}
      showGameOver={showGameOver}
      onRestart={handleRestart}
      progress={progress}
    >
      {gameContent}
    </ParentGameShell>
  );
};

export default TensionReleaseStretch;

