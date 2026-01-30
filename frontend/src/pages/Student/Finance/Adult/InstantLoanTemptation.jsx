import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INSTANT_LOAN_TEMPTATION_STAGES = [
  {
    id: 1,
    prompt: "Scenario: An app offers 'Instant loan in 5 minutes.' What should you do first? ",
    options: [
       {
        id: "a",
        label: "Check legitimacy and terms",
        reflection: "Correct! Verifying legitimacy and understanding terms is essential before any loan agreement.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Accept immediately",
        reflection: "Accepting immediately without checking details can lead to hidden risks and unfavorable terms.",
        isCorrect: false,
      },
     
      {
        id: "c",
        label: "Apply for the maximum amount offered",
        reflection: "Applying without checking terms can expose you to unfavorable conditions and excessive debt.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Share with friends who might need money",
        reflection: "Sharing unverified loan offers can spread potentially risky financial products to others.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "Why might instant loan offers be risky despite their convenience?",
    options: [
      
      {
        id: "a",
        label: "They are always government-approved",
        reflection: "Instant loans are not necessarily government-approved and may come from unregulated sources.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "They offer the best terms due to competition",
        reflection: "Fast loans don't necessarily offer the best terms; speed often comes with higher costs.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "They require extensive documentation",
        reflection: "Instant loans typically promise minimal documentation, not extensive paperwork.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "They often have hidden fees and high interest rates",
        reflection: "Exactly! Speed-focused lenders may hide costs that significantly increase the loan burden.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "What should be your priority when evaluating a digital lending platform?",
    options: [
      
      {
        id: "a",
        label: "Focus on the speed of disbursement",
        reflection: "Speed is not a priority compared to verifying legitimacy and terms of the loan.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Check only the interest rate",
        reflection: "While interest rate matters, verifying legitimacy and all terms is more important than just the rate.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Verify the platform's license and regulatory compliance",
        reflection: "Perfect! Ensuring the platform is licensed and regulated protects you from fraudulent operators.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Look for celebrity endorsements",
        reflection: "Celebrity endorsements don't guarantee legitimacy or favorable terms for borrowers.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "What is the relationship between loan processing speed and risk?",
    options: [
     
      {
        id: "a",
        label: "Faster loans are always safer",
        reflection: "Speed doesn't correlate with safety; fast loans can hide significant risks.",
        isCorrect: false,
      },
       {
        id: "b",
        label: "Speed often correlates with higher risk in digital lending",
        reflection: "Yes! Fast loans often come with less scrutiny and potentially hidden risks.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Speed has no bearing on loan risk",
        reflection: "Speed can indicate less scrutiny and potentially more risk, especially with digital platforms.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Slow processing always means high risk",
        reflection: "Processing time alone doesn't determine risk; verification and terms are more important.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "How should you approach promotional offers from digital lending apps?",
    options: [
      {
        id: "a",
        label: "Carefully evaluate terms before accepting any offer",
        reflection: "Excellent! Thorough evaluation helps identify potential risks and ensures suitable borrowing.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Accept if the initial offer looks attractive",
        reflection: "Initial offers might not represent the full terms; comprehensive evaluation is necessary.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Trust the app rating on the store",
        reflection: "App ratings don't guarantee fair lending terms or protection against hidden risks.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Focus only on the approval speed",
        reflection: "Approval speed is less important than understanding the terms and conditions of the loan.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
];

const totalStages = INSTANT_LOAN_TEMPTATION_STAGES.length;
const successThreshold = totalStages;

const InstantLoanTemptation = () => {
  const location = useLocation();
  const gameId = "finance-adults-59";
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
      "How can you verify the legitimacy of digital lending platforms?",
      "What red flags should you watch for in instant loan offers?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = INSTANT_LOAN_TEMPTATION_STAGES[currentStage];
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
  const stage = INSTANT_LOAN_TEMPTATION_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Instant Loan Temptation"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={INSTANT_LOAN_TEMPTATION_STAGES.length}
      currentLevel={Math.min(currentStage + 1, INSTANT_LOAN_TEMPTATION_STAGES.length)}
      totalLevels={INSTANT_LOAN_TEMPTATION_STAGES.length}
      gameId={gameId}
      gameType="finance"
      showGameOver={showResult}
      showConfetti={showResult && hasPassed}
      shouldSubmitGameCompletion={true}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-5 text-white">
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
            <span>Scenario</span>
            <span>Digital Lending</span>
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
                        { stageId: INSTANT_LOAN_TEMPTATION_STAGES[currentStage].id, isCorrect: INSTANT_LOAN_TEMPTATION_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Digital Lending Caution</strong>
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
              Skill unlocked: <strong>Digital Lending Caution</strong>
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

export default InstantLoanTemptation;