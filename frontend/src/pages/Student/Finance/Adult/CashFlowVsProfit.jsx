import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CASH_FLOW_VS_PROFIT_STAGES = [
  {
    id: 1,
    prompt: "Your business shows profit, but no cash is available. Why?",
    options: [
      {
        id: "equals",
        label: "Profit equals cash",
        reflection: "Actually, profit and cash are different. Profit is revenue minus expenses, but cash availability depends on when payments are received and bills are paid.",
        isCorrect: false,
      },
      {
        id: "timing",
        label: "Cash flow timing matters",
        reflection: "Exactly! Even profitable businesses can have cash flow problems if customers pay late or expenses need to be paid upfront before receiving revenue.",
        isCorrect: true,
      },
      {
        id: "same",
        label: "They are the same thing",
        reflection: "Profit and cash are different concepts. A business can be profitable but still face cash shortages due to timing differences in payments.",
        isCorrect: false,
      },
      {
        id: "accounting",
        label: "Accounting rules create confusion",
        reflection: "While accounting can be complex, the main issue is understanding that profit and cash flow are different concepts with different timing implications.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What is the difference between profit and cash flow?",
    options: [
      {
        id: "flow",
        label: "Cash flow tracks when money moves",
        reflection: "Correct! Cash flow tracks the actual movement of money in and out of the business, while profit is an accounting measure of income minus expenses.",
        isCorrect: true,
      },
      {
        id: "profit",
        label: "Profit is about money coming in and out",
        reflection: "This is actually describing cash flow. Profit is about revenues minus expenses over a period, regardless of when the money changes hands.",
        isCorrect: false,
      },
      
      {
        id: "both",
        label: "Both measure the same thing differently",
        reflection: "Profit and cash flow measure different aspects of a business. Profit measures financial performance over time, while cash flow measures liquidity at a point in time.",
        isCorrect: false,
      },
      {
        id: "tax",
        label: "Profit is for taxes, cash flow is for daily use",
        reflection: "While both are important for different purposes, the fundamental difference is that profit is an accounting measure while cash flow is about actual money movement.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Which situation illustrates a cash flow problem despite profit?",
    options: [
      {
        id: "investment",
        label: "Receiving a large investment",
        reflection: "An investment would typically improve cash flow rather than cause a problem. This doesn't illustrate the disconnect between profit and cash flow.",
        isCorrect: false,
      },
      
      {
        id: "growth",
        label: "Rapid business growth",
        reflection: "Growth can create cash flow challenges, but the clearest example is selling on credit with delayed payments, which creates the disconnect between profit and cash.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "Having money in savings account",
        reflection: "Having money in savings indicates good cash flow, not a cash flow problem. The issue is when profit doesn't translate to available cash.",
        isCorrect: false,
      },
      {
        id: "credit",
        label: "Selling on credit with delayed payments",
        reflection: "Exactly! A business can show profit from credit sales but still face cash flow issues if customers pay months later while the business still has immediate expenses.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "Why is cash flow important even when a business is profitable?",
    options: [
      {
        id: "waste",
        label: "To avoid wasting money",
        reflection: "While cash management helps avoid waste, the main importance of cash flow is to meet immediate financial obligations regardless of profitability.",
        isCorrect: false,
      },
      
      {
        id: "reporting",
        label: "For better financial reporting",
        reflection: "Reporting is important, but the main reason cash flow matters is to meet immediate financial obligations regardless of profitability.",
        isCorrect: false,
      },
      {
        id: "obligations",
        label: "To pay immediate obligations like rent and salaries",
        reflection: "Right! Even profitable businesses need cash on hand to pay immediate expenses like rent, salaries, and suppliers before customer payments arrive.",
        isCorrect: true,
      },
      {
        id: "taxes",
        label: "For tax purposes",
        reflection: "Taxes are important, but the main reason cash flow matters is to meet immediate financial obligations like rent and salaries regardless of profitability.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What is the outcome of misunderstanding cash flow and profit?",
    options: [
      {
        id: "success",
        label: "Guaranteed business success",
        reflection: "Misunderstanding these concepts can lead to serious business problems, not success. Many profitable businesses fail due to cash flow issues.",
        isCorrect: false,
      },
      {
        id: "stress",
        label: "Cash flow problems cause business stress even with profit",
        reflection: "Perfect! Businesses can appear profitable on paper but still fail due to lack of available cash to meet immediate obligations.",
        isCorrect: true,
      },
      {
        id: "efficiency",
        label: "Improved business efficiency",
        reflection: "Misunderstanding these concepts would lead to inefficiencies, not improvements. Understanding the difference is key to business success.",
        isCorrect: false,
      },
      {
        id: "growth",
        label: "Accelerated business growth",
        reflection: "Without proper cash flow management, growth can actually be hindered rather than accelerated. Misunderstanding these concepts causes stress, not growth.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = CASH_FLOW_VS_PROFIT_STAGES.length;
const successThreshold = totalStages;

const CashFlowVsProfit = () => {
  const location = useLocation();
  const gameId = "finance-adults-72";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 15;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
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
      "How can you monitor cash flow in addition to tracking profit?",
      "What strategies help manage cash flow challenges in a profitable business?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = CASH_FLOW_VS_PROFIT_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection); // Set the reflection for the selected option
    setShowFeedback(true); // Show feedback after selection
    setCanProceed(false); // Disable proceeding initially
    
    // Update coins if the answer is correct
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    // Wait for the reflection period before allowing to proceed
    setTimeout(() => {
      setCanProceed(true); // Enable proceeding after showing reflection
    }, 1500); // Wait 1.5 seconds before allowing to proceed
    
    // Handle the final stage separately
    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0); // Set final coins based on performance
        setShowResult(true);
      }, 2500); // Wait longer before showing final results
    }
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(1, true); // Show +1 feedback, coins are added separately
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
  const stage = CASH_FLOW_VS_PROFIT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Cash Flow vs Profit"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={CASH_FLOW_VS_PROFIT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, CASH_FLOW_VS_PROFIT_STAGES.length)}
      totalLevels={CASH_FLOW_VS_PROFIT_STAGES.length}
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
            <span>Cash Flow</span>
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
              {/* Automatically advance if we're in the last stage and the timeout has passed */}
              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      const updatedHistory = [
                        ...history,
                        { stageId: CASH_FLOW_VS_PROFIT_STAGES[currentStage].id, isCorrect: CASH_FLOW_VS_PROFIT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Cash flow management understanding</strong>
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
              Skill unlocked: <strong>Cash flow management understanding</strong>
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

export default CashFlowVsProfit;