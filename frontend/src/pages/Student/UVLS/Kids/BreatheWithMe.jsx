import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BreatheWithMe = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-42");
  const gameId = gameData?.id || "uvls-kids-42";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BreatheWithMe, using fallback ID");
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
      text: "Which breathing technique is best for calming down?",
      options: [
        { 
          id: "a", 
          text: "Breathe in for 4, hold 4, out 4.", 
          emoji: "😮‍💨", 
          // description: "4-4-4 breathing helps calm your nervous system",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Breathe as fast as you can", 
          emoji: "💨", 
          // description: "Fast breathing can make you feel dizzy",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Hold your breath for 30 seconds", 
          emoji: "😰", 
          // description: "Holding breath for too long is not helpful",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the best way to breathe when stressed?",
      options: [
        { 
          id: "a", 
          text: "Inhale slowly, exhale longer.", 
          emoji: "😌", 
          // description: "Longer exhales activate your body's relaxation response",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Take short, quick breaths", 
          emoji: "😮", 
          // description: "Quick breaths can increase anxiety",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Breathe only through your mouth", 
          emoji: "😮", 
          // description: "Nose breathing is more calming",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should you breathe using belly breathing?",
      options: [
        { 
          id: "a", 
          text: "Breathe like a balloon expanding in your belly", 
          emoji: "🎈", 
          // description: "Feel your belly rise and fall with each breath",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Keep your chest moving only", 
          emoji: "👕", 
          // description: "Chest breathing is shallow and less effective",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Don't move your belly at all", 
          emoji: "😴", 
          // description: "Belly movement shows proper deep breathing",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can you focus on your breathing?",
      options: [
        { 
          id: "a", 
          text: "Count breaths to 5", 
          emoji: "5️⃣", 
          // description: "Counting helps maintain focus and rhythm",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Count to 100 quickly", 
          emoji: "1️⃣0️⃣0️⃣", 
          // description: "This is too distracting and long",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Don't count anything", 
          emoji: "0️⃣", 
          // description: "Counting helps maintain focus on breathing",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you enhance your breathing exercise?",
      options: [
        { 
          id: "a", 
          text: "Imagine a calm place while breathing", 
          emoji: "🌊", 
          // description: "Visualization helps deepen relaxation",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Think about your problems", 
          emoji: "🤯", 
          // description: "This increases stress instead of relaxation",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Listen to loud music", 
          emoji: "🔊", 
          // description: "Quiet environment is better for breathing exercises",
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
      title="Breathe with Me"
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

export default BreatheWithMe;