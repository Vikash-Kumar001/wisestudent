import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeCivicLeaderTeen = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "civic-responsibility-teens-100";
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
      title: "Community Service Organization",
      question: "What is the most important factor when organizing a community service project?",
      options: [
        { 
          text: "Getting media attention for yourself", 
          isCorrect: false
        },
        { 
          text: "Addressing a genuine community need effectively", 
          isCorrect: true
        },
        { 
          text: "Making it as elaborate as possible", 
          isCorrect: false
        },
        { 
          text: "Completing it as quickly as possible", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Addressing a genuine community need effectively ensures your service project creates meaningful impact.",
        wrong: "Addressing a genuine community need effectively ensures your service project creates meaningful impact."
      }
    },
    {
      id: 2,
      title: "Local Government Participation",
      question: "How can you most effectively engage with local government officials?",
      options: [
        { 
          text: "Complain without offering solutions", 
          isCorrect: false
        },
        
        { 
          text: "Avoid them entirely", 
          isCorrect: false
        },
        { 
          text: "Come prepared with research and constructive suggestions", 
          isCorrect: true
        },
        { 
          text: "Only contact them when you need something", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Coming prepared with research and constructive suggestions enables productive dialogue with officials.",
        wrong: "Coming prepared with research and constructive suggestions enables productive dialogue with officials."
      }
    },
    {
      id: 3,
      title: "School Initiative Leadership",
      question: "What is crucial for successfully leading a school initiative?",
      options: [
        { 
          text: "Making all decisions yourself", 
          isCorrect: false
        },
        { 
          text: "Building a team and delegating responsibilities effectively", 
          isCorrect: true
        },
        { 
          text: "Focusing only on popularity", 
          isCorrect: false
        },
        { 
          text: "Copying what other schools have done", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Building a team and delegating responsibilities effectively maximizes the impact of school initiatives.",
        wrong: "Building a team and delegating responsibilities effectively maximizes the impact of school initiatives."
      }
    },
    {
      id: 4,
      title: "Responsible Citizenship",
      question: "What does practicing responsible citizenship involve?",
      options: [
        { 
          text: "Only participating when it's convenient", 
          isCorrect: false
        },
       
        { 
          text: "Following others without thinking critically", 
          isCorrect: false
        },
        { 
          text: "Focusing only on personal benefits", 
          isCorrect: false
        },
         { 
          text: "Staying informed and participating consistently in civic processes", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Staying informed and participating consistently in civic processes strengthens democratic institutions.",
        wrong: "Staying informed and participating consistently in civic processes strengthens democratic institutions."
      }
    },
    {
      id: 5,
      title: "Mentoring Younger Students",
      question: "What is the most effective approach to mentoring younger students?",
      options: [
        { 
          text: "Providing guidance while encouraging independence and growth", 
          isCorrect: true
        },
        { 
          text: "Doing everything for them", 
          isCorrect: false
        },
        
        { 
          text: "Comparing them to other students", 
          isCorrect: false
        },
        { 
          text: "Focusing only on academic performance", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Providing guidance while encouraging independence and growth helps mentees develop confidence and skills.",
        wrong: "Providing guidance while encouraging independence and growth helps mentees develop confidence and skills."
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
      title="Badge: Civic Leader Teen"
      subtitle={showResult ? "Game Complete!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="civic-responsibility"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
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
                    className={`bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
                      answered && selectedAnswer === idx
                        ? option.isCorrect
                          ? "ring-4 ring-green-400"
                          : "ring-4 ring-red-400"
                        : ""
                    }`}
                  >
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
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-3xl font-bold text-white mb-4">Civic Leader Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated exceptional civic leadership with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Civic Leader Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Community Impact</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to organize effective community service projects that address real needs.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Leadership Skills</h4>
                    <p className="text-white/90 text-sm">
                      You know how to engage with government officials and lead initiatives effectively.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.location.href = "/games/civic-responsibility/teens";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Leading Through Civic Action!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review civic leadership concepts to strengthen your skills.
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

export default BadgeCivicLeaderTeen;