import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SAFE_EXIT_DECISION_STAGES = [
  {
    id: 1,
    prompt: "You realize a loan app is unsafe. What should you do?",
    options: [
      {
        id: "continue",
        label: "Continue using it",
        reflection: "Continuing to use an unsafe app puts you at greater risk of financial harm, privacy breaches, and potential harassment. It's better to discontinue use immediately.",
        isCorrect: false,
      },
      {
        id: "exit",
        label: "Stop, repay safely, and uninstall",
        reflection: "Exactly! When you identify an app as unsafe, the best course of action is to stop using it, repay any outstanding obligations safely, and uninstall the app to protect yourself.",
        isCorrect: true,
      },
      {
        id: "wait",
        label: "Wait to see if problems develop",
        reflection: "Waiting increases your exposure to risks. Once you've identified an app as unsafe, it's better to act quickly to minimize potential harm.",
        isCorrect: false,
      },
      {
        id: "share",
        label: "Tell friends to use it too",
        reflection: "Sharing an unsafe app with friends puts them at risk. The responsible action is to stop using it yourself and warn others about the risks.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What is the benefit of early exit from an unsafe loan app?",
    options: [
      {
        id: "worse",
        label: "It makes the situation worse",
        reflection: "Actually, early exit typically reduces the potential damage compared to continuing to engage with an unsafe platform.",
        isCorrect: false,
      },
     
      {
        id: "nothing",
        label: "It doesn't make any difference",
        reflection: "Early exit does make a significant difference by limiting your exposure to the risks associated with unsafe loan apps.",
        isCorrect: false,
      },
       {
        id: "reduce",
        label: "Early exit reduces damage",
        reflection: "Correct! Exiting early minimizes your exposure to risks like excessive fees, privacy breaches, harassment, and other potential harms.",
        isCorrect: true,
      },
      {
        id: "complications",
        label: "It creates more complications",
        reflection: "While exiting may involve some steps, it's generally simpler than dealing with the consequences of continued engagement with an unsafe app.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How should you repay an unsafe loan app safely?",
    options: [
      {
        id: "safe",
        label: "Using secure payment methods and keeping records",
        reflection: "Right! When repaying an unsafe app, use secure payment methods and keep detailed records of all transactions for your protection.",
        isCorrect: true,
      },
      {
        id: "direct",
        label: "Through the app only",
        reflection: "If the app itself is unsafe, continuing to use it for payments might expose you to additional risks. Consider safer payment methods.",
        isCorrect: false,
      },
      
      {
        id: "avoid",
        label: "Avoid making payments",
        reflection: "Avoiding payments can lead to serious consequences including legal action and credit damage. It's better to repay safely while taking protective measures.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the obligation",
        reflection: "Ignoring the obligation can result in serious consequences. It's important to address the debt responsibly while protecting yourself.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "Why is it important to keep records when exiting an unsafe loan app?",
    options: [
      {
        id: "unnecessary",
        label: "It's unnecessary paperwork",
        reflection: "Records are important for proving repayment and protecting yourself if disputes arise, especially with unsafe apps that might not maintain reliable records.",
        isCorrect: false,
      },
     
      {
        id: "storage",
        label: "To save storage space",
        reflection: "Records aren't about saving storage space. They serve as important documentation for your protection.",
        isCorrect: false,
      },
      {
        id: "sharing",
        label: "To share with other users",
        reflection: "While sharing experiences can help others, the primary purpose of records is to protect you legally and financially.",
        isCorrect: false,
      },
       {
        id: "protection",
        label: "It provides proof of repayment for legal protection",
        reflection: "Exactly! Keeping records protects you in case the app disappears, loses your data, or tries to claim you haven't repaid when you have.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What is the most important step after identifying an unsafe loan app?",
    options: [
      {
        id: "recommend",
        label: "Recommend it to others",
        reflection: "Recommending an unsafe app to others would put them at risk. This is definitely not the right approach.",
        isCorrect: false,
      },
      
      {
        id: "invest",
        label: "Invest more money to secure your account",
        reflection: "Adding more money to an unsafe app would increase your risk exposure rather than securing your account.",
        isCorrect: false,
      },
      {
        id: "early",
        label: "Early exit to minimize potential harm",
        reflection: "Perfect! Identifying and acting quickly to exit an unsafe app is the most important step to minimize potential financial and privacy harm.",
        isCorrect: true,
      },
      {
        id: "negotiate",
        label: "Negotiate special terms",
        reflection: "While negotiating might seem helpful, the priority should be safely exiting an unsafe platform as quickly as possible.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = SAFE_EXIT_DECISION_STAGES.length;
const successThreshold = totalStages;

const SafeExitDecision = () => {
  const location = useLocation();
  const gameId = "finance-adults-69";
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
      "How can you identify if a loan app is unsafe before using it?",
      "What steps should you take to safely exit an unsafe loan app?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = SAFE_EXIT_DECISION_STAGES[currentStage];
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
  const stage = SAFE_EXIT_DECISION_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Safe Exit Decision"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={SAFE_EXIT_DECISION_STAGES.length}
      currentLevel={Math.min(currentStage + 1, SAFE_EXIT_DECISION_STAGES.length)}
      totalLevels={SAFE_EXIT_DECISION_STAGES.length}
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
            <span>Safe Exit</span>
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
                        { stageId: SAFE_EXIT_DECISION_STAGES[currentStage].id, isCorrect: SAFE_EXIT_DECISION_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Safe exit strategies</strong>
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
              Skill unlocked: <strong>Safe exit strategies</strong>
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

export default SafeExitDecision;