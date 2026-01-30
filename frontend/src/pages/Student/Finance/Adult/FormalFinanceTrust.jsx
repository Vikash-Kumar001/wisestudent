import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FORMAL_FINANCE_STAGES = [
  {
    id: 1,
    prompt: "Scenario: Why should people use formal financial systems?",
    options: [
      {
        id: "unregulated",
        label: "They are unregulated",
        reflection: "Actually, formal financial systems are regulated, not unregulated. Regulation is what provides consumer protections, oversight, and accountability that informal systems typically lack.",
        isCorrect: false,
      },
      
      {
        id: "free",
        label: "They offer services for free",
        reflection: "While some services might be low-cost, formal financial systems aren't necessarily free. Their main advantage is the protection, security, and accountability they provide rather than being free.",
        isCorrect: false,
      },
      {
        id: "protection",
        label: "They offer protection and accountability",
        reflection: "Exactly! Formal financial systems offer protection and accountability through regulation, legal frameworks, and oversight bodies. This protects consumers and ensures fair practices.",
        isCorrect: true,
      },
      {
        id: "convenience",
        label: "They are always more convenient",
        reflection: "While formal systems can be convenient, convenience isn't their primary advantage. The main benefit is the regulatory protection and accountability they provide, not necessarily convenience.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 2,
    prompt: "What's a key benefit of using regulated financial institutions?",
    options: [
     
      {
        id: "speed",
        label: "Faster transaction processing",
        reflection: "While formal institutions may be efficient, speed isn't their primary benefit. The main advantage is the protection and security provided by regulation, not necessarily processing speed.",
        isCorrect: false,
      },
       {
        id: "regulation",
        label: "Government oversight and consumer protection",
        reflection: "Perfect! Government oversight and consumer protection are key benefits of regulated financial institutions. This includes deposit insurance, dispute resolution mechanisms, and transparency requirements.",
        isCorrect: true,
      },
      {
        id: "low",
        label: "Lower fees than all alternatives",
        reflection: "Lower fees aren't guaranteed with formal institutions. The main benefit is protection and security, not necessarily lower costs compared to all alternatives.",
        isCorrect: false,
      },
      {
        id: "exclusive",
        label: "Exclusive access to special products",
        reflection: "While formal institutions offer various products, exclusivity isn't the primary benefit. The main advantage is regulatory protection and consumer safeguards.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 3,
    prompt: "How do formal financial systems reduce exploitation?",
    options: [
      {
        id: "transparency",
        label: "Through transparency and regulatory oversight",
        reflection: "Excellent! Formal financial systems reduce exploitation through transparency and regulatory oversight, which mandate disclosure of terms, fees, and risks, protecting consumers from unfair practices.",
        isCorrect: true,
      },
      {
        id: "technology",
        label: "By using advanced technology",
        reflection: "While technology can be a feature of formal systems, it's not the primary way they reduce exploitation. The main protection comes from regulation, transparency, and oversight.",
        isCorrect: false,
      },
      {
        id: "size",
        label: "Due to their large size",
        reflection: "Size alone doesn't reduce exploitation. Formal systems reduce exploitation through regulation and oversight, not simply because they're large organizations.",
        isCorrect: false,
      },
      {
        id: "marketing",
        label: "Through better marketing and PR",
        reflection: "Marketing and PR don't reduce exploitation. Formal systems provide protection through regulatory frameworks, transparency requirements, and oversight mechanisms.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
  {
    id: 4,
    prompt: "What's a warning sign of an untrustworthy financial service?",
    options: [
      
      {
        id: "reviews",
        label: "Having customer reviews available",
        reflection: "Having customer reviews available is actually a positive sign of transparency, not a warning sign. It allows potential customers to evaluate the service based on others' experiences.",
        isCorrect: false,
      },
      {
        id: "disclosure",
        label: "Clear fee and term disclosures",
        reflection: "Clear fee and term disclosures are signs of a trustworthy financial service, not warning signs. Transparency is a hallmark of reputable institutions.",
        isCorrect: false,
      },
      {
        id: "complaints",
        label: "Having a formal complaints procedure",
        reflection: "Having a formal complaints procedure is actually a sign of a reputable institution that operates under regulatory oversight, not a warning sign.",
        isCorrect: false,
      },
      {
        id: "unregulated",
        label: "Lack of government licensing or regulation",
        reflection: "Exactly! Lack of government licensing or regulation is a major warning sign of an untrustworthy financial service. Reputable financial institutions operate under regulatory oversight for consumer protection.",
        isCorrect: true,
      },
    ],
    reward: 4,
  },
  {
    id: 5,
    prompt: "What's the long-term benefit of using formal financial systems?",
    options: [
      
      {
        id: "returns",
        label: "Higher returns on investments",
        reflection: "Higher returns aren't guaranteed with formal systems. While they may offer competitive products, the main benefit is security and protection, not necessarily higher returns.",
        isCorrect: false,
      },
      {
        id: "network",
        label: "Access to a wider network of partners",
        reflection: "While formal institutions may have partnerships, the main benefit of using formal systems is regulatory protection and security, not network access.",
        isCorrect: false,
      },
      {
        id: "security",
        label: "Greater financial security and legal recourse",
        reflection: "Exactly! Using formal financial systems provides greater financial security and legal recourse in case of disputes or problems, thanks to regulatory protections and legal frameworks.",
        isCorrect: true,
      },
      {
        id: "status",
        label: "Enhanced social status",
        reflection: "Social status isn't a benefit of formal financial systems. The real advantages are protection, security, transparency, and legal recourse when needed.",
        isCorrect: false,
      },
    ],
    reward: 4,
  },
];

const totalStages = FORMAL_FINANCE_STAGES.length;
const successThreshold = totalStages;

const FormalFinanceTrust = () => {
  const location = useLocation();
  const gameId = "finance-adults-95";
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
      "How can you identify trustworthy formal financial institutions?",
      "What questions should you ask before engaging with any financial service?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FORMAL_FINANCE_STAGES[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);
    
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
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
      showCorrectAnswerFeedback(1, true);
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
  const stage = FORMAL_FINANCE_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Formal Finance Trust"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FORMAL_FINANCE_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FORMAL_FINANCE_STAGES.length)}
      totalLevels={FORMAL_FINANCE_STAGES.length}
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
            <span>Formal Finance</span>
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
              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      const updatedHistory = [
                        ...history,
                        { stageId: FORMAL_FINANCE_STAGES[currentStage].id, isCorrect: FORMAL_FINANCE_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Formal Finance Awareness</strong>
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
              Skill unlocked: <strong>Formal Finance Awareness</strong>
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

export default FormalFinanceTrust;