import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeYoungLeaderKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "civic-responsibility-kids-100";
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
      title: "Community Leadership",
      question: "Which action demonstrates leadership in your community?",
      options: [
        { 
          text: "Waiting for others to solve problems", 
          isCorrect: false
        },
        { 
          text: "Organizing a neighborhood clean-up", 
          isCorrect: true
        },
        { 
          text: "Complaining about issues without taking action", 
          isCorrect: false
        },
        { 
          text: "Ignoring community issues", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Organizing a neighborhood clean-up shows initiative and leadership in improving your community!",
        wrong: "Organizing a neighborhood clean-up shows initiative and leadership in improving your community!"
      }
    },
    {
      id: 2,
      title: "Admitting Mistakes",
      question: "Good leaders always admit their mistakes.",
      options: [
        { 
          text: "True", 
          isCorrect: true
        },
        { 
          text: "False", 
          isCorrect: false
        },
        { 
          text: "Only when caught", 
          isCorrect: false
        },
        { 
          text: "Only to authority figures", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Yes! Admitting mistakes shows integrity and helps leaders learn and grow.",
        wrong: "Yes! Admitting mistakes shows integrity and helps leaders learn and grow."
      }
    },
    {
      id: 3,
      title: "Leader Qualities",
      question: "One important quality of a good leader is responsibility.",
      options: [
        { 
          text: "True", 
          isCorrect: true
        },
        { 
          text: "False", 
          isCorrect: false
        },
        { 
          text: "Only for adults", 
          isCorrect: false
        },
        { 
          text: "Only for elected officials", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Responsibility is essential for leaders because they must be accountable for their actions and decisions.",
        wrong: "Responsibility is essential for leaders because they must be accountable for their actions and decisions."
      }
    },
    {
      id: 4,
      title: "Team Leadership",
      question: "Your team is divided on how to approach a school project. What should you do as a leader?",
      options: [
        { 
          text: "Let everyone argue until they figure it out", 
          isCorrect: false
        },
       
        { 
          text: "Impose your idea without discussion", 
          isCorrect: false
        },
         { 
          text: "Listen to all ideas and help the group find a solution", 
          isCorrect: true
        },
        { 
          text: "Quit the project", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Good leaders facilitate discussion and help groups find solutions that everyone can support!",
        wrong: "Good leaders facilitate discussion and help groups find solutions that everyone can support!"
      }
    },
    {
      id: 5,
      title: "Importance of Leadership Skills",
      question: "Why is it important for kids to develop leadership skills?",
      options: [
        { 
          text: "To boss other kids around", 
          isCorrect: false
        },
        
        { 
          text: "To avoid doing group work", 
          isCorrect: false
        },
        { 
          text: "To get special treatment", 
          isCorrect: false
        },
        { 
          text: "To help create positive changes in their communities", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Leadership skills help kids become active, responsible citizens who can make positive differences in their communities!",
        wrong: "Leadership skills help kids become active, responsible citizens who can make positive differences in their communities!"
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
      title="Badge: Young Leader Kid"
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
      backPath="/games/civic-responsibility/kids"
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
                <h3 className="text-3xl font-bold text-white mb-4">Young Leader Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong leadership qualities with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Young Leader Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Leadership Skills</h4>
                    <p className="text-white/90 text-sm">
                      You understand the qualities and responsibilities of effective leaders.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Community Impact</h4>
                    <p className="text-white/90 text-sm">
                      You're building awareness of how to create positive changes in your community.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.location.href = "/games/civic-responsibility/kids";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Developing Your Leadership!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review leadership concepts to strengthen your knowledge.
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

export default BadgeYoungLeaderKid;