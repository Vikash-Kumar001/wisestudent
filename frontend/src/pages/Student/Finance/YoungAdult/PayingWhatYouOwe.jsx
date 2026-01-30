import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PAYING_WHAT_YOU_OWE_STAGES = [
  {
    id: 1,
    prompt: "Repaying debts on time shows:",
    options: [
      {
        id: "a",
        label: "Weakness",
        reflection: "Repaying debts on time is actually a sign of strength, discipline, and integrity. It demonstrates your ability to manage commitments, honor agreements, and maintain financial responsibility despite challenges or temptations to spend elsewhere.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Reliability and character",
        reflection: "Exactly! Financial discipline reflects personal values. Repaying debts on time demonstrates reliability, integrity, and strong character. It shows you can be trusted with financial responsibilities and builds a positive reputation with lenders and financial institutions.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "That you have too much debt",
        reflection: "Having debt isn't inherently problematic - what matters is how you manage it. Responsible debt management, including timely repayments, shows financial maturity and planning rather than indicating excessive debt levels.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "That you should borrow more",
        reflection: "Timely debt repayment doesn't suggest you should borrow more - it shows you understand and respect your current financial obligations. This responsible behavior should guide future borrowing decisions rather than encouraging more debt.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What's the best approach when facing multiple debt payments?",
    options: [
      {
        id: "a",
        label: "Prioritize payments based on interest rates and due dates",
        reflection: "Exactly! Strategic debt management involves prioritizing payments by interest rates (highest first) and due dates (imminent deadlines first). This approach minimizes total interest paid and avoids late fees while maintaining good relationships with all creditors.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Pay whatever feels easiest each month",
        reflection: "Paying based on ease rather than strategy can lead to higher interest costs, missed payments, and damaged credit. This approach lacks financial discipline and can create long-term problems that are harder and more expensive to resolve.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Ignore the debts and hope they go away",
        reflection: "Ignoring debts leads to accumulating interest, late fees, damaged credit scores, and potential legal action. This approach creates exponentially larger problems and can severely impact your financial future and opportunities.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Pay the smallest amounts to all creditors equally",
        reflection: "While making minimum payments to all creditors might seem fair, it's not the most effective strategy. Prioritizing high-interest debts first (debt avalanche method) or smallest balances first (debt snowball for motivation) typically saves more money and pays off debt faster.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How should you handle unexpected financial hardship affecting debt payments?",
    options: [
      
      {
        id: "a",
        label: "Stop payments entirely until you're back on your feet",
        reflection: "Stopping payments entirely during hardship can severely damage your credit score, incur penalties, and strain relationships with creditors. While understandable during severe difficulties, this approach creates long-term financial consequences that make recovery more challenging.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Borrow more to cover existing debt payments",
        reflection: "Borrowing to cover existing debt payments creates a dangerous cycle that typically leads to deeper financial problems. This approach increases total debt burden and can result in overwhelming financial stress that's difficult to escape.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Hide your financial situation from creditors",
        reflection: "Hiding financial difficulties from creditors prevents access to available assistance programs and can lead to surprise collections actions, damaged credit, and lost opportunities for negotiated solutions that could ease your burden.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Communicate proactively with creditors about modified payment plans",
        reflection: "Exactly! Proactive communication with creditors during financial hardship demonstrates responsibility and often leads to workable solutions like temporary payment reductions, extensions, or hardship programs. This approach protects your credit and relationships with lenders.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What's the relationship between debt repayment and financial freedom?",
    options: [
      
      {
        id: "a",
        label: "Debt repayment limits your financial freedom",
        reflection: "Responsible debt repayment actually enhances financial freedom by reducing interest costs, improving credit scores, and creating opportunities for better financial products. The discipline required for debt repayment builds habits that support broader financial success and flexibility.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "You should avoid all debt to achieve freedom",
        reflection: "While avoiding unnecessary debt is wise, some debt (like mortgages or student loans) can be valuable investments in your future. The key is managing debt responsibly rather than avoiding it entirely. Responsible debt use and repayment can actually accelerate your path to financial freedom.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Consistent repayment builds the foundation for financial freedom",
        reflection: "Exactly! Financial discipline reflects personal values. Consistently repaying debts builds credit history, reduces financial stress, and creates the stability needed for saving, investing, and pursuing financial goals. This disciplined approach is fundamental to achieving long-term financial freedom.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Financial freedom means never having to repay debts",
        reflection: "Financial freedom isn't about avoiding all debt obligations - it's about having the resources and discipline to meet your commitments while pursuing your goals. The ability to repay debts reliably is actually a sign of financial strength and freedom rather than a limitation.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What impact does consistent debt repayment have on your financial reputation?",
    options: [
      {
        id: "a",
        label: "Builds trust with lenders and improves future opportunities",
        reflection: "Exactly! Financial discipline reflects personal values. Consistent debt repayment builds a positive credit history that demonstrates reliability to lenders, employers, and landlords. This reputation opens doors to better interest rates, higher credit limits, and favorable terms on future financial products.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Makes lenders view you as a risky borrower",
        reflection: "Consistent debt repayment signals low risk to lenders, not high risk. Lenders reward reliable borrowers with better terms, higher credit limits, and preferential treatment because they've demonstrated they can be trusted to meet financial obligations.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Has no impact on your financial opportunities",
        reflection: "Your debt repayment history significantly impacts your financial opportunities. Lenders, landlords, and even employers often check credit reports and payment history when making decisions. Good repayment habits create positive opportunities, while poor habits limit them.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Only matters if you're applying for new credit",
        reflection: "Debt repayment history affects many aspects of financial life beyond new credit applications. It influences insurance rates, employment opportunities, rental applications, and utility deposits. Maintaining good repayment habits provides benefits across all areas of financial interaction.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const totalStages = PAYING_WHAT_YOU_OWE_STAGES.length;
const successThreshold = totalStages;

const PayingWhatYouOwe = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-93";
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
      "What debt repayment habits demonstrate your financial discipline?",
      "How can you better prioritize debt payments during financial challenges?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = PAYING_WHAT_YOU_OWE_STAGES[currentStage];
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
  const stage = PAYING_WHAT_YOU_OWE_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Paying What You Owe"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={PAYING_WHAT_YOU_OWE_STAGES.length}
      currentLevel={Math.min(currentStage + 1, PAYING_WHAT_YOU_OWE_STAGES.length)}
      totalLevels={PAYING_WHAT_YOU_OWE_STAGES.length}
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
            <span>Paying What You Owe</span>
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
                        { stageId: PAYING_WHAT_YOU_OWE_STAGES[currentStage].id, isCorrect: PAYING_WHAT_YOU_OWE_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Debt management discipline</strong>
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
              Skill unlocked: <strong>Debt management discipline</strong>
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

export default PayingWhatYouOwe;