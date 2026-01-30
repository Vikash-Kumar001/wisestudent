import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FIRST_RESPONSE_EMERGENCY_STAGES = [
  {
    id: 1,
    prompt: "Scenario: You face an unexpected expense. What should you check first?",
    options: [
      {
        id: "savings",
        label: "Savings or emergency fund",
        reflection: "Exactly! Checking your savings or emergency fund first is the right approach. It helps you avoid unnecessary debt and reduces financial stress.",
        isCorrect: true,
      },
      {
        id: "loan",
        label: "Loan apps",
        reflection: "Checking loan apps first creates a dependency on borrowing. It's better to check your own resources before considering debt options.",
        isCorrect: false,
      },
      
      {
        id: "ignore",
        label: "Ignore the expense and hope it goes away",
        reflection: "Ignoring unexpected expenses usually makes them worse. It's important to address them proactively using your available resources.",
        isCorrect: false,
      },
      {
        id: "credit",
        label: "Credit card limits",
        reflection: "Checking credit card limits first leads to debt accumulation. It's better to use your own money before considering borrowed funds.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the best immediate action during a financial emergency?",
    options: [
      
      {
        id: "panic",
        label: "Panic and make quick decisions",
        reflection: "Panicking leads to poor financial decisions. Taking time to assess your situation helps you respond more effectively to emergencies.",
        isCorrect: false,
      },
      {
        id: "borrow",
        label: "Immediately borrow money from anywhere",
        reflection: "Immediately borrowing without assessing your situation can lead to unnecessary debt and financial problems that make the emergency worse.",
        isCorrect: false,
      },
      {
        id: "delay",
        label: "Delay dealing with it as long as possible",
        reflection: "Delaying financial emergencies usually increases their cost and stress. It's better to address them promptly with a clear plan.",
        isCorrect: false,
      },
      {
        id: "assess",
        label: "Assess your available resources first",
        reflection: "Perfect! Assessing your available resources first gives you a clear picture of your options and helps you make informed decisions without panic.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should you prioritize using your resources in an emergency?",
    options: [
      
      {
        id: "everything",
        label: "Use everything you have immediately",
        reflection: "Using everything immediately leaves you vulnerable to future emergencies. It's better to be strategic about which resources to use first.",
        isCorrect: false,
      },
      {
        id: "nothing",
        label: "Use nothing and just wait it out",
        reflection: "Using nothing and waiting it out isn't practical for real emergencies. You need to address urgent financial needs with available resources.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "Use emergency savings first, then other options",
        reflection: "Excellent! Using emergency savings first preserves your financial stability and avoids the cost and stress of borrowing for immediate needs.",
        isCorrect: true,
      },
      {
        id: "random",
        label: "Use resources randomly without a plan",
        reflection: "Using resources randomly without a plan leads to inefficient use of your money and can make the emergency situation worse.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of poor emergency response?",
    options: [
      
      {
        id: "planning",
        label: "Having a clear emergency response plan",
        reflection: "Having a clear emergency response plan is actually a positive sign of good financial preparation, not a warning sign of poor response.",
        isCorrect: false,
      },
      {
        id: "borrowing",
        label: "Immediately reaching for loans without checking savings",
        reflection: "Exactly! Immediately reaching for loans without checking savings indicates poor emergency response planning and can lead to unnecessary debt.",
        isCorrect: true,
      },
      {
        id: "fund",
        label: "Maintaining an adequate emergency fund",
        reflection: "Maintaining an adequate emergency fund shows good financial planning and preparedness, which is the opposite of poor emergency response.",
        isCorrect: false,
      },
      {
        id: "assessment",
        label: "Taking time to assess the situation",
        reflection: "Taking time to assess the situation is a good practice that helps you respond effectively to emergencies, not a warning sign of poor response.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term benefit of proper emergency response?",
    options: [
      {
        id: "stability",
        label: "Financial stability and reduced stress",
        reflection: "Exactly! Proper emergency response leads to financial stability and reduced stress by helping you handle unexpected expenses without creating additional financial problems.",
        isCorrect: true,
      },
      {
        id: "debt",
        label: "Increased debt and financial complexity",
        reflection: "Increased debt and financial complexity are outcomes of poor emergency response, not benefits of proper emergency response.",
        isCorrect: false,
      },
      {
        id: "panic",
        label: "More panic and impulsive decisions",
        reflection: "More panic and impulsive decisions result from poor emergency response. Good preparation actually reduces panic and helps you make better decisions.",
        isCorrect: false,
      },
      {
        id: "problems",
        label: "Bigger financial problems over time",
        reflection: "Bigger financial problems over time are consequences of poor emergency response. Proper response prevents problems from escalating.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = FIRST_RESPONSE_EMERGENCY_STAGES.length;
const successThreshold = totalStages;

const FirstResponseToEmergency = () => {
  const location = useLocation();
  const gameId = "finance-adults-84";
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
      "How can you build an effective emergency response plan?",
      "What resources should you prioritize in different emergency scenarios?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FIRST_RESPONSE_EMERGENCY_STAGES[currentStage];
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
  const stage = FIRST_RESPONSE_EMERGENCY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="First Response to Emergency"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FIRST_RESPONSE_EMERGENCY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FIRST_RESPONSE_EMERGENCY_STAGES.length)}
      totalLevels={FIRST_RESPONSE_EMERGENCY_STAGES.length}
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
            <span>Emergency Response</span>
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
                        { stageId: FIRST_RESPONSE_EMERGENCY_STAGES[currentStage].id, isCorrect: FIRST_RESPONSE_EMERGENCY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Emergency Financial Response</strong>
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
              Skill unlocked: <strong>Emergency Financial Response</strong>
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

export default FirstResponseToEmergency;