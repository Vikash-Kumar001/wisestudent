import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMERGENCY_BUSINESS_EXPENSES_STAGES = [
  {
    id: 1,
    prompt: "Scenario: A machine breaks down. What's safer first?",
    options: [
      {
        id: "loan",
        label: "Immediate high-interest loan",
        reflection: "Taking an immediate high-interest loan creates debt pressure and financial stress. It's expensive and puts you in a difficult position.",
        isCorrect: false,
      },
      
      {
        id: "ignore",
        label: "Ignore the problem temporarily",
        reflection: "Ignoring equipment problems usually makes them worse and more expensive to fix. It's not a sustainable solution for business operations.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "Savings or planned repair fund",
        reflection: "Exactly! Using savings or a planned repair fund is the safest approach. It avoids debt and maintains financial stability during emergencies.",
        isCorrect: true,
      },
      {
        id: "credit",
        label: "Use business credit card for everything",
        reflection: "Using credit cards for emergency repairs can lead to high-interest debt and financial strain. It's better to have dedicated emergency funds.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the best way to prepare for business emergencies?",
    options: [
     
      {
        id: "hope",
        label: "Hope nothing breaks down",
        reflection: "Relying on hope is not a strategy. Business equipment will inevitably need repairs or replacement, so planning is essential.",
        isCorrect: false,
      },
       {
        id: "fund",
        label: "Set aside money regularly for emergencies",
        reflection: "Perfect! Regularly setting aside money for emergencies creates a financial cushion that protects your business from unexpected costs.",
        isCorrect: true,
      },
      {
        id: "loan",
        label: "Keep loan options available",
        reflection: "While having loan options is good, relying on them for every emergency creates debt dependency. It's better to prevent emergencies through preparation.",
        isCorrect: false,
      },
      {
        id: "insurance",
        label: "Rely solely on insurance coverage",
        reflection: "Insurance helps, but it doesn't cover everything and often has deductibles. Having your own emergency fund provides more comprehensive protection.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How much should you save for business emergencies?",
    options: [
      {
        id: "minimum",
        label: "At least 3-6 months of operating expenses",
        reflection: "Excellent! Having 3-6 months of operating expenses saved provides a solid buffer for most business emergencies without creating financial stress.",
        isCorrect: true,
      },
      {
        id: "nothing",
        label: "Nothing, I'll handle emergencies as they come",
        reflection: "Handling emergencies without preparation often leads to expensive borrowing and financial instability. It's risky for business sustainability.",
        isCorrect: false,
      },
      {
        id: "everything",
        label: "Save everything, stop all other investments",
        reflection: "Saving everything can paralyze business growth. It's better to find a balance between emergency preparedness and continued investment in your business.",
        isCorrect: false,
      },
      {
        id: "small",
        label: "Just enough for small repairs",
        reflection: "Small emergency funds may not cover major breakdowns or extended periods. It's better to plan for significant emergencies that could seriously impact operations.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a red flag in emergency expense management?",
    options: [
      
      {
        id: "planning",
        label: "Having a well-planned emergency response",
        reflection: "Having a well-planned emergency response is actually a positive sign of good financial management, not a red flag.",
        isCorrect: false,
      },
      {
        id: "fund",
        label: "Maintaining an adequate emergency fund",
        reflection: "Maintaining an adequate emergency fund is excellent financial practice and indicates responsible business management.",
        isCorrect: false,
      },
      {
        id: "prevention",
        label: "Investing in regular equipment maintenance",
        reflection: "Regular equipment maintenance is proactive and cost-effective. It prevents many emergencies and is a sign of good business practices.",
        isCorrect: false,
      },
      {
        id: "borrowing",
        label: "Regularly needing high-interest loans for emergencies",
        reflection: "Exactly! Regularly relying on high-interest loans for emergencies indicates poor planning and creates a dangerous cycle of debt that threatens business stability.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term benefit of emergency preparedness?",
    options: [
      
      {
        id: "spending",
        label: "Ability to spend more freely on non-essentials",
        reflection: "Emergency preparedness is about financial security, not increased spending on non-essentials. It actually promotes disciplined financial management.",
        isCorrect: false,
      },
      {
        id: "risk",
        label: "Increased risk-taking in business decisions",
        reflection: "Emergency preparedness reduces risk rather than increasing it. It provides a safety net that allows for more confident business decision-making.",
        isCorrect: false,
      },
      {
        id: "stability",
        label: "Business stability and peace of mind",
        reflection: "Exactly! Emergency preparedness provides business stability and peace of mind, allowing you to focus on growth rather than worrying about unexpected costs.",
        isCorrect: true,
      },
      {
        id: "growth",
        label: "Guaranteed business growth and success",
        reflection: "While emergency preparedness helps business stability, it doesn't guarantee growth and success. Many other factors contribute to business outcomes.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = EMERGENCY_BUSINESS_EXPENSES_STAGES.length;
const successThreshold = totalStages;

const EmergencyBusinessExpenses = () => {
  const location = useLocation();
  const gameId = "finance-adults-79";
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
      "How can you build an effective emergency fund for your business?",
      "What preventive measures can reduce business emergency expenses?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = EMERGENCY_BUSINESS_EXPENSES_STAGES[currentStage];
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
  const stage = EMERGENCY_BUSINESS_EXPENSES_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Emergency Business Expenses"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={EMERGENCY_BUSINESS_EXPENSES_STAGES.length}
      currentLevel={Math.min(currentStage + 1, EMERGENCY_BUSINESS_EXPENSES_STAGES.length)}
      totalLevels={EMERGENCY_BUSINESS_EXPENSES_STAGES.length}
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
            <span>Business Emergency</span>
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
                        { stageId: EMERGENCY_BUSINESS_EXPENSES_STAGES[currentStage].id, isCorrect: EMERGENCY_BUSINESS_EXPENSES_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Business Emergency Preparedness</strong>
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
              Skill unlocked: <strong>Business Emergency Preparedness</strong>
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

export default EmergencyBusinessExpenses;