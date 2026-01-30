import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FAKE_CUSTOMER_SUPPORT_STAGES = [
  {
    id: 1,
    prompt: "You find a support number in a random comment section. Is it safe?",
    options: [
      {
        id: "a",
        label: "No, use official sources only",
        reflection: "Exactly! Fake support numbers steal data. Always use official support channels like the company's official website, app, or verified customer service numbers. Random comment sections are breeding grounds for fake support scams.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Yes",
        reflection: "Using a support number found in random comment sections is extremely risky. These numbers are often fake and lead to scammers who will try to steal your personal information, passwords, or money under the guise of helping you.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Only if it has many upvotes",
        reflection: "Even numbers with many upvotes in comment sections can be fake. Scammers often manipulate upvote systems or create fake accounts to make their fraudulent support numbers appear legitimate. Always verify through official company channels instead.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Yes, if it looks professional",
        reflection: "Professional appearance can be easily faked by scammers. They can create convincing fake websites, use professional language, and even provide fake credentials. Don't rely on appearance alone - always verify support numbers through official company sources.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What's the main risk of using fake customer support?",
    options: [
      {
        id: "a",
        label: "Slow response time",
        reflection: "While slow response time can be frustrating, it's not the main security risk. The real danger with fake customer support is data theft, financial loss, and identity fraud, not just delays in getting help.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Incorrect advice",
        reflection: "While fake support may provide incorrect advice, this is more of an inconvenience than a major security risk. The primary concern is that scammers use fake support to gain access to your accounts and personal information for fraudulent purposes.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Language barriers",
        reflection: "Language barriers might make communication difficult, but they don't pose the same security threat as fake support numbers. The real danger is that scammers use these numbers to steal your data and money, regardless of language proficiency.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Data theft and financial loss",
        reflection: "Exactly! The main risk of fake customer support is data theft and financial loss. Scammers posing as support agents will try to obtain your personal information, passwords, account details, and ultimately steal your money or identity.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How can you verify a customer support number is legitimate?",
    options: [
      {
        id: "a",
        label: "Check if it's toll-free",
        reflection: "Toll-free numbers don't guarantee legitimacy. Scammers can easily obtain toll-free numbers to appear more professional and trustworthy. The key is to verify the number through official company channels, not just whether it's toll-free.",
        isCorrect: false,
      },
     
      {
        id: "b",
        label: "Ask other users online",
        reflection: "Asking other users online isn't a reliable verification method. Other users might also be victims of the same scam, or scammers might be posing as helpful users to spread fake support numbers. Always verify through official company sources.",
        isCorrect: false,
      },
       {
        id: "c",
        label: "Verify through the company's official website",
        reflection: "Exactly! Verifying through the company's official website is the most reliable way to confirm a customer support number's legitimacy. Official websites provide verified contact information that scammers can't easily replicate or manipulate.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Trust your instincts about the number",
        reflection: "While instincts can be helpful, they're not reliable for verifying support numbers. Scammers are skilled at creating convincing fake numbers and scenarios. Always use objective verification methods through official company channels.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What should you do if you've already contacted fake support?",
    options: [
      {
        id: "a",
        label: "Ignore it and hope nothing happens",
        reflection: "Ignoring potential exposure to fake support is dangerous. If you've shared personal information or login credentials, immediate action is necessary to protect your accounts and prevent further damage from data theft or fraudulent access.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Change passwords and monitor accounts",
        reflection: "Exactly! If you've contacted fake support, immediately change passwords for all affected accounts and monitor your financial accounts for unauthorized activity. Report the incident to the actual company and relevant authorities to prevent further damage.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Contact the fake support again to clarify",
        reflection: "Contacting fake support again will likely make the situation worse by providing scammers with more information or access to your accounts. Once you realize it's fake, cut off all contact and focus on securing your legitimate accounts.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Share the experience on social media",
        reflection: "While sharing your experience can warn others, it might also expose you to further risks or provide scammers with information about your response. Focus first on securing your accounts, then consider sharing your experience through appropriate channels.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "Which scenario indicates a potential fake support scam?",
    options: [
       {
        id: "a",
        label: "Number found in YouTube comments",
        reflection: "Exactly! Numbers found in YouTube comments are a common source of fake support scams. Scammers post fake support numbers in comments sections, hoping viewers will call them when they need help, then attempt to steal personal information or money.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Support number from official app",
        reflection: "A support number from an official app is generally legitimate. Official apps are controlled by the company and provide verified contact information. This represents proper customer service channels, not a scam.",
        isCorrect: false,
      },
     
      {
        id: "c",
        label: "Number from company's contact page",
        reflection: "A number from a company's official contact page is typically legitimate. Official contact pages are maintained by the company and provide verified customer service information. This represents proper support channels, not a scam.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Number provided by a friend",
        reflection: "While a number provided by a friend might be well-intentioned, it's not necessarily legitimate. Friends can unknowingly share fake numbers they found online, or the number might be outdated. Always verify support numbers through official company sources.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const totalStages = FAKE_CUSTOMER_SUPPORT_STAGES.length;
const successThreshold = totalStages;

const FakeCustomerSupport = () => {
  const location = useLocation();
  const gameId = "finance-young-adult-88";
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
      "What verification steps do you currently take before contacting customer support?",
      "How can you better protect yourself from fake support scams and fraudulent customer service?",
    ],
    []
  );

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = FAKE_CUSTOMER_SUPPORT_STAGES[currentStage];
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
  const stage = FAKE_CUSTOMER_SUPPORT_STAGES[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Fake Customer Support"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FAKE_CUSTOMER_SUPPORT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FAKE_CUSTOMER_SUPPORT_STAGES.length)}
      totalLevels={FAKE_CUSTOMER_SUPPORT_STAGES.length}
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
            <span>Fake Customer Support</span>
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
                        { stageId: FAKE_CUSTOMER_SUPPORT_STAGES[currentStage].id, isCorrect: FAKE_CUSTOMER_SUPPORT_STAGES[currentStage].options.find(opt => opt.id === selectedOption)?.isCorrect },
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
                    Skill unlocked: <strong>Support scam detection</strong>
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
              Skill unlocked: <strong>Support scam detection</strong>
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

export default FakeCustomerSupport;