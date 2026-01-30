import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PERSONAL_VS_BUSINESS_MONEY_STAGES = [
  {
    id: 1,
    prompt: "You run a small shop. Which is safer?",
    options: [
      {
        id: "one",
        label: "Using one account for everything",
        reflection: "Using one account creates confusion between personal and business expenses, making it difficult to track profitability and manage taxes effectively.",
        isCorrect: false,
      },
      {
        id: "separate",
        label: "Separating personal and business money",
        reflection: "Exactly! Separating personal and business money improves clarity and control, making it easier to track expenses, profits, and tax obligations.",
        isCorrect: true,
      },
      {
        id: "mixed",
        label: "Mixing personal and business money occasionally",
        reflection: "Even occasional mixing can lead to confusion and complications in tracking expenses and profits for your business.",
        isCorrect: false,
      },
      {
        id: "business",
        label: "Using only business money for everything",
        reflection: "This approach would mean using business funds for personal expenses, which can create accounting issues and tax complications.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Why is separating personal and business money important?",
    options: [
      {
        id: "complicated",
        label: "It makes finances more complicated",
        reflection: "Actually, separation simplifies financial tracking by clearly defining which expenses belong to the business and which are personal.",
        isCorrect: false,
      },
      
      {
        id: "expensive",
        label: "It's expensive to maintain separate accounts",
        reflection: "While there may be some bank fees, the benefits of clear financial tracking far outweigh the costs of maintaining separate accounts.",
        isCorrect: false,
      },
      {
        id: "clarity",
        label: "It provides clarity on business performance",
        reflection: "Correct! Separating funds helps you accurately track business profitability and make better financial decisions.",
        isCorrect: true,
      },
      {
        id: "unnecessary",
        label: "It's unnecessary for small businesses",
        reflection: "Separation is important even for small businesses as it helps maintain clear financial records and makes tax preparation easier.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What happens when personal and business money are mixed?",
    options: [
      {
        id: "organized",
        label: "It's easier to organize finances",
        reflection: "Actually, mixing personal and business money makes it difficult to distinguish between business and personal expenses, complicating financial management.",
        isCorrect: false,
      },
      {
        id: "confusion",
        label: "It creates confusion in tracking business profits",
        reflection: "Right! When money is mixed, it becomes challenging to accurately determine your business's true profitability and financial health.",
        isCorrect: true,
      },
      {
        id: "tax",
        label: "It simplifies tax filing",
        reflection: "Mixing funds actually complicates tax filing as you need to sort out which expenses were business-related and which were personal.",
        isCorrect: false,
      },
      {
        id: "efficient",
        label: "It's more efficient for small businesses",
        reflection: "Though it might seem more efficient initially, mixing funds actually makes it harder to track business performance and manage expenses effectively.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How does separating personal and business money help with taxes?",
    options: [
      {
        id: "organize",
        label: "It helps organize and track deductible expenses",
        reflection: "Exactly! Separate accounts make it easier to track business expenses that can be deducted from taxes, ensuring you don't miss any deductions.",
        isCorrect: true,
      },
      {
        id: "increase",
        label: "It increases your tax burden",
        reflection: "Separating money doesn't increase taxes. In fact, it helps ensure you properly deduct business expenses, which can reduce taxable income.",
        isCorrect: false,
      },
      
      {
        id: "avoid",
        label: "It helps avoid paying taxes",
        reflection: "Separating money doesn't help avoid taxes legally. It helps ensure proper reporting and claiming of legitimate business deductions.",
        isCorrect: false,
      },
      {
        id: "complicate",
        label: "It complicates tax preparation",
        reflection: "Actually, separate accounts simplify tax preparation by clearly organizing business expenses and income, making it easier to prepare accurate returns.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What is the outcome of separating personal and business money?",
    options: [
      {
        id: "chaos",
        label: "It creates more financial chaos",
        reflection: "Actually, separation brings clarity and control rather than chaos. It makes financial management more organized and transparent.",
        isCorrect: false,
      },
      
      {
        id: "expenses",
        label: "It increases business expenses",
        reflection: "Separation doesn't increase expenses. It helps better track and manage expenses so you can control them more effectively.",
        isCorrect: false,
      },
      {
        id: "profit",
        label: "It reduces business profit",
        reflection: "Separation doesn't reduce profit. It helps you see the true profit by clearly distinguishing between business and personal expenses.",
        isCorrect: false,
      },
      {
        id: "control",
        label: "Separation improves clarity and control",
        reflection: "Perfect! Separating personal and business money improves clarity and control, enabling better financial decision-making and tracking.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
];

const totalStages = PERSONAL_VS_BUSINESS_MONEY_STAGES.length;
const successThreshold = totalStages;

const PersonalVsBusinessMoney = () => {
  const location = useLocation();
  const gameId = "finance-adults-71";
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
      "How can you effectively separate personal and business finances in your own situation?",
      "What steps should you take to implement clear financial separation for your business?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = PERSONAL_VS_BUSINESS_MONEY_STAGES[currentStage];
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
  const stage = PERSONAL_VS_BUSINESS_MONEY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Personal vs Business Money"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={PERSONAL_VS_BUSINESS_MONEY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, PERSONAL_VS_BUSINESS_MONEY_STAGES.length)}
      totalLevels={PERSONAL_VS_BUSINESS_MONEY_STAGES.length}
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
            <span>Money Management</span>
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
                        { stageId: PERSONAL_VS_BUSINESS_MONEY_STAGES[currentStage].id, isCorrect: PERSONAL_VS_BUSINESS_MONEY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Business-personal finance separation</strong>
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
              Skill unlocked: <strong>Business-personal finance separation</strong>
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

export default PersonalVsBusinessMoney;