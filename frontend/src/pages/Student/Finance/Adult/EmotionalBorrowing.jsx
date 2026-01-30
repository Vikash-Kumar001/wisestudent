import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMOTIONAL_BORROWING_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Borrowing during emotional stress often leads to: ",
    options: [
      {
        id: "a",
        label: "Good decisions",
        reflection: "Actually, emotional stress often clouds judgment and leads to poor financial decisions.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "No impact on decision quality",
        reflection: "Emotional stress significantly impacts decision-making quality, often leading to poor choices.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Always beneficial outcomes",
        reflection: "Borrowing during emotional stress rarely leads to beneficial outcomes due to impaired judgment.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Regret later",
        reflection: "Correct! Borrowing during emotional stress often leads to decisions that are regretted later.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "What is the best approach to making borrowing decisions during emotional stress?",
    options: [
     
      {
        id: "a",
        label: "Make the decision immediately while feeling motivated",
        reflection: "Making financial decisions during emotional stress often leads to regrettable choices.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Ask someone else to make the decision for you",
        reflection: "While getting advice is helpful, the decision should still be made thoughtfully when calm.",
        isCorrect: false,
      },
       {
        id: "c",
        label: "Postpone the decision until emotions settle",
        reflection: "Perfect! Waiting until you're calm helps ensure better financial decisions.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Go with your gut feeling during stress",
        reflection: "Gut feelings during stress are often influenced by emotions rather than rational thinking.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "How does emotional stress affect financial decision-making?",
    options: [
      
      {
        id: "a",
        label: "It improves decision-making by adding urgency",
        reflection: "While urgency might seem helpful, stress typically impairs judgment rather than improving it.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "It impairs judgment and leads to impulsive choices",
        reflection: "Yes! Emotional stress often causes people to make impulsive financial decisions without proper consideration.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "It has no effect on financial decisions",
        reflection: "Emotional stress significantly affects decision-making processes and financial judgment.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "It always leads to better financial choices",
        reflection: "Stress typically leads to poorer decision-making, not better financial choices.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "What is the relationship between emotional state and borrowing decisions?",
    options: [
      {
        id: "a",
        label: "Calm decision-making leads to better outcomes",
        reflection: "Exactly! Making borrowing decisions when calm helps ensure they align with your financial goals.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Emotional state doesn't matter for financial decisions",
        reflection: "Emotional state significantly influences financial decision-making and outcomes.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Stressed decision-making is more honest",
        reflection: "While honesty is important, stress impairs the ability to make well-considered financial choices.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Emotions always improve financial judgment",
        reflection: "Emotions often cloud financial judgment rather than improving it.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "What should you do if you feel emotional pressure to borrow money?",
    options: [
     
      {
        id: "a",
        label: "Borrow immediately to satisfy the emotional need",
        reflection: "Borrowing to satisfy emotional needs often leads to financial regret and stress.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Ignore the emotional aspect and just calculate numbers",
        reflection: "While calculations are important, acknowledging emotions and making decisions when calm is better.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Borrow more than needed to feel secure",
        reflection: "Borrowing more than needed during emotional stress is likely to create more financial insecurity.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Take time to cool down before deciding",
        reflection: "Excellent! Taking time to cool down helps ensure the decision is based on financial reality rather than emotion.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
];

const totalStages = EMOTIONAL_BORROWING_STAGES.length;
const successThreshold = totalStages;

const EmotionalBorrowing = () => {
  const location = useLocation();
  const gameId = "finance-adults-56";
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
      "How can you recognize when emotions are influencing your financial decisions?",
      "What strategies can help you make borrowing decisions when feeling stressed?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = EMOTIONAL_BORROWING_STAGES[currentStage];
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
  const stage = EMOTIONAL_BORROWING_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Emotional Borrowing"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={EMOTIONAL_BORROWING_STAGES.length}
      currentLevel={Math.min(currentStage + 1, EMOTIONAL_BORROWING_STAGES.length)}
      totalLevels={EMOTIONAL_BORROWING_STAGES.length}
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
            <span>Emotional Decisions</span>
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
                        { stageId: EMOTIONAL_BORROWING_STAGES[currentStage].id, isCorrect: EMOTIONAL_BORROWING_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Emotional Borrowing Awareness</strong>
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
              Skill unlocked: <strong>Emotional Borrowing Awareness</strong>
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

export default EmotionalBorrowing;