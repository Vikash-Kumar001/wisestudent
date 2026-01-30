import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CREDIT_HISTORY_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Why does repayment history matter?",
    options: [
      {
        id: "no",
        label: "It doesn't matter",
        reflection: "Actually, repayment history matters greatly. It's one of the most important factors lenders consider when evaluating your creditworthiness. Poor repayment history can significantly limit your access to credit in the future.",
        isCorrect: false,
      },
      {
        id: "access",
        label: "It affects future credit access",
        reflection: "Exactly! Your repayment history significantly affects future credit access. Lenders use your payment history to assess risk, and a good track record makes you eligible for better terms and lower interest rates.",
        isCorrect: true,
      },
      {
        id: "fees",
        label: "It determines transaction fees",
        reflection: "While repayment history might indirectly influence some fees, it doesn't directly determine transaction fees. The main impact is on your creditworthiness and eligibility for future credit.",
        isCorrect: false,
      },
      {
        id: "duration",
        label: "It affects how long you can keep accounts open",
        reflection: "Account duration is influenced by other factors besides repayment history. The primary importance of repayment history is its impact on your creditworthiness and future borrowing capacity.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the primary impact of good repayment history?",
    options: [
      {
        id: "trust",
        label: "Builds trust with lenders",
        reflection: "Perfect! Good repayment history builds trust with lenders, demonstrating reliability and responsibility. This trust translates into better loan terms, lower interest rates, and easier approval for future credit.",
        isCorrect: true,
      },
      {
        id: "speed",
        label: "Speeds up the application process",
        reflection: "While good history might streamline some processes, the primary impact is on your creditworthiness and terms, not necessarily the speed of application processing.",
        isCorrect: false,
      },
      {
        id: "requirements",
        label: "Eliminates all credit requirements",
        reflection: "Good repayment history doesn't eliminate all credit requirements. You'll still need to meet basic eligibility criteria, but your history improves your chances of approval and better terms.",
        isCorrect: false,
      },
      {
        id: "cost",
        label: "Reduces all financial costs",
        reflection: "While good repayment history can reduce interest rates and potentially some fees, it doesn't reduce all financial costs across the board. Its primary impact is on credit-related expenses.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should you approach managing your repayment history?",
    options: [
      
      {
        id: "minimum",
        label: "Pay only the minimum amount due",
        reflection: "While paying the minimum keeps your account in good standing, it doesn't optimize your financial health. The focus for repayment history is making payments on time, though paying more than minimum is financially beneficial.",
        isCorrect: false,
      },
      {
        id: "selective",
        label: "Pay only for important debts",
        reflection: "All debts contribute to your repayment history. Being selective about which debts to pay can damage your credit history. It's important to maintain timely payments on all obligations.",
        isCorrect: false,
      },
      {
        id: "occasional",
        label: "Make occasional late payments if necessary",
        reflection: "Occasional late payments can significantly damage your repayment history. Consistency in on-time payments is crucial for maintaining a good credit reputation with lenders.",
        isCorrect: false,
      },
      {
        id: "consistency",
        label: "Make all payments on time consistently",
        reflection: "Excellent! Making all payments on time consistently is the most important approach to maintaining a good repayment history. This demonstrates reliability to lenders over time.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of poor repayment history management?",
    options: [
      
      {
        id: "monitoring",
        label: "Regularly monitoring your credit report",
        reflection: "Regularly monitoring your credit report is actually a positive financial habit that helps you manage your repayment history effectively, not a warning sign of poor management.",
        isCorrect: false,
      },
      {
        id: "planning",
        label: "Creating budgets to ensure payment capability",
        reflection: "Creating budgets to ensure payment capability is a sign of good financial planning and responsible repayment management, not a warning sign of poor management.",
        isCorrect: false,
      },
      {
        id: "late",
        label: "Frequently making payments after due dates",
        reflection: "Exactly! Frequently making payments after due dates is a clear warning sign of poor repayment history management. Late payments are reported to credit bureaus and can significantly damage your credit score.",
        isCorrect: true,
      },
      {
        id: "auto",
        label: "Setting up automatic payments",
        reflection: "Setting up automatic payments is a proactive strategy to maintain good repayment history, not a warning sign of poor management. It helps ensure payments are made on time consistently.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term benefit of maintaining good repayment history?",
    options: [
     
      {
        id: "spending",
        label: "Increased ability to spend on non-essentials",
        reflection: "While good credit history might increase your borrowing capacity, the benefit isn't about spending on non-essentials. The value is in financial opportunities and better terms when you do need credit.",
        isCorrect: false,
      },
       {
        id: "access",
        label: "Better access to credit with favorable terms",
        reflection: "Exactly! Maintaining good repayment history provides better access to credit with favorable terms, including lower interest rates, higher credit limits, and easier approval for loans and credit cards.",
        isCorrect: true,
      },
      {
        id: "debt",
        label: "Opportunity to take on more debt easily",
        reflection: "Good repayment history might make it easier to take on debt, but that's not the primary benefit. The goal is to have access to credit when needed while maintaining financial health.",
        isCorrect: false,
      },
      {
        id: "avoidance",
        label: "Ability to avoid all financial responsibilities",
        reflection: "Good repayment history doesn't help you avoid financial responsibilities. Instead, it helps you manage them better and access credit when needed for important purposes.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = CREDIT_HISTORY_STAGES.length;
const successThreshold = totalStages;

const CreditHistoryAwareness = () => {
  const location = useLocation();
  const gameId = "finance-adults-94";
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
      "How can you establish and maintain a good repayment history?",
      "What strategies will you use to ensure consistent on-time payments?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = CREDIT_HISTORY_STAGES[currentStage];
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
  const stage = CREDIT_HISTORY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Credit History Awareness"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={CREDIT_HISTORY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, CREDIT_HISTORY_STAGES.length)}
      totalLevels={CREDIT_HISTORY_STAGES.length}
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
            <span>Credit History</span>
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
                        { stageId: CREDIT_HISTORY_STAGES[currentStage].id, isCorrect: CREDIT_HISTORY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Credit History Management</strong>
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
              Skill unlocked: <strong>Credit History Management</strong>
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

export default CreditHistoryAwareness;