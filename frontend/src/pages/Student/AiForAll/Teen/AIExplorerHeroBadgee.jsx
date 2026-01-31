import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AIExplorerHeroBadgee = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-100";
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
      title: "AI Fundamentals",
      question: "What does the term 'Artificial Intelligence' fundamentally refer to?",
      options: [
        { 
          text: "Systems that perform tasks requiring human-like intelligence", 
          emoji: "🤖", 
          isCorrect: true
        },
        { 
          text: "Computers that can only perform calculations", 
          emoji: "🔢", 
          isCorrect: false
        },
        { 
          text: "Software that replaces all human jobs", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          text: "Hardware with advanced graphics capabilities", 
          emoji: "🖥️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! AI encompasses systems designed to perform tasks that typically require human cognitive abilities!",
        wrong: "AI goes beyond simple computation to encompass learning, reasoning, perception, and decision-making."
      }
    },
    {
      id: 2,
      title: "Machine Learning",
      question: "What distinguishes machine learning from traditional programming?",
      options: [
        { 
          text: "Algorithms learn patterns from data rather than following explicit rules", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          text: "Machine learning is faster than traditional programming", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          text: "Traditional programming requires more computational power", 
          emoji: "🔋", 
          isCorrect: false
        },
        { 
          text: "Machine learning eliminates the need for programmers", 
          emoji: "❌", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! ML systems learn from data to make predictions or decisions without being explicitly programmed!",
        wrong: "The key distinction is that ML systems learn patterns from data rather than following predetermined rules."
      }
    },
    {
      id: 3,
      title: "Neural Networks",
      question: "What is the primary inspiration behind artificial neural networks?",
      options: [
        
        { 
          text: "Computer processor architectures", 
          emoji: "💻", 
          isCorrect: false
        },
        { 
          text: "Biological neural structures in the human brain", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          text: "Telecommunications networks", 
          emoji: "📡", 
          isCorrect: false
        },
        { 
          text: "Transportation systems", 
          emoji: "🚗", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Artificial neural networks are modeled after biological neurons and their interconnected structures!",
        wrong: "The biological brain's neural architecture directly inspired the design of artificial neural networks."
      }
    },
    {
      id: 4,
      title: "AI Applications",
      question: "Which domain has AI significantly transformed through computer vision?",
      options: [
        
        { 
          text: "Manual bookkeeping", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "Traditional farming techniques", 
          emoji: "🌾", 
          isCorrect: false
        },
        { 
          text: "Handwritten letter composition", 
          emoji: "✉️", 
          isCorrect: false
        },
        { 
          text: "Medical imaging and diagnostics", 
          emoji: "🏥", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! AI-powered computer vision revolutionizes medical imaging for faster, more accurate diagnoses!",
        wrong: "Computer vision excels in pattern recognition tasks like medical imaging, autonomous vehicles, and quality control."
      }
    },
    {
      id: 5,
      title: "Natural Language Processing",
      question: "What breakthrough enabled significant advances in language translation AI?",
      options: [
        { 
          text: "Transformer architectures and attention mechanisms", 
          emoji: "🔄", 
          isCorrect: true
        },
        { 
          text: "Increased keyboard typing speeds", 
          emoji: "⌨️", 
          isCorrect: false
        },
        { 
          text: "Better dictionary databases", 
          emoji: "📖", 
          isCorrect: false
        },
        { 
          text: "Improved monitor resolutions", 
          emoji: "🖥️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Transformers with attention mechanisms revolutionized NLP by understanding context and relationships!",
        wrong: "The transformer architecture introduced in 'Attention Is All You Need' dramatically improved language understanding."
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
      title="Badge: AI Explorer Hero"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="ai"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
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
            {score >= 8 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">AI Explorer Hero Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  Exceptional! You demonstrated comprehensive AI knowledge with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Ultimate Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: AI Explorer Hero</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">AI Mastery</h4>
                    <p className="text-white/90 text-sm">
                      You've mastered core AI concepts including machine learning, neural networks, and NLP.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Responsible Innovation</h4>
                    <p className="text-white/90 text-sm">
                      You understand the ethical implications and future directions of AI development.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    // Navigate to next game path
                    window.location.href = "/student/ai-for-all/teen/what-is-ai-quiz";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Go to Summary
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Exploring!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review AI fundamentals, applications, ethics, and future trends to strengthen your expertise.
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

export default AIExplorerHeroBadgee;