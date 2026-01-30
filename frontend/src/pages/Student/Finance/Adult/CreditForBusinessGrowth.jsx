import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CREDIT_FOR_BUSINESS_GROWTH_STAGES = [
  {
    id: 1,
    prompt: "When is business borrowing safer?",
    options: [
      {
        id: "losses",
        label: "To cover losses",
        reflection: "Using credit to cover losses can create a dangerous cycle of debt. This approach doesn't address underlying business problems and can lead to insolvency.",
        isCorrect: false,
      },
      
      {
        id: "daily",
        label: "For daily operational expenses",
        reflection: "Using credit for daily operational expenses without a clear repayment plan can lead to accumulating debt. Planned growth investments are safer.",
        isCorrect: false,
      },
      {
        id: "personnel",
        label: "To hire additional personnel",
        reflection: "While hiring might be part of growth, borrowing should be based on planned growth with clear cash flow projections, not just for staffing.",
        isCorrect: false,
      },
      {
        id: "growth",
        label: "To support planned growth with cash flow",
        reflection: "Exactly! Borrowing is safer when it supports planned growth initiatives and you have a clear cash flow to repay the debt.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What makes business borrowing appropriate?",
    options: [
      {
        id: "desperation",
        label: "When you're desperate for money",
        reflection: "Making borrowing decisions out of desperation often leads to poor financial choices. Borrowing should be planned and strategic.",
        isCorrect: false,
      },
      
      {
        id: "pressure",
        label: "When suppliers pressure you to buy now",
        reflection: "Making borrowing decisions under pressure from suppliers might not align with your business needs. Planned borrowing is safer.",
        isCorrect: false,
      },
      {
        id: "planned",
        label: "When it's for planned growth with projected returns",
        reflection: "Right! Borrowing is most appropriate when it's part of a planned growth strategy with clear projections for returns and repayment.",
        isCorrect: true,
      },
      {
        id: "opportunity",
        label: "For any business opportunity that arises",
        reflection: "While opportunities are important, not all require borrowing. The safest approach is planned borrowing for growth with clear cash flows.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Why is using credit to cover losses problematic?",
    options: [
      {
        id: "temporary",
        label: "Losses are always temporary",
        reflection: "This is incorrect. Losses can be persistent, and using credit to cover them without addressing underlying issues creates dangerous debt cycles.",
        isCorrect: false,
      },
      {
        id: "cycle",
        label: "It creates a cycle of debt without addressing root causes",
        reflection: "Correct! Using credit to cover losses doesn't solve the underlying business problems and can lead to an unsustainable debt cycle.",
        isCorrect: true,
      },
      {
        id: "expensive",
        label: "Credit is too expensive",
        reflection: "While credit has costs, the main issue with using it to cover losses is that it doesn't address the root cause of the losses, creating a dangerous cycle.",
        isCorrect: false,
      },
      {
        id: "available",
        label: "Credit is not always available",
        reflection: "While credit availability can vary, the main problem with using credit to cover losses is that it doesn't address underlying business issues.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What should you have before taking business credit for growth?",
    options: [
      {
        id: "projection",
        label: "Clear revenue projections and repayment plan",
        reflection: "Exactly! Before taking credit for growth, you need clear revenue projections and a solid repayment plan based on expected returns.",
        isCorrect: true,
      },
      {
        id: "confidence",
        label: "Just confidence in your business",
        reflection: "While confidence is important, taking business credit requires more than just confidence. You need concrete plans and projections.",
        isCorrect: false,
      },
      
      {
        id: "equipment",
        label: "Equipment to collateralize the loan",
        reflection: "While collateral can help secure credit, the most important factor is having a clear plan for how the credit will generate returns to repay it.",
        isCorrect: false,
      },
      {
        id: "partners",
        label: "Business partners to share responsibility",
        reflection: "Partners can be helpful, but the key is having a clear business plan with revenue projections and repayment strategy.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What is the outcome of using credit appropriately for business growth?",
    options: [
      {
        id: "problems",
        label: "It hides existing business problems",
        reflection: "Actually, using credit appropriately for growth should address problems by expanding the business in a planned way, not hiding issues.",
        isCorrect: false,
      },
      
      {
        id: "debt",
        label: "It inevitably leads to more debt",
        reflection: "When used appropriately for planned growth with clear repayment sources, credit can be managed effectively without creating problematic debt cycles.",
        isCorrect: false,
      },
      {
        id: "risk",
        label: "It eliminates all business risks",
        reflection: "Credit doesn't eliminate business risks. When used properly, it should support growth initiatives with clear projections and plans.",
        isCorrect: false,
      },
      {
        id: "growth",
        label: "Credit should support growth, not hide problems",
        reflection: "Perfect! Credit is most effective when it supports planned growth initiatives with clear returns, rather than masking underlying business problems.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
];

const totalStages = CREDIT_FOR_BUSINESS_GROWTH_STAGES.length;
const successThreshold = totalStages;

const CreditForBusinessGrowth = () => {
  const location = useLocation();
  const gameId = "finance-adults-74";
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
      "How can you evaluate if business credit is appropriate for your growth plans?",
      "What financial projections should you prepare before taking business credit?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = CREDIT_FOR_BUSINESS_GROWTH_STAGES[currentStage];
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
  const stage = CREDIT_FOR_BUSINESS_GROWTH_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Credit for Business Growth"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={CREDIT_FOR_BUSINESS_GROWTH_STAGES.length}
      currentLevel={Math.min(currentStage + 1, CREDIT_FOR_BUSINESS_GROWTH_STAGES.length)}
      totalLevels={CREDIT_FOR_BUSINESS_GROWTH_STAGES.length}
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
            <span>Business Credit</span>
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
                        { stageId: CREDIT_FOR_BUSINESS_GROWTH_STAGES[currentStage].id, isCorrect: CREDIT_FOR_BUSINESS_GROWTH_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Business credit management</strong>
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
              Skill unlocked: <strong>Business credit management</strong>
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

export default CreditForBusinessGrowth;