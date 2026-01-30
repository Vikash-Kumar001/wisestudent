import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INCOME_STABILITY_STAGES = [
  {
    id: 1,
    prompt: "Why is stable income important?",
    options: [
      {
        id: "a",
        label: "For spending freely",
        reflection: "While stable income does provide some freedom, the primary importance lies in the predictability and security it offers for financial planning.",
        isCorrect: false,
      },
     
      {
        id: "b",
        label: "To show off to friends",
        reflection: "While financial stability can provide confidence, using it primarily for social status can lead to poor financial decisions and unnecessary spending pressure.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "To avoid working hard",
        reflection: "Stable income typically results from consistent effort and smart financial management, not from avoiding work. It's about working smarter, not necessarily less.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "For planning and saving safely",
        reflection: "Exactly! Stable income provides the foundation for consistent financial planning and secure savings, enabling long-term financial goals.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "How does income stability affect budgeting?",
    options: [
      {
        id: "a",
        label: "Makes budgeting impossible",
        reflection: "Actually, stable income makes budgeting much easier and more effective, as you can predict and plan your expenses with greater accuracy.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Forces you to spend more",
        reflection: "Stable income gives you the flexibility to spend wisely, not necessarily more. It actually helps you avoid overspending by providing clear financial boundaries.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Allows for accurate monthly planning",
        reflection: "Perfect! Stable income enables you to create realistic budgets, set aside consistent savings, and plan for both short-term needs and long-term goals.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Eliminates the need for savings",
        reflection: "Even with stable income, savings remain crucial for emergencies, future goals, and financial security. Stability makes saving easier, not unnecessary.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "What is the main benefit of predictable income?",
    options: [
      {
        id: "a",
        label: "You can buy anything anytime",
        reflection: "While predictable income does provide some spending flexibility, the real benefit is in the financial security and planning ability it provides.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Reduces financial stress and uncertainty",
        reflection: "Exactly! Predictable income eliminates the anxiety of not knowing how much money you'll have, allowing for better decision-making and peace of mind.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "You never have to budget again",
        reflection: "Even with predictable income, budgeting remains important for financial health, goal-setting, and ensuring you're making the most of your resources.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Allows reckless spending",
        reflection: "Predictable income should actually encourage more responsible spending, as you can plan and allocate funds appropriately rather than spending impulsively.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "How should you use stable income for financial growth?",
    options: [
      {
        id: "a",
        label: "Invest in skills and future opportunities",
        reflection: "Excellent! Stable income provides the perfect opportunity to invest in yourself through education, skills, and other growth opportunities that can increase your earning potential.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Spend it all on immediate wants",
        reflection: "While enjoying your income is important, spending it all on immediate wants prevents you from building long-term financial security and growth.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Keep it all in cash under the mattress",
        reflection: "While keeping some cash for emergencies is wise, keeping all your stable income idle prevents it from growing and working for you through investments or other opportunities.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Ignore it and hope for the best",
        reflection: "Ignoring stable income is a missed opportunity. Taking advantage of financial stability through planning and smart decisions is key to building wealth.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What does income stability enable you to do?",
    options: [
      {
        id: "a",
        label: "Avoid all financial responsibilities",
        reflection: "Income stability actually enables you to take on more financial responsibilities confidently, not avoid them. It provides the foundation for managing obligations effectively.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Spend without any thought",
        reflection: "While stable income provides some flexibility, thoughtful spending remains important for maintaining financial health and achieving long-term goals.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Stop caring about money",
        reflection: "Income stability should make you more, not less, financially conscious. It provides the opportunity to make strategic financial decisions that benefit your future.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Build long-term financial security",
        reflection: "Perfect! Income stability is the cornerstone of long-term financial security, enabling consistent saving, investing, and planning for future goals and retirement.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
];

const totalStages = INCOME_STABILITY_STAGES.length;
const successThreshold = totalStages;

const IncomeStability = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-76";
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
      "How can stable income help you achieve your long-term financial goals?",
      "What steps can you take to create more stability in your income?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = INCOME_STABILITY_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);
    
    // Update coins if the answer is correct
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    // Wait for the reflection period before allowing to proceed
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
    // Handle the final stage separately
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
      showCorrectAnswerFeedback(currentStageData.reward, true);
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
  const stage = INCOME_STABILITY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Income Stability"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={INCOME_STABILITY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, INCOME_STABILITY_STAGES.length)}
      totalLevels={INCOME_STABILITY_STAGES.length}
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
            <span>Income Stability</span>
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
                        { stageId: INCOME_STABILITY_STAGES[currentStage].id, isCorrect: INCOME_STABILITY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Income stability awareness</strong>
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
              Skill unlocked: <strong>Income stability awareness</strong>
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

export default IncomeStability;