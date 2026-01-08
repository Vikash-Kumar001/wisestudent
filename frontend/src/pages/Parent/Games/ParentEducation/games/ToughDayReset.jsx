import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Coffee, BookOpen, Moon, Heart, Sparkles, CheckCircle, ArrowRight } from "lucide-react";

const ToughDayReset = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-53";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Reflection, 2: Self-kindness, 3: Complete
  const [triggerReflection, setTriggerReflection] = useState("");
  const [handledWell, setHandledWell] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const selfKindnessActions = [
    {
      id: 'rest',
      label: 'Take a Rest',
      description: 'Find a quiet space, close your eyes, and give yourself permission to rest. Even 10 minutes can help you reset.',
      icon: Moon,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-300',
      emoji: '😴'
    },
    {
      id: 'tea',
      label: 'Warm Tea Moment',
      description: 'Make yourself a warm cup of tea. Sit quietly and savor each sip. Let the warmth comfort you.',
      icon: Coffee,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300',
      emoji: '☕'
    },
    {
      id: 'journal',
      label: 'Journal Your Thoughts',
      description: 'Write freely about your day. No structure needed—just let your thoughts flow onto paper.',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      emoji: '📝'
    }
  ];

  const canProceedToActions = triggerReflection.trim().length >= 10 && handledWell.trim().length >= 10;

  const handleProceedToActions = () => {
    if (canProceedToActions) {
      setStep(2);
      setScore(1); // Award score for completing reflection
    }
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setScore(prev => prev + 1); // Award score for selecting action
  };

  const handleComplete = () => {
    if (selectedAction) {
      setStep(3);
      setShowGameOver(true);
    }
  };

  if (showGameOver && step === 3) {
    const ActionIcon = selectedAction.icon;

    return (
      <ParentGameShell
        title={gameData?.title || "Tough Day Reset"}
        subtitle="Reset Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={1}
        allAnswersCorrect={score >= 2}
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
                {selectedAction.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Reset is Complete</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've reflected on your day and chosen a self-kindness action. You've given yourself permission to reset.
              </p>
            </div>

            {/* Reflection Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-blue-600" />
                Your Reflection
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">What triggered me today?</p>
                  <p className="text-gray-800 bg-white rounded-lg p-3 border border-blue-200">
                    {triggerReflection}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">What did I handle well?</p>
                  <p className="text-gray-800 bg-white rounded-lg p-3 border border-blue-200">
                    {handledWell}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Action */}
            <div className={`bg-gradient-to-br ${selectedAction.bgColor} rounded-xl p-6 border-2 ${selectedAction.borderColor} mb-6`}>
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${selectedAction.color} flex-shrink-0`}>
                  <ActionIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedAction.label}</h3>
                  <p className="text-gray-700">{selectedAction.description}</p>
                </div>
              </div>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> One bad day doesn't make you a bad parent—it makes you human. Every parent has tough days. What matters is that you're taking time to reflect, acknowledge what went well, and practice self-kindness. When you reset and care for yourself, you're better able to care for your children. Tomorrow is a fresh start.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Tough Day Reset"}
      subtitle={step === 1 ? "Reflect on Your Day" : step === 2 ? "Choose Self-Kindness" : "Complete"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {step === 1 && (
            /* Reflection Step */
            <>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💭</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Reflect on Your Tough Day</h2>
                <p className="text-gray-600 text-lg">
                  Take a moment to acknowledge what happened today. Both the challenges and the strengths.
                </p>
              </div>

              <div className="space-y-6 mb-6">
                {/* What triggered me today */}
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-200">
                  <label className="block text-lg font-bold text-gray-800 mb-3">
                    What triggered me today?
                  </label>
                  <textarea
                    value={triggerReflection}
                    onChange={(e) => setTriggerReflection(e.target.value)}
                    placeholder="What situations, events, or interactions made today difficult? (e.g., 'My child had a meltdown at the store, work deadline pressure, feeling overwhelmed by everything I need to do')"
                    className="w-full h-32 p-4 border-2 border-red-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none text-gray-700"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    {triggerReflection.length} characters {triggerReflection.trim().length >= 10 && (
                      <span className="text-green-600 font-semibold">✓</span>
                    )}
                  </p>
                  {triggerReflection.trim().length > 0 && triggerReflection.trim().length < 10 && (
                    <p className="mt-1 text-xs text-red-600">Please write at least 10 characters</p>
                  )}
                </div>

                {/* What did I handle well */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <label className="block text-lg font-bold text-gray-800 mb-3">
                    What did I handle well?
                  </label>
                  <textarea
                    value={handledWell}
                    onChange={(e) => setHandledWell(e.target.value)}
                    placeholder="What moments, responses, or actions did you handle well today? (e.g., 'I stayed calm during the morning rush, I listened when my child was upset, I took a breath before reacting')"
                    className="w-full h-32 p-4 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none text-gray-700"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    {handledWell.length} characters {handledWell.trim().length >= 10 && (
                      <span className="text-green-600 font-semibold">✓</span>
                    )}
                  </p>
                  {handledWell.trim().length > 0 && handledWell.trim().length < 10 && (
                    <p className="mt-1 text-xs text-red-600">Please write at least 10 characters</p>
                  )}
                </div>
              </div>

              {/* Parent Tip */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>💡 Parent Tip:</strong> One bad day doesn't make you a bad parent—it makes you human. Reflecting on both challenges and strengths helps you see the full picture of your day, not just the difficult parts.
                </p>
              </div>

              {/* Proceed Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToActions}
                disabled={!canProceedToActions}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue to Self-Kindness Actions
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </>
          )}

          {step === 2 && (
            /* Self-Kindness Actions Step */
            <>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💙</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose a Self-Kindness Action</h2>
                <p className="text-gray-600 text-lg">
                  Now, give yourself permission to reset. Choose one action that feels right for you right now.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {selfKindnessActions.map((action) => {
                  const ActionIcon = action.icon;
                  const isSelected = selectedAction?.id === action.id;

                  return (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleActionSelect(action)}
                      className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                        isSelected
                          ? `${action.borderColor} bg-gradient-to-br ${action.bgColor} shadow-lg`
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-4 rounded-xl bg-gradient-to-br ${action.color} flex-shrink-0`}>
                          <ActionIcon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{action.label}</h3>
                            {isSelected && (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            )}
                          </div>
                          <p className="text-gray-700">{action.description}</p>
                        </div>
                        <div className="text-3xl">{action.emoji}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Parent Tip */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>💡 Parent Tip:</strong> Self-kindness isn't selfish—it's essential. When you take care of yourself, you're better able to care for your children. One bad day doesn't define you as a parent.
                </p>
              </div>

              {/* Complete Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                disabled={!selectedAction}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Complete Reset
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default ToughDayReset;

