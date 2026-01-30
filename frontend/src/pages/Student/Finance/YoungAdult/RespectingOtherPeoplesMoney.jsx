import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RESPECTING_OTHER_PEOPLES_MONEY_STAGES = [
  {
    id: 1,
    prompt: "Borrowing from friends requires:",
    options: [
      {
        id: "a",
        label: "Casual attitude",
        reflection: "Borrowing from friends with a casual attitude can damage relationships and create financial stress for both parties. Money matters, even between friends, should be handled with seriousness and respect to maintain trust and preserve the friendship.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Clear commitment and respect",
        reflection: "Exactly! Respect preserves relationships. Borrowing from friends requires clear communication about terms, realistic timelines, and genuine respect for their financial situation. This approach maintains trust and demonstrates that you value both the money and the relationship.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Assuming they'll understand if you're late",
        reflection: "Assuming friends will automatically understand late payments shows disrespect for their financial planning and needs. Clear communication about payment expectations and timelines is essential to maintaining the relationship and their trust in your financial responsibility.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Borrowing as much as they can afford to lose",
        reflection: "Borrowing based on what friends can 'afford to lose' is financially irresponsible and can create serious problems for them. Responsible borrowing involves assessing what they can comfortably spare without hardship and ensuring you can realistically repay according to agreed terms.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What's the best approach before borrowing money from a friend?",
    options: [
      
      {
        id: "a",
        label: "Ask casually without specific details",
        reflection: "Casual borrowing requests without specifics can create misunderstandings and financial stress for your friend. They need clear information to make an informed decision about lending and to plan their own finances appropriately. Vague requests show disrespect for their financial situation.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Explain your situation and proposed repayment plan clearly",
        reflection: "Exactly! This respectful approach demonstrates that you value their money and the relationship. Clear communication about your needs, how much you require, when you'll repay, and what happens if difficulties arise shows maturity and respect for their financial situation and decision-making process.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Borrow small amounts frequently to avoid big requests",
        reflection: "Frequent small borrowing can actually be more problematic than larger, less frequent requests. It creates ongoing financial drain for your friend, makes tracking more difficult, and can strain the relationship through repeated obligations without clear resolution.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Only ask if you're confident you'll remember to repay",
        reflection: "Confidence in remembering to repay isn't enough - you should always treat borrowed money with seriousness. Relationships involve supporting each other through difficulties, which means having respectful conversations about payment if problems arise, rather than simply relying on memory and hope.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How should you handle borrowed money if you encounter payment difficulties?",
    options: [
      
      {
        id: "a",
        label: "Wait to see if they notice before saying anything",
        reflection: "Waiting for your friend to notice payment problems shows disrespect for their financial needs and creates unnecessary stress and damaged trust. They're planning around your expected repayment, so discovering later that you're struggling with payment obligations causes them both financial hardship and hurt feelings.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Blame unexpected circumstances for all payment delays",
        reflection: "Regularly blaming external circumstances for payment delays comes across as disrespectful of both your commitment and your friend's financial planning needs. Occasional honesty about exceptional problems demonstrates the thoughtful attitude toward lending relationships - genuine trouble situations acknowledged坦诚ly.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Communicate immediately and honestly about your situation",
        reflection: "Exactly! Respect preserves relationships. Prompt, honest communication when facing payment difficulties shows respect for your friend and often leads to understanding and workable solutions. Hiding the problem or making excuses typically damages relationships and trust much more than坦诚 discussions about financial hardship.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Borrow from others to cover payments to avoid disappointing them",
        reflection: "Borrowing from others to cover payments to friends creates a dangerous cycle that can lead to deeper financial problems and damage multiple relationships. This approach doesn't address the underlying financial issues and can make the situation worse for everyone involved, including the original lender.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What's the impact of respectful borrowing on friendships?",
    options: [
      {
        id: "a",
        label: "Strengthens trust and deepens the relationship",
        reflection: "Exactly! Respect preserves relationships. When borrowing is handled with respect, clear communication, and reliable follow-through, it can actually strengthen friendships by demonstrating maturity, trustworthiness, and genuine regard for the other person's wellbeing and financial situation.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Creates awkwardness that damages the friendship",
        reflection: "Respectful borrowing handled with maturity and clear communication actually reduces awkwardness rather than creating it. The awkwardness typically comes from disrespectful handling - casual attitudes, poor communication, or unreliable repayment - not from the act of borrowing itself when done properly.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Has no real impact on the friendship",
        reflection: "Money matters significantly impact friendships, particularly when one person is trusting the other with their financial resources. How borrowing is handled - with respect and clear commitment versus casual disregard - directly affects trust levels and the overall health of the relationship.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Always leads to complications regardless of approach",
        reflection: "While borrowing from friends always involves some risk, respectful approaches with clear communication and reliable follow-through significantly reduce complications. The key is treating the borrowed money with appropriate seriousness and maintaining open, honest communication throughout the lending period.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's the best practice for maintaining the relationship after borrowing?",
    options: [
      
      {
        id: "a",
        label: "Act like it never happened to avoid awkwardness",
        reflection: "Pretending the borrowing never happened can actually create more awkwardness and show disrespect for their financial support. Acknowledging the help and expressing gratitude demonstrates maturity and appreciation for their trust and assistance, which strengthens rather than weakens the relationship.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Avoid discussing money matters with them in the future",
        reflection: "Avoiding money discussions entirely isn't necessary or healthy. Respectful, open communication about financial matters actually strengthens relationships by building trust and demonstrating maturity. The key is handling money discussions with appropriate seriousness and consideration for the other person's perspective.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Owe them a favor in return without specific commitment",
        reflection: "Vague notions of owing favors without specific commitments can create uncertainty and potential awkwardness. If you want to reciprocate their help, it's better to be specific about how and when you'll support them, rather than leaving it as an undefined obligation that may never be fulfilled.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Express genuine gratitude and follow through on commitments",
        reflection: "Exactly! Respect preserves relationships. Expressing genuine gratitude for their trust and financial support, then following through reliably on your commitments, demonstrates that you value both the money and the relationship. This approach builds trust and shows respect for their willingness to help.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
];

const totalStages = RESPECTING_OTHER_PEOPLES_MONEY_STAGES.length;
const successThreshold = totalStages;

const RespectingOtherPeoplesMoney = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-96";
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
      "What borrowing practices show respect for friends' financial situations?",
      "How can you maintain friendships while handling money matters responsibly?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = RESPECTING_OTHER_PEOPLES_MONEY_STAGES[currentStage];
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
  const stage = RESPECTING_OTHER_PEOPLES_MONEY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Respecting Other People's Money"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={RESPECTING_OTHER_PEOPLES_MONEY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, RESPECTING_OTHER_PEOPLES_MONEY_STAGES.length)}
      totalLevels={RESPECTING_OTHER_PEOPLES_MONEY_STAGES.length}
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
            <span>Respecting Other People's Money</span>
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
                        { stageId: RESPECTING_OTHER_PEOPLES_MONEY_STAGES[currentStage].id, isCorrect: RESPECTING_OTHER_PEOPLES_MONEY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Respectful financial relationships</strong>
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
              Skill unlocked: <strong>Respectful financial relationships</strong>
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

export default RespectingOtherPeoplesMoney;