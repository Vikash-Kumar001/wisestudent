import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GRADUAL_INCLUSION_STAGES = [
  {
    id: 1,
    prompt: "Scenario: What is a safer path to financial inclusion?",
    options: [
      {
        id: "large",
        label: "Taking large loans immediately",
        reflection: "Taking large loans immediately without experience can lead to financial stress and defaults. This approach carries high risk for newcomers to the financial system.",
        isCorrect: false,
      },
      {
        id: "gradual",
        label: "Gradual use of banking and small credit",
        reflection: "Exactly! Gradual use of banking and small credit is the safer path to financial inclusion. This approach allows you to build experience, establish credit history, and learn financial management skills progressively.",
        isCorrect: true,
      },
      {
        id: "informal",
        label: "Using only informal financial networks",
        reflection: "While informal networks have their place, they don't provide the protections, regulatory oversight, and credit-building opportunities that formal financial inclusion offers.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Avoiding all financial services",
        reflection: "Avoiding all financial services prevents you from accessing the benefits of the formal financial system, including savings protection, credit building, and other financial tools for growth.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the main advantage of gradual financial inclusion?",
    options: [
      {
        id: "learning",
        label: "Learning financial management skills step-by-step",
        reflection: "Perfect! Learning financial management skills step-by-step is the main advantage of gradual financial inclusion. This approach builds competence and confidence over time.",
        isCorrect: true,
      },
      {
        id: "speed",
        label: "Getting to financial goals faster",
        reflection: "While gradual inclusion might take longer initially, it's more sustainable long-term. The focus is on building skills and reducing risk rather than speed.",
        isCorrect: false,
      },
      {
        id: "cost",
        label: "Lower overall financial costs",
        reflection: "Gradual inclusion doesn't necessarily mean lower costs from the start. The main benefit is risk reduction and skill building rather than immediate cost savings.",
        isCorrect: false,
      },
      {
        id: "access",
        label: "Access to all services immediately",
        reflection: "Gradual inclusion is about building access over time, not getting immediate access to everything. The approach is to start with basic services and expand access as you build experience.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should someone begin their journey toward financial inclusion?",
    options: [
      
      {
        id: "credit",
        label: "Begin with credit products immediately",
        reflection: "Starting with credit products immediately is risky without first establishing financial habits and understanding basic banking. It's better to start with simpler services first.",
        isCorrect: false,
      },
      {
        id: "investments",
        label: "Open investment accounts right away",
        reflection: "Opening investment accounts immediately is premature without first mastering basic banking and credit services. It's better to build foundational skills first.",
        isCorrect: false,
      },
      {
        id: "loans",
        label: "Apply for a loan as the first step",
        reflection: "Applying for a loan as the first step is risky without an established financial history or relationship with the institution. Basic services should come first.",
        isCorrect: false,
      },
      {
        id: "basic",
        label: "Start with basic banking services like savings accounts",
        reflection: "Excellent! Starting with basic banking services like savings accounts is the ideal way to begin financial inclusion. This provides a foundation for learning and building experience safely.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of rushing financial inclusion?",
    options: [
      
      {
        id: "savings",
        label: "Building savings consistently over time",
        reflection: "Building savings consistently is actually a positive sign of good financial management, not a warning sign of rushing inclusion. It shows responsible behavior.",
        isCorrect: false,
      },
      {
        id: "education",
        label: "Taking time to learn about financial products",
        reflection: "Taking time to learn about financial products is a sign of responsible inclusion, not rushing. Education is an important part of gradual financial inclusion.",
        isCorrect: false,
      },
      {
        id: "defaults",
        label: "Missing payments or defaulting on early obligations",
        reflection: "Exactly! Missing payments or defaulting on early obligations is a warning sign of rushing financial inclusion. This indicates taking on more financial responsibility than your current skill level can handle.",
        isCorrect: true,
      },
      {
        id: "simple",
        label: "Starting with simple financial products",
        reflection: "Starting with simple financial products is the correct approach to gradual inclusion, not a warning sign. It shows appropriate caution and planning.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term benefit of gradual financial inclusion?",
    options: [
      
      {
        id: "spending",
        label: "Increased ability to spend on non-essentials",
        reflection: "While financial inclusion might increase spending capacity, the benefit isn't about spending more on non-essentials. The value is in building financial stability and skills.",
        isCorrect: false,
      },
      {
        id: "foundation",
        label: "Strong financial foundation and reduced mistakes",
        reflection: "Exactly! Gradual financial inclusion creates a strong financial foundation and reduces mistakes by allowing progressive learning and experience building with manageable risk levels.",
        isCorrect: true,
      },
      {
        id: "debt",
        label: "Easier access to large amounts of debt",
        reflection: "Easy access to large amounts of debt isn't the goal of responsible financial inclusion. The benefit is building financial skills and stability, not increasing leverage.",
        isCorrect: false,
      },
      {
        id: "avoidance",
        label: "Ability to avoid all financial responsibilities",
        reflection: "Financial inclusion is about taking on appropriate financial responsibilities, not avoiding them. The goal is to manage responsibilities effectively.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = GRADUAL_INCLUSION_STAGES.length;
const successThreshold = totalStages;

const GradualFinancialInclusion = () => {
  const location = useLocation();
  const gameId = "finance-adults-96";
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
      "How can you create a personal plan for gradual financial inclusion?",
      "What specific financial services should you consider first?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = GRADUAL_INCLUSION_STAGES[currentStage];
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
  const stage = GRADUAL_INCLUSION_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Gradual Financial Inclusion"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={GRADUAL_INCLUSION_STAGES.length}
      currentLevel={Math.min(currentStage + 1, GRADUAL_INCLUSION_STAGES.length)}
      totalLevels={GRADUAL_INCLUSION_STAGES.length}
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
            <span>Financial Inclusion</span>
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
                        { stageId: GRADUAL_INCLUSION_STAGES[currentStage].id, isCorrect: GRADUAL_INCLUSION_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Gradual Financial Inclusion</strong>
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
              Skill unlocked: <strong>Gradual Financial Inclusion</strong>
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

export default GradualFinancialInclusion;