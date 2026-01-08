import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const FamilyFeelingsCircle = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-27";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentRound, setCurrentRound] = useState(0);
  const [participations, setParticipations] = useState({});
  const [showCompletion, setShowCompletion] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Prompt cards for family sharing rounds
  const promptRounds = [
    {
      id: 1,
      title: "Gratitude & Joy",
      theme: "Celebrating the positive moments",
      prompts: [
        "One thing that made me happy today was...",
        "I'm grateful for...",
        "Something that made me smile today...",
        "A moment I felt proud of myself...",
        "I felt loved when..."
      ],
      instructions: "Each family member shares something positive from their day. Take turns and listen with full attention.",
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-300",
      emoji: "😊"
    },
    {
      id: 2,
      title: "Challenges & Support",
      theme: "Sharing struggles and offering support",
      prompts: [
        "Something that was hard for me today...",
        "I felt worried about...",
        "A challenge I faced was...",
        "Something I'm struggling with...",
        "I need support with..."
      ],
      instructions: "Share something difficult from your day. Others listen without fixing, just offering understanding and support.",
      color: "from-blue-400 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-300",
      emoji: "💙"
    },
    {
      id: 3,
      title: "Feelings & Emotions",
      theme: "Naming and validating emotions",
      prompts: [
        "Today I felt...",
        "An emotion I experienced today was...",
        "I felt [emotion] when...",
        "Something that stirred up feelings was...",
        "Right now I'm feeling..."
      ],
      instructions: "Each person names their feelings and shares when they felt them. Remember: all feelings are valid.",
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-300",
      emoji: "💜"
    },
    {
      id: 4,
      title: "Hopes & Dreams",
      theme: "Sharing aspirations and wishes",
      prompts: [
        "Something I'm looking forward to...",
        "A dream I have is...",
        "I hope that...",
        "Something I want to try...",
        "I'm excited about..."
      ],
      instructions: "Share your hopes, dreams, and things you're looking forward to. Celebrate each other's aspirations.",
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-300",
      emoji: "✨"
    },
    {
      id: 5,
      title: "Appreciation & Connection",
      theme: "Expressing appreciation for each other",
      prompts: [
        "Something I appreciate about you is...",
        "I noticed you... and I appreciated it",
        "Thank you for...",
        "I love how you...",
        "You make me feel... because..."
      ],
      instructions: "Take turns expressing appreciation for each family member. Be specific and genuine.",
      color: "from-rose-400 to-red-500",
      bgColor: "from-rose-50 to-red-50",
      borderColor: "border-rose-300",
      emoji: "❤️"
    }
  ];

  const handleParticipationMark = (roundId) => {
    setParticipations(prev => ({
      ...prev,
      [roundId]: {
        completed: true,
        completedAt: new Date().toISOString()
      }
    }));
    
    // Update score (1 point per completed round)
    setScore(Object.keys({...participations, [roundId]: {completed: true}}).length);
    
    // Check if all rounds are completed
    const allCompleted = Object.keys({...participations, [roundId]: {completed: true}}).length === totalLevels;
    if (allCompleted) {
      setTimeout(() => {
        setShowCompletion(true);
        setShowGameOver(true);
      }, 1000);
    }
  };

  const handleNext = () => {
    if (currentRound < totalLevels - 1) {
      setCurrentRound(prev => prev + 1);
    } else {
      // All rounds viewed, show completion
      setShowCompletion(true);
      setShowGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentRound(0);
    setParticipations({});
    setShowCompletion(false);
    setScore(0);
    setShowGameOver(false);
  };

  const currentRoundData = promptRounds[currentRound];
  const isCompleted = participations[currentRoundData.id]?.completed || false;
  const progress = ((currentRound + 1) / totalLevels) * 100;
  const completedCount = Object.keys(participations).length;

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentRound}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Round {currentRound + 1} of {totalLevels}</span>
            <span>{completedCount} / {totalLevels} Completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
            />
          </div>
        </div>

        {!showCompletion ? (
          <>
            {/* Round header */}
            <div className={`bg-gradient-to-br ${currentRoundData.bgColor} rounded-2xl p-8 mb-8 shadow-xl border-2 ${currentRoundData.borderColor}`}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{currentRoundData.emoji}</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentRoundData.title}
                </h2>
                <p className="text-lg text-gray-700 font-medium">
                  {currentRoundData.theme}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📋</span>
                <span>Instructions:</span>
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {currentRoundData.instructions}
              </p>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> Sit in a circle if possible. Make eye contact. No phones or distractions. 
                  Give each person your full attention when they're sharing.
                </p>
              </div>
            </div>

            {/* Prompt cards */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Prompt Cards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentRoundData.prompts.map((prompt, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{currentRoundData.emoji}</div>
                      <p className="text-lg text-gray-700 leading-relaxed font-medium">
                        {prompt}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Participation section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-lg border-2 border-indigo-200 mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {isCompleted ? "✅ Round Completed!" : "Mark Participation"}
                </h3>
                {!isCompleted ? (
                  <>
                    <p className="text-gray-700 mb-6">
                      Once your family has completed this sharing circle, mark it below to track your progress.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleParticipationMark(currentRoundData.id)}
                      className={`bg-gradient-to-r ${currentRoundData.color} text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all`}
                    >
                      Mark Circle as Completed
                    </motion.button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-gray-700 mb-2">
                        <strong>Completed:</strong> {new Date(participations[currentRoundData.id]?.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {currentRound < totalLevels - 1 ? 'Continue to Next Round' : 'View Completion'}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation for non-completed rounds */}
            {!isCompleted && (
              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="text-gray-600 hover:text-gray-900 underline text-sm"
                >
                  Skip to next round (without marking completion)
                </button>
              </div>
            )}
          </>
        ) : (
          /* Completion screen */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Celebration */}
              <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-2xl p-8 shadow-xl border-2 border-yellow-300 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="text-8xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Circle Completed!
                </h2>
                <p className="text-xl text-gray-700 mb-2">
                  Your family has completed all {totalLevels} sharing rounds!
                </p>
                <div className="bg-white rounded-xl p-4 inline-block mt-4">
                  <p className="text-lg font-semibold text-gray-800">
                    Total Rounds Completed: {completedCount} / {totalLevels}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  What You've Accomplished
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {promptRounds.map((round) => (
                    <div
                      key={round.id}
                      className={`p-4 rounded-lg border-2 ${
                        participations[round.id]?.completed
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{round.emoji}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{round.title}</p>
                          <p className="text-sm text-gray-600">
                            {participations[round.id]?.completed ? '✅ Completed' : '⏳ Pending'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Benefits of Family Feelings Circles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">💬</span>
                    <span>Encourages open communication and emotional expression</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xl">🤝</span>
                    <span>Builds deeper connections and understanding between family members</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xl">💙</span>
                    <span>Teaches children that all emotions are valid and worth sharing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xl">🌟</span>
                    <span>Creates a safe space for vulnerability and support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xl">🧠</span>
                    <span>Develops emotional intelligence and empathy skills</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xl">✨</span>
                    <span>Strengthens family bonds through regular shared experiences</span>
                  </div>
                </div>
              </div>

              {/* Parent tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                delay={0.5}
                className="bg-amber-50 border border-amber-200 rounded-xl p-6"
              >
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>💡 Parent Tip:</strong> Make it a weekly ritual; children will open up naturally. 
                  Consistency is key—when feelings circles become a regular part of your family routine, children learn to trust 
                  that this is a safe space to share. Start with shorter sessions and let them grow naturally. 
                  Remember, the goal isn't perfection—it's connection. Even 10-15 minutes once a week can transform family communication.
                </p>
              </motion.div>

              {/* Suggestions for next steps */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 shadow-lg border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Making It a Ritual
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start gap-2">
                    <span className="font-bold">📅 Schedule it:</span>
                    <span>Pick a consistent day and time each week (e.g., Sunday evenings after dinner)</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold">🔄 Rotate prompts:</span>
                    <span>Use different rounds each week, or let family members choose which prompts to use</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold">🎯 Keep it simple:</span>
                    <span>Start with 2-3 prompts per session. Quality over quantity.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold">❤️ Celebrate participation:</span>
                    <span>Thank each person for sharing. No judgment, just listening and understanding.</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
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

export default FamilyFeelingsCircle;

