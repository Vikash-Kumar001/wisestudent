import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FAIR_USE_OF_MONEY_STAGES = [
  {
    id: 1,
    prompt: "Using money meant for fees or rent for shopping is:",
    options: [
      {
        id: "a",
        label: "Acceptable",
        reflection: "Using money designated for essential expenses like fees or rent for shopping is financially irresponsible. This misallocation of funds can lead to missed payments, late fees, damaged credit, and potential eviction or loss of services. Essential expenses should always take priority over discretionary spending.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Irresponsible",
        reflection: "Exactly! Misusing funds creates future problems. Diverting money meant for essential expenses like fees or rent to shopping demonstrates poor financial planning and can result in serious consequences including late fees, damaged credit, housing instability, and additional financial stress.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "A good way to treat yourself",
        reflection: "While treating yourself is important for mental well-being, it should never come at the expense of essential obligations. True self-care involves maintaining financial stability, which provides the foundation for enjoying discretionary purchases without creating harmful consequences.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Only problematic if you do it frequently",
        reflection: "Even occasional misuse of essential funds can create significant problems. Missing even one rent or fee payment can result in late fees, credit damage, and potential loss of housing or services. Financial responsibility requires consistent prioritization of essential expenses.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What's the best approach to budgeting for both needs and wants?",
    options: [
      {
        id: "a",
        label: "Allocate funds for needs first, then discretionary spending",
        reflection: "Exactly! This fundamental budgeting principle ensures essential expenses are covered before allocating money to wants. This approach prevents financial crises, maintains stability, and creates a foundation for achieving both short-term satisfaction and long-term financial goals.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Spend on wants first, then see what's left for needs",
        reflection: "Spending on wants before needs creates a high risk of not having sufficient funds for essential expenses. This approach often leads to missed payments, debt accumulation, and financial stress that can undermine overall well-being and future opportunities.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Mix needs and wants together in one spending pool",
        reflection: "Combining needs and wants in a single spending pool makes it difficult to track whether essential expenses are being met. This lack of structure often leads to overspending on discretionary items and insufficient funds for necessities, creating financial instability.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Only budget for needs and save wants for special occasions",
        reflection: "While focusing on needs is important, completely eliminating discretionary spending can lead to burnout and unsustainable financial habits. A balanced approach allocates reasonable amounts for both needs and wants, ensuring financial stability while maintaining quality of life.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How should you handle situations where wants exceed available funds?",
    options: [
     
      {
        id: "a",
        label: "Use credit cards to cover the difference",
        reflection: "Using credit cards to cover discretionary spending when funds are limited creates unnecessary debt and interest costs. This approach can lead to a cycle of debt that becomes increasingly difficult to manage and can compromise your ability to meet essential expenses.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Borrow from friends or family to maintain your lifestyle",
        reflection: "Borrowing from friends or family to maintain discretionary spending can strain relationships and create financial obligations that may be difficult to fulfill. This approach doesn't address the underlying budgeting issue and can lead to ongoing dependency on others for non-essential expenses.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Skip essential payments to fund your wants",
        reflection: "Skipping essential payments to fund discretionary spending creates serious financial and legal consequences. This approach can result in damaged credit, late fees, loss of housing or services, and long-term financial instability that far outweighs any short-term satisfaction from wants.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Postpone discretionary spending until you can afford it",
        reflection: "Exactly! Postponing discretionary spending when funds are limited demonstrates financial discipline and ensures essential needs are met. This approach builds good habits, prevents debt accumulation, and creates a sustainable path to enjoying wants without financial stress.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What's the relationship between financial discipline and long-term goals?",
    options: [
     
      {
        id: "a",
        label: "Strict budgeting prevents you from enjoying life now",
        reflection: "Responsible budgeting doesn't prevent enjoyment of life - it ensures that enjoyment is sustainable. By meeting essential needs first and then allocating reasonable amounts for wants, you can enjoy both immediate satisfaction and work toward meaningful long-term goals without financial stress.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "You should focus on goals only after all wants are satisfied",
        reflection: "Waiting to focus on goals until all wants are satisfied creates a cycle where goals are perpetually delayed. This approach often leads to insufficient progress on important objectives and can result in missed opportunities for building wealth and achieving financial security.",
        isCorrect: false,
      },
       {
        id: "c",
        label: "Consistent prioritization of needs over wants enables goal achievement",
        reflection: "Exactly! Misusing funds creates future problems. Consistent financial discipline in prioritizing needs over wants builds the stability and resources necessary to achieve long-term goals. This approach creates a foundation for wealth building, reduces financial stress, and opens opportunities for meaningful discretionary spending.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Financial discipline is only important for wealthy people",
        reflection: "Financial discipline is crucial for people at all income levels. Those with limited resources benefit most from disciplined spending habits, as they have less margin for error when essential expenses compete with discretionary spending. Good financial habits create stability and opportunities regardless of current income.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's a healthy approach to managing unexpected windfalls?",
    options: [
      
      {
        id: "a",
        label: "Spend it all on wants since it was unexpected",
        reflection: "Spending unexpected windfalls entirely on wants misses opportunities to address essential needs or build financial security. This approach can create regret when the windfall could have solved pressing problems or created long-term benefits, and may lead to financial instability when the money is gone.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Allocate portions to needs, savings, and reasonable wants",
        reflection: "Exactly! This balanced approach to windfalls ensures immediate needs are met, builds financial security through savings, and allows for some enjoyment of the unexpected gain. This strategy prevents the common mistake of spending windfalls entirely on wants while ignoring important financial priorities.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Ignore the windfall and continue with your regular budget",
        reflection: "Ignoring windfalls entirely means missing opportunities to improve your financial situation. While maintaining budget discipline is important, windfalls provide unique chances to address deferred needs, build emergency funds, or make progress on important financial goals that might otherwise take much longer to achieve.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Use it all for essential expenses even if they're already covered",
        reflection: "Using windfalls entirely for essential expenses that are already covered doesn't maximize the benefit of the unexpected gain. While ensuring needs are met is important, windfalls offer opportunities to build financial security, address deferred goals, or enjoy some discretionary spending that enhances quality of life.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const totalStages = FAIR_USE_OF_MONEY_STAGES.length;
const successThreshold = totalStages;

const FairUseOfMoney = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-94";
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
      "What budgeting habits help you prioritize essential expenses?",
      "How can you better balance needs and wants in your spending?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FAIR_USE_OF_MONEY_STAGES[currentStage];
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
  const stage = FAIR_USE_OF_MONEY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Fair Use of Money"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FAIR_USE_OF_MONEY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FAIR_USE_OF_MONEY_STAGES.length)}
      totalLevels={FAIR_USE_OF_MONEY_STAGES.length}
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
            <span>Fair Use of Money</span>
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
                        { stageId: FAIR_USE_OF_MONEY_STAGES[currentStage].id, isCorrect: FAIR_USE_OF_MONEY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Financial prioritization</strong>
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
              Skill unlocked: <strong>Financial prioritization</strong>
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

export default FairUseOfMoney;