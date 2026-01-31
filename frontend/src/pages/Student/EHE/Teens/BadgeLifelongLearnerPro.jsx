import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeLifelongLearnerPro = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-100";
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
      title: "Career Growth Challenges",
      question: "Which approach is most effective for overcoming career obstacles?",
      options: [
        { 
          text: "Avoiding challenging situations completely", 
          emoji: "🙅‍♂️", 
          isCorrect: false
        },
        { 
          text: "Developing resilience and problem-solving skills", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          text: "Blaming external factors for all setbacks", 
          emoji: "🫣", 
          isCorrect: false
        },
        { 
          text: "Sticking to familiar routines without adaptation", 
          emoji: "🔁", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Developing resilience and problem-solving skills helps overcome career obstacles!",
        wrong: "The most effective approach is developing resilience and problem-solving skills to navigate challenges."
      }
    },
    {
      id: 2,
      title: "Learning Strategies",
      question: "What characterizes the most effective lifelong learning approach?",
      options: [
        { 
          text: "Focusing only on formal education credentials", 
          emoji: "🎓", 
          isCorrect: false
        },
        
        { 
          text: "Relying solely on past knowledge and skills", 
          emoji: "🧠", 
          isCorrect: false
        },
        { 
          text: "Learning only when required by employers", 
          emoji: "💼", 
          isCorrect: false
        },
        { 
          text: "Combining formal learning with experiential growth", 
          emoji: "📚", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! The most effective approach combines formal learning with experiential growth!",
        wrong: "The most effective lifelong learning approach combines formal education with hands-on experience."
      }
    },
    {
      id: 3,
      title: "Development Planning",
      question: "What is essential for an effective personal development plan?",
      options: [
        { 
          text: "Creating rigid goals that never change", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          text: "Setting flexible milestones with regular assessment", 
          emoji: "📅", 
          isCorrect: true
        },
        { 
          text: "Copying someone else's exact career path", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          text: "Focusing only on short-term achievements", 
          emoji: "🏆", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Effective plans set flexible milestones with regular assessment and adjustment!",
        wrong: "An effective personal development plan sets flexible milestones with regular assessment and adjustments."
      }
    },
    {
      id: 4,
      title: "Adaptive Decision-Making",
      question: "Which principle guides effective adaptive decision-making?",
      options: [
         { 
          text: "Balancing analysis with timely action", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          text: "Making quick decisions without information", 
          emoji: "🙎‍♂️", 
          isCorrect: false
        },
       
        { 
          text: "Avoiding decisions during uncertainty", 
          emoji: "🙅‍♂️", 
          isCorrect: false
        },
        { 
          text: "Following others' decisions without evaluation", 
          emoji: "🫣", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Effective adaptive decision-making balances thorough analysis with timely action!",
        wrong: "Effective adaptive decision-making balances careful analysis with timely implementation."
      }
    },
    {
      id: 5,
      title: "Skill Upgrading",
      question: "What approach ensures continuous skill relevance?",
      options: [
        { 
          text: "Mastering one skill and never changing", 
          emoji: "🎓", 
          isCorrect: false
        },
        
        { 
          text: "Focusing only on currently popular skills", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          text: "Regularly assessing and updating skill sets", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          text: "Avoiding technical skills entirely", 
          emoji: "💻", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Continuous skill relevance requires regularly assessing and updating your skill sets!",
        wrong: "Ensuring continuous skill relevance requires regularly assessing and updating your competencies."
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
      title="Badge: Lifelong Learner Pro"
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
      backPath="/games/ehe/teens"
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
                <h3 className="text-3xl font-bold text-white mb-4">Lifelong Learner Pro Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated mastery of lifelong learning with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Lifelong Learner Pro</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Career Growth</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to overcome obstacles and make adaptive decisions for career advancement.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Continuous Development</h4>
                    <p className="text-white/90 text-sm">
                      You know how to plan personal development and maintain relevant skills throughout your career.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.location.href = "/games/ehe/teens";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Growing as a Learner!</h3>
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

export default BadgeLifelongLearnerPro;