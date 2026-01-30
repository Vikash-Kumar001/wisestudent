import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INCOME_LOSS_SCENARIO_STAGES = [
  {
    id: 1,
    prompt: "Scenario: You lose income temporarily. What helps most?",
    options: [
      {
        id: "borrowing",
        label: "Immediate borrowing",
        reflection: "Immediate borrowing creates debt obligations that compound your financial problems. It's better to use your own resources first before considering debt options.",
        isCorrect: false,
      },
      
      {
        id: "ignore",
        label: "Ignore the problem and hope it resolves",
        reflection: "Ignoring the problem and hoping it resolves is financially dangerous. Income loss requires immediate action to prevent serious financial consequences.",
        isCorrect: false,
      },
      {
        id: "expenses",
        label: "Reduced expenses + emergency fund",
        reflection: "Exactly! Reducing expenses and using your emergency fund gives you time to find new income without creating additional debt obligations.",
        isCorrect: true,
      },
      {
        id: "luxury",
        label: "Continue spending on non-essentials",
        reflection: "Continuing to spend on non-essentials during income loss accelerates financial problems. It's essential to prioritize necessary expenses and reduce discretionary spending.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the first step when facing temporary income loss?",
    options: [
     
      {
        id: "panic",
        label: "Panic and make impulsive financial decisions",
        reflection: "Panic leads to poor financial decisions that can make the situation worse. It's important to stay calm and methodical when dealing with income loss.",
        isCorrect: false,
      },
       {
        id: "assess",
        label: "Assess your financial situation and resources",
        reflection: "Perfect! The first step is to assess your financial situation, including available savings, emergency funds, and essential expenses to determine how long you can manage.",
        isCorrect: true,
      },
      {
        id: "spending",
        label: "Immediately increase spending to feel better",
        reflection: "Increasing spending during income loss creates additional financial stress. The goal should be to reduce financial pressure, not increase it.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "Take on new debt to maintain lifestyle",
        reflection: "Taking on new debt to maintain lifestyle during income loss is financially dangerous. It creates obligations you may not be able to meet when income is reduced.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should you prioritize expenses during income loss?",
    options: [
      {
        id: "essential",
        label: "Focus on essential expenses first",
        reflection: "Excellent! During income loss, prioritize essential expenses like housing, utilities, food, and healthcare. Non-essential expenses should be reduced or eliminated.",
        isCorrect: true,
      },
      {
        id: "everything",
        label: "Try to maintain all previous spending levels",
        reflection: "Trying to maintain all previous spending levels during income loss is financially unsustainable and leads to debt accumulation or asset depletion.",
        isCorrect: false,
      },
      {
        id: "random",
        label: "Cut expenses randomly without planning",
        reflection: "Cutting expenses randomly without planning is inefficient and may eliminate necessary expenses while keeping unnecessary ones. A systematic approach is more effective.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Don't change spending habits at all",
        reflection: "Not changing spending habits during income loss typically leads to financial crisis. Adjustment is necessary to match spending with reduced income capacity.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of poor income loss planning?",
    options: [
      
      {
        id: "plan",
        label: "Having a written financial contingency plan",
        reflection: "Having a written financial contingency plan is actually a sign of good financial preparation, not poor planning. It shows you're proactively preparing for potential challenges.",
        isCorrect: false,
      },
      {
        id: "fund",
        label: "Maintaining adequate emergency fund levels",
        reflection: "Maintaining adequate emergency fund levels is a positive indicator of good financial management, not a warning sign. It demonstrates preparation for financial challenges.",
        isCorrect: false,
      },
      {
        id: "tracking",
        label: "Tracking expenses during reduced income periods",
        reflection: "Tracking expenses during reduced income periods is good financial management that helps maintain control. It's not a warning sign of poor planning but rather a sign of good financial discipline.",
        isCorrect: false,
      },
      {
        id: "anxiety",
        label: "Feeling anxious about paying essential bills",
        reflection: "Exactly! Feeling anxious about paying essential bills indicates inadequate planning for income loss. Good preparation should provide confidence in handling temporary income reductions.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term benefit of handling income loss properly?",
    options: [
      
      {
        id: "spending",
        label: "Ability to continue spending on all wants and desires",
        reflection: "Proper income loss handling is about security and survival, not continuing to spend on all wants. It's focused on meeting essential needs, not maintaining all previous consumption.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "Building experience with various debt instruments",
        reflection: "Good income loss handling focuses on avoiding debt, not gaining experience with it. The goal is to minimize financial stress and debt accumulation during income reduction.",
        isCorrect: false,
      },
      {
        id: "security",
        label: "Maintaining financial stability and avoiding debt",
        reflection: "Exactly! Handling income loss properly helps you maintain financial stability and avoid accumulating debt during temporary income reductions, protecting your long-term financial health.",
        isCorrect: true,
      },
      {
        id: "avoidance",
        label: "Avoiding all necessary expenses during loss",
        reflection: "Proper handling of income loss doesn't mean avoiding necessary expenses. It's about prioritizing and adjusting spending appropriately to maintain basic financial security.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = INCOME_LOSS_SCENARIO_STAGES.length;
const successThreshold = totalStages;

const IncomeLossScenario = () => {
  const location = useLocation();
  const gameId = "finance-adults-88";
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
      "How can you create a plan for managing temporary income loss?",
      "What specific expenses would you reduce and by how much?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = INCOME_LOSS_SCENARIO_STAGES[currentStage];
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
  const stage = INCOME_LOSS_SCENARIO_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Income Loss Scenario"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={INCOME_LOSS_SCENARIO_STAGES.length}
      currentLevel={Math.min(currentStage + 1, INCOME_LOSS_SCENARIO_STAGES.length)}
      totalLevels={INCOME_LOSS_SCENARIO_STAGES.length}
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
            <span>Income Loss</span>
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
                        { stageId: INCOME_LOSS_SCENARIO_STAGES[currentStage].id, isCorrect: INCOME_LOSS_SCENARIO_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Income Loss Management</strong>
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
              Skill unlocked: <strong>Income Loss Management</strong>
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

export default IncomeLossScenario;