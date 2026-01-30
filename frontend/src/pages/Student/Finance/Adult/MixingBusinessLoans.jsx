import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MIXING_BUSINESS_LOANS_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Using a personal loan for business causes:",
    options: [
      {
        id: "noissue",
        label: "No issue",
        reflection: "Using personal loans for business creates several complications. It can blur financial boundaries and make tracking difficult.",
        isCorrect: false,
      },
     
      {
        id: "benefit",
        label: "Better financial flexibility",
        reflection: "While it might seem flexible, mixing loan purposes actually reduces financial clarity and control, making it harder to manage your finances effectively.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "Savings on interest rates",
        reflection: "Personal and business loans typically have different interest rates for good reasons. Mixing them doesn't save money and can actually increase costs.",
        isCorrect: false,
      },
       {
        id: "confusion",
        label: "Confusion and repayment problems",
        reflection: "Exactly! Mixing personal and business loans leads to confusion about what you owe for what purpose, making repayment management challenging.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the main problem with mixing loan purposes?",
    options: [
      {
        id: "tracking",
        label: "Difficulty tracking expenses and repayments",
        reflection: "Correct! When personal and business loans are mixed, it becomes nearly impossible to track which expenses belong to which loan, leading to financial chaos.",
        isCorrect: true,
      },
      {
        id: "convenience",
        label: "Increased convenience in payments",
        reflection: "Mixing loans actually makes payments more complicated, not more convenient. You lose the ability to manage each loan purpose separately.",
        isCorrect: false,
      },
      {
        id: "flexibility",
        label: "More flexibility in fund usage",
        reflection: "While mixing might seem to offer flexibility, it actually reduces financial discipline and makes it harder to allocate funds appropriately for each purpose.",
        isCorrect: false,
      },
      {
        id: "savings",
        label: "Cost savings on loan processing",
        reflection: "There are no cost savings in mixing loan purposes. In fact, it can lead to higher costs due to mismanagement and potential penalties.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How should you manage personal and business loans?",
    options: [
      
      {
        id: "mix",
        label: "Mix them for better fund utilization",
        reflection: "Mixing loans for fund utilization creates more problems than it solves. It leads to financial confusion and makes it hard to assess the true cost of each endeavor.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the distinction between them",
        reflection: "Ignoring the distinction between personal and business loans leads to financial mismanagement and can result in serious problems with both personal and business finances.",
        isCorrect: false,
      },
      {
        id: "separate",
        label: "Keep them completely separate",
        reflection: "Perfect! Keeping personal and business loans separate ensures clear financial management, easier tracking, and better decision-making for each purpose.",
        isCorrect: true,
      },
      {
        id: "combine",
        label: "Combine them into one large loan",
        reflection: "Combining personal and business loans into one large loan removes the ability to manage each purpose separately and increases financial risk.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of loan purpose mixing?",
    options: [
      
      {
        id: "organization",
        label: "Well-organized financial records",
        reflection: "Well-organized financial records indicate proper separation, not mixing. If your records are clear, you're likely managing loans appropriately.",
        isCorrect: false,
      },
      {
        id: "confusion",
        label: "Unclear which loan pays for what expense",
        reflection: "Exactly! When you can't clearly identify which loan is responsible for which expense, it's a clear sign that you're mixing loan purposes inappropriately.",
        isCorrect: true,
      },
      {
        id: "clarity",
        label: "Clear distinction between loan purposes",
        reflection: "Clear distinction between loan purposes is the opposite of mixing. This indicates good financial management practices.",
        isCorrect: false,
      },
      {
        id: "balance",
        label: "Balanced repayment schedule",
        reflection: "A balanced repayment schedule can exist with properly separated loans. The issue with mixing is the lack of clarity, not necessarily the repayment amounts.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term impact of mixing loan purposes?",
    options: [
       {
        id: "risk",
        label: "Increased financial risk and instability",
        reflection: "Exactly! Mixing loan purposes increases risk by creating financial entanglement that makes it difficult to assess the true financial health of both personal and business finances.",
        isCorrect: true,
      },
      {
        id: "growth",
        label: "Business growth and personal wealth",
        reflection: "Mixing loan purposes typically hinders rather than helps growth. It creates financial confusion that can negatively impact both business and personal finances.",
        isCorrect: false,
      },
     
      {
        id: "simplicity",
        label: "Simplified financial management",
        reflection: "Mixing actually complicates financial management by removing clear boundaries and making it difficult to track and control spending for each purpose.",
        isCorrect: false,
      },
      {
        id: "control",
        label: "Better control over all finances",
        reflection: "Better control comes from separation and clear boundaries, not from mixing. When loans are mixed, control over individual financial purposes is lost.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = MIXING_BUSINESS_LOANS_STAGES.length;
const successThreshold = totalStages;

const MixingBusinessLoans = () => {
  const location = useLocation();
  const gameId = "finance-adults-78";
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
      "How can you maintain clear boundaries between personal and business finances?",
      "What systems will you put in place to prevent loan purpose mixing?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = MIXING_BUSINESS_LOANS_STAGES[currentStage];
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
  const stage = MIXING_BUSINESS_LOANS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Mixing Business Loans"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={MIXING_BUSINESS_LOANS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, MIXING_BUSINESS_LOANS_STAGES.length)}
      totalLevels={MIXING_BUSINESS_LOANS_STAGES.length}
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
              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      const updatedHistory = [
                        ...history,
                        { stageId: MIXING_BUSINESS_LOANS_STAGES[currentStage].id, isCorrect: MIXING_BUSINESS_LOANS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Loan Purpose Management</strong>
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
              Skill unlocked: <strong>Loan Purpose Management</strong>
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

export default MixingBusinessLoans;