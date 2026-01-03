import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const CommunicationProBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-teen-70");
  const gameId = gameData?.id || "uvls-teen-70";
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getUvlsTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const challenges = [
    {
      id: 1,
      title: "Public Speaking Challenge",
      question: "You need to give a presentation. What's the best communication approach?",
      options: [
        
        { 
          text: "Wing it and hope for the best", 
          emoji: "😅", 
          isCorrect: false
        },
        { 
          text: "Read directly from slides without looking up", 
          emoji: "📄", 
          isCorrect: false
        },
        { 
          text: "Use a monotone voice and avoid eye contact", 
          emoji: "🤐", 
          isCorrect: false
        },
        { 
          text: "Prepare thoroughly, practice, and engage the audience", 
          emoji: "🎤", 
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      title: "Difficult Conversation",
      question: "You need to address a conflict with a peer. What's the best approach?",
      options: [
        { 
          text: "Use 'I' statements, listen actively, and seek understanding", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          text: "Avoid the conversation completely", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Blame them and demand they change", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Yell to make your point clear", 
          emoji: "🗣️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Written Communication",
      question: "You need to write an important email. What's the best approach?",
      options: [
        
        { 
          text: "Use all caps and lots of exclamation marks", 
          emoji: "❗", 
          isCorrect: false
        },
        { 
          text: "Write a very long, rambling message", 
          emoji: "📝", 
          isCorrect: false
        },
        { 
          text: "Be clear, concise, professional, and proofread", 
          emoji: "📧", 
          isCorrect: true
        },
        { 
          text: "Use slang and informal language", 
          emoji: "💬", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Active Listening",
      question: "Someone is sharing something important with you. What's the best approach?",
      options: [
       
        { 
          text: "Interrupt with your own stories", 
          emoji: "🗣️", 
          isCorrect: false
        },
         { 
          text: "Give full attention, ask clarifying questions, and reflect back what you heard", 
          emoji: "👂", 
          isCorrect: true
        },
        { 
          text: "Check your phone while they talk", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Think about what you'll say next instead of listening", 
          emoji: "💭", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Nonverbal Communication",
      question: "You're in an important meeting. What's the best nonverbal approach?",
      options: [
        
        { 
          text: "Slouch, avoid eye contact, and fidget constantly", 
          emoji: "😔", 
          isCorrect: false
        },
        { 
          text: "Stare intensely without blinking", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Maintain eye contact, open posture, and appropriate gestures", 
          emoji: "👁️", 
          isCorrect: true
        },
        { 
          text: "Cross your arms and lean back", 
          emoji: "💪", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 500);
  };

  const currentChallengeData = challenges[challenge];

  return (
    <GameShell
      title="Badge: Communication Pro"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="uvls"
      totalLevels={challenges.length}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentChallengeData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{currentChallengeData.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallengeData.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallengeData.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleChoice(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === idx
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-white font-semibold">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default CommunicationProBadge;
