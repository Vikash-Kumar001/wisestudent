import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const WalkInTheirShoes = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-21";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [showOutcome, setShowOutcome] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Scenarios from a child's perspective with empathetic vs judgmental responses
  const scenarios = [
    {
      id: 1,
      title: "Missed Homework",
      childPerspective: "You forgot to do your math homework last night. Your teacher asked for it this morning, and you don't have it. You feel your stomach drop and your face get hot. Everyone is looking at you.",
      childFeeling: "Fear, shame, anxiety",
      empatheticResponse: {
        title: "Empathetic Response",
        description: "You take a deep breath and say: 'I see you're worried about this. Forgetting happens. Let's talk about what we can do to make sure this doesn't happen again. Would it help if we set a reminder together?'",
        result: "Your child feels understood and supported. They open up about feeling overwhelmed. Together, you create a system that works. Your child learns responsibility through connection, not fear.",
        emoji: "🤝",
        color: "from-blue-400 to-indigo-500",
        bgColor: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-300",
        emotionalOutcome: "Child feels: Supported, understood, capable"
      },
      judgmentalResponse: {
        title: "Judgmental Response",
        description: "You say with frustration: 'Again? You always forget your homework! When are you going to learn to be responsible? You're going to fail if you keep this up.'",
        result: "Your child feels ashamed and defensive. They shut down and avoid talking to you. The homework problem continues, but now your child also feels like they're a failure. Trust is damaged.",
        emoji: "😢",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400",
        emotionalOutcome: "Child feels: Ashamed, defensive, like a failure"
      },
      correctChoice: "empathetic",
      explanation: "When you pause to understand your child's perspective, you respond to their emotional need, not just the behavior. This builds connection and teaches problem-solving through collaboration."
    },
    {
      id: 2,
      title: "Social Rejection",
      childPerspective: "At school, your friends didn't save you a seat at lunch. They laughed at something and you didn't get the joke. You felt left out and awkward. You pretended to be busy on your phone, but you were really just trying not to cry.",
      childFeeling: "Loneliness, embarrassment, hurt",
      empatheticResponse: {
        title: "Empathetic Response",
        description: "You notice their mood and sit with them quietly. You say: 'You seem sad today. Want to talk about what happened? Sometimes friendships can feel complicated, and that's really hard.'",
        result: "Your child feels seen and safe. They share what happened and you listen. Together, you discuss how friendships can be complicated. Your child feels less alone and more confident to handle social situations.",
        emoji: "💙",
        color: "from-blue-400 to-indigo-500",
        bgColor: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-300",
        emotionalOutcome: "Child feels: Seen, safe, less alone"
      },
      judgmentalResponse: {
        title: "Judgmental Response",
        description: "You dismiss their feelings: 'Stop being so sensitive. Friendships aren't that big of a deal. You're making a mountain out of a molehill. Just find other friends if these ones don't want you.'",
        result: "Your child feels dismissed and even more alone. They learn that their feelings aren't valid. They stop sharing difficult experiences with you. The social pain continues, but now they're navigating it completely alone.",
        emoji: "😞",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400",
        emotionalOutcome: "Child feels: Dismissed, invalidated, alone"
      },
      correctChoice: "empathetic",
      explanation: "A child's social world is their whole world. When you validate their feelings, you give them emotional tools to navigate relationships. Dismissing their pain teaches them to hide their feelings, not heal them."
    },
    {
      id: 3,
      title: "Fear of Scolding",
      childPerspective: "You accidentally broke mom's favorite coffee mug. It was an accident—you were reaching for a snack and it fell. You hid the pieces because you're scared she'll be really angry. You're worried she'll be disappointed in you.",
      childFeeling: "Fear, guilt, anxiety about disappointing parent",
      empatheticResponse: {
        title: "Empathetic Response",
        description: "You notice something's wrong and approach gently: 'I see you seem worried. Is everything okay? I'm here to listen, not judge. Even if something broke, we can work it out together.'",
        result: "Your child feels safe enough to tell the truth. You validate that accidents happen. Together, you clean up and maybe even pick out a new mug together. Your child learns that mistakes are manageable and that your relationship is stronger than any object.",
        emoji: "🛡️",
        color: "from-blue-400 to-indigo-500",
        bgColor: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-300",
        emotionalOutcome: "Child feels: Safe, understood, loved unconditionally"
      },
      judgmentalResponse: {
        title: "Judgmental Response",
        description: "You discover the broken mug and react angrily: 'Why can't you be more careful? That was my favorite! You're so clumsy. You break everything. Now I can't have my coffee the way I like it because of you.'",
        result: "Your child feels like they're a burden and that things matter more than they do. They learn to hide mistakes and avoid telling you when things go wrong. Trust is broken, and your child feels like they're constantly walking on eggshells.",
        emoji: "😰",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400",
        emotionalOutcome: "Child feels: Like a burden, afraid, untrustworthy"
      },
      correctChoice: "empathetic",
      explanation: "When a child fears scolding, they're telling you that connection matters more than perfection. Responding with empathy teaches them that your relationship is more valuable than any object, and that mistakes are opportunities for connection, not punishment."
    },
    {
      id: 4,
      title: "Overwhelmed by Schoolwork",
      childPerspective: "You have three tests this week, a science project due, and you're supposed to practice piano. Every time you try to start one thing, you remember something else you have to do. Your brain feels fuzzy and you just want to hide under the covers.",
      childFeeling: "Overwhelmed, anxious, exhausted",
      empatheticResponse: {
        title: "Empathetic Response",
        description: "You notice their stress and sit down with them: 'I can see you're feeling overwhelmed. That's a lot to handle at once. Let's break this down together. What feels most important right now? I'm here to help you figure this out.'",
        result: "Your child feels supported and less alone. You help them prioritize and create a plan. They learn organizational skills through collaboration. The workload feels manageable because they don't have to carry it alone. Your child feels capable again.",
        emoji: "✨",
        color: "from-blue-400 to-indigo-500",
        bgColor: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-300",
        emotionalOutcome: "Child feels: Supported, capable, less overwhelmed"
      },
      judgmentalResponse: {
        title: "Judgmental Response",
        description: "You respond with pressure: 'Stop complaining and just get it done. Everyone has responsibilities. You should have planned better. Procrastination is a choice. Stop making excuses and start working.'",
        result: "Your child feels more overwhelmed and incompetent. They shut down or work frantically without a plan. The anxiety increases. They learn that asking for help is weakness, and that struggling means they're failing. Mental health suffers.",
        emoji: "😓",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400",
        emotionalOutcome: "Child feels: More overwhelmed, incompetent, alone"
      },
      correctChoice: "empathetic",
      explanation: "When a child is overwhelmed, they need support, not pressure. Empathy helps them feel capable again. Judgmental responses increase anxiety and teach them that struggling is shameful. Collaboration builds resilience."
    },
    {
      id: 5,
      title: "Feeling Invisible",
      childPerspective: "You tried to tell your parent about your day, but they were on their phone. You started talking about your art project, but they said 'uh-huh' without looking up. You stopped talking and just sat there. They didn't even notice you stopped.",
      childFeeling: "Invisible, unimportant, rejected",
      empatheticResponse: {
        title: "Empathetic Response",
        description: "You notice they stopped talking and put your phone down: 'I'm sorry, I wasn't fully listening. You're important to me, and I want to hear about your art project. Can you tell me again? I'm all ears.'",
        result: "Your child feels valued and important. They share their story with enthusiasm. Your attention tells them they matter. Your relationship deepens. Your child learns that their voice matters and that you care about their world.",
        emoji: "💝",
        color: "from-blue-400 to-indigo-500",
        bgColor: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-300",
        emotionalOutcome: "Child feels: Valued, important, heard"
      },
      judgmentalResponse: {
        title: "Judgmental Response",
        description: "You stay on your phone and say: 'I'm busy right now. Can't this wait? You know I have a lot to do. You're always interrupting me when I'm trying to get things done.'",
        result: "Your child learns that they're less important than a phone or work. They stop trying to connect with you. They find connection elsewhere or withdraw. Your relationship becomes distant. Years later, you wonder why they don't tell you anything.",
        emoji: "👻",
        color: "from-red-500 to-rose-600",
        bgColor: "from-red-50 to-rose-50",
        borderColor: "border-red-400",
        emotionalOutcome: "Child feels: Unimportant, rejected, disconnected"
      },
      correctChoice: "empathetic",
      explanation: "Every interaction tells your child whether they matter. When you prioritize presence over productivity, you teach them that relationships are more valuable than tasks. Your attention is the greatest gift you can give."
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
  const outcome = selected ? (selected.choice === 'empathetic' ? current.empatheticResponse : current.judgmentalResponse) : null;

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
            {/* Child's perspective card */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-purple-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {current.title}
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <p className="text-lg text-purple-700 font-semibold mb-3">
                    From Your Child's Perspective:
                  </p>
                  <p className="text-xl text-gray-700 leading-relaxed italic">
                    "{current.childPerspective}"
                  </p>
                </div>
                <div className="bg-purple-100 rounded-lg p-4 inline-block">
                  <p className="text-sm text-purple-800 font-medium">
                    💭 What they might be feeling: <span className="font-semibold">{current.childFeeling}</span>
                  </p>
                </div>
              </div>

              {/* Question */}
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                  What might they be feeling right now?
                </p>
                <p className="text-sm text-gray-600">
                  Choose your response to this situation
                </p>
              </div>
            </div>

            {/* Choice buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Empathetic option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice('empathetic')}
                disabled={!!selected}
                className={`
                  relative p-8 rounded-2xl border-2 transition-all text-left
                  ${selected
                    ? selected.choice === 'empathetic'
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400 shadow-lg'
                      : 'bg-gray-50 border-gray-300 opacity-50'
                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 hover:shadow-xl cursor-pointer'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">💙</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Empathetic Response
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Understand their perspective and respond with compassion
                    </p>
                  </div>
                </div>
                {selected && selected.choice === 'empathetic' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 text-3xl"
                  >
                    {selected.isCorrect ? '✓' : '×'}
                  </motion.div>
                )}
              </motion.button>

              {/* Judgmental option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice('judgmental')}
                disabled={!!selected}
                className={`
                  relative p-8 rounded-2xl border-2 transition-all text-left
                  ${selected
                    ? selected.choice === 'judgmental'
                      ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                      : 'bg-gray-50 border-gray-300 opacity-50'
                    : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 hover:shadow-xl cursor-pointer'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">😠</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Judgmental Response
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Focus on the behavior and react with criticism or blame
                    </p>
                  </div>
                </div>
                {selected && selected.choice === 'judgmental' && (
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

                <div className="bg-white/80 rounded-xl p-6 shadow-lg mb-4">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    Emotional Outcome:
                  </h4>
                  <p className="text-gray-700 leading-relaxed font-semibold mb-4">
                    {outcome.emotionalOutcome}
                  </p>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    What Happened:
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
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <p className={`font-semibold ${
                    selected.isCorrect ? 'text-blue-800' : 'text-orange-800'
                  }`}>
                    {selected.isCorrect ? '✓ Great understanding! ' : '💡 Learning moment: '}
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
                  <strong>💡 Parent Tip:</strong> Pause and ask, "What might they be feeling right now?" before reacting. 
                  When you step into your child's shoes, you respond to their emotional need, not just the behavior. This builds connection and teaches them that their feelings matter.
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

export default WalkInTheirShoes;

