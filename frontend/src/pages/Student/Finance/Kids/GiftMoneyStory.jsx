import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GiftMoneyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-38";
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You got ₹100 as gift money. What's the first thing to do?",
      options: [
        { 
          id: "spend", 
          text: "Spend it all on toys", 
          emoji: "🎮", 
          
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save some for later", 
          emoji: "🏦", 
          
          isCorrect: true
        },
        { 
          id: "snacks", 
          text: "Buy snacks", 
          emoji: "🍟", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You want new shoes for ₹80. You have ₹50. What's smart?",
      options: [
        { 
          id: "save", 
          text: "Save ₹30 more", 
          emoji: "💰", 
          isCorrect: true
        },
        { 
          id: "borrow", 
          text: "Borrow ₹30", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "toy", 
          text: "Buy a toy instead", 
          emoji: "🧸", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You saved ₹20. A sale offers shoes for ₹70. Can you buy them?",
      options: [
        { 
          id: "yes", 
          text: "Yes, I have enough", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          id: "discount", 
          text: "Ask for a discount", 
          emoji: "🎟️", 
          isCorrect: false
        },
        {
          id: "no",
          text: "No, need ₹50 more",
          emoji: "📉",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "Your friend suggests spending all your gift money. What do you say?",
      options: [
        { 
          id: "okay", 
          text: "Okay, let's spend it", 
          emoji: "🎉", 
          isCorrect: false
        },
        {
          id: "no",
          text: "No, I'll save some",
          emoji: "😓",
          isCorrect: true
        },
        { 
          id: "give", 
          text: "I'll give it to you", 
          emoji: "🎁", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is saving gift money a good idea?",
      options: [
        { 
          id: "bigger", 
          text: "Helps buy bigger things later", 
          emoji: "🚀", 
          isCorrect: true
        },
        { 
          id: "more", 
          text: "Lets you spend more now", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          id: "candy", 
          text: "Makes you buy candy", 
          emoji: "🍬", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ || !currentQ.options) {
      return;
    }

    const newChoices = [...choices, { 
      questionId: currentQ.id, 
      choice: selectedChoice,
      isCorrect: currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect;
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

  const handleNext = () => {
    navigate("/games/financial-literacy/kids");
  };

  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="Gift Money Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-38"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <div className="text-4xl mb-4 text-center">🎁</div>
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
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

export default GiftMoneyStory;