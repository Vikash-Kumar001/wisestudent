import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FINANCIAL_ACCOUNTABILITY_STAGES = [
  {
    id: 1,
    prompt: "When mistakes happen, what's right?",
    options: [
      {
        id: "a",
        label: "Blame others",
        reflection: "Blaming others for financial mistakes avoids personal responsibility and prevents learning from errors. This approach damages relationships, creates conflict, and stops personal growth. Taking ownership of mistakes, even when others contributed, demonstrates maturity and builds trust with financial partners and institutions.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Take responsibility and correct them",
        reflection: "Exactly! Accountability builds maturity. Taking responsibility for financial mistakes, identifying what went wrong, and actively working to correct the situation demonstrates integrity and financial maturity. This approach builds trust, strengthens relationships, and creates opportunities for learning and improvement.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Ignore them and hope they go away",
        reflection: "Ignoring financial mistakes rarely makes them disappear - they typically grow worse over time. Unaddressed errors can lead to larger financial problems, damaged credit, legal issues, and lost opportunities. Responsible financial behavior requires acknowledging and actively addressing mistakes as soon as they're discovered.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Make excuses for why they weren't your fault",
        reflection: "Making excuses for financial mistakes prevents personal accountability and learning opportunities. While circumstances may contribute to errors, taking responsibility involves acknowledging your role and focusing on solutions rather than justifications. This approach builds character and demonstrates financial maturity.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What's the best way to handle discovering an error in your financial records?",
    options: [
      {
        id: "a",
        label: "Document the error and contact the relevant party immediately",
        reflection: "Exactly! This proactive approach demonstrates financial responsibility and integrity. Documenting the error with specific details, dates, and amounts provides clarity for resolution. Contacting the relevant party promptly shows accountability and often leads to quicker, more favorable resolution of the issue.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Wait to see if anyone notices before taking action",
        reflection: "Waiting for others to discover financial errors can damage your reputation and create bigger problems. The longer errors go unaddressed, the more complex and costly they become to resolve. Proactive error correction demonstrates responsibility and often results in more understanding and flexible resolution approaches.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Blame the accounting software or bank system",
        reflection: "Blaming systems or technology for financial errors avoids personal accountability and learning opportunities. While systems can contribute to errors, taking responsibility involves examining your own processes and controls. This approach builds better financial management skills and prevents similar mistakes in the future.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Assume the error will balance out with other transactions",
        reflection: "Assuming errors will naturally balance out is financially irresponsible and risky. Unaddressed errors typically compound over time, leading to larger discrepancies, potential fraud detection, and serious financial consequences. Proper financial management requires actively identifying and correcting all errors regardless of their perceived impact.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How should you approach a financial mistake that affects others?",
    options: [
     
      {
        id: "a",
        label: "Minimize your involvement to protect your reputation",
        reflection: "Minimizing involvement in financial mistakes that affect others damages trust and relationships. While protecting your reputation is important, true financial maturity involves taking appropriate responsibility for your actions. Honest acknowledgment of mistakes, even when uncomfortable, builds stronger, more trusting financial relationships.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Blame external factors beyond anyone's control",
        reflection: "Blaming external factors for financial mistakes that affect others avoids accountability and learning opportunities. While external factors may contribute to problems, responsible financial behavior involves examining all contributing factors including personal decisions and actions. This comprehensive approach leads to better solutions and prevents similar issues.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Let others handle the problem since you're not the only one involved",
        reflection: "Avoiding responsibility for financial mistakes that affect others demonstrates poor leadership and financial maturity. Even when multiple parties are involved, taking ownership of your specific role and contributions shows integrity and often inspires others to do the same. Collaborative problem-solving requires individual accountability from all participants.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Acknowledge your role and work collaboratively on solutions",
        reflection: "Exactly! Accountability builds maturity. Acknowledging your contribution to a financial mistake and working collaboratively with affected parties demonstrates integrity and leadership. This approach builds trust, strengthens relationships, and often leads to creative solutions that benefit everyone involved while maintaining financial responsibility.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What's the long-term benefit of accepting financial responsibility for mistakes?",
    options: [
      
      {
        id: "a",
        label: "Avoids short-term embarrassment and conflict",
        reflection: "Avoiding short-term embarrassment by not accepting financial responsibility often leads to much larger long-term problems. The temporary relief of avoiding accountability typically results in damaged relationships, lost opportunities, and a reputation for unreliability. True financial maturity involves facing short-term discomfort for long-term benefits.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Protects you from potential legal consequences",
        reflection: "While accepting responsibility for financial mistakes may seem risky, it often reduces legal consequences through demonstrated good faith and cooperation. Hiding or denying responsibility typically escalates legal issues and damages relationships. Responsible acknowledgment of mistakes, combined with proactive correction efforts, usually results in more favorable legal and financial outcomes.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Builds trust, credibility, and future opportunities",
        reflection: "Exactly! Accountability builds maturity. Accepting financial responsibility for mistakes builds trust and credibility with financial institutions, employers, business partners, and personal relationships. This reputation for integrity opens doors to better financial opportunities, favorable terms, and stronger professional and personal relationships built on mutual respect and trust.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Saves time by not having to explain or justify your actions",
        reflection: "Accepting financial responsibility often requires time and effort to explain and justify actions, but this investment builds valuable relationships and trust. The time spent on transparent communication and collaborative problem-solving typically saves more time in the long run by preventing future conflicts, building credibility, and creating opportunities for mutual support.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's the best practice for preventing financial mistakes through accountability?",
    options: [
     
      {
        id: "a",
        label: "Rely on others to catch your errors and point them out",
        reflection: "Relying on others to catch financial errors demonstrates poor personal accountability and creates dependency. While feedback from others is valuable, responsible financial management requires developing your own error-checking skills and systems. Building personal accountability prevents mistakes and develops the financial maturity needed for long-term success.",
        isCorrect: false,
      },
       {
        id: "b",
        label: "Implement personal checks and regularly review your financial processes",
        reflection: "Exactly! Accountability builds maturity. Implementing personal checks and regularly reviewing financial processes demonstrates proactive responsibility and prevents mistakes before they occur. This systematic approach involves creating accountability measures, seeking feedback, and continuously improving financial management practices to build long-term financial stability and success.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Avoid complex financial situations to minimize error risk",
        reflection: "Avoiding complex financial situations to prevent errors limits growth opportunities and financial development. Responsible financial accountability involves building skills and systems to handle complexity confidently. The goal should be developing the maturity and processes to manage sophisticated financial situations successfully, not avoiding them out of fear of mistakes.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Blame past mistakes on lack of experience as you gain more knowledge",
        reflection: "Blaming past financial mistakes on lack of experience prevents learning from those experiences and building true accountability. While experience is valuable, financial maturity involves learning from all mistakes regardless of their cause. Taking ownership of errors and using them as learning opportunities builds the wisdom and responsibility needed for future financial success.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const totalStages = FINANCIAL_ACCOUNTABILITY_STAGES.length;
const successThreshold = totalStages;

const FinancialAccountability = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-98";
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
      "What financial accountability systems do you currently have in place?",
      "How can you better demonstrate financial responsibility in your daily money management?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FINANCIAL_ACCOUNTABILITY_STAGES[currentStage];
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
  const stage = FINANCIAL_ACCOUNTABILITY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Financial Accountability"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FINANCIAL_ACCOUNTABILITY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FINANCIAL_ACCOUNTABILITY_STAGES.length)}
      totalLevels={FINANCIAL_ACCOUNTABILITY_STAGES.length}
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
            <span>Financial Accountability</span>
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
                        { stageId: FINANCIAL_ACCOUNTABILITY_STAGES[currentStage].id, isCorrect: FINANCIAL_ACCOUNTABILITY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Financial responsibility and integrity</strong>
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
              Skill unlocked: <strong>Financial responsibility and integrity</strong>
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

export default FinancialAccountability;