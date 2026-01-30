import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LEARNING_FROM_MISTAKES_STAGES = [
  {
    id: 1,
    prompt: "Scenario: You made a poor financial decision earlier. What helps now?",
    options: [
      {
        id: "ignore",
        label: "Ignoring it",
        reflection: "Ignoring past financial mistakes means you're likely to repeat them. Without acknowledging and learning from errors, you miss the opportunity to improve your financial decision-making skills.",
        isCorrect: false,
      },
      
      {
        id: "blame",
        label: "Blaming external factors",
        reflection: "While external factors may have contributed, focusing only on blame doesn't help you improve your financial decision-making. Learning requires examining your own choices and thought processes.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Avoiding all financial decisions",
        reflection: "Avoiding all financial decisions won't help you build financial capability. The goal is to learn from mistakes and make better decisions in the future, not to stop making decisions altogether.",
        isCorrect: false,
      },
      {
        id: "learn",
        label: "Learning and adjusting behaviour",
        reflection: "Exactly! Learning and adjusting behavior is the best response to past financial mistakes. This approach helps you avoid repeating errors and strengthens your financial decision-making skills for the future.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the first step in learning from a financial mistake?",
    options: [
      {
        id: "analyze",
        label: "Analyzing what went wrong and why",
        reflection: "Perfect! Analyzing what went wrong and why is the first step in learning from a financial mistake. Understanding the root cause helps prevent similar errors in the future.",
        isCorrect: true,
      },
      {
        id: "hide",
        label: "Hiding the mistake from others",
        reflection: "Hiding the mistake might feel safer, but it doesn't help you learn from it. Learning requires honest examination of your decisions and their consequences.",
        isCorrect: false,
      },
      {
        id: "rush",
        label: "Making another financial decision immediately",
        reflection: "Rushing to make another decision without reflecting on the previous mistake could compound your problems. Taking time to understand the error is more important.",
        isCorrect: false,
      },
      {
        id: "deny",
        label: "Denying that it was really a mistake",
        reflection: "Denying that it was a mistake prevents learning from occurring. Acknowledging the error is necessary before you can learn from it.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How can you use past financial mistakes to improve future decisions?",
    options: [
      {
        id: "checkpoints",
        label: "Creating checkpoints to evaluate decisions",
        reflection: "Excellent! Creating checkpoints to evaluate decisions helps you apply lessons from past mistakes. This systematic approach incorporates what you've learned into your decision-making process.",
        isCorrect: true,
      },
      {
        id: "avoidance",
        label: "Avoiding similar situations entirely",
        reflection: "While avoiding problematic situations might seem safe, it limits your financial growth. Learning involves developing skills to navigate similar situations better in the future.",
        isCorrect: false,
      },
      {
        id: "fear",
        label: "Developing fear of making any financial decisions",
        reflection: "Developing fear of financial decisions is counterproductive. Learning from mistakes should build confidence in making better decisions, not create paralysis.",
        isCorrect: false,
      },
      {
        id: "risk",
        label: "Taking higher risks to recover losses",
        reflection: "Taking higher risks to recover losses often leads to bigger problems. Learning from mistakes involves developing more thoughtful decision-making, not riskier behavior.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a sign that you're not learning from financial mistakes?",
    options: [
      
      {
        id: "reflect",
        label: "Taking time to reflect on decisions",
        reflection: "Taking time to reflect on decisions is actually a positive sign of learning from mistakes, not a sign of not learning. Reflection is an important part of the learning process.",
        isCorrect: false,
      },
      {
        id: "plan",
        label: "Creating financial plans before acting",
        reflection: "Creating financial plans before acting is a sign that you're applying lessons from past mistakes, not ignoring them. Planning is a positive behavior that indicates learning.",
        isCorrect: false,
      },
      {
        id: "repeat",
        label: "Repeatedly making similar mistakes",
        reflection: "Exactly! Repeatedly making similar mistakes is a clear sign that you're not learning from financial errors. True learning prevents the recurrence of the same types of mistakes.",
        isCorrect: true,
      },
      {
        id: "seek",
        label: "Seeking advice before making decisions",
        reflection: "Seeking advice before making decisions is a sign of learning from mistakes, not ignoring them. It shows humility and desire to make better choices.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term benefit of learning from financial mistakes?",
    options: [
      
      {
        id: "risk",
        label: "Increased willingness to take financial risks",
        reflection: "Learning from mistakes doesn't necessarily increase willingness to take risks. The benefit is making more informed and thoughtful decisions, not riskier ones.",
        isCorrect: false,
      },
      {
        id: "confidence",
        label: "Increased confidence in financial decision-making",
        reflection: "Exactly! Learning from financial mistakes leads to increased confidence in financial decision-making. As you successfully apply lessons learned, you become more capable and self-assured.",
        isCorrect: true,
      },
      {
        id: "complexity",
        label: "Ability to engage in more complex financial products",
        reflection: "While learning might eventually lead to understanding complex products, the primary benefit is better decision-making overall, not just complexity. Learning helps with all types of financial decisions.",
        isCorrect: false,
      },
      {
        id: "income",
        label: "Automatic increase in income level",
        reflection: "Learning from mistakes doesn't automatically increase income. The benefit is better financial management and decision-making, which may indirectly support better financial outcomes.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = LEARNING_FROM_MISTAKES_STAGES.length;
const successThreshold = totalStages;

const LearningFromPastMistakes = () => {
  const location = useLocation();
  const gameId = "finance-adults-98";
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
      "How can you create a personal system for learning from financial mistakes?",
      "What specific steps will you take to avoid repeating similar errors?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = LEARNING_FROM_MISTAKES_STAGES[currentStage];
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
  const stage = LEARNING_FROM_MISTAKES_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Learning from Past Mistakes"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={LEARNING_FROM_MISTAKES_STAGES.length}
      currentLevel={Math.min(currentStage + 1, LEARNING_FROM_MISTAKES_STAGES.length)}
      totalLevels={LEARNING_FROM_MISTAKES_STAGES.length}
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
            <span>Learning from Mistakes</span>
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
                        { stageId: LEARNING_FROM_MISTAKES_STAGES[currentStage].id, isCorrect: LEARNING_FROM_MISTAKES_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Reflective Financial Decision-Making</strong>
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
              Skill unlocked: <strong>Reflective Financial Decision-Making</strong>
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

export default LearningFromPastMistakes;