import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMERGENCY_FUND_AMOUNT_STAGES = [
  {
    id: 1,
    prompt: "Scenario: A safe emergency fund usually covers:",
    options: [
      {
        id: "days",
        label: "1–2 days of expenses",
        reflection: "1-2 days of expenses is insufficient for a true emergency fund. Real emergencies like job loss or major medical expenses last much longer than a couple of days.",
        isCorrect: false,
      },
      
      {
        id: "week",
        label: "1 week of luxury spending",
        reflection: "Emergency funds should cover basic necessities, not luxury spending. And one week is generally too short a period for most financial emergencies.",
        isCorrect: false,
      },
      {
        id: "year",
        label: "1 year of all expenses",
        reflection: "While having a year's worth of expenses saved is excellent, it's not necessary for an emergency fund. 3-6 months is the standard recommendation for most people.",
        isCorrect: false,
      },
      {
        id: "months",
        label: "3–6 months of basic expenses",
        reflection: "Exactly! Financial experts recommend 3-6 months of basic expenses for emergency funds. This provides adequate time to find new employment or resolve financial difficulties.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What factors should influence your emergency fund size?",
    options: [
      {
        id: "job",
        label: "Job security and income stability",
        reflection: "Perfect! Job security and income stability are key factors. If your job is less stable, you should aim for a larger emergency fund (closer to 6 months).",
        isCorrect: true,
      },
      {
        id: "spending",
        label: "Your desire to spend more freely",
        reflection: "Your desire to spend more freely shouldn't influence emergency fund size. The fund should be based on practical needs and risk factors, not spending preferences.",
        isCorrect: false,
      },
      {
        id: "friends",
        label: "What your friends think is appropriate",
        reflection: "Your emergency fund should be based on your personal financial situation, not on what others think. Everyone's circumstances and risk factors are different.",
        isCorrect: false,
      },
      {
        id: "minimum",
        label: "The absolute minimum required",
        reflection: "Aiming for the absolute minimum leaves you vulnerable. It's better to build a fund that can actually cover the emergencies you're likely to face.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should you calculate your basic expenses for emergency fund planning?",
    options: [
      
      {
        id: "everything",
        label: "Include all expenses including entertainment and dining out",
        reflection: "Including all expenses makes your emergency fund target unnecessarily high. During emergencies, you can typically reduce non-essential spending temporarily.",
        isCorrect: false,
      },
      {
        id: "income",
        label: "Base it on your total income",
        reflection: "Emergency funds should be based on expenses, not income. You need to know how much money you actually need to live, not how much you earn.",
        isCorrect: false,
      },
      {
        id: "essentials",
        label: "Include only essential expenses like housing, food, and healthcare",
        reflection: "Excellent! For emergency fund calculations, focus on essential expenses. This includes housing, utilities, food, healthcare, transportation, and minimum debt payments.",
        isCorrect: true,
      },
      {
        id: "savings",
        label: "Use your current savings as the baseline",
        reflection: "Your current savings level shouldn't determine your emergency fund target. The target should be based on your actual expenses and risk factors, regardless of current savings.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign that your emergency fund is inadequate?",
    options: [
      
      {
        id: "growth",
        label: "Regular growth in your emergency fund balance",
        reflection: "Regular growth in your emergency fund balance is actually a positive sign of good financial management, not a warning of inadequacy.",
        isCorrect: false,
      },
      {
        id: "panic",
        label: "Feeling panicked about small unexpected expenses",
        reflection: "Exactly! Feeling panicked about small unexpected expenses is a warning sign that your emergency fund is inadequate. A proper fund should provide peace of mind.",
        isCorrect: true,
      },
      {
        id: "separate",
        label: "Keeping it in a separate high-yield savings account",
        reflection: "Keeping your emergency fund in a separate high-yield savings account is good practice, not a warning sign. It shows you're managing it properly.",
        isCorrect: false,
      },
      {
        id: "automatic",
        label: "Having automatic transfers to build the fund",
        reflection: "Automatic transfers to build your emergency fund is excellent financial discipline, not a warning sign. It shows you're committed to proper emergency preparedness.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the benefit of having an adequate emergency fund?",
    options: [
      {
        id: "peace",
        label: "Peace of mind and reduced financial stress",
        reflection: "Exactly! An adequate emergency fund provides peace of mind and reduces financial stress by ensuring you can handle unexpected expenses without going into debt or financial distress.",
        isCorrect: true,
      },
      {
        id: "spending",
        label: "Ability to spend more on non-essentials",
        reflection: "An emergency fund is for security, not for enabling more spending on non-essentials. Its value is in protection, not in increased consumption.",
        isCorrect: false,
      },
      {
        id: "investments",
        label: "More money available for investments",
        reflection: "While having an emergency fund frees up money that might otherwise go to debt payments, it's not specifically for investments. The fund's purpose is financial security.",
        isCorrect: false,
      },
      {
        id: "lifestyle",
        label: "Ability to maintain lifestyle during any crisis",
        reflection: "An emergency fund helps maintain basic necessities during crises, but it's not meant to maintain your full lifestyle. Some lifestyle adjustments may be necessary during emergencies.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = EMERGENCY_FUND_AMOUNT_STAGES.length;
const successThreshold = totalStages;

const HowMuchEmergencyFund = () => {
  const location = useLocation();
  const gameId = "finance-adults-86";
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
      "How can you calculate your personal emergency fund target?",
      "What steps will you take to build your emergency fund?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = EMERGENCY_FUND_AMOUNT_STAGES[currentStage];
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
  const stage = EMERGENCY_FUND_AMOUNT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="How Much Emergency Fund?"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={EMERGENCY_FUND_AMOUNT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, EMERGENCY_FUND_AMOUNT_STAGES.length)}
      totalLevels={EMERGENCY_FUND_AMOUNT_STAGES.length}
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
            <span>Emergency Fund Size</span>
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
                        { stageId: EMERGENCY_FUND_AMOUNT_STAGES[currentStage].id, isCorrect: EMERGENCY_FUND_AMOUNT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Emergency Fund Sizing</strong>
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
              Skill unlocked: <strong>Emergency Fund Sizing</strong>
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

export default HowMuchEmergencyFund;