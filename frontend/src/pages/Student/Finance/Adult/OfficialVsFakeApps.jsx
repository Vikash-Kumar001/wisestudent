import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const OFFICIAL_VS_FAKE_APPS_STAGES = [
  {
    id: 1,
    prompt: "Scenario: How do you identify a safer app?",
    options: [
      {
        id: "a",
        label: "Random download link",
        reflection: "Random download links are often sources of fake or malicious apps that can compromise your security.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Official app store + verified developer",
        reflection: "Correct! Official app stores have verification processes and verified developers are more trustworthy.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Most downloaded app",
        reflection: "Most downloaded doesn't guarantee safety; fake apps can also gain downloads through manipulation.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Best rated app",
        reflection: "Ratings can be manipulated; official sources and verified developers are more reliable indicators.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 2,
    prompt: "What is the safest way to download a financial app?",
    options: [
      {
        id: "a",
        label: "From official app stores like Google Play or Apple App Store",
        reflection: "Exactly! Official app stores have security measures to verify app authenticity and safety.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "From third-party websites offering faster downloads",
        reflection: "Third-party sites may host modified or malicious versions of the app.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "From social media links shared by friends",
        reflection: "Links shared on social media could lead to fake or malicious apps.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Directly from the company's website",
        reflection: "While company websites may be legitimate, official app stores provide additional verification layers.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 3,
    prompt: "What should you look for to verify a financial app's authenticity?",
    options: [
      {
        id: "a",
        label: "Verified developer badge and official company name",
        reflection: "Perfect! Verified developer badges and official company names help confirm authenticity.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Number of downloads only",
        reflection: "Download numbers don't guarantee authenticity; verification factors are more important.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "High ratings only",
        reflection: "Ratings can be manipulated; verified developer status is a more reliable indicator.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Colorful app icon",
        reflection: "Visual appearance doesn't indicate authenticity; verification markers are what matter.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 4,
    prompt: "Why might an official app store be safer than alternative sources?",
    options: [
     
      {
        id: "a",
        label: "They always provide free apps",
        reflection: "Official stores contain both free and paid apps; cost doesn't indicate safety.",
        isCorrect: false,
      },
       {
        id: "b",
        label: "They have review processes and security checks for apps",
        reflection: "Yes! Official stores review apps and check for known security threats before listing them.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "They have more apps available",
        reflection: "Quantity of apps doesn't indicate safety; verification processes do.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "They have better graphics",
        reflection: "Visual quality doesn't indicate safety; verification processes and developer checks do.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
  {
    id: 5,
    prompt: "What is the best approach to avoid fake financial apps?",
    options: [
      
      {
        id: "a",
        label: "Search for the app name online and download from the first link",
        reflection: "The first search result may be a fake site hosting malicious apps.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Download any app with the company's logo",
        reflection: "Logos can be copied; official stores and verified developers are more reliable indicators.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Only download from official app stores and verify developer identity",
        reflection: "Excellent! This combination provides the best protection against fake financial apps.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Choose the app with the most positive reviews",
        reflection: "Reviews can be fabricated; official verification is more reliable than review counts.",
        isCorrect: false,
      },
    ],
    reward: 3,
  },
];

const totalStages = OFFICIAL_VS_FAKE_APPS_STAGES.length;
const successThreshold = totalStages;

const OfficialVsFakeApps = () => {
  const location = useLocation();
  const gameId = "finance-adults-61";
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
      "How can you verify the authenticity of financial apps before downloading?",
      "What indicators should you look for to ensure app safety?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = OFFICIAL_VS_FAKE_APPS_STAGES[currentStage];
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
  const stage = OFFICIAL_VS_FAKE_APPS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Official vs Fake Apps"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={OFFICIAL_VS_FAKE_APPS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, OFFICIAL_VS_FAKE_APPS_STAGES.length)}
      totalLevels={OFFICIAL_VS_FAKE_APPS_STAGES.length}
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
            <span>App Verification</span>
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
                        { stageId: OFFICIAL_VS_FAKE_APPS_STAGES[currentStage].id, isCorrect: OFFICIAL_VS_FAKE_APPS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>App Authentication Awareness</strong>
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
              Skill unlocked: <strong>App Authentication Awareness</strong>
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

export default OfficialVsFakeApps;