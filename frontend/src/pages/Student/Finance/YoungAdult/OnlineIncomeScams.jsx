import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ONLINE_INCOME_SCAMS_STAGES = [
  {
    id: 1,
    prompt: "“Easy money online” usually means:",
    options: [
      {
        id: "a",
        label: "Genuine opportunity",
        reflection: "Genuine opportunities typically require effort, time, and sometimes initial investment. 'Easy money' claims should be viewed with skepticism.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Quick investment returns",
        reflection: "Promises of quick returns on investments are often associated with fraudulent schemes that can lead to significant financial losses.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "New technology opportunities",
        reflection: "While new technologies create real opportunities, they're rarely 'easy money'. Legitimate opportunities still require effort and due diligence.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Scam or exploitation",
        reflection: "Exactly! 'Easy money' claims are major red flags. Legitimate income opportunities require work, skills, and realistic expectations.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What should you do when you see 'Get rich quick' ads?",
    options: [
      {
        id: "a",
        label: "Click and sign up immediately",
        reflection: "Clicking on such ads immediately is risky. Legitimate opportunities don't pressure you to act instantly without proper research.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Research thoroughly before engaging",
        reflection: "Perfect! Thorough research, including checking company credentials, reviews, and talking to trusted advisors, helps you avoid scams.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Share with friends",
        reflection: "Sharing suspicious opportunities can potentially harm your friends financially. It's better to research first and then provide informed advice.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Ignore all online income opportunities",
        reflection: "While caution is important, ignoring all online opportunities can cause you to miss legitimate ones. The key is knowing how to evaluate them properly.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "What's a warning sign of an online income scam?",
    options: [
      {
        id: "a",
        label: "Professional website design",
        reflection: "Professional design doesn't guarantee legitimacy. Scammers often create professional-looking websites to appear credible.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Customer service chat",
        reflection: "Having customer service doesn't make an opportunity legitimate. Scammers often provide 'customer service' to appear trustworthy and pressure victims into compliance.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Requests for upfront payment",
        reflection: "Exactly! Requiring upfront payment for promised returns is a classic scam tactic. Legitimate businesses earn money through their services, not from upfront fees.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Testimonials on website",
        reflection: "Testimonials can be easily fabricated or stolen. Don't rely on website testimonials alone; verify independently and check multiple sources.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "How can you protect yourself from online scams?",
    options: [
      {
        id: "a",
        label: "Verify company legitimacy",
        reflection: "Excellent! Verifying through official sources, business registration, professional contacts, and independent reviews is crucial for identifying legitimate opportunities.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Never share personal information",
        reflection: "While protecting personal information is important, some legitimate opportunities do require information sharing. The key is being selective about what you share and with whom.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Only trust large corporations",
        reflection: "While larger, established companies may be more reliable, small legitimate businesses also exist. Size alone isn't a reliable indicator of legitimacy.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Avoid all remote work",
        reflection: "Remote work and online opportunities are legitimate and growing. The goal is to identify legitimate ones, not to avoid all online opportunities entirely.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's the reality about online income opportunities?",
    options: [
      {
        id: "a",
        label: "Most require little effort for big returns",
        reflection: "Most legitimate income opportunities require effort, skills, and time investment. The 'little effort, big returns' premise is a key scam indicator.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Success guarantees quick wealth",
        reflection: "Quick wealth guarantees are red flags. Even legitimate opportunities face market conditions, competition, and learning phases that affect results.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "You don't need to verify legitimacy",
        reflection: "Verification is essential for online opportunities. Without proper research, you're essentially gambling with your money and personal information.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Legitimate ones require real work and time",
        reflection: "Perfect! Genuine online income opportunities involve real effort, learning curves, and time investment. They reward persistence and skill development, not just signing up.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
];

const totalStages = ONLINE_INCOME_SCAMS_STAGES.length;
const successThreshold = totalStages;

const OnlineIncomeScams = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-78";
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
      "What verification steps do you typically take before engaging with online income opportunities?",
      "How can you distinguish between legitimate work-from-home jobs and online scams?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = ONLINE_INCOME_SCAMS_STAGES[currentStage];
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
  const stage = ONLINE_INCOME_SCAMS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Online Income Scams"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={ONLINE_INCOME_SCAMS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, ONLINE_INCOME_SCAMS_STAGES.length)}
      totalLevels={ONLINE_INCOME_SCAMS_STAGES.length}
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
            <span>Online Income</span>
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
                        { stageId: ONLINE_INCOME_SCAMS_STAGES[currentStage].id, isCorrect: ONLINE_INCOME_SCAMS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Online scam detection</strong>
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
              Skill unlocked: <strong>Online scam detection</strong>
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

export default OnlineIncomeScams;