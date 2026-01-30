import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMERGENCY_FUND_PURPOSE_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Emergency funds are meant for:",
    options: [
      {
        id: "unexpected",
        label: "Unexpected critical needs",
        reflection: "Exactly! Emergency funds are specifically meant for unexpected critical needs like medical emergencies, job loss, or major repairs. They protect your financial stability.",
        isCorrect: true,
      },
      {
        id: "daily",
        label: "Daily spending",
        reflection: "Emergency funds are not meant for daily spending. Using them for regular expenses defeats their purpose and leaves you vulnerable when real emergencies occur.",
        isCorrect: false,
      },
      
      {
        id: "luxury",
        label: "Luxury purchases and vacations",
        reflection: "Using emergency funds for luxury purchases defeats their purpose. These funds should be reserved for genuine emergencies that threaten your financial stability.",
        isCorrect: false,
      },
      {
        id: "investments",
        label: "Investment opportunities",
        reflection: "Emergency funds should not be used for investments. They're meant to provide financial security, not to generate returns. Investments belong in separate accounts.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the primary goal of an emergency fund?",
    options: [
      
      {
        id: "growth",
        label: "Generate investment returns",
        reflection: "Emergency funds are not meant for investment returns. Their purpose is security and liquidity, not growth. Investment returns come with risk that emergency funds should avoid.",
        isCorrect: false,
      },
      {
        id: "spending",
        label: "Enable extra spending on wants",
        reflection: "Emergency funds are not for enabling extra spending on wants. They're specifically for protecting against financial emergencies that could disrupt your life.",
        isCorrect: false,
      },
      {
        id: "status",
        label: "Show financial status to others",
        reflection: "Emergency funds are for personal financial security, not for showing status to others. Their value is in providing peace of mind and protection, not in display.",
        isCorrect: false,
      },
      {
        id: "security",
        label: "Provide financial security during unexpected events",
        reflection: "Perfect! The primary goal is to provide financial security during unexpected events, ensuring you can handle emergencies without going into debt or financial distress.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should you determine the size of your emergency fund?",
    options: [
     
      {
        id: "income",
        label: "A fixed percentage of your income",
        reflection: "While a percentage of income might be a starting point, it's better to base your emergency fund on actual expenses and circumstances rather than just income.",
        isCorrect: false,
      },
      {
        id: "friends",
        label: "What your friends think is appropriate",
        reflection: "Your emergency fund should be based on your personal financial situation and needs, not on what others think. Everyone's circumstances are different.",
        isCorrect: false,
      },
       {
        id: "expenses",
        label: "Based on your monthly expenses and job security",
        reflection: "Excellent! Your emergency fund should be based on your monthly expenses and job security. Typically, 3-6 months of expenses is recommended, adjusted for your specific situation.",
        isCorrect: true,
      },
      {
        id: "minimum",
        label: "The absolute minimum possible",
        reflection: "Setting the minimum possible emergency fund leaves you vulnerable. It's better to build a fund that can actually cover real emergencies you might face.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of improper emergency fund use?",
    options: [
      
      {
        id: "growth",
        label: "Regular growth in fund balance",
        reflection: "Regular growth in fund balance is actually a positive sign of good financial management, not improper use. It shows you're consistently saving for emergencies.",
        isCorrect: false,
      },
      {
        id: "frequent",
        label: "Frequent withdrawals for non-emergencies",
        reflection: "Exactly! Frequent withdrawals for non-emergencies indicate improper use. Emergency funds should be touched only for genuine emergencies, not for regular expenses.",
        isCorrect: true,
      },
      {
        id: "separate",
        label: "Keeping it in a separate account",
        reflection: "Keeping emergency funds in a separate account is good practice, not a warning sign. It helps prevent accidental spending and ensures the money is available when needed.",
        isCorrect: false,
      },
      {
        id: "planning",
        label: "Having a clear plan for when to use it",
        reflection: "Having a clear plan for emergency fund use shows good financial discipline, not improper use. It helps you make appropriate decisions during real emergencies.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the benefit of using emergency funds properly?",
    options: [
      {
        id: "stability",
        label: "Maintains financial stability during crises",
        reflection: "Exactly! Proper use of emergency funds maintains financial stability during crises by providing the resources needed to handle emergencies without creating additional financial problems.",
        isCorrect: true,
      },
      {
        id: "spending",
        label: "Enables more regular spending",
        reflection: "Emergency funds are not meant to enable more regular spending. Their purpose is protection during emergencies, not increasing everyday consumption.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "Increases reliance on credit and loans",
        reflection: "Proper emergency fund use actually reduces reliance on credit and loans during emergencies. It's the improper use that leads to increased debt dependency.",
        isCorrect: false,
      },
      {
        id: "stress",
        label: "Creates more financial stress and uncertainty",
        reflection: "Proper emergency fund use reduces financial stress and uncertainty by providing a safety net. It's the lack of emergency funds or improper use that creates stress.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = EMERGENCY_FUND_PURPOSE_STAGES.length;
const successThreshold = totalStages;

const EmergencyFundPurpose = () => {
  const location = useLocation();
  const gameId = "finance-adults-85";
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
      "How can you build and maintain an appropriate emergency fund?",
      "What criteria will you use to determine when to use your emergency fund?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = EMERGENCY_FUND_PURPOSE_STAGES[currentStage];
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
  const stage = EMERGENCY_FUND_PURPOSE_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Emergency Fund Purpose"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={EMERGENCY_FUND_PURPOSE_STAGES.length}
      currentLevel={Math.min(currentStage + 1, EMERGENCY_FUND_PURPOSE_STAGES.length)}
      totalLevels={EMERGENCY_FUND_PURPOSE_STAGES.length}
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
            <span>Emergency Fund</span>
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
                        { stageId: EMERGENCY_FUND_PURPOSE_STAGES[currentStage].id, isCorrect: EMERGENCY_FUND_PURPOSE_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Emergency Fund Management</strong>
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
              Skill unlocked: <strong>Emergency Fund Management</strong>
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

export default EmergencyFundPurpose;