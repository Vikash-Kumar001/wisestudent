import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GUARANTEED_APPROVAL_CLAIM_STAGES = [
  {
    id: 1,
    prompt: "Scenario: An app promises 'Guaranteed approval, no checks.' What does this mean? ",
    options: [
      {
        id: "a",
        label: "High-risk lending trap",
        reflection: "Correct! No-check loans often come with harsh terms and can lead to financial exploitation.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Helpful service",
        reflection: "Actually, 'no checks' means they're not assessing your ability to repay, which can lead to problematic debt.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Efficient and convenient process",
        reflection: "Skipping checks may seem efficient but it's risky for both parties and often indicates predatory lending.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Lower interest rates",
        reflection: "No-check loans often have higher interest rates due to the increased risk taken by the lender.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "Why might a 'no checks' loan be particularly dangerous?",
    options: [
      
      {
        id: "a",
        label: "It has better customer service",
        reflection: "Customer service quality isn't related to whether checks are performed or not.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "It offers longer repayment periods",
        reflection: "Skipping checks doesn't necessarily mean longer repayment periods; it often means riskier terms.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "It provides more loan amount",
        reflection: "Without checks, lenders might offer less, not more, and terms are often harsher.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "It bypasses creditworthiness assessment, potentially leading to unaffordable debt",
        reflection: "Exactly! Without checking your ability to repay, you might take on debt you can't afford.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "What is the likely intention behind 'guaranteed approval' marketing?",
    options: [
      
      {
        id: "a",
        label: "To help people with poor credit",
        reflection: "While they claim to help, the terms are often exploitative rather than helpful.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "To promote financial wellness",
        reflection: "These loans typically exploit rather than promote financial wellness.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "To attract borrowers without proper vetting for profit",
        reflection: "Yes! These lenders often profit through high fees, interest, or harsh collection practices.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "To provide competitive interest rates",
        reflection: "These loans typically have higher rates, not competitive ones.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "How should you approach 'no checks' loan offers?",
    options: [
     
      {
        id: "a",
        label: "Accept them as they're quick and convenient",
        reflection: "Quick convenience often comes with hidden costs and exploitative terms.",
        isCorrect: false,
      },
       {
        id: "b",
        label: "Avoid them as they typically involve exploitative terms",
        reflection: "Perfect! These offers usually indicate predatory lending practices that should be avoided.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Consider only if you have no other options",
        reflection: "Even with limited options, these loans often create more problems than they solve.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Compare with other 'no checks' offers",
        reflection: "Comparing exploitative offers doesn't make them any less risky or harmful.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "What is the relationship between loan checks and borrower protection?",
    options: [
      {
        id: "a",
        label: "Checks help ensure the loan is affordable and appropriate",
        reflection: "Exactly! Proper checks protect borrowers from taking on unmanageable debt obligations.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Checks are only for the lender's benefit",
        reflection: "Checks actually protect borrowers by ensuring they can afford the loan terms.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "No checks mean more protection",
        reflection: "Skipping checks removes protections for borrowers and increases risk of unaffordable debt.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Checks are outdated and unnecessary",
        reflection: "Checks serve an important purpose in ensuring loans are appropriate and affordable.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
];

const totalStages = GUARANTEED_APPROVAL_CLAIM_STAGES.length;
const successThreshold = totalStages;

const GuaranteedApprovalClaim = () => {
  const location = useLocation();
  const gameId = "finance-adults-62";
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
      "How can you identify predatory lending practices in loan offers?",
      "What questions should you ask before accepting any loan?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = GUARANTEED_APPROVAL_CLAIM_STAGES[currentStage];
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
  const stage = GUARANTEED_APPROVAL_CLAIM_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Guaranteed Approval Claim"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={GUARANTEED_APPROVAL_CLAIM_STAGES.length}
      currentLevel={Math.min(currentStage + 1, GUARANTEED_APPROVAL_CLAIM_STAGES.length)}
      totalLevels={GUARANTEED_APPROVAL_CLAIM_STAGES.length}
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
            <span>Predatory Lending</span>
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
                        { stageId: GUARANTEED_APPROVAL_CLAIM_STAGES[currentStage].id, isCorrect: GUARANTEED_APPROVAL_CLAIM_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Predatory Lending Awareness</strong>
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
              Skill unlocked: <strong>Predatory Lending Awareness</strong>
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

export default GuaranteedApprovalClaim;