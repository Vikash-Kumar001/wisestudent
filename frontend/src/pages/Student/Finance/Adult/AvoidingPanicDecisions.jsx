import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PANIC_DECISIONS_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Panic borrowing often leads to:",
    options: [
      {
        id: "relief",
        label: "Quick relief",
        reflection: "Panic borrowing might seem to provide quick relief, but it's temporary and creates long-term problems. The initial relief is usually followed by mounting debt stress and financial pressure.",
        isCorrect: false,
      },
      
      {
        id: "solution",
        label: "A permanent solution to financial problems",
        reflection: "Panic borrowing rarely provides a permanent solution to financial problems. It often creates new problems and can make the original situation worse due to accumulated debt and interest.",
        isCorrect: false,
      },
      {
        id: "opportunity",
        label: "New financial opportunities",
        reflection: "Panic borrowing doesn't create new financial opportunities. Instead, it typically reduces your financial flexibility and can limit future opportunities due to debt obligations.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "Long-term debt stress",
        reflection: "Exactly! Panic borrowing often leads to long-term debt stress because it creates obligations that compound financial problems rather than solving them sustainably.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the main danger of panic financial decisions?",
    options: [
      {
        id: "impulse",
        label: "Impulse decisions without proper consideration",
        reflection: "Perfect! The main danger of panic financial decisions is making impulse decisions without proper consideration. Panic clouds judgment and leads to choices that seem urgent but aren't well thought out.",
        isCorrect: true,
      },
      {
        id: "speed",
        label: "Making decisions too quickly",
        reflection: "While making decisions quickly can be problematic, the core issue is the lack of proper consideration, not just the speed. Good decisions can be made quickly when they're well-considered.",
        isCorrect: false,
      },
      {
        id: "confidence",
        label: "Having too much confidence in financial choices",
        reflection: "Panic decisions typically involve low confidence, not too much confidence. The problem is acting without sufficient knowledge or consideration, not overconfidence.",
        isCorrect: false,
      },
      {
        id: "risk",
        label: "Taking calculated financial risks",
        reflection: "Calculated financial risks are different from panic decisions. Calculated risks involve analysis and planning, while panic decisions are made without proper risk assessment.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How can you maintain calm during financial emergencies?",
    options: [
      
      {
        id: "ignore",
        label: "Ignore the problem until it goes away",
        reflection: "Ignoring the problem until it goes away is dangerous and can make financial emergencies worse. Problems rarely resolve themselves and usually require active, thoughtful management.",
        isCorrect: false,
      },
      {
        id: "panic",
        label: "React immediately with whatever solution comes to mind",
        reflection: "Reacting immediately with whatever solution comes to mind is exactly what leads to panic decisions. This approach bypasses careful consideration and often leads to poor financial choices.",
        isCorrect: false,
      },
      {
        id: "spend",
        label: "Spend money to feel better about the situation",
        reflection: "Spending money to feel better about a financial situation is counterproductive and can make the emergency worse. It's important to address the root cause rather than seek temporary emotional relief.",
        isCorrect: false,
      },
      {
        id: "breathe",
        label: "Take time to breathe and assess the situation",
        reflection: "Excellent! Taking time to breathe and assess the situation helps maintain calm during financial emergencies. This pause allows for better decision-making and prevents panic-driven choices.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of poor panic management?",
    options: [
      
      {
        id: "plan",
        label: "Having a clear emergency financial plan",
        reflection: "Having a clear emergency financial plan is actually a sign of good preparation, not poor panic management. It shows you're ready to handle emergencies calmly and systematically.",
        isCorrect: false,
      },
      {
        id: "resources",
        label: "Knowing your available financial resources",
        reflection: "Knowing your available financial resources is a positive indicator of good financial management, not a warning sign. It demonstrates preparedness and the ability to make informed decisions.",
        isCorrect: false,
      },
      {
        id: "anxiety",
        label: "Feeling anxious about making financial decisions",
        reflection: "Exactly! Feeling anxious about making financial decisions during emergencies is a warning sign of poor panic management. Good preparation and calm decision-making should provide confidence, not anxiety.",
        isCorrect: true,
      },
      {
        id: "pause",
        label: "Taking time to consider options before acting",
        reflection: "Taking time to consider options before acting is a sign of good decision-making, not poor panic management. It shows you're avoiding impulsive choices and thinking through your options carefully.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the benefit of calm financial decision-making?",
    options: [
      
      {
        id: "spending",
        label: "Allows more spending on immediate wants",
        reflection: "Calm financial decision-making is about protection and sustainability, not enabling more immediate spending. Its value is in making choices that preserve long-term financial security.",
        isCorrect: false,
      },
      {
        id: "stability",
        label: "Protects long-term financial stability",
        reflection: "Exactly! Calm financial decision-making protects long-term financial stability by ensuring that emergency responses are thoughtful and sustainable, preventing decisions that could harm your future financial health.",
        isCorrect: true,
      },
      {
        id: "risk",
        label: "Enables taking bigger financial risks",
        reflection: "Calm financial decision-making actually reduces the need to take big risks by providing a structured approach to handling emergencies. It's about minimizing risk, not increasing it.",
        isCorrect: false,
      },
      
      {
        id: "avoidance",
        label: "Helps avoid all financial responsibilities",
        reflection: "Calm financial decision-making doesn't help you avoid responsibilities - it helps you handle them better. It's about managing obligations effectively, not avoiding them.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = PANIC_DECISIONS_STAGES.length;
const successThreshold = totalStages;

const AvoidingPanicDecisions = () => {
  const location = useLocation();
  const gameId = "finance-adults-90";
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
      "How can you create a personal emergency decision-making framework?",
      "What specific steps will you take to stay calm during financial stress?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = PANIC_DECISIONS_STAGES[currentStage];
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
  const stage = PANIC_DECISIONS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Avoiding Panic Decisions"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={PANIC_DECISIONS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, PANIC_DECISIONS_STAGES.length)}
      totalLevels={PANIC_DECISIONS_STAGES.length}
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
            <span>Panic Decisions</span>
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
                        { stageId: PANIC_DECISIONS_STAGES[currentStage].id, isCorrect: PANIC_DECISIONS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Emergency Decision Management</strong>
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
              Skill unlocked: <strong>Emergency Decision Management</strong>
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

export default AvoidingPanicDecisions;