import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateStage1 = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-65";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Does online identity matter for success?",
      options: [
        { 
          id: "no-matter", 
          text: "it doesn't matter", 
          isCorrect: false
        },
        { 
          id: "yes-opportunities", 
          text: "it affects opportunities", 
          isCorrect: true
        },
        { 
          id: "maybe", 
          text: "only for some careers", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Is your online presence important for your future?",
      options: [
        { 
          id: "no-skills", 
          text: "only skills matter", 
          isCorrect: false
        },
        { 
          id: "sometimes", 
          text: "depends on the field", 
          isCorrect: false
        },
        { 
          id: "yes-check", 
          text: "employers and colleges check", 
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Can your digital footprint impact your career?",
      options: [
        { 
          id: "no-separate", 
          text: "online doesn't affect real life", 
          isCorrect: false
        },
        { 
          id: "yes-help-hurt", 
          text: "it can help or hurt", 
          isCorrect: true
        },
        { 
          id: "maybe", 
          text: "only if it's negative", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Does your online reputation matter for success?",
      options: [
        { 
          id: "yes-identity", 
          text: "it's part of your identity", 
          isCorrect: true
        },
        { 
          id: "no-separate-success", 
          text: "it's separate from success", 
          isCorrect: false
        },
        
        { 
          id: "maybe", 
          text: "only for public figures", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Is building a positive online identity important?",
      options: [
        { 
          id: "no-necessary", 
          text: "not necessary", 
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "only if you want to be famous", 
          isCorrect: false
        },
        { 
          id: "yes-doors", 
          text: "it opens doors", 
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Online Identity"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                  >
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
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

export default DebateStage1;
