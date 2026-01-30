import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BORROWING_WITH_RESPONSIBILITY_STAGES = [
  {
    id: 1,
    prompt: "Borrowing is ethical when:",
    options: [
      {
        id: "a",
        label: "You plan to repay fully and on time",
        reflection: "Exactly! Responsible borrowing starts with a clear commitment to repay the full amount according to the agreed terms. This demonstrates respect for the lender's trust and maintains your financial integrity while building a positive borrowing history.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "You assume delays are acceptable",
        reflection: "Assuming delays are acceptable shows a lack of respect for the lender and the borrowing agreement. This approach can damage relationships, harm your credit reputation, and create financial stress for both parties involved.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "You borrow as much as possible",
        reflection: "Borrowing as much as possible without considering your ability to repay is financially irresponsible and unethical. This approach can lead to overwhelming debt, damaged relationships, and long-term financial hardship.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "You only borrow from close friends",
        reflection: "While borrowing from friends might seem easier, it still requires the same ethical standards as borrowing from institutions. The relationship doesn't change the responsibility to repay according to agreed terms and maintain trust.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What's the first step before taking any loan?",
    options: [
     
      {
        id: "a",
        label: "Compare interest rates from different lenders",
        reflection: "While comparing interest rates is important, it should come after confirming you can afford the loan payments. The most attractive rate won't help if you can't manage the required payments, leading to default and financial damage.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Check what your friends are borrowing",
        reflection: "Your friends' borrowing decisions don't reflect your financial situation or needs. Making borrowing decisions based on others' choices can lead to inappropriate debt levels and financial strain that doesn't align with your personal circumstances.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Apply to multiple lenders simultaneously",
        reflection: "Applying to multiple lenders simultaneously can hurt your credit score and create confusion about your financial situation. It's better to research thoroughly first, then apply strategically to lenders that match your profile and needs.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Calculate if you can afford the payments",
        reflection: "Exactly! Responsible borrowing requires careful assessment of your ability to make regular payments without compromising your financial stability. This includes considering your income, existing obligations, and emergency fund needs.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How should you handle a payment you might miss?",
    options: [
      
      {
        id: "a",
        label: "Wait until the payment is officially late",
        reflection: "Waiting until a payment is officially late can result in penalties, damage to your credit score, and reduced options for resolving the situation. Lenders are more willing to work with borrowers who communicate proactively about potential difficulties.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Borrow from another source to cover the payment",
        reflection: "Borrowing to cover existing payments can create a dangerous cycle of debt that becomes increasingly difficult to manage. This approach often leads to greater financial stress and can damage multiple relationships and credit accounts.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Contact the lender immediately to discuss options",
        reflection: "Exactly! Proactive communication with your lender demonstrates responsibility and often leads to workable solutions like payment plans or temporary adjustments. This approach protects your relationship with the lender and your credit standing.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Ignore the payment and hope for the best",
        reflection: "Ignoring payments and hoping for the best is financially irresponsible and can lead to serious consequences including damaged credit, legal action, and strained relationships. Responsible borrowers address payment issues directly and promptly.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What makes a borrowing relationship healthy?",
    options: [
      
      {
        id: "a",
        label: "Getting the maximum amount possible",
        reflection: "Focusing on maximum borrowing amounts rather than appropriate amounts can lead to financial strain and damaged relationships. Healthy borrowing is about meeting genuine needs within sustainable limits, not maximizing debt.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Clear terms and mutual respect",
        reflection: "Exactly! Healthy borrowing relationships are built on clear, agreed-upon terms and mutual respect between borrower and lender. This includes transparent communication about expectations, realistic repayment schedules, and respect for both parties' financial situations.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Borrowing without discussing consequences",
        reflection: "Borrowing without discussing potential consequences creates unrealistic expectations and can lead to misunderstandings when difficulties arise. Responsible borrowing requires honest conversations about risks, backup plans, and mutual responsibilities.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Never discussing the loan again after agreement",
        reflection: "Avoiding ongoing communication about loans can lead to misunderstandings and missed opportunities to address potential issues. Healthy borrowing relationships involve periodic check-ins and open communication about changing circumstances or concerns.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's the impact of responsible borrowing on your future?",
    options: [
      {
        id: "a",
        label: "Builds trust and better opportunities",
        reflection: "Exactly! Responsible borrowing creates a positive track record that builds trust with lenders and opens doors to better financial opportunities. This includes favorable interest rates, higher credit limits, and access to important financial products when you need them most.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Limits your ability to borrow in emergencies",
        reflection: "Responsible borrowing actually enhances your ability to access emergency funds when needed. Lenders are more willing to work with borrowers who have demonstrated reliability and responsibility in their financial dealings.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Makes borrowing more expensive over time",
        reflection: "Responsible borrowing typically leads to better rates and terms over time, not higher costs. A good borrowing history demonstrates low risk to lenders, who reward this with more favorable conditions and opportunities.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Creates unnecessary financial restrictions",
        reflection: "Responsible borrowing creates sustainable financial habits that provide freedom rather than restrictions. By borrowing within your means and maintaining good relationships, you preserve flexibility and options for future financial needs.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const totalStages = BORROWING_WITH_RESPONSIBILITY_STAGES.length;
const successThreshold = totalStages;

const BorrowingWithResponsibility = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-92";
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
      "What borrowing decisions have you made that demonstrate responsibility?",
      "How can you better assess your ability to repay before taking loans?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = BORROWING_WITH_RESPONSIBILITY_STAGES[currentStage];
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
  const stage = BORROWING_WITH_RESPONSIBILITY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Borrowing with Responsibility"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={BORROWING_WITH_RESPONSIBILITY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, BORROWING_WITH_RESPONSIBILITY_STAGES.length)}
      totalLevels={BORROWING_WITH_RESPONSIBILITY_STAGES.length}
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
            <span>Borrowing with Responsibility</span>
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
                        { stageId: BORROWING_WITH_RESPONSIBILITY_STAGES[currentStage].id, isCorrect: BORROWING_WITH_RESPONSIBILITY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Responsible borrowing practices</strong>
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
              Skill unlocked: <strong>Responsible borrowing practices</strong>
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

export default BorrowingWithResponsibility;