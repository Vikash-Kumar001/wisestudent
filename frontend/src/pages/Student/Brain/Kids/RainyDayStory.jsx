import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RainyDayStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-51");
  const gameId = gameData?.id || "brain-kids-51";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RainyDayStory, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Picnic cancelled due to rain. Kid feels sad. Best thought?",
      options: [
        { 
          id: "indoor", 
          text: "We can play indoor games!", 
          emoji: "🎮", 
          
          isCorrect: true
        },
        { 
          id: "ruined", 
          text: "It's ruined forever", 
          emoji: "😢", 
          
          isCorrect: false
        },
        { 
          id: "hate", 
          text: "Hate rain", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Trip delayed by traffic. Best positive thought?",
      options: [
        { 
          id: "worst", 
          text: "This is the worst", 
          emoji: "😤", 
          isCorrect: false
        },
        { 
          id: "enjoy", 
          text: "Enjoy the ride and chat", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          id: "blame", 
          text: "Blame driver", 
          emoji: "👆", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Forgot lunch at home. What to think?",
      options: [
        { 
          id: "share", 
          text: "Share with friends!", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          id: "starve", 
          text: "Starve all day", 
          emoji: "😰", 
          isCorrect: false
        },
        { 
          id: "angry", 
          text: "Be angry", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Power outage during movie. Best thought?",
      options: [
        { 
          id: "boring", 
          text: "Boring now", 
          emoji: "😑", 
          isCorrect: false
        },
        { 
          id: "complain", 
          text: "Complain", 
          emoji: "😤", 
          isCorrect: false
        },
        { 
          id: "stories", 
          text: "Tell stories in dark!", 
          emoji: "📖", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Missed bus to school. Positive thought?",
      options: [
        { 
          id: "late", 
          text: "Late forever", 
          emoji: "😰", 
          isCorrect: false
        },
        { 
          id: "hate", 
          text: "Hate buses", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          id: "walk", 
          text: "Walk and enjoy morning!", 
          emoji: "🚶", 
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
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Rainy Day Story"
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
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
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

export default RainyDayStory;
