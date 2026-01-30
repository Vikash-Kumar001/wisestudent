import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const APP_PERMISSION_CHECK_STAGES = [
  {
    id: 1,
    prompt: "Scenario: A loan app asks access to contacts and photos. Is this safe?",
    options: [
      {
        id: "a",
        label: "Yes",
        reflection: "Actually, legitimate lending apps typically don't need access to personal photos or contacts for loan processing.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "No, it's a red flag",
        reflection: "Correct! Excessive permissions like access to contacts and photos are often red flags for potential misuse.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "It depends on the app's rating",
        reflection: "Even highly-rated apps may request unnecessary permissions that could be misused.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "It's safe if the app is popular",
        reflection: "Popularity doesn't guarantee that permission requests are legitimate or safe.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "What is the primary concern when loan apps request access to your contacts?",
    options: [
      {
        id: "a",
        label: "They could use contact data for harassment if you default",
        reflection: "Exactly! Lenders might use contact information to pressure you or your contacts if you face payment issues.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "It helps them approve your loan faster",
        reflection: "Contact access is not necessary for loan approval and is often used for other purposes.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "It helps them verify your identity",
        reflection: "Identity verification doesn't require access to your personal contacts.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "It helps them send you better offers",
        reflection: "Sending offers doesn't require access to your contacts or personal photos.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "Why might a legitimate lending app request access to personal photos?",
    options: [
     
      {
        id: "a",
        label: "To verify your identity through facial recognition",
        reflection: "While identity verification might be needed, it's typically done with official documents, not personal photos.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "To assess your financial status from your lifestyle",
        reflection: "Assessing financial status from photos is not a standard practice for legitimate lenders.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "To personalize your loan experience",
        reflection: "Personalizing loan experience doesn't require access to your personal photos.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Legitimate apps typically don't need access to personal photos",
        reflection: "That's right! Legitimate lending apps don't require access to personal photos for their core functions.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "What should you do when a loan app requests excessive permissions?",
    options: [
      
      {
        id: "a",
        label: "Grant the permissions if you urgently need the loan",
        reflection: "Granting excessive permissions can lead to privacy violations and harassment later.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Grant the permissions temporarily",
        reflection: "There's no concept of temporary permission grants in most systems, and it's still risky.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Deny the permissions and look for alternative lenders",
        reflection: "Perfect! Denying excessive permissions and finding reputable lenders is the safest approach.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Grant all permissions to speed up the process",
        reflection: "Speeding up the process shouldn't come at the cost of your privacy and security.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "What is the relationship between app permissions and borrower protection?",
    options: [
      {
        id: "a",
        label: "More permissions mean less protection for borrowers",
        reflection: "Yes! More permissions give lenders more potential ways to misuse data or harass borrowers.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Permissions don't affect borrower protection",
        reflection: "Permissions directly affect how your data can be accessed and potentially misused.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "More permissions provide better borrower protection",
        reflection: "More permissions actually increase the risk of data misuse and harassment.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Fewer permissions mean higher interest rates",
        reflection: "The number of permissions granted doesn't typically affect interest rates.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
];

const totalStages = APP_PERMISSION_CHECK_STAGES.length;
const successThreshold = totalStages;

const AppPermissionCheck = () => {
  const location = useLocation();
  const gameId = "finance-adults-60";
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
      "How can you evaluate if app permission requests are legitimate?",
      "What steps should you take to protect your privacy when using financial apps?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = APP_PERMISSION_CHECK_STAGES[currentStage];
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
  const stage = APP_PERMISSION_CHECK_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="App Permission Check"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={APP_PERMISSION_CHECK_STAGES.length}
      currentLevel={Math.min(currentStage + 1, APP_PERMISSION_CHECK_STAGES.length)}
      totalLevels={APP_PERMISSION_CHECK_STAGES.length}
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
            <span>Privacy Protection</span>
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
                        { stageId: APP_PERMISSION_CHECK_STAGES[currentStage].id, isCorrect: APP_PERMISSION_CHECK_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>App Permission Awareness</strong>
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
              Skill unlocked: <strong>App Permission Awareness</strong>
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

export default AppPermissionCheck;