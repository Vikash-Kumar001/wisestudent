import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const StressBarometer = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-11";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showPattern, setShowPattern] = useState(false);

  // Stress levels for the barometer
  const stressLevels = [
    { 
      id: 'calm', 
      label: 'Calm', 
      value: 0,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      emoji: '😌'
    },
    { 
      id: 'mild', 
      label: 'Mild Stress', 
      value: 1,
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-300',
      emoji: '😐'
    },
    { 
      id: 'moderate', 
      label: 'Moderate Stress', 
      value: 2,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-300',
      emoji: '😰'
    },
    { 
      id: 'high', 
      label: 'High Stress', 
      value: 3,
      color: 'from-red-600 to-rose-700',
      bgColor: 'from-red-50 to-rose-50',
      borderColor: 'border-red-400',
      emoji: '😫'
    }
  ];

  // Daily scenarios with time and stress spikes
  const scenarios = [
    {
      id: 1,
      time: '6:00 AM',
      title: 'Morning Rush',
      description: 'Kids need breakfast, school bags ready, and you\'re running late for work.',
      correctAnswer: 'high', // High stress
      explanation: 'Early morning rush with multiple demands creates high stress.'
    },
    {
      id: 2,
      time: '10:00 AM',
      title: 'Work Break',
      description: 'You finally have a quiet moment with your coffee. No urgent deadlines.',
      correctAnswer: 'calm', // Calm
      explanation: 'Mid-morning break with no immediate pressures allows for calm.'
    },
    {
      id: 3,
      time: '3:00 PM',
      title: 'School Pickup',
      description: 'Pickup time, but traffic is heavy and you have a meeting in 30 minutes.',
      correctAnswer: 'moderate', // Moderate stress
      explanation: 'Time pressure and traffic create moderate stress levels.'
    },
    {
      id: 4,
      time: '6:30 PM',
      title: 'Homework Battle',
      description: 'Kids are refusing to do homework while dinner needs to be made.',
      correctAnswer: 'high', // High stress
      explanation: 'Multiple competing demands (homework + dinner) spike stress significantly.'
    },
    {
      id: 5,
      time: '9:00 PM',
      title: 'Bedtime Routine',
      description: 'Kids are finally asleep. You have 30 minutes to yourself before bed.',
      correctAnswer: 'mild', // Mild stress
      explanation: 'Day is winding down, but there\'s still mild stress from the day\'s events.'
    }
  ];

  const handleAnswerSelect = (stressLevel) => {
    if (selectedAnswers[currentQuestion]) return; // Already answered

    const selected = {
      question: currentQuestion,
      answer: stressLevel,
      isCorrect: stressLevel === scenarios[currentQuestion].correctAnswer
    };

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: selected
    }));

    if (selected.isCorrect) {
      setScore(prev => prev + 1);
    }

    // Show feedback, then move to next question or show summary
    setTimeout(() => {
      if (currentQuestion < totalLevels - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setShowPattern(true);
        setTimeout(() => {
          setShowGameOver(true);
        }, 3000);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(0);
    setShowGameOver(false);
    setShowPattern(false);
  };

  const currentScenario = scenarios[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const progress = ((currentQuestion + 1) / totalLevels) * 100;

  // Calculate stress pattern
  const stressPattern = scenarios.map((scenario, index) => ({
    time: scenario.time,
    selected: selectedAnswers[index]?.answer || 'calm',
    correct: scenario.correctAnswer,
    stressValue: stressLevels.find(l => l.id === (selectedAnswers[index]?.answer || 'calm'))?.value || 0
  }));

  const maxStress = Math.max(...stressPattern.map(p => p.stressValue));

  // Game content
  const gameContent = showPattern ? (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Your Daily Stress Pattern
        </h2>

        {/* Time-based stress barometer chart */}
        <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
          <div className="space-y-4">
            {stressPattern.map((pattern, index) => {
              const level = stressLevels.find(l => l.id === pattern.selected);
              const correctLevel = stressLevels.find(l => l.id === pattern.correct);
              const isCorrect = pattern.selected === pattern.correct;
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-semibold text-gray-700">
                    {pattern.time}
                  </div>
                  
                  {/* Stress barometer visualization */}
                  <div className="flex-1 relative">
                    <div className="h-12 bg-gray-100 rounded-lg overflow-hidden relative">
                      {/* Barometer fill */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((level?.value || 0) / 3) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className={`h-full bg-gradient-to-r ${level?.color || 'from-gray-400 to-gray-500'} rounded-lg flex items-center justify-end pr-2`}
                      >
                        <span className="text-white font-bold text-sm">
                          {level?.emoji || '😐'}
                        </span>
                      </motion.div>
                      
                      {/* Correct answer indicator */}
                      {!isCorrect && (
                        <div 
                          className="absolute top-0 h-full border-2 border-dashed border-purple-500"
                          style={{ 
                            left: `${((correctLevel?.value || 0) / 3) * 100}%`,
                            width: '4px'
                          }}
                          title={`Correct: ${correctLevel?.label}`}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="w-32">
                    <span className={`text-sm font-semibold ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
                      {isCorrect ? '✓ Correct' : '× Missed'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary insights */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-2">📊 Pattern Summary</h3>
            <p className="text-sm text-gray-700">
              Stress peaks typically occur during <strong>morning rush (6 AM)</strong> and <strong>evening chaos (6:30 PM)</strong>. 
              Notice how stress builds throughout the day. Schedule small breaks before these peak times!
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-4"
        >
          <p className="text-sm text-amber-800">
            <strong>💡 Parent Tip:</strong> Use this awareness to schedule small breaks before stress peaks. 
            Even 5 minutes of deep breathing at 5:30 PM can prevent the 6:30 PM stress spike!
          </p>
        </motion.div>
      </motion.div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full max-w-3xl"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {totalLevels}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Time and scenario */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-purple-200">
          <div className="text-center mb-6">
            <div className="inline-block bg-white px-4 py-2 rounded-full shadow-md mb-4">
              <span className="text-2xl font-bold text-indigo-600">🕐 {currentScenario.time}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {currentScenario.title}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentScenario.description}
            </p>
          </div>

          {/* Question */}
          <div className="text-center mb-6">
            <p className="text-xl font-semibold text-gray-800">
              What stress level would you feel in this moment?
            </p>
          </div>
        </div>

        {/* Stress level options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {stressLevels.map((level) => {
            const isSelected = selectedAnswer?.answer === level.id;
            const isCorrect = selectedAnswer && level.id === currentScenario.correctAnswer;
            const showFeedback = selectedAnswer && (isSelected || isCorrect);

            return (
              <motion.button
                key={level.id}
                onClick={() => handleAnswerSelect(level.id)}
                disabled={!!selectedAnswer}
                whileHover={!selectedAnswer ? { scale: 1.05 } : {}}
                whileTap={!selectedAnswer ? { scale: 0.95 } : {}}
                className={`
                  relative p-6 rounded-xl border-2 transition-all
                  ${!selectedAnswer 
                    ? `bg-gradient-to-br ${level.bgColor} ${level.borderColor} cursor-pointer hover:shadow-lg` 
                    : isSelected && isCorrect
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                    : isSelected && !isCorrect
                    ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                    : isCorrect
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                    : `bg-gradient-to-br ${level.bgColor} ${level.borderColor} opacity-50`
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{level.emoji}</span>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{level.label}</div>
                    </div>
                  </div>
                  
                  {showFeedback && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`text-2xl ${isSelected && isCorrect ? 'text-green-600' : isSelected && !isCorrect ? 'text-red-600' : 'text-green-600'}`}
                    >
                      {isSelected && isCorrect ? '✓' : isSelected && !isCorrect ? '×' : '✓'}
                    </motion.div>
                  )}
                </div>

                {/* Stress barometer visualization */}
                <div className="mt-4">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((level.value / 3) * 100)}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full bg-gradient-to-r ${level.color} rounded-full`}
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Feedback message */}
        {selectedAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center p-4 rounded-lg ${
              selectedAnswer.isCorrect
                ? 'bg-green-50 border border-green-200'
                : 'bg-orange-50 border border-orange-200'
            }`}
          >
            <p className={`font-semibold ${
              selectedAnswer.isCorrect ? 'text-green-800' : 'text-orange-800'
            }`}>
              {selectedAnswer.isCorrect ? (
                <>✓ Correct! {currentScenario.explanation}</>
              ) : (
                <>Not quite. {currentScenario.explanation}</>
              )}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );

  return (
    <ParentGameShell
      gameId={gameId}
      gameData={gameData}
      totalCoins={totalCoins}
      totalLevels={totalLevels}
      currentLevel={currentQuestion + 1}
      score={score}
      showGameOver={showGameOver}
      onRestart={handleRestart}
      progress={progress}
    >
      {gameContent}
    </ParentGameShell>
  );
};

export default StressBarometer;

