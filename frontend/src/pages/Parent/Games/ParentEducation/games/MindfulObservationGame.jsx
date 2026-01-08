import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Eye, CheckCircle, Circle, Target, Sparkles } from "lucide-react";

const MindfulObservationGame = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-43";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentRound, setCurrentRound] = useState(0);
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [showReflection, setShowReflection] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Define 10 differences per round (positions are relative to the scene)
  const differences = [
    { id: 1, x: 15, y: 25, description: "Plant pot color", found: false },
    { id: 2, x: 45, y: 30, description: "Curtain position", found: false },
    { id: 3, x: 75, y: 20, description: "Picture frame", found: false },
    { id: 4, x: 25, y: 55, description: "Cushion pattern", found: false },
    { id: 5, x: 60, y: 60, description: "Book on table", found: false },
    { id: 6, x: 30, y: 75, description: "Rug edge", found: false },
    { id: 7, x: 70, y: 75, description: "Lamp shade", found: false },
    { id: 8, x: 50, y: 40, description: "Window reflection", found: false },
    { id: 9, x: 20, y: 65, description: "Wall clock", found: false },
    { id: 10, x: 80, y: 50, description: "Door handle", found: false }
  ];

  // Round scenarios
  const rounds = [
    {
      id: 1,
      title: "Living Room Scene",
      description: "Observe two similar living room scenes. Find 10 subtle differences mindfully and calmly.",
      context: "A cozy living room with furniture, decorations, and personal items. Notice the details.",
      parentTip: "Practicing focus here improves attention with your child too. When you train your mind to notice subtle details calmly, you bring that same focused presence to interactions with your child."
    },
    {
      id: 2,
      title: "Kitchen Scene",
      description: "Observe two similar kitchen scenes. Find 10 differences with calm, focused attention.",
      context: "A family kitchen with appliances, dishes, and decor. Pay attention to small details.",
      parentTip: "Mindful observation strengthens your ability to be present. When you notice details here, you're training your brain to notice your child's subtle cues—their expressions, their energy, their needs."
    },
    {
      id: 3,
      title: "Bedroom Scene",
      description: "Observe two similar bedroom scenes. Find the 10 differences with gentle, steady focus.",
      context: "A peaceful bedroom with furniture, accessories, and personal touches. Observe carefully.",
      parentTip: "The skill of noticing details translates directly to noticing your child. When you're present enough to see what's different, you're present enough to see what your child needs."
    },
    {
      id: 4,
      title: "Study Room Scene",
      description: "Observe two similar study room scenes. Find 10 differences with mindful attention.",
      context: "A quiet study space with books, desk items, and decorations. Look closely at each element.",
      parentTip: "Practicing calm observation here builds the neural pathways for calm observation with your child. Your focused attention becomes a gift to them."
    },
    {
      id: 5,
      title: "Garden Scene",
      description: "Observe two similar garden scenes. Find 10 differences with present-moment awareness.",
      context: "A beautiful garden with plants, decorations, and outdoor elements. Notice what's different.",
      parentTip: "The ability to notice differences calmly is the same ability to notice your child's changes, growth, and needs. Mindful observation deepens connection."
    }
  ];

  const currentRoundData = rounds[currentRound];
  const roundFoundDifferences = foundDifferences.filter(d => d.round === currentRound);
  const allFound = roundFoundDifferences.length >= 10;

  // Handle clicking on a difference area
  const handleDifferenceClick = (differenceId) => {
    // Check if already found
    const alreadyFound = roundFoundDifferences.some(d => d.id === differenceId);
    if (alreadyFound) return;

    // Mark as found
    const newFound = {
      round: currentRound,
      id: differenceId,
      timestamp: Date.now()
    };
    setFoundDifferences(prev => [...prev, newFound]);
    setScore(prev => prev + 1);

    // If all 10 found, show reflection after a delay
    if (roundFoundDifferences.length === 9) {
      setTimeout(() => {
        setShowReflection(true);
      }, 1000);
    }
  };

  // Handle reflection selection
  const handleReflectionSelect = (reflectionId) => {
    setSelectedReflection(reflectionId);
    setTimeout(() => {
      // Move to next round or finish
      if (currentRound < rounds.length - 1) {
        setCurrentRound(prev => prev + 1);
        setFoundDifferences(prev => prev.filter(d => d.round !== currentRound));
        setSelectedReflection(null);
        setShowReflection(false);
      } else {
        setShowGameOver(true);
      }
    }, 2000);
  };

  const focusReflections = [
    {
      id: 'strong',
      text: "I maintained calm, focused attention throughout. My mind stayed present and observant.",
      isCorrect: true
    },
    {
      id: 'moderate',
      text: "I found most differences but noticed my attention wavering at times. Some moments were more focused than others.",
      isCorrect: false
    },
    {
      id: 'distracted',
      text: "I found the differences but felt distracted and rushed. I wasn't fully present during the observation.",
      isCorrect: false
    }
  ];

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Mindful Observation Game"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= totalLevels * 8} // At least 8 differences per round
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">👁️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Mindful Observation Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've strengthened your presence by noticing details around you. Remember: practicing focus here improves attention with your child too.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> The ability to notice details calmly is the same ability to notice your child's subtle cues, expressions, and needs. When you train your mind to observe mindfully here, you bring that same focused presence to every interaction with your child. Mindful observation deepens connection.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Mindful Observation Game"}
      subtitle={`Round ${currentRound + 1} of ${totalLevels}: ${currentRoundData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentRound + 1}
    >
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
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
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{roundFoundDifferences.length} / 10 differences found</span>
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(roundFoundDifferences.length / 10) * 100}%` }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Round context */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{currentRoundData.title}</h3>
            <p className="text-gray-700 mb-2">{currentRoundData.description}</p>
            <p className="text-sm text-gray-600 italic">{currentRoundData.context}</p>
          </div>

          {!allFound && !showReflection && (
            /* Comparison view */
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span><strong>Instructions:</strong> Compare the two scenes below. Click on areas where you notice differences. Take your time and observe mindfully.</span>
                </p>
              </div>

              {/* Two side-by-side scenes */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Scene 1 */}
                <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                  <h4 className="text-center font-semibold text-gray-700 mb-4">Scene A</h4>
                  <div className="relative bg-white rounded-lg h-96 border border-gray-300 overflow-hidden">
                    {/* Visual representation of a home scene using CSS */}
                    <div className="relative w-full h-full">
                      {/* Window */}
                      <div className="absolute top-4 left-4 w-20 h-16 bg-blue-100 border-2 border-blue-300 rounded"></div>
                      {/* Plant */}
                      <div className="absolute top-20 left-6 w-8 h-8 bg-green-300 rounded-full"></div>
                      {/* Curtain */}
                      <div className="absolute top-4 right-12 w-12 h-20 bg-yellow-100 border border-yellow-300"></div>
                      {/* Picture */}
                      <div className="absolute top-12 right-4 w-16 h-12 bg-gray-200 border border-gray-400 rounded"></div>
                      {/* Cushion */}
                      <div className="absolute top-32 left-8 w-12 h-12 bg-purple-200 rounded"></div>
                      {/* Book */}
                      <div className="absolute top-36 right-16 w-8 h-6 bg-brown-200 border border-brown-400"></div>
                      {/* Rug */}
                      <div className="absolute bottom-12 left-4 w-16 h-8 bg-red-100 border border-red-300"></div>
                      {/* Lamp */}
                      <div className="absolute bottom-20 right-8 w-6 h-16 bg-gray-300"></div>
                      {/* Clock */}
                      <div className="absolute bottom-32 left-8 w-10 h-10 bg-gray-200 border-2 border-gray-400 rounded-full"></div>
                      {/* Door handle */}
                      <div className="absolute bottom-24 right-12 w-3 h-6 bg-gray-400"></div>
                      {/* Table */}
                      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-brown-300"></div>
                      {/* Window reflection area */}
                      <div className="absolute top-6 left-6 w-16 h-12 bg-blue-50 opacity-50"></div>
                    </div>
                  </div>
                </div>

                {/* Scene 2 (with differences) */}
                <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                  <h4 className="text-center font-semibold text-gray-700 mb-4">Scene B</h4>
                  <div className="relative bg-white rounded-lg h-96 border border-gray-300 overflow-hidden">
                    {/* Visual representation with subtle differences */}
                    <div className="relative w-full h-full">
                      {/* Window */}
                      <div className="absolute top-4 left-4 w-20 h-16 bg-blue-100 border-2 border-blue-300 rounded"></div>
                      {/* Plant - DIFFERENCE 1: Different color (orange instead of green) */}
                      <div className="absolute top-20 left-6 w-8 h-8 bg-orange-400 rounded-full"></div>
                      {/* Curtain - DIFFERENCE 2: Different position (lower) */}
                      <div className="absolute top-8 right-12 w-12 h-20 bg-yellow-100 border border-yellow-300"></div>
                      {/* Picture - DIFFERENCE 3: Different frame (thicker border) */}
                      <div className="absolute top-12 right-4 w-16 h-12 bg-gray-300 border-4 border-gray-600 rounded"></div>
                      {/* Cushion - DIFFERENCE 4: Different pattern (darker) */}
                      <div className="absolute top-32 left-8 w-12 h-12 bg-purple-400 rounded"></div>
                      {/* Book - DIFFERENCE 5: Missing (not present in Scene B) */}
                      {/* Rug - DIFFERENCE 6: Different edge (wider) */}
                      <div className="absolute bottom-12 left-4 w-24 h-8 bg-red-100 border border-red-300"></div>
                      {/* Lamp - DIFFERENCE 7: Different shade (wider) */}
                      <div className="absolute bottom-20 right-8 w-10 h-16 bg-gray-400"></div>
                      {/* Window reflection - DIFFERENCE 8: Different reflection (darker) */}
                      <div className="absolute top-6 left-6 w-16 h-12 bg-blue-200 opacity-70"></div>
                      {/* Clock - DIFFERENCE 9: Different position (higher) */}
                      <div className="absolute bottom-40 left-8 w-10 h-10 bg-gray-200 border-2 border-gray-400 rounded-full"></div>
                      {/* Door handle - DIFFERENCE 10: Different position (higher) */}
                      <div className="absolute bottom-24 right-12 w-3 h-6 bg-gray-400"></div>
                      {/* Table */}
                      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-brown-300"></div>
                    </div>

                    {/* Clickable difference areas */}
                    {differences.map((diff) => {
                      const isFound = roundFoundDifferences.some(d => d.id === diff.id);
                      return (
                        <motion.button
                          key={diff.id}
                          whileHover={!isFound ? { scale: 1.1 } : {}}
                          whileTap={!isFound ? { scale: 0.9 } : {}}
                          onClick={() => !isFound && handleDifferenceClick(diff.id)}
                          disabled={isFound}
                          className={`absolute rounded-full border-2 transition-all ${
                            isFound
                              ? 'bg-green-500 border-green-600 opacity-50 cursor-not-allowed'
                              : 'bg-red-500 border-red-600 opacity-0 hover:opacity-30 cursor-pointer'
                          }`}
                          style={{
                            left: `${diff.x}%`,
                            top: `${diff.y}%`,
                            width: '24px',
                            height: '24px',
                            transform: 'translate(-50%, -50%)'
                          }}
                          title={diff.description}
                        >
                          {isFound && <CheckCircle className="w-6 h-6 text-white" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Found differences list */}
              {roundFoundDifferences.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Found Differences:</h4>
                  <div className="flex flex-wrap gap-2">
                    {roundFoundDifferences.map((found) => {
                      const diff = differences.find(d => d.id === found.id);
                      return (
                        <span key={found.id} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          {diff?.description}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {allFound && !showReflection && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300 text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">All 10 Differences Found!</h3>
              <p className="text-gray-700 mb-6">
                Excellent mindful observation! Now let's reflect on your focus level.
              </p>
            </motion.div>
          )}

          {showReflection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                  Reflect on Your Focus
                </h3>
                <p className="text-gray-700 mb-6">
                  How would you describe your focus level while finding the differences?
                </p>
                <div className="space-y-3">
                  {focusReflections.map((reflection, index) => (
                    <motion.button
                      key={reflection.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReflectionSelect(reflection.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedReflection === reflection.id
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-600 shadow-lg'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:shadow-md'
                      }`}
                    >
                      <p className="font-medium">{reflection.text}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {selectedReflection && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                >
                  <p className="text-sm text-amber-800">
                    <strong>💡 Parent Tip:</strong> {currentRoundData.parentTip}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default MindfulObservationGame;

