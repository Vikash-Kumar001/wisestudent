import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FINANCIAL_CONFIDENCE_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Financial confidence comes from:",
    options: [
      {
        id: "blind",
        label: "Taking risks blindly",
        reflection: "Taking risks blindly does not build financial confidence. Without understanding the implications, this approach often leads to financial stress and losses.",
        isCorrect: false,
      },
      
      {
        id: "copying",
        label: "Copying others' financial decisions",
        reflection: "While learning from others can be valuable, simply copying their decisions without understanding doesn't build your own financial confidence. Your situation may be different from theirs.",
        isCorrect: false,
      },
      {
        id: "knowledge",
        label: "Understanding choices and consequences",
        reflection: "Exactly! Financial confidence comes from understanding choices and consequences. Knowledge of how financial decisions impact your situation builds genuine confidence and reduces anxiety.",
        isCorrect: true,
      },
      {
        id: "avoiding",
        label: "Avoiding all financial decisions",
        reflection: "Avoiding financial decisions doesn't build confidence. In fact, it can increase anxiety and prevent you from developing the skills needed for financial success.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "How does understanding financial concepts build confidence?",
    options: [
     
      {
        id: "complexity",
        label: "By making financial matters more complex",
        reflection: "Understanding financial concepts should simplify decision-making, not make it more complex. Knowledge helps you navigate financial situations with greater ease and confidence.",
        isCorrect: false,
      },
       {
        id: "control",
        label: "By giving you control over your financial decisions",
        reflection: "Perfect! Understanding financial concepts builds confidence by giving you control over your financial decisions. Knowledge enables you to make informed choices rather than feeling overwhelmed by uncertainty.",
        isCorrect: true,
      },
      {
        id: "debt",
        label: "By encouraging more debt-taking",
        reflection: "Understanding financial concepts doesn't encourage more debt-taking. It helps you make informed decisions about when debt is appropriate and when it's not.",
        isCorrect: false,
      },
      {
        id: "speed",
        label: "By forcing you to make decisions faster",
        reflection: "Understanding financial concepts allows you to take time to make thoughtful decisions, not rush into them. Knowledge gives you the tools to evaluate properly.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "What's the difference between blind risk-taking and calculated risk?",
    options: [
      {
        id: "understanding",
        label: "Calculated risk involves understanding potential outcomes",
        reflection: "Excellent! The difference is that calculated risk involves understanding potential outcomes, whereas blind risk-taking doesn't consider consequences. This knowledge-based approach builds confidence.",
        isCorrect: true,
      },
      {
        id: "size",
        label: "Calculated risks are always smaller",
        reflection: "The size of the risk isn't what defines it as calculated. Calculated risks can sometimes be larger if you fully understand the implications and have planned accordingly.",
        isCorrect: false,
      },
      {
        id: "frequency",
        label: "Calculated risks are taken more frequently",
        reflection: "Frequency doesn't define calculated versus blind risk. The key difference is the understanding of potential outcomes, not how often you take risks.",
        isCorrect: false,
      },
      {
        id: "random",
        label: "Calculated risks are determined randomly",
        reflection: "Calculated risks are not random at all. They involve careful consideration of potential outcomes and planning, which is the opposite of randomness.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "Why might someone feel anxious about financial decisions?",
    options: [
      
      {
        id: "success",
        label: "Too much past financial success",
        reflection: "Past financial success wouldn't typically cause anxiety about future decisions. Anxiety usually stems from uncertainty or lack of understanding, not from previous success.",
        isCorrect: false,
      },
      {
        id: "confidence",
        label: "Too much financial confidence",
        reflection: "Too much financial confidence would more likely lead to overconfidence rather than anxiety. Anxiety typically comes from uncertainty, not from being overly confident.",
        isCorrect: false,
      },
      {
        id: "simple",
        label: "Financial decisions being too simple",
        reflection: "Simple decisions wouldn't cause anxiety. Financial anxiety usually stems from complexity and uncertainty, not from simplicity.",
        isCorrect: false,
      },
      {
        id: "knowledge",
        label: "Lack of knowledge about financial concepts",
        reflection: "Exactly! Lack of knowledge about financial concepts often causes anxiety about financial decisions. When you don't understand how things work, uncertainty can lead to stress and hesitation.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term benefit of building financial confidence through knowledge?",
    options: [
      
      {
        id: "complexity",
        label: "Increased complexity in financial matters",
        reflection: "Building financial confidence through knowledge should simplify your financial life, not make it more complex. Knowledge helps you make better decisions more easily.",
        isCorrect: false,
      },
      {
        id: "dependence",
        label: "Greater dependence on financial advisors",
        reflection: "Building financial confidence through knowledge should reduce dependence on others, not increase it. Knowledge empowers you to make your own informed decisions.",
        isCorrect: false,
      },
      {
        id: "independence",
        label: "Greater financial independence and peace of mind",
        reflection: "Exactly! Building financial confidence through knowledge leads to greater financial independence and peace of mind. Understanding enables you to make decisions confidently without relying on others.",
        isCorrect: true,
      },
      {
        id: "stress",
        label: "More financial stress and worry",
        reflection: "Building financial confidence through knowledge should reduce stress, not increase it. Understanding your finances creates predictability and control, which reduces anxiety.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = FINANCIAL_CONFIDENCE_STAGES.length;
const successThreshold = totalStages;

const FinancialConfidence = () => {
  const location = useLocation();
  const gameId = "finance-adults-99";
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
      "How can you build your financial knowledge systematically?",
      "What resources will you use to enhance your financial understanding?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FINANCIAL_CONFIDENCE_STAGES[currentStage];
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
  const stage = FINANCIAL_CONFIDENCE_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Financial Confidence"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FINANCIAL_CONFIDENCE_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FINANCIAL_CONFIDENCE_STAGES.length)}
      totalLevels={FINANCIAL_CONFIDENCE_STAGES.length}
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
            <span>Financial Confidence</span>
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
                        { stageId: FINANCIAL_CONFIDENCE_STAGES[currentStage].id, isCorrect: FINANCIAL_CONFIDENCE_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Knowledge-Based Financial Confidence</strong>
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
              Skill unlocked: <strong>Knowledge-Based Financial Confidence</strong>
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

export default FinancialConfidence;