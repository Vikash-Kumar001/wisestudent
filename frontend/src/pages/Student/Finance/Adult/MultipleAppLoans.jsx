import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MULTIPLE_APP_LOANS_STAGES = [
  {
    id: 1,
    prompt: "Taking loans from many apps leads to:",
    options: [
      {
        id: "flexibility",
        label: "Flexibility",
        reflection: "Actually, taking loans from multiple apps creates complexity and stress rather than flexibility. Managing multiple loans simultaneously is challenging.",
        isCorrect: false,
      },
      
      {
        id: "options",
        label: "More borrowing options",
        reflection: "While you might have more options, this also means more obligations and complexity which leads to stress rather than benefits.",
        isCorrect: false,
      },
      {
        id: "stress",
        label: "Severe repayment stress",
        reflection: "Exactly! Multiple app loans create severe repayment stress as you have to track different due dates, interest rates, and terms across various platforms.",
        isCorrect: true,
      },
      {
        id: "benefits",
        label: "Better financial benefits",
        reflection: "Multiple loans actually increase your financial burden and stress rather than providing benefits. Each loan adds to your obligations.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What is the danger of app-based loan stacking?",
    options: [
      {
        id: "easy",
        label: "It's easier to manage",
        reflection: "Actually, managing multiple app loans is more difficult due to different terms, interest rates, and repayment schedules across various platforms.",
        isCorrect: false,
      },
      {
        id: "dangerous",
        label: "It's dangerous and creates repayment chaos",
        reflection: "Correct! App-based loan stacking is dangerous as it creates repayment chaos, making it difficult to track obligations and increasing the risk of default.",
        isCorrect: true,
      },
      {
        id: "safe",
        label: "It's a safe financial strategy",
        reflection: "No, taking multiple loans from different apps is not safe. It significantly increases financial risk and stress.",
        isCorrect: false,
      },
      {
        id: "simple",
        label: "It simplifies your finances",
        reflection: "Multiple loans from different apps actually complicate rather than simplify your financial situation.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How does taking loans from multiple apps affect your repayment capacity?",
    options: [
      {
        id: "improve",
        label: "It improves your repayment capacity",
        reflection: "Taking multiple loans actually stretches your repayment capacity thin, making it harder to meet all obligations.",
        isCorrect: false,
      },
      
      {
        id: "maintain",
        label: "It maintains your repayment capacity",
        reflection: "Multiple loans strain rather than maintain your repayment capacity as more of your income gets committed to loan payments.",
        isCorrect: false,
      },
      {
        id: "double",
        label: "It doubles your repayment capacity",
        reflection: "That's incorrect. Multiple loans don't increase your income, so they don't double your repayment capacity.",
        isCorrect: false,
      },
      {
        id: "reduce",
        label: "It reduces your effective repayment capacity",
        reflection: "Right! When you have multiple loans, each repayment takes a portion of your income, reducing your effective capacity to handle each obligation.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What happens when you have multiple loan due dates to track?",
    options: [
      {
        id: "organized",
        label: "You become more organized",
        reflection: "While it might seem like it promotes organization, multiple due dates across different apps often lead to confusion and missed payments.",
        isCorrect: false,
      },
      {
        id: "confusion",
        label: "It creates confusion and possible missed payments",
        reflection: "Exactly! Multiple due dates across different apps create confusion, increasing the risk of missing payments and incurring penalties.",
        isCorrect: true,
      },
      {
        id: "reminder",
        label: "All apps remind you perfectly",
        reflection: "Relying on app reminders isn't foolproof. Different systems, potential technical issues, and human error can still lead to missed payments.",
        isCorrect: false,
      },
      {
        id: "calendar",
        label: "Calendar apps solve all problems",
        reflection: "While calendar apps help, the complexity of multiple loans from different apps still increases the risk of confusion and missed payments.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "Why is app-based loan stacking particularly risky?",
    options: [
      {
        id: "stacking",
        label: "App-based loan stacking is dangerous",
        reflection: "Perfect! App-based loan stacking is dangerous because it compounds risks, creates multiple repayment obligations, and makes financial management extremely difficult.",
        isCorrect: true,
      },
      {
        id: "technology",
        label: "Because of advanced technology",
        reflection: "Technology itself isn't the problem. The issue is the cumulative effect of multiple obligations across different platforms.",
        isCorrect: false,
      },
      
      {
        id: "access",
        label: "Easy access to loans",
        reflection: "While easy access might seem beneficial, it's the stacking of multiple loans that creates the danger, not the accessibility itself.",
        isCorrect: false,
      },
      {
        id: "competition",
        label: "Due to competition between apps",
        reflection: "Competition between apps doesn't create the risk; the accumulation of multiple loan obligations does.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = MULTIPLE_APP_LOANS_STAGES.length;
const successThreshold = totalStages;

const MultipleAppLoans = () => {
  const location = useLocation();
  const gameId = "finance-adults-67";
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
      "How can you assess if you're taking on too many loan obligations?",
      "What strategies help you avoid the temptation of multiple app loans?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = MULTIPLE_APP_LOANS_STAGES[currentStage];
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
  const stage = MULTIPLE_APP_LOANS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Multiple App Loans"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={MULTIPLE_APP_LOANS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, MULTIPLE_APP_LOANS_STAGES.length)}
      totalLevels={MULTIPLE_APP_LOANS_STAGES.length}
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
            <span>Multiple Loans</span>
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
                        { stageId: MULTIPLE_APP_LOANS_STAGES[currentStage].id, isCorrect: MULTIPLE_APP_LOANS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Understanding loan stacking dangers</strong>
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
              Skill unlocked: <strong>Understanding loan stacking dangers</strong>
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

export default MultipleAppLoans;