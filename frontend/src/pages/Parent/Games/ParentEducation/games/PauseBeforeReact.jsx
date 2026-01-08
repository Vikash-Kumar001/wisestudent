import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const PauseBeforeReact = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-13";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [showOutcome, setShowOutcome] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Parenting scenarios with pause vs react options
  const scenarios = [
    {
      id: 1,
      title: "Spilled Juice",
      situation: "Your child accidentally spills a full glass of juice on the new carpet. They look scared and start to cry.",
      pauseOutcome: {
        title: "You Paused (5 seconds)",
        description: "You took a deep breath, counted to 5, and said: 'It's okay, accidents happen. Let's clean it up together.'",
        result: "Your child calmed down, helped clean up, and learned responsibility. The carpet was saved, and your relationship stayed positive.",
        emoji: "😌",
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-300"
      },
      reactOutcome: {
        title: "You Reacted Immediately",
        description: "You shouted: 'Why are you so clumsy? Look what you did!'",
        result: "Your child cried harder, felt ashamed, and avoided you. The carpet stain got worse while you argued. Everyone felt worse.",
        emoji: "😢",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400"
      },
      correctChoice: "pause",
      explanation: "A 5-second pause allows you to respond thoughtfully instead of reacting emotionally. This teaches your child that mistakes are learning opportunities."
    },
    {
      id: 2,
      title: "Homework Refusal",
      situation: "Your child refuses to do homework, saying 'I hate school!' and throws their pencil across the room.",
      pauseOutcome: {
        title: "You Paused (5 seconds)",
        description: "You took a moment, then calmly asked: 'I see you're frustrated. What's making homework so hard today?'",
        result: "Your child opened up about struggling with math. You found a solution together. Homework got done, and your child felt heard and supported.",
        emoji: "🤝",
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-300"
      },
      reactOutcome: {
        title: "You Reacted Immediately",
        description: "You yelled: 'You WILL do your homework right now, or no screen time for a week!'",
        result: "Your child shut down, refused to cooperate, and the power struggle escalated. Homework didn't get done, and bedtime was a battle.",
        emoji: "⚔️",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400"
      },
      correctChoice: "pause",
      explanation: "Pausing helps you understand the real issue behind the behavior. Reacting creates power struggles; pausing creates connection."
    },
    {
      id: 3,
      title: "Bedtime Resistance",
      situation: "It's 9 PM, past bedtime. Your child is still playing and refuses to go to bed, saying 'I'm not tired!'",
      pauseOutcome: {
        title: "You Paused (5 seconds)",
        description: "You took a breath and said: 'I understand you want to keep playing. Let's finish this level, then we'll do our bedtime routine together.'",
        result: "Your child felt respected, finished their game, and cooperated with bedtime. Everyone got to sleep peacefully, and you felt calm.",
        emoji: "🌙",
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-300"
      },
      reactOutcome: {
        title: "You Reacted Immediately",
        description: "You snapped: 'Get to bed NOW! I'm tired of this every night!'",
        result: "Your child cried, refused to move, and bedtime took an extra hour. You both went to bed angry and exhausted.",
        emoji: "😤",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400"
      },
      correctChoice: "pause",
      explanation: "Even 5 seconds of silence changes the energy. Pausing lets you offer choices and respect, which children respond to better than demands."
    },
    {
      id: 4,
      title: "Sibling Conflict",
      situation: "Your two children are fighting over a toy. One is crying, the other is shouting. Toys are being thrown.",
      pauseOutcome: {
        title: "You Paused (5 seconds)",
        description: "You stepped back, took a breath, then calmly separated them and said: 'I see you're both upset. Let's take turns with the toy.'",
        result: "Both children calmed down. You helped them problem-solve together. They learned conflict resolution, and peace was restored quickly.",
        emoji: "☮️",
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-300"
      },
      reactOutcome: {
        title: "You Reacted Immediately",
        description: "You shouted: 'Stop fighting! Both of you, go to your rooms right now!'",
        result: "Everyone felt worse. The children blamed each other more. The conflict continued later, and you felt like a bad parent.",
        emoji: "💥",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400"
      },
      correctChoice: "pause",
      explanation: "Pausing in conflict helps you model emotional regulation. Your calm response teaches children how to handle disagreements peacefully."
    },
    {
      id: 5,
      title: "Messy Room",
      situation: "You walk into your child's room and it's a disaster zone—clothes everywhere, toys scattered, bed unmade. You asked them to clean it this morning.",
      pauseOutcome: {
        title: "You Paused (5 seconds)",
        description: "You took a moment, then said: 'I see the room is still messy. Let's tackle this together. I'll help you get started.'",
        result: "Your child felt supported, not shamed. The room got cleaned together, and your child learned organization skills. Your relationship stayed positive.",
        emoji: "✨",
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-300"
      },
      reactOutcome: {
        title: "You Reacted Immediately",
        description: "You snapped: 'This is a pigsty! Clean this up NOW or you're grounded!'",
        result: "Your child felt defensive and ashamed. They cleaned up resentfully, and the room was messy again the next day. Trust was damaged.",
        emoji: "😠",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400"
      },
      correctChoice: "pause",
      explanation: "Pausing prevents shame and blame. When you pause, you can offer help and connection, which motivates children more than threats."
    }
  ];

  const handleChoice = (choice) => {
    if (selectedChoices[currentScenario]) return; // Already answered

    const isCorrect = choice === scenarios[currentScenario].correctChoice;
    const selected = {
      scenario: currentScenario,
      choice: choice,
      isCorrect: isCorrect
    };

    setSelectedChoices(prev => ({
      ...prev,
      [currentScenario]: selected
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowOutcome(true);
  };

  const handleNext = () => {
    setShowOutcome(false);
    if (currentScenario < totalLevels - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setSelectedChoices({});
    setShowOutcome(false);
    setScore(0);
    setShowGameOver(false);
  };

  const current = scenarios[currentScenario];
  const selected = selectedChoices[currentScenario];
  const progress = ((currentScenario + 1) / totalLevels) * 100;
  const outcome = selected ? (selected.choice === 'pause' ? current.pauseOutcome : current.reactOutcome) : null;

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentScenario}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Scenario {currentScenario + 1} of {totalLevels}</span>
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

        {!showOutcome ? (
          <>
            {/* Scenario description */}
            <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-orange-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {current.title}
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {current.situation}
                  </p>
                </div>
              </div>

              {/* Question */}
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                  What do you do?
                </p>
                <p className="text-sm text-gray-600">
                  Choose your response in this moment
                </p>
              </div>
            </div>

            {/* Choice buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Pause option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice('pause')}
                disabled={!!selected}
                className={`
                  relative p-8 rounded-2xl border-2 transition-all text-left
                  ${selected
                    ? selected.choice === 'pause'
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                      : 'bg-gray-50 border-gray-300 opacity-50'
                    : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 hover:shadow-xl cursor-pointer'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">⏸️</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Pause
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Take 5 seconds to breathe and think before responding
                    </p>
                  </div>
                </div>
                {selected && selected.choice === 'pause' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 text-3xl"
                  >
                    {selected.isCorrect ? '✓' : '×'}
                  </motion.div>
                )}
              </motion.button>

              {/* React option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice('react')}
                disabled={!!selected}
                className={`
                  relative p-8 rounded-2xl border-2 transition-all text-left
                  ${selected
                    ? selected.choice === 'react'
                      ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                      : 'bg-gray-50 border-gray-300 opacity-50'
                    : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 hover:shadow-xl cursor-pointer'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">⚡</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      React
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Respond immediately with your first emotional reaction
                    </p>
                  </div>
                </div>
                {selected && selected.choice === 'react' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 text-3xl"
                  >
                    {selected.isCorrect ? '✓' : '×'}
                  </motion.div>
                )}
              </motion.button>
            </div>
          </>
        ) : (
          /* Outcome display */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Outcome card */}
              <div className={`bg-gradient-to-br ${outcome.bgColor} rounded-2xl p-8 shadow-xl border-2 ${outcome.borderColor}`}>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{outcome.emoji}</div>
                  <h3 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${outcome.color} bg-clip-text text-transparent`}>
                    {outcome.title}
                  </h3>
                  <p className="text-lg text-gray-700 italic mb-4">
                    "{outcome.description}"
                  </p>
                </div>

                <div className="bg-white/80 rounded-xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    Result:
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {outcome.result}
                  </p>
                </div>
              </div>

              {/* Explanation */}
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  delay={0.3}
                  className={`p-6 rounded-xl border-2 ${
                    selected.isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <p className={`font-semibold ${
                    selected.isCorrect ? 'text-green-800' : 'text-orange-800'
                  }`}>
                    {selected.isCorrect ? '✓ Great choice! ' : '💡 Learning moment: '}
                    {current.explanation}
                  </p>
                </motion.div>
              )}

              {/* Parent tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                delay={0.5}
                className="bg-amber-50 border border-amber-200 rounded-xl p-6"
              >
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>💡 Parent Tip:</strong> Even 5 seconds of silence changes the energy of a conflict. 
                  When you pause, you give yourself space to choose a response that builds connection instead of creating distance.
                </p>
              </motion.div>

              {/* Next button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {currentScenario < totalLevels - 1 ? 'Next Scenario' : 'View Results'}
              </motion.button>
            </motion.div>
          </AnimatePresence>
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
      currentLevel={currentScenario + 1}
      score={score}
      showGameOver={showGameOver}
      onRestart={handleRestart}
      progress={progress}
    >
      {gameContent}
    </ParentGameShell>
  );
};

export default PauseBeforeReact;

