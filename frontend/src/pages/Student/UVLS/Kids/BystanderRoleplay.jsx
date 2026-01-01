import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BystanderRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-38";
  const gameData = getGameDataById(gameId);
  
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
      text: "You see teasing happening in the playground. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Say 'Stop, that's not nice!'", 
          emoji: "🛑", 
          // description: "Stand up for the person",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Fight the bully", 
          emoji: "👊", 
          // description: "Violence makes it worse",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Watch silently", 
          emoji: "👀", 
          // description: "Not helping",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "You see someone being excluded from a game. What should you do?",
      options: [
        { 
          id: "b", 
          text: "Yell at the group", 
          emoji: "😠", 
          // description: "Aggressive response",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Invite the excluded person to join", 
          emoji: "👋", 
          // description: "Include them",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Leave the game", 
          emoji: "🚶", 
          // description: "Not helping",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "You hear name-calling in class. What should you do?",
      options: [
        { 
          id: "b", 
          text: "Name-call back", 
          emoji: "🗣️", 
          // description: "This makes it worse",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Ignore it", 
          emoji: "🙈", 
          // description: "Not helping",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Tell the teacher quietly", 
          emoji: "🧑‍🏫", 
          // description: "Get help from an adult",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "You see a mean comment online. What should you do?",
      options: [
        { 
          id: "b", 
          text: "Comment meanly too", 
          emoji: "😈", 
          // description: "This makes it worse",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Support the victim online", 
          emoji: "❤️", 
          // description: "Show support",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Scroll past", 
          emoji: "📱", 
          // description: "Not helping",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "You see someone being pushed in line. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Get an adult to help", 
          emoji: "🆘", 
          // description: "Get help from an adult",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Push back", 
          emoji: "🤜", 
          // description: "Violence makes it worse",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Do nothing", 
          emoji: "🫥", 
          // description: "Not helping",
          isCorrect: false 
        }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
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
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  return (
    <GameShell
      title="Bystander Roleplay"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
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
      gameType="uvls"
      onNext={handleNext}
      nextEnabled={showResult && score >= 3}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.isCorrect)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="font-semibold text-lg">{option.text}</span>
                      <span className="text-sm opacity-90">{option.description}</span>
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
                <h3 className="text-2xl font-bold text-white mb-4">Upstander Hero!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to be an upstander, not a bystander!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: When you see bullying or unfair treatment, don't be a bystander - be an upstander! Stand up for others by speaking up, including them, telling an adult, supporting the victim, and getting help. Never use violence or ignore the situation - always help in safe and effective ways!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Stand up for others when you see bullying!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: When you see bullying, be an upstander! Speak up, include the person being bullied, tell an adult, support the victim, and get help. Never use violence or ignore it!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BystanderRoleplay;
