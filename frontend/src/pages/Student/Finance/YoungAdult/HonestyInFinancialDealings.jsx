import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HONESTY_IN_FINANCIAL_DEALINGS_STAGES = [
  {
    id: 1,
    prompt: "Hiding information to get benefits leads to:",
    options: [
      {
        id: "a",
        label: "Success",
        reflection: "Hiding information to gain financial benefits rarely leads to true success. While it might provide short-term gains, this approach creates a foundation of deception that can collapse under scrutiny, leading to damaged relationships, lost opportunities, and potential legal consequences that far outweigh any temporary advantages.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Improved relationships",
        reflection: "Hiding information actually damages relationships rather than improving them. When deception is discovered, it creates mistrust, resentment, and damaged credibility that can be extremely difficult or impossible to repair, ultimately harming both personal and professional relationships.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "No significant impact",
        reflection: "Hiding financial information almost always has significant negative impacts. Even if the deception isn't immediately discovered, the stress of maintaining false information, the risk of exposure, and the ethical burden create ongoing negative effects that can influence decision-making and well-being.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Long-term consequences",
        reflection: "Exactly! Honesty protects future opportunities. Hiding information to gain benefits almost always leads to long-term negative consequences including damaged trust, lost reputation, legal issues, and missed opportunities. The immediate gains are typically outweighed by the lasting damage to relationships and future prospects.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What's the best approach when you realize you've been overcharged?",
    options: [
      {
        id: "a",
        label: "Point out the error and request a correction",
        reflection: "Exactly! This honest approach demonstrates integrity and builds trust. Most businesses appreciate customers who bring billing errors to their attention, as it helps them maintain accurate records and improves customer relationships. This approach often leads to positive outcomes and strengthens your reputation for honesty.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Stay quiet and keep the extra money",
        reflection: "Keeping overcharged money might seem beneficial in the short term, but it's ethically wrong and can create long-term problems. If discovered later, it can damage your reputation, create legal issues, and lead to lost opportunities. Honesty is always the better policy for sustainable success.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Wait to see if anyone notices before acting",
        reflection: "Waiting to see if anyone notices creates an ongoing ethical dilemma and potential legal risk. The longer you delay addressing the error, the more difficult it becomes to rectify the situation and the more damage it can do to your integrity and relationships with the business involved.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Claim you didn't notice to avoid confrontation",
        reflection: "Claiming ignorance to avoid confrontation is dishonest and can damage your credibility if the truth comes out. Taking responsibility for noticing and addressing errors demonstrates maturity and integrity, which are valuable traits in both personal and professional relationships.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How should you handle financial information on applications?",
    options: [
      
      {
        id: "a",
        label: "Exaggerate your income to improve your chances",
        reflection: "Exaggerating income on financial applications is fraudulent and can lead to serious consequences including loan denial, legal action, damaged credit, and criminal charges. Even if successful initially, the deception will eventually be discovered, leading to much worse outcomes than honest disclosure would have produced.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Omit negative information that isn't specifically requested",
        reflection: "Omitting negative financial information that isn't specifically requested is still dishonest and can be considered fraud by omission. Financial institutions rely on complete and accurate information to make informed decisions. Dishonesty in applications can lead to legal consequences and severely damage your financial reputation.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Provide accurate information even if it might affect your approval",
        reflection: "Exactly! Honesty protects future opportunities. Providing accurate financial information on applications, even when it might affect approval chances, demonstrates integrity and builds trust with lenders and institutions. This approach creates a foundation for sustainable financial relationships and long-term success.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Provide whatever information makes you look most favorable",
        reflection: "Providing misleading information to appear more favorable is unethical and risky. This approach can lead to inappropriate financial products, unaffordable obligations, and serious legal consequences. Honest disclosure ensures you receive appropriate financial solutions that align with your actual situation.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What's the impact of honesty in financial dealings on your reputation?",
    options: [
      
      {
        id: "a",
        label: "Limits your access to financial opportunities",
        reflection: "Honesty actually enhances rather than limits financial opportunities. While it might occasionally result in denied applications, it builds the trust and credibility necessary for better long-term opportunities. Dishonesty, on the other hand, creates barriers and closes doors to future prospects.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Builds trust and opens doors to better opportunities",
        reflection: "Exactly! Honesty protects future opportunities. Consistent honesty in financial dealings builds a reputation for reliability and integrity that opens doors to better financial products, favorable terms, and trusted relationships with lenders, employers, and business partners. This reputation becomes a valuable asset over time.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Has no impact on how others perceive you financially",
        reflection: "Honesty has a significant impact on financial reputation. Financial institutions, employers, and business partners often share information about individuals' financial behavior. A reputation for honesty opens doors and creates opportunities, while a reputation for dishonesty creates barriers and limits options.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Only matters for large financial transactions",
        reflection: "Honesty matters in all financial dealings, regardless of size. Small transactions provide opportunities to build or damage your reputation. Consistent honesty in small dealings demonstrates character and reliability that influence how others treat you in larger, more important financial situations.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "How should you handle financial mistakes you've made?",
    options: [
      {
        id: "a",
        label: "Acknowledge the mistake and take responsibility",
        reflection: "Exactly! Honesty protects future opportunities. Acknowledging financial mistakes and taking responsibility demonstrates maturity and integrity. This approach often leads to understanding and support from others, helps prevent similar mistakes in the future, and builds trust that benefits long-term financial relationships.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Blame others or circumstances to avoid consequences",
        reflection: "Blaming others for financial mistakes damages relationships and credibility. Taking responsibility for errors demonstrates accountability and maturity. People and institutions are more likely to work with those who acknowledge mistakes honestly and show commitment to making things right.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Hide the mistake and hope it goes unnoticed",
        reflection: "Hiding financial mistakes creates ongoing stress and can lead to much worse consequences when the error is eventually discovered. The longer a mistake is concealed, the more difficult and expensive it becomes to correct. Honest acknowledgment is almost always the better approach.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Only address the mistake if directly confronted",
        reflection: "Waiting to be confronted before addressing financial mistakes shows a lack of integrity and can damage relationships. Proactively acknowledging and addressing errors demonstrates responsibility and builds trust. This approach often leads to more favorable outcomes than defensive or evasive responses.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const totalStages = HONESTY_IN_FINANCIAL_DEALINGS_STAGES.length;
const successThreshold = totalStages;

const HonestyInFinancialDealings = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-95";
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
      "What financial situations require you to choose between short-term gain and long-term integrity?",
      "How can you build a reputation for honesty in your financial dealings?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = HONESTY_IN_FINANCIAL_DEALINGS_STAGES[currentStage];
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
  const stage = HONESTY_IN_FINANCIAL_DEALINGS_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Honesty in Financial Dealings"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={HONESTY_IN_FINANCIAL_DEALINGS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, HONESTY_IN_FINANCIAL_DEALINGS_STAGES.length)}
      totalLevels={HONESTY_IN_FINANCIAL_DEALINGS_STAGES.length}
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
            <span>Honesty in Financial Dealings</span>
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
                        { stageId: HONESTY_IN_FINANCIAL_DEALINGS_STAGES[currentStage].id, isCorrect: HONESTY_IN_FINANCIAL_DEALINGS_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Ethical financial conduct</strong>
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
              Skill unlocked: <strong>Ethical financial conduct</strong>
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

export default HonestyInFinancialDealings;