import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const CulturalGreeting = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-teen-11";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Meeting a Japanese exchange student for the first time. What's the most respectful greeting?",
      options: [
        { 
          id: "a", 
          text: "Bow slightly and say 'Konnichiwa'", 
          emoji: "👋",
          // description: "Shows respect for their culture",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "High five enthusiastically", 
          emoji: "🙌",
          // description: "May be too informal",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Hug them immediately", 
          emoji: "🤗",
          // description: "Personal space is valued",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Greeting an elderly person in your community. What's the most respectful approach?",
      options: [
        { 
          id: "b", 
          text: "Hey dude!", 
          emoji: "👋",
          // description: "Too casual",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Use respectful title (Sir/Ma'am) and maintain eye contact", 
          emoji: "👴",
          // description: "Shows proper respect",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ignore them", 
          emoji: "🙈",
          // description: "Disrespectful",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Meeting a Muslim classmate during Ramadan. How should you greet them respectfully?",
      options: [
        { 
          id: "a", 
          text: "Ramadan Mubarak! How is your fast going?", 
          emoji: "🕌",
          // description: "Acknowledges their practice",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Want some food?", 
          emoji: "🍽️",
          // description: "Insensitive to fasting",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Why aren't you eating?", 
          emoji: "❓",
          // description: "Shows lack of awareness",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Greeting a teacher from a different cultural background. What's the most respectful greeting?",
      options: [
        { 
          id: "b", 
          text: "Yo, what's up!", 
          emoji: "👋",
          // description: "Too informal",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Hey teacher!", 
          emoji: "👋",
          // description: "Lacks proper respect",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Good morning, [Title] [Last Name]", 
          emoji: "👨‍🏫",
          // description: "Professional and respectful",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Meeting someone who uses a wheelchair. What's the most respectful greeting?",
      options: [
        { 
          id: "a", 
          text: "Make eye contact and greet them normally at their level", 
          emoji: "♿",
          // description: "Treats them equally",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Lean down and speak slowly like to a child", 
          emoji: "😕",
          // description: "Condescending",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Avoid greeting to not seem awkward", 
          emoji: "🙈",
          // description: "Exclusionary",
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered || levelCompleted) return;
    
    setAnswered(true);
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
        resetFeedback();
      } else {
        setLevelCompleted(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Cultural Greeting"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="uvls"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={levelCompleted && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map(option => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={answered}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{option.text}</h4>
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default CulturalGreeting;
