import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMERGENCY_VS_LIFESTYLE_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Which borrowing is more justified?",
    options: [
     
      {
        id: "a",
        label: "Lifestyle upgrade",
        reflection: "Lifestyle upgrades are wants, not needs. Credit should be reserved for genuine emergencies.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Both are equally justified",
        reflection: "Emergency needs take priority over lifestyle wants when considering credit use.",
        isCorrect: false,
      },
       {
        id: "c",
        label: "Emergency medical need",
        reflection: "Correct! Emergency needs like medical care justify credit more than comfort purchases.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Neither should use credit",
        reflection: "While ideal, sometimes credit is necessary for genuine emergencies like medical needs.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "When facing a financial crisis, which approach is more responsible?",
    options: [
      
      {
        id: "a",
        label: "Use credit for upgrading my home entertainment system",
        reflection: "Home entertainment upgrades are lifestyle choices, not emergencies requiring credit.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Use credit for essential medical expenses",
        reflection: "Absolutely! Medical emergencies justify credit use when necessary.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Avoid all credit regardless of the situation",
        reflection: "While avoiding credit is generally wise, genuine emergencies may require it.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Use credit for dining out with friends",
        reflection: "Social dining is a lifestyle choice, not an emergency requiring credit.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "What's the primary difference between emergency and lifestyle borrowing?",
    options: [
      {
        id: "a",
        label: "Emergency borrowing is for survival needs, lifestyle is for comfort",
        reflection: "Exactly! Emergency borrowing addresses genuine needs while lifestyle is about wants.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Lifestyle borrowing is cheaper than emergency borrowing",
        reflection: "Cost isn't the primary difference - the justification for borrowing is what matters.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Emergency borrowing is always justified regardless of amount",
        reflection: "Even emergencies should be approached with caution and consideration of alternatives.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "There is no difference between them",
        reflection: "There's a significant difference in justification between emergency and lifestyle borrowing.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "Which scenario best represents justified credit use?",
    options: [
      
      {
        id: "a",
        label: "Financing a vacation to relax",
        reflection: "Vacations are lifestyle choices, not emergencies requiring credit.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Buying designer clothes to feel confident",
        reflection: "Designer clothes are lifestyle wants, not emergencies requiring credit.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Getting a new car for convenience",
        reflection: "New cars for convenience are lifestyle choices, not emergencies requiring credit.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Paying for urgent dental surgery",
        reflection: "Yes! Urgent medical procedures are genuine emergencies that may require credit.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "What should be your approach to credit when both emergencies and lifestyle desires exist?",
    options: [
      
      {
        id: "a",
        label: "Focus equally on both emergency and lifestyle needs",
        reflection: "Emergency needs should take priority over lifestyle wants when using credit.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Address lifestyle wants first since they're more important",
        reflection: "This is backwards - emergencies should take priority over lifestyle wants.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Prioritize emergency needs over lifestyle wants",
        reflection: "Perfect! Emergency needs should always take precedence over lifestyle wants when using credit.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Avoid credit entirely regardless of the situation",
        reflection: "While avoiding credit is ideal, emergencies sometimes require it with careful consideration.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
];

const totalStages = EMERGENCY_VS_LIFESTYLE_STAGES.length;
const successThreshold = totalStages;

const EmergencyVsLifestyleLoans = () => {
  const location = useLocation();
  const gameId = "finance-adults-51";
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
      "How can you distinguish between genuine emergencies and lifestyle wants?",
      "What criteria should guide your borrowing decisions in difficult times?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = EMERGENCY_VS_LIFESTYLE_STAGES[currentStage];
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
  const stage = EMERGENCY_VS_LIFESTYLE_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Emergency vs Lifestyle Loans"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={EMERGENCY_VS_LIFESTYLE_STAGES.length}
      currentLevel={Math.min(currentStage + 1, EMERGENCY_VS_LIFESTYLE_STAGES.length)}
      totalLevels={EMERGENCY_VS_LIFESTYLE_STAGES.length}
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
            <span>Credit Justification</span>
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
                        { stageId: EMERGENCY_VS_LIFESTYLE_STAGES[currentStage].id, isCorrect: EMERGENCY_VS_LIFESTYLE_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Emergency vs Lifestyle Credit Judgment</strong>
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
              Skill unlocked: <strong>Emergency vs Lifestyle Credit Judgment</strong>
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

export default EmergencyVsLifestyleLoans;