import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BEHAVIOUR_OVER_INCOME_STAGES = [
  {
    id: 1,
    prompt: "Scenario: What matters more for financial health?",
    options: [
      {
        id: "income",
        label: "Income alone",
        reflection: "While income is important, it's not the sole determinant of financial health. People with high incomes can still face financial difficulties if they don't manage their money well.",
        isCorrect: false,
      },
      
      {
        id: "lifestyle",
        label: "Lifestyle matching income level",
        reflection: "Matching lifestyle to income level is important but it's still just one aspect of financial behavior. The broader discipline of managing money wisely is more critical to financial health.",
        isCorrect: false,
      },
      {
        id: "behaviour",
        label: "Financial behaviour and discipline",
        reflection: "Exactly! Financial behavior and discipline matter more for financial health. Good habits like budgeting, saving, and responsible spending protect your financial well-being regardless of income level.",
        isCorrect: true,
      },
      {
        id: "investments",
        label: "Investment returns only",
        reflection: "While investments can contribute to wealth, focusing solely on investment returns ignores the fundamental importance of spending less than you earn and building good financial habits.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "How does financial discipline protect against income fluctuations?",
    options: [
      
      {
        id: "debt",
        label: "By taking on more debt during low income periods",
        reflection: "Taking on more debt during low income periods increases financial stress rather than providing protection. This approach compounds financial problems during difficult times.",
        isCorrect: false,
      },
      {
        id: "habits",
        label: "Through established saving and spending habits",
        reflection: "Perfect! Financial discipline protects against income fluctuations through established saving and spending habits. These habits help you maintain stability even when income varies.",
        isCorrect: true,
      },
      {
        id: "spending",
        label: "By maintaining the same spending levels regardless of income",
        reflection: "Maintaining the same spending levels regardless of income changes is financially risky. Discipline involves adjusting spending based on income availability.",
        isCorrect: false,
      },
      {
        id: "avoidance",
        label: "By avoiding all financial planning",
        reflection: "Avoiding financial planning leaves you vulnerable to income fluctuations. Financial discipline requires active planning and management, not avoidance.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "Why can someone with modest income achieve better financial health than someone with high income?",
    options: [
      {
        id: "discipline",
        label: "Because of superior financial discipline",
        reflection: "Excellent! Someone with modest income can achieve better financial health than someone with high income due to superior financial discipline. Good habits matter more than income level.",
        isCorrect: true,
      },
      {
        id: "inheritance",
        label: "Because of family wealth inheritance",
        reflection: "While inheritance might help, it doesn't represent financial discipline. The question is about comparing individuals' own financial management abilities.",
        isCorrect: false,
      },
      {
        id: "location",
        label: "Because of living in a cheaper area",
        reflection: "Location might affect expenses, but it's not the primary reason someone with modest income could outperform someone with high income. The key is disciplined financial behavior.",
        isCorrect: false,
      },
      {
        id: "job",
        label: "Because of having a more secure job",
        reflection: "Job security is helpful, but it doesn't address the core principle that disciplined financial behavior matters more than income level. The comparison is about financial habits, not job types.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of prioritizing income over behavior?",
    options: [
      
      {
        id: "budgeting",
        label: "Creating and following a detailed budget",
        reflection: "Creating and following a budget is a sign of good financial discipline, not a warning sign. It shows proper prioritization of behavior over income.",
        isCorrect: false,
      },
      {
        id: "saving",
        label: "Automatically saving a percentage of income",
        reflection: "Automatically saving a percentage of income is a healthy financial behavior, not a warning sign. It demonstrates prioritizing discipline over income level.",
        isCorrect: false,
      },
      {
        id: "tracking",
        label: "Monitoring expenses regularly",
        reflection: "Monitoring expenses regularly is a positive financial behavior, not a warning sign. It shows attention to financial discipline rather than just focusing on income.",
        isCorrect: false,
      },
      {
        id: "lifestyle",
        label: "Consistently matching lifestyle to rising income",
        reflection: "Exactly! Consistently matching lifestyle to rising income (lifestyle inflation) is a warning sign of prioritizing income over behavior. This leads to spending all additional income rather than building financial discipline.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term benefit of focusing on financial behavior over income?",
    options: [
      
      {
        id: "spending",
        label: "Ability to spend more freely on wants",
        reflection: "Focusing on financial behavior doesn't primarily enable more spending on wants. The benefit is financial stability and security, not increased consumption.",
        isCorrect: false,
      },
      {
        id: "income",
        label: "Automatic increase in income level",
        reflection: "Focusing on financial behavior doesn't automatically increase income. The benefit is better management of whatever income you have, not necessarily earning more.",
        isCorrect: false,
      },
      {
        id: "stability",
        label: "Financial stability regardless of income level",
        reflection: "Exactly! Focusing on financial behavior over income leads to financial stability regardless of income level. Good habits protect and grow wealth at all income levels.",
        isCorrect: true,
      },
      {
        id: "avoidance",
        label: "Ability to avoid all financial responsibilities",
        reflection: "Focusing on financial behavior doesn't help avoid responsibilities. It helps you manage responsibilities better and build financial security.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = BEHAVIOUR_OVER_INCOME_STAGES.length;
const successThreshold = totalStages;

const BehaviourOverIncome = () => {
  const location = useLocation();
  const gameId = "finance-adults-97";
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
      "How can you prioritize financial discipline in your own life?",
      "What specific habits will help you focus on behavior over income?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = BEHAVIOUR_OVER_INCOME_STAGES[currentStage];
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
  const stage = BEHAVIOUR_OVER_INCOME_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Behaviour Over Income"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={BEHAVIOUR_OVER_INCOME_STAGES.length}
      currentLevel={Math.min(currentStage + 1, BEHAVIOUR_OVER_INCOME_STAGES.length)}
      totalLevels={BEHAVIOUR_OVER_INCOME_STAGES.length}
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
            <span>Financial Behavior</span>
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
                        { stageId: BEHAVIOUR_OVER_INCOME_STAGES[currentStage].id, isCorrect: BEHAVIOUR_OVER_INCOME_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Behavior-Based Financial Planning</strong>
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
              Skill unlocked: <strong>Behavior-Based Financial Planning</strong>
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

export default BehaviourOverIncome;