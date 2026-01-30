import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REPAYMENT_CAPACITY_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Which EMI is risky? ",
    options: [
      {
        id: "a",
        label: "EMI below 20-30% of income",
        reflection: "Correct! EMIs below 20-30% of income are generally considered safe and manageable.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "EMI above 50% of income",
        reflection: "EMI above 50% of income is very risky and leaves little room for other expenses.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Both are equally safe",
        reflection: "EMI percentages vary greatly in risk level - higher percentages are more risky.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Income percentage doesn't matter for EMIs",
        reflection: "Income percentage is crucial for determining EMI affordability and financial safety.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "What percentage of income is considered safe for EMI payments?",
    options: [
     
      {
        id: "a",
        label: "Between 40-50% of income",
        reflection: "EMIs in this range are quite risky and leave little room for other expenses.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "More than 50% of income",
        reflection: "EMIs above 50% are extremely risky and can lead to financial distress.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Any percentage is fine as long as you pay on time",
        reflection: "Percentage matters greatly for financial safety and ability to handle emergencies.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Less than 30% of income",
        reflection: "Exactly! Keeping EMIs below 30% of income provides financial stability and flexibility.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "What happens when EMI exceeds 50% of your income?",
    options: [
     
      {
        id: "a",
        label: "Increases financial safety",
        reflection: "Actually, high EMIs decrease financial safety by limiting your ability to handle other expenses.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Has no impact on financial safety",
        reflection: "High EMIs significantly impact financial safety by consuming most of your income.",
        isCorrect: false,
      },
       {
        id: "c",
        label: "Reduces financial safety and flexibility",
        reflection: "Yes! High EMIs leave little room for other expenses and emergencies.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Makes it easier to save money",
        reflection: "High EMIs make it much harder to save money as most income goes to EMI payments.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "Why is it important to consider your income percentage when taking a loan?",
    options: [
      
      {
        id: "a",
        label: "Income percentage doesn't matter for loan eligibility",
        reflection: "Income percentage is crucial for determining your ability to repay without financial stress.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "To ensure you can meet EMI obligations without compromising other needs",
        reflection: "Absolutely! This ensures financial stability and ability to handle other expenses.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Only the loan amount matters, not the EMI percentage",
        reflection: "The EMI percentage relative to income is critical for determining affordability.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "To maximize the loan amount you can take",
        reflection: "The goal should be affordability, not maximizing loan amount beyond your capacity.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "What is the best approach to determine your EMI capacity?",
    options: [
      {
        id: "a",
        label: "Keep EMIs below 30% of your gross income",
        reflection: "Perfect! This ensures financial safety and leaves room for other expenses and savings.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Take loans with EMIs up to 60% of income",
        reflection: "EMIs at 60% are extremely risky and can lead to financial distress.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Match EMIs to your highest earning month",
        reflection: "EMIs should be based on average income, not peak earnings to ensure consistency.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Focus only on the loan tenure, not EMI percentage",
        reflection: "EMI percentage is crucial regardless of tenure to ensure affordability.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
];

const totalStages = REPAYMENT_CAPACITY_STAGES.length;
const successThreshold = totalStages;

const RepaymentCapacityTest = () => {
  const location = useLocation();
  const gameId = "finance-adults-52";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 3;
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
      "How can you calculate your EMI capacity before taking a loan?",
      "What factors should influence your EMI affordability decisions?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = REPAYMENT_CAPACITY_STAGES[currentStage];
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
      setCoins(prevCoins => prevCoins + 3); // 3 coins per correct answer
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
        setCoins(passed ? totalCoins : Math.floor(totalCoins * correctCount / totalStages)); // Proportional coins based on performance
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
  const stage = REPAYMENT_CAPACITY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Repayment Capacity Test"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={REPAYMENT_CAPACITY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, REPAYMENT_CAPACITY_STAGES.length)}
      totalLevels={REPAYMENT_CAPACITY_STAGES.length}
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
            <span>EMI Capacity</span>
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
                        { stageId: REPAYMENT_CAPACITY_STAGES[currentStage].id, isCorrect: REPAYMENT_CAPACITY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
                      ];
                      const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
                      const passed = correctCount === successThreshold;
                      setFinalScore(correctCount);
                      setCoins(passed ? totalCoins : Math.floor(totalCoins * correctCount / totalStages));
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
                    Skill unlocked: <strong>EMI Capacity Assessment</strong>
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
              Skill unlocked: <strong>EMI Capacity Assessment</strong>
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

export default RepaymentCapacityTest;