import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PRICING_DISCIPLINE_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Selling below cost leads to:",
    options: [
      {
        id: "growth",
        label: "Growth",
        reflection: "Selling below cost might attract customers initially, but it creates unsustainable financial pressure and doesn't lead to genuine business growth.",
        isCorrect: false,
      },
      {
        id: "losses",
        label: "Long-term losses",
        reflection: "Exactly! Selling below cost consistently leads to long-term losses. You're essentially paying customers to buy from you, which is financially unsustainable.",
        isCorrect: true,
      },
      {
        id: "market",
        label: "Market dominance",
        reflection: "While low prices might increase market share temporarily, selling below cost doesn't create sustainable market dominance and can harm your business financially.",
        isCorrect: false,
      },
      {
        id: "customers",
        label: "Customer loyalty",
        reflection: "Customers attracted by below-cost pricing aren't loyal to your brand - they're loyal to low prices. When you raise prices, these customers typically leave for even lower prices.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the fundamental principle of pricing?",
    options: [
      {
        id: "cover",
        label: "Cover costs and generate profit",
        reflection: "Perfect! The fundamental principle of pricing is to cover all costs (including your time and effort) and generate a reasonable profit to sustain and grow your business.",
        isCorrect: true,
      },
      {
        id: "compete",
        label: "Always compete on lowest price",
        reflection: "Competing solely on price often leads to a race to the bottom. It's better to compete on value, quality, or unique offerings that justify your pricing.",
        isCorrect: false,
      },
      {
        id: "match",
        label: "Match competitors' prices exactly",
        reflection: "Matching competitors' prices exactly removes your ability to differentiate and can lead to pricing below your actual costs if competitors are pricing poorly.",
        isCorrect: false,
      },
      {
        id: "discount",
        label: "Offer frequent discounts to attract buyers",
        reflection: "Frequent discounts train customers to wait for sales rather than pay full price. This reduces revenue and can devalue your brand over time.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should you determine your pricing?",
    options: [
     
      {
        id: "guess",
        label: "Set prices based on gut feeling",
        reflection: "Pricing based on gut feeling is risky and often leads to prices that are either too high (losing customers) or too low (losing money). Data-driven pricing is more reliable.",
        isCorrect: false,
      },
      {
        id: "lowest",
        label: "Price as low as possible to gain customers",
        reflection: "Pricing as low as possible to gain customers creates a financially unsustainable business model. It's better to price appropriately and focus on customer value.",
        isCorrect: false,
      },
      {
        id: "copy",
        label: "Copy pricing from successful businesses",
        reflection: "Copying pricing from other businesses doesn't account for your unique costs, value proposition, or market position. Your pricing should reflect your specific business situation.",
        isCorrect: false,
      },
       {
        id: "cost",
        label: "Calculate all costs plus desired profit margin",
        reflection: "Excellent! Proper pricing starts with calculating all direct and indirect costs, then adding a profit margin that reflects the value you provide and your business goals.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of poor pricing discipline?",
    options: [
     
      {
        id: "profit",
        label: "Maintaining healthy profit margins",
        reflection: "Maintaining healthy profit margins is actually a sign of good pricing discipline, not poor pricing discipline. It shows you're pricing appropriately for your costs and value.",
        isCorrect: false,
      },
      {
        id: "growth",
        label: "Steady business growth",
        reflection: "Steady business growth can be positive, but it's not necessarily a warning sign of poor pricing. The key is whether that growth is profitable and sustainable.",
        isCorrect: false,
      },
       {
        id: "loss",
        label: "Consistently operating at a loss",
        reflection: "Exactly! Consistently operating at a loss is a clear warning sign that your pricing discipline is poor. It indicates you're not covering your costs or generating adequate profit.",
        isCorrect: true,
      },
      {
        id: "customers",
        label: "High customer satisfaction",
        reflection: "High customer satisfaction is generally positive and doesn't indicate poor pricing discipline. In fact, it often results from good value pricing that meets customer expectations.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the benefit of disciplined pricing?",
    options: [
     
      {
        id: "competition",
        label: "Ability to undercut all competitors",
        reflection: "The ability to undercut competitors often indicates poor pricing discipline rather than good discipline. Sustainable pricing focuses on value, not just being the cheapest.",
        isCorrect: false,
      },
       {
        id: "sustainability",
        label: "Business sustainability and growth",
        reflection: "Exactly! Disciplined pricing ensures your business can cover costs, generate profit, reinvest in growth, and weather financial challenges - creating long-term sustainability.",
        isCorrect: true,
      },
      {
        id: "volume",
        label: "Maximum sales volume regardless of profit",
        reflection: "Maximum sales volume without regard for profit is not beneficial. It's better to have sustainable sales volume at profitable prices that support business health.",
        isCorrect: false,
      },
      {
        id: "simplicity",
        label: "Simple pricing without any calculations",
        reflection: "Simple pricing without calculations often leads to poor financial outcomes. Proper pricing discipline requires understanding costs, value, and market dynamics.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = PRICING_DISCIPLINE_STAGES.length;
const successThreshold = totalStages;

const PricingDiscipline = () => {
  const location = useLocation();
  const gameId = "finance-adults-80";
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
      "How can you calculate the true cost of your products or services?",
      "What value do you provide that justifies your pricing?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = PRICING_DISCIPLINE_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);
    
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
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
      showCorrectAnswerFeedback(1, true);
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
  const stage = PRICING_DISCIPLINE_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Pricing Discipline"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={PRICING_DISCIPLINE_STAGES.length}
      currentLevel={Math.min(currentStage + 1, PRICING_DISCIPLINE_STAGES.length)}
      totalLevels={PRICING_DISCIPLINE_STAGES.length}
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
            <span>Pricing Strategy</span>
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
              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      const updatedHistory = [
                        ...history,
                        { stageId: PRICING_DISCIPLINE_STAGES[currentStage].id, isCorrect: PRICING_DISCIPLINE_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Pricing Strategy Mastery</strong>
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
              Skill unlocked: <strong>Pricing Strategy Mastery</strong>
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

export default PricingDiscipline;