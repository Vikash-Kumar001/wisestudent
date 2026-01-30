import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LOAN_SCAM_WARNING_STAGES = [
  {
    id: 1,
    prompt: "A lender asks for upfront “processing fees” before approval. What should you do?",
    options: [
      {
        id: "a",
        label: "Pay quickly",
        reflection: "Paying upfront fees quickly to secure a loan is a major red flag for scams. Legitimate lenders don't require payment before approving loans, and rushing to pay fees often indicates you're falling for a fraudulent scheme.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Avoid and verify legitimacy",
        reflection: "Exactly! Upfront fee demands are scam indicators. Legitimate lenders make money from interest on loans, not upfront fees. Always verify a lender's legitimacy through official channels before providing any payment information.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Pay only a small amount first",
        reflection: "Paying any amount, even a small one, doesn't make a scam legitimate. Scammers often start with small requests to build trust before asking for larger amounts. The fundamental issue is that legitimate lenders don't require upfront payments.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Ask for a payment plan for the fees",
        reflection: "Asking for a payment plan for fees doesn't address the core problem that legitimate lenders don't charge upfront fees. This approach might make you more vulnerable to ongoing scams by establishing a payment relationship with fraudulent lenders.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "Which is a common characteristic of loan scams?",
    options: [
      {
        id: "a",
        label: "Guarantee approval regardless of credit history",
        reflection: "Exactly! Guaranteeing loan approval regardless of credit history is a major red flag. Legitimate lenders assess creditworthiness and risk, and no reputable lender guarantees approval to everyone, especially those with poor credit histories.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Require credit checks",
        reflection: "Requiring credit checks is actually a standard practice for legitimate lenders to assess risk and determine loan terms. While scammers might skip this step, credit checks alone don't indicate a scam - they're part of responsible lending practices.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Have physical office locations",
        reflection: "Having physical office locations can be a positive sign, but scammers can also create fake addresses or rent temporary spaces. The presence of an office alone doesn't guarantee legitimacy - you should verify through official regulatory channels.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Offer competitive interest rates",
        reflection: "Offering competitive interest rates can be legitimate, but scammers often use this as bait to attract victims. The key is to verify the lender's legitimacy through official sources rather than being swayed by attractive rate offers alone.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How can you verify if a lender is legitimate?",
    options: [
      {
        id: "a",
        label: "Check their website design",
        reflection: "While professional website design can be a positive indicator, it's not a reliable way to verify legitimacy. Scammers can create very professional-looking websites, and legitimate lenders might have simpler designs. Focus on official verification methods instead.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Read online reviews only",
        reflection: "Online reviews can provide some insight, but they're not sufficient for verification. Reviews can be fake or manipulated, and even legitimate businesses can have negative reviews. Official regulatory verification is much more reliable than online opinions alone.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Trust their professional appearance",
        reflection: "Professional appearance, including business cards, letterhead, or office setup, can be easily faked by scammers. Don't rely on surface-level professionalism as proof of legitimacy - always verify through official regulatory channels.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Verify through financial regulators",
        reflection: "Exactly! Checking with financial regulators like the RBI, state banking departments, or other official regulatory bodies is the most reliable way to verify a lender's legitimacy. Legitimate lenders are registered and regulated by these authorities.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What should you do if a lender pressures you for immediate action?",
    options: [
      {
        id: "a",
        label: "Act quickly to secure the deal",
        reflection: "Acting quickly under pressure is exactly what scammers want you to do. They create urgency to prevent you from thinking clearly, researching the lender, or consulting with trusted advisors. Legitimate lenders give you time to make informed decisions.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Ask for a small extension",
        reflection: "Asking for a small extension might temporarily缓解 the pressure, but it doesn't address the underlying concern about the lender's legitimacy. The key is to use any extra time to thoroughly verify the lender rather than just delaying your decision.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Take time to research and verify",
        reflection: "Exactly! Taking time to research and verify is the safest approach. Legitimate lenders understand that borrowing money is a serious decision and will give you time to verify their credentials and understand the terms without pressuring you to act immediately.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Trust their sense of urgency",
        reflection: "Trusting the lender's sense of urgency is risky because scammers often create false urgency to manipulate you into making hasty decisions. Legitimate lenders don't need to create artificial pressure - they're confident in their legitimate services and terms.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "Which scenario represents a legitimate lending practice?",
    options: [
      {
        id: "a",
        label: "Asking for upfront processing fees",
        reflection: "Asking for upfront processing fees is a common scam tactic. Legitimate lenders make money from interest on loans and fees tied to actual services provided, not from upfront payments before loan approval or disbursement.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Charging fees only after loan disbursement",
        reflection: "Exactly! Charging fees only after loan disbursement is a legitimate practice. This ensures that fees are tied to actual services provided and that the lender has skin in the game - they only get paid if they successfully provide the loan.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Requiring payment for credit checks",
        reflection: "While some lenders may charge for credit checks, reputable lenders typically include this as part of their service or offer it for free to attract customers. Requiring separate payment specifically for credit checks can be a red flag, especially if it's required upfront.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Accepting only cash payments",
        reflection: "Requiring only cash payments, especially for large transactions, is suspicious and can be a scam indicator. Legitimate lenders typically use secure, traceable payment methods and maintain proper documentation for all transactions.",
        isCorrect: false,
      },
    
    ],
    reward: 20,
  },
];

const totalStages = LOAN_SCAM_WARNING_STAGES.length;
const successThreshold = totalStages;

const LoanScamWarning = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-87";
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
      "What steps do you currently take to verify the legitimacy of lenders?",
      "How can you better protect yourself from loan scams and fraudulent lending practices?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = LOAN_SCAM_WARNING_STAGES[currentStage];
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
  const stage = LOAN_SCAM_WARNING_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Loan Scam Warning"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={LOAN_SCAM_WARNING_STAGES.length}
      currentLevel={Math.min(currentStage + 1, LOAN_SCAM_WARNING_STAGES.length)}
      totalLevels={LOAN_SCAM_WARNING_STAGES.length}
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
            <span>Loan Scam Warning</span>
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
                        { stageId: LOAN_SCAM_WARNING_STAGES[currentStage].id, isCorrect: LOAN_SCAM_WARNING_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Loan scam detection</strong>
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
              Skill unlocked: <strong>Loan scam detection</strong>
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

export default LoanScamWarning;