import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BORROWING_FREQUENCY_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Frequent borrowing usually signals: (A) Smart money use or (B) Poor financial planning",
    options: [
      {
        id: "a",
        label: "Smart money use",
        reflection: "Actually, frequent borrowing often indicates poor financial planning rather than smart money use.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Good investment strategy",
        reflection: "While some borrowing can be strategic, frequent borrowing typically indicates financial mismanagement.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "No impact on financial health",
        reflection: "Frequent borrowing definitely impacts financial health by increasing debt obligations.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Poor financial planning",
        reflection: "Correct! Frequent borrowing often indicates poor financial planning and deeper financial issues.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "What does frequent borrowing typically indicate about your financial situation?",
    options: [
      
      {
        id: "a",
        label: "Strong financial management",
        reflection: "Frequent borrowing usually indicates the opposite of strong financial management.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Successful investment strategy",
        reflection: "While some investments require borrowing, frequent borrowing often indicates mismanagement.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Poor financial planning and potential deeper issues",
        reflection: "Exactly! Frequent borrowing often signals underlying financial management problems.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "No correlation with financial planning",
        reflection: "There's a strong correlation between frequent borrowing and poor financial planning.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "How should you approach borrowing frequency for healthy financial habits?",
    options: [
      
      {
        id: "a",
        label: "Borrow regularly as part of financial strategy",
        reflection: "Regular borrowing is not a healthy financial strategy and indicates poor planning.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Borrow only occasionally and for genuine needs",
        reflection: "Perfect! Occasional borrowing for genuine needs is healthier than frequent borrowing.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Borrow as frequently as possible",
        reflection: "Frequent borrowing is a sign of poor financial health and planning.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Frequency doesn't matter as long as you repay",
        reflection: "Frequency matters greatly as it indicates underlying financial planning issues.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "What's the relationship between borrowing frequency and financial stability?",
    options: [
      {
        id: "a",
        label: "Frequent borrowing reduces financial stability",
        reflection: "Yes! Frequent borrowing creates multiple debt obligations that reduce financial stability.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Frequent borrowing increases financial stability",
        reflection: "Actually, frequent borrowing decreases stability by creating multiple debt obligations.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "No relationship between borrowing frequency and stability",
        reflection: "There's a clear negative relationship between frequent borrowing and stability.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Stability only depends on repayment ability",
        reflection: "While repayment matters, frequency of borrowing also significantly impacts stability.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "What should you do if you find yourself borrowing frequently?",
    options: [
      
      {
        id: "a",
        label: "Continue borrowing as it's working fine",
        reflection: "Continuing frequent borrowing without addressing the root cause is not advisable.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Borrow even more to consolidate debts",
        reflection: "Borrowing more to consolidate existing debt often creates a worse financial situation.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Change lenders frequently to avoid detection",
        reflection: "Avoiding detection doesn't solve the underlying problem of frequent borrowing.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Assess your financial planning and create a budget",
        reflection: "Excellent! Assessing your financial planning and creating a budget can help reduce frequent borrowing.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
];

const totalStages = BORROWING_FREQUENCY_STAGES.length;
const successThreshold = totalStages;

const BorrowingFrequency = () => {
  const location = useLocation();
  const gameId = "finance-adults-53";
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
      "How can you assess your borrowing frequency and its impact on your finances?",
      "What strategies can help reduce the need for frequent borrowing?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = BORROWING_FREQUENCY_STAGES[currentStage];
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
  const stage = BORROWING_FREQUENCY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Borrowing Frequency"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={BORROWING_FREQUENCY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, BORROWING_FREQUENCY_STAGES.length)}
      totalLevels={BORROWING_FREQUENCY_STAGES.length}
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
            <span>Borrowing Patterns</span>
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
                        { stageId: BORROWING_FREQUENCY_STAGES[currentStage].id, isCorrect: BORROWING_FREQUENCY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Borrowing Frequency Awareness</strong>
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
              Skill unlocked: <strong>Borrowing Frequency Awareness</strong>
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

export default BorrowingFrequency;