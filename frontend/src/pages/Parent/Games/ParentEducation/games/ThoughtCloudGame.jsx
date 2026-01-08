import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Cloud, CheckCircle, XCircle, Sparkles, Eye } from "lucide-react";

const ThoughtCloudGame = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-46";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentSession, setCurrentSession] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thoughts, setThoughts] = useState([]);
  const [labeledThoughts, setLabeledThoughts] = useState([]);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [selectedThought, setSelectedThought] = useState(null);

  const thoughtIdRef = useRef(0);
  const spawnIntervalRef = useRef(null);

  // Thought scenarios with different types of thoughts
  const sessions = [
    {
      id: 1,
      title: "Morning Thoughts",
      description: "Observe your morning thoughts as they float by. Label each as 'Useful' or 'Let Go' without getting lost in them.",
      context: "Your mind is active with thoughts about the day ahead. Notice them like clouds—watch, don't chase.",
      thoughtPool: [
        "I have so much to do today",
        "I hope my child has a good day at school",
        "I'm already behind schedule",
        "Today will be better than yesterday",
        "I forgot to prepare lunch",
        "I'm grateful for this moment",
        "Everything feels overwhelming",
        "I can handle what comes my way",
        "I'm worried about the meeting",
        "Each moment is a fresh start"
      ],
      parentTip: "Notice thoughts like clouds—watch, don't chase. When you observe thoughts without getting lost in them, you teach your child the same skill. They'll learn to notice their thoughts without being controlled by them."
    },
    {
      id: 2,
      title: "Parenting Thoughts",
      description: "Watch thoughts about parenting float by. Observe them mindfully and decide which serve you.",
      context: "Thoughts about your child, your parenting, your worries. See them as passing clouds.",
      thoughtPool: [
        "Am I doing enough for my child?",
        "My child is capable and growing",
        "I made a mistake yesterday",
        "I'm learning and improving every day",
        "Other parents seem to have it together",
        "Every parent has their own journey",
        "I'm worried about my child's future",
        "I can only control this moment",
        "I'm not good enough",
        "I'm doing my best with what I have"
      ],
      parentTip: "When you observe thoughts without getting lost in them, you model emotional regulation for your child. They see you notice thoughts, label them, and let them go. This becomes their blueprint."
    },
    {
      id: 3,
      title: "Work-Life Balance Thoughts",
      description: "Observe thoughts about work and life balance. Watch them float by without getting caught.",
      context: "Thoughts about work, family balance, responsibilities. Notice them, label them, let them pass.",
      thoughtPool: [
        "I need to finish this project",
        "Family time is important too",
        "I'm spread too thin",
        "I can prioritize and manage",
        "Work is taking over my life",
        "I'm learning to set boundaries",
        "I'm missing important moments",
        "I'm present when I'm present",
        "Nothing is ever enough",
        "Each day is a chance to balance"
      ],
      parentTip: "Thoughts come and go. When you practice observing them like clouds—noticing but not chasing—you create space between stimulus and response. That space is where wise parenting happens."
    },
    {
      id: 4,
      title: "Stress Thoughts",
      description: "Watch stressful thoughts float by. Observe them without getting lost in their stories.",
      context: "Anxious, worried, or stressful thoughts. See them as temporary clouds passing through the sky.",
      thoughtPool: [
        "What if something goes wrong?",
        "I can handle challenges as they come",
        "Everything feels out of control",
        "I can control my response",
        "I'm not prepared for this",
        "I have tools and resources",
        "This will never get better",
        "Things change and evolve",
        "I can't cope with this stress",
        "I've handled difficult things before"
      ],
      parentTip: "The practice of observing thoughts like clouds teaches your child emotional regulation. They learn that thoughts are temporary, and they don't have to be controlled by every thought that appears."
    },
    {
      id: 5,
      title: "Gratitude Thoughts",
      description: "Notice thoughts of both worry and gratitude. Observe them all with equal attention.",
      context: "A mix of thoughts—some useful, some to let go. Practice observing them all without judgment.",
      thoughtPool: [
        "I'm grateful for my family",
        "I wish things were different",
        "Today has been challenging",
        "I'm learning from every experience",
        "I'm blessed to be a parent",
        "I'm not good at this",
        "I'm growing every day",
        "I compare myself to others",
        "My journey is unique",
        "I'm thankful for this moment"
      ],
      parentTip: "When you practice observing thoughts without attachment, you teach your child resilience. They learn that thoughts don't define them—they're temporary clouds in the sky of awareness. Watch, don't chase."
    }
  ];

  const currentSessionData = sessions[currentSession];

  // Spawn a new thought cloud
  const spawnThought = () => {
    if (thoughts.length >= 10) return; // Max 10 thoughts at once
    
    const availableThoughts = currentSessionData.thoughtPool.filter(
      t => !thoughts.some(th => th.text === t) && !labeledThoughts.some(lt => lt.text === t)
    );
    
    if (availableThoughts.length === 0) {
      // All thoughts used, restart pool for this session
      if (thoughts.length === 0 && labeledThoughts.length >= 5) {
        // Ready for next session
        return;
      }
      return;
    }

    const randomThought = availableThoughts[Math.floor(Math.random() * availableThoughts.length)];
    const newThought = {
      id: thoughtIdRef.current++,
      text: randomThought,
      x: Math.random() * 80 + 10, // Random horizontal position (10-90%)
      y: 100, // Start from bottom
      speed: 0.3 + Math.random() * 0.4, // Random speed
      opacity: 1
    };

    setThoughts(prev => [...prev, newThought]);
  };

  // Start the session
  const startSession = () => {
    setIsPlaying(true);
    setThoughts([]);
    setLabeledThoughts([]);
    setSelectedThought(null);
    thoughtIdRef.current = 0;
    
    // Spawn first thought
    spawnThought();
    
    // Spawn thoughts every 2-4 seconds
    spawnIntervalRef.current = setInterval(() => {
      spawnThought();
    }, 2500);
  };

  // Update thought positions (floating animation)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setThoughts(prev => 
        prev.map(thought => ({
          ...thought,
          y: thought.y - thought.speed,
          opacity: thought.y < 20 ? 0 : 1 // Fade out at top
        })).filter(thought => thought.y > -10 && thought.opacity > 0) // Remove off-screen thoughts
      );
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle thought click - show label options
  const handleThoughtClick = (thought) => {
    setSelectedThought(thought);
  };

  // Label a thought
  const handleLabelThought = (label) => {
    if (!selectedThought) return;

    const labeled = {
      ...selectedThought,
      label: label, // 'useful' or 'letgo'
      labeledAt: Date.now()
    };

    setLabeledThoughts(prev => [...prev, labeled]);
    setThoughts(prev => prev.filter(t => t.id !== selectedThought.id));
    setSelectedThought(null);
    setScore(prev => prev + 1);

    // Check if session is complete (at least 5 thoughts labeled)
    if (labeledThoughts.length >= 4) {
      setTimeout(() => {
        setIsPlaying(false);
        if (spawnIntervalRef.current) {
          clearInterval(spawnIntervalRef.current);
        }
      }, 1000);
    }
  };

  // Handle next session
  const handleNext = () => {
    if (currentSession < sessions.length - 1) {
      setCurrentSession(prev => prev + 1);
      setIsPlaying(false);
      setThoughts([]);
      setLabeledThoughts([]);
      setSelectedThought(null);
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    } else {
      setShowGameOver(true);
    }
  };

  const progress = ((currentSession + 1) / totalLevels) * 100;
  const sessionComplete = labeledThoughts.length >= 5;

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Thought Cloud Game"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= totalLevels * 4}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">☁️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Thought Cloud Practice Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've learned to observe thoughts without getting lost in them. Remember: notice thoughts like clouds—watch, don't chase.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Notice thoughts like clouds—watch, don't chase. When you observe thoughts without getting lost in them, you teach your child the same skill. They'll learn to notice their thoughts without being controlled by them. The practice of observing thoughts like clouds teaches emotional regulation—a gift you give your child through your own practice.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Thought Cloud Game"}
      subtitle={`Session ${currentSession + 1} of ${totalLevels}: ${currentSessionData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentSession + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          key={currentSession}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Session {currentSession + 1} of {totalLevels}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Session context */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{currentSessionData.title}</h3>
            <p className="text-gray-700 mb-2">{currentSessionData.description}</p>
            <p className="text-sm text-gray-600 italic mb-3">{currentSessionData.context}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> {currentSessionData.parentTip}
              </p>
            </div>
          </div>

          {!isPlaying && !sessionComplete && (
            /* Start screen */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Observe Your Thoughts</h3>
                <p className="text-gray-700 mb-6">
                  Watch thoughts float by like clouds in the sky. Tap on each thought cloud to label it as "Useful" or "Let Go." Observe without getting lost in them.
                </p>
                <div className="flex items-center justify-center gap-6 mb-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span>Observe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5" />
                    <span>Watch thoughts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Label & let go</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startSession}
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mx-auto"
                >
                  <Cloud className="w-6 h-6" />
                  Start Observing Thoughts
                </motion.button>
              </div>
            </div>
          )}

          {isPlaying && (
            /* Thought cloud animation area */
            <div className="relative bg-gradient-to-b from-blue-100 via-sky-50 to-white rounded-xl h-96 border-2 border-blue-200 overflow-hidden mb-6">
              <p className="absolute top-4 left-4 text-sm text-gray-600 flex items-center gap-2 z-10">
                <Eye className="w-4 h-4" />
                <span>Labeled: {labeledThoughts.length} / 5 thoughts</span>
              </p>

              <AnimatePresence>
                {thoughts.map((thought) => (
                  <motion.div
                    key={thought.id}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ 
                      y: thought.y,
                      opacity: thought.opacity,
                      x: [thought.x, thought.x + Math.sin(thought.id) * 10] // Gentle sway
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.1,
                      x: {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }
                    }}
                    onClick={() => handleThoughtClick(thought)}
                    className={`absolute cursor-pointer ${
                      selectedThought?.id === thought.id
                        ? 'ring-4 ring-indigo-400 ring-offset-2'
                        : 'hover:scale-110'
                    }`}
                    style={{
                      left: `${thought.x}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border-2 border-gray-200 min-w-[120px] text-center"
                    >
                      <Cloud className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
                        {thought.text}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Label selection modal for selected thought */}
              {selectedThought && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
                  onClick={() => setSelectedThought(null)}
                >
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-xl p-6 shadow-2xl border-2 border-indigo-300 max-w-md mx-4"
                  >
                    <h4 className="font-bold text-gray-800 mb-4 text-center">Label This Thought</h4>
                    <p className="text-center text-gray-600 mb-6 italic">"{selectedThought.text}"</p>
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLabelThought('useful')}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Useful
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLabelThought('letgo')}
                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Let Go
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          )}

          {/* Labeled thoughts summary */}
          {labeledThoughts.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Thoughts You've Labeled:</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {labeledThoughts.map((thought) => (
                  <motion.div
                    key={thought.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border-2 ${
                      thought.label === 'useful'
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {thought.label === 'useful' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{thought.text}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {thought.label === 'useful' ? '✓ Useful' : '✗ Let Go'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {sessionComplete && !isPlaying && (
            /* Session complete */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300 text-center"
            >
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Session Complete!</h3>
              <p className="text-gray-700 mb-6">
                You've successfully observed and labeled {labeledThoughts.length} thoughts. Great practice in mindful observation!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {currentSession < sessions.length - 1 ? 'Next Session' : 'Complete Practice'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default ThoughtCloudGame;

