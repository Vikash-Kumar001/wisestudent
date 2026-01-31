import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeRightChoiceKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-100";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Helping with Homework",
      question: "Your friend is struggling with homework. What should you do?",
      options: [
        { 
          text: "Help them understand", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Do it for them", 
          emoji: "✏️", 
          isCorrect: false
        },
        { 
          text: "Ignore them", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Let them copy", 
          emoji: "📋", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Helping friends learn is the right choice!",
        wrong: "Remember: Help friends understand, but don't do their work for them."
      }
    },
    {
      id: 2,
      title: "Returning Lost Items",
      question: "You find a lost item. What is the right thing to do?",
      options: [
        { 
          text: "Keep it", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          text: "Return it to the owner", 
          emoji: "🎒", 
          isCorrect: true
        },
        { 
          text: "Throw it away", 
          emoji: "🗑️", 
          isCorrect: false
        },
        { 
          text: "Give it to someone else", 
          emoji: "👥", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Returning lost items is always the right choice!",
        wrong: "Always return lost items to their owner or a teacher. It's the right thing to do."
      }
    },
    {
      id: 3,
      title: "Sharing Kindly",
      question: "You have toys and others want to play. What should you do?",
      options: [
        { 
          text: "Hide your toys", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Refuse to share", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Share toys kindly", 
          emoji: "🧸", 
          isCorrect: true
        },
        { 
          text: "Break the toys", 
          emoji: "💔", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Sharing toys kindly makes everyone happy!",
        wrong: "Sharing your toys with others is the kind and right choice."
      }
    },
    {
      id: 4,
      title: "Following Rules",
      question: "You're at school or playground. What should you do?",
      options: [
        { 
          text: "Break the rules", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Ignore the rules", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          text: "Follow the rules", 
          emoji: "🏫", 
          isCorrect: true
        },
        { 
          text: "Make your own rules", 
          emoji: "📝", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great! Following rules keeps everyone safe and happy!",
        wrong: "Always follow school and playground rules. They keep everyone safe."
      }
    },
    {
      id: 5,
      title: "Choosing Honesty",
      question: "You have a choice between being honest or cheating. What do you choose?",
      options: [
        { 
          text: "Always choose honesty", 
          emoji: "✅", 
          isCorrect: true
        },
        { 
          text: "Cheat sometimes", 
          emoji: "😈", 
          isCorrect: false
        },
        { 
          text: "Cheat to win", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          text: "Ask someone else", 
          emoji: "🤷", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Honesty is always the right choice, even when it's hard!",
        wrong: "Always choose honesty over cheating. Honesty builds trust and character."
      }
    }
  ];

  const handleAnswer = (isCorrect, optionIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(optionIndex);
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
    }, 8000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Right Choice Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="moral"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.isCorrect, idx)}
                    disabled={answered}
                    className={`bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
                      answered && selectedAnswer === idx
                        ? option.isCorrect
                          ? "ring-4 ring-green-400"
                          : "ring-4 ring-red-400"
                        : ""
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-bold text-lg">{option.text}</span>
                  </button>
                ))}
              </div>
              
              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentChallenge.options[selectedAnswer]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentChallenge.options[selectedAnswer]?.isCorrect
                      ? currentChallenge.feedback.correct
                      : currentChallenge.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Right Choice Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {score} right choices out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Right Choice Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Right Choices</h4>
                    <p className="text-white/90 text-sm">
                      You chose to help friends learn, return lost items, share kindly, 
                      follow rules, and always be honest.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Good Character</h4>
                    <p className="text-white/90 text-sm">
                      Making right choices builds good character and makes you someone others can trust!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {score} right choices out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, right choices mean helping others learn, returning lost items, 
                  sharing kindly, following rules, and always choosing honesty.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeRightChoiceKid;
