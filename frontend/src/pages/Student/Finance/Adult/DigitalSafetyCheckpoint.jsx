import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DIGITAL_SAFETY_CHECKPOINT_STAGES = [
  {
    id: 1,
    prompt: "Which digital lending practice should you avoid?",
    options: [
      
      {
        id: "quick",
        label: "Lenders promising very quick approval",
        reflection: "While quick approval isn't always bad, it's not the primary safety concern. The key is regulatory compliance and transparent terms.",
        isCorrect: false,
      },
      {
        id: "low",
        label: "Lenders with very low interest rates",
        reflection: "Extremely low rates can sometimes be a red flag, but the primary safety concern is regulatory compliance and transparent terms.",
        isCorrect: false,
      },
      {
        id: "high",
        label: "Lenders with high loan amounts",
        reflection: "High loan amounts aren't necessarily unsafe. The key is regulatory compliance and understanding the terms of the loan.",
        isCorrect: false,
      },
      {
        id: "unregulated",
        label: "Lenders that don't follow regulations",
        reflection: "Absolutely right! Always choose regulated lenders who follow RBI guidelines to ensure your safety and legal protection.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What should you check before using a digital lending app?",
    options: [
      {
        id: "rating",
        label: "Only check app store ratings",
        reflection: "Ratings are helpful but not sufficient. You need to verify regulatory compliance, read terms carefully, and check the lender's credentials.",
        isCorrect: false,
      },
     
      {
        id: "ads",
        label: "Look at how many ads they run",
        reflection: "Advertising volume doesn't indicate safety. Focus on verifying the lender's regulatory status and credentials.",
        isCorrect: false,
      },
       {
        id: "license",
        label: "Verify if the lender has proper licenses",
        reflection: "Correct! Checking if the lender has proper licenses and regulatory approval is essential for your safety.",
        isCorrect: true,
      },
      {
        id: "friends",
        label: "Ask friends if they use it",
        reflection: "Friends' experiences can be helpful but don't guarantee safety. Always verify the lender's regulatory compliance yourself.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Which app permission is a major red flag?",
    options: [
      {
        id: "location",
        label: "Access to location data",
        reflection: "Location access is often used for legitimate purposes like verifying your location for loan processing.",
        isCorrect: false,
      },
      {
        id: "contacts",
        label: "Access to your contacts and call logs",
        reflection: "Exactly! Access to contacts and call logs is a major red flag as it enables harassment of your contacts if you face repayment issues.",
        isCorrect: true,
      },
      {
        id: "camera",
        label: "Access to camera for document upload",
        reflection: "Camera access for document upload is often legitimate for KYC purposes.",
        isCorrect: false,
      },
      {
        id: "storage",
        label: "Access to device storage",
        reflection: "Storage access may be needed for legitimate purposes, though it should be monitored carefully.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How can you identify a predatory digital loan offer?",
    options: [
        {
        id: "guarantee",
        label: "Look for 'guaranteed approval' with no checks",
        reflection: "Right! 'Guaranteed approval' with no checks is a classic sign of a predatory lender trying to get you into debt without considering your repayment ability.",
        isCorrect: true,
      },
      {
        id: "terms",
        label: "Check if terms are clearly explained",
        reflection: "Clear terms are actually a good sign. Look for hidden fees, unclear repayment terms, or vague language to identify predatory offers.",
        isCorrect: false,
      },
    
      {
        id: "support",
        label: "Evaluate the customer support quality",
        reflection: "Good customer support is positive, but predatory lenders often have poor support. The key red flags are things like guaranteed approval with no checks.",
        isCorrect: false,
      },
      {
        id: "website",
        label: "Check if they have a professional website",
        reflection: "A professional website doesn't guarantee legitimacy. Some predatory lenders have polished websites. Look for signs like guaranteed approval with no checks.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What is the best way to handle digital loan communications?",
    options: [
      {
        id: "ignore",
        label: "Ignore all digital communications",
        reflection: "Ignoring all communications might cause you to miss important notices about your legitimate loans or account status.",
        isCorrect: false,
      },
     
      {
        id: "reply",
        label: "Reply to all messages immediately",
        reflection: "Replying to all messages without verification can expose you to scams and unauthorized access to your information.",
        isCorrect: false,
      },
      {
        id: "forward",
        label: "Forward suspicious messages to friends",
        reflection: "While sharing with trusted friends might be helpful, the primary approach should be verifying the source of communications before engaging.",
        isCorrect: false,
      },
       {
        id: "verify",
        label: "Verify the source before responding",
        reflection: "Perfect! Always verify the source of digital communications to avoid phishing scams and fraudulent lenders.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
];

const totalStages = DIGITAL_SAFETY_CHECKPOINT_STAGES.length;
const successThreshold = totalStages;

const DigitalSafetyCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-adults-70";
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
      "How can you verify if a digital lender is legitimate before borrowing?",
      "What steps should you take to protect your personal information when using digital lending platforms?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = DIGITAL_SAFETY_CHECKPOINT_STAGES[currentStage];
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
  const stage = DIGITAL_SAFETY_CHECKPOINT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Digital Safety Checkpoint"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={DIGITAL_SAFETY_CHECKPOINT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, DIGITAL_SAFETY_CHECKPOINT_STAGES.length)}
      totalLevels={DIGITAL_SAFETY_CHECKPOINT_STAGES.length}
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
            <span>Digital Safety</span>
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
                        { stageId: DIGITAL_SAFETY_CHECKPOINT_STAGES[currentStage].id, isCorrect: DIGITAL_SAFETY_CHECKPOINT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Digital lending safety awareness</strong>
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
              Skill unlocked: <strong>Digital lending safety awareness</strong>
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

export default DigitalSafetyCheckpoint;