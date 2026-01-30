import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PUBLIC_DEVICE_RISK_STAGES = [
  {
    id: 1,
    prompt: "Is it safe to log into banking apps on shared devices?",
    options: [
      {
        id: "a",
        label: "Yes",
        reflection: "Logging into banking apps on shared devices is risky because these devices may have malware, keyloggers, or other security threats that can capture your login credentials and personal financial information.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "No, it risks data theft",
        reflection: "Exactly! Shared devices compromise security by potentially exposing your login credentials, personal information, and financial data to unauthorized access, malware, or keyloggers that can capture sensitive information.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Only if you trust the device owner",
        reflection: "Trust alone isn't sufficient protection when using shared devices. Even trusted devices can be compromised by malware, and the device owner may not be aware of security vulnerabilities or malicious software installed on their device.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Yes, if you log out afterward",
        reflection: "Simply logging out doesn't guarantee your data is secure on shared devices. Cached data, cookies, and other stored information can still be accessed by others, and keyloggers can capture your credentials even if you log out properly.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What's the main security risk of using public computers for banking?",
    options: [
      {
        id: "a",
        label: "Slow internet connection",
        reflection: "While slow internet can be inconvenient, it's not a security risk for your financial data. The main concerns with public computers are related to data capture and unauthorized access, not connection speed.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Limited browser compatibility",
        reflection: "Browser compatibility issues might affect functionality but don't pose a direct security threat to your financial data. The real risks come from malicious software and unauthorized access to your personal information.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "High usage fees",
        reflection: "Usage fees are a cost consideration, not a security risk. The primary security concerns with public computers involve data capture and unauthorized access to your financial information, not the cost of using the device.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Keyloggers and malware",
        reflection: "Exactly! Public computers often have keyloggers and malware installed that can capture your keystrokes, login credentials, and other sensitive information you enter, making them extremely dangerous for financial transactions.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How can you protect your banking information on shared devices?",
    options: [
      {
        id: "a",
        label: "Use incognito mode only",
        reflection: "While incognito mode prevents some data from being stored locally, it doesn't protect against keyloggers, malware, or network monitoring. These threats can still capture your credentials and financial information even in private browsing mode.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Change passwords frequently",
        reflection: "Changing passwords frequently is good practice but doesn't address the immediate risk of using shared devices. If your credentials are captured while using a compromised device, changing passwords afterward won't help if the damage is already done.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Avoid banking on shared devices entirely",
        reflection: "Exactly! The safest approach is to avoid banking on shared devices entirely. Use your personal device or a trusted private computer to ensure your financial information remains secure from potential threats and unauthorized access.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Use only well-known public computers",
        reflection: "Even well-known public computers like those in libraries or internet cafes can be compromised. The reputation of the location doesn't guarantee the security of the individual devices, which may still have malware or keyloggers installed.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What should you do if you must use a shared device for banking?",
    options: [
      {
        id: "a",
        label: "Use only websites with HTTPS",
        reflection: "While HTTPS encryption is important, it doesn't protect against keyloggers or malware on the device itself. The security of your credentials depends more on the device's integrity than the website's encryption protocol.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Use two-factor authentication and monitor accounts",
        reflection: "Exactly! If you must use a shared device, enable two-factor authentication for an extra layer of security, and monitor your accounts closely for any unauthorized activity. However, it's still better to avoid shared devices when possible.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Log in quickly and log out immediately",
        reflection: "Quick logging in and logging out doesn't protect against keyloggers or malware that can capture your credentials in real-time. The risk occurs during the login process itself, regardless of how quickly you complete it.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Use only during off-peak hours",
        reflection: "Using shared devices during off-peak hours doesn't reduce the security risks. The threats from malware, keyloggers, and unauthorized access are present regardless of when you use the device or how many other people are using it.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "Which scenario represents a common shared device security threat?",
    options: [
      {
        id: "a",
        label: "Keylogger capturing login credentials",
        reflection: "Exactly! Keyloggers are a common threat on shared devices that silently record every keystroke you make, including usernames, passwords, and other sensitive information entered during banking sessions.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Device runs out of battery",
        reflection: "A device running out of battery is an inconvenience but not a security threat. The real security concerns with shared devices involve malicious software and unauthorized access to your personal and financial information.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Slow processing speed",
        reflection: "Slow processing speed affects user experience but doesn't pose a security risk to your financial data. The primary security threats involve data capture and unauthorized access, not the device's performance capabilities.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Limited storage space",
        reflection: "Limited storage space is a technical limitation that affects functionality but doesn't compromise the security of your financial information. The main security concerns are related to malicious software and unauthorized data access.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const totalStages = PUBLIC_DEVICE_RISK_STAGES.length;
const successThreshold = totalStages;

const PublicDeviceRisk = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-86";
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
      "What precautions do you currently take when accessing financial accounts on shared devices?",
      "How can you better protect your banking information when using public computers?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = PUBLIC_DEVICE_RISK_STAGES[currentStage];
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
  const stage = PUBLIC_DEVICE_RISK_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Public Device Risk"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={PUBLIC_DEVICE_RISK_STAGES.length}
      currentLevel={Math.min(currentStage + 1, PUBLIC_DEVICE_RISK_STAGES.length)}
      totalLevels={PUBLIC_DEVICE_RISK_STAGES.length}
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
            <span>Public Device Risk</span>
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
                        { stageId: PUBLIC_DEVICE_RISK_STAGES[currentStage].id, isCorrect: PUBLIC_DEVICE_RISK_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Device security awareness</strong>
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
              Skill unlocked: <strong>Device security awareness</strong>
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

export default PublicDeviceRisk;