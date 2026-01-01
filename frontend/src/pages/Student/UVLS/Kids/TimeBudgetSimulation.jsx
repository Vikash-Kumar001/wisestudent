import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsKidsGames } from '../../../../pages/Games/GameCategories/UVLS/kidGamesData';

const TimeBudgetSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-98");
  const gameId = gameData?.id || "uvls-kids-98";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for TimeBudgetSimulation, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
    try {
      const games = getUvlsKidsGames({});
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
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Time Before Bed",
      question: "You have 2 hours (120 minutes) before bedtime. How should you spend your time?",
      options: [
        { 
          text: "Study for 1 hour, have fun for 30 minutes, prepare for sleep for 30 minutes - Good balance of learning and rest", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Spend all time playing games - Fun is more important than rest", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          text: "Sleep immediately without any activities - Skip all other activities", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Study for the entire time - Learning is the only priority", 
          emoji: "📖", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Afternoon Planning",
      question: "You have 3 hours (180 minutes) in the afternoon. How should you plan your time?",
      options: [
        
        { 
          text: "Play for the entire time - Afternoon is for fun only", 
          emoji: "⚽", 
          isCorrect: false
        },
        { 
          text: "Do chores for the entire time - Help family all afternoon", 
          emoji: "🧹", 
          isCorrect: false
        },
        { 
          text: "Do homework for 1 hour, play for 1 hour, help with chores for 1 hour - Balanced approach", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Avoid all activities - Just relax without doing anything", 
          emoji: "🛋️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Evening Balance",
      question: "You have 1 hour (60 minutes) in the evening. How should you use your time?",
      options: [
        { 
          text: "Read for 20 min, exercise for 20 min, rest for 20 min - Good variety and balance", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Read for the entire hour - Focus only on learning", 
          emoji: "📖", 
          isCorrect: false
        },
        { 
          text: "Exercise for the entire hour - Physical activity is most important", 
          emoji: "🏃", 
          isCorrect: false
        },
        { 
          text: "Rest for the entire hour - Relax without other activities", 
          emoji: "😴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Weekend Planning",
      question: "You have 4 hours (240 minutes) on the weekend. How should you structure your day?",
      options: [
        
        { 
          text: "Focus only on hobbies - Spend all time on personal interests", 
          emoji: "🎨", 
          isCorrect: false
        },
        { 
          text: "Spend time with family, work on hobbies, study a bit, and have fun - Well-rounded day", 
          emoji: "👨‍👩‍👧", 
          isCorrect: true
        },
        { 
          text: "Study for the entire time - Use weekend for learning", 
          emoji: "📝", 
          isCorrect: false
        },
        { 
          text: "Just have fun the whole time - Weekend is for entertainment only", 
          emoji: "🎉", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "After School Time",
      question: "You have 2.5 hours (150 minutes) after school. How should you use this time?",
      options: [
        
        { 
          text: "Watch TV for the entire time - Relax after school", 
          emoji: "📺", 
          isCorrect: false
        },
        { 
          text: "Help at home for the entire time - Focus only on chores", 
          emoji: "🧹", 
          isCorrect: false
        },
        { 
          text: "Just prepare for tomorrow - Focus only on school work", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          text: "Help at home, relax by watching TV, prepare for tomorrow - Good balance of responsibilities", 
          emoji: "🏠", 
          isCorrect: true
        },
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

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const handleNext = () => {
    if (nextGamePath) {
      navigate(nextGamePath);
    } else {
      navigate("/games/uvls/kids");
    }
  };

  return (
    <GameShell
      title="Time Budget Simulation"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Simulation Complete!"}
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
      backPath="/games/uvls/kids"
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && challenges[challenge] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{challenges[challenge].title}</h3>
              <p className="text-white text-lg mb-6">
                {challenges[challenge].question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges[challenge].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedAnswer(index);
                      handleChoice(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === index
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Time Budget Simulation Complete!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You understand how to manage your time well!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Good time management involves balancing study, play, rest, helping at home, and preparing for tomorrow. A well-structured day includes time for all important activities.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Remember: Good time management requires balancing all activities!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Consider how to balance study, play, rest, and responsibilities!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TimeBudgetSimulation;