import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Eye, Cloud, Waves, Sparkles } from "lucide-react";

const StressDetoxVisualization = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-19";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentSession, setCurrentSession] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [calmRatings, setCalmRatings] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Guided visualization sessions
  const visualizationSessions = [
    {
      id: 1,
      title: "Dark Smoke Release",
      description: "Visualize stress leaving your body like dark smoke",
      duration: 120, // 2 minutes
      steps: [
        {
          text: "Close your eyes or soften your gaze. Take a deep breath in...",
          duration: 5,
          visual: "🌬️",
          color: "from-blue-400 to-cyan-400"
        },
        {
          text: "Imagine all your stress, tension, and worries gathering in your chest as dark, heavy smoke...",
          duration: 15,
          visual: "💨",
          color: "from-gray-600 to-slate-700"
        },
        {
          text: "As you breathe out, see this dark smoke slowly leaving your body, flowing out through your mouth and nose...",
          duration: 20,
          visual: "🌪️",
          color: "from-gray-500 to-gray-300"
        },
        {
          text: "Watch the dark smoke drift away from you, getting lighter and lighter until it disappears...",
          duration: 20,
          visual: "☁️",
          color: "from-gray-300 to-white"
        },
        {
          text: "Feel your body becoming lighter, your chest opening, tension releasing...",
          duration: 20,
          visual: "✨",
          color: "from-white to-blue-100"
        },
        {
          text: "Take another deep breath. Notice how much calmer you feel now...",
          duration: 10,
          visual: "😌",
          color: "from-blue-100 to-cyan-100"
        },
        {
          text: "The dark smoke is gone. You are calm, peaceful, and relaxed...",
          duration: 10,
          visual: "🕯️",
          color: "from-cyan-100 to-white"
        }
      ],
      tip: "This visualization helps release physical and emotional tension. Practice it whenever you feel stressed."
    },
    {
      id: 2,
      title: "Ocean Wave Cleansing",
      description: "Let ocean waves wash away your stress",
      duration: 120,
      steps: [
        {
          text: "Find a comfortable position. Take three deep breaths...",
          duration: 10,
          visual: "🌊",
          color: "from-blue-400 to-cyan-400"
        },
        {
          text: "Imagine yourself standing on a beautiful beach. The sun is warm, the sand is soft beneath your feet...",
          duration: 15,
          visual: "🏖️",
          color: "from-yellow-300 to-orange-300"
        },
        {
          text: "Watch the gentle ocean waves rolling toward you, one after another...",
          duration: 15,
          visual: "🌊",
          color: "from-blue-500 to-teal-500"
        },
        {
          text: "As each wave reaches your feet, imagine it washing away all your stress, worries, and tension...",
          duration: 20,
          visual: "💧",
          color: "from-teal-400 to-cyan-400"
        },
        {
          text: "Feel the cool, clean water taking away everything that weighs you down...",
          duration: 20,
          visual: "🌊",
          color: "from-cyan-300 to-blue-200"
        },
        {
          text: "The waves carry your stress far out to sea, where it dissolves into the vast ocean...",
          duration: 20,
          visual: "🌅",
          color: "from-blue-200 to-indigo-200"
        },
        {
          text: "You feel refreshed, clean, and peaceful. The waves continue their gentle rhythm...",
          duration: 10,
          visual: "😌",
          color: "from-indigo-100 to-blue-100"
        }
      ],
      tip: "Ocean imagery is naturally calming. Use this visualization when you need to feel refreshed and renewed."
    },
    {
      id: 3,
      title: "Light Filling Your Body",
      description: "Fill yourself with warm, healing light",
      duration: 120,
      steps: [
        {
          text: "Settle into a comfortable position. Close your eyes gently...",
          duration: 5,
          visual: "👁️",
          color: "from-purple-400 to-indigo-400"
        },
        {
          text: "Imagine a warm, golden light above your head, like gentle sunlight...",
          duration: 15,
          visual: "☀️",
          color: "from-yellow-400 to-amber-400"
        },
        {
          text: "This light begins to flow down through the top of your head, filling your mind with peace...",
          duration: 20,
          visual: "💛",
          color: "from-amber-300 to-yellow-300"
        },
        {
          text: "The warm light flows down your neck, shoulders, and arms, releasing all tension...",
          duration: 20,
          visual: "✨",
          color: "from-yellow-200 to-amber-200"
        },
        {
          text: "Feel the light filling your chest, your heart, bringing calm and ease...",
          duration: 20,
          visual: "💖",
          color: "from-amber-200 to-orange-200"
        },
        {
          text: "The golden light flows down through your stomach, your legs, all the way to your toes...",
          duration: 20,
          visual: "🌟",
          color: "from-orange-200 to-yellow-200"
        },
        {
          text: "Your entire body is now filled with warm, healing light. You feel completely relaxed and at peace...",
          duration: 10,
          visual: "🕯️",
          color: "from-yellow-100 to-amber-100"
        }
      ],
      tip: "Light visualization helps replace stress with feelings of warmth and safety. Great for bedtime."
    },
    {
      id: 4,
      title: "Forest Sanctuary",
      description: "Find peace in a quiet forest clearing",
      duration: 120,
      steps: [
        {
          text: "Take a moment to breathe deeply. Let your body relax...",
          duration: 5,
          visual: "🌲",
          color: "from-green-400 to-emerald-400"
        },
        {
          text: "Imagine yourself walking into a peaceful forest. The air is fresh and cool...",
          duration: 15,
          visual: "🌳",
          color: "from-green-500 to-teal-500"
        },
        {
          text: "You find a quiet clearing with soft moss and dappled sunlight filtering through the trees...",
          duration: 20,
          visual: "🌿",
          color: "from-teal-400 to-green-400"
        },
        {
          text: "You sit down in this peaceful space. All the stress and noise of your day begins to fade away...",
          duration: 20,
          visual: "🧘",
          color: "from-green-300 to-emerald-300"
        },
        {
          text: "You hear only the gentle sounds of nature—birds, rustling leaves, a distant stream...",
          duration: 20,
          visual: "🐦",
          color: "from-emerald-300 to-teal-300"
        },
        {
          text: "Feel the peace of this sanctuary filling you. You are safe, calm, and completely at ease...",
          duration: 20,
          visual: "🕊️",
          color: "from-teal-200 to-green-200"
        },
        {
          text: "This peaceful feeling stays with you as you return to your day, refreshed and centered...",
          duration: 10,
          visual: "😌",
          color: "from-green-100 to-emerald-100"
        }
      ],
      tip: "Nature imagery connects you to a sense of peace and stability. Use this when you feel overwhelmed."
    },
    {
      id: 5,
      title: "Evening Release",
      description: "Release the day's stress before sleep",
      duration: 120,
      steps: [
        {
          text: "You're preparing for rest. Let your body settle into comfort...",
          duration: 5,
          visual: "🌙",
          color: "from-indigo-400 to-purple-400"
        },
        {
          text: "Think about your day. Notice any stress, tension, or worries you're carrying...",
          duration: 15,
          visual: "💭",
          color: "from-purple-500 to-indigo-500"
        },
        {
          text: "Imagine placing all of today's stress into a beautiful, glowing container...",
          duration: 20,
          visual: "📦",
          color: "from-indigo-400 to-purple-400"
        },
        {
          text: "Watch as this container gently floats away from you, taking all the day's tension with it...",
          duration: 20,
          visual: "🎈",
          color: "from-purple-300 to-indigo-300"
        },
        {
          text: "Feel your body releasing, your mind quieting, your breathing becoming slow and steady...",
          duration: 20,
          visual: "💤",
          color: "from-indigo-200 to-purple-200"
        },
        {
          text: "You are letting go of everything that doesn't serve you right now. You are ready for rest...",
          duration: 20,
          visual: "✨",
          color: "from-purple-100 to-indigo-100"
        },
        {
          text: "Drift into a peaceful, restful state. Tomorrow is a new day, and you are ready...",
          duration: 10,
          visual: "😴",
          color: "from-indigo-50 to-purple-50"
        }
      ],
      tip: "Use this visualization before bedtime to release the day's stress and prepare for deeper, more restful sleep."
    }
  ];

  const startVisualization = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    const firstStep = visualizationSessions[currentSession].steps[0];
    setTimeRemaining(firstStep.duration);
  };

  // Timer for visualization steps
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) return;

    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, timeRemaining]);

  // Move to next step when timer reaches 0
  useEffect(() => {
    if (isPlaying && timeRemaining === 0) {
      const currentSessionData = visualizationSessions[currentSession];
      if (currentStep < currentSessionData.steps.length - 1) {
        setTimeout(() => {
          setCurrentStep(prev => {
            const nextStep = prev + 1;
            const nextStepData = currentSessionData.steps[nextStep];
            setTimeRemaining(nextStepData.duration);
            return nextStep;
          });
        }, 500);
      } else {
        // Finished all steps
        setTimeout(() => {
          setIsPlaying(false);
          setTimeRemaining(0);
        }, 500);
      }
    }
  }, [timeRemaining, isPlaying, currentStep, currentSession]);

  const handleRateCalm = (rating) => {
    const sessionKey = `session${currentSession}`;
    setCalmRatings(prev => ({
      ...prev,
      [sessionKey]: rating
    }));

    // Give points for participation
    setScore(prev => prev + 1);

    // Move to next session or finish
    setTimeout(() => {
      if (currentSession < totalLevels - 1) {
        setCurrentSession(prev => prev + 1);
        setCurrentStep(0);
        setIsPlaying(false);
        setTimeRemaining(0);
      } else {
        setShowGameOver(true);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentSession(0);
    setCurrentStep(0);
    setCalmRatings({});
    setScore(0);
    setShowGameOver(false);
    setIsPlaying(false);
    setTimeRemaining(0);
  };

  const progress = ((currentSession + 1) / totalLevels) * 100;
  const currentSessionData = visualizationSessions[currentSession];
  const currentStepData = currentSessionData?.steps[currentStep];
  const currentRating = calmRatings[`session${currentSession}`];
  const hasCompletedVisualization = !isPlaying && (currentStep === currentSessionData?.steps.length - 1 && timeRemaining === 0) || currentRating;

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentSession}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
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
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Session instructions */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {currentSessionData.title}
            </h2>
          </div>
          <p className="text-lg text-gray-700 mb-4">
            {currentSessionData.description}
          </p>
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              💡 <strong>Tip:</strong> {currentSessionData.tip}
            </p>
          </div>
        </div>

        {!isPlaying && !hasCompletedVisualization ? (
          /* Start button */
          <div className="text-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startVisualization}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Begin Visualization
            </motion.button>
            <p className="text-sm text-gray-600 mt-4">
              This guided visualization will take about 2 minutes. Find a comfortable position and follow along.
            </p>
          </div>
        ) : isPlaying ? (
          /* Visualization in progress */
          <div className="flex flex-col items-center gap-8 mb-8">
            {/* Visualization orb */}
            <div className="relative w-64 h-64">
              <motion.div
                key={currentStep}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`w-full h-full rounded-full bg-gradient-to-br ${currentStepData.color} flex items-center justify-center shadow-2xl`}
              >
                <div className="text-8xl">{currentStepData.visual}</div>
              </motion.div>
              
              {/* Pulsing rings */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentStepData.color}`}
              />
            </div>

            {/* Guided text */}
            <div className="text-center space-y-4 max-w-2xl">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-2xl font-semibold text-gray-900 leading-relaxed">
                  {currentStepData.text}
                </p>
                {timeRemaining > 0 && (
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">Continue visualizing...</span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Step progress */}
            <div className="flex gap-2">
              {currentSessionData.steps.map((_, index) => (
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
          /* Rating section after completing visualization */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto mb-6"
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
                        : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300 text-indigo-700 hover:shadow-md cursor-pointer'
                      }
                    `}
                  >
                    {rating}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Still tense</span>
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
                      Wonderful! The visualization helped you find calm. 🎉
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Parent tip */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-6"
          >
            <p className="text-sm text-amber-800 leading-relaxed text-center">
              <strong>💡 Parent Tip:</strong> Use visualization before bedtime for deeper rest. 
              Guided imagery helps your mind and body relax, making it easier to fall asleep and sleep more deeply. 
              Practice these visualizations regularly to build your ability to release stress mentally.
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
      currentLevel={currentSession + 1}
      score={score}
      showGameOver={showGameOver}
      onRestart={handleRestart}
      progress={progress}
    >
      {gameContent}
    </ParentGameShell>
  );
};

export default StressDetoxVisualization;

