import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SEASONAL_INCOME_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Your income is seasonal. What helps?",
    options: [
      {
        id: "spend",
        label: "Spending freely in peak months",
        reflection: "Spending freely during peak months can lead to financial stress during low-income periods. You'll struggle to meet your basic needs when income drops.",
        isCorrect: false,
      },
      
      {
        id: "borrow",
        label: "Borrow money when income is low",
        reflection: "Relying on borrowing during low-income periods can lead to a debt trap. It's better to build a savings buffer beforehand.",
        isCorrect: false,
      },
      {
        id: "save",
        label: "Saving for low-income periods",
        reflection: "Excellent! Saving during peak months provides a financial cushion that ensures stability during lean periods. This is the key to seasonal income management.",
        isCorrect: true,
      },
      {
        id: "ignore",
        label: "Ignore the seasonal nature of income",
        reflection: "Ignoring the seasonal nature of your income leads to financial surprises and unpreparedness. Planning is essential for income stability.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "How much of your peak income should you save for off-season?",
    options: [
      {
        id: "none",
        label: "None, I'll earn when I work",
        reflection: "This approach leaves you vulnerable during off-seasons. Without savings, you'll face financial stress and may need to borrow.",
        isCorrect: false,
      },
      {
        id: "half",
        label: "At least 50% for lean months",
        reflection: "Perfect! Saving at least half your peak income creates a solid buffer. This ensures you can maintain your lifestyle throughout the year.",
        isCorrect: true,
      },
      {
        id: "quarter",
        label: "Just 25% for emergencies",
        reflection: "While 25% is a start, it may not be sufficient for extended low-income periods. Aim for a higher savings rate to ensure stability.",
        isCorrect: false,
      },
      {
        id: "all",
        label: "Save everything, live minimally",
        reflection: "Saving everything can lead to burnout and reduced quality of life. Find a balance between saving and enjoying your peak income.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "What's the best way to manage expenses during off-season?",
    options: [
      {
        id: "adjust",
        label: "Adjust lifestyle to match income",
        reflection: "Excellent! Adjusting your lifestyle to match your current income prevents financial strain. This flexibility is key to seasonal income success.",
        isCorrect: true,
      },
      {
        id: "same",
        label: "Keep spending the same as peak months",
        reflection: "Maintaining peak spending during low-income periods quickly depletes your savings. This approach is unsustainable and leads to financial stress.",
        isCorrect: false,
      },
      
      {
        id: "credit",
        label: "Use credit cards to maintain lifestyle",
        reflection: "Using credit to maintain lifestyle during low-income periods creates debt that's hard to repay. It's better to adjust spending to match income.",
        isCorrect: false,
      },
      {
        id: "panic",
        label: "Panic and spend irrationally",
        reflection: "Panic spending during financial stress makes the situation worse. Stay calm and plan your expenses based on available income.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "When should you start planning for the off-season?",
    options: [
      {
        id: "later",
        label: "When the busy season is over",
        reflection: "Waiting until the busy season is over is too late. By then, you've already spent much of your peak income, leaving little for savings.",
        isCorrect: false,
      },
      
      {
        id: "middle",
        label: "Halfway through the busy season",
        reflection: "Starting halfway through the busy season gives you less time to build adequate savings. It's better to start planning as early as possible.",
        isCorrect: false,
      },
      {
        id: "never",
        label: "Planning is unnecessary for seasonal work",
        reflection: "Without planning, seasonal income leads to financial instability. Planning is essential for managing the natural income fluctuations.",
        isCorrect: false,
      },
      {
        id: "early",
        label: "Before the busy season starts",
        reflection: "Perfect! Planning before the busy season starts allows you to set aside money for lean periods. This proactive approach ensures financial stability.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the biggest benefit of seasonal income planning?",
    options: [
      {
        id: "stress",
        label: "Reduced financial stress year-round",
        reflection: "Exactly! Proper planning eliminates the anxiety of not knowing how you'll pay bills during low-income periods. This peace of mind is invaluable.",
        isCorrect: true,
      },
      {
        id: "spend",
        label: "Ability to spend more during peak times",
        reflection: "While planning helps you enjoy peak income, the real benefit is financial stability throughout the year, not just increased spending during busy periods.",
        isCorrect: false,
      },
      {
        id: "work",
        label: "Freedom to take on more work",
        reflection: "Planning doesn't necessarily lead to more work. The main benefit is managing your existing income more effectively for year-round stability.",
        isCorrect: false,
      },
      {
        id: "lucky",
        label: "Relying on luck to get through lean times",
        reflection: "Relying on luck is not a strategy. Proper planning creates predictable outcomes and financial security, regardless of external circumstances.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = SEASONAL_INCOME_STAGES.length;
const successThreshold = totalStages;

const SeasonalIncomePlanning = () => {
  const location = useLocation();
  const gameId = "finance-adults-76";
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
      "How can you balance enjoying peak income while preparing for lean periods?",
      "What strategies will you use to maintain financial stability throughout the year?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = SEASONAL_INCOME_STAGES[currentStage];
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
  const stage = SEASONAL_INCOME_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Seasonal Income Planning"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={SEASONAL_INCOME_STAGES.length}
      currentLevel={Math.min(currentStage + 1, SEASONAL_INCOME_STAGES.length)}
      totalLevels={SEASONAL_INCOME_STAGES.length}
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
            <span>Seasonal Income</span>
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
                        { stageId: SEASONAL_INCOME_STAGES[currentStage].id, isCorrect: SEASONAL_INCOME_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Seasonal Income Management</strong>
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
              Skill unlocked: <strong>Seasonal Income Management</strong>
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

export default SeasonalIncomePlanning;