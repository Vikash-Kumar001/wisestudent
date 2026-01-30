import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DIGITAL_RESPONSIBILITY_STAGES = [
  {
    id: 1,
    prompt: "Using someone else's card or account without consent is:",
    options: [
      {
        id: "a",
        label: "Normal",
        reflection: "Using someone else's card or account without their explicit consent is never normal - it's a serious violation of trust and privacy. This behavior can constitute fraud, identity theft, or unauthorized access, all of which have significant legal and financial consequences for both parties involved.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Acceptable in emergencies",
        reflection: "Even in emergencies, using someone else's financial accounts without consent is legally problematic and can damage relationships. Proper emergency financial assistance involves clear communication, seeking permission when possible, or accessing legitimate emergency funds rather than unauthorized account access.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Okay with family members",
        reflection: "Family relationships don't override the need for consent when accessing financial accounts. Each person's financial autonomy should be respected, even among family. Proper financial assistance between family members involves open communication and agreed-upon arrangements rather than unauthorized access.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Wrong and illegal",
        reflection: "Exactly! Digital misuse has serious consequences. Using someone else's card or account without consent is wrong and illegal, constituting fraud, identity theft, or unauthorized access. These actions can result in criminal charges, civil liability, damaged relationships, and long-term financial and legal problems.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What's the appropriate response if you find an unattended card or device?",
    options: [
      {
        id: "a",
        label: "Secure it and attempt to return it to the owner",
        reflection: "Exactly! This responsible approach demonstrates digital integrity and respect for others' property. Securing the item and making reasonable efforts to return it shows good citizenship and protects both the owner's financial security and your own reputation from potential misunderstandings.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Use it quickly before anyone notices",
        reflection: "Using someone else's unattended card or device is theft and fraud, regardless of circumstances. This action can result in serious legal consequences, damage to your reputation, and significant financial harm to the owner who may face unauthorized charges and compromised account security.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Ignore it and walk away",
        reflection: "While ignoring unattended financial items avoids legal risk, it doesn't help the owner who may face financial loss and security concerns. A responsible approach involves securing the item and attempting to return it, which protects both parties and demonstrates good digital citizenship.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Turn it in to authorities without trying to identify the owner",
        reflection: "Turning items into authorities is responsible, but first attempting to identify and contact the owner directly when possible shows greater consideration for their immediate needs and security concerns. This approach balances legal protection with personal responsibility for others' financial wellbeing.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How should you handle shared family accounts or devices?",
    options: [
      
      {
        id: "a",
        label: "Use them freely since you're family",
        reflection: "Family relationships don't eliminate the need for consent regarding financial accounts and devices. Each person's digital privacy and financial security should be respected. Assuming free access can lead to privacy violations, financial disputes, and damaged family relationships.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Ask for forgiveness rather than permission",
        reflection: "Asking for forgiveness after unauthorized use shows disrespect for others' digital privacy and financial security. This approach can damage trust, create financial complications, and strain relationships. Proper digital responsibility involves seeking permission before accessing others' accounts or devices.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Only avoid using them when you know others are watching",
        reflection: "Limiting unauthorized access based on observation rather than consent shows fundamentally flawed understanding of digital responsibility. Proper digital citizenship requires respecting others' privacy and financial security regardless of whether you're being monitored.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Use them only with explicit permission for specific purposes",
        reflection: "Exactly! Digital misuse has serious consequences. Using shared family accounts or devices with explicit permission for specific purposes maintains trust, respects boundaries, and prevents misunderstandings. Clear communication about access rights and limitations protects everyone's financial security and privacy.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What are the consequences of unauthorized digital financial access?",
    options: [
     
      {
        id: "a",
        label: "Minor inconvenience for the account holder",
        reflection: "Unauthorized digital financial access typically causes significant problems for account holders including financial loss, compromised security, damaged credit, time spent resolving issues, and potential identity theft risks. The impact is usually far more serious than minor inconvenience, affecting both finances and peace of mind.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Just a learning experience with no real harm",
        reflection: "Unauthorized digital access is not a harmless learning experience - it's a violation with real consequences for both parties. The legal, financial, and relationship damage can be severe and long-lasting. Proper learning about digital responsibility involves authorized practice and education, not unauthorized access.",
        isCorrect: false,
      },
       {
        id: "c",
        label: "Legal charges, damaged relationships, and financial liability",
        reflection: "Exactly! Digital misuse has serious consequences. Unauthorized access to digital financial accounts can result in criminal charges (theft, fraud, identity theft), civil liability for damages, destroyed personal relationships, and long-term impacts on credit, employment opportunities, and financial reputation that can last years.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Easily resolved by explaining your intentions",
        reflection: "Even with good intentions, unauthorized digital access creates serious trust issues and potential legal problems. Simply explaining intentions doesn't resolve the fundamental violation of privacy and security. Proper digital responsibility requires obtaining consent before accessing others' financial accounts or devices.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's the best practice for maintaining digital financial security?",
    options: [
      
      {
        id: "a",
        label: "Share passwords with trusted friends for convenience",
        reflection: "Sharing passwords, even with trusted friends, compromises digital security for both parties and creates potential legal and financial risks. Proper digital security involves maintaining individual account protection and using legitimate shared access methods when appropriate, rather than password sharing.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Protect your own accounts and respect others' digital boundaries",
        reflection: "Exactly! Digital misuse has serious consequences. Maintaining digital financial security involves protecting your own accounts through strong passwords, monitoring activity, and secure practices, while simultaneously respecting others' digital boundaries through consent, communication, and responsible behavior regarding their financial information and devices.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Use others' accounts when yours are temporarily unavailable",
        reflection: "Using others' accounts when your own are unavailable is unauthorized access regardless of the reason. This practice creates security risks, potential legal issues, and relationship problems. Proper digital responsibility involves planning ahead, using legitimate alternatives, or seeking authorized assistance rather than unauthorized access.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Monitor others' accounts to help protect them",
        reflection: "Monitoring others' accounts without their explicit consent violates their privacy and digital autonomy, even with good intentions. Proper digital citizenship involves respecting others' privacy while encouraging them to maintain their own security through education and open communication about best practices.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const totalStages = DIGITAL_RESPONSIBILITY_STAGES.length;
const successThreshold = totalStages;

const DigitalResponsibility = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-97";
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
      "What digital boundaries do you maintain to protect your own financial security?",
      "How can you better respect others' digital financial privacy and autonomy?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = DIGITAL_RESPONSIBILITY_STAGES[currentStage];
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
  const stage = DIGITAL_RESPONSIBILITY_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Digital Responsibility"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={DIGITAL_RESPONSIBILITY_STAGES.length}
      currentLevel={Math.min(currentStage + 1, DIGITAL_RESPONSIBILITY_STAGES.length)}
      totalLevels={DIGITAL_RESPONSIBILITY_STAGES.length}
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
            <span>Digital Responsibility</span>
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
                        { stageId: DIGITAL_RESPONSIBILITY_STAGES[currentStage].id, isCorrect: DIGITAL_RESPONSIBILITY_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Digital financial integrity</strong>
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
              Skill unlocked: <strong>Digital financial integrity</strong>
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

export default DigitalResponsibility;