import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Clock, Eye, Heart, Play, CheckCircle, ArrowRight } from "lucide-react";

const QualityOverQuantity = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-38";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentStory, setCurrentStory] = useState(null); // null, 'rushed', or 'mindful'
  const [storyWatched, setStoryWatched] = useState({ rushed: false, mindful: false });
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [showInsight, setShowInsight] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Scenarios comparing rushed vs mindful parenting
  const scenarios = [
    {
      id: 1,
      title: "After School Pickup",
      description: "Your child gets in the car after school. Watch both approaches to see the difference.",
      rushedStory: {
        title: "Rushed Parent (45 minutes)",
        duration: "45 minutes together",
        timeline: [
          { time: "3:15 PM", action: "Child gets in car. Parent on phone with work colleague." },
          { time: "3:20 PM", action: "Still on phone. Child tries to share something—parent shushes them." },
          { time: "3:30 PM", action: "Phone call ends. Parent asks 'How was school?' while checking emails on phone." },
          { time: "3:35 PM", action: "Child starts to answer, but parent interrupts with reminders about homework." },
          { time: "3:45 PM", action: "Arrive home. Child goes to room. No real connection made despite 45 minutes together." }
        ],
        childFeeling: "Unheard, invisible, unimportant",
        result: "Child feels disconnected despite spending significant time together. The quantity of time didn't create quality connection."
      },
      mindfulStory: {
        title: "Mindful Parent (5 minutes)",
        duration: "5 minutes of presence",
        timeline: [
          { time: "3:15 PM", action: "Child gets in car. Parent puts phone away and turns to face child with full attention." },
          { time: "3:16 PM", action: "Parent makes eye contact and smiles. 'I'm so glad to see you. How was your day?'" },
          { time: "3:17 PM", action: "Child starts sharing. Parent listens fully—no phone, no distractions, just presence." },
          { time: "3:19 PM", action: "Parent reflects back what child said. 'It sounds like math was challenging today.'" },
          { time: "3:20 PM", action: "Child feels heard and connected. They arrive home feeling seen and valued." }
        ],
        childFeeling: "Seen, heard, important, connected",
        result: "In just 5 minutes of full presence, child feels deeply connected. Quality of attention matters more than quantity of time."
      },
      reflections: [
        {
          id: 'quality',
          text: "Quality of presence matters more than quantity of time. Five minutes of full attention beats 45 minutes of distraction.",
          isCorrect: true
        },
        {
          id: 'quantity',
          text: "Spending more time together automatically creates better connection, even if you're distracted.",
          isCorrect: false
        },
        {
          id: 'technology',
          text: "Technology and multitasking don't affect the quality of time spent with children.",
          isCorrect: false
        }
      ],
      insight: "Emotional presence outweighs time length. When you're fully present—even for just 5 minutes—your child feels seen, heard, and valued. Distracted hours together can't replace a few minutes of genuine eye contact and attention.",
      parentTip: "A few calm minutes of eye contact can reset your child's day. Try putting your phone away for the first 5 minutes after school pickup. Those 5 minutes of presence create more connection than hours of distracted time."
    },
    {
      id: 2,
      title: "Bedtime Routine",
      description: "Compare a rushed bedtime with a mindful bedtime. See which creates better connection.",
      rushedStory: {
        title: "Rushed Bedtime (30 minutes)",
        duration: "30 minutes together",
        timeline: [
          { time: "8:00 PM", action: "Parent rushes child through bath while checking messages on phone." },
          { time: "8:10 PM", action: "Quickly puts on pajamas while thinking about tomorrow's to-do list." },
          { time: "8:15 PM", action: "Starts reading story but mind is elsewhere. Reads quickly, skips pages." },
          { time: "8:25 PM", action: "Rushes through goodnight. 'Love you, now sleep!' Leaves quickly." },
          { time: "8:30 PM", action: "Child feels rushed and unseen. Takes longer to fall asleep, feeling disconnected." }
        ],
        childFeeling: "Rushed, anxious, disconnected",
        result: "Despite 30 minutes of bedtime routine, child feels hurried and unimportant. The rushed energy creates stress, not calm."
      },
      mindfulStory: {
        title: "Mindful Bedtime (10 minutes)",
        duration: "10 minutes of presence",
        timeline: [
          { time: "8:00 PM", action: "Parent creates calm atmosphere. Phone is away. Lights dimmed." },
          { time: "8:02 PM", action: "Parent makes eye contact during pajamas. 'You're growing so fast. I love spending this time with you.'" },
          { time: "8:05 PM", action: "Reads one story with full presence. Makes voices, pauses for questions, connects with child." },
          { time: "8:08 PM", action: "Sits with child, makes eye contact. 'What's one thing you're grateful for today?'" },
          { time: "8:10 PM", action: "Hugs, eye contact, 'I love you. Sleep well.' Child feels loved and secure. Falls asleep peacefully." }
        ],
        childFeeling: "Loved, secure, calm, connected",
        result: "Ten minutes of mindful presence creates deep connection and security. Child falls asleep feeling safe and loved."
      },
      reflections: [
        {
          id: 'presence',
          text: "Being fully present during bedtime—even briefly—creates security and calm that rushed routines cannot.",
          isCorrect: true
        },
        {
          id: 'duration',
          text: "Longer bedtime routines automatically create better connection, even if rushed.",
          isCorrect: false
        },
        {
          id: 'routine',
          text: "The routine itself is what matters, not the quality of presence during it.",
          isCorrect: false
        }
      ],
      insight: "A 10-minute mindful bedtime routine with eye contact and presence is more valuable than a 30-minute rushed routine. Your calm, present energy helps your child feel safe and secure, enabling better sleep and deeper connection.",
      parentTip: "Even 5-10 minutes of fully present bedtime—no phones, eye contact, genuine connection—can reset your child's day and create lasting security. Quality over quantity."
    },
    {
      id: 3,
      title: "Dinner Time",
      description: "See how different approaches to dinner time affect family connection.",
      rushedStory: {
        title: "Rushed Dinner (60 minutes)",
        duration: "60 minutes together",
        timeline: [
          { time: "6:00 PM", action: "Everyone at table. Parent on phone, checking work emails." },
          { time: "6:10 PM", action: "Child tries to share something. Parent says 'Just a minute' without looking up." },
          { time: "6:20 PM", action: "Parent still on phone. Child gives up trying to connect." },
          { time: "6:30 PM", action: "Parent finishes emails. Asks 'How was school?' while clearing plates." },
          { time: "6:45 PM", action: "Dinner ends. Everyone disperses. No real conversation or connection happened despite an hour together." }
        ],
        childFeeling: "Ignored, unimportant, disconnected",
        result: "An hour at the table together, but no real connection was made. The phone and distractions prevented presence."
      },
      mindfulStory: {
        title: "Mindful Dinner (15 minutes)",
        duration: "15 minutes of presence",
        timeline: [
          { time: "6:00 PM", action: "Everyone at table. Phones away. Parent makes eye contact with each person." },
          { time: "6:02 PM", action: "Parent asks: 'One good thing about today?' and listens fully to each response." },
          { time: "6:05 PM", action: "Genuine conversation. Parent reflects what children share, asks follow-up questions." },
          { time: "6:10 PM", action: "Laughter and connection. Everyone feels heard and seen." },
          { time: "6:15 PM", action: "Meal ends feeling connected. Despite being shorter, the connection is deep and meaningful." }
        ],
        childFeeling: "Heard, valued, connected, happy",
        result: "Just 15 minutes of screen-free, present dinner creates more connection than an hour of distracted time. Quality matters."
      },
      reflections: [
        {
          id: 'attention',
          text: "Fifteen minutes of full attention and eye contact create more connection than an hour of distracted presence.",
          isCorrect: true
        },
        {
          id: 'time',
          text: "The more time you spend together, the better the connection, regardless of presence quality.",
          isCorrect: false
        },
        {
          id: 'technology',
          text: "Technology at the table doesn't significantly impact family connection during meals.",
          isCorrect: false
        }
      ],
      insight: "Screen-free, present mealtimes—even if brief—create deeper connection than long, distracted meals. Your full attention during those 15 minutes communicates to your child that they matter more than your phone or work.",
      parentTip: "Keep mealtime screen-free; food and laughter recharge everyone. Even 15 minutes of fully present dinner with eye contact creates more connection than hours of distracted time together."
    },
    {
      id: 4,
      title: "Weekend Morning",
      description: "Compare a distracted weekend morning with a mindful one.",
      rushedStory: {
        title: "Distracted Morning (3 hours)",
        duration: "3 hours together",
        timeline: [
          { time: "9:00 AM", action: "Parent and child in same room. Parent on laptop, working on weekend tasks." },
          { time: "9:30 AM", action: "Child shows parent a drawing. Parent says 'That's nice' without looking up from screen." },
          { time: "10:00 AM", action: "Parent still on laptop. Child asks to play. Parent says 'Later, I'm busy.'" },
          { time: "10:30 AM", action: "Child is playing alone, parent still distracted with tasks." },
          { time: "11:45 AM", action: "Three hours passed, but no real interaction or connection. Child feels alone despite parent being there." }
        ],
        childFeeling: "Lonely, invisible, unimportant",
        result: "Three hours in the same space, but the child felt alone. Physical presence without emotional presence doesn't create connection."
      },
      mindfulStory: {
        title: "Mindful Morning (20 minutes)",
        duration: "20 minutes of presence",
        timeline: [
          { time: "9:00 AM", action: "Parent puts away laptop. Turns to child. 'Good morning! Want to play something together?'" },
          { time: "9:02 AM", action: "Parent and child play a game. Parent is fully present—eye contact, laughter, connection." },
          { time: "9:10 AM", action: "Child shows drawing. Parent looks, really looks. 'Tell me about this drawing!' Listens fully." },
          { time: "9:15 AM", action: "Parent and child read a story together. Parent makes voices, child is engaged and laughing." },
          { time: "9:20 AM", action: "Twenty minutes of genuine connection. Child feels loved and valued. Parent feels connected too." }
        ],
        childFeeling: "Loved, seen, connected, joyful",
        result: "Just 20 minutes of fully present, screen-free time created deep connection and joy. Quality over quantity."
      },
      reflections: [
        {
          id: 'connection',
          text: "Twenty minutes of fully present, engaged time creates more connection than hours of distracted co-presence.",
          isCorrect: true
        },
        {
          id: 'physical',
          text: "Being physically in the same space is enough for children to feel connected, even if you're distracted.",
          isCorrect: false
        },
        {
          id: 'multitasking',
          text: "Multitasking while with children still counts as quality time because you're in the same space.",
          isCorrect: false
        }
      ],
      insight: "Children don't need hours of your time—they need minutes of your presence. Twenty minutes of fully engaged, screen-free time creates more connection and joy than hours of being in the same room while distracted.",
      parentTip: "Put away screens and tasks for even 20 minutes of genuine play or conversation. Those minutes of full presence create more connection than hours of distracted co-presence."
    },
    {
      id: 5,
      title: "Understanding the Difference",
      description: "Reflect on what you've learned about quality vs quantity of time.",
      rushedStory: {
        title: "The Pattern",
        duration: "Long time, low connection",
        timeline: [
          { time: "Various", action: "Rushed parent spends long periods with children but is distracted—phone, work, thoughts." },
          { time: "Pattern", action: "Child tries to connect but parent is unavailable mentally and emotionally." },
          { time: "Result", action: "Despite quantity of time, child feels disconnected and unimportant." }
        ],
        childFeeling: "Consistently unheard and disconnected",
        result: "Quantity of time without quality presence doesn't create connection. Children feel alone even when parents are physically present."
      },
      mindfulStory: {
        title: "The Practice",
        duration: "Short time, deep connection",
        timeline: [
          { time: "Various", action: "Mindful parent creates brief moments of full presence—eye contact, attention, genuine listening." },
          { time: "Practice", action: "Even 5-20 minutes of screen-free, present time creates deep connection and security." },
          { time: "Result", action: "Children feel seen, heard, and valued. Quality moments create lasting connection."
          }
        ],
        childFeeling: "Consistently seen and connected",
        result: "Quality of presence transforms brief moments into meaningful connections. Children feel loved and secure from short, present interactions."
      },
      reflections: [
        {
          id: 'principle',
          text: "The principle is clear: emotional presence outweighs time length. A few minutes of eye contact and full attention create more connection than hours of distracted time.",
          isCorrect: true
        },
        {
          id: 'quantity',
          text: "Parents need to spend long hours with children to create connection—there's no substitute for quantity of time.",
          isCorrect: false
        },
        {
          id: 'perfect',
          text: "Perfect presence every moment is required—there's no value in brief moments of quality connection.",
          isCorrect: false
        }
      ],
      insight: "Quality over quantity is the foundation of meaningful connection. You don't need to spend all day with your children—you need to be fully present for the time you do spend. A few calm minutes of eye contact can reset your child's day and create the connection they need.",
      parentTip: "A few calm minutes of eye contact can reset your child's day. You don't need perfect presence all the time—just intentional, present moments. Those moments of quality connection are what children remember and what creates lasting bonds."
    }
  ];

  const currentScenarioData = scenarios[currentScenario];

  const handleWatchStory = (storyType) => {
    setCurrentStory(storyType);
    setStoryWatched(prev => ({ ...prev, [storyType]: true }));
    
    // Auto-advance to next story after a delay (simulating watching)
    if (storyType === 'rushed' && !storyWatched.mindful) {
      setTimeout(() => {
        setCurrentStory('mindful');
        setStoryWatched(prev => ({ ...prev, mindful: true }));
      }, 8000); // 8 seconds for rushed story
    }
  };

  const handleReflectionSelect = (reflectionId) => {
    setSelectedReflection(reflectionId);
    const reflection = currentScenarioData.reflections.find(r => r.id === reflectionId);
    if (reflection?.isCorrect) {
      setScore(prev => prev + 1);
    }
    setShowInsight(true);
  };

  const handleNext = () => {
    setShowInsight(false);
    setCurrentStory(null);
    setStoryWatched({ rushed: false, mindful: false });
    setSelectedReflection(null);
    
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const bothStoriesWatched = storyWatched.rushed && storyWatched.mindful;

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Quality Over Quantity"}
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
            <div className="text-6xl mb-4">👁️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Quality Over Quantity Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've learned that emotional presence outweighs time length. Remember: a few calm minutes of eye contact can reset your child's day.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> You don't need to spend all day with your children—you need to be fully present for the time you do spend. Put away screens, make eye contact, and listen fully. Even 5-10 minutes of quality presence creates more connection than hours of distracted time. Quality over quantity.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Quality Over Quantity"}
      subtitle={`Scenario ${currentScenario + 1} of ${totalLevels}: ${currentScenarioData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentScenario + 1}
    >
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Scenario Context */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{currentScenarioData.title}</h3>
            <p className="text-gray-600 mb-2">{currentScenarioData.description}</p>
          </div>

          {!bothStoriesWatched ? (
            /* Story Viewing Section */
            <div className="space-y-6">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-800 font-medium">
                  <strong>📋 Instructions:</strong> Watch both stories below to see the difference between rushed/distracted parenting and mindful/present parenting. Click "Watch Story" to see each one.
                </p>
              </div>

              {/* Two Stories Side by Side */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Rushed Parent Story */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${storyWatched.rushed ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300' : 'bg-gray-50 border-2 border-gray-300'} rounded-xl p-6`}
                >
                  {!storyWatched.rushed ? (
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-800 mb-4">{currentScenarioData.rushedStory.title}</h4>
                      <p className="text-gray-600 mb-4">{currentScenarioData.rushedStory.duration}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleWatchStory('rushed')}
                        className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                      >
                        <Play className="w-5 h-5" />
                        Watch Story
                      </motion.button>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        {currentScenarioData.rushedStory.title}
                        <CheckCircle className="w-6 h-6 text-red-500" />
                      </h4>
                      <div className="space-y-3 mb-4">
                        {currentScenarioData.rushedStory.timeline.map((event, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white rounded-lg p-3 border border-red-200"
                          >
                            <div className="flex items-start gap-2">
                              <Clock className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-xs font-semibold text-red-600">{event.time}</span>
                                <p className="text-sm text-gray-700 mt-1">{event.action}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="bg-red-100 rounded-lg p-3 border border-red-300">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Child's Feeling:</strong> {currentScenarioData.rushedStory.childFeeling}
                        </p>
                        <p className="text-xs text-gray-600">{currentScenarioData.rushedStory.result}</p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Mindful Parent Story */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${storyWatched.mindful ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300' : 'bg-gray-50 border-2 border-gray-300'} rounded-xl p-6`}
                >
                  {!storyWatched.mindful ? (
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-800 mb-4">{currentScenarioData.mindfulStory.title}</h4>
                      <p className="text-gray-600 mb-4">{currentScenarioData.mindfulStory.duration}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleWatchStory('mindful')}
                        disabled={!storyWatched.rushed}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                      >
                        <Play className="w-5 h-5" />
                        Watch Story
                      </motion.button>
                      {!storyWatched.rushed && (
                        <p className="text-xs text-gray-500 mt-2">Watch the first story first</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        {currentScenarioData.mindfulStory.title}
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </h4>
                      <div className="space-y-3 mb-4">
                        {currentScenarioData.mindfulStory.timeline.map((event, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white rounded-lg p-3 border border-green-200"
                          >
                            <div className="flex items-start gap-2">
                              <Eye className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-xs font-semibold text-green-600">{event.time}</span>
                                <p className="text-sm text-gray-700 mt-1">{event.action}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="bg-green-100 rounded-lg p-3 border border-green-300">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Child's Feeling:</strong> {currentScenarioData.mindfulStory.childFeeling}
                        </p>
                        <p className="text-xs text-gray-600">{currentScenarioData.mindfulStory.result}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Continue Button */}
              {bothStoriesWatched && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInsight(false)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                  >
                    Continue to Reflection
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : !showInsight ? (
            /* Reflection Selection */
            <div className="space-y-6">
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-4 text-center">What did you learn?</h4>
                <p className="text-gray-600 mb-6 text-center">Choose the reflection that best captures what you learned from watching both stories:</p>
                
                <div className="space-y-3">
                  {currentScenarioData.reflections.map((reflection, index) => (
                    <motion.button
                      key={reflection.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReflectionSelect(reflection.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedReflection === reflection.id
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-600 shadow-lg'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:shadow-md'
                      }`}
                    >
                      <p className="font-medium">{reflection.text}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Insight Message */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-green-600" />
                  Insight
                </h4>
                <p className="text-gray-700 leading-relaxed mb-4">{currentScenarioData.insight}</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
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

export default QualityOverQuantity;

