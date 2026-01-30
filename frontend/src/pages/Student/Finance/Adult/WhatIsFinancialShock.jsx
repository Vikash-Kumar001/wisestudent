import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FINANCIAL_SHOCK_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Which is a financial shock?",
    options: [
      {
        id: "planned",
        label: "Planned monthly rent",
        reflection: "Planned monthly rent is a predictable, regular expense that you budget for. It's not a financial shock since you know about it in advance and can prepare accordingly.",
        isCorrect: false,
      },
      {
        id: "sudden",
        label: "Sudden medical expense",
        reflection: "Exactly! Sudden medical expenses are financial shocks because they're unexpected, urgent, and can be very expensive. They disrupt your normal financial planning.",
        isCorrect: true,
      },
      {
        id: "budgeted",
        label: "Budgeted grocery shopping",
        reflection: "Budgeted grocery shopping is planned spending that you've accounted for in your budget. It's predictable and manageable, not a financial shock.",
        isCorrect: false,
      },
      {
        id: "scheduled",
        label: "Scheduled car maintenance",
        reflection: "Scheduled car maintenance is planned and predictable. You can budget for it in advance, so it doesn't qualify as a financial shock.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What characterizes a financial shock?",
    options: [
      {
        id: "unexpected",
        label: "Unexpected timing and cost",
        reflection: "Perfect! Financial shocks are characterized by their unexpected timing and often unexpected cost. They catch you off guard when you're not prepared for them.",
        isCorrect: true,
      },
      {
        id: "planned",
        label: "Planned well in advance",
        reflection: "If something is planned well in advance, it's not a financial shock. The key characteristic of financial shocks is their unexpected nature.",
        isCorrect: false,
      },
      {
        id: "small",
        label: "Always small in amount",
        reflection: "Financial shocks aren't always small. In fact, they can be quite large and devastating. The defining feature is unpredictability, not size.",
        isCorrect: false,
      },
      {
        id: "frequent",
        label: "Happen frequently",
        reflection: "Financial shocks don't happen frequently by definition. If they happened often, they wouldn't be shocks - you'd expect them and plan for them.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should you prepare for financial shocks?",
    options: [
      
      {
        id: "ignore",
        label: "Ignore them and hope they don't happen",
        reflection: "Ignoring financial shocks and hoping they don't happen is not a strategy. It leaves you vulnerable and unprepared when emergencies do occur.",
        isCorrect: false,
      },
      {
        id: "credit",
        label: "Rely on credit cards for all emergencies",
        reflection: "Relying on credit cards for emergencies creates debt that you'll have to pay back with interest. It's better to have savings to cover unexpected expenses.",
        isCorrect: false,
      },
      {
        id: "spend",
        label: "Spend all your money to avoid having it stolen",
        reflection: "Spending all your money to avoid theft is not logical preparation for financial shocks. It actually makes you more vulnerable to financial emergencies.",
        isCorrect: false,
      },
      {
        id: "emergency",
        label: "Build an emergency fund for unexpected expenses",
        reflection: "Excellent! Building an emergency fund is the best way to prepare for financial shocks. It provides a financial cushion when unexpected expenses arise.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a common example of a financial shock?",
    options: [
      {
        id: "car",
        label: "Car accident requiring repairs",
        reflection: "Exactly! A car accident requiring repairs is a classic example of a financial shock. It's unexpected, urgent, and can be very expensive.",
        isCorrect: true,
      },
      {
        id: "rent",
        label: "Monthly rent payment",
        reflection: "Monthly rent payment is a regular, predictable expense that you plan for. It's not a financial shock since you know about it in advance.",
        isCorrect: false,
      },
      {
        id: "groceries",
        label: "Weekly grocery shopping",
        reflection: "Weekly grocery shopping is a regular expense that's part of normal budgeting. It's predictable and manageable, not a financial shock.",
        isCorrect: false,
      },
      {
        id: "salary",
        label: "Regular salary deposit",
        reflection: "Regular salary deposits are predictable income, not financial shocks. They're expected and help you manage your regular expenses.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the impact of financial shocks?",
    options: [
      
      {
        id: "helpful",
        label: "Helpful for building wealth",
        reflection: "Financial shocks are not helpful for building wealth. They typically cost money and can set back your financial progress rather than advance it.",
        isCorrect: false,
      },
      {
        id: "predictable",
        label: "Easily predictable and planned for",
        reflection: "If financial shocks were easily predictable and planned for, they wouldn't be shocks. Their disruptive nature comes from their unpredictability.",
        isCorrect: false,
      },
      {
        id: "disruptive",
        label: "Disruptive to normal financial planning",
        reflection: "Exactly! Financial shocks are disruptive to normal financial planning because they're unexpected and can derail your budget and financial goals.",
        isCorrect: true,
      },
      {
        id: "beneficial",
        label: "Always beneficial in the long run",
        reflection: "Financial shocks are not always beneficial. While they can teach valuable lessons, they typically cause financial stress and hardship.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = FINANCIAL_SHOCK_STAGES.length;
const successThreshold = totalStages;

const WhatIsFinancialShock = () => {
  const location = useLocation();
  const gameId = "finance-adults-83";
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
      "How can you identify potential financial shocks in your life?",
      "What emergency fund size would be appropriate for your situation?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FINANCIAL_SHOCK_STAGES[currentStage];
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
  const stage = FINANCIAL_SHOCK_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="What Is a Financial Shock?"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FINANCIAL_SHOCK_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FINANCIAL_SHOCK_STAGES.length)}
      totalLevels={FINANCIAL_SHOCK_STAGES.length}
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
            <span>Financial Shock</span>
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
                        { stageId: FINANCIAL_SHOCK_STAGES[currentStage].id, isCorrect: FINANCIAL_SHOCK_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Financial Shock Recognition</strong>
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
              Skill unlocked: <strong>Financial Shock Recognition</strong>
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

export default WhatIsFinancialShock;