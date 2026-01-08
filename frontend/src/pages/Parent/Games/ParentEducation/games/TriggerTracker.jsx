import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const TriggerTracker = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-5";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedTriggers, setSelectedTriggers] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // 15 scenario cards that can trigger emotions
  const triggerScenarios = [
    { id: 'lateness', label: 'Running Late', emoji: '⏰', description: 'Family members arriving late or delaying plans', category: 'time-pressure' },
    { id: 'noise', label: 'Loud Noises', emoji: '🔊', description: 'Persistent noise from children, TV, or environment', category: 'sensory' },
    { id: 'disrespect', label: 'Disrespect', emoji: '😠', description: 'Feeling disrespected or dismissed by others', category: 'relational' },
    { id: 'mess', label: 'Mess & Clutter', emoji: '🧹', description: 'Untidy spaces, toys scattered, dishes piling up', category: 'control' },
    { id: 'interruption', label: 'Constant Interruptions', emoji: '📞', description: 'Being interrupted while working or talking', category: 'boundary' },
    { id: 'disagreement', label: 'Parenting Disagreements', emoji: '👥', description: 'Conflict with partner about parenting decisions', category: 'relational' },
    { id: 'forgotten', label: 'Being Forgotten', emoji: '😔', description: 'Children or partner forgetting promises or needs', category: 'relational' },
    { id: 'criticism', label: 'Criticism or Judgement', emoji: '👀', description: 'Feeling judged by others or self-criticism', category: 'self-worth' },
    { id: 'multitasking', label: 'Too Much to Do', emoji: '📋', description: 'Overwhelming to-do lists and responsibilities', category: 'time-pressure' },
    { id: 'repetition', label: 'Repeating Instructions', emoji: '🔁', description: 'Having to repeat yourself multiple times', category: 'boundary' },
    { id: 'screen-time', label: 'Excessive Screen Time', emoji: '📱', description: 'Children spending too much time on devices', category: 'control' },
    { id: 'tiredness', label: 'Exhaustion', emoji: '😴', description: 'Being physically or emotionally drained', category: 'self-care' },
    { id: 'financial', label: 'Financial Stress', emoji: '💰', description: 'Worrying about money or expenses', category: 'safety' },
    { id: 'comparison', label: 'Social Comparison', emoji: '📊', description: 'Comparing yourself to other parents', category: 'self-worth' },
    { id: 'chaos', label: 'Chaos & Disorder', emoji: '🌪️', description: 'Feeling like everything is out of control', category: 'control' }
  ];

  // Round-based scenarios (5 rounds, each showing 6 trigger options)
  const rounds = [
    {
      id: 1,
      title: "Morning Rush Triggers",
      description: "Which situations during your morning routine most often trigger frustration or stress?",
      triggers: ['lateness', 'noise', 'mess', 'interruption', 'multitasking', 'chaos'],
      commonPatterns: ['time-pressure', 'control'],
      insight: "Morning triggers often relate to time pressure and control. When you're rushing, small disruptions feel bigger. Preparing the night before can reduce morning triggers.",
      parentTip: "Write down your top morning triggers. For each one, prepare a calm response in advance. For example: 'When we're running late, I'll take 3 deep breaths instead of rushing everyone.'"
    },
    {
      id: 2,
      title: "Relational Triggers",
      description: "Which interactions with family members most often trigger anger or sadness?",
      triggers: ['disrespect', 'disagreement', 'forgotten', 'criticism', 'comparison', 'interruption'],
      commonPatterns: ['relational', 'self-worth', 'boundary'],
      insight: "Relational triggers often stem from feeling unheard, disrespected, or dismissed. These trigger intense emotions because they touch on core needs for respect and connection.",
      parentTip: "When you notice a relational trigger, pause and name it: 'I'm feeling disrespected right now.' This helps you respond rather than react. Prepare calm responses like: 'I hear you're upset. Can we talk about this when we're both calmer?'"
    },
    {
      id: 3,
      title: "Control & Environment Triggers",
      description: "Which environmental or situational factors most trigger emotional reactions?",
      triggers: ['mess', 'noise', 'screen-time', 'chaos', 'multitasking', 'lateness'],
      commonPatterns: ['control', 'sensory', 'boundary'],
      insight: "Control-related triggers often stem from a need for predictability and order. When things feel chaotic or out of control, it can trigger anxiety, anger, or overwhelm.",
      parentTip: "Identify your control triggers and set realistic boundaries. Instead of trying to control everything, choose 1-2 non-negotiables. For example: 'I need the kitchen clean before bed' - communicate this clearly and consistently."
    },
    {
      id: 4,
      title: "Internal & Self-Care Triggers",
      description: "Which personal or internal factors most often contribute to emotional reactivity?",
      triggers: ['tiredness', 'financial', 'criticism', 'comparison', 'multitasking', 'forgotten'],
      commonPatterns: ['self-care', 'self-worth', 'safety'],
      insight: "Internal triggers often relate to unmet needs - rest, security, or self-worth. When you're exhausted or feeling inadequate, small triggers can feel overwhelming.",
      parentTip: "Your internal state affects your trigger sensitivity. When you're tired or stressed, you're more reactive. Prioritize self-care: sleep, nutrition, and moments of rest reduce emotional reactivity."
    },
    {
      id: 5,
      title: "Boundary & Time Triggers",
      description: "Which boundary violations or time-related situations most trigger emotional responses?",
      triggers: ['interruption', 'repetition', 'lateness', 'multitasking', 'disrespect', 'noise'],
      commonPatterns: ['boundary', 'time-pressure', 'respect'],
      insight: "Boundary and time triggers often occur when your limits aren't respected or you feel time-pressured. These trigger anger because they feel like violations of your needs or autonomy.",
      parentTip: "Practice setting clear boundaries before you're triggered. Say: 'I need 10 minutes of quiet time. After that, I'll be ready to help.' Writing down your boundaries helps you communicate them calmly when triggered."
    }
  ];

  const handleTriggerSelect = (roundIndex, triggerId) => {
    const roundKey = `round${roundIndex}`;
    const currentSelections = selectedTriggers[roundKey] || [];
    
    // Allow selecting up to 3 triggers per round
    if (currentSelections.includes(triggerId)) {
      // Deselect if already selected
      setSelectedTriggers({
        ...selectedTriggers,
        [roundKey]: currentSelections.filter(id => id !== triggerId)
      });
    } else if (currentSelections.length < 3) {
      // Add to selection if less than 3
      setSelectedTriggers({
        ...selectedTriggers,
        [roundKey]: [...currentSelections, triggerId]
      });
    }
  };

  const handleNext = () => {
    const roundKey = `round${currentQuestion}`;
    const selections = selectedTriggers[roundKey] || [];
    
    // Check if user selected at least one trigger (for scoring)
    if (selections.length > 0) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestion < rounds.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const currentRound = rounds[currentQuestion];
  const roundKey = `round${currentQuestion}`;
  const currentSelections = selectedTriggers[roundKey] || [];
  const availableTriggers = currentRound.triggers.map(id => 
    triggerScenarios.find(trigger => trigger.id === id)
  ).filter(Boolean);

  // Analyze patterns from selected triggers
  const getPatternAnalysis = () => {
    const selectedTriggerObjects = currentSelections.map(id => 
      triggerScenarios.find(t => t.id === id)
    ).filter(Boolean);
    
    const patternCounts = {};
    selectedTriggerObjects.forEach(trigger => {
      patternCounts[trigger.category] = (patternCounts[trigger.category] || 0) + 1;
    });
    
    const topPattern = Object.keys(patternCounts).reduce((a, b) => 
      patternCounts[a] > patternCounts[b] ? a : b, Object.keys(patternCounts)[0]
    );
    
    return { patternCounts, topPattern };
  };

  const patternAnalysis = currentSelections.length > 0 ? getPatternAnalysis() : null;
  const hasSelectedEnough = currentSelections.length >= 1;

  return (
    <ParentGameShell
      title={gameData?.title || "Trigger Tracker"}
      subtitle={gameData?.description || "Identify what situations provoke anger or sadness"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion}
    >
      {currentQuestion < rounds.length ? (
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Round {currentQuestion + 1} of {rounds.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Selected: {currentSelections.length}/3
                </span>
              </div>
            </div>

            {/* Round Description */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {currentRound.title}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {currentRound.description}
                </p>
                <p className="text-sm text-orange-700 mt-3 font-medium">
                  💡 Select up to 3 triggers that resonate with you (1-3 selections)
                </p>
              </div>
            </div>

            {/* Trigger Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {availableTriggers.map((trigger) => {
                const isSelected = currentSelections.includes(trigger.id);
                const canSelect = currentSelections.length < 3 || isSelected;

                return (
                  <button
                    key={trigger.id}
                    onClick={() => canSelect && handleTriggerSelect(currentQuestion, trigger.id)}
                    disabled={!canSelect}
                    className={`p-5 rounded-xl border-2 transition-all text-center relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-br from-orange-100 to-red-100 border-orange-400 scale-105 shadow-lg ring-2 ring-orange-300'
                        : canSelect
                        ? 'bg-white border-gray-300 hover:border-orange-300 hover:shadow-md hover:scale-105'
                        : 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-5xl mb-2">{trigger.emoji}</div>
                    <div className="font-bold text-sm mb-1">{trigger.label}</div>
                    <div className="text-xs text-gray-600">{trigger.description}</div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pattern Analysis */}
            {currentSelections.length > 0 && (
              <div className="mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">🔍</span>
                    Trigger Pattern Analysis
                  </h4>
                  <div className="space-y-2">
                    {currentSelections.map((triggerId, idx) => {
                      const trigger = triggerScenarios.find(t => t.id === triggerId);
                      return (
                        <div key={idx} className="flex items-center gap-2 text-sm text-blue-800">
                          <span className="font-semibold">•</span>
                          <span>{trigger?.label}</span>
                          <span className="text-xs bg-blue-200 px-2 py-0.5 rounded-full">
                            {trigger?.category}
                          </span>
                        </div>
                      );
                    })}
                    {patternAnalysis && (
                      <div className="mt-4 pt-4 border-t border-blue-300">
                        <p className="text-sm font-semibold text-blue-900">
                          Pattern Detected: <span className="text-blue-700">{patternAnalysis.topPattern}</span>
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          {patternAnalysis.patternCounts[patternAnalysis.topPattern]} of your selected triggers relate to this pattern.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Insight Message */}
            {currentSelections.length > 0 && (
              <div className="mt-6 p-4 rounded-xl border-2 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0 text-green-600">
                    💡
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-2 text-green-800">
                      Insight
                    </h4>
                    <p className="text-sm leading-relaxed mb-2 text-green-700">
                      {currentRound.insight}
                    </p>
                    <div className="bg-white/60 rounded-lg p-3 mt-3 border border-blue-200">
                      <p className="text-xs font-semibold text-blue-800 mb-1">Parent Tip:</p>
                      <p className="text-xs text-blue-700">
                        {currentRound.parentTip}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  {currentQuestion < rounds.length - 1 ? 'Continue to Next Round' : 'Finish & View Summary'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </ParentGameShell>
  );
};

export default TriggerTracker;

