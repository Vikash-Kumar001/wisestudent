import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LOAN_PURPOSE_CLARITY_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Why should loan purpose be clear? (A) For lender only or (B) To ensure money is used wisely",
    options: [
      {
        id: "a",
        label: "For lender only",
        reflection: "While lenders need to know the purpose, clarity is equally important for the borrower to ensure responsible use.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "To ensure money is used wisely",
        reflection: "Correct! Clear purpose helps ensure the borrowed money is used as intended and improves repayment success.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "It doesn't matter as long as you repay",
        reflection: "Clear purpose is important for ensuring the loan serves its intended function and improves success rates.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Only for documentation purposes",
        reflection: "The purpose is important beyond documentation - it guides how the funds are used effectively.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "How does having a clear loan purpose benefit you as a borrower?",
    options: [
      {
        id: "a",
        label: "Ensures funds are used for intended purpose",
        reflection: "Exactly! Clear purpose helps ensure the loan money is used appropriately for its intended goal.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Allows you to use funds for anything",
        reflection: "Having a clear purpose means the funds should be used specifically for that purpose, not anything.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Eliminates the need to repay",
        reflection: "Clear purpose doesn't eliminate repayment obligations - it helps ensure proper use of funds.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Reduces the interest rate automatically",
        reflection: "Clear purpose doesn't necessarily reduce interest rates - it helps ensure proper fund utilization.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "What happens when loan purpose is not clearly defined?",
    options: [
      
      {
        id: "a",
        label: "It guarantees higher returns",
        reflection: "Unclear purpose doesn't guarantee higher returns - it increases risk of fund misallocation.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "It simplifies the repayment process",
        reflection: "Unclear purpose doesn't simplify repayment - it may actually complicate it due to misused funds.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "It reduces the loan amount",
        reflection: "Unclear purpose doesn't directly reduce the loan amount but can lead to improper fund usage.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "It may lead to misuse of funds",
        reflection: "Yes! Unclear purpose can result in funds being diverted to unintended uses, reducing loan success.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "How does clear loan purpose contribute to repayment success?",
    options: [
     
      {
        id: "a",
        label: "It eliminates the need for repayment planning",
        reflection: "Clear purpose doesn't eliminate repayment planning - it actually supports better planning.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "It allows skipping payments when needed",
        reflection: "Clear purpose doesn't allow skipping payments - it helps ensure funds are used productively.",
        isCorrect: false,
      },
       {
        id: "c",
        label: "It ensures the loan generates the expected value or benefit",
        reflection: "Perfect! When funds are used as intended, they're more likely to generate expected returns, aiding repayment.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "It prevents interest from accruing",
        reflection: "Clear purpose doesn't prevent interest accrual - it helps ensure productive use of funds.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "What is the best approach to defining loan purpose before borrowing?",
    options: [
      
      {
        id: "a",
        label: "Keep it general so you can use funds flexibly",
        reflection: "General purposes may lead to fund misallocation - specific purposes improve loan success.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Clearly define specific use and expected outcomes",
        reflection: "Excellent! Specific definition with expected outcomes helps ensure funds are used productively.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Define purpose after taking the loan",
        reflection: "Purpose should be defined before borrowing to ensure proper fund allocation and use.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Don't define purpose, trust your instincts",
        reflection: "Without a clear purpose, funds may be misallocated, reducing the effectiveness of the loan.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
];

const totalStages = LOAN_PURPOSE_CLARITY_STAGES.length;
const successThreshold = totalStages;

const LoanPurposeClarity = () => {
  const location = useLocation();
  const gameId = "finance-adults-54";
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
      "How can you ensure your loan purpose is specific and achievable?",
      "What steps should you take to monitor proper use of borrowed funds?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = LOAN_PURPOSE_CLARITY_STAGES[currentStage];
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
  const stage = LOAN_PURPOSE_CLARITY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Loan Purpose Clarity"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={LOAN_PURPOSE_CLARITY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, LOAN_PURPOSE_CLARITY_STAGES.length)}
      totalLevels={LOAN_PURPOSE_CLARITY_STAGES.length}
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
            <span>Loan Purpose</span>
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
                        { stageId: LOAN_PURPOSE_CLARITY_STAGES[currentStage].id, isCorrect: LOAN_PURPOSE_CLARITY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Loan Purpose Clarity</strong>
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
              Skill unlocked: <strong>Loan Purpose Clarity</strong>
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

export default LoanPurposeClarity;