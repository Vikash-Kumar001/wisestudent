import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FRAUD_SAFETY_CHECKPOINT_STAGES = [
  {
    id: 1,
    prompt: "You receive an email claiming your account will be closed unless you click a link and verify your details. What should you do?",
    options: [
      {
        id: "a",
        label: "Click the link immediately to save your account",
        reflection: "Clicking links in suspicious emails is extremely dangerous. These are often phishing attempts designed to steal your login credentials and personal information. Legitimate companies rarely ask for sensitive information via email with urgent deadlines.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Ignore the email and contact the company directly",
        reflection: "Exactly! This is the safest approach. Contact the company through official channels like their verified website or customer service number to confirm if there's a real issue with your account. Never trust urgent requests made through unsolicited emails.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Forward the email to friends for advice",
        reflection: "While seeking advice can be helpful, forwarding suspicious emails might spread potential malware or phishing links to others. If you need advice, discuss the situation verbally or through secure messaging rather than sharing the email itself.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Reply to the email asking for more information",
        reflection: "Replying to suspicious emails confirms to scammers that your email address is active and can lead to more targeted attacks. It also risks exposing additional personal information that could be used for identity theft or financial fraud.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "A caller claims to be from your bank and asks for your account password to 'verify your identity.' What's your response?",
    options: [
      {
        id: "a",
        label: "Hang up and call your bank using their official number",
        reflection: "Exactly! This is the correct response to suspected banking scams. Hang up immediately and contact your bank using the official customer service number on your bank statement or website. This ensures you're speaking with legitimate representatives.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Provide the password to verify your account",
        reflection: "Legitimate banks and financial institutions will never ask for your password over the phone. This is a classic social engineering scam designed to steal your account credentials. Providing passwords to unsolicited callers puts all your financial accounts at immediate risk.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Ask the caller for their employee ID and verify it",
        reflection: "Even asking for verification details from suspicious callers can be risky, as scammers often have fake credentials ready. The safest approach is to end the call and independently verify any concerns through official channels rather than engaging with the suspicious caller.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Give them your debit card number instead",
        reflection: "Providing any financial information to unsolicited callers is extremely dangerous. Debit card numbers, like passwords, should never be shared over the phone with unverified individuals. Both types of information provide direct access to your financial accounts.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "You see an online ad promising 'Get rich quick with no experience needed.' What's the most likely truth?",
    options: [
      {
        id: "a",
        label: "It's a legitimate investment opportunity",
        reflection: "Legitimate investment opportunities typically require some knowledge, experience, or risk assessment. 'Get rich quick' claims with no experience needed are almost always scams designed to steal money or personal information under the guise of easy profits.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "The returns depend on market conditions",
        reflection: "While market conditions do affect investments, 'get rich quick' schemes typically ignore or downplay risks entirely. Legitimate investments always come with risk disclosures and realistic return expectations based on market analysis and historical performance data.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "You should invest small amounts to test it",
        reflection: "Investing even small amounts in 'get rich quick' schemes is risky. These are often designed to steal initial investments and then disappear, or they may be part of larger pyramid schemes that ultimately harm all participants except the organizers.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "It's likely a scam or misleading advertisement",
        reflection: "Exactly! 'Get rich quick' schemes are classic red flags for fraud. These offers often promise unrealistic returns with minimal risk or effort. They're designed to trick people into investing money or providing personal information that will be stolen.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "You're asked to provide your Social Security Number to claim a prize you never entered. What should you do?",
    options: [
      {
        id: "a",
        label: "Provide the number to claim your prize",
        reflection: "Providing your Social Security Number to claim unsolicited prizes is extremely dangerous. This is a common identity theft scam. Legitimate prizes don't require sensitive personal information upfront, and you can't win prizes you never entered or applied for.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Ask for the prize to be sent to a different address",
        reflection: "Changing the delivery address doesn't solve the fundamental problem of providing personal information to unknown parties. Scammers can use any address you provide, and sharing personal details still puts you at risk for identity theft and financial fraud.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Do not provide any personal information and report it",
        reflection: "Exactly! Never provide personal information for unsolicited prizes or offers. Report these attempts to the Federal Trade Commission (FTC) or your local consumer protection agency. This helps track scam patterns and protects others from similar attempts.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Provide only partial information to verify",
        reflection: "Providing any portion of your Social Security Number is still dangerous. Even partial information can be used for identity verification by criminals. The safest approach is to provide no personal information and report the suspicious contact to appropriate authorities.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "A friend on social media sends you a message with a link saying 'You have to see this urgent financial news!' What's your best action?",
    options: [
      {
        id: "a",
        label: "Click the link immediately to stay informed",
        reflection: "Clicking links from social media messages, even from friends, can be risky. Accounts can be compromised, or the message might not actually be from your friend. Malicious links can install malware or lead to phishing sites that steal personal information.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Verify with your friend through another channel first",
        reflection: "Exactly! This is the safest approach. Social media accounts can be hacked, and messages might not be genuinely from your friend. Verify through phone, text, or another secure method before clicking any links to ensure the message is legitimate.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Forward the message to other friends",
        reflection: "Forwarding suspicious messages spreads potential risks to others. If the link is malicious, you're potentially exposing your friends to malware or phishing attempts. Always verify suspicious content before sharing it with others.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Report the message but still click the link",
        reflection: "Reporting suspicious messages is good practice, but clicking the link afterward still puts your device and personal information at risk. The safest approach is to avoid clicking suspicious links entirely and verify the message's legitimacy through other channels.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const totalStages = FRAUD_SAFETY_CHECKPOINT_STAGES.length;
const successThreshold = totalStages;

const FraudSafetyCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-90";
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
      "What red flags do you currently miss in suspicious communications?",
      "How can you better verify the legitimacy of urgent financial requests?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FRAUD_SAFETY_CHECKPOINT_STAGES[currentStage];
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
  const stage = FRAUD_SAFETY_CHECKPOINT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Fraud Safety Checkpoint"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FRAUD_SAFETY_CHECKPOINT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FRAUD_SAFETY_CHECKPOINT_STAGES.length)}
      totalLevels={FRAUD_SAFETY_CHECKPOINT_STAGES.length}
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
            <span>Fraud Safety Checkpoint</span>
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
                        { stageId: FRAUD_SAFETY_CHECKPOINT_STAGES[currentStage].id, isCorrect: FRAUD_SAFETY_CHECKPOINT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Fraud recognition skills</strong>
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
              Skill unlocked: <strong>Fraud recognition skills</strong>
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

export default FraudSafetyCheckpoint;