import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BNPL_AWARENESS_STAGES = [
  {
    id: 1,
    prompt: "You're buying a ₹5,000 phone online and see a 'Buy Now Pay Later' option. What does BNPL actually represent?",
    options: [
      {
        id: "free-money",
        label: "Free money to spend without immediate cost",
        reflection: "BNPL is not free money - it's borrowed money that must be repaid, often with interest or fees.",
        isCorrect: false,
      },
     
      {
        id: "instant-purchase",
        label: "Instant purchase with no financial obligations",
        reflection: "BNPL creates financial obligations - you must repay the amount within the specified timeframe.",
        isCorrect: false,
      },
      {
        id: "credit-card",
        label: "Same as a credit card with no interest",
        reflection: "BNPL can be interest-free if paid on time, but late payments can result in fees and impact your credit score.",
        isCorrect: false,
      },
       {
        id: "deferred-payment",
        label: "Deferred payment that must be repaid on schedule",
        reflection: "Exactly! BNPL is essentially a short-term loan that requires repayment according to the agreed schedule.",
        isCorrect: true,
      },
    ],
    reward: 15,
  },
  {
    id: 2,
    prompt: "When does Buy Now Pay Later work best for your financial situation?",
    options: [
      {
        id: "frequent-use",
        label: "Used frequently for all purchases",
        reflection: "Frequent use of BNPL can lead to overspending and accumulating multiple payment obligations that become difficult to manage.",
        isCorrect: false,
      },
      {
        id: "rare-understanding",
        label: "Used rarely with full understanding",
        reflection: "Correct! BNPL should be used strategically with clear understanding of the repayment terms and only for planned purchases.",
        isCorrect: true,
      },
      {
        id: "impulse-shopping",
        label: "Used for impulse shopping to avoid cash payments",
        reflection: "Using BNPL for impulse purchases can lead to financial stress and debt accumulation when you don't have the funds to repay.",
        isCorrect: false,
      },
      {
        id: "monthly-subscription",
        label: "Used as a monthly subscription service",
        reflection: "BNPL is meant for individual purchases, not ongoing subscription services - that's what credit cards or direct debits are for.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 3,
    prompt: "What's the hidden risk of using multiple BNPL services simultaneously?",
    options: [
      {
        id: "no-risk",
        label: "There's no risk if you're organized",
        reflection: "Multiple BNPL obligations can become overwhelming even with good organization, leading to missed payments and fees.",
        isCorrect: false,
      },
     
      {
        id: "convenience",
        label: "It's more convenient than using one payment method",
        reflection: "While convenient, the scattered nature of multiple BNPL services can make it harder to track and manage your total obligations.",
        isCorrect: false,
      },
       {
        id: "debt-accumulation",
        label: "It can quietly accumulate debt across platforms",
        reflection: "Exactly! Multiple BNPL services can create scattered debt obligations that are easy to lose track of, leading to missed payments.",
        isCorrect: true,
      },
      {
        id: "credit-score",
        label: "It improves your credit score automatically",
        reflection: "BNPL services don't necessarily report to credit bureaus, so they may not help build your credit score as effectively as traditional credit.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 4,
    prompt: "What happens if you miss a BNPL payment deadline?",
    options: [
      {
        id: "fees-penalties",
        label: "You face late fees and potential credit impact",
        reflection: "Correct! Missed BNPL payments can result in significant fees, interest charges, and negative reporting to credit bureaus.",
        isCorrect: true,
      },
      {
        id: "no-consequences",
        label: "Nothing happens - it's very flexible",
        reflection: "BNPL services have strict payment deadlines, and missing them can result in late fees, interest charges, and damage to your credit score.",
        isCorrect: false,
      },
      
      {
        id: "extension",
        label: "You automatically get an extension",
        reflection: "Extensions are not automatic and usually require contacting the service provider, often with additional fees or conditions.",
        isCorrect: false,
      },
      {
        id: "reminder",
        label: "You just get a friendly reminder",
        reflection: "While reminders are sent, they don't prevent the consequences of missed payments, which can be severe.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
  {
    id: 5,
    prompt: "What's the best practice for managing BNPL responsibly?",
    options: [
      {
        id: "multiple-services",
        label: "Use multiple BNPL services for different purchases",
        reflection: "Using multiple services increases complexity and the risk of missing payments or accumulating unmanageable debt.",
        isCorrect: false,
      },
      {
        id: "single-service",
        label: "Use one BNPL service and track payments carefully",
        reflection: "Excellent! Using one service makes it easier to track your obligations and avoid the complexity of managing multiple payment schedules.",
        isCorrect: true,
      },
      {
        id: "automatic-payments",
        label: "Set up automatic payments to avoid thinking about it",
        reflection: "While automatic payments can help, you should still monitor your BNPL usage to ensure you're not overspending.",
        isCorrect: false,
      },
      {
        id: "minimum-payments",
        label: "Make minimum payments and worry about the rest later",
        reflection: "BNPL typically requires full payment by the deadline - there's no minimum payment option like with credit cards.",
        isCorrect: false,
      },
    ],
    reward: 15,
  },
];

const totalStages = BNPL_AWARENESS_STAGES.length;
const successThreshold = totalStages;

const BNPLAwareness = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-56";
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
      "How can you use BNPL strategically without falling into the debt trap?",
      "What systems can you put in place to track BNPL obligations effectively?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = BNPL_AWARENESS_STAGES[currentStage];
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
  const stage = BNPL_AWARENESS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="BNPL Awareness"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={BNPL_AWARENESS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, BNPL_AWARENESS_STAGES.length)}
      totalLevels={BNPL_AWARENESS_STAGES.length}
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
            <span>BNPL Awareness</span>
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
                        { stageId: BNPL_AWARENESS_STAGES[currentStage].id, isCorrect: BNPL_AWARENESS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>BNPL responsibility</strong>
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
              Skill unlocked: <strong>BNPL responsibility</strong>
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

export default BNPLAwareness;