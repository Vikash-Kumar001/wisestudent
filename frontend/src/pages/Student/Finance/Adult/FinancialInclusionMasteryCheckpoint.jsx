import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FINANCIAL_INCLUSION_MASTERY_STAGES = [
  {
    id: 1,
    prompt: "Task: Demonstrate safe financial behaviour across multiple scenarios. Which approach shows readiness for formal financial participation?",
    options: [
      {
        id: "risky",
        label: "Taking financial risks without understanding consequences",
        reflection: "Taking financial risks without understanding consequences shows unpreparedness for formal financial participation. This approach can lead to serious financial problems.",
        isCorrect: false,
      },
      {
        id: "knowledge",
        label: "Using knowledge to make informed financial decisions",
        reflection: "Exactly! Using knowledge to make informed financial decisions shows readiness for formal financial participation. Understanding the implications of your choices is key to safe participation.",
        isCorrect: true,
      },
      {
        id: "copying",
        label: "Copying others' financial decisions without analysis",
        reflection: "Copying others' financial decisions without analysis is risky. Everyone's financial situation is different, so you need to understand the rationale behind decisions.",
        isCorrect: false,
      },
      {
        id: "avoiding",
        label: "Avoiding all financial services to stay safe",
        reflection: "Avoiding all financial services prevents you from building financial experience and accessing benefits of the formal system. Learning to navigate safely is better than avoiding entirely.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "How do you demonstrate responsible borrowing behavior?",
    options: [
      {
        id: "capacity",
        label: "Assessing repayment capacity before borrowing",
        reflection: "Perfect! Assessing repayment capacity before borrowing demonstrates responsible borrowing behavior. This approach ensures you don't overextend financially.",
        isCorrect: true,
      },
      {
        id: "max",
        label: "Borrowing the maximum amount offered",
        reflection: "Borrowing the maximum amount offered without considering your repayment capacity is irresponsible. Responsible borrowing means only borrowing what you can comfortably repay.",
        isCorrect: false,
      },
      
      {
        id: "urgent",
        label: "Borrowing for any urgent need regardless of cost",
        reflection: "Borrowing for any urgent need without considering the cost and your ability to repay is not responsible. Even urgent needs should be evaluated against your financial capacity.",
        isCorrect: false,
      },
      {
        id: "multiple",
        label: "Taking multiple loans from different sources",
        reflection: "Taking multiple loans without careful consideration can lead to over-indebtedness. Responsible borrowing requires understanding your total debt burden.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "What indicates financial discipline in managing credit?",
    options: [
      {
        id: "max",
        label: "Maximizing credit utilization to build credit history",
        reflection: "Maximizing credit utilization is not a sign of discipline. High utilization can negatively impact your credit score and indicate financial stress.",
        isCorrect: false,
      },
      
      {
        id: "min",
        label: "Paying only the minimum amount due",
        reflection: "Paying only the minimum amount due can lead to accumulating high interest charges. True discipline involves paying more than the minimum when possible.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Avoiding credit entirely",
        reflection: "While avoiding credit might seem safe, it doesn't build credit history. Managing credit responsibly demonstrates discipline and builds positive credit history.",
        isCorrect: false,
      },
      {
        id: "repay",
        label: "Making payments on time and keeping balances low",
        reflection: "Excellent! Making payments on time and keeping balances low indicates financial discipline in managing credit. This demonstrates responsible credit management.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "How do you verify the legitimacy of a financial service provider?",
    options: [
      {
        id: "ads",
        label: "Based on attractive advertisements",
        reflection: "Attractive advertisements don't guarantee legitimacy. Scammers often use appealing ads to lure victims. Verification requires checking official credentials.",
        isCorrect: false,
      },
      
      {
        id: "speed",
        label: "By how quickly they approve applications",
        reflection: "Fast approval doesn't indicate legitimacy. Legitimate providers follow proper verification procedures. Be wary of unusually fast approvals.",
        isCorrect: false,
      },
      {
        id: "credentials",
        label: "Checking official licenses and regulatory approvals",
        reflection: "Exactly! Checking official licenses and regulatory approvals is how you verify the legitimacy of a financial service provider. This ensures you're dealing with a regulated entity.",
        isCorrect: true,
      },
      {
        id: "referrals",
        label: "Based solely on friend referrals",
        reflection: "While referrals can be helpful, relying solely on them for verification isn't wise. Even well-meaning friends might not know about fraudulent schemes.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What demonstrates financial preparedness for emergencies?",
    options: [
      {
        id: "credit",
        label: "Reliance on credit cards for all emergencies",
        reflection: "Reliance on credit cards for all emergencies shows poor preparedness. This approach can lead to debt accumulation and doesn't address the root issue of lacking savings.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "Having dedicated emergency funds separate from regular expenses",
        reflection: "Exactly! Having dedicated emergency funds separate from regular expenses demonstrates financial preparedness for emergencies. This provides a buffer without disrupting normal financial operations.",
        isCorrect: true,
      },
      {
        id: "borrowing",
        label: "Ability to quickly borrow money when needed",
        reflection: "Relying on borrowing for emergencies isn't true preparedness. Emergency funds provide more reliable and cost-effective protection than borrowing.",
        isCorrect: false,
      },
      {
        id: "insurance",
        label: "Only depending on insurance for protection",
        reflection: "While insurance is important, depending only on it without emergency savings isn't complete preparedness. Both insurance and savings provide comprehensive protection.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = FINANCIAL_INCLUSION_MASTERY_STAGES.length;
const successThreshold = totalStages;

const FinancialInclusionMasteryCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-adults-100";
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
      "How can you continue developing your financial knowledge and discipline?",
      "What specific steps will you take to participate responsibly in financial systems?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FINANCIAL_INCLUSION_MASTERY_STAGES[currentStage];
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
  const stage = FINANCIAL_INCLUSION_MASTERY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Financial Inclusion Mastery Checkpoint"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FINANCIAL_INCLUSION_MASTERY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FINANCIAL_INCLUSION_MASTERY_STAGES.length)}
      totalLevels={FINANCIAL_INCLUSION_MASTERY_STAGES.length}
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
            <span>Financial Mastery</span>
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
                        { stageId: FINANCIAL_INCLUSION_MASTERY_STAGES[currentStage].id, isCorrect: FINANCIAL_INCLUSION_MASTERY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Financial Inclusion Mastery</strong>
                  </p>
                  <p className="text-sm text-white/70">
                    Outcome: <strong>You are ready to participate confidently and responsibly in the formal financial system.</strong>
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
              Skill unlocked: <strong>Financial Inclusion Mastery</strong>
            </p>
            <p className="text-sm text-white/70">
              Outcome: <strong>You are ready to participate confidently and responsibly in the formal financial system.</strong>
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

export default FinancialInclusionMasteryCheckpoint;