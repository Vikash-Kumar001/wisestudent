import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SUPPLIER_CREDIT_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Supplier offers unlimited credit. What's the risk?",
    options: [
      {
        id: "none",
        label: "None",
        reflection: "There are always risks with unlimited credit. It can lead to overspending, dependency, and financial stress when repayment is due.",
        isCorrect: false,
      },
      {
        id: "hidden",
        label: "Hidden pressure and repayment stress",
        reflection: "Exactly! Unlimited credit creates an illusion of financial freedom, but the hidden pressure builds until repayment time.",
        isCorrect: true,
      },
      {
        id: "benefit",
        label: "It's a business benefit with no downside",
        reflection: "While supplier credit can be beneficial, unlimited credit without clear terms always carries risks. It's not a free benefit.",
        isCorrect: false,
      },
      {
        id: "opportunity",
        label: "It's a great opportunity to grow the business",
        reflection: "While credit can support growth, unlimited credit without proper controls can lead to uncontrolled spending and financial problems.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What happens when you rely heavily on supplier credit?",
    options: [
       {
        id: "dependency",
        label: "You become dependent on the supplier",
        reflection: "Correct! Heavy reliance on supplier credit creates dependency. You lose negotiating power and become vulnerable to supplier decisions.",
        isCorrect: true,
      },
      {
        id: "freedom",
        label: "You gain complete financial freedom",
        reflection: "Relying on supplier credit actually reduces financial freedom by creating dependencies and obligations that limit your choices.",
        isCorrect: false,
      },
     
      {
        id: "control",
        label: "You maintain full control over your business",
        reflection: "Actually, heavy reliance on supplier credit reduces your control. You become beholden to the supplier's terms and conditions.",
        isCorrect: false,
      },
      {
        id: "growth",
        label: "Your business grows without any constraints",
        reflection: "While credit can support growth, unlimited credit often leads to uncontrolled spending that can harm rather than help business growth.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should you manage supplier credit responsibly?",
    options: [
      {
        id: "unlimited",
        label: "Use as much as the supplier offers",
        reflection: "Using unlimited credit without restraint leads to financial problems. It's important to set your own limits regardless of what's offered.",
        isCorrect: false,
      },
     
      {
        id: "ignore",
        label: "Ignore the credit terms and spend freely",
        reflection: "Ignoring credit terms is dangerous. It leads to unexpected obligations and financial stress when repayment becomes due.",
        isCorrect: false,
      },
      {
        id: "maximize",
        label: "Maximize usage to get the most value",
        reflection: "Maximizing credit usage often backfires. It creates unnecessary debt and financial pressure that can harm your business.",
        isCorrect: false,
      },
       {
        id: "limits",
        label: "Set your own spending limits",
        reflection: "Perfect! Setting your own limits protects you from the temptation of unlimited credit and ensures responsible financial management.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a red flag with supplier credit offers?",
    options: [
      
      {
        id: "interest",
        label: "Low or no interest rates",
        reflection: "While low interest rates seem attractive, they're not necessarily a red flag. The real danger is in unclear terms and conditions.",
        isCorrect: false,
      },
      {
        id: "flexibility",
        label: "Flexible payment options",
        reflection: "Flexible payment options can be beneficial. The red flag is when terms are unclear, not when they're flexible.",
        isCorrect: false,
      },
      {
        id: "terms",
        label: "Unclear repayment terms",
        reflection: "Exactly! Unclear terms are a major red flag. You should always understand exactly when and how much you'll need to repay.",
        isCorrect: true,
      },
      {
        id: "trust",
        label: "Trusting the supplier completely",
        reflection: "Trusting your supplier is good, but blind trust without understanding terms is risky. Always read and understand the fine print.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term impact of misusing supplier credit?",
    options: [
      {
        id: "success",
        label: "Business success and growth",
        reflection: "Misusing supplier credit typically leads to financial problems, not success. It can create debt that hinders rather than helps growth.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "Accumulated debt and financial stress",
        reflection: "Exactly! Misusing supplier credit quietly accumulates debt. The pressure builds until it becomes overwhelming and threatens business stability.",
        isCorrect: true,
      },
      {
        id: "freedom",
        label: "Increased financial freedom",
        reflection: "Misusing credit actually reduces financial freedom by creating obligations and dependencies that limit your future choices.",
        isCorrect: false,
      },
      {
        id: "opportunity",
        label: "More business opportunities",
        reflection: "While credit can enable opportunities, misusing it creates financial burdens that can prevent you from taking advantage of real opportunities.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = SUPPLIER_CREDIT_STAGES.length;
const successThreshold = totalStages;

const SupplierCreditTrap = () => {
  const location = useLocation();
  const gameId = "finance-adults-77";
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
      "How can you evaluate supplier credit offers objectively?",
      "What safeguards should you put in place when accepting credit?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = SUPPLIER_CREDIT_STAGES[currentStage];
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
  const stage = SUPPLIER_CREDIT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Supplier Credit Trap"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={SUPPLIER_CREDIT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, SUPPLIER_CREDIT_STAGES.length)}
      totalLevels={SUPPLIER_CREDIT_STAGES.length}
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
            <span>Supplier Credit</span>
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
                        { stageId: SUPPLIER_CREDIT_STAGES[currentStage].id, isCorrect: SUPPLIER_CREDIT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Supplier Credit Risk Management</strong>
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
              Skill unlocked: <strong>Supplier Credit Risk Management</strong>
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

export default SupplierCreditTrap;