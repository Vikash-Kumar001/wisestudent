import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const FeelingsFirst = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-22";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [showOutcome, setShowOutcome] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Scenarios with phrases - player identifies if it's acknowledging or advising too soon
  const scenarios = [
    {
      id: 1,
      title: "Broken Toy",
      situation: "Your child comes to you crying. Their favorite toy broke. They say: 'I can't fix it! It's ruined forever!'",
      childEmotion: "Sad, frustrated, hopeless",
      phrase1: {
        text: "I can see you're really upset about your toy. That must feel really disappointing. Want to tell me what happened?",
        type: "acknowledging",
        explanation: "This response validates the child's emotion first. It acknowledges their feelings before offering any solutions or advice."
      },
      phrase2: {
        text: "Don't worry, we can just buy a new one. Or maybe we can try to glue it. Let's fix this right away!",
        type: "advising",
        explanation: "This response jumps straight to problem-solving without first acknowledging the child's emotional experience. It skips over their feelings."
      },
      correctChoice: "acknowledging",
      whyItMatters: "When children feel heard and understood, they become more open to solutions. Starting with emotional validation creates safety and connection, making problem-solving much more effective later."
    },
    {
      id: 2,
      title: "Friend Conflict",
      situation: "Your child comes home from school looking dejected. They say: 'Emma didn't want to play with me today. She played with Sarah instead.'",
      childEmotion: "Rejected, hurt, lonely",
      phrase1: {
        text: "I hear you're feeling hurt by this. It's really painful when a friend seems to choose someone else. Want to talk about how that felt?",
        type: "acknowledging",
        explanation: "This response first validates the child's emotional experience. It names the feeling (hurt) and creates space for the child to process before moving to solutions."
      },
      phrase2: {
        text: "Well, you should just play with someone else too. There are plenty of other kids. Maybe you should try to be friends with different people.",
        type: "advising",
        explanation: "This response immediately offers advice and solutions without first acknowledging how the child feels. It dismisses their emotional experience."
      },
      correctChoice: "acknowledging",
      whyItMatters: "Children need to feel their emotions are valid before they can process them and move forward. Acknowledging first creates emotional safety, which helps children develop resilience."
    },
    {
      id: 3,
      title: "Test Anxiety",
      situation: "Your child is visibly stressed before a big test. They say: 'I'm going to fail. I didn't study enough. Everyone is going to do better than me.'",
      childEmotion: "Anxious, overwhelmed, fearful",
      phrase1: {
        text: "I can see you're really worried about this test. That anxiety must feel really heavy right now. Want to tell me more about what's making you feel this way?",
        type: "acknowledging",
        explanation: "This response recognizes and validates the child's anxiety first. It creates space for the emotion before addressing the practical concerns."
      },
      phrase2: {
        text: "You'll be fine! You studied enough. Just take deep breaths and do your best. Worrying won't help, so stop thinking about it.",
        type: "advising",
        explanation: "This response immediately tries to solve the problem and minimize the emotion. It tells the child not to feel what they're feeling, which invalidates their experience."
      },
      correctChoice: "acknowledging",
      whyItMatters: "When we validate anxiety first, children feel less alone with their feelings. This actually reduces the anxiety more effectively than trying to talk them out of it. Then, advice becomes more meaningful."
    },
    {
      id: 4,
      title: "Bedtime Resistance",
      situation: "It's bedtime and your child is resisting. They say: 'I don't want to go to bed! I'm not tired! I'll miss out on everything!'",
      childEmotion: "Frustrated, worried, anxious about missing out",
      phrase1: {
        text: "I can see you're feeling worried about going to bed. It sounds like you're afraid you'll miss something fun. That's a really strong feeling. Want to talk about it?",
        type: "acknowledging",
        explanation: "This response first acknowledges the underlying emotion (worry, FOMO) rather than focusing on the behavior. It validates their experience before addressing bedtime."
      },
      phrase2: {
        text: "You need your sleep. Everyone else is going to bed too. Just go to your room and stop complaining. You'll be tired tomorrow if you don't sleep now.",
        type: "advising",
        explanation: "This response jumps straight to logic and rules without acknowledging the child's emotional experience. It treats the behavior without addressing the feeling behind it."
      },
      correctChoice: "acknowledging",
      whyItMatters: "When children feel their emotions are understood, they become more cooperative. Acknowledging feelings first often resolves the behavior more effectively than commands or logic alone."
    },
    {
      id: 5,
      title: "Sibling Comparison",
      situation: "Your child looks upset. They say: 'You always help my sister with her homework, but you never help me. You like her more than me.'",
      childEmotion: "Jealous, hurt, feeling unloved",
      phrase1: {
        text: "I can hear that you're feeling hurt and maybe a bit jealous. It sounds like you're worried that I don't care as much about you. That must feel really painful. Can you tell me more?",
        type: "acknowledging",
        explanation: "This response first validates the child's emotional experience—naming the feelings (hurt, jealousy, worry) and creating space for them to express more. It addresses the emotion before the situation."
      },
      phrase2: {
        text: "That's not true at all! I love you both equally. You're older and don't need as much help. Your sister is younger, so she needs more assistance. You should understand that.",
        type: "advising",
        explanation: "This response immediately jumps to defending and explaining without first acknowledging the child's emotional experience. It invalidates their feelings by focusing on facts."
      },
      correctChoice: "acknowledging",
      whyItMatters: "When children express hurt feelings, they need emotional validation first. Facts and explanations mean nothing until the child feels heard. Acknowledging first allows for meaningful connection and then productive discussion."
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
  const phrase1IsAcknowledging = current.phrase1.type === 'acknowledging';
  const phrase2IsAcknowledging = current.phrase2.type === 'acknowledging';

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
            {/* Situation description */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-indigo-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {current.title}
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <p className="text-xl text-gray-700 leading-relaxed mb-4">
                    {current.situation}
                  </p>
                  <div className="bg-indigo-100 rounded-lg p-4 inline-block">
                    <p className="text-sm text-indigo-800 font-medium">
                      💭 Child's emotion: <span className="font-semibold">{current.childEmotion}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                  Which response acknowledges the feeling first?
                </p>
                <p className="text-sm text-gray-600">
                  Choose the phrase that validates emotion before offering advice
                </p>
              </div>
            </div>

            {/* Choice buttons */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              {/* Phrase 1 */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleChoice(phrase1IsAcknowledging ? 'acknowledging' : 'advising')}
                disabled={!!selected}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all text-left
                  ${selected
                    ? (selected.choice === 'acknowledging' && phrase1IsAcknowledging) || (selected.choice === 'advising' && !phrase1IsAcknowledging)
                      ? selected.isCorrect
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                        : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                      : 'bg-gray-50 border-gray-300 opacity-50'
                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 hover:shadow-xl cursor-pointer'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💬</div>
                  <div className="flex-1">
                    <p className="text-lg text-gray-700 leading-relaxed italic mb-2">
                      "{current.phrase1.text}"
                    </p>
                    <div className="text-sm text-gray-500 font-medium">
                      Response A
                    </div>
                  </div>
                </div>
                {selected && ((selected.choice === 'acknowledging' && phrase1IsAcknowledging) || (selected.choice === 'advising' && !phrase1IsAcknowledging)) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute top-4 right-4 text-3xl ${selected.isCorrect ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {selected.isCorrect ? '✓' : '×'}
                  </motion.div>
                )}
              </motion.button>

              {/* Phrase 2 */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleChoice(phrase2IsAcknowledging ? 'acknowledging' : 'advising')}
                disabled={!!selected}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all text-left
                  ${selected
                    ? (selected.choice === 'acknowledging' && phrase2IsAcknowledging) || (selected.choice === 'advising' && !phrase2IsAcknowledging)
                      ? selected.isCorrect
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                        : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                      : 'bg-gray-50 border-gray-300 opacity-50'
                    : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 hover:shadow-xl cursor-pointer'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💬</div>
                  <div className="flex-1">
                    <p className="text-lg text-gray-700 leading-relaxed italic mb-2">
                      "{current.phrase2.text}"
                    </p>
                    <div className="text-sm text-gray-500 font-medium">
                      Response B
                    </div>
                  </div>
                </div>
                {selected && ((selected.choice === 'acknowledging' && phrase2IsAcknowledging) || (selected.choice === 'advising' && !phrase2IsAcknowledging)) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute top-4 right-4 text-3xl ${selected.isCorrect ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {selected.isCorrect ? '✓' : '×'}
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-sm text-amber-800">
                <strong>💡 Remember:</strong> Look for responses that acknowledge and validate the child's emotion before jumping to solutions or advice.
              </p>
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
              {/* Correct answer display */}
              <div className={`bg-gradient-to-br ${
                selected && selected.isCorrect
                  ? 'from-green-50 to-emerald-50 border-green-300'
                  : 'from-orange-50 to-red-50 border-orange-300'
              } rounded-2xl p-8 shadow-xl border-2`}>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">
                    {selected && selected.isCorrect ? '✓' : '💡'}
                  </div>
                  <h3 className={`text-3xl font-bold mb-2 ${
                    selected && selected.isCorrect
                      ? 'text-green-700'
                      : 'text-orange-700'
                  }`}>
                    {selected && selected.isCorrect 
                      ? 'Correct! This response acknowledges the feeling first.'
                      : 'This response advises too soon.'}
                  </h3>
                </div>

                {/* Show the correct phrase */}
                <div className="bg-white/80 rounded-xl p-6 shadow-lg mb-4">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    {selected && selected.isCorrect ? 'Your choice:' : 'The acknowledging response:'}
                  </h4>
                  <p className="text-lg text-gray-700 leading-relaxed italic mb-4">
                    "{phrase1IsAcknowledging ? current.phrase1.text : current.phrase2.text}"
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium">
                      {phrase1IsAcknowledging ? current.phrase1.explanation : current.phrase2.explanation}
                    </p>
                  </div>
                </div>

                {/* Show why it matters */}
                <div className="bg-white/80 rounded-xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    Why this matters:
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {current.whyItMatters}
                  </p>
                </div>
              </div>

              {/* Compare with the other response */}
              {selected && !selected.isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  delay={0.3}
                  className="bg-red-50 border-2 border-red-200 rounded-xl p-6"
                >
                  <h4 className="font-bold text-red-800 mb-3 text-lg">
                    The response that advises too soon:
                  </h4>
                  <p className="text-lg text-red-700 leading-relaxed italic mb-4">
                    "{!phrase1IsAcknowledging ? current.phrase1.text : current.phrase2.text}"
                  </p>
                  <p className="text-sm text-red-700">
                    {!phrase1IsAcknowledging ? current.phrase1.explanation : current.phrase2.explanation}
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
                  <strong>💡 Parent Tip:</strong> Start replies with empathy: "I can see you're upset…" before problem-solving. 
                  When you acknowledge feelings first, children feel heard and understood. This emotional validation creates safety, making them more open to your guidance and solutions afterward.
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

export default FeelingsFirst;

