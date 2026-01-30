import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HEALTH_EMERGENCY_PLANNING_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Which reduces medical borrowing risk?",
    options: [
      {
        id: "ignore",
        label: "Ignoring health planning",
        reflection: "Ignoring health planning leaves you completely vulnerable to medical emergencies. Without preparation, you're likely to face expensive medical debt during health crises.",
        isCorrect: false,
      },
     
      {
        id: "hope",
        label: "Relying on family help",
        reflection: "While family support is valuable, it's not a reliable strategy for medical emergencies. Not all families can provide sufficient financial assistance, and you shouldn't count on it.",
        isCorrect: false,
      },
       {
        id: "insurance",
        label: "Basic insurance or savings",
        reflection: "Exactly! Basic insurance or savings significantly reduces medical borrowing risk by providing financial protection when health emergencies occur unexpectedly.",
        isCorrect: true,
      },
      {
        id: "delay",
        label: "Delaying all medical care until you can afford it",
        reflection: "Delaying necessary medical care often leads to worse health outcomes and can actually increase overall costs as minor problems become serious emergencies.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the main purpose of health emergency planning?",
    options: [
      
      {
        id: "insurance",
        label: "Only buying expensive medical insurance",
        reflection: "Health emergency planning is about comprehensive protection that includes, but is not limited to, insurance. Savings and budgeting also play important roles in financial protection.",
        isCorrect: false,
      },
      {
        id: "protection",
        label: "Financial protection during medical emergencies",
        reflection: "Perfect! The main purpose of health emergency planning is to provide financial protection when medical emergencies occur unexpectedly.",
        isCorrect: true,
      },
      {
        id: "invincibility",
        label: "Assuming you're financially invincible",
        reflection: "No one is financially invincible - anyone can face unexpected medical expenses. Health emergency planning is about being prepared for the unexpected, not assuming invincibility.",
        isCorrect: false,
      },
      {
        id: "avoidance",
        label: "Avoiding all medical care to save money",
        reflection: "Avoiding medical care to save money is dangerous and counterproductive. It can lead to more serious health problems and higher costs in the long run.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should you prioritize health emergency preparations?",
    options: [
      {
        id: "insurance",
        label: "Start with basic insurance, then build emergency savings",
        reflection: "Excellent! Starting with basic insurance provides immediate protection, while building emergency savings creates additional financial security for medical expenses.",
        isCorrect: true,
      },
      {
        id: "savings",
        label: "Build emergency savings only, skip insurance",
        reflection: "While emergency savings are important, they may not be sufficient for major medical emergencies. Insurance provides additional protection that savings alone cannot offer.",
        isCorrect: false,
      },
      {
        id: "nothing",
        label: "Do nothing and hope for the best",
        reflection: "Doing nothing and hoping for the best is financially risky. Medical emergencies are common enough that preparation is essential for financial security.",
        isCorrect: false,
      },
      {
        id: "everything",
        label: "Buy the most expensive coverage available",
        reflection: "Buying the most expensive coverage isn't always the best approach. It's better to find a balance between adequate protection and affordability based on your specific needs.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of poor health emergency planning?",
    options: [
      
      {
        id: "coverage",
        label: "Having comprehensive health coverage",
        reflection: "Having comprehensive health coverage is actually a sign of good health emergency planning, not poor planning. It shows you're taking proactive steps to protect yourself.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "Maintaining dedicated health emergency savings",
        reflection: "Maintaining dedicated health emergency savings is a positive sign of good financial planning, not a warning sign. It demonstrates preparedness for medical expenses.",
        isCorrect: false,
      },
      {
        id: "prevention",
        label: "Investing in preventive health measures",
        reflection: "Investing in preventive health measures is excellent planning that can reduce future medical costs. It's a sign of good health management, not poor emergency planning.",
        isCorrect: false,
      },
      {
        id: "panic",
        label: "Panic about medical bills without a plan",
        reflection: "Exactly! Panicking about medical bills without a plan indicates poor health emergency planning. Good preparation should provide peace of mind, not financial anxiety.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term benefit of health emergency planning?",
    options: [
      
      {
        id: "spending",
        label: "Ability to spend more on non-essentials",
        reflection: "Health emergency planning is about security, not enabling more spending on non-essentials. Its value is in protection, not increased consumption.",
        isCorrect: false,
      },
      {
        id: "risk",
        label: "Increased risk-taking with health decisions",
        reflection: "Good health emergency planning actually reduces risk by providing financial protection. It doesn't encourage risk-taking with health decisions.",
        isCorrect: false,
      },
      {
        id: "security",
        label: "Financial security and peace of mind",
        reflection: "Exactly! Health emergency planning provides financial security and peace of mind by ensuring you can handle medical expenses without creating financial hardship or debt.",
        isCorrect: true,
      },
      {
        id: "avoidance",
        label: "Ability to avoid all medical expenses",
        reflection: "Health emergency planning doesn't help you avoid all medical expenses - it helps you manage them financially. Some medical expenses are unavoidable and necessary for good health.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = HEALTH_EMERGENCY_PLANNING_STAGES.length;
const successThreshold = totalStages;

const HealthEmergencyPlanning = () => {
  const location = useLocation();
  const gameId = "finance-adults-87";
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
      "How can you assess your current health emergency preparedness?",
      "What steps will you take to improve your health financial planning?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = HEALTH_EMERGENCY_PLANNING_STAGES[currentStage];
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
  const stage = HEALTH_EMERGENCY_PLANNING_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Health Emergency Planning"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={HEALTH_EMERGENCY_PLANNING_STAGES.length}
      currentLevel={Math.min(currentStage + 1, HEALTH_EMERGENCY_PLANNING_STAGES.length)}
      totalLevels={HEALTH_EMERGENCY_PLANNING_STAGES.length}
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
            <span>Health Emergency</span>
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
                        { stageId: HEALTH_EMERGENCY_PLANNING_STAGES[currentStage].id, isCorrect: HEALTH_EMERGENCY_PLANNING_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Health Emergency Financial Planning</strong>
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
              Skill unlocked: <strong>Health Emergency Financial Planning</strong>
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

export default HealthEmergencyPlanning;