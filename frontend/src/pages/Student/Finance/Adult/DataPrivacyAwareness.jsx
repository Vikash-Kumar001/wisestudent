import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DATA_PRIVACY_AWARENESS_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Why is data privacy important in loan apps? ",
    options: [
      {
        id: "a",
        label: "Personal data can be misused",
        reflection: "Correct! Personal data can be misused in numerous ways, causing long-term harm.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "It's not important",
        reflection: "Actually, data privacy is crucial as personal information can be misused for various purposes.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Only financial data matters, not personal data",
        reflection: "Both financial and personal data are important and can be misused in different ways.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Data is safe with any app that requests it",
        reflection: "Data safety depends on the app's practices and security measures, not just the request itself.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "What are potential risks of sharing personal data with loan apps?",
    options: [
     
      {
        id: "a",
        label: "It helps improve app functionality",
        reflection: "While some data helps functionality, excessive data sharing poses privacy risks.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "It speeds up loan approval processes",
        reflection: "Loan approval doesn't require extensive personal data beyond what's necessary.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "It reduces interest rates",
        reflection: "Interest rates aren't determined by the amount of personal data shared.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Data could be sold to third parties or used for harassment",
        reflection: "Exactly! Personal data can be misused for marketing, identity theft, or even harassment.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "How might loan apps misuse your personal contacts information?",
    options: [
      
      {
        id: "a",
        label: "It helps them provide better customer service",
        reflection: "Customer service doesn't require access to your personal contacts.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "It helps them verify your identity faster",
        reflection: "Identity verification doesn't require access to your contacts list.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Contact data could be used for collection activities",
        reflection: "Yes! Lenders might use contact information to pressure you or reach out to your contacts.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "It helps them offer personalized loans",
        reflection: "Personalized loans don't require access to your contacts information.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "What should you consider before sharing personal data with a loan app?",
    options: [
      
      {
        id: "a",
        label: "How quickly the app processes loans",
        reflection: "Processing speed doesn't determine the necessity of sharing personal data.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Whether the data requested is necessary for the loan process",
        reflection: "Perfect! Only share data that is genuinely required for the loan process.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "How many other users share the same data",
        reflection: "The number of users sharing data doesn't make your data sharing safer.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "How user-friendly the app interface is",
        reflection: "Interface friendliness doesn't relate to data privacy safety.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "What is the long-term impact of data misuse by loan apps?",
    options: [
      {
        id: "a",
        label: "Data misuse can cause ongoing privacy and security issues",
        reflection: "Yes! Misused data can lead to persistent problems like identity theft, harassment, and privacy violations.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "It only affects the loan period",
        reflection: "Effects of data misuse can extend far beyond the loan period and be long-lasting.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "It improves your credit profile",
        reflection: "Data misuse doesn't improve credit profiles; it can actually harm them.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "It helps in faster loan approvals in the future",
        reflection: "Data misuse doesn't facilitate future loan approvals; it can cause complications.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
];

const totalStages = DATA_PRIVACY_AWARENESS_STAGES.length;
const successThreshold = totalStages;

const DataPrivacyAwareness = () => {
  const location = useLocation();
  const gameId = "finance-adults-63";
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
      "How can you protect your personal data when using financial apps?",
      "What data minimization practices should you follow?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = DATA_PRIVACY_AWARENESS_STAGES[currentStage];
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
  const stage = DATA_PRIVACY_AWARENESS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Data Privacy Awareness"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={DATA_PRIVACY_AWARENESS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, DATA_PRIVACY_AWARENESS_STAGES.length)}
      totalLevels={DATA_PRIVACY_AWARENESS_STAGES.length}
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
            <span>Data Protection</span>
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
                        { stageId: DATA_PRIVACY_AWARENESS_STAGES[currentStage].id, isCorrect: DATA_PRIVACY_AWARENESS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Data Privacy Protection</strong>
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
              Skill unlocked: <strong>Data Privacy Protection</strong>
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

export default DataPrivacyAwareness;