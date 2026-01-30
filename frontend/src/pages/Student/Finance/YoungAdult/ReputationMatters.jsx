import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REPUTATION_MATTERS_STAGES = [
  {
    id: 1,
    prompt: "Financial reputation affects:",
    options: [
      {
        id: "a",
        label: "Jobs, credit, and trust",
        reflection: "Exactly! Reputation follows you for life. Financial reputation significantly impacts employment opportunities, credit approval and terms, rental agreements, insurance rates, and personal relationships. Your financial behavior creates a track record that influences how others perceive your reliability and responsibility, affecting opportunities and advantages throughout your life.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Nothing",
        reflection: "Financial reputation affects far more than just money - it impacts your ability to get jobs, credit, housing, and build trust in personal and professional relationships. A poor financial reputation can limit opportunities and create barriers throughout your life, while a good reputation opens doors and creates advantages in many areas beyond just financial transactions.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Only your bank account balance",
        reflection: "Financial reputation extends far beyond your current bank balance to encompass your entire financial behavior history. It includes payment patterns, credit management, debt handling, and financial decision-making that affects your relationships with financial institutions, employers, landlords, and even personal connections who may need to trust your financial reliability.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Just your credit score",
        reflection: "While credit score is an important component of financial reputation, your overall financial reputation encompasses much more including employment history, rental payment records, utility payments, and general financial behavior. These factors collectively influence how financial institutions, employers, and others perceive your financial responsibility and trustworthiness.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "How does financial reputation impact job opportunities?",
    options: [
      
      {
        id: "a",
        label: "Employers never consider financial background",
        reflection: "Many employers do consider financial background, particularly for roles involving money handling, financial decision-making, or positions where trust and reliability are crucial. Financial reputation serves as an indicator of character, responsibility, and potential risk management abilities that employers value in their workforce.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Many employers check credit and financial history during hiring",
        reflection: "Exactly! Reputation follows you for life. Many employers, especially for positions involving financial responsibility, check credit reports and financial history to assess reliability and trustworthiness. Poor financial management can signal potential issues with responsibility, attention to detail, and stress management that may affect job performance.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Only matters for finance-related jobs",
        reflection: "Financial reputation matters for jobs across many industries, not just finance-related positions. Employers in various fields consider financial background as an indicator of personal responsibility, reliability, and potential stress levels that could impact job performance and company relationships, making it relevant for a wide range of career opportunities.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Financial problems automatically disqualify you from any job",
        reflection: "While financial problems can negatively impact job prospects, they don't automatically disqualify candidates from all positions. Many employers understand that financial difficulties can happen to responsible people due to circumstances beyond their control. The key is demonstrating financial responsibility, learning from mistakes, and showing improved financial management over time.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "What role does financial reputation play in credit and lending?",
    options: [
     
      {
        id: "a",
        label: "Lenders only care about current income",
        reflection: "While current income is important, lenders also heavily consider financial reputation including credit history, payment patterns, debt management, and overall financial behavior. Your reputation provides insight into your reliability as a borrower and helps lenders assess the risk of lending to you, directly affecting approval chances and terms offered.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Past financial mistakes don't matter if you're currently responsible",
        reflection: "While improving financial behavior is crucial, past financial mistakes do impact your reputation and lending prospects. Lenders review your complete financial history to assess risk and reliability. However, demonstrating consistent responsible behavior over time can gradually rebuild reputation and improve lending opportunities, though it may take time to fully recover from past issues.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Financial reputation only matters for large loans like mortgages",
        reflection: "Financial reputation affects all types of credit and lending, from credit cards and auto loans to personal loans and mortgages. Lenders across all categories use your financial reputation to assess risk and determine terms. Even small credit applications consider your payment history and financial behavior as indicators of future reliability.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Strong reputation leads to better rates and approval chances",
        reflection: "Exactly! Reputation follows you for life. A strong financial reputation, demonstrated through consistent on-time payments, responsible credit use, and prudent financial management, leads to better interest rates, higher credit limits, easier loan approvals, and more favorable terms from lenders who view you as a low-risk, reliable borrower.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "How does financial reputation influence personal relationships?",
    options: [
      
      {
        id: "a",
        label: "Financial reputation has no impact on personal relationships",
        reflection: "Financial reputation significantly impacts personal relationships as money matters are often intertwined with trust, planning, and shared responsibilities. How you manage finances affects your ability to meet commitments, handle emergencies, and make joint decisions, all of which influence the strength and stability of personal relationships with friends, family, and romantic partners.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Only matters for romantic partnerships",
        reflection: "Financial reputation affects various personal relationships beyond romantic partnerships, including friendships, family dynamics, and business relationships. Your financial behavior influences how others perceive your reliability, planning ability, and responsibility, affecting trust and willingness to engage in financial collaborations or support during difficult times.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Trust in financial matters affects overall relationship trust",
        reflection: "Exactly! Reputation follows you for life. Trust in financial matters often extends to trust in other areas of relationships. How you handle money, fulfill financial commitments, and manage financial stress affects how others perceive your reliability, responsibility, and ability to handle important life matters, influencing both personal and professional relationships significantly.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "People should accept you regardless of your financial history",
        reflection: "While acceptance is important, financial reputation naturally affects how others perceive and interact with you. People often make subconscious judgments about reliability and compatibility based on financial behavior. Building and maintaining good financial reputation helps create stronger, more trusting relationships where others feel confident in your ability to handle shared responsibilities and commitments.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's the best way to build and maintain a good financial reputation?",
    options: [
      
      {
        id: "a",
        label: "Focus only on earning more money",
        reflection: "Simply earning more money doesn't automatically build a good financial reputation - how you manage and use that money matters more. Financial reputation is built through responsible behavior like timely payments, prudent spending, debt management, and demonstrating reliability in financial commitments, regardless of income level.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Consistently pay bills on time and manage debt responsibly",
        reflection: "Exactly! Reputation follows you for life. Building and maintaining a good financial reputation requires consistent, responsible financial behavior over time. This includes making payments on time, managing debt prudently, living within your means, monitoring your credit regularly, and demonstrating financial maturity through thoughtful decision-making and long-term planning.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Hide financial problems from others to protect your image",
        reflection: "Hiding financial problems often makes them worse and can severely damage your reputation when issues eventually surface. Building genuine financial reputation involves transparency, accountability, and proactive problem-solving. Addressing financial challenges responsibly and communicating openly when necessary demonstrates the maturity and reliability that create lasting positive reputation.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Worry about reputation only when applying for credit or jobs",
        reflection: "Financial reputation is built through consistent daily actions and decisions, not just when facing specific applications. Waiting until you need credit or a job to focus on reputation is too late - it takes time to build and can be quickly damaged. Proactive, consistent financial responsibility creates the strong foundation of trust and reliability that serves you throughout your life.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const totalStages = REPUTATION_MATTERS_STAGES.length;
const successThreshold = totalStages;

const ReputationMatters = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-99";
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
      "What steps can you take to improve your current financial reputation?",
      "How does your financial behavior impact your relationships with others?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = REPUTATION_MATTERS_STAGES[currentStage];
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
  const stage = REPUTATION_MATTERS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Reputation Matters"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={REPUTATION_MATTERS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, REPUTATION_MATTERS_STAGES.length)}
      totalLevels={REPUTATION_MATTERS_STAGES.length}
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
            <span>Reputation Matters</span>
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
                        { stageId: REPUTATION_MATTERS_STAGES[currentStage].id, isCorrect: REPUTATION_MATTERS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Financial reputation management</strong>
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
              Skill unlocked: <strong>Financial reputation management</strong>
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

export default ReputationMatters;