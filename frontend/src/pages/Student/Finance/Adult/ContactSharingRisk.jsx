import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CONTACT_SHARING_RISK_STAGES = [
  {
    id: 1,
    prompt: "Why is sharing contacts with loan apps risky?",
    options: [
      {
        id: "harassment",
        label: "It enables harassment of friends/family",
        reflection: "Exactly! Sharing contacts allows lenders to contact your friends and family, which can lead to harassment and embarrassment for both you and your contacts.",
        isCorrect: true,
      },
      {
        id: "helps",
        label: "It helps with repayment",
        reflection: "Actually, sharing contacts doesn't help with repayment. Instead, it creates risks by potentially exposing your contacts to harassment or privacy violations.",
        isCorrect: false,
      },
      
      {
        id: "security",
        label: "It increases security",
        reflection: "Sharing contacts actually decreases privacy and security rather than increasing it. Your personal connections become vulnerable to unwanted contact.",
        isCorrect: false,
      },
      {
        id: "convenience",
        label: "It makes loan processing more convenient",
        reflection: "While it might seem convenient, sharing contacts creates significant privacy risks and potential for harassment of your personal connections.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What is the main risk of allowing loan apps to access your contacts?",
    options: [
      {
        id: "storage",
        label: "It uses too much storage space",
        reflection: "Storage space is not the primary concern. The main risk is the potential for your contacts to be contacted and possibly harassed by lenders.",
        isCorrect: false,
      },
     
      {
        id: "battery",
        label: "It drains battery faster",
        reflection: "Battery usage is not the primary concern here. The main risk involves privacy and potential harassment of your contacts.",
        isCorrect: false,
      },
      {
        id: "speed",
        label: "It slows down the app",
        reflection: "While accessing contacts might have a minor impact on app performance, the main concern is privacy and harassment risks.",
        isCorrect: false,
      },
       {
        id: "privacy",
        label: "It violates the privacy of you and your contacts",
        reflection: "Correct! Accessing contacts violates privacy and can lead to your personal connections being contacted by lenders without their consent.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "How can sharing contacts lead to harassment?",
    options: [
      {
        id: "spam",
        label: "By sending spam messages to contacts",
        reflection: "While spam is possible, the main harassment risk involves lenders contacting your contacts directly to pressure you for repayment.",
        isCorrect: false,
      },
      
      {
        id: "social",
        label: "By posting on social media",
        reflection: "Though some lenders might use social media, the primary harassment risk is direct contact with your contacts to pressure them regarding your debt.",
        isCorrect: false,
      },
      {
        id: "pressure",
        label: "By allowing lenders to pressure contacts for your repayment",
        reflection: "Exactly! Lenders may contact your friends and family to pressure them into convincing you to repay, which creates harassment situations.",
        isCorrect: true,
      },
      {
        id: "email",
        label: "By sending emails to all contacts",
        reflection: "While emails might be sent, the main harassment risk is when lenders contact your contacts directly to pressure them regarding your debt.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "What should you do to protect your contacts' privacy?",
    options: [
      {
        id: "share",
        label: "Share contacts generously",
        reflection: "Sharing contacts generously increases the risk of your contacts being contacted and potentially harassed by lenders.",
        isCorrect: false,
      },
      {
        id: "protect",
        label: "Deny contact access and protect their privacy",
        reflection: "Right! Protecting your contacts' privacy by denying access to your contact list is the safest approach.",
        isCorrect: true,
      },
      {
        id: "selective",
        label: "Only share a few contacts",
        reflection: "Even sharing a few contacts creates risk for those individuals. The safest approach is to deny contact access entirely.",
        isCorrect: false,
      },
      {
        id: "fake",
        label: "Provide fake contact information",
        reflection: "Providing fake contacts might seem like a solution, but lenders often verify information, and it's better to simply deny access altogether.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What is the outcome of protecting contacts from lenders?",
    options: [
      {
        id: "dignity",
        label: "Protecting contacts protects dignity",
        reflection: "Perfect! Protecting your contacts' privacy maintains their dignity and shields them from potential harassment related to your financial situation.",
        isCorrect: true,
      },
      {
        id: "difficulty",
        label: "It makes loan approval more difficult",
        reflection: "While it might affect approval in some cases, the primary outcome is protecting your contacts from harassment and maintaining their dignity.",
        isCorrect: false,
      },
      
      {
        id: "delays",
        label: "It delays loan processing",
        reflection: "Processing delays might occur, but the primary outcome is protecting your contacts from harassment and preserving their dignity.",
        isCorrect: false,
      },
      {
        id: "costs",
        label: "It increases loan costs",
        reflection: "The cost of the loan shouldn't be affected by contact privacy. The main outcome is protecting your contacts from harassment.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = CONTACT_SHARING_RISK_STAGES.length;
const successThreshold = totalStages;

const ContactSharingRisk = () => {
  const location = useLocation();
  const gameId = "finance-adults-68";
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
      "How can you protect your contacts' privacy when applying for loans?",
      "What steps should you take to prevent lenders from accessing your contacts?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = CONTACT_SHARING_RISK_STAGES[currentStage];
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
      setCoins(prevCoins => prevCoins + 1);
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
        setCoins(passed ? totalCoins : 0); // Set final coins based on performance
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
  const stage = CONTACT_SHARING_RISK_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Contact Sharing Risk"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={CONTACT_SHARING_RISK_STAGES.length}
      currentLevel={Math.min(currentStage + 1, CONTACT_SHARING_RISK_STAGES.length)}
      totalLevels={CONTACT_SHARING_RISK_STAGES.length}
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
            <span>Contact Privacy</span>
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
                        { stageId: CONTACT_SHARING_RISK_STAGES[currentStage].id, isCorrect: CONTACT_SHARING_RISK_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Contact privacy protection</strong>
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
              Skill unlocked: <strong>Contact privacy protection</strong>
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

export default ContactSharingRisk;