import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexDistractionAlert = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-19";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const questions = [
    {
      id: 1,
      text: "Which action helps you focus?",
      options: [
        { 
          id: "notifications", 
          text: "Shut Notifications", 
          emoji: "🔕", 
          
          isCorrect: true
        },
        { 
          id: "phone", 
          text: "Keep Phone On", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          id: "quiet", 
          text: "Study in Quiet Room", 
          emoji: "🔇", 
          isCorrect: false
        },
        { 
          id: "music", 
          text: "Study with Loud Music", 
          emoji: "🔊", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What supports sustained focus?",
      options: [
        { 
          id: "chat", 
          text: "Chat with Friends", 
          emoji: "💬", 
          isCorrect: false
        },
        { 
          id: "breaks", 
          text: "Take Scheduled Breaks", 
          emoji: "⏰", 
          isCorrect: true
        },
        { 
          id: "organize", 
          text: "Organize Study Materials", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          id: "gaming", 
          text: "Play Video Games", 
          emoji: "🎮", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which helps maintain concentration?",
      options: [
        { 
          id: "distractions", 
          text: "Multiple Distractions", 
          emoji: "📺", 
          isCorrect: false
        },
        { 
          id: "multitask", 
          text: "Multitasking", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          id: "single", 
          text: "Single Task Focus", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          id: "routine", 
          text: "Consistent Routine", 
          emoji: "📅", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What boosts focus?",
      options: [
        { 
          id: "noise", 
          text: "Loud Environment", 
          emoji: "🔊", 
          isCorrect: false
        },
        { 
          id: "cram", 
          text: "Cramming Sessions", 
          emoji: "📖", 
          isCorrect: false
        },
        { 
          id: "sleep", 
          text: "Adequate Sleep", 
          emoji: "😴", 
          isCorrect: true
        },
        { 
          id: "hydration", 
          text: "Staying Hydrated", 
          emoji: "💧", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which action helps avoid distractions?",
      options: [
        { 
          id: "phone", 
          text: "Phone Notifications On", 
          emoji: "🔔", 
          isCorrect: false
        },
        { 
          id: "social", 
          text: "Social Media Open", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          id: "silent", 
          text: "Silent Mode", 
          emoji: "🔇", 
          isCorrect: true
        },
        { 
          id: "clean", 
          text: "Clean Workspace", 
          emoji: "✨", 
          isCorrect: false
        }
      ]
    }
  ];

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timeLeft and answered when round changes
  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  const handleTimeUp = useCallback(() => {
    if (currentRoundRef.current < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
    } else {
      setGameState("finished");
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && !answered && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, answered, timeLeft, handleTimeUp]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    setAnswered(false);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    if (answered || gameState !== "playing") return;
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = option.isCorrect;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentRound < TOTAL_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 500);
  };

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
  
  const finalScore = score;

  const currentQuestion = questions[currentRound - 1];

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (gameState === "finished") {
      console.log(`🎮 Reflex Distraction Alert game completed! Score: ${finalScore}/${TOTAL_ROUNDS}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [gameState, finalScore, gameId, nextGamePath, nextGameId, TOTAL_ROUNDS]);

  return (
    <GameShell
      title="Reflex Distraction Alert"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your distraction alert reflexes!` : "Test your distraction alert reflexes!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="brain"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}>
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🔔</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Answer questions about distraction alerts and focus!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} questions with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {currentQuestion.text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="w-full min-h-[80px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <span className="text-3xl mr-2">{option.emoji}</span> {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-white mb-4">Game Complete!</h3>
            <p className="text-xl text-white/90 mb-2">Final Score: <span className="font-bold text-yellow-400">{finalScore}/{TOTAL_ROUNDS}</span></p>
            <p className="text-lg text-white/80 mb-6">
              {finalScore === TOTAL_ROUNDS ? "Perfect score! Amazing distraction alert skills!" : 
               finalScore >= TOTAL_ROUNDS / 2 ? "Great job! You have good distraction alert skills!" : 
               "Keep practicing to improve your distraction alert skills!"}
            </p>
            <button
              onClick={() => {
                setGameState("ready");
                setScore(0);
                setCurrentRound(0);
                setTimeLeft(ROUND_TIME);
                setAnswered(false);
                resetFeedback();
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-full font-bold transition-all transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexDistractionAlert;
