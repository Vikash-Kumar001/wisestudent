import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Pause, Play, Wind, Clock, Sparkles, AlertCircle, CheckCircle } from "lucide-react";

const PowerOfPause = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-41";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [phase, setPhase] = useState('scenario'); // scenario, paused, outcome, reflection
  const [isPausing, setIsPausing] = useState(false);
  const [pauseComplete, setPauseComplete] = useState(false);
  const [breathPhase, setBreathPhase] = useState('idle'); // idle, inhale, exhale
  const [breathTime, setBreathTime] = useState(0);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const timerRef = useRef(null);
  const breathTimerRef = useRef(null);

  // Scenarios with pause practice
  const scenarios = [
    {
      id: 1,
      title: "The Messy Room",
      situation: "You walk into your child's room after asking them to clean it hours ago. Clothes are everywhere, toys scattered, bed unmade. Your first instinct is to raise your voice.",
      reactiveResponse: "Without pausing, you immediately say: 'This is unacceptable! Clean this up right now or you're grounded!'",
      pausedResponse: "You take a deep breath, count to 5, then say: 'I see the room is still messy. It looks overwhelming. How can I help you get started?'",
      reactiveOutcome: {
        title: "Reactive Outcome",
        description: "Your child feels defensive and shamed. They clean up resentfully, avoiding you. The room gets messy again the next day because there's no real learning or connection.",
        feeling: "Tense, disconnected, resentful",
        emoji: "😠",
        color: "from-red-500 to-rose-600"
      },
      pausedOutcome: {
        title: "Paused Outcome",
        description: "Your child feels heard and supported. They open up about feeling overwhelmed by the mess. Together, you create a cleaning plan. The room stays cleaner because your child learned organization, not just compliance.",
        feeling: "Calm, connected, cooperative",
        emoji: "✨",
        color: "from-green-500 to-emerald-600"
      },
      reflection: {
        question: "What changed when you paused?",
        options: [
          {
            id: 'control',
            text: "Pausing gave you control over your reaction, allowing a thoughtful response instead of an emotional outburst.",
            isCorrect: true
          },
          {
            id: 'time',
            text: "Nothing really changed—the outcome would have been the same either way.",
            isCorrect: false
          },
          {
            id: 'avoid',
            text: "Pausing helped you avoid the situation entirely.",
            isCorrect: false
          }
        ],
        insight: "The pause button—your deep breath—is your power to choose response over reaction. In that 5 seconds, you transform from reactive parent to responsive parent."
      },
      parentTip: "Use a deep breath as your 'pause button' before any heated reply. That single breath gives you the space to respond with wisdom instead of reacting with emotion."
    },
    {
      id: 2,
      title: "The Broken Item",
      situation: "Your child accidentally breaks something valuable to you—a family heirloom or something important. You feel anger rising immediately.",
      reactiveResponse: "Instantly, you react: 'Why can't you be more careful? Look what you did! You never think before you act!'",
      pausedResponse: "You breathe deeply, pause, then respond: 'I can see this was an accident. I'm feeling upset because this was important to me. Let's talk about what happened.'",
      reactiveOutcome: {
        title: "Reactive Outcome",
        description: "Your child feels terrible, ashamed, and afraid. They hide their mistakes from you in the future. Your relationship becomes one where mistakes are punished, not learning opportunities.",
        feeling: "Ashamed, afraid, disconnected",
        emoji: "😢",
        color: "from-red-500 to-rose-600"
      },
      pausedOutcome: {
        title: "Paused Outcome",
        description: "Your child feels safe to acknowledge the mistake. They learn responsibility and empathy. They understand that accidents happen, and what matters is how we handle them. Trust and connection remain strong.",
        feeling: "Responsible, understood, safe",
        emoji: "🤝",
        color: "from-green-500 to-emerald-600"
      },
      reflection: {
        question: "How did pausing change the energy?",
        options: [
          {
            id: 'energy',
            text: "Pausing shifted the energy from punishment to learning, from shame to responsibility, from fear to safety.",
            isCorrect: true
          },
          {
            id: 'delay',
            text: "Pausing just delayed the same negative outcome.",
            isCorrect: false
          },
          {
            id: 'ignore',
            text: "Pausing made the problem go away without addressing it.",
            isCorrect: false
          }
        ],
        insight: "Your pause transforms the moment. Instead of teaching 'mistakes are bad,' you teach 'mistakes are learning opportunities.' Instead of fear, you create safety. Instead of shame, you create growth."
      },
      parentTip: "When something breaks or goes wrong, breathe first. That pause button gives you access to your wisest self—the parent who responds with love even when feeling upset."
    },
    {
      id: 3,
      title: "The Sibling Fight",
      situation: "You hear shouting and crying from the other room. Your two children are fighting again. Your stress level spikes, and you want to storm in and stop it immediately.",
      reactiveResponse: "You rush in and yell: 'Both of you, stop fighting right now! Go to your rooms and think about how you're behaving!'",
      pausedResponse: "You take a breath at the doorway, then calmly enter: 'I hear some big feelings happening. Let's all take a breath. Can each of you tell me what's going on?'",
      reactiveOutcome: {
        title: "Reactive Outcome",
        description: "The fighting stops temporarily, but both children feel unheard. The conflict continues later because the underlying issue wasn't addressed. You feel like a referee, not a parent.",
        feeling: "Frustrated, like a referee, disconnected",
        emoji: "⚔️",
        color: "from-red-500 to-rose-600"
      },
      pausedOutcome: {
        title: "Paused Outcome",
        description: "Both children feel heard. You help them problem-solve together. They learn conflict resolution skills. The fighting decreases over time because they learn to communicate instead of escalate.",
        feeling: "Calm, connected, empowered",
        emoji: "☮️",
        color: "from-green-500 to-emerald-600"
      },
      reflection: {
        question: "What did the pause enable?",
        options: [
          {
            id: 'space',
            text: "The pause created space for understanding, problem-solving, and teaching conflict resolution instead of just stopping the fight.",
            isCorrect: true
          },
          {
            id: 'allow',
            text: "The pause allowed the fight to continue longer.",
            isCorrect: false
          },
          {
            id: 'ignore',
            text: "The pause meant you didn't need to intervene at all.",
            isCorrect: false
          }
        ],
        insight: "Your pause in conflict doesn't mean you're passive—it means you're powerful. You stop the reactive cycle and create space for teaching, understanding, and resolution."
      },
      parentTip: "In conflict moments, your pause button is your superpower. One breath, then respond with calm. Your calm becomes their calm. Your pause teaches them how to pause too."
    },
    {
      id: 4,
      title: "The Defiant 'No'",
      situation: "You ask your child to do something simple, and they respond with a defiant 'No!' in front of others. You feel embarrassed and want to assert authority immediately.",
      reactiveResponse: "You react immediately: 'You don't say no to me! You WILL do it, or there will be consequences!'",
      pausedResponse: "You breathe, pause, then say: 'I hear you're saying no. Can you help me understand why? We can talk about this after we're done here.'",
      reactiveOutcome: {
        title: "Reactive Outcome",
        description: "A power struggle begins. Your child digs in their heels. You both feel frustrated and disconnected. The situation escalates, and everyone watching feels uncomfortable.",
        feeling: "Embarrassed, frustrated, in a power struggle",
        emoji: "😤",
        color: "from-red-500 to-rose-600"
      },
      pausedOutcome: {
        title: "Paused Outcome",
        description: "You maintain your calm and authority without creating a power struggle. Your child feels respected even while respecting your boundary. You address the underlying issue later, strengthening connection.",
        feeling: "Respected, calm, in control",
        emoji: "👑",
        color: "from-green-500 to-emerald-600"
      },
      reflection: {
        question: "How does pausing help with defiance?",
        options: [
          {
            id: 'avoid',
            text: "Pausing helps you avoid power struggles by responding thoughtfully instead of reacting defensively, maintaining authority through calm.",
            isCorrect: true
          },
          {
            id: 'weak',
            text: "Pausing makes you look weak and loses your authority.",
            isCorrect: false
          },
          {
            id: 'ignore',
            text: "Pausing means you let your child get away with defiance.",
            isCorrect: false
          }
        ],
        insight: "True authority comes from calm, not control. Your pause shows strength, not weakness. You maintain your boundaries while preserving connection. That's real power."
      },
      parentTip: "When you feel embarrassed or challenged, that's when your pause button matters most. Breathe. Pause. Then respond with calm authority. Your calm is more powerful than any reaction."
    },
    {
      id: 5,
      title: "The Overwhelming Moment",
      situation: "Everything is happening at once: dinner is burning, the phone is ringing, your child is asking for help, and you're already late. You feel completely overwhelmed and want to snap.",
      reactiveResponse: "You react with frustration: 'Can't you see I'm busy? Leave me alone! Everything is chaos because of you!'",
      pausedResponse: "You stop, breathe deeply, then say: 'I'm feeling overwhelmed right now. Give me one minute to breathe, then I'll help you. We'll figure this out together.'",
      reactiveOutcome: {
        title: "Reactive Outcome",
        description: "Everyone feels worse. Your child feels blamed and hurt. The chaos continues because you're adding emotional chaos to the situation. You end up feeling guilty on top of overwhelmed.",
        feeling: "Overwhelmed, guilty, disconnected",
        emoji: "💥",
        color: "from-red-500 to-rose-600"
      },
      pausedOutcome: {
        title: "Paused Outcome",
        description: "You model self-regulation for your child. You show them that overwhelmed feelings are manageable. Together, you prioritize and solve problems. Your child learns resilience and emotional regulation from watching you.",
        feeling: "Calm, capable, connected",
        emoji: "🌟",
        color: "from-green-500 to-emerald-600"
      },
      reflection: {
        question: "What does your pause teach?",
        options: [
          {
            id: 'model',
            text: "Your pause models self-regulation, showing your child that overwhelming moments can be managed with a breath and a pause.",
            isCorrect: true
          },
          {
            id: 'hide',
            text: "Your pause teaches your child to hide their feelings when overwhelmed.",
            isCorrect: false
          },
          {
            id: 'avoid',
            text: "Your pause teaches your child to avoid stressful situations.",
            isCorrect: false
          }
        ],
        insight: "Your pause in overwhelming moments is teaching. You're showing your child how to handle stress, how to regulate emotions, how to find calm in chaos. You're modeling the skills they'll need for life."
      },
      parentTip: "In overwhelming moments, your pause button is your anchor. One deep breath. Then respond. You're not just managing the moment—you're teaching your child how to handle overwhelm for life."
    }
  ];

  const currentScenarioData = scenarios[currentScenario];

  // Play audio prompt for pause
  const playPausePrompt = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Pause. Take a deep breath.");
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle pause button click
  const handlePauseClick = () => {
    setIsPausing(true);
    setBreathPhase('inhale');
    setBreathTime(4);
    setPhase('paused');
    playPausePrompt();
  };

  // Handle breathing cycle during pause
  useEffect(() => {
    if (!isPausing || breathPhase === 'idle') return;

    if (breathTime > 0) {
      breathTimerRef.current = setTimeout(() => {
        setBreathTime(breathTime - 1);
      }, 1000);
    } else {
      if (breathPhase === 'inhale') {
        setBreathPhase('exhale');
        setBreathTime(6);
      } else if (breathPhase === 'exhale') {
        setBreathPhase('idle');
        setIsPausing(false);
        setPauseComplete(true);
        setTimeout(() => {
          setPhase('outcome');
        }, 500);
      }
    }

    return () => {
      if (breathTimerRef.current) {
        clearTimeout(breathTimerRef.current);
      }
    };
  }, [isPausing, breathPhase, breathTime]);

  // Handle reflection selection
  const handleReflectionSelect = (reflectionId) => {
    setSelectedReflection(reflectionId);
    const reflection = currentScenarioData.reflection.options.find(r => r.id === reflectionId);
    if (reflection?.isCorrect) {
      setScore(prev => prev + 1);
    }
    setTimeout(() => {
      setPhase('reflection');
    }, 1000);
  };

  // Handle next scenario
  const handleNext = () => {
    setPhase('scenario');
    setIsPausing(false);
    setPauseComplete(false);
    setBreathPhase('idle');
    setBreathTime(0);
    setSelectedReflection(null);
    
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setShowGameOver(true);
    }
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "The Power of Pause"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= totalLevels * 0.8}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">⏸️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Power of Pause Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've learned to use your pause button—your deep breath—to transform reactive moments into responsive ones. Remember: one breath can change everything.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Use a deep breath as your "pause button" before any heated reply. That single breath gives you the space to respond with wisdom instead of reacting with emotion. Practice this daily—your pause becomes automatic, and your parenting transforms.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "The Power of Pause"}
      subtitle={`Scenario ${currentScenario + 1} of ${totalLevels}: ${currentScenarioData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentScenario + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          key={currentScenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {phase === 'scenario' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentScenarioData.title}</h3>
                <div className="bg-white rounded-lg p-5 mb-4">
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">{currentScenarioData.situation}</p>
                  <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                    <p className="text-sm text-red-800 font-medium">
                      <strong>Without Pause:</strong> {currentScenarioData.reactiveResponse}
                    </p>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-800 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span><strong>Notice:</strong> Your body wants to react immediately. But you have a choice: react or pause.</span>
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePauseClick}
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <Pause className="w-6 h-6" />
                  Tap to Pause
                </motion.button>
              </div>
            </div>
          )}

          {phase === 'paused' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-300 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">You Paused</h3>
                <div className="flex flex-col items-center justify-center mb-6">
                  <motion.div
                    animate={{
                      scale: breathPhase === 'inhale' ? [1, 1.3, 1] : breathPhase === 'exhale' ? [1.3, 1, 1] : 1,
                    }}
                    transition={{
                      duration: breathPhase === 'inhale' ? 4 : breathPhase === 'exhale' ? 6 : 0,
                      repeat: breathPhase !== 'idle' ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg flex items-center justify-center mb-4"
                  >
                    <Wind className="w-16 h-16 text-white" />
                  </motion.div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    {breathPhase === 'inhale' ? 'Breathe In...' : breathPhase === 'exhale' ? 'Breathe Out...' : 'Complete'}
                  </p>
                  {breathTime > 0 && (
                    <div className="text-4xl font-bold text-blue-600">{breathTime}</div>
                  )}
                </div>
                <p className="text-gray-600">Take this moment. Your pause is your power.</p>
              </div>
            </motion.div>
          )}

          {phase === 'outcome' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  After Your Pause
                </h3>
                <div className="bg-white rounded-lg p-5 mb-4">
                  <p className="text-lg text-gray-700 mb-4 font-medium">
                    {currentScenarioData.pausedResponse}
                  </p>
                </div>
                <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-800 mb-2">{currentScenarioData.pausedOutcome.title}</h4>
                  <p className="text-sm text-green-900 mb-2">{currentScenarioData.pausedOutcome.description}</p>
                  <p className="text-xs text-green-700">
                    <strong>Feeling:</strong> {currentScenarioData.pausedOutcome.feeling}
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                <p className="text-sm text-gray-700 text-center">
                  Compare this to the reactive outcome above. Notice how pausing changed everything.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPhase('reflection')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Reflect on What Changed
              </motion.button>
            </motion.div>
          )}

          {phase === 'reflection' && !selectedReflection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{currentScenarioData.reflection.question}</h3>
                <div className="space-y-3">
                  {currentScenarioData.reflection.options.map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReflectionSelect(option.id)}
                      className="w-full text-left p-4 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:border-indigo-400 hover:shadow-md transition-all"
                    >
                      <p className="font-medium">{option.text}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'reflection' && selectedReflection && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-green-600" />
                  Insight
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">{currentScenarioData.reflection.insight}</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>💡 Parent Tip:</strong> {currentScenarioData.parentTip}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Complete Practice'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default PowerOfPause;

