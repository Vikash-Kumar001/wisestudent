import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HonestKidBadgeGame = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-100";
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
      title: "Found Money",
      question: "You find ₹10 on the playground. What’s the honest choice?",
      options: [
        
        { 
          text: "Keep it for yourself ", 
          emoji: "🤫", 
          isCorrect: false
        },
        { 
          text: "Give it to a teacher ", 
          emoji: "🎓", 
          isCorrect: true
        },
        { 
          text: "Spend it on snacks ", 
          emoji: "🍟", 
          isCorrect: false
        },
        { 
          text: "Ask friends if they lost it", 
          emoji: "🔍", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Giving found money to a teacher is the honest choice!",
        wrong: "Remember, found money should be returned to its owner or given to a trusted adult!"
      }
    },
    {
      id: 2,
      title: "Extra Change",
      question: "You're given extra change at a shop. What do you do?",
      options: [
        
        { 
          text: "Buy more candy ", 
          emoji: "🍬", 
          isCorrect: false
        },
        { 
          text: "Say nothing ", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Return the extra change ", 
          emoji: "🪙", 
          isCorrect: true
        },
        { 
          text: "Keep it as a gift from the shopkeeper", 
          emoji: "🎁", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Returning extra change shows honesty and integrity!",
        wrong: "Returning extra change is the honest thing to do, even if it's tempting to keep it!"
      }
    },
    {
      id: 3,
      title: "Lending Money",
      question: "Your friend asks to borrow ₹5. What’s a fair deal?",
      options: [
       
        { 
          text: "Give it without expecting back ", 
          emoji: "🎁", 
          isCorrect: false
        },
         { 
          text: "Lend and agree on repayment ", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Refuse to lend ", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          text: "Lend but don't discuss repayment", 
          emoji: "🤔", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Amazing! Clear agreements about repayment help maintain friendships!",
        wrong: "When lending money, it's important to have clear agreements to maintain trust!"
      }
    },
    {
      id: 4,
      title: "Broken Toy",
      question: "You break a toy worth ₹20. What’s honest?",
      options: [
        
        { 
          text: "Hide the broken toy ", 
          emoji: "🧸", 
          isCorrect: false
        },
        { 
          text: "Blame someone else ", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Tell your parents and offer to pay ", 
          emoji: "🗣️", 
          isCorrect: true
        },
        { 
          text: "Say it was already broken", 
          emoji: "💥", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great! Taking responsibility shows maturity and honesty!",
        wrong: "Taking responsibility for damage is the honest way to handle the situation!"
      }
    },
    {
      id: 5,
      title: "Honesty Value",
      question: "Why does honesty with money matter?",
      options: [
        { 
          text: "It earns trust and respect ", 
          emoji: "😊", 
          isCorrect: true
        },
        { 
          text: "It gets you more money ", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "It lets you spend more ", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          text: "It helps avoid consequences", 
          emoji: "🚫", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Honesty builds trust and respect, which are invaluable!",
        wrong: "Honesty with money builds trust and respect, which are more valuable than any amount of money!"
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
  const finalScore = score;

  return (
    <GameShell
      title="Badge: Honest Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === challenges.length}
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
                    className={`bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
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
            {finalScore >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Honest Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {finalScore} honest decisions out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Honest Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Honesty Skills</h4>
                    <p className="text-white/90 text-sm">
                      You learned to return found money, give back extra change, 
                      and take responsibility for mistakes!
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Trust Building</h4>
                    <p className="text-white/90 text-sm">
                      These habits will help you build trust and maintain good relationships!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} honest decisions out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, honesty with money builds trust and respect. 
                  These habits will help you throughout your life!
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

export default HonestKidBadgeGame;