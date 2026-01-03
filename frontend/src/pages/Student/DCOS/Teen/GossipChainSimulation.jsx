import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GossipChainSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-13");
  const gameId = gameData?.id || "dcos-teen-13";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A rumor spreads: 'Alex failed the exam!' What should you do?",
      options: [
        { 
          text: "Stop and don't share", 
          emoji: "🛑", 
          isCorrect: true
        },
        { 
          text: "Forward to another group", 
          emoji: "📤", 
          isCorrect: false
        },
        { 
          text: "Ask if it's true first", 
          emoji: "❓", 
          isCorrect: false
        },
        { 
          text: "Share with your friends", 
          emoji: "💬", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Someone says 'Alex cheated on the exam.' What's your response?",
      options: [
        { 
          text: "Share with more friends", 
          emoji: "📤", 
          isCorrect: false
        },
        { 
          text: "Stop the rumor", 
          emoji: "🛑", 
          isCorrect: true
        },
        { 
          text: "Add your own details", 
          emoji: "➕", 
          isCorrect: false
        },
        { 
          text: "Tell other classmates", 
          emoji: "🗣️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Everyone's saying 'Alex is a cheater.' What should you do?",
      options: [
        { 
          text: "Spread it further", 
          emoji: "📤", 
          isCorrect: false
        },
        { 
          text: "Stay silent", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          text: "Defend Alex and stop rumor", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          text: "Join in the discussion", 
          emoji: "🗣️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You hear 'Alex got caught cheating!' What's the right action?",
      options: [
       
        { 
          text: "Forward the message", 
          emoji: "📤", 
          isCorrect: false
        },
        { 
          text: "Add more details", 
          emoji: "➕", 
          isCorrect: false
        },
        { 
          text: "Tell everyone you know", 
          emoji: "📢", 
          isCorrect: false
        },
         { 
          text: "Stop and verify first", 
          emoji: "🔍", 
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "The rumor says 'Alex is a known cheater now.' What do you do?",
      options: [
        { 
          text: "Keep spreading", 
          emoji: "📤", 
          isCorrect: false
        },
        { 
          text: "Defend and stop the rumor", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          text: "Just watch", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Ask for more details", 
          emoji: "🔍", 
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
        setSelectedAnswer(null);
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

  return (
    <GameShell
      title="Gossip Chain Simulation"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, idx) => (
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You understand how to stop rumors from spreading!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Always stop rumors and verify information before sharing. Don't spread gossip that can harm others!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to stop rumors and verify before sharing!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: The right choice is to stop rumors, verify information, and defend those being targeted!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GossipChainSimulation;
