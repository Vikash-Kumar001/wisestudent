import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const InclusiveClassSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-teen-14";
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
      text: "You're designing a group activity. How should roles be assigned to ensure all students can participate?",
      options: [
        { 
          id: "a", 
          text: "Different roles for different strengths", 
          emoji: "👥",
          // description: "Leverages everyone's abilities",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Everyone does the exact same role", 
          emoji: "🔄",
          // description: "Doesn't accommodate different abilities",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Only high achievers get lead roles", 
          emoji: "⭐",
          // description: "Excludes many students",
          isCorrect: false
        },
        { 
          id: "d", 
          text: "Let students pick their own roles", 
          emoji: "🎲",
          // description: "May lead to exclusion",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should time be structured in an inclusive classroom activity?",
      options: [
        { 
          id: "b", 
          text: "Strict time limit for everyone", 
          emoji: "⏱️",
          // description: "Doesn't accommodate different paces",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Flexible timing with breaks", 
          emoji: "⏰",
          // description: "Accommodates different needs",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Unlimited time only for some", 
          emoji: "🚫",
          // description: "Creates unfair advantage",
          isCorrect: false
        },
        { 
          id: "d", 
          text: "No time structure at all", 
          emoji: "❌",
          // description: "Lacks organization",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What materials should be provided to make an activity inclusive?",
      options: [
        { 
          id: "a", 
          text: "Multiple format options (text, audio, visual)", 
          emoji: "📚",
          // description: "Accommodates different learning styles",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Only textbooks provided", 
          emoji: "📖",
          // description: "Limits accessibility",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Digital only (no alternatives)", 
          emoji: "💻",
          // description: "Excludes those without access",
          isCorrect: false
        },
        { 
          id: "d", 
          text: "No materials provided", 
          emoji: "🚫",
          // description: "Not helpful for learning",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How should group formation work in an inclusive activity?",
      options: [
        { 
          id: "b", 
          text: "Let popular students choose teams", 
          emoji: "👑",
          // description: "Leads to exclusion",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Group only similar students", 
          emoji: "👥",
          // description: "Limits diversity",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Diverse groups with mixed abilities", 
          emoji: "🌈",
          // description: "Promotes inclusion and learning",
          isCorrect: true
        },
        { 
          id: "d", 
          text: "Let students work alone", 
          emoji: "🚶",
          // description: "Misses collaboration benefits",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What communication approach ensures all students can participate?",
      options: [
        { 
          id: "a", 
          text: "Multiple communication methods (verbal, written, visual)", 
          emoji: "💬",
          // description: "Accommodates different communication needs",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Only spoken instructions", 
          emoji: "🗣️",
          // description: "Excludes those with hearing difficulties",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Only written instructions", 
          emoji: "📝",
          // description: "Excludes those with reading difficulties",
          isCorrect: false
        },
        { 
          id: "d", 
          text: "No instructions given", 
          emoji: "🤷",
          // description: "Not helpful for anyone",
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
      title="Inclusive Class Simulation"
      subtitle={levelCompleted ? "Simulation Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default InclusiveClassSimulation;
