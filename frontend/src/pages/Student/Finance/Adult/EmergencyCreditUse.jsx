import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMERGENCY_CREDIT_STAGES = [
  {
    id: 1,
    prompt: "Scenario: When is using credit acceptable?",
    options: [
     
      {
        id: "first",
        label: "As first response",
        reflection: "Using credit as a first response creates unnecessary debt and can lead to financial problems. It's better to exhaust other options like savings, budget adjustments, or alternative solutions before considering credit.",
        isCorrect: false,
      },
       {
        id: "planned",
        label: "When no other option exists and repayment is planned",
        reflection: "Exactly! Using credit is acceptable when it's truly a last resort and you have a clear, realistic plan for repayment. This approach minimizes risk and ensures you don't create more financial problems.",
        isCorrect: true,
      },
      {
        id: "anytime",
        label: "Anytime you want something immediately",
        reflection: "Using credit anytime you want something immediately leads to accumulating debt and financial stress. Credit should be reserved for genuine emergencies, not for immediate gratification.",
        isCorrect: false,
      },
      {
        id: "never",
        label: "Never under any circumstances",
        reflection: "While credit should be used carefully, there are legitimate emergency situations where responsible credit use is appropriate. The key is knowing when it's truly necessary and having a repayment plan.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the key difference between planned and panic credit use?",
    options: [
      {
        id: "preparation",
        label: "Preparation and clear repayment strategy",
        reflection: "Perfect! The key difference is preparation and a clear repayment strategy. Planned credit use involves careful consideration, while panic credit use is impulsive and lacks proper planning.",
        isCorrect: true,
      },
      {
        id: "amount",
        label: "The amount of credit used",
        reflection: "While the amount matters, the key difference is the approach and planning. Even small amounts of panic credit can create problems if used without proper consideration and repayment planning.",
        isCorrect: false,
      },
      {
        id: "type",
        label: "The type of credit product chosen",
        reflection: "The type of credit product is important, but it's not the key difference between planned and panic use. The main distinction is the decision-making process and repayment planning, regardless of the credit type.",
        isCorrect: false,
      },
      {
        id: "timing",
        label: "The timing of when credit is used",
        reflection: "Timing is a factor, but the key difference is the decision-making process. Planned credit can be used at various times as long as it's well-considered, while panic credit is impulsive regardless of timing.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "What should you evaluate before using emergency credit?",
    options: [
      
      {
        id: "desire",
        label: "How much you want or need the item immediately",
        reflection: "Your desire or immediate need isn't the primary factor to evaluate. Even strong desires or urgent wants should be weighed against your financial capacity and available alternatives.",
        isCorrect: false,
      },
      {
        id: "interest",
        label: "The interest rate of the credit option",
        reflection: "While interest rate is important, it's not the first thing to evaluate. Your ability to repay is more fundamental - if you can't repay regardless of the rate, you shouldn't borrow.",
        isCorrect: false,
      },
      {
        id: "friends",
        label: "What your friends think about the purchase",
        reflection: "Your friends' opinions shouldn't be the primary factor in emergency credit decisions. The decision should be based on your financial situation and ability to manage the debt responsibly.",
        isCorrect: false,
      },
      {
        id: "repayment",
        label: "Your ability to repay the amount borrowed",
        reflection: "Excellent! Your ability to repay is the most critical factor to evaluate before using emergency credit. This includes considering your income, existing obligations, and timeline for repayment.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of problematic emergency credit use?",
    options: [
      
      {
        id: "plan",
        label: "Having a written repayment plan",
        reflection: "Having a written repayment plan is actually a sign of responsible credit use, not a warning sign. It shows you're taking the obligation seriously and planning for repayment.",
        isCorrect: false,
      },
      {
        id: "small",
        label: "Using small amounts of credit",
        reflection: "Using small amounts of credit isn't necessarily problematic if it's for genuine emergencies and you have a repayment plan. The amount is less important than the circumstances and planning involved.",
        isCorrect: false,
      },
      {
        id: "frequent",
        label: "Frequent use of credit for similar emergencies",
        reflection: "Exactly! Frequent use of credit for similar emergencies indicates a pattern of poor financial planning or inadequate emergency preparation, rather than true emergencies requiring credit.",
        isCorrect: true,
      },
      {
        id: "research",
        label: "Researching different credit options before choosing",
        reflection: "Researching different credit options before choosing is a sign of responsible decision-making, not a warning sign. It shows you're being careful and informed about your choices.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the benefit of planned emergency credit use?",
    options: [
      
      {
        id: "spending",
        label: "Enables more spending on non-essential items",
        reflection: "Planned emergency credit use is about addressing genuine emergencies, not enabling more spending on non-essentials. Its purpose is protection and stability, not increased consumption.",
        isCorrect: false,
      },
      {
        id: "safety",
        label: "Provides financial safety without creating additional problems",
        reflection: "Exactly! Planned emergency credit use provides financial safety by addressing genuine emergencies while minimizing the risk of creating additional financial problems through careful planning and responsible repayment.",
        isCorrect: true,
      },
      {
        id: "debt",
        label: "Creates opportunities to build debt experience",
        reflection: "Planned emergency credit use isn't about building debt experience. It's about addressing urgent needs responsibly while minimizing the negative impact of debt on your financial situation.",
        isCorrect: false,
      },
      {
        id: "avoidance",
        label: "Helps you avoid all financial responsibilities",
        reflection: "Planned emergency credit use doesn't help you avoid responsibilities - it helps you manage them better. It's about taking on necessary obligations in a controlled, planned way.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = EMERGENCY_CREDIT_STAGES.length;
const successThreshold = totalStages;

const EmergencyCreditUse = () => {
  const location = useLocation();
  const gameId = "finance-adults-91";
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
      "How can you distinguish between true emergencies and wants when considering credit?",
      "What criteria will you use to evaluate emergency credit options?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = EMERGENCY_CREDIT_STAGES[currentStage];
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
  const stage = EMERGENCY_CREDIT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Emergency Credit Use"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={EMERGENCY_CREDIT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, EMERGENCY_CREDIT_STAGES.length)}
      totalLevels={EMERGENCY_CREDIT_STAGES.length}
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
            <span>Emergency Credit</span>
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
                        { stageId: EMERGENCY_CREDIT_STAGES[currentStage].id, isCorrect: EMERGENCY_CREDIT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Emergency Credit Evaluation</strong>
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
              Skill unlocked: <strong>Emergency Credit Evaluation</strong>
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

export default EmergencyCreditUse;