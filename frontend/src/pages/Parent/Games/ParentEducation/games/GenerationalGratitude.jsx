import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, Sparkles, BookOpen, CheckCircle, ArrowRight, Star } from "lucide-react";

const GenerationalGratitude = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-87";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Reflection, 2: Choose to Carry Forward, 3: Complete
  const [reflection, setReflection] = useState("");
  const [lessonsIdentified, setLessonsIdentified] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);

  const extractLessons = (text) => {
    // Extract key lessons/phrases from the reflection
    const sentences = text.split(/[.!?]\s+/).filter(s => s.trim().length > 10);
    return sentences.slice(0, 5); // Take up to 5 sentences as potential lessons
  };

  const handleReflectionComplete = () => {
    if (reflection.trim().length >= 50) {
      const lessons = extractLessons(reflection);
      setLessonsIdentified(lessons);
      setStep(2);
    }
  };

  const handleComplete = () => {
    if (selectedLesson) {
      setShowGameOver(true);
    }
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Generational Gratitude"}
        subtitle="Reflection Complete!"
        showGameOver={true}
        score={1}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={true}
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
                🌳
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Generational Wisdom Acknowledged</h2>
              <p className="text-lg text-gray-600">
                You've transformed lessons from the past into wisdom for the future.
              </p>
            </div>

            {/* Reflection Display */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Your Reflection
              </h3>
              <div className="bg-white rounded-lg p-5 border border-blue-200">
                <p className="text-gray-800 leading-relaxed italic text-lg">
                  "{reflection}"
                </p>
              </div>
            </div>

            {/* Selected Lesson to Carry Forward */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-600" />
                What I'll Carry Forward
              </h3>
              <div className="bg-white rounded-lg p-5 border border-amber-200">
                <p className="text-gray-800 leading-relaxed text-lg font-semibold">
                  "{selectedLesson}"
                </p>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-600" />
                Transforming Wounds into Wisdom
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Gratitude Heals:</strong> When you acknowledge what your parents taught you about love—even through their mistakes—you transform old wounds into timeless wisdom. This gratitude doesn't erase the past, but it gives it meaning.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Lessons in Imperfection:</strong> Your parents were human, and their mistakes were part of their journey. By recognizing what you learned from both their successes and struggles, you honor their humanity while choosing what to carry forward.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Breaking Cycles:</strong> Acknowledging generational patterns—both positive and challenging—helps you consciously choose what to pass on to your children and what to transform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Wisdom Across Generations:</strong> The lessons you carry forward become part of your parenting legacy. You're not just parenting your children—you're honoring the generations before you while creating new patterns for the future.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Gratitude transforms old wounds into timeless wisdom. When you take time to reflect on what your parents, elders, and mentors taught you about love—including the lessons learned through their mistakes—you're doing powerful healing work. This reflection isn't about ignoring pain or making excuses. It's about finding the wisdom in your story, acknowledging what was good, learning from what was hard, and consciously choosing what you'll carry forward to your own children. This practice breaks cycles of pain and creates cycles of growth.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  // Step 2: Choose what to carry forward
  if (step === 2) {
    return (
      <ParentGameShell
        title={gameData?.title || "Generational Gratitude"}
        subtitle="Choose What to Carry Forward"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={2}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose What to Carry Forward</h2>
              <p className="text-gray-600">
                From your reflection, select one lesson or value you want to carry forward to your own parenting.
              </p>
            </div>

            {/* Your Reflection Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Your Reflection:</h3>
              <p className="text-gray-700 italic text-sm line-clamp-3">"{reflection.substring(0, 200)}..."</p>
            </div>

            {/* Lessons to Choose From */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">What will you carry forward?</h3>
              <div className="space-y-3">
                {lessonsIdentified.length > 0 ? (
                  lessonsIdentified.map((lesson, index) => {
                    const isSelected = selectedLesson === lesson;
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400 border-4 shadow-lg'
                            : 'bg-white border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-gray-800 font-medium flex-1">{lesson}</p>
                          {isSelected && (
                            <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 ml-4" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300 text-center">
                    <p className="text-gray-600 mb-4">No lessons identified yet. Please write a longer reflection.</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(1)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                    >
                      Return to Reflection
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Custom Option */}
              {lessonsIdentified.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const custom = prompt("Enter a lesson or value you want to carry forward:");
                    if (custom && custom.trim()) {
                      setSelectedLesson(custom.trim());
                    }
                  }}
                  className="w-full mt-4 p-5 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 text-gray-700 font-medium transition-all"
                >
                  + Add my own lesson
                </motion.button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Back to Reflection
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                disabled={!selectedLesson}
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Complete Reflection
                <CheckCircle className="w-5 h-5" />
              </motion.button>
            </div>

            {!selectedLesson && (
              <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
                <p className="text-yellow-800 text-sm text-center">
                  Please select one lesson or value to carry forward.
                </p>
              </div>
            )}

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Parent Tip:</strong> Gratitude transforms old wounds into timeless wisdom. Choosing what to carry forward helps you honor the past while creating your own parenting path.
              </p>
            </div>
          </motion.div>
        </div>
      </ParentGameShell>
    );
  }

  // Step 1: Reflection Writing
  return (
    <ParentGameShell
      title={gameData?.title || "Generational Gratitude"}
      subtitle="Acknowledge Generational Wisdom"
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
            <div className="text-6xl mb-4">🌳</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Generational Gratitude</h2>
            <p className="text-gray-600 text-lg">
              Acknowledge lessons learned from parents, elders, and mentors.
            </p>
          </div>

          {/* Reflection Prompt */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-7 h-7 text-blue-600" />
              Reflection Prompt
            </h3>
            <div className="bg-white rounded-lg p-5 border border-blue-200 mb-4">
              <p className="text-xl font-semibold text-gray-800 mb-3">
                "What did my parents teach me about love, even through mistakes?"
              </p>
              <p className="text-sm text-gray-600">
                Reflect on your parents, elders, or mentors. What did they teach you about love, parenting, relationships, or life—both through their strengths and through their mistakes? What wisdom can you find in their imperfect humanity? How did their challenges teach you valuable lessons?
              </p>
            </div>
            
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Write your reflection here... Think about the lessons—both positive and challenging—that shaped you. What did your parents' mistakes teach you? What did their love show you? What patterns do you want to continue, and what would you do differently?"
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800 min-h-[300px] resize-none"
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-gray-600">
                {(reflection?.length || 0)} characters (minimum 50)
              </p>
              {reflection && reflection.length >= 50 && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-semibold">Ready to continue</span>
                </div>
              )}
            </div>
          </div>

          {/* Guidance */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-2">💡 Reflection Guidelines:</p>
            <ul className="text-xs text-gray-700 space-y-1 ml-4">
              <li>• Consider both positive lessons and challenging ones</li>
              <li>• Acknowledge their humanity and imperfections</li>
              <li>• Identify what you learned about love through their mistakes</li>
              <li>• Recognize patterns you want to continue or transform</li>
              <li>• Find gratitude for the wisdom gained, even from difficult experiences</li>
            </ul>
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReflectionComplete}
            disabled={!reflection.trim() || reflection.trim().length < 50}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue to Choose What to Carry Forward
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {(!reflection.trim() || reflection.trim().length < 50) && (
            <div className="mt-4 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
              <p className="text-yellow-800 text-sm text-center">
                Please write at least 50 characters to continue.
              </p>
            </div>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Gratitude transforms old wounds into timeless wisdom. Taking time to acknowledge what your parents taught you—even through their mistakes—helps you find meaning in your past and consciously choose what to carry forward.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default GenerationalGratitude;

