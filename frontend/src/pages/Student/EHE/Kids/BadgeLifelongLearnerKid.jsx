import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeLifelongLearnerKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-kids-100";
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
      title: "Learning Habits",
      question: "Which is a habit of lifelong learners?",
      options: [
        { 
          text: "Stopping learning after school", 
          emoji: "🛑", 
          isCorrect: false
        },
        { 
          text: "Only learning when forced", 
          emoji: "😣", 
          isCorrect: false
        },
        { 
          text: "Reading regularly to learn new things", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Avoiding all challenges", 
          emoji: "😴", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! Lifelong learners read regularly to expand their knowledge!",
        wrong: "Lifelong learners actively seek knowledge through habits like regular reading."
      }
    },
    {
      id: 2,
      title: "Embracing Challenges",
      question: "Lifelong learners welcome:",
      options: [
         { 
          text: "New challenges and experiences", 
          emoji: "🌟", 
          isCorrect: true
        },
        { 
          text: "Staying in their comfort zone", 
          emoji: "🛋️", 
          isCorrect: false
        },
        { 
          text: "Avoiding all difficulties", 
          emoji: "🚫", 
          isCorrect: false
        },
       
        { 
          text: "Copying others exactly", 
          emoji: "📋", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Lifelong learners embrace new challenges as opportunities to grow!",
        wrong: "Lifelong learners welcome new challenges and experiences as opportunities for growth."
      }
    },
    {
      id: 3,
      title: "Curiosity and Growth",
      question: "What helps develop a lifelong learning mindset?",
      options: [
        { 
          text: "Thinking you know everything", 
          emoji: "🤯", 
          isCorrect: false
        },
         { 
          text: "Asking questions and staying curious", 
          emoji: "❓", 
          isCorrect: true
        },
        { 
          text: "Never asking questions", 
          emoji: "🤐", 
          isCorrect: false
        },
       
        { 
          text: "Ignoring new information", 
          emoji: "🙉", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Curiosity and questioning are key to lifelong learning!",
        wrong: "Developing a lifelong learning mindset requires staying curious and asking questions."
      }
    },
    {
      id: 4,
      title: "Learning from Mistakes",
      question: "Lifelong learners view mistakes as:",
      options: [
        { 
          text: "Failures to be avoided", 
          emoji: "😨", 
          isCorrect: false
        },
        { 
          text: "Proof of incompetence", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "Opportunities to learn and improve", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          text: "Reasons to give up", 
          emoji: "🏳️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Lifelong learners see mistakes as valuable learning experiences!",
        wrong: "Lifelong learners view mistakes as opportunities to learn and improve rather than failures."
      }
    },
    {
      id: 5,
      title: "Value of Learning",
      question: "Why is lifelong learning valuable?",
      options: [
        { 
          text: "It's only useful for getting good grades", 
          emoji: "📝", 
          isCorrect: false
        },
        { 
          text: "It helps you avoid challenges", 
          emoji: "🛡️", 
          isCorrect: false
        },
        
        { 
          text: "It makes you smarter than everyone else", 
          emoji: "🧠", 
          isCorrect: false
        },
        { 
          text: "It helps you adapt and grow throughout life", 
          emoji: "🌱", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Excellent! Lifelong learning enables personal and professional growth!",
        wrong: "Lifelong learning is valuable because it helps you adapt and grow throughout your life."
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
    }, 5000);
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
      title="Badge: Lifelong Learner Kid"
      subtitle={showResult ? "Game Complete!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="ehe"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/kids"
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
                <h3 className="text-3xl font-bold text-white mb-4">Lifelong Learner Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong lifelong learning habits with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Lifelong Learner Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Growth Mindset</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to embrace challenges and learn from mistakes.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Continuous Learning</h4>
                    <p className="text-white/90 text-sm">
                      You know the value of staying curious and developing learning habits.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.location.href = "/games/ehe/kids";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning and Growing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review lifelong learning concepts to strengthen your knowledge and earn your badge.
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

export default BadgeLifelongLearnerKid;