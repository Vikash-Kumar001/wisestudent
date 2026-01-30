import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MULTIPLE_EMERGENCIES_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Facing repeated emergencies usually means:",
    options: [
      {
        id: "preparedness",
        label: "Lack of preparedness",
        reflection: "Exactly! Repeated emergencies usually indicate lack of preparedness. Good planning, emergency funds, and proper financial management can significantly reduce the frequency and impact of financial shocks.",
        isCorrect: true,
      },
      {
        id: "luck",
        label: "Bad luck only",
        reflection: "While bad luck can contribute to emergencies, repeated emergencies often indicate systemic issues like lack of financial planning or poor preparedness rather than just luck.",
        isCorrect: false,
      },
      
      {
        id: "control",
        label: "Things completely outside your control",
        reflection: "While some factors are beyond control, financial preparedness and good habits can mitigate many emergencies. Assuming complete lack of control prevents you from taking preventive action.",
        isCorrect: false,
      },
      {
        id: "spending",
        label: "Spending too much on unnecessary things",
        reflection: "While excessive spending can contribute to emergencies, it's not the complete picture. Even those who spend carefully can face emergencies without proper preparedness strategies in place.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's the main cause of repeated financial emergencies?",
    options: [
     
      {
        id: "wealth",
        label: "Having too much wealth to manage properly",
        reflection: "Having too much wealth isn't typically the cause of repeated emergencies. In fact, greater wealth often provides better protection against emergencies when managed properly.",
        isCorrect: false,
      },
      {
        id: "nothing",
        label: "Doing nothing about financial management",
        reflection: "While doing nothing is problematic, it's more accurate to say that lack of proper emergency preparation and planning causes repeated emergencies, even if you're actively managing other aspects of your finances.",
        isCorrect: false,
      },
       {
        id: "unprepared",
        label: "Insufficient emergency preparation and planning",
        reflection: "Perfect! Insufficient emergency preparation and planning is the main cause of repeated financial emergencies. Without proper preparation, you're vulnerable to repeated financial shocks.",
        isCorrect: true,
      },
      {
        id: "investment",
        label: "Poor investment decisions exclusively",
        reflection: "Poor investment decisions can contribute to emergencies, but they're not the main cause of repeated financial emergencies. The broader issue is inadequate preparation for various types of financial shocks.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How can you break the cycle of repeated emergencies?",
    options: [
      
      {
        id: "ignore",
        label: "Ignore financial problems and hope they stop",
        reflection: "Ignoring financial problems and hoping they stop doesn't break the cycle. It's a passive approach that allows emergencies to continue without addressing the underlying causes or improving your preparedness.",
        isCorrect: false,
      },
      {
        id: "build",
        label: "Build comprehensive emergency preparedness",
        reflection: "Excellent! Building comprehensive emergency preparedness, including adequate savings, insurance, and financial plans, helps break the cycle of repeated emergencies by providing resources and strategies for handling crises.",
        isCorrect: true,
      },
      {
        id: "blame",
        label: "Blame external circumstances entirely",
        reflection: "While external circumstances can contribute, completely blaming them prevents you from taking control and improving your financial resilience. Personal preparation and planning play crucial roles in preventing repeated emergencies.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "Take on more debt to solve current problems",
        reflection: "Taking on more debt to solve current problems often creates more financial stress and can lead to even more emergencies. It's a temporary solution that can worsen your long-term financial situation.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of poor emergency preparedness?",
    options: [
     
      {
        id: "plan",
        label: "Having a written emergency financial plan",
        reflection: "Having a written emergency financial plan is actually a sign of good preparation, not poor preparedness. It shows you're actively planning for potential financial challenges.",
        isCorrect: false,
      },
      {
        id: "fund",
        label: "Maintaining adequate emergency fund balances",
        reflection: "Maintaining adequate emergency fund balances is a positive indicator of good financial management, not a warning sign. It demonstrates that you're prepared for financial emergencies.",
        isCorrect: false,
      },
      {
        id: "insurance",
        label: "Having appropriate insurance coverage",
        reflection: "Having appropriate insurance coverage is a sign of good financial planning, not poor emergency preparedness. Insurance is a key component of comprehensive emergency preparation.",
        isCorrect: false,
      },
       {
        id: "repeat",
        label: "Frequently facing the same type of financial crisis",
        reflection: "Exactly! Frequently facing the same type of financial crisis is a clear warning sign of poor emergency preparedness. It indicates that you haven't learned from past experiences or implemented adequate preventive measures.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term benefit of proper emergency preparation?",
    options: [
      {
        id: "reduce",
        label: "Reduced frequency and impact of financial emergencies",
        reflection: "Exactly! Proper emergency preparation reduces both the frequency and impact of financial emergencies by providing resources, strategies, and resilience to handle unexpected financial challenges effectively.",
        isCorrect: true,
      },
      {
        id: "spending",
        label: "Ability to spend more freely on non-essentials",
        reflection: "Proper emergency preparation is about security and stability, not enabling more spending on non-essentials. Its value is in protection and peace of mind, not increased consumption.",
        isCorrect: false,
      },
      {
        id: "risk",
        label: "Increased willingness to take financial risks",
        reflection: "Good emergency preparation actually reduces the need to take financial risks by providing a safety net. It gives you confidence to make decisions without the pressure of immediate financial crisis.",
        isCorrect: false,
      },
      {
        id: "avoid",
        label: "Ability to completely avoid all financial problems",
        reflection: "While proper emergency preparation significantly reduces financial stress, it doesn't eliminate all financial problems. Some emergencies are unavoidable, but preparation helps you handle them better.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = MULTIPLE_EMERGENCIES_STAGES.length;
const successThreshold = totalStages;

const MultipleEmergencies = () => {
  const location = useLocation();
  const gameId = "finance-adults-89";
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
      "How can you identify patterns in your financial emergencies?",
      "What specific steps will you take to improve your emergency preparedness?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = MULTIPLE_EMERGENCIES_STAGES[currentStage];
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
  const stage = MULTIPLE_EMERGENCIES_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Multiple Emergencies"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={MULTIPLE_EMERGENCIES_STAGES.length}
      currentLevel={Math.min(currentStage + 1, MULTIPLE_EMERGENCIES_STAGES.length)}
      totalLevels={MULTIPLE_EMERGENCIES_STAGES.length}
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
            <span>Multiple Emergencies</span>
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
                        { stageId: MULTIPLE_EMERGENCIES_STAGES[currentStage].id, isCorrect: MULTIPLE_EMERGENCIES_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Multiple Emergency Management</strong>
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
              Skill unlocked: <strong>Multiple Emergency Management</strong>
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

export default MultipleEmergencies;