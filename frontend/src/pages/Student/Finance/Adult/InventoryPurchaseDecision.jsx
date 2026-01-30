import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INVENTORY_PURCHASE_DECISION_STAGES = [
  {
    id: 1,
    prompt: "You want to buy extra stock. What should you check first?",
    options: [
      {
        id: "supplier",
        label: "Supplier pressure",
        reflection: "Making decisions based on supplier pressure can lead to overstocking and cash flow problems. You should focus on your own business needs.",
        isCorrect: false,
      },
      {
        id: "sales",
        label: "Expected sales and cash availability",
        reflection: "Exactly! You should always check expected sales and cash availability before purchasing inventory to ensure you can sell the items and afford them.",
        isCorrect: true,
      },
      {
        id: "discount",
        label: "Available discount on bulk purchase",
        reflection: "While discounts can be attractive, the primary consideration should be whether you can sell the inventory and whether you have the cash to purchase it.",
        isCorrect: false,
      },
      {
        id: "season",
        label: "Current season only",
        reflection: "Seasonality is important, but you also need to consider expected sales and cash availability to make the right inventory decision.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "Why is it important to match inventory to expected sales?",
    options: [
      {
        id: "demand",
        label: "To match inventory to actual demand",
        reflection: "Correct! Matching inventory to expected demand helps avoid overstocking, reduces carrying costs, and ensures cash isn't tied up unnecessarily.",
        isCorrect: true,
      },
      {
        id: "storage",
        label: "To maximize storage space",
        reflection: "The goal isn't to maximize storage space. It's to align inventory with actual customer demand to avoid overstocking.",
        isCorrect: false,
      },
      
      {
        id: "variety",
        label: "To offer maximum variety",
        reflection: "While variety is important, the primary concern is ensuring inventory matches actual customer demand to avoid excess stock.",
        isCorrect: false,
      },
      {
        id: "trend",
        label: "To follow market trends",
        reflection: "Following trends is important, but the key is to ensure inventory matches expected sales, not just trends.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "What is the risk of buying inventory based on 'hope' rather than demand?",
    options: [
      {
        id: "confidence",
        label: "It shows confidence in business growth",
        reflection: "While confidence is good, buying inventory based on hope rather than actual demand can lead to overstocking and cash flow issues.",
        isCorrect: false,
      },
     
      {
        id: "profit",
        label: "It guarantees higher profits",
        reflection: "Buying inventory without demand backing doesn't guarantee profits. It can lead to losses if the items remain unsold.",
        isCorrect: false,
      },
      {
        id: "supply",
        label: "It ensures supply chain continuity",
        reflection: "Buying without demand forecasting doesn't ensure supply chain continuity. It can actually disrupt cash flow and tie up resources unnecessarily.",
        isCorrect: false,
      },
       {
        id: "risk",
        label: "It leads to overstocking and cash flow problems",
        reflection: "Exactly! Buying inventory based on hope rather than actual demand often results in unsold inventory that ties up cash and incurs storage costs.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How should you determine the right amount of inventory to purchase?",
    options: [
      {
        id: "maximum",
        label: "Buy as much as possible when prices are low",
        reflection: "Buying maximum quantities without considering demand can lead to overstocking and cash flow problems, regardless of low prices.",
        isCorrect: false,
      },
      {
        id: "forecast",
        label: "Based on sales forecast and turnover rate",
        reflection: "Right! Purchasing inventory based on sales forecasts and turnover rates helps ensure you have the right amount of stock to meet demand without overstocking.",
        isCorrect: true,
      },
      {
        id: "minimum",
        label: "Always buy the minimum possible",
        reflection: "Buying minimum quantities might lead to stockouts and lost sales. The right approach is to match purchases to forecasted demand.",
        isCorrect: false,
      },
      {
        id: "average",
        label: "Same amount as last month",
        reflection: "Simply repeating last month's purchases without considering current demand patterns may lead to overstocking or stockouts.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What is the outcome of matching inventory to demand rather than hope?",
    options: [
      {
        id: "loss",
        label: "Increased business losses",
        reflection: "Actually, matching inventory to demand rather than hope typically reduces losses by preventing overstocking and optimizing cash flow.",
        isCorrect: false,
      },
      
      {
        id: "stress",
        label: "More business stress",
        reflection: "Matching inventory to demand actually reduces stress by ensuring you have the right amount of stock to meet customer needs without overcommitting resources.",
        isCorrect: false,
      },
      {
        id: "match",
        label: "Inventory should match demand, not hope",
        reflection: "Perfect! Matching inventory to actual demand rather than wishful thinking helps optimize cash flow and reduces the risk of overstocking.",
        isCorrect: true,
      },
      {
        id: "waste",
        label: "More wastage of resources",
        reflection: "Actually, matching inventory to demand reduces waste by preventing overstocking and ensuring efficient use of cash resources.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = INVENTORY_PURCHASE_DECISION_STAGES.length;
const successThreshold = totalStages;

const InventoryPurchaseDecision = () => {
  const location = useLocation();
  const gameId = "finance-adults-73";
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
      "How can you forecast sales to make better inventory decisions?",
      "What metrics should you track to optimize your inventory purchases?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = INVENTORY_PURCHASE_DECISION_STAGES[currentStage];
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
  const stage = INVENTORY_PURCHASE_DECISION_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Inventory Purchase Decision"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={INVENTORY_PURCHASE_DECISION_STAGES.length}
      currentLevel={Math.min(currentStage + 1, INVENTORY_PURCHASE_DECISION_STAGES.length)}
      totalLevels={INVENTORY_PURCHASE_DECISION_STAGES.length}
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
            <span>Inventory</span>
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
                        { stageId: INVENTORY_PURCHASE_DECISION_STAGES[currentStage].id, isCorrect: INVENTORY_PURCHASE_DECISION_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Inventory management decision-making</strong>
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
              Skill unlocked: <strong>Inventory management decision-making</strong>
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

export default InventoryPurchaseDecision;