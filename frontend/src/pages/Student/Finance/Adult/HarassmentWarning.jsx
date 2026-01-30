import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HARASSMENT_WARNING_STAGES = [
  {
    id: 1,
    prompt: "Scenario: What should you do if a lender threatens or harasses you? ",
    options: [
      {
        id: "a",
        label: "Stay silent",
        reflection: "Staying silent allows harassment to continue and doesn't protect your rights or safety.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Pay immediately to stop the harassment",
        reflection: "Paying under duress doesn't address the harassment and may encourage more aggressive tactics.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Ignore the messages and hope it stops",
        reflection: "Ignoring harassment doesn't address the issue and allows it to potentially escalate.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Seek help and report",
        reflection: "Correct! Reporting harassment is important for stopping it and protecting your rights.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "Why is it important to document harassment from lenders?",
    options: [
      
      {
        id: "a",
        label: "It helps improve the lender's customer service",
        reflection: "Documentation is for your protection, not to improve the lender's service.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "It speeds up the loan approval process",
        reflection: "Documenting harassment doesn't affect loan approval processes.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Documentation provides evidence for legal action",
        reflection: "Exactly! Recording incidents helps authorities take appropriate action against offenders.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "It reduces the loan interest rate",
        reflection: "Interest rates aren't affected by documenting harassment incidents.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "Who can you contact if a lender is harassing you?",
    options: [
      
      {
        id: "a",
        label: "The lender's customer service department",
        reflection: "Reporting to the same organization that's harassing you is unlikely to resolve the issue.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Financial regulators, consumer protection agencies, or law enforcement",
        reflection: "Yes! These organizations have authority to address lender misconduct and harassment.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Social media influencers",
        reflection: "While raising awareness can be helpful, official authorities are the appropriate channels.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Other borrowers facing similar issues",
        reflection: "Connecting with others can provide support, but official channels are needed for resolution.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "What is the best approach to dealing with loan-related harassment?",
    options: [
      {
        id: "a",
        label: "Report it immediately and seek professional help",
        reflection: "Perfect! Taking immediate action helps protect your rights and stops the harassment.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Try to negotiate with the harassers directly",
        reflection: "Negotiating with those engaging in harassment is not advisable and may not stop it.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Wait until the harassment gets worse before acting",
        reflection: "Waiting allows harassment to continue and potentially escalate unnecessarily.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Handle it privately to avoid embarrassment",
        reflection: "Harassment should be reported to authorities rather than handled privately.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "What should you do if lenders contact your family or friends about your debt?",
    options: [
     
      {
        id: "a",
        label: "Pay the debt immediately to stop the contact",
        reflection: "Paying under pressure doesn't address the illegal contact and may encourage more.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Tell your family/friends not to answer calls",
        reflection: "While this might reduce contact, the harassment continues and should be reported.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Change your phone number and ignore it",
        reflection: "Avoiding the issue doesn't address the illegal behavior; reporting is necessary.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Report the violation as this is often prohibited",
        reflection: "Correct! Contacting third parties about your debt is often illegal and should be reported.",
        isCorrect: true,
      },
    ],
    reward: 3,
  },
];

const totalStages = HARASSMENT_WARNING_STAGES.length;
const successThreshold = totalStages;

const HarassmentWarning = () => {
  const location = useLocation();
  const gameId = "finance-adults-64";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 3;
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
      "What steps should you take if you experience harassment from lenders?",
      "How can you protect your rights when facing loan-related harassment?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = HARASSMENT_WARNING_STAGES[currentStage];
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
      setCoins(prevCoins => prevCoins + 3); // 3 coins per correct answer
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
        setCoins(passed ? totalCoins : Math.floor(totalCoins * correctCount / totalStages)); // Proportional coins based on performance
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
  const stage = HARASSMENT_WARNING_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Harassment Warning"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={HARASSMENT_WARNING_STAGES.length}
      currentLevel={Math.min(currentStage + 1, HARASSMENT_WARNING_STAGES.length)}
      totalLevels={HARASSMENT_WARNING_STAGES.length}
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
            <span>Consumer Rights</span>
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
                        { stageId: HARASSMENT_WARNING_STAGES[currentStage].id, isCorrect: HARASSMENT_WARNING_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
                      ];
                      const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
                      const passed = correctCount === successThreshold;
                      setFinalScore(correctCount);
                      setCoins(passed ? totalCoins : Math.floor(totalCoins * correctCount / totalStages));
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
                    Skill unlocked: <strong>Harassment Response Awareness</strong>
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
              Skill unlocked: <strong>Harassment Response Awareness</strong>
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

export default HarassmentWarning;