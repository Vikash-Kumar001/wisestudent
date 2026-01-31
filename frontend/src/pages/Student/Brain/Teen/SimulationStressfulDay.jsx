import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const SimulationStressfulDay = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-48";
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
      text: "You're having a stressful day. How should you handle your emotions?",
      options: [
        { id: 'journal', text: 'Journal/talk',  isCorrect: true },
        { id: 'bottle', text: 'Bottle feelings',  isCorrect: false },
        { id: 'shout', text: 'Shout',  isCorrect: false },
        { id: 'ignore', text: 'Ignore completely',  isCorrect: false }
      ],
      correct: 'journal',
      explanation: 'Journaling or talking to someone helps process emotions healthily, reduces stress, and provides perspective!'
    },
    {
      id: 2,
      text: "You receive a bad grade. How should you handle your feelings?",
      options: [
        { id: 'tantrum', text: 'Throw a tantrum',  isCorrect: false },
        { id: 'process', text: 'Cry then make a plan',  isCorrect: true },
        { id: 'deny', text: 'Deny the grade',  isCorrect: false },
        { id: 'blame', text: 'Blame the teacher',  isCorrect: false }
      ],
      correct: 'process',
      explanation: 'Allowing yourself to feel the emotion, then creating a plan, helps you process and move forward constructively!'
    },
    {
      id: 3,
      text: "You have a fight with a friend. What's the best approach?",
      options: [
        { id: 'ghost', text: 'Ghost them',  isCorrect: false },
        { id: 'wait', text: 'Wait for them to apologize',  isCorrect: false },
        { id: 'apologize', text: 'Apologize first if needed',  isCorrect: true },
        { id: 'ignore', text: 'Ignore the conflict',  isCorrect: false }
      ],
      correct: 'apologize',
      explanation: 'Taking responsibility and apologizing when appropriate mends relationships and shows emotional maturity!'
    },
    {
      id: 4,
      text: "You're overwhelmed with tasks. What should you do?",
      options: [
        { id: 'prioritize', text: 'Prioritize & break down', isCorrect: true },
        { id: 'panic', text: 'Panic and quit', isCorrect: false },
        { id: 'rush', text: 'Rush through everything', isCorrect: false },
        { id: 'avoid', text: 'Avoid all tasks', isCorrect: false }
      ],
      correct: 'prioritize',
      explanation: 'Breaking tasks into smaller, prioritized steps reduces overwhelm and makes everything more manageable!'
    },
    {
      id: 5,
      text: "At the end of a stressful day, how should you reflect?",
      options: [
        { id: 'negative', text: 'Focus on negatives only', isCorrect: false },
        { id: 'balanced', text: 'Reflect on positives too', isCorrect: true },
        { id: 'ignore', text: 'Ignore the day', isCorrect: false },
        { id: 'dwell', text: 'Dwell on mistakes', isCorrect: false }
      ],
      correct: 'balanced',
      explanation: 'Balanced reflection that includes positives helps build resilience and sets a better tone for the next day!'
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
    }, 5000);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (levelCompleted) {
      console.log(`🎮 Simulation: Stressful Day game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Simulation: Stressful Day"
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

export default SimulationStressfulDay;
