import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RESPONSIBLE_BORROWING_CHECKPOINT_STAGES = [
  {
    id: 1,
    prompt: "You are considering a loan for a luxury vacation. What is the most responsible approach?",
    options: [
      {
        id: "a",
        label: "Take the loan as vacations are important for mental health",
        reflection: "While vacations can be important, borrowing for luxury vacations is generally not financially responsible.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Save up for the vacation instead of borrowing",
        reflection: "Correct! Saving for discretionary expenses like vacations is more financially responsible than borrowing.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Take a loan but make it small",
        reflection: "Any loan for luxury expenses is unnecessary debt that creates interest obligations.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Borrow using a credit card instead of a loan",
        reflection: "Using credit cards for luxury expenses still creates unnecessary debt obligations.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "You're experiencing temporary financial stress. What should you do before considering a loan?",
    options: [
      {
        id: "a",
        label: "Review your budget and cut non-essential expenses first",
        reflection: "Exactly! Before borrowing, examine your expenses and see if adjustments can solve the temporary stress.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Immediately apply for multiple loans to cover expenses",
        reflection: "Applying for multiple loans during stress can lead to over-indebtedness and financial problems.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Borrow from friends instead of formal lenders",
        reflection: "Borrowing from friends can strain relationships and doesn't solve the underlying financial issue.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Use all available credit lines immediately",
        reflection: "Using all credit lines can create dangerous over-leverage and doesn't address the root cause.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "Your friend encourages you to take a loan for a business opportunity that seems lucrative. What do you do?",
    options: [
      {
        id: "a",
        label: "Trust your friend and take the loan immediately",
        reflection: "Making financial decisions based solely on others' advice without your own analysis is risky.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Take half the loan amount to minimize risk",
        reflection: "Even partial borrowing for unverified opportunities carries significant risk.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Borrow more than suggested to maximize potential profits",
        reflection: "Increasing borrowed amounts amplifies potential losses if the opportunity doesn't work out.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Evaluate the business opportunity yourself before deciding",
        reflection: "Right! Evaluate any business opportunity based on your own analysis of risks and returns.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "You qualify for a loan amount higher than what you need. What is the most responsible choice?",
    options: [
      {
        id: "a",
        label: "Take the full amount since you qualify",
        reflection: "Taking more than you need increases your debt burden unnecessarily and creates higher interest costs.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Take slightly more to have a buffer",
        reflection: "Taking more than needed still creates unnecessary debt obligations, even with a buffer rationale.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Take only the amount you actually need",
        reflection: "Perfect! Borrowing only what you need minimizes your debt obligation and interest costs.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Negotiate to increase the approved amount",
        reflection: "Increasing approved amounts when you don't need them increases unnecessary debt obligations.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "You're considering a loan with an EMI that takes up 60% of your income. What should you do?",
    options: [
      {
        id: "a",
        label: "Take the loan as long as you can make the payments",
        reflection: "An EMI that takes 60% of income is extremely risky and leaves no room for other expenses or emergencies.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Look for a loan with lower EMI or reconsider the need",
        reflection: "Correct! EMIs should ideally be below 30% of income to maintain financial stability.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Take the loan but reduce other expenses drastically",
        reflection: "Reducing other expenses drastically to accommodate high EMIs is unsustainable and risky.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Take the loan and hope your income increases",
        reflection: "Relying on future income increases to service high EMIs is risky and can lead to financial stress.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
];

const totalStages = RESPONSIBLE_BORROWING_CHECKPOINT_STAGES.length;
const successThreshold = totalStages; // Need to get all correct to pass

const ResponsibleBorrowingCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-adults-58";
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
      "How can you evaluate if a borrowing decision is truly necessary?",
      "What steps should you take before agreeing to any loan?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = RESPONSIBLE_BORROWING_CHECKPOINT_STAGES[currentStage];
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
  const stage = RESPONSIBLE_BORROWING_CHECKPOINT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Responsible Borrowing Checkpoint"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={RESPONSIBLE_BORROWING_CHECKPOINT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, RESPONSIBLE_BORROWING_CHECKPOINT_STAGES.length)}
      totalLevels={RESPONSIBLE_BORROWING_CHECKPOINT_STAGES.length}
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
            <span>Checkpoint</span>
            <span>Risk Assessment</span>
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
                        { stageId: RESPONSIBLE_BORROWING_CHECKPOINT_STAGES[currentStage].id, isCorrect: RESPONSIBLE_BORROWING_CHECKPOINT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    {hasPassed ? (
                      <>
                        Outcome: <strong>You can now recognise and avoid harmful borrowing patterns.</strong>
                      </>
                    ) : (
                      <>
                        Outcome: <strong>Review the scenarios to strengthen your borrowing decisions.</strong>
                      </>
                    )}
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
              {hasPassed ? (
                <>
                  Outcome: <strong>You can now recognise and avoid harmful borrowing patterns.</strong>
                </>
              ) : (
                <>
                  Outcome: <strong>Review the scenarios to strengthen your borrowing decisions.</strong>
                </>
              )}
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

export default ResponsibleBorrowingCheckpoint;