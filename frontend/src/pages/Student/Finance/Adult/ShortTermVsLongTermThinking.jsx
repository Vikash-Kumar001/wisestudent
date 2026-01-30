import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const THINKING_STYLES_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Which choice supports long-term stability?",
    options: [
      {
        id: "today",
        label: "Solving only today's problem",
        reflection: "Solving only today's problem provides temporary relief but doesn't address underlying issues. This short-term approach often leads to the same problems recurring and creates long-term financial instability.",
        isCorrect: false,
      },
      
      {
        id: "ignore",
        label: "Ignoring both current and future problems",
        reflection: "Ignoring both current and future problems leads to mounting issues and financial crisis. Neither short-term nor long-term thinking is beneficial when problems are completely ignored.",
        isCorrect: false,
      },
      {
        id: "spend",
        label: "Spending all available resources immediately",
        reflection: "Spending all available resources immediately depletes your financial buffer and leaves you vulnerable to future emergencies. This approach undermines both short-term and long-term stability.",
        isCorrect: false,
      },
      {
        id: "future",
        label: "Planning for future needs",
        reflection: "Exactly! Planning for future needs supports long-term stability by addressing root causes and preventing problems from recurring. This approach builds financial resilience over time.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the main benefit of long-term financial thinking?",
    options: [
      
      {
        id: "immediate",
        label: "Provides immediate gratification",
        reflection: "While long-term thinking might occasionally provide satisfaction from progress, its main benefit isn't immediate gratification. The value comes from sustained financial security and stability over time.",
        isCorrect: false,
      },
      {
        id: "complexity",
        label: "Makes financial decisions more complex",
        reflection: "Long-term thinking can make some decisions more complex, but this isn't the main benefit. The complexity is a trade-off for better outcomes, not the primary advantage of long-term planning.",
        isCorrect: false,
      },
      {
        id: "prevention",
        label: "Prevents problems from recurring",
        reflection: "Perfect! The main benefit of long-term financial thinking is preventing problems from recurring by addressing root causes and building sustainable financial habits and systems.",
        isCorrect: true,
      },
      {
        id: "delay",
        label: "Delays all financial enjoyment indefinitely",
        reflection: "Long-term financial thinking doesn't delay all financial enjoyment indefinitely. It's about balancing current needs with future security, allowing for both responsible spending and sustainable planning.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should you balance short-term and long-term financial decisions?",
    options: [
      {
        id: "balance",
        label: "Address immediate needs while building long-term foundations",
        reflection: "Excellent! The best approach is to address immediate needs while simultaneously building long-term foundations. This creates stability in both the present and future without neglecting either timeframe.",
        isCorrect: true,
      },
      {
        id: "ignore",
        label: "Ignore short-term needs to focus completely on long-term goals",
        reflection: "Ignoring short-term needs to focus completely on long-term goals can lead to immediate financial crisis and stress. This imbalance often undermines long-term progress due to urgent short-term problems.",
        isCorrect: false,
      },
      {
        id: "opposite",
        label: "Focus only on short-term needs and let long-term handle itself",
        reflection: "Focusing only on short-term needs while letting long-term handle itself often leads to repeated financial stress and missed opportunities for building wealth and security over time.",
        isCorrect: false,
      },
      {
        id: "separate",
        label: "Keep short-term and long-term finances completely separate",
        reflection: "While it can be helpful to categorize finances, keeping short-term and long-term finances completely separate isn't practical. They're interconnected, and decisions in one area affect the other.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of poor long-term financial thinking?",
    options: [
      
      {
        id: "plan",
        label: "Having detailed long-term financial plans",
        reflection: "Having detailed long-term financial plans is actually a sign of good long-term thinking, not poor thinking. It shows you're actively planning for future stability and growth.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "Maintaining consistent long-term savings habits",
        reflection: "Maintaining consistent long-term savings habits is a positive indicator of good financial management, not a warning sign. It demonstrates commitment to future financial security.",
        isCorrect: false,
      },
      {
        id: "review",
        label: "Regularly reviewing and adjusting financial strategies",
        reflection: "Regularly reviewing and adjusting financial strategies is a sign of good long-term thinking. It shows you're actively managing your financial future and adapting to changing circumstances.",
        isCorrect: false,
      },
      {
        id: "repeat",
        label: "Repeatedly facing the same financial problems",
        reflection: "Exactly! Repeatedly facing the same financial problems is a clear warning sign of poor long-term financial thinking. It indicates that root causes aren't being addressed and sustainable solutions aren't being implemented.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the outcome of consistently applying long-term financial thinking?",
    options: [
      
      {
        id: "spending",
        label: "Ability to spend more freely on immediate wants",
        reflection: "While long-term financial thinking can eventually provide more financial freedom, its primary outcome isn't enabling more immediate spending. The focus is on stability and security, not increased consumption.",
        isCorrect: false,
      },
      {
        id: "stability",
        label: "Reduced financial stress and increased stability",
        reflection: "Exactly! Consistently applying long-term financial thinking leads to reduced financial stress and increased stability by building resilient financial systems and addressing problems at their source rather than just treating symptoms.",
        isCorrect: true,
      },
      {
        id: "complexity",
        label: "More complex financial decision-making processes",
        reflection: "While long-term thinking can add complexity to some decisions, this isn't the primary outcome. The goal is better financial outcomes, not necessarily more complex processes for their own sake.",
        isCorrect: false,
      },
      {
        id: "avoidance",
        label: "Ability to avoid all financial responsibilities",
        reflection: "Long-term financial thinking doesn't help you avoid responsibilities - it helps you manage them better. It's about taking responsibility for your financial future in a sustainable way.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = THINKING_STYLES_STAGES.length;
const successThreshold = totalStages;

const ShortTermVsLongTermThinking = () => {
  const location = useLocation();
  const gameId = "finance-adults-93";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 20;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const reflectionPrompts = useMemo(
    () => [
      "How can you develop better long-term financial thinking habits?",
      "What specific strategies will you implement to balance short-term needs with long-term goals?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = THINKING_STYLES_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);
    
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0);
        setShowResult(true);
      }, 2500);
    }
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleRetry = () => {
    resetFeedback();
    setCurrentStage(0);
    setHistory([]);
    setSelectedOption(null);
    setCoins(0);
    setFinalScore(0);
    setShowResult(false);
  };

  const subtitle = `Stage ${Math.min(currentStage + 1, totalStages)} of ${totalStages}`;
  const stage = THINKING_STYLES_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Short-Term vs Long-Term Thinking"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={THINKING_STYLES_STAGES.length}
      currentLevel={Math.min(currentStage + 1, THINKING_STYLES_STAGES.length)}
      totalLevels={THINKING_STYLES_STAGES.length}
      gameId={gameId}
      gameType="finance"
      showGameOver={showResult}
      showConfetti={showResult && hasPassed}
      shouldSubmitGameCompletion={hasPassed}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-5 text-white">
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
            <span>Scenario</span>
            <span>Thinking Styles</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {stage.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${isSelected
                      ? option.isCorrect
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-rose-400 bg-rose-500/10"
                      : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                    }`}
                >
                  <div className="flex justify-between items-center mb-2 text-sm text-white/70">
                    <span>Choice {option.id.toUpperCase()}</span>
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
          {(showResult || showFeedback) && (
            <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
              <h4 className="text-lg font-semibold text-white">Reflection</h4>
              {selectedReflection && (
                <div className="max-h-24 overflow-y-auto pr-2">
                  <p className="text-sm text-white/90">{selectedReflection}</p>
                </div>
              )}
              {showFeedback && !showResult && (
                <div className="mt-4 flex justify-center">
                  {canProceed ? (
                    <button
                      onClick={() => {
                        if (currentStage < totalStages - 1) {
                          setCurrentStage((prev) => prev + 1);
                          setSelectedOption(null);
                          setSelectedReflection(null);
                          setShowFeedback(false);
                          setCanProceed(false);
                        }
                      }}
                      className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                    >
                      Continue
                    </button>
                  ) : (
                    <div className="py-2 px-6 text-white font-semibold">Reading...</div>
                  )}
                </div>
              )}
              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      const updatedHistory = [
                        ...history,
                        { stageId: THINKING_STYLES_STAGES[currentStage].id, isCorrect: THINKING_STYLES_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
                      ];
                      const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
                      const passed = correctCount === successThreshold;
                      setFinalScore(correctCount);
                      setCoins(passed ? totalCoins : 0);
                      setShowResult(true);
                    }}
                    className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                  >
                  Finish
                  </button>
                </div>
              )}
              {showResult && (
                <>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {reflectionPrompts.map((prompt) => (
                      <li key={prompt}>{prompt}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-white/70">
                    Skill unlocked: <strong>Long-Term Financial Planning</strong>
                  </p>
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      Answer all {totalStages} choices correctly to earn the full reward.
                    </p>
                  )}
                  {!hasPassed && (
                    <button
                      onClick={handleRetry}
                      className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
                    >
                      Try Again
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          
        </div>
        {showResult && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">Reflection Prompts</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p className="text-sm text-white/70">
              Skill unlocked: <strong>Long-Term Financial Planning</strong>
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                Answer all {totalStages} choices correctly to earn the full reward.
              </p>
            )}
            {!hasPassed && (
              <button
                onClick={handleRetry}
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ShortTermVsLongTermThinking;