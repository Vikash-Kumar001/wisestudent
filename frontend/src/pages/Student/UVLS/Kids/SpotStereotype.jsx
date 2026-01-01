import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SpotStereotype = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-23");
  const gameId = gameData?.id || "uvls-kids-23";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SpotStereotype, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Which statement is a stereotype?",
      emoji: "🔍",
      options: [
        { 
          id: "stereotype1", 
          text: "Girls can't play football.", 
          emoji: "🚫", 
          // description: "Unfair assumption about girls",
          isCorrect: true 
        },
        { 
          id: "fact1", 
          text: "Everyone likes ice cream.", 
          emoji: "🍦", 
          // description: "General preference, not a stereotype",
          isCorrect: false 
        },
        { 
          id: "fact2", 
          text: "Kids go to school.", 
          emoji: "📚", 
          // description: "A fact, not a stereotype",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "Which statement is a stereotype?",
      emoji: "🔍",
      options: [
        { 
          id: "fact3", 
          text: "Friends help each other.", 
          emoji: "🤝", 
          // description: "A positive fact, not a stereotype",
          isCorrect: false 
        },
        { 
          id: "stereotype2", 
          text: "Moms cook, dads work.", 
          emoji: "👨‍👩‍👧", 
          // description: "Gender role stereotype",
          isCorrect: true 
        },
        { 
          id: "fact4", 
          text: "We all need food.", 
          emoji: "🍎", 
          // description: "A fact, not a stereotype",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Which statement is a stereotype?",
      emoji: "🔍",
      options: [
        { 
          id: "stereotype3", 
          text: "Boys are strong, girls are weak.", 
          emoji: "💪", 
          // description: "Unfair gender stereotype",
          isCorrect: true 
        },
        { 
          id: "fact5", 
          text: "Playtime is fun.", 
          emoji: "🎮", 
          // description: "A fact, not a stereotype",
          isCorrect: false 
        },
        { 
          id: "fact6", 
          text: "We should be kind to others.", 
          emoji: "❤️", 
          // description: "A value, not a stereotype",
          isCorrect: false 
        }
      ]
    },
    {
      id: 4,
      text: "Which statement is a stereotype?",
      emoji: "🔍",
      options: [
        { 
          id: "fact7", 
          text: "Everyone deserves respect.", 
          emoji: "🙏", 
          // description: "A value, not a stereotype",
          isCorrect: false 
        },
        { 
          id: "fact8", 
          text: "Learning is important.", 
          emoji: "📖", 
          // description: "A fact, not a stereotype",
          isCorrect: false 
        },
        { 
          id: "stereotype4", 
          text: "Doctors are men.", 
          emoji: "👨‍⚕️", 
          // description: "Gender career stereotype",
          isCorrect: true 
        }
      ]
    },
    {
      id: 5,
      text: "Which statement is a stereotype?",
      emoji: "🔍",
      options: [
        { 
          id: "stereotype5", 
          text: "Girls like dolls, boys like cars.", 
          emoji: "🧸", 
          // description: "Gender toy stereotype",
          isCorrect: true 
        },
        { 
          id: "fact9", 
          text: "Sharing is caring.", 
          emoji: "💝", 
          // description: "A value, not a stereotype",
          isCorrect: false 
        },
        { 
          id: "fact10", 
          text: "Exercise is good for health.", 
          emoji: "🏃", 
          // description: "A fact, not a stereotype",
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
      title="Spot Stereotype"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="uvls"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
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

export default SpotStereotype;
