import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ETHICAL_FINANCE_CHECKPOINT_STAGES = [
  {
    id: 1,
    prompt: "You find a wallet with cash and cards on the street. What's the ethical choice?",
    options: [
      {
        id: "a",
        label: "Keep the money and throw away the cards",
        reflection: "Keeping money found in a wallet is theft, regardless of circumstances. The ethical choice involves returning all items to their rightful owner. This demonstrates integrity and respect for others' property, building the character foundation essential for financial responsibility and trust in adult relationships.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Take only the cash since cards can be canceled",
        reflection: "Taking any money from a found wallet is theft, regardless of whether cards can be replaced. The ethical approach requires returning all items intact. This demonstrates understanding that financial ethics apply to all forms of value, not just easily replaceable items, and builds the character needed for responsible financial decision-making.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Ignore it and walk away",
        reflection: "While ignoring found property avoids legal risk, it doesn't help the owner who may face financial loss and stress. The ethical choice involves making reasonable efforts to return lost property, demonstrating the empathy and responsibility that characterize mature financial behavior and contribute to a trustworthy community.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Return everything to the owner or turn it into authorities",
        reflection: "Exactly! You are financially responsible, ethical, and ready for adult life. Returning found property demonstrates the integrity and respect for others that forms the foundation of ethical financial behavior. This choice shows you understand that financial responsibility extends beyond personal gain to include respect for others' property and wellbeing.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "Your friend asks to borrow your credit card for an emergency purchase. What should you do?",
    options: [
      {
        id: "a",
        label: "Suggest alternative help like a loan or calling family",
        reflection: "Exactly! You are financially responsible, ethical, and ready for adult life. Suggesting alternatives like a personal loan with clear terms or contacting family demonstrates understanding of financial boundaries and responsibility. This approach protects both parties' financial security while still offering meaningful support in a crisis.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Lend it with clear terms about repayment",
        reflection: "Lending your credit card, even to friends, creates significant financial and legal risks. Credit cards are personal financial tools with serious implications for your credit score, liability, and financial security. The ethical choice involves protecting both your financial wellbeing and your friend's best interests by suggesting alternative solutions.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Give it without discussing repayment",
        reflection: "Giving your credit card without discussing repayment terms creates financial risk and potential relationship damage. Ethical financial behavior requires clear communication about expectations, boundaries, and consequences. This approach shows respect for both your financial security and the importance of maintaining healthy financial relationships.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Refuse without offering any alternative help",
        reflection: "While refusing to lend your credit card is financially responsible, refusing all help may damage the relationship and leave your friend in a difficult situation. Ethical financial behavior involves finding ways to help that don't compromise financial security or create unhealthy dependencies, demonstrating both wisdom and compassion.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "You notice a billing error in your favor at a store. What's the right action?",
    options: [
      
      {
        id: "a",
        label: "Keep quiet and pay the lower amount",
        reflection: "Keeping quiet about billing errors that benefit you is financially dishonest and unethical. This behavior damages your character and can harm the business, potentially affecting employees and other customers. Ethical financial behavior requires honesty even when it's personally costly, as integrity builds the trust necessary for long-term financial relationships.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Wait to see if they notice before saying anything",
        reflection: "Waiting to see if others notice billing errors before correcting them shows poor financial ethics and character. The ethical choice involves immediate honesty and correction, demonstrating the integrity that builds trust in financial relationships. Delaying correction can damage your reputation and create complications if the error is later discovered.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Pay the correct amount and inform the cashier",
        reflection: "Exactly! You are financially responsible, ethical, and ready for adult life. Correcting billing errors in your favor demonstrates the integrity and honesty that build trust in financial relationships. This behavior shows you understand that financial responsibility includes treating others fairly, even when it costs you personally, which is essential for long-term financial success.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Point it out only if the amount is significant",
        reflection: "Ethical financial behavior requires honesty regardless of the amount involved. Small billing errors matter as much as large ones in terms of demonstrating integrity and respect for others. Consistent ethical behavior, even with small amounts, builds the character foundation necessary for responsible financial decision-making in all situations.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "A family member asks you to co-sign a loan they're not sure they can repay. What's ethical?",
    options: [
      
      {
        id: "a",
        label: "Co-sign without discussing the risks to protect their feelings",
        reflection: "Co-signing without discussing risks is financially irresponsible and potentially harmful to both parties. Ethical financial behavior requires honest communication about potential consequences, including impact on your credit and financial security. This approach shows respect for both your financial wellbeing and the importance of making informed decisions together.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Co-sign after honest discussion about risks and consequences",
        reflection: "Exactly! You are financially responsible, ethical, and ready for adult life. Co-signing after honest discussion about risks and consequences demonstrates mature financial decision-making that balances family support with personal responsibility. This approach shows you understand the serious implications of co-signing while still being willing to help family when appropriate safeguards are in place.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Refuse outright without considering their situation",
        reflection: "While refusing to co-sign can be the right choice, doing so without considering the family member's situation or discussing alternatives may damage relationships and leave them without needed support. Ethical financial behavior involves thoughtful consideration of how to help responsibly, which may include suggesting alternatives or setting appropriate conditions.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Co-sign and secretly hope they won't repay to get the item back",
        reflection: "Co-signing with intentions of repossessing collateral if payment fails shows poor financial ethics and planning. This approach creates financial risk and demonstrates lack of trust in family relationships. Ethical financial behavior requires genuine commitment to support when co-signing, or finding alternative ways to help that don't create harmful financial dependencies.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "You're offered easy money through questionable investment schemes. What do you choose?",
    options: [
      {
        id: "a",
        label: "Investigate thoroughly and seek professional advice before deciding",
        reflection: "Exactly! You are financially responsible, ethical, and ready for adult life. Investigating thoroughly and seeking professional advice before making investment decisions demonstrates the patience, discipline, and critical thinking necessary for ethical financial management. This approach protects your financial security while building knowledge and confidence in making sound financial choices.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Invest quickly before others find out about the opportunity",
        reflection: "Rushing to invest in opportunities you don't fully understand, especially when described as 'easy money,' often indicates financial schemes that are too good to be true. Ethical financial behavior requires careful research, professional guidance, and patience in decision-making to protect your financial security and build long-term wealth responsibly.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Trust the person offering because they're successful in other areas",
        reflection: "Trusting financial opportunities based on success in unrelated areas shows poor financial judgment and ethical reasoning. Financial success requires specific knowledge and experience that may not translate across different fields. Ethical financial behavior involves seeking proper credentials, documentation, and professional advice regardless of personal relationships or past success in other areas.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Pass without asking questions to avoid potential risks",
        reflection: "While avoiding risky investments is wise, passing without asking questions may mean missing legitimate opportunities or failing to develop important financial literacy. Ethical financial behavior involves educated decision-making based on proper research and professional guidance, allowing you to distinguish between legitimate investments and potential scams while building financial knowledge and confidence.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const totalStages = ETHICAL_FINANCE_CHECKPOINT_STAGES.length;
const successThreshold = totalStages;

const EthicalFinanceCheckpoint = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-100";
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
      "How do your daily financial choices reflect your ethical values?",
      "What support systems help you make responsible financial decisions?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = ETHICAL_FINANCE_CHECKPOINT_STAGES[currentStage];
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
  const stage = ETHICAL_FINANCE_CHECKPOINT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Ethical Finance Checkpoint"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={ETHICAL_FINANCE_CHECKPOINT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, ETHICAL_FINANCE_CHECKPOINT_STAGES.length)}
      totalLevels={ETHICAL_FINANCE_CHECKPOINT_STAGES.length}
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
            <span>Task</span>
            <span>Ethical Finance Checkpoint</span>
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
                        { stageId: ETHICAL_FINANCE_CHECKPOINT_STAGES[currentStage].id, isCorrect: ETHICAL_FINANCE_CHECKPOINT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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

export default EthicalFinanceCheckpoint;