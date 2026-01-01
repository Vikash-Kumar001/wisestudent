import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getBrainKidsGames } from "../../../../pages/Games/GameCategories/Brain/kidGamesData";

const LostMatchStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-55");
  const gameId = gameData?.id || "brain-kids-55";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for LostMatchStory, using fallback ID");
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
      const games = getBrainKidsGames({});
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
  
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Team loses a game. Best thought?",
      options: [
        { 
          id: "improve", 
          text: "Next time we'll improve!", 
          emoji: "📈", 
          
          isCorrect: true
        },
        { 
          id: "losers", 
          text: "We're losers", 
          emoji: "😢", 
          isCorrect: false
        },
        { 
          id: "giveup", 
          text: "Give up", 
          emoji: "😔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Failed test. Positive thought?",
      options: [
        { 
          id: "dumb", 
          text: "I'm dumb", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          id: "study", 
          text: "Study more next time!", 
          emoji: "📚",  
          isCorrect: true
        },
        { 
          id: "skip", 
          text: "Skip school", 
          emoji: "🚶", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Fell off bike. Best thought?",
      options: [
        { 
          id: "never", 
          text: "Never ride again", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          id: "hate", 
          text: "Hate bike", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          id: "practice", 
          text: "Practice makes perfect!", 
          emoji: "🚴", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Drawing didn't win. What to think?",
      options: [
        { 
          id: "newideas", 
          text: "Try new ideas next!", 
          emoji: "🎨", 
          isCorrect: true
        },
        { 
          id: "bad", 
          text: "I'm bad at art", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          id: "stop", 
          text: "Stop drawing", 
          emoji: "✋", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Missed goal. Positive thought?",
      options: [
        { 
          id: "terrible", 
          text: "I'm terrible", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          id: "quit", 
          text: "Quit team", 
          emoji: "🚪", 
          isCorrect: false
        },
        { 
          id: "practice2", 
          text: "Keep practicing!", 
          emoji: "⚽", 
          isCorrect: true
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
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Lost Match Story game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, questions.length]);

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Lost Match Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
      backPath="/games/brain-health/kids"
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
        {!showResult && currentQuestionData ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                <span className="text-white/80 text-xs sm:text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-xs sm:text-sm md:text-base">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-base sm:text-lg md:text-xl mb-4 sm:mb-5 md:mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 active:scale-95 text-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full"
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">{option.text}</h3>
                    <p className="text-white/90 text-xs sm:text-sm md:text-base leading-tight sm:leading-normal">{option.description}</p>
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

export default LostMatchStory;
