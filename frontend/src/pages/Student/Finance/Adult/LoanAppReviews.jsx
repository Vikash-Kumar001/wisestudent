import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LOAN_APP_REVIEWS_STAGES = [
  {
    id: 1,
    prompt: "Why should you check reviews for a loan app?",
    options: [
      {
        id: "entertainment",
        label: "For entertainment",
        reflection: "Reviews are not meant for entertainment. They provide important information about user experiences and potential risks with the loan app.",
        isCorrect: false,
      },
      
      {
        id: "rating",
        label: "Just to check the rating number",
        reflection: "While ratings matter, reading the actual reviews gives you more detailed insights into user experiences and potential issues.",
        isCorrect: false,
      },
      {
        id: "features",
        label: "To learn about app features only",
        reflection: "Reviews do share information about features, but more importantly, they reveal user complaints and risks that are crucial for your financial safety.",
        isCorrect: false,
      },
      {
        id: "risks",
        label: "To identify user complaints and risks",
        reflection: "Exactly! Reviews help you understand potential problems and risks other users have experienced with the loan app.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What can past user experiences reveal about a loan app?",
    options: [
      {
        id: "fun",
        label: "How entertaining the app is",
        reflection: "Loan apps should be evaluated based on safety and reliability, not entertainment value.",
        isCorrect: false,
      },
      {
        id: "problems",
        label: "Hidden problems and red flags",
        reflection: "Correct! Past user experiences often reveal hidden problems that aren't apparent from the app's marketing materials.",
        isCorrect: true,
      },
      {
        id: "design",
        label: "Only about the app's design",
        reflection: "While design is important, user experiences reveal much more significant information about potential risks and problems.",
        isCorrect: false,
      },
      {
        id: "speed",
        label: "How fast the app works",
        reflection: "Speed is just one aspect. Reviews reveal more important information about hidden problems and risks.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Which type of review should you pay most attention to?",
    options: [
      {
        id: "positive",
        label: "Only positive reviews",
        reflection: "Positive reviews are helpful, but they might not reveal potential problems or risks you should be aware of.",
        isCorrect: false,
      },
      
      {
        id: "old",
        label: "Only older reviews",
        reflection: "Both old and recent reviews are important, but focusing on reviews that mention complaints and issues is most valuable for identifying risks.",
        isCorrect: false,
      },
      {
        id: "complaints",
        label: "Reviews mentioning complaints and issues",
        reflection: "Right! Paying attention to complaints and issues helps you identify potential risks before using the app.",
        isCorrect: true,
      },
      {
        id: "new",
        label: "Only newest reviews",
        reflection: "Recent reviews are important, but the key is to focus on reviews that mention complaints and issues, regardless of when they were posted.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What is the main benefit of reading multiple reviews?",
    options: [
      {
        id: "time",
        label: "It wastes your time",
        reflection: "Actually, reading reviews saves you from potential financial problems by helping you avoid risky apps.",
        isCorrect: false,
      },
      {
        id: "pattern",
        label: "Identifying patterns of user complaints",
        reflection: "Exactly! Looking for patterns in reviews helps you spot recurring issues and potential risks with the loan app.",
        isCorrect: true,
      },
      {
        id: "rating",
        label: "Calculating average rating",
        reflection: "While calculating averages is helpful, the main benefit is identifying patterns of complaints and issues that could affect you.",
        isCorrect: false,
      },
      {
        id: "writing",
        label: "Improving your writing skills",
        reflection: "Reading reviews is primarily about understanding potential risks, not improving writing skills.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "How do past user experiences help you?",
    options: [
      {
        id: "reveal",
        label: "Reveal hidden problems before you use the app",
        reflection: "Perfect! Past user experiences reveal hidden problems so you can make informed decisions before encountering them yourself.",
        isCorrect: true,
      },
      {
        id: "guess",
        label: "Make better guesses about the app",
        reflection: "Reviews provide concrete information, not just material for guessing.",
        isCorrect: false,
      },
      
      {
        id: "follow",
        label: "Follow others' decisions blindly",
        reflection: "Reviews should inform your decision-making, not encourage blind following of others' choices.",
        isCorrect: false,
      },
      {
        id: "copy",
        label: "Copy others' borrowing strategies",
        reflection: "Reviews help you identify risks and problems, not copy others' strategies which may not be suitable for your situation.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = LOAN_APP_REVIEWS_STAGES.length;
const successThreshold = totalStages;

const LoanAppReviews = () => {
  const location = useLocation();
  const gameId = "finance-adults-66";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 15;
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
      "How can you identify trustworthy reviews about loan apps?",
      "What specific patterns should you look for when reading loan app reviews?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = LOAN_APP_REVIEWS_STAGES[currentStage];
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
      setCoins(prevCoins => prevCoins + 1);
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
        setCoins(passed ? totalCoins : 0); // Set final coins based on performance
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
  const stage = LOAN_APP_REVIEWS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Loan App Reviews"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={LOAN_APP_REVIEWS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, LOAN_APP_REVIEWS_STAGES.length)}
      totalLevels={LOAN_APP_REVIEWS_STAGES.length}
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
            <span>App Reviews</span>
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
                        { stageId: LOAN_APP_REVIEWS_STAGES[currentStage].id, isCorrect: LOAN_APP_REVIEWS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Review analysis for financial safety</strong>
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
              Skill unlocked: <strong>Review analysis for financial safety</strong>
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

export default LoanAppReviews;