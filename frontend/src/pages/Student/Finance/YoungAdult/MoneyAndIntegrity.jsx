import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MONEY_AND_INTEGRITY_STAGES = [
  {
    id: 1,
    prompt: "What matters most in financial life?",
    options: [
      {
        id: "a",
        label: "Short-term gain",
        reflection: "While short-term gains can be tempting, focusing solely on immediate profits often leads to risky decisions and missed opportunities for sustainable wealth building. Quick gains rarely translate to long-term financial security or personal fulfillment.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Long-term integrity and trust",
        reflection: "Exactly! Trust builds opportunities over time. Maintaining integrity in your financial dealings creates lasting relationships, opens doors to better opportunities, and builds a reputation that can lead to sustainable success and wealth creation.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Maximizing immediate returns",
        reflection: "Maximizing immediate returns often involves taking excessive risks or cutting corners that can damage your reputation and relationships. This approach rarely leads to sustainable financial success and can result in significant losses over time.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Following what others do",
        reflection: "Following others without considering your own values and circumstances can lead to poor financial decisions. What works for others may not align with your goals, risk tolerance, or ethical standards. Always make decisions based on your own principles and situation.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "You discover an error in your favor on a financial statement. What's the right action?",
    options: [
      {
        id: "a",
        label: "Keep the extra money since no one noticed",
        reflection: "Keeping money that doesn't belong to you due to an error violates basic principles of integrity and honesty. This can damage your reputation, lead to legal consequences, and create ongoing stress about being discovered.",
        isCorrect: false,
      },
     
      {
        id: "b",
        label: "Wait to see if anyone notices before acting",
        reflection: "Waiting to see if anyone notices creates an ongoing ethical dilemma and potential legal risk. The longer you delay addressing the error, the more difficult it becomes to rectify the situation and the more damage it can do to your integrity and relationships.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Use the money for something important then return it",
        reflection: "Using money that isn't yours, even temporarily, is still unethical and can create complications if the error is discovered. The right approach is to address the error immediately and return all funds that don't belong to you.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Report the error and return the excess amount",
        reflection: "Exactly! Reporting errors and returning excess funds demonstrates integrity and builds trust. This action protects your reputation, maintains ethical standards, and often leads to positive recognition from the other party involved.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "A business opportunity requires compromising your ethical standards. What should you do?",
    options: [
      {
        id: "a",
        label: "Take the opportunity for the financial gain",
        reflection: "Compromising your ethical standards for financial gain often leads to long-term consequences that outweigh short-term profits. This approach can damage your reputation, create legal risks, and lead to ongoing stress about maintaining the deception.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Try to minimize the ethical compromise",
        reflection: "Attempting to minimize ethical compromises still involves compromising your values and can lead to the same negative consequences as full compromise. It's better to maintain clear ethical boundaries and seek opportunities that fully align with your standards.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Decline and seek opportunities aligned with your values",
        reflection: "Exactly! Declining opportunities that conflict with your values protects your integrity and attracts opportunities that align with your principles. This approach builds a sustainable foundation for long-term success and personal satisfaction.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Consult others before making a decision",
        reflection: "While seeking advice can be helpful, the decision about ethical compromises ultimately rests with you. Others may have different values or perspectives, so it's important to make decisions based on your own moral compass and long-term goals.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "How should you handle financial disagreements with friends or family?",
    options: [
      {
        id: "a",
        label: "Insist on your position to protect your interests",
        reflection: "Insisting on your position in financial disagreements can damage relationships and create lasting resentment. While protecting your interests is important, maintaining relationships often provides more long-term value than winning short-term financial disputes.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Avoid the topic to prevent conflict",
        reflection: "Avoiding financial disagreements can lead to unresolved issues that fester over time and potentially damage relationships more than addressing them directly. It's better to have honest conversations about financial matters to reach mutually acceptable solutions.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Let others decide to avoid responsibility",
        reflection: "Letting others decide financial matters that affect you can lead to unsatisfactory outcomes and ongoing resentment. It's important to participate in financial discussions and decisions while maintaining respect for others' perspectives and seeking mutually beneficial solutions.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Seek fair solutions that preserve relationships",
        reflection: "Exactly! Seeking fair solutions that preserve relationships demonstrates integrity and builds trust. This approach maintains valuable personal connections while ensuring that financial matters are handled ethically and equitably for all parties involved.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's the best approach to financial decision-making?",
    options: [
      {
        id: "a",
        label: "Consider long-term impact and ethical implications",
        reflection: "Exactly! Considering long-term impact and ethical implications leads to sustainable financial success and personal fulfillment. This approach builds a solid foundation for wealth creation while maintaining your integrity and contributing positively to your relationships and community.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Focus only on immediate financial benefits",
        reflection: "Focusing only on immediate financial benefits often leads to poor long-term outcomes and missed opportunities for sustainable wealth building. This approach can result in risky decisions that compromise your financial security and personal values.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Make decisions based on what's easiest",
        reflection: "Making financial decisions based on what's easiest often leads to suboptimal outcomes and missed opportunities for growth. The path of least resistance rarely leads to significant financial success or personal development.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Follow popular trends without personal analysis",
        reflection: "Following popular trends without personal analysis can lead to poor financial decisions that don't align with your goals or risk tolerance. It's important to evaluate opportunities based on your individual circumstances and long-term objectives rather than following the crowd.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const totalStages = MONEY_AND_INTEGRITY_STAGES.length;
const successThreshold = totalStages;

const MoneyAndIntegrity = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-91";
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
      "What financial decisions have you made that align with your values?",
      "How can you better integrate integrity into your financial planning?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = MONEY_AND_INTEGRITY_STAGES[currentStage];
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
  const stage = MONEY_AND_INTEGRITY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Money and Integrity"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={MONEY_AND_INTEGRITY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, MONEY_AND_INTEGRITY_STAGES.length)}
      totalLevels={MONEY_AND_INTEGRITY_STAGES.length}
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
            <span>Money and Integrity</span>
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
                        { stageId: MONEY_AND_INTEGRITY_STAGES[currentStage].id, isCorrect: MONEY_AND_INTEGRITY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Ethical financial decision-making</strong>
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
              Skill unlocked: <strong>Ethical financial decision-making</strong>
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

export default MoneyAndIntegrity;