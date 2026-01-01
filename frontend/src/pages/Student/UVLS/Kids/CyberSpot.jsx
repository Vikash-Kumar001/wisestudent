import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CyberSpot = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-39");
  const gameId = gameData?.id || "uvls-kids-39";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for CyberSpot, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Which post is harmful and should be reported?",
      emoji: "💻",
      options: [
        { 
          id: "malicious1", 
          text: "You're ugly!", 
          emoji: "😠", 
          // description: "Mean and hurtful comment",
          isCorrect: true 
        },
        { 
          id: "nice1", 
          text: "Nice pic!", 
          emoji: "👍", 
          // description: "Friendly and positive",
          isCorrect: false 
        },
        { 
          id: "neutral1", 
          text: "Have a great day!", 
          emoji: "😊", 
          // description: "Kind and supportive",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "Which post is harmful and should be reported?",
      emoji: "💻",
      options: [
        { 
          id: "nice2", 
          text: "Happy birthday!", 
          emoji: "🎂", 
          // description: "Friendly and positive",
          isCorrect: false 
        },
        { 
          id: "malicious2", 
          text: "Fake news about you.", 
          emoji: "⚠️", 
          // description: "Spreading false information",
          isCorrect: true 
        },
        { 
          id: "neutral2", 
          text: "Thanks for sharing!", 
          emoji: "🙏", 
          // description: "Polite and kind",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Which post is harmful and should be reported?",
      emoji: "💻",
      options: [
        { 
          id: "nice3", 
          text: "Sharing fun meme.", 
          emoji: "😄", 
          // description: "Fun and harmless",
          isCorrect: false 
        },
        { 
          id: "neutral3", 
          text: "Great job!", 
          emoji: "👏", 
          // description: "Encouraging and positive",
          isCorrect: false 
        },
        { 
          id: "malicious3", 
          text: "Spreading rumors online.", 
          emoji: "🗣️", 
          // description: "Harmful and false information",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "Which post is harmful and should be reported?",
      emoji: "💻",
      options: [
        { 
          id: "malicious4", 
          text: "Doxing personal info.", 
          emoji: "🔓", 
          // description: "Sharing private information without consent",
          isCorrect: true 
        },
        { 
          id: "nice4", 
          text: "Compliment on post.", 
          emoji: "💝", 
          // description: "Kind and positive",
          isCorrect: false 
        },
        { 
          id: "neutral4", 
          text: "Keep it up!", 
          emoji: "💪", 
          // description: "Encouraging and supportive",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "Which post is harmful and should be reported?",
      emoji: "💻",
      options: [
        { 
          id: "nice5", 
          text: "Friendly invite.", 
          emoji: "👋", 
          // description: "Welcoming and kind",
          isCorrect: false 
        },
        
        { 
          id: "neutral5", 
          text: "Hope you're well!", 
          emoji: "❤️", 
          // description: "Caring and friendly",
          isCorrect: false 
        },
        { 
          id: "malicious5", 
          text: "Harassing emails.", 
          emoji: "📧", 
          // description: "Repeated unwanted contact",
          isCorrect: true 
        },
      ]
    }
  ];

  const currentQuestionData = questions[currentQuestion];

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



  return (
    <GameShell
      title="Cyber Spot"
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

export default CyberSpot;
