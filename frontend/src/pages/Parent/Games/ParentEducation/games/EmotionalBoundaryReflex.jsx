import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { CheckCircle, XCircle, Shield, Heart, Sparkles } from "lucide-react";

const EmotionalBoundaryReflex = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-69";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 10;
  
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Flash cards with healthy vs unhealthy boundary statements
  const boundaryCards = [
    {
      id: 1,
      statement: "I'm responsible for everyone's feelings",
      isHealthy: false,
      explanation: "Unhealthy: You cannot control or be responsible for how others feel. Each person owns their emotions.",
      healthyAlternative: "I can acknowledge others' feelings, but I'm not responsible for fixing them."
    },
    {
      id: 2,
      statement: "I can support, not fix",
      isHealthy: true,
      explanation: "Healthy: You can offer support and empathy without taking responsibility for solving someone else's problems.",
      healthyAlternative: "Perfect! Supporting without fixing maintains healthy boundaries."
    },
    {
      id: 3,
      statement: "If they're upset, it's my fault",
      isHealthy: false,
      explanation: "Unhealthy: This assumes you have complete control over others' emotional states, which isn't true.",
      healthyAlternative: "Their feelings are their own. I can listen and support without taking blame."
    },
    {
      id: 4,
      statement: "I can listen without taking on their emotions",
      isHealthy: true,
      explanation: "Healthy: Healthy detachment allows you to be present and compassionate without absorbing someone else's emotional state.",
      healthyAlternative: "Exactly! This is emotional boundary protection."
    },
    {
      id: 5,
      statement: "I must always make them happy",
      isHealthy: false,
      explanation: "Unhealthy: This is impossible and exhausting. You can't be responsible for others' happiness.",
      healthyAlternative: "I can contribute to their wellbeing, but their happiness is their responsibility."
    },
    {
      id: 6,
      statement: "I can set limits while still caring deeply",
      isHealthy: true,
      explanation: "Healthy: Boundaries don't mean you care less—they mean you care enough to protect yourself and the relationship.",
      healthyAlternative: "Perfect boundary! Limits and care can coexist."
    },
    {
      id: 7,
      statement: "Their problems are my problems",
      isHealthy: false,
      explanation: "Unhealthy: Enmeshment prevents healthy independence. You can help without making their problems yours.",
      healthyAlternative: "I can help, but their problems remain theirs to solve. I'm a supporter, not a rescuer."
    },
    {
      id: 8,
      statement: "I can say 'no' without feeling guilty",
      isHealthy: true,
      explanation: "Healthy: Saying 'no' protects your energy and teaches others to respect your limits.",
      healthyAlternative: "Exactly! 'No' is a complete sentence and doesn't require guilt."
    },
    {
      id: 9,
      statement: "I should never disappoint them",
      isHealthy: false,
      explanation: "Unhealthy: It's impossible to never disappoint others. Healthy relationships can handle occasional disappointment.",
      healthyAlternative: "I can't prevent all disappointment, and that's okay. Healthy relationships can navigate this."
    },
    {
      id: 10,
      statement: "I can show empathy without losing myself",
      isHealthy: true,
      explanation: "Healthy: Empathy doesn't mean merging with others' emotions. You can understand and care while maintaining your own center.",
      healthyAlternative: "Perfect! This is the balance of healthy emotional boundaries."
    },
    {
      id: 11,
      statement: "I must fix their emotional pain",
      isHealthy: false,
      explanation: "Unhealthy: You can't fix someone else's pain. You can only offer support, understanding, and presence.",
      healthyAlternative: "I can support them through their pain, but I can't fix it. That's their journey."
    },
    {
      id: 12,
      statement: "I can be present without absorbing their stress",
      isHealthy: true,
      explanation: "Healthy: You can be fully present and supportive while maintaining your own emotional equilibrium.",
      healthyAlternative: "Yes! This is healthy detachment in action."
    },
    {
      id: 13,
      statement: "If they're angry, I must fix it immediately",
      isHealthy: false,
      explanation: "Unhealthy: You can't control others' anger. You can respond calmly and set boundaries, but you can't make them stop being angry.",
      healthyAlternative: "I can respond calmly and set boundaries, but their anger is theirs to manage."
    },
    {
      id: 14,
      statement: "I can care deeply and still protect my energy",
      isHealthy: true,
      explanation: "Healthy: Caring deeply doesn't mean sacrificing yourself. Healthy boundaries allow you to care without depletion.",
      healthyAlternative: "Exactly! Caring and protecting yourself aren't contradictory."
    },
    {
      id: 15,
      statement: "Their unhappiness means I've failed",
      isHealthy: false,
      explanation: "Unhealthy: Others' unhappiness isn't necessarily your responsibility or failure. People have their own emotional lives.",
      healthyAlternative: "Their unhappiness isn't my failure. I can support, but I can't control their emotional state."
    }
  ];

  // Shuffle and select 10 cards for the game
  const getRandomCards = () => {
    const shuffled = [...boundaryCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  };

  const [gameCards, setGameCards] = useState(getRandomCards());

  const currentCard = gameCards[currentRound];
  const hasSelected = selectedCards.includes(currentCard.id);

  const handleCardTap = (cardId) => {
    if (hasSelected) return;

    const card = gameCards.find(c => c.id === cardId);
    if (!card) return;

    setSelectedCards(prev => [...prev, cardId]);
    setShowFeedback(true);

    if (card.isHealthy) {
      setScore(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
    }

    // Move to next card after showing feedback
    setTimeout(() => {
      if (currentRound < gameCards.length - 1) {
        setCurrentRound(prev => prev + 1);
        setShowFeedback(false);
      } else {
        setShowGameOver(true);
      }
    }, 2500);
  };

  if (showGameOver) {
    const percentage = Math.round((score / gameCards.length) * 100);
    let performanceLevel = "";
    let performanceColor = "";
    let performanceEmoji = "";

    if (percentage >= 90) {
      performanceLevel = "Excellent";
      performanceColor = "from-green-500 to-emerald-600";
      performanceEmoji = "🌟";
    } else if (percentage >= 70) {
      performanceLevel = "Great";
      performanceColor = "from-blue-500 to-indigo-600";
      performanceEmoji = "👍";
    } else if (percentage >= 50) {
      performanceLevel = "Good";
      performanceColor = "from-yellow-500 to-amber-600";
      performanceEmoji = "📊";
    } else {
      performanceLevel = "Keep Practicing";
      performanceColor = "from-orange-500 to-red-600";
      performanceEmoji = "💪";
    }

    return (
      <ParentGameShell
        title={gameData?.title || "Emotional Boundary Reflex"}
        subtitle="Game Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score === gameCards.length}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-7xl mb-4"
              >
                {performanceEmoji}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Boundary Reflex Results</h2>
              <div className={`inline-block bg-gradient-to-br ${performanceColor} rounded-xl px-8 py-4 text-white mb-4`}>
                <p className="text-4xl font-bold mb-2">{percentage}%</p>
                <p className="text-xl font-semibold">{performanceLevel}</p>
                <p className="text-lg mt-2">{score}/{gameCards.length} Healthy Boundaries Identified</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Your Boundary Recognition
              </h3>
              <p className="text-gray-700 mb-4">
                You correctly identified <strong>{correctCount} healthy boundary statements</strong> out of {gameCards.filter(c => c.isHealthy).length} total healthy boundaries in the game.
              </p>
              <p className="text-gray-700">
                {percentage >= 90 
                  ? "Excellent work! You have a strong understanding of healthy emotional boundaries."
                  : percentage >= 70
                  ? "Great job! You're developing a good sense of healthy boundaries. Keep practicing!"
                  : percentage >= 50
                  ? "Good start! Recognizing healthy boundaries takes practice. Review the feedback and try again."
                  : "Keep practicing! Understanding healthy boundaries is a skill that improves with awareness. Review the feedback and try again."}
              </p>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Key Insights About Healthy Boundaries
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Healthy Detachment:</strong> Healthy detachment allows deeper compassion. When you're not overwhelmed by others' emotions, you can respond with clearer, more helpful support.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Support, Don't Fix:</strong> You can support others without taking responsibility for fixing their problems or emotions. This protects your energy while still being caring.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Emotional Ownership:</strong> Each person owns their emotions. You're not responsible for how others feel, though you can acknowledge and support them.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Boundaries Are Love:</strong> Setting boundaries isn't selfish—it's necessary for healthy relationships. Limits allow you to care without depletion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Empathy Without Absorption:</strong> You can show empathy and understanding without absorbing others' stress or pain. This balance protects your wellbeing.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Healthy detachment allows deeper compassion. When you're not overwhelmed by taking responsibility for everyone's feelings, you can respond with clearer, more helpful support. Healthy boundaries don't mean you care less—they mean you care enough to protect yourself and your relationships. By recognizing healthy boundaries, you're learning to support your children without losing yourself, to empathize without absorbing their stress, and to care deeply while maintaining your own emotional equilibrium. This makes you a more stable, present, and effective parent.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Emotional Boundary Reflex"}
      subtitle={`Round ${currentRound + 1} of ${gameCards.length}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentRound + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={currentRound}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Round {currentRound + 1} of {gameCards.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentRound + 1) / gameCards.length) * 100}%` }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200 mb-6">
            <p className="text-center text-gray-700 font-semibold">
              Tap the healthy boundary statement
            </p>
          </div>

          {/* Flash Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-xl p-8 border-4 cursor-pointer transition-all ${
              hasSelected
                ? currentCard.isHealthy
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 hover:border-blue-500 hover:shadow-xl'
            }`}
            onClick={() => !hasSelected && handleCardTap(currentCard.id)}
          >
            <div className="text-center">
              <motion.div
                animate={hasSelected && currentCard.isHealthy ? { scale: [1, 1.2, 1] } : {}}
                className="text-5xl mb-4"
              >
                {hasSelected ? (
                  currentCard.isHealthy ? (
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-600 mx-auto" />
                  )
                ) : (
                  <Shield className="w-16 h-16 text-blue-600 mx-auto" />
                )}
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                "{currentCard.statement}"
              </h3>
              {hasSelected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div className={`rounded-lg p-5 border-2 ${
                    currentCard.isHealthy
                      ? 'bg-green-100 border-green-300'
                      : 'bg-red-100 border-red-300'
                  }`}>
                    <p className={`font-semibold text-lg mb-2 ${
                      currentCard.isHealthy ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {currentCard.isHealthy ? '✓ Healthy Boundary!' : '✗ Unhealthy Boundary'}
                    </p>
                    <p className="text-gray-700 mb-3">
                      {currentCard.explanation}
                    </p>
                    <p className="text-sm text-gray-600 italic">
                      {currentCard.healthyAlternative}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Feedback Animation */}
          <AnimatePresence>
            {showFeedback && currentCard.isHealthy && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.8, 0]
                  }}
                  transition={{ duration: 1, repeat: 2 }}
                  className="text-9xl text-green-500"
                >
                  ✓
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Healthy detachment allows deeper compassion. When you recognize healthy boundaries quickly, you can respond to emotional situations with clarity and care.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default EmotionalBoundaryReflex;

