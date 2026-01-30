import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CAREER_GROWTH_STAGES = [
  {
    id: 1,
    prompt: "Which choice is wiser early on?",
    options: [
      {
        id: "a",
        label: "Learning with gradual income growth",
        reflection: "Exactly! Investing in learning and skill development early on creates a strong foundation for sustained career growth and higher future earnings.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Quick pay with no learning",
        reflection: "While quick pay might seem attractive, it often leads to stagnation and missed opportunities for skill development and long-term growth.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Avoid all work to prevent stress",
        reflection: "Avoiding work entirely prevents you from gaining experience and building your career. Some stress is normal and can even be productive for growth.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Focus only on immediate comfort",
        reflection: "While comfort is important, focusing solely on immediate comfort can prevent you from taking on challenges that lead to career advancement.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "How does early learning investment pay off?",
    options: [
      {
        id: "a",
        label: "It never pays off",
        reflection: "Actually, early learning investments typically pay off significantly through increased earning potential and career opportunities over time.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Only helps in the first job",
        reflection: "Early learning has long-lasting benefits that extend far beyond your first job, influencing your entire career trajectory and adaptability to market changes.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Makes you overqualified",
        reflection: "Being overqualified is rarely a problem. The skills and knowledge you gain make you more valuable and adaptable in the job market.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Multiplies future earning potential",
        reflection: "Perfect! The skills and knowledge gained early in your career compound over time, leading to exponential growth in opportunities and income.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "What's the risk of choosing only quick pay?",
    options: [
      {
        id: "a",
        label: "No risk, it's always better",
        reflection: "Choosing only quick pay without investing in learning carries significant long-term risks to your career growth and financial security.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Too much free time",
        reflection: "While some free time is valuable, too much without purposeful learning can lead to skill atrophy and reduced marketability.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Missed skill development and growth",
        reflection: "Exactly! Focusing only on immediate pay without learning can leave you behind as industries evolve and new skills become essential.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Higher job satisfaction",
        reflection: "Job satisfaction often comes from growth, challenge, and skill development rather than just higher immediate pay without learning opportunities.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "How should you balance learning and pay?",
    options: [
      {
        id: "a",
        label: "Always choose the highest pay",
        reflection: "While pay is important, always choosing the highest pay without considering learning opportunities can limit your long-term career potential.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Prioritize learning, pay will follow",
        reflection: "Excellent! Prioritizing learning and skill development often leads to higher pay and better opportunities in the long run as your value increases.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Ignore pay completely",
        reflection: "While learning is important, completely ignoring pay can lead to financial stress and may not be sustainable for your career development.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Choose randomly",
        reflection: "Career decisions should be strategic rather than random. Consider both learning opportunities and compensation to make informed choices.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's the long-term benefit of learning-focused choices?",
    options: [
      {
        id: "a",
        label: "Career resilience and adaptability",
        reflection: "Perfect! Continuous learning builds career resilience, making you adaptable to industry changes and better positioned for future opportunities.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Staying in the same position",
        reflection: "Learning-focused choices typically lead to advancement and new opportunities rather than stagnation in the same position.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Reduced work hours",
        reflection: "While learning can improve efficiency, the primary benefit is increased capability and value, not necessarily reduced work hours.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Less job security",
        reflection: "Actually, learning-focused choices typically increase job security by making you more valuable and adaptable to changing market conditions.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const totalStages = CAREER_GROWTH_STAGES.length;
const successThreshold = totalStages;

const CareerGrowthVsQuickPay = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-77";
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
      "How can you identify learning opportunities in your current or potential roles?",
      "What balance between immediate compensation and long-term growth works for your situation?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = CAREER_GROWTH_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);
    
    // Update coins if the answer is correct
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    // Wait for the reflection period before allowing to proceed
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
    // Handle the final stage separately
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
      showCorrectAnswerFeedback(currentStageData.reward, true);
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
  const stage = CAREER_GROWTH_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Career Growth vs Quick Pay"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={CAREER_GROWTH_STAGES.length}
      currentLevel={Math.min(currentStage + 1, CAREER_GROWTH_STAGES.length)}
      totalLevels={CAREER_GROWTH_STAGES.length}
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
            <span>Career Growth</span>
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
                        { stageId: CAREER_GROWTH_STAGES[currentStage].id, isCorrect: CAREER_GROWTH_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Career growth strategy</strong>
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
              Skill unlocked: <strong>Career growth strategy</strong>
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

export default CareerGrowthVsQuickPay;