import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PREPAREDNESS_SCENARIOS = [
  {
    id: 1,
    prompt: "Scenario: You discover a major leak in your apartment that needs immediate repair, estimated at $1,500.",
    options: [
      {
        id: "panic",
        label: "Panic and immediately take out a high-interest loan",
        reflection: "Panic borrowing for home repairs creates unnecessary debt. It's better to assess your emergency fund, insurance coverage, and payment plan options before making any financial decisions.",
        isCorrect: false,
      },
      
      {
        id: "ignore",
        label: "Ignore it hoping it will resolve itself",
        reflection: "Ignoring home repair needs can lead to much larger problems and costs down the line. Even small leaks can cause significant damage if not addressed promptly.",
        isCorrect: false,
      },
      {
        id: "spend",
        label: "Spend on temporary fixes to delay the real problem",
        reflection: "Temporary fixes often waste money while delaying proper repairs. It's better to address the root cause systematically with proper financial planning.",
        isCorrect: false,
      },
      {
        id: "assess",
        label: "Assess emergency fund, check insurance, and create a payment plan",
        reflection: "Exactly! Assessing your resources first, checking insurance coverage, and creating a realistic payment plan shows good emergency preparedness and prevents unnecessary debt.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "Scenario: You lose your job unexpectedly and have two weeks of income replacement before unemployment benefits begin.",
    options: [
     
      {
        id: "lifestyle",
        label: "Maintain your current lifestyle and emergency fund spending",
        reflection: "Maintaining your current lifestyle during job loss quickly depletes emergency funds. It's essential to adjust spending to match your reduced income period.",
        isCorrect: false,
      },
      {
        id: "debt",
        label: "Take on new credit cards to maintain lifestyle temporarily",
        reflection: "Taking on new credit card debt during job loss creates additional financial obligations right when you can least afford them. This approach increases financial stress significantly.",
        isCorrect: false,
      },
       {
        id: "budget",
        label: "Review and reduce essential expenses to extend emergency fund coverage",
        reflection: "Perfect! Reviewing and adjusting essential expenses to make your emergency fund last longer is smart financial management during temporary income loss.",
        isCorrect: true,
      },
      {
        id: "desperate",
        label: "Take any job immediately regardless of pay or fit",
        reflection: "While employment is important, taking any job immediately might not be the best long-term strategy. It's worth balancing immediate needs with reasonable career considerations.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "Scenario: Unexpected major medical expense of $3,000 that your insurance partially covers ($1,500 out of pocket).",
    options: [
      
      {
        id: "immediate",
        label: "Put the full amount on a credit card to pay immediately",
        reflection: "Putting a large medical expense immediately on credit card creates unnecessary debt. Even with insurance coverage, it's better to use available savings and budget for the remaining costs.",
        isCorrect: false,
      },
      {
        id: "planned",
        label: "Use dedicated medical savings first, then emergency fund if needed",
        reflection: "Excellent! Using dedicated medical savings first and then the emergency fund is the planned approach that minimizes the need for credit while properly allocating your prepared resources.",
        isCorrect: true,
      },
      {
        id: "payment",
        label: "Set up a payment plan with the medical provider",
        reflection: "Setting up a payment plan with the medical provider is actually a good strategy that avoids debt while ensuring you get proper care. Many providers offer interest-free payment options.",
        isCorrect: false,
      },
      {
        id: "postpone",
        label: "Postpone non-emergency treatment to avoid immediate costs",
        reflection: "Postponing necessary medical treatment can lead to worse health outcomes and higher costs later. It's better to use prepared funds or arrange payments for required medical care.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "Scenario: Car breaks down requiring $2,000 repair that affects your ability to work and commute.",
    options: [
      {
        id: "evaluate",
        label: "Evaluate cost vs. replacement value and use transportation budget",
        reflection: "Perfect! Evaluating the repair cost versus car replacement value and using your designated transportation budget shows good financial judgment and proper emergency planning.",
        isCorrect: true,
      },
      {
        id: "loan",
        label: "Immediately finance a new car or take out auto repair loan",
        reflection: "Immediately financing a new car or taking an auto repair loan can lead to multiple large payments during an emergency. It's better to assess your budget and make a well-informed decision.",
        isCorrect: false,
      },
      {
        id: "scrap",
        label: "Scrap the car immediately and find alternative transport",
        reflection: "Scrapping the car immediately without considering the repair costs and alternatives might not be the most economical choice. Sometimes repairs are more cost-effective than replacement.",
        isCorrect: false,
      },
      {
        id: "ignore",
        label: "Ignore the problem and hope for the best",
        reflection: "Ignoring car problems that affect your ability to work can lead to job loss and much larger financial problems. Transportation is often essential for maintaining income.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "Scenario: Family emergency requires immediate travel and $800 in unexpected costs.",
    options: [
      
      {
        id: "credit",
        label: "Put all travel costs on credit cards to handle immediately",
        reflection: "Putting all travel costs on credit cards creates debt that compounds your financial stress during an already difficult time. It's better to use prepared funds and budget carefully.",
        isCorrect: false,
      },
      {
        id: "borrow",
        label: "Borrow from family or friends to cover immediate costs",
        reflection: "While borrowing from family or friends might seem helpful, it can strain relationships and create obligations. It's better to use your own prepared emergency funds when available.",
        isCorrect: false,
      },
      {
        id: "minimum",
        label: "Travel with minimum essentials to reduce costs",
        reflection: "Traveling with minimum essentials might reduce costs but could be inadequate for handling the family emergency properly. It's important to balance cost considerations with the actual needs of the situation.",
        isCorrect: false,
      },
      {
        id: "emergency",
        label: "Use emergency fund allocation and adjust other budget categories",
        reflection: "Exactly! Using emergency fund allocation and adjusting other budget categories shows good financial planning and ensures you can handle the emergency without creating additional debt.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
];

const totalStages = PREPAREDNESS_SCENARIOS.length;
const successThreshold = totalStages;

const EmergencyPreparednessCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-adults-92";
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
      "How can you build a comprehensive emergency preparedness plan?",
      "What specific scenarios should you prepare for based on your life situation?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = PREPAREDNESS_SCENARIOS[currentStage];
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
  const stage = PREPAREDNESS_SCENARIOS[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Emergency Preparedness Checkpoint"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={PREPAREDNESS_SCENARIOS.length}
      currentLevel={Math.min(currentStage + 1, PREPAREDNESS_SCENARIOS.length)}
      totalLevels={PREPAREDNESS_SCENARIOS.length}
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
            <span>Emergency Preparedness</span>
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
                        { stageId: PREPAREDNESS_SCENARIOS[currentStage].id, isCorrect: PREPAREDNESS_SCENARIOS[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Emergency Preparedness Mastery</strong>
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
              Skill unlocked: <strong>Emergency Preparedness Mastery</strong>
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
            {hasPassed && (
              <div className="mt-4 p-4 bg-emerald-500/20 border border-emerald-400 rounded-2xl">
                <p className="text-emerald-300 font-semibold text-center">
                  You are now prepared to face financial shocks without panic borrowing.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmergencyPreparednessCheckpoint;