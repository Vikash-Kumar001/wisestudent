import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const SimulationSchoolFair = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-88";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
    try {
      const games = getBrainTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Budget ₹500. What's the best approach?",
      options: [
        { id: 'build', text: 'Build model',  isCorrect: true },
        { id: 'copy', text: 'Copy poster',  isCorrect: false },
        { id: 'nothing', text: 'Do nothing',  isCorrect: false },
        { id: 'buy', text: 'Buy ready-made',  isCorrect: false }
      ],
      correct: 'build',
      explanation: 'Building a model shows creativity, problem-solving skills, and hands-on learning, making it the best choice!'
    },
    {
      id: 2,
      text: "You have ₹300 for a school project. What's the best approach?",
      options: [
        { id: 'copy', text: 'Copy someone else\'s work', isCorrect: false },
        { id: 'create', text: 'Create something original', isCorrect: true },
        { id: 'skip', text: 'Skip the project', isCorrect: false },
        { id: 'buy', text: 'Buy expensive materials', isCorrect: false }
      ],
      correct: 'create',
      explanation: 'Creating something original demonstrates creativity, problem-solving, and learning, making it the best use of your budget!'
    },
    {
      id: 3,
      text: "What's more valuable: creating or copying?",
      options: [
        { id: 'copy', text: 'Copying is always better', isCorrect: false },
        { id: 'same', text: 'They are the same', isCorrect: false },
        { id: 'create', text: 'Creating teaches skills and shows innovation', isCorrect: true },
        { id: 'neither', text: 'Neither has value', isCorrect: false }
      ],
      correct: 'create',
      explanation: 'Creating teaches valuable skills, demonstrates innovation, and provides learning experiences that copying cannot!'
    },
    {
      id: 4,
      text: "How should you use a limited budget for a project?",
      options: [
        { id: 'smart', text: 'Plan creatively and build something meaningful',  isCorrect: true },
        { id: 'waste', text: 'Waste it on unnecessary items', isCorrect: false },
        { id: 'copy', text: 'Copy without learning', isCorrect: false },
        { id: 'ignore', text: 'Ignore the budget', isCorrect: false }
      ],
      correct: 'smart',
      explanation: 'Planning creatively and building something meaningful maximizes learning and value from your budget!'
    },
    {
      id: 5,
      text: "What makes a school project successful?",
      options: [
        { id: 'copy', text: 'Copying others\' work', isCorrect: false },
        { id: 'effort', text: 'Original effort and creative thinking', isCorrect: true },
        { id: 'expensive', text: 'Spending the most money', isCorrect: false },
        { id: 'quick', text: 'Finishing quickly', isCorrect: false }
      ],
      correct: 'effort',
      explanation: 'A successful project shows original effort, creative thinking, and demonstrates what you\'ve learned!'
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correct;
    setFeedbackType(isCorrect ? "correct" : "wrong");
    setShowFeedback(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Auto-advance to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        setFeedbackType(null);
      } else {
        setLevelCompleted(true);
      }
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (levelCompleted) {
      console.log(`🎮 Simulation: School Fair game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [levelCompleted, score, gameId, nextGamePath, nextGameId, questions.length]);

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Simulation: School Fair"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4">
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {currentQuestionData.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = showFeedback && isSelected && option.id === questions[currentQuestion].correct;
                  const showIncorrect = showFeedback && isSelected && option.id !== questions[currentQuestion].correct;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      disabled={!!selectedOption}
                      className={`p-4 md:p-6 rounded-xl md:rounded-2xl transition-all transform text-left ${
                        showCorrect
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-300 scale-105"
                          : showIncorrect
                          ? "bg-gradient-to-r from-red-500 to-red-600 border-2 border-red-300"
                          : isSelected
                          ? "bg-gradient-to-r from-blue-600 to-cyan-700 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-2 border-transparent hover:scale-105"
                      } disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      <div className="text-white font-bold text-sm md:text-base mb-1">{option.text}</div>
                      <div className="text-white/70 text-xs md:text-sm">{option.description}</div>
                    </button>
                  );
                })}
              </div>
              
              {showFeedback && feedbackType === "wrong" && (
                <div className="mt-4 md:mt-6 text-white/90 text-center text-sm md:text-base">
                  <p>💡 {currentQuestionData.explanation}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SimulationSchoolFair;
