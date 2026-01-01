import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const SimulationStressDay = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-38";
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
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      text: "You feel stressed. What should you do?",
      options: [
        { id: 'walk', text: 'Walk & breathe',  isCorrect: true },
        { id: 'junk', text: 'Eat junk food',  isCorrect: false },
        { id: 'sleep', text: 'Sleep all day',  isCorrect: false },
        { id: 'ignore', text: 'Ignore the stress',  isCorrect: false }
      ],
      correct: 'walk',
      explanation: 'Walking and breathing fresh air calms the nervous system, reduces cortisol, and provides natural stress relief!'
    },
    {
      id: 2,
      text: "You're in an argument. How should you handle it?",
      options: [
        { id: 'yell', text: 'Yell back',  isCorrect: false },
        { id: 'step', text: 'Step away & cool down',  isCorrect: true },
        { id: 'ignore', text: 'Ignore completely',  isCorrect: false },
        { id: 'blame', text: 'Blame the other person',  isCorrect: false }
      ],
      correct: 'step',
      explanation: 'Taking space allows emotions to settle and enables more productive communication later!'
    },
    {
      id: 3,
      text: "You have a busy, overwhelming day. What should you do?",
      options: [
        { id: 'multitask', text: 'Try to do everything at once',  isCorrect: false },
        { id: 'panic', text: 'Panic and rush',  isCorrect: false },
        { id: 'avoid', text: 'Avoid all tasks',  isCorrect: false },
        { id: 'prioritize', text: 'Prioritize and make a list',  isCorrect: true }
      ],
      correct: 'prioritize',
      explanation: 'Making a prioritized list helps organize thoughts, reduces overwhelm, and makes tasks more manageable!'
    },
    {
      id: 4,
      text: "It's evening after a stressful day. What's the best way to unwind?",
      options: [
        { id: 'bath', text: 'Take a relaxing bath',  isCorrect: true },
        { id: 'screen', text: 'Scroll on phone for hours',  isCorrect: false },
        { id: 'work', text: 'Continue working',  isCorrect: false },
        { id: 'worry', text: 'Worry about tomorrow',  isCorrect: false }
      ],
      correct: 'bath',
      explanation: 'A warm bath promotes relaxation, reduces muscle tension, and prepares your body for better sleep!'
    },
    {
      id: 5,
      text: "At the end of a stressful day, how should you reflect?",
      options: [
        { id: 'negative', text: 'Dwell on negatives only', isCorrect: false },
        { id: 'ignore', text: 'Ignore the day completely', isCorrect: false },
        { id: 'blame', text: 'Blame others for everything', isCorrect: false },
        { id: 'positive', text: 'Reflect on what went well', isCorrect: true }
      ],
      correct: 'positive',
      explanation: 'Positive reflection helps build resilience, improves mood, and sets a better tone for the next day!'
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correct;
    setFeedbackType(isCorrect ? "correct" : "wrong");
    setShowFeedback(true);
    resetFeedback();
    
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: {
        selected: optionId,
        correct: isCorrect
      }
    }));
    
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
      console.log(`🎮 Simulation: Stress Day game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Simulation: Stress Day"
      subtitle={!levelCompleted ? `Question ${currentQuestion + 1} of ${questions.length}` : "Simulation Complete!"}
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
      showConfetti={levelCompleted && score >= 3}
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

export default SimulationStressDay;
