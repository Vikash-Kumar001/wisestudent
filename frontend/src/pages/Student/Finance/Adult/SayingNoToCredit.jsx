import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SAYING_NO_TO_CREDIT_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Is it okay to reject a loan offer? ",
    options: [
      {
        id: "a",
        label: "No",
        reflection: "Actually, rejecting unnecessary or risky loans is a sign of financial wisdom.",
        isCorrect: false,
      },
     
      {
        id: "b",
        label: "Only if the interest rate is too high",
        reflection: "While interest rate matters, there are other factors like necessity and risk that also matter.",
        isCorrect: false,
      },
       {
        id: "c",
        label: "Yes, if it's unnecessary or risky",
        reflection: "Correct! Rejecting loans that are unnecessary or pose financial risk is a sign of financial strength.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Always accept if you qualify",
        reflection: "Qualifying for a loan doesn't necessarily mean you should accept it.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "What does rejecting an unnecessary loan application demonstrate?",
    options: [
      
      {
        id: "a",
        label: "Financial weakness",
        reflection: "Rejecting unnecessary loans is actually a sign of financial strength, not weakness.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Financial discipline and strength",
        reflection: "Exactly! Rejecting unnecessary loans shows financial discipline and strength.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Poor credit management",
        reflection: "Rejecting unnecessary loans is a sign of good credit management, not poor.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Lack of financial opportunities",
        reflection: "Rejecting unnecessary loans is about exercising discipline, not lack of opportunities.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "When might it be appropriate to say no to a loan offer?",
    options: [
      {
        id: "a",
        label: "When it's not aligned with your financial goals",
        reflection: "Yes! Saying no to loans that don't align with your goals is financially prudent.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Only if the lender has a bad reputation",
        reflection: "While lender reputation matters, the alignment with your goals and needs is more important.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "When the loan amount is too small",
        reflection: "The appropriateness of a loan isn't determined by the amount alone.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Never, always accept if offered",
        reflection: "Always accepting loans can lead to over-indebtedness and financial problems.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "What is the relationship between saying no to credit and financial health?",
    options: [
     
      {
        id: "a",
        label: "Saying no to credit harms financial health",
        reflection: "Saying no to unnecessary credit actually protects financial health, not harms it.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Saying no has no impact on financial health",
        reflection: "Being selective about credit has a significant positive impact on financial health.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Saying yes to credit always improves financial health",
        reflection: "Accepting credit without consideration can harm financial health.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Saying no to unnecessary credit protects financial health",
        reflection: "Perfect! Being selective about credit helps maintain financial stability and health.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "What should guide your decision when considering a loan offer?",
    options: [
      {
        id: "a",
        label: "Your actual need and repayment capacity",
        reflection: "Excellent! Deciding based on actual need and ability to repay is financially responsible.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "How easy it is to get the loan",
        reflection: "Ease of getting a loan shouldn't be the primary factor in deciding whether to accept it.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Peer pressure to take the loan",
        reflection: "Decisions about loans should be based on personal financial situation, not peer pressure.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Marketing tactics of the lender",
        reflection: "Marketing tactics shouldn't influence your loan decisions - focus on your actual needs.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
];

const totalStages = SAYING_NO_TO_CREDIT_STAGES.length;
const successThreshold = totalStages;

const SayingNoToCredit = () => {
  const location = useLocation();
  const gameId = "finance-adults-57";
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
      "How can you evaluate whether a loan offer aligns with your financial goals?",
      "What factors should you consider before accepting a loan offer?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = SAYING_NO_TO_CREDIT_STAGES[currentStage];
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
  const stage = SAYING_NO_TO_CREDIT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Saying No to Credit"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={SAYING_NO_TO_CREDIT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, SAYING_NO_TO_CREDIT_STAGES.length)}
      totalLevels={SAYING_NO_TO_CREDIT_STAGES.length}
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
            <span>Credit Rejection</span>
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
                        { stageId: SAYING_NO_TO_CREDIT_STAGES[currentStage].id, isCorrect: SAYING_NO_TO_CREDIT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Credit Rejection Strength</strong>
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
              Skill unlocked: <strong>Credit Rejection Strength</strong>
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

export default SayingNoToCredit;