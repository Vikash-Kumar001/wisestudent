import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Headphones, Clock, Heart, CheckCircle, Play, Pause, Users, TrendingUp } from "lucide-react";

const ListeningPartnerGame = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-74";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [gameMode, setGameMode] = useState(null); // 'solo' or 'partner'
  const [currentRound, setCurrentRound] = useState(1); // 1 or 2 (two rounds for partner play)
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes = 120 seconds
  const [connectionRating, setConnectionRating] = useState(null);
  const [round1Rating, setRound1Rating] = useState(null);
  const [round2Rating, setRound2Rating] = useState(null);
  const [reflection, setReflection] = useState("");
  const [showGameOver, setShowGameOver] = useState(false);
  
  const timerRef = useRef(null);

  // Prompt cards
  const prompts = [
    {
      id: 1,
      question: "What was your biggest challenge today?",
      category: "Daily Life",
      emoji: "🌅",
      color: "from-blue-400 to-indigo-500"
    },
    {
      id: 2,
      question: "What are you most grateful for right now?",
      category: "Gratitude",
      emoji: "🙏",
      color: "from-amber-400 to-orange-500"
    },
    {
      id: 3,
      question: "What's something that made you smile recently?",
      category: "Joy",
      emoji: "😊",
      color: "from-yellow-400 to-amber-500"
    },
    {
      id: 4,
      question: "What's been weighing on your mind lately?",
      category: "Concerns",
      emoji: "💭",
      color: "from-purple-400 to-violet-500"
    },
    {
      id: 5,
      question: "What are you most excited about in the coming weeks?",
      category: "Future",
      emoji: "🌟",
      color: "from-pink-400 to-rose-500"
    },
    {
      id: 6,
      question: "What's something you're proud of yourself for?",
      category: "Achievement",
      emoji: "🎉",
      color: "from-green-400 to-emerald-500"
    },
    {
      id: 7,
      question: "What do you need support with right now?",
      category: "Support",
      emoji: "🤝",
      color: "from-cyan-400 to-teal-500"
    },
    {
      id: 8,
      question: "What's a dream or goal you've been thinking about?",
      category: "Dreams",
      emoji: "✨",
      color: "from-red-400 to-pink-500"
    }
  ];

  // Start the listening timer
  const startListening = () => {
    if (timerRef.current) return; // Already running
    
    setIsListening(true);
    setTimeRemaining(120);
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          stopListening();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop the listening timer
  const stopListening = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsListening(false);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRateConnection = (rating) => {
    setConnectionRating(rating);
    
    if (gameMode === 'partner') {
      if (currentRound === 1) {
        setRound1Rating(rating);
      } else {
        setRound2Rating(rating);
      }
    }
  };

  const handleContinue = () => {
    if (gameMode === 'partner' && currentRound === 1) {
      // Move to round 2
      setCurrentRound(2);
      setSelectedPrompt(null);
      setIsListening(false);
      setTimeRemaining(120);
      setConnectionRating(null);
      setReflection("");
    } else {
      // Game complete
      setShowGameOver(true);
    }
  };

  if (!gameMode) {
    return (
      <ParentGameShell
        title={gameData?.title || "Listening Partner Game"}
        subtitle="Choose Your Mode"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👂</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Listening Partner Game</h2>
              <p className="text-gray-600 text-lg">
                Practice supportive listening and deepen your connections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Partner Mode */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setGameMode('partner')}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all text-left"
              >
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Partner Mode</h3>
                <p className="text-gray-600 mb-4">
                  Play with a partner (spouse, friend, family member). Take turns listening to each other for 2 minutes each.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• Two rounds of listening</li>
                  <li>• Rate connection after each round</li>
                  <li>• Practice with a real person</li>
                </ul>
              </motion.button>

              {/* Solo Mode */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setGameMode('solo')}
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all text-left"
              >
                <Headphones className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Solo Practice</h3>
                <p className="text-gray-600 mb-4">
                  Practice listening skills on your own. Use prompts to reflect and practice mindful listening techniques.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• Practice with reflection prompts</li>
                  <li>• Learn listening techniques</li>
                  <li>• Prepare for partner play</li>
                </ul>
              </motion.button>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">How It Works</h3>
              <ol className="text-gray-700 space-y-2 text-sm">
                <li><strong>1.</strong> Choose a prompt card with a question</li>
                <li><strong>2.</strong> One person answers while the other listens silently for 2 minutes</li>
                <li><strong>3.</strong> No interruptions, no advice—just presence and attention</li>
                <li><strong>4.</strong> Rate the connection and reflect on the experience</li>
                <li><strong>5.</strong> Switch roles and repeat</li>
              </ol>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  if (showGameOver) {
    const avgRating = gameMode === 'partner' 
      ? round1Rating && round2Rating 
        ? ((round1Rating + round2Rating) / 2).toFixed(1)
        : round1Rating || round2Rating
      : connectionRating;

    return (
      <ParentGameShell
        title={gameData?.title || "Listening Partner Game"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={connectionRating || 0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={connectionRating >= 8}
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
                👂
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Listening Practice Complete!</h2>
            </div>

            {/* Connection Rating Summary */}
            {gameMode === 'partner' ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Connection Ratings</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Round 1</p>
                    <p className="text-3xl font-bold text-blue-600">{round1Rating || '—'}/10</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Round 2</p>
                    <p className="text-3xl font-bold text-blue-600">{round2Rating || '—'}/10</p>
                  </div>
                </div>
                {round1Rating && round2Rating && (
                  <div className="text-center pt-4 border-t border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Average Connection</p>
                    <p className="text-4xl font-bold text-blue-600">{avgRating}/10</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-200 mb-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Connection Rating</p>
                <p className="text-5xl font-bold text-purple-600 mb-4">{connectionRating || '—'}/10</p>
              </div>
            )}

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-green-600" />
                Listening Insights
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Presence Matters:</strong> Being fully present for someone is the purest gift of love. Your undivided attention creates deep connection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Silence is Powerful:</strong> Listening without interrupting, advising, or fixing creates space for genuine expression and understanding.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Connection Deepens:</strong> Regular listening practice strengthens relationships and builds trust and intimacy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Practice Makes Progress:</strong> The more you practice mindful listening, the more natural it becomes in daily interactions.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Being fully present for someone is the purest gift of love. When you practice listening with your partner, family, or friends, you're not just hearing words—you're creating space for connection, understanding, and emotional intimacy. Your children learn from watching you listen fully to others. This practice strengthens all your relationships and teaches your children the power of presence and attention.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  // Prompt Selection
  if (!selectedPrompt) {
    return (
      <ParentGameShell
        title={gameData?.title || "Listening Partner Game"}
        subtitle={gameMode === 'partner' ? `Round ${currentRound} - Choose a Prompt` : "Choose a Prompt"}
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎴</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose a Prompt Card</h2>
              <p className="text-gray-600">
                {gameMode === 'partner' 
                  ? `Round ${currentRound}: ${currentRound === 1 ? 'Person 1 speaks, Person 2 listens' : 'Person 2 speaks, Person 1 listens'}`
                  : 'Choose a prompt to practice with'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {prompts.map((prompt) => (
                <motion.button
                  key={prompt.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPrompt(prompt)}
                  className={`bg-gradient-to-br ${prompt.color} text-white rounded-xl p-6 border-2 border-white/20 hover:border-white/40 transition-all text-left shadow-lg`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{prompt.emoji}</span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold opacity-90 mb-2">{prompt.category}</p>
                      <h3 className="text-lg font-bold">{prompt.question}</h3>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="font-bold text-gray-800 mb-2">Instructions</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• The speaker answers the prompt for up to 2 minutes</li>
                <li>• The listener gives full attention—no interrupting, no advice</li>
                <li>• Just be present and listen to understand</li>
                <li>• After 2 minutes, rate the connection and reflect</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Listening Phase
  if (!connectionRating && (timeRemaining > 0 || isListening)) {
    return (
      <ParentGameShell
        title={gameData?.title || "Listening Partner Game"}
        subtitle={gameMode === 'partner' ? `Round ${currentRound} - Listening` : "Listening Practice"}
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={1}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            {/* Selected Prompt */}
            <div className={`bg-gradient-to-br ${selectedPrompt.color} text-white rounded-xl p-6 mb-6 text-center shadow-lg`}>
              <span className="text-5xl mb-4 block">{selectedPrompt.emoji}</span>
              <h2 className="text-2xl font-bold mb-2">{selectedPrompt.question}</h2>
              <p className="text-sm opacity-90">{selectedPrompt.category}</p>
            </div>

            {/* Timer */}
            <div className="text-center mb-8">
              {!isListening ? (
                <>
                  <div className="mb-6">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-6xl font-bold text-gray-800 mb-2">2:00</p>
                    <p className="text-gray-600">Ready to listen for 2 minutes?</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startListening}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <Play className="w-5 h-5" />
                    Start Listening
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <Headphones className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-6xl font-bold text-blue-600 mb-2">{formatTime(timeRemaining)}</p>
                    <p className="text-gray-600">Listening with full attention...</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
                    <h3 className="font-bold text-gray-800 mb-3">Listen Mindfully:</h3>
                    <ul className="text-sm text-gray-700 space-y-2 text-left">
                      <li>✓ Give your full attention—no distractions</li>
                      <li>✓ Listen to understand, not to respond</li>
                      <li>✓ No interrupting, no advice, no fixing</li>
                      <li>✓ Just be present and receive their words</li>
                    </ul>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stopListening}
                    className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <Pause className="w-5 h-5" />
                    Stop Early
                  </motion.button>
                </>
              )}
            </div>

            {/* Speaker Instructions */}
            {gameMode === 'partner' && (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border-2 border-purple-200">
                <p className="text-sm text-gray-700 text-center">
                  <strong>Speaker:</strong> Answer the prompt honestly. You have up to 2 minutes to share. There's no right or wrong answer—just be authentic.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Rating and Reflection Phase
  return (
    <ParentGameShell
      title={gameData?.title || "Listening Partner Game"}
      subtitle={gameMode === 'partner' ? `Round ${currentRound} - Reflection` : "Reflection"}
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💚</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How Was the Connection?</h2>
            <p className="text-gray-600">
              Rate how connected you felt during the listening exercise (1-10)
            </p>
          </div>

          {/* Connection Rating */}
          {!connectionRating && (
            <div className="mb-8">
              <div className="grid grid-cols-5 gap-3 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRateConnection(rating)}
                    className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl border-2 border-blue-300 hover:border-blue-500 hover:shadow-lg transition-all font-bold text-gray-800"
                  >
                    {rating}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600 px-2">
                <span>Not Connected</span>
                <span>Very Connected</span>
              </div>
            </div>
          )}

          {/* Show Selected Rating */}
          {connectionRating && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Connection Rating</p>
              <p className="text-5xl font-bold text-green-600 mb-4">{connectionRating}/10</p>
              <p className="text-gray-700">
                {connectionRating >= 8 
                  ? "Excellent connection! You were fully present and engaged."
                  : connectionRating >= 6
                  ? "Good connection! You were mostly present and attentive."
                  : "Keep practicing! Full presence takes time to develop."}
              </p>
            </div>
          )}

          {/* Reflection */}
          {connectionRating && (
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Reflection</h3>
              <p className="text-sm text-gray-600 mb-4">
                What did you notice during the listening exercise? How did it feel to listen (or be listened to) with full attention?
              </p>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write your reflection here..."
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-gray-800 min-h-[120px] resize-none"
              />
            </div>
          )}

          {/* Continue Button */}
          {connectionRating && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {gameMode === 'partner' && currentRound === 1 ? 'Continue to Round 2' : 'Complete Practice'}
              <CheckCircle className="w-5 h-5" />
            </motion.button>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Being fully present for someone is the purest gift of love. Practice listening with full attention—it transforms relationships and creates deep connection.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default ListeningPartnerGame;

