import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CREDIT_SALES_RISK_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Giving goods on credit without records causes:",
    options: [
      {
        id: "loyalty",
        label: "Customer loyalty",
        reflection: "While credit might seem to build customer loyalty, giving goods on credit without records actually creates financial problems and doesn't build sustainable loyalty.",
        isCorrect: false,
      },
      
      {
        id: "trust",
        label: "Increased customer trust",
        reflection: "Professional credit management with proper records builds trust. Unrecorded credit sales create confusion and can actually damage customer relationships due to lack of clarity.",
        isCorrect: false,
      },
      {
        id: "growth",
        label: "Business growth",
        reflection: "Unrecorded credit sales don't lead to sustainable growth. They create financial chaos that can harm your business's ability to operate effectively and plan for the future.",
        isCorrect: false,
      },
      {
        id: "cashflow",
        label: "Cash flow problems",
        reflection: "Exactly! Giving goods on credit without records leads to cash flow problems because you don't know who owes what, when payments are due, or how much money you're actually owed.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the main risk of unrecorded credit sales?",
    options: [
      
      {
        id: "customers",
        label: "Loss of customers",
        reflection: "Unrecorded credit sales don't necessarily cause loss of customers. The real problem is the financial management issues that arise from poor record-keeping.",
        isCorrect: false,
      },
      {
        id: "competition",
        label: "Increased competition",
        reflection: "Unrecorded credit sales don't directly increase competition. The main issue is internal financial management and cash flow problems.",
        isCorrect: false,
      },
      {
        id: "tracking",
        label: "Inability to track what's owed",
        reflection: "Perfect! The main risk is the inability to track what's owed, when it's due, and to whom. This leads to lost revenue and cash flow problems.",
        isCorrect: true,
      },
      {
        id: "prices",
        label: "Need to raise prices",
        reflection: "While cash flow problems might eventually force price increases, the immediate and main risk is the inability to track and collect what's owed.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should you manage credit sales properly?",
    options: [
      
      {
        id: "memory",
        label: "Rely on memory to track credit sales",
        reflection: "Relying on memory is unreliable and leads to forgotten debts, double billing, and cash flow problems. Proper record-keeping is essential for business success.",
        isCorrect: false,
      },
      {
        id: "records",
        label: "Keep detailed records of all credit transactions",
        reflection: "Excellent! Proper credit sales management requires detailed records of what was sold, to whom, when payment is due, and the payment status of each transaction.",
        isCorrect: true,
      },
      {
        id: "trust",
        label: "Trust customers to pay without reminders",
        reflection: "While trust is important, even trusted customers sometimes need reminders. Proper records help you send appropriate follow-ups without being pushy.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Avoid credit sales entirely",
        reflection: "Avoiding credit sales entirely might limit business opportunities. The solution is proper credit management with good record-keeping, not avoiding credit altogether.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of poor credit sales management?",
    options: [
      {
        id: "unknown",
        label: "Not knowing how much customers owe",
        reflection: "Exactly! Not knowing how much customers owe is a clear warning sign of poor credit sales management. It indicates inadequate record-keeping and potential cash flow problems.",
        isCorrect: true,
      },
      {
        id: "records",
        label: "Having detailed payment records",
        reflection: "Having detailed payment records is actually a sign of good credit sales management, not poor management. It shows you're tracking what's owed properly.",
        isCorrect: false,
      },
      {
        id: "followup",
        label: "Sending regular payment follow-ups",
        reflection: "Sending regular payment follow-ups is a good practice that indicates proper credit management. It's not a warning sign of poor management.",
        isCorrect: false,
      },
      {
        id: "terms",
        label: "Clear credit terms with customers",
        reflection: "Having clear credit terms with customers is excellent practice and shows good credit management. It's not a warning sign but rather a best practice.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term impact of proper credit sales management?",
    options: [
      
      {
        id: "complexity",
        label: "Increased business complexity",
        reflection: "Proper credit sales management actually simplifies business operations by providing clear information about receivables, not by increasing complexity.",
        isCorrect: false,
      },
      {
        id: "restrictions",
        label: "More restrictions on customer relationships",
        reflection: "Good credit management enhances customer relationships by providing clarity and professionalism, rather than creating restrictions.",
        isCorrect: false,
      },
      {
        id: "costs",
        label: "Higher administrative costs",
        reflection: "While there may be some administrative costs, the benefits of proper credit management (better cash flow, reduced bad debt) far outweigh the costs of implementation.",
        isCorrect: false,
      },
      {
        id: "stability",
        label: "Improved cash flow and business stability",
        reflection: "Exactly! Proper credit sales management leads to predictable cash flow, better financial planning, and overall business stability through organized receivables management.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
];

const totalStages = CREDIT_SALES_RISK_STAGES.length;
const successThreshold = totalStages;

const CreditSalesRisk = () => {
  const location = useLocation();
  const gameId = "finance-adults-81";
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
      "How can you implement a simple credit sales tracking system?",
      "What credit terms will you establish with customers?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = CREDIT_SALES_RISK_STAGES[currentStage];
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
  const stage = CREDIT_SALES_RISK_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Credit Sales Risk"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={CREDIT_SALES_RISK_STAGES.length}
      currentLevel={Math.min(currentStage + 1, CREDIT_SALES_RISK_STAGES.length)}
      totalLevels={CREDIT_SALES_RISK_STAGES.length}
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
            <span>Credit Sales</span>
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
                        { stageId: CREDIT_SALES_RISK_STAGES[currentStage].id, isCorrect: CREDIT_SALES_RISK_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Credit Sales Management</strong>
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
              Skill unlocked: <strong>Credit Sales Management</strong>
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

export default CreditSalesRisk;