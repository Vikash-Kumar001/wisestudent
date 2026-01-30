import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DAILY_EXPENSE_TRACKING_STAGES = [
  {
    id: 1,
    prompt: "What habit improves business control?",
    options: [
      {
        id: "memory",
        label: "Memory-based tracking",
        reflection: "Memory-based tracking is unreliable and can lead to missed expenses. It's difficult to remember all expenses accurately without proper records.",
        isCorrect: false,
      },
      {
        id: "recording",
        label: "Daily expense recording",
        reflection: "Exactly! Recording expenses daily creates accurate records that help you identify patterns, control spending, and improve business management.",
        isCorrect: true,
      },
      {
        id: "weekly",
        label: "Weekly summary of expenses",
        reflection: "While weekly tracking is better than monthly, daily tracking provides more accurate and timely information for better business control.",
        isCorrect: false,
      },
      {
        id: "monthly",
        label: "Monthly reconciliation only",
        reflection: "Monthly tracking is too infrequent to provide timely insights for effective business control. Daily tracking is more effective.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Why is daily expense tracking important for business?",
    options: [
       {
        id: "control",
        label: "It provides better control over spending",
        reflection: "Correct! Daily tracking gives you real-time visibility into your spending patterns, allowing for better control and decision-making.",
        isCorrect: true,
      },
      {
        id: "time",
        label: "It saves time",
        reflection: "While tracking might seem time-consuming initially, it actually saves time in the long run by preventing financial issues and providing clear insights.",
        isCorrect: false,
      },
     
      {
        id: "software",
        label: "It requires special software",
        reflection: "Daily tracking doesn't require special software. The key benefit is gaining insight into your spending patterns, not the tool used.",
        isCorrect: false,
      },
      {
        id: "paperwork",
        label: "It reduces paperwork",
        reflection: "Daily tracking might increase some documentation, but the primary benefit is improved financial control and awareness.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What does daily expense tracking help you identify?",
    options: [
      {
        id: "income",
        label: "Only your sources of income",
        reflection: "Daily tracking primarily focuses on expenses, helping you understand where money is going rather than just where it's coming from.",
        isCorrect: false,
      },
     
      {
        id: "customers",
        label: "Customer preferences",
        reflection: "While customer preferences are important, daily expense tracking specifically helps you understand your spending patterns and financial outflows.",
        isCorrect: false,
      },
      {
        id: "competitors",
        label: "Competitor pricing strategies",
        reflection: "Daily expense tracking helps you understand your own spending patterns, not competitor strategies.",
        isCorrect: false,
      },
       {
        id: "patterns",
        label: "Spending patterns and unnecessary expenses",
        reflection: "Exactly! Daily tracking reveals spending patterns and highlights areas where you might be spending unnecessarily, helping you optimize expenses.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How does daily expense tracking improve business management?",
    options: [
      {
        id: "hiding",
        label: "By hiding financial problems",
        reflection: "Daily tracking does the opposite - it reveals financial issues early so they can be addressed before becoming bigger problems.",
        isCorrect: false,
      },
      
      {
        id: "increasing",
        label: "By increasing business expenses",
        reflection: "Daily tracking doesn't increase expenses. It helps identify where expenses can be optimized or reduced.",
        isCorrect: false,
      },
      {
        id: "revealing",
        label: "By revealing financial leaks and trends",
        reflection: "Right! Daily tracking reveals financial leaks (unexpected expenses) and trends (patterns over time), enabling proactive management decisions.",
        isCorrect: true,
      },
      {
        id: "complicating",
        label: "By making finances more complicated",
        reflection: "Actually, daily tracking simplifies financial management by providing clear visibility into where money is going.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What is the outcome of consistent daily expense tracking?",
    options: [
      {
        id: "forgetfulness",
        label: "Increased forgetfulness about spending",
        reflection: "Consistent daily tracking does the opposite - it increases awareness and reduces forgetfulness about spending patterns.",
        isCorrect: false,
      },
      {
        id: "records",
        label: "Records reveal leaks and trends",
        reflection: "Perfect! Consistent daily tracking creates records that reveal financial leaks and trends, leading to better financial control and decision-making.",
        isCorrect: true,
      },
      {
        id: "inefficiency",
        label: "Greater business inefficiency",
        reflection: "Daily tracking increases efficiency by highlighting where money is being wasted, leading to better financial management.",
        isCorrect: false,
      },
      {
        id: "stress",
        label: "More financial stress",
        reflection: "Actually, daily tracking reduces financial stress by providing clarity and control over expenses, helping prevent unexpected financial problems.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = DAILY_EXPENSE_TRACKING_STAGES.length;
const successThreshold = totalStages;

const DailyExpenseTracking = () => {
  const location = useLocation();
  const gameId = "finance-adults-75";
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
      "How can you implement daily expense tracking in your business?",
      "What tools or methods work best for consistent daily expense recording?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = DAILY_EXPENSE_TRACKING_STAGES[currentStage];
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
  const stage = DAILY_EXPENSE_TRACKING_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Daily Expense Tracking"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={DAILY_EXPENSE_TRACKING_STAGES.length}
      currentLevel={Math.min(currentStage + 1, DAILY_EXPENSE_TRACKING_STAGES.length)}
      totalLevels={DAILY_EXPENSE_TRACKING_STAGES.length}
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
            <span>Expense Tracking</span>
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
                        { stageId: DAILY_EXPENSE_TRACKING_STAGES[currentStage].id, isCorrect: DAILY_EXPENSE_TRACKING_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Daily expense tracking mastery</strong>
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
              Skill unlocked: <strong>Daily expense tracking mastery</strong>
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

export default DailyExpenseTracking;