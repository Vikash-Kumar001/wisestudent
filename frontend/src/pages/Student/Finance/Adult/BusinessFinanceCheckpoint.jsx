import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BUSINESS_FINANCE_CHECKPOINT_STAGES = [
  {
    id: 1,
    prompt: "Task: Make 8 safe financial decisions for a small business.",
    options: [
      
      {
        id: "ignore",
        label: "Ignore small expenses to save time",
        reflection: "Ignoring small expenses is risky. Small expenses can add up significantly and proper tracking helps identify areas for cost reduction and better financial control.",
        isCorrect: false,
      },
      {
        id: "spend",
        label: "Spend first, worry about records later",
        reflection: "Spending first and worrying about records later creates financial chaos. It's difficult to track expenses accurately and can lead to overspending and budget problems.",
        isCorrect: false,
      },
      {
        id: "records",
        label: "Keep detailed financial records of all transactions",
        reflection: "Excellent! Keeping detailed financial records is fundamental to business success. It helps with tax compliance, financial planning, and making informed decisions.",
        isCorrect: true,
      },
      {
        id: "estimate",
        label: "Estimate expenses instead of tracking them",
        reflection: "Estimating expenses instead of tracking them accurately leads to poor financial decisions. Actual data is essential for effective budgeting and financial planning.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the best approach to business cash flow management?",
    options: [
      
      {
        id: "spend",
        label: "Spend as needed without checking account balances",
        reflection: "Spending without checking account balances can lead to overdrafts, missed payments, and financial stress. It's essential to know your cash position before making spending decisions.",
        isCorrect: false,
      },
      {
        id: "monitor",
        label: "Monitor cash flow regularly and forecast future needs",
        reflection: "Perfect! Regular cash flow monitoring and forecasting help you anticipate financial challenges and opportunities, ensuring you have enough money when you need it.",
        isCorrect: true,
      },
      {
        id: "borrow",
        label: "Rely on credit when cash runs low",
        reflection: "Relying on credit when cash runs low creates debt dependency and interest expenses. It's better to plan ahead and maintain adequate cash reserves.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore cash flow until there's a problem",
        reflection: "Ignoring cash flow until problems arise means you're always reacting rather than planning. Proactive cash flow management prevents financial crises.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should you handle business debt?",
    options: [
      {
        id: "plan",
        label: "Borrow only for productive investments with clear repayment plans",
        reflection: "Excellent! Productive investments that generate returns can justify borrowing. Having clear repayment plans ensures debt doesn't become overwhelming.",
        isCorrect: true,
      },
      {
        id: "any",
        label: "Borrow for any business need without planning",
        reflection: "Borrowing for any need without planning creates financial risk. It's important to evaluate whether borrowing is necessary and ensure you can repay comfortably.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Avoid all debt completely",
        reflection: "While avoiding debt reduces risk, it can also limit growth opportunities. Strategic borrowing for investments with good returns can be beneficial for business development.",
        isCorrect: false,
      },
      {
        id: "maximize",
        label: "Maximize debt to show business growth",
        reflection: "Maximizing debt to show growth is dangerous. High debt levels create financial stress and can lead to insolvency if business conditions change.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's essential for business financial planning?",
    options: [
      
      {
        id: "spend",
        label: "Spend based on available cash without a plan",
        reflection: "Spending based on available cash without a plan leads to financial instability. It's difficult to achieve long-term goals without a structured financial plan.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore planning and deal with finances as they come",
        reflection: "Ignoring financial planning and dealing with finances as they come creates chaos and missed opportunities. Planning provides direction and financial security.",
        isCorrect: false,
      },
      {
        id: "overbudget",
        label: "Create unrealistic budgets that are impossible to follow",
        reflection: "Unrealistic budgets that can't be followed are counterproductive. They lead to frustration and abandonment of financial planning altogether.",
        isCorrect: false,
      },
      {
        id: "budget",
        label: "Create and stick to a realistic budget with regular reviews",
        reflection: "Perfect! A realistic budget with regular reviews provides financial discipline and helps you track performance against your financial goals.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the best practice for business financial separation?",
    options: [
      
      {
        id: "mix",
        label: "Mix business and personal expenses for convenience",
        reflection: "Mixing business and personal expenses creates financial confusion, makes tax preparation difficult, and can lead to poor financial decisions for both areas.",
        isCorrect: false,
      },
      {
        id: "same",
        label: "Use the same bank account for everything",
        reflection: "Using the same account for business and personal finances makes it impossible to track business performance accurately and can lead to legal and tax complications.",
        isCorrect: false,
      },
      {
        id: "separate",
        label: "Keep business and personal finances completely separate",
        reflection: "Exactly! Keeping business and personal finances separate ensures clear financial management, easier tax preparation, and better business decision-making.",
        isCorrect: true,
      },
      {
        id: "occasional",
        label: "Separate finances only occasionally when it's convenient",
        reflection: "Occasional separation isn't sufficient. Consistent separation is necessary for proper financial management and to maintain the integrity of both business and personal finances.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = BUSINESS_FINANCE_CHECKPOINT_STAGES.length;
const successThreshold = totalStages;

const BusinessFinanceCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-adults-82";
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
      "What systems will you implement to maintain financial discipline?",
      "How can you prepare for financial challenges in your business?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = BUSINESS_FINANCE_CHECKPOINT_STAGES[currentStage];
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
  const stage = BUSINESS_FINANCE_CHECKPOINT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Business Finance Checkpoint"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={BUSINESS_FINANCE_CHECKPOINT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, BUSINESS_FINANCE_CHECKPOINT_STAGES.length)}
      totalLevels={BUSINESS_FINANCE_CHECKPOINT_STAGES.length}
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
            <span>Task</span>
            <span>Financial Decisions</span>
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
                        { stageId: BUSINESS_FINANCE_CHECKPOINT_STAGES[currentStage].id, isCorrect: BUSINESS_FINANCE_CHECKPOINT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Business Financial Management</strong>
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
              Skill unlocked: <strong>Business Financial Management</strong>
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

export default BusinessFinanceCheckpoint;