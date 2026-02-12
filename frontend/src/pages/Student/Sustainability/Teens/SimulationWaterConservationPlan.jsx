import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const SimulationWaterConservationPlan = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-53");
  const gameId = gameData?.id || "sustainability-teens-53";
  // Hardcode rewards: 3 coins per question, 15 total coins, 10 total XP
  const coinsPerLevel = 3;
  const totalCoins = 15;
  const totalXp = 30;
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track number of correct answers for score
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Set global window variables for useGameFeedback
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__flashTotalCoins = totalCoins;
      window.__flashQuestionCount = questions.length;
      window.__flashPointsMultiplier = coinsPerLevel;
      
      return () => {
        // Clean up on unmount
        window.__flashTotalCoins = null;
        window.__flashQuestionCount = null;
        window.__flashPointsMultiplier = 1;
      };
    }
  }, [totalCoins, coinsPerLevel]);

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityTeenGames({});
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

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (gameFinished) {
      console.log(`🎮 Simulation: Water Conservation Plan game completed! Score: ${correctAnswers}/5, Coins: ${coins}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [gameFinished, correctAnswers, coins, gameId, nextGamePath, nextGameId]);

  const questions = [
    {
      id: 1,
      text: "What should be the first priority in your water conservation program?",
      options: [
        { id: "b", text: "Install new equipment", emoji: "🔧", isCorrect: false },
        { id: "a", text: "Assess current water usage", emoji: "📊", isCorrect: true },
        { id: "c", text: "Launch awareness campaigns", emoji: "📢", isCorrect: false },
        { id: "d", text: "Build new infrastructure", emoji: "🏗️", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Which area in the community typically uses the most water?",
      options: [
        { id: "b", text: "Public swimming pools", emoji: "🏊", isCorrect: false },
        { id: "a", text: "Residential gardens", emoji: "🌱", isCorrect: false },
        { id: "c", text: "Industrial facilities", emoji: "🏭", isCorrect: true },
        { id: "d", text: "Schools", emoji: "🏫", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "What's the most effective way to reduce water waste in homes?",
      options: [
        { id: "a", text: "Fix leaks immediately", emoji: "🔧", isCorrect: true },
        { id: "b", text: "Install new faucets", emoji: "🚰", isCorrect: false },
        { id: "c", text: "Replace toilets", emoji: "🚽", isCorrect: false },
        { id: "d", text: "Use less soap", emoji: "🧼", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "How should you engage the community in water conservation?",
      options: [
        { id: "b", text: "Mandate restrictions", emoji: "🚫", isCorrect: false },
        { id: "c", text: "Increase water prices", emoji: "💰", isCorrect: false },
        { id: "d", text: "Rely on government", emoji: "🏛️", isCorrect: false },
        { id: "a", text: "Educate and involve residents", emoji: "👥", isCorrect: true },
      ]
    },
    {
      id: 5,
      text: "What's the best long-term strategy for sustainable water use?",
      options: [
        { id: "b", text: "Build more reservoirs", emoji: "💧", isCorrect: false },
        { id: "a", text: "Diversify water sources", emoji: "💧", isCorrect: true },
        { id: "c", text: "Import water", emoji: "🚚", isCorrect: false },
        { id: "d", text: "Increase usage", emoji: "📈", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = questions[currentScenario].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 3); // Increment coins when correct (3 coins per question)
      setCorrectAnswers(prev => prev + 1); // Increment correct answers count
      // Show feedback after state updates
      setTimeout(() => {
        showCorrectAnswerFeedback(1, true);
      }, 50);
    }

    setChoices([...choices, { scenario: currentScenario, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentScenario < questions.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const currentQuestionData = questions[currentScenario];

  // Debug logging
  useEffect(() => {
    console.log('🎮 SimulationWaterConservationPlan debug:', {
      correctAnswers,
      coins,
      coinsPerLevel,
      totalCoins,
      questionsLength: 5,
      gameFinished
    });
  }, [correctAnswers, coins, coinsPerLevel, totalCoins, gameFinished]);

  // Debug: Log GameShell props
  useEffect(() => {
    if (gameFinished) {
      console.log('🎮 GameShell props:', {
        score: correctAnswers,
        maxScore: questions.length,
        coinsPerLevel,
        totalCoins,
        totalXp,
        totalLevels: questions.length
      });
    }
  }, [gameFinished, correctAnswers, coinsPerLevel, totalCoins, totalXp]);

  return (
    <GameShell
      title="Simulation: Water Conservation Plan"
      subtitle={`Scenario ${currentScenario + 1} of ${questions.length}`}
      showGameOver={gameFinished}
      score={correctAnswers}
      gameId={gameId}
      gameType="sustainability"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      totalLevels={questions.length}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/teens/reflex-water-solutions"
      nextGameIdProp="sustainability-teens-54">
      <div className="space-y-8">
        {!gameFinished && currentQuestionData && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Scenario {currentScenario + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold">Coins: {coins}</span>
            </div>
            <p className="text-white text-lg mb-6">{currentQuestionData.text}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestionData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{option.emoji}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationWaterConservationPlan;