import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const IGNORING_WARNING_SIGNS_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Which is a warning sign? ",
    options: [
     
      {
        id: "a",
        label: "Comfortable repayment",
        reflection: "Actually, comfortable repayment is a positive sign, not a warning sign.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Paying EMIs on time regularly",
        reflection: "Regular on-time payments are a positive sign, not a warning sign.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Having surplus income after EMIs",
        reflection: "Surplus income after EMIs is a positive sign of good financial management.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Difficulty paying EMIs",
        reflection: "Correct! Difficulty paying EMIs is a clear warning sign that needs immediate attention.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "What should you do when you notice difficulty in paying EMIs?",
    options: [
      
      {
        id: "a",
        label: "Ignore it hoping it resolves itself",
        reflection: "Ignoring warning signs typically leads to worsening financial problems.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Delay payments until next month",
        reflection: "Delaying payments can result in penalties and credit score damage.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Address the issue immediately",
        reflection: "Exactly! Early intervention can prevent bigger financial problems.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Take another loan to cover the EMI",
        reflection: "Taking additional loans to cover EMIs can create a debt spiral.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "What are early warning signs of loan repayment difficulty?",
    options: [
      
      {
        id: "a",
        label: "Having money left after paying EMIs",
        reflection: "Having money left after EMIs is a positive sign, not a warning sign.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Struggling to meet other expenses after EMIs",
        reflection: "Yes! Struggling with other expenses after EMIs indicates potential repayment stress.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Paying EMIs early each month",
        reflection: "Paying EMIs early is a positive sign of good financial management.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Having a stable income that covers EMIs",
        reflection: "Stable income covering EMIs is a positive sign, not a warning sign.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "Why is it important to address warning signs early?",
    options: [
      {
        id: "a",
        label: "To prevent escalation into major financial problems",
        reflection: "Perfect! Addressing warnings early can prevent minor issues from becoming major crises.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Early action is not necessary",
        reflection: "Early action is crucial to prevent minor issues from becoming major problems.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Warning signs always resolve themselves",
        reflection: "Warning signs typically worsen if ignored, not resolve themselves.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "There's no benefit to early intervention",
        reflection: "Early intervention is often the key to preventing financial difficulties from escalating.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "What is the best approach to handling early warning signs of repayment difficulty?",
    options: [
      
      {
        id: "a",
        label: "Wait to see if they disappear on their own",
        reflection: "Waiting can allow minor issues to develop into major financial problems.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Deny that warning signs exist",
        reflection: "Denying warning signs prevents you from taking necessary corrective action.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Ignore them until they become critical issues",
        reflection: "Waiting until issues become critical makes them much harder to address.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Acknowledge them promptly and take corrective action",
        reflection: "Excellent! Prompt acknowledgment and action can prevent minor issues from becoming major problems.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
];

const totalStages = IGNORING_WARNING_SIGNS_STAGES.length;
const successThreshold = totalStages;

const IgnoringWarningSigns = () => {
  const location = useLocation();
  const gameId = "finance-adults-55";
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
      "How can you identify early warning signs of financial difficulty?",
      "What steps should you take when you notice potential repayment issues?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = IGNORING_WARNING_SIGNS_STAGES[currentStage];
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
  const stage = IGNORING_WARNING_SIGNS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Ignoring Warning Signs"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={IGNORING_WARNING_SIGNS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, IGNORING_WARNING_SIGNS_STAGES.length)}
      totalLevels={IGNORING_WARNING_SIGNS_STAGES.length}
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
            <span>Warning Signs</span>
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
                        { stageId: IGNORING_WARNING_SIGNS_STAGES[currentStage].id, isCorrect: IGNORING_WARNING_SIGNS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Warning Sign Recognition</strong>
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
              Skill unlocked: <strong>Warning Sign Recognition</strong>
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

export default IgnoringWarningSigns;