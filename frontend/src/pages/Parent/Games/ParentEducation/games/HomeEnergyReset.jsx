import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { DoorOpen, Wind, Heart, TrendingUp, Play, Pause } from "lucide-react";

const HomeEnergyReset = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-37";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentSession, setCurrentSession] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle, breathing, visualization, rating
  const [breathPhase, setBreathPhase] = useState('idle'); // inhale, hold, exhale
  const [breathCount, setBreathCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [energyShift, setEnergyShift] = useState(null);
  const [beforeEnergy, setBeforeEnergy] = useState(5); // Work mode energy (1-10, higher = more stressed)
  const [afterEnergy, setAfterEnergy] = useState(5); // Home mode energy (1-10, higher = more calm)
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  
  const timerRef = useRef(null);

  // Breathing timings (3 breaths before greeting)
  const breathingTimings = {
    inhale: 4,
    hold: 2,
    exhale: 6
  };

  // Reset sessions - different transition scenarios
  const resetSessions = [
    {
      id: 1,
      title: "End of Workday Transition",
      description: "You're leaving the office after a busy day. Practice the energy reset ritual before entering home.",
      context: "You've had meetings, deadlines, and work stress all day. As you approach your home, use this practice to transition from work mode to family mode.",
      workState: "Stressed, thinking about tomorrow's tasks, carrying work energy",
      visualizationText: "Imagine yourself standing at your front door. Take 3 breaths. With each breath, visualize leaving your work stress, deadlines, and worries outside. As you cross the threshold, step into your home with fresh, calm energy.",
      parentTip: "Take 3 breaths before greeting your family—arrive, don't rush in. Those 3 breaths signal to your brain: 'I'm transitioning. Work stays outside. Home begins here.'",
      explanation: "The physical act of breathing at the threshold creates a psychological boundary. Your body and mind need this transition time to shift from work mode to family mode."
    },
    {
      id: 2,
      title: "Difficult Day Reset",
      description: "You've had a particularly challenging day at work. Reset your energy before entering home.",
      context: "Today was tough—conflicts, setbacks, stress. You're carrying that energy with you. Practice leaving it at the door.",
      workState: "Frustrated, anxious, emotionally drained",
      visualizationText: "At your doorstep, pause. Take 3 deep breaths. With the first breath, acknowledge the difficulty of your day. With the second breath, visualize that stress leaving your body like dark smoke. With the third breath, imagine calm, warm energy filling you. Step inside with presence.",
      parentTip: "Even on the hardest days, those 3 breaths at the door matter. You don't have to be perfect—just present. Your family needs the version of you who arrives, not the version carrying work stress.",
      explanation: "Difficult days create especially important opportunities for energy reset. The practice helps you not bring work conflict or stress into your home space."
    },
    {
      id: 3,
      title: "Rushed Evening Transition",
      description: "You're running late, feeling rushed. Slow down and reset before entering.",
      context: "Traffic was bad, you're late, you're rushing. But rushing through the door brings rushed energy. Take 3 breaths to arrive properly.",
      workState: "Rushed, anxious, behind schedule",
      visualizationText: "Even though you're late, stop at your door. Take 3 breaths—they take only 12 seconds. With each breath, let go of the rush. Visualize time slowing down. Imagine crossing the threshold not as 'late arrival' but as 'coming home.' Step inside with calm presence, not rushed energy.",
      parentTip: "Being 12 seconds 'later' to take 3 breaths is worth it. Rushed energy disrupts connection. Calm arrival, even if brief, creates better connection than rushed presence.",
      explanation: "Rushing creates stress and disconnection. The 3-breath ritual interrupts the rush pattern and helps you arrive with presence, even when time is tight."
    },
    {
      id: 4,
      title: "Mental Work Reset",
      description: "Your mind is still working, problem-solving, planning. Reset mentally before entering home.",
      context: "You're physically home, but mentally still at work—thinking about problems, solutions, tomorrow's plans. Practice mental reset.",
      workState: "Mentally active, problem-solving, planning ahead",
      visualizationText: "At your door, notice your mind is still working. Take 3 breaths. With each breath, imagine your work thoughts floating away like clouds. Visualize your mind becoming quiet, open, present. As you cross the threshold, leave work thinking outside. Enter with an open, attentive mind ready for your family.",
      parentTip: "Your family can tell when you're mentally still at work. Those 3 breaths help your mind transition from 'work problem-solving mode' to 'family presence mode.'",
      explanation: "Mental presence is as important as physical presence. The breathing ritual helps your brain shift from work cognition to relational presence."
    },
    {
      id: 5,
      title: "Daily Ritual Practice",
      description: "Practice making the energy reset a daily ritual. Build this into your routine.",
      context: "This is about creating a consistent practice—making the 3-breath door ritual automatic, so it becomes part of how you transition every day.",
      workState: "End of workday, ready to transition",
      visualizationText: "At your door, take 3 breaths. Make this a ritual. With the first breath, acknowledge you're transitioning. With the second breath, leave work behind. With the third breath, arrive home fully. Cross the threshold with intention. This practice, done daily, rewires your transitions.",
      parentTip: "The 3-breath door ritual works best when it's automatic. Practice it physically at first—at your actual door. Eventually, you can do it mentally. The key is the transition: arrive, don't rush in.",
      explanation: "Rituals create lasting change. When the energy reset becomes automatic, you naturally transition better. Your family feels the difference—they get the version of you who arrives with presence, not the version carrying work energy."
    }
  ];

  const currentSessionData = resetSessions[currentSession];

  // Start breathing phase
  const startBreathing = () => {
    setPhase('breathing');
    setIsPlaying(true);
    setBreathPhase('inhale');
    setTimeRemaining(breathingTimings.inhale);
    setBreathCount(0);
    playBreathSound('inhale');
  };

  // Play breathing sound (conceptual - using Web Audio API)
  const playBreathSound = (phase) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (phase === 'inhale') {
        oscillator.frequency.value = 150;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + breathingTimings.inhale);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + breathingTimings.inhale);
      } else if (phase === 'exhale') {
        oscillator.frequency.value = 100;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + breathingTimings.exhale);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + breathingTimings.exhale);
      }
    } catch (error) {
      // Fallback if audio not available
    }
  };

  // Handle breathing cycle
  useEffect(() => {
    if (!isPlaying || phase !== 'breathing' || timeRemaining <= 0) {
      if (isPlaying && phase === 'breathing' && timeRemaining === 0) {
        // Move to next breath phase
        if (breathPhase === 'inhale') {
          setBreathPhase('hold');
          setTimeRemaining(breathingTimings.hold);
        } else if (breathPhase === 'hold') {
          setBreathPhase('exhale');
          setTimeRemaining(breathingTimings.exhale);
          playBreathSound('exhale');
        } else if (breathPhase === 'exhale') {
          setBreathCount(prev => prev + 1);
          
          if (breathCount < 2) {
            // Continue with next breath (total 3 breaths)
            setBreathPhase('inhale');
            setTimeRemaining(breathingTimings.inhale);
            playBreathSound('inhale');
          } else {
            // All 3 breaths complete - move to visualization
            setIsPlaying(false);
            setPhase('visualization');
            setBreathPhase('idle');
            setTimeRemaining(10); // 10 seconds for visualization
          }
        }
      }
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, phase, breathPhase, timeRemaining, breathCount]);

  // Handle visualization timer
  useEffect(() => {
    if (phase === 'visualization') {
      if (timeRemaining > 0) {
        timerRef.current = setTimeout(() => {
          setTimeRemaining(timeRemaining - 1);
        }, 1000);
      } else {
        // Visualization complete - move to rating
        setPhase('rating');
      }

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [phase, timeRemaining]);

  const handleEnergyShift = () => {
    const shift = afterEnergy - beforeEnergy; // Positive shift = more calm
    setEnergyShift(shift);
    setScore(prev => prev + 1);

    // Move to next session or complete
    setTimeout(() => {
      if (currentSession < resetSessions.length - 1) {
        setCurrentSession(currentSession + 1);
        setPhase('idle');
        setBreathCount(0);
        setBeforeEnergy(5);
        setAfterEnergy(5);
        setEnergyShift(null);
      } else {
        setShowGameOver(true);
      }
    }, 3000);
  };

  const getOrbSize = () => {
    if (breathPhase === 'inhale') {
      return 200; // Larger when inhaling
    } else if (breathPhase === 'hold') {
      return 200; // Stay large during hold
    } else {
      return 120; // Smaller when exhaling
    }
  };

  const getOrbColor = () => {
    if (breathPhase === 'inhale') {
      return 'from-blue-500 to-cyan-500';
    } else if (breathPhase === 'hold') {
      return 'from-indigo-500 to-purple-500';
    } else {
      return 'from-teal-400 to-green-400';
    }
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Home Energy Reset"}
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
            <div className="text-6xl mb-4">🚪</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Energy Reset Practice Complete!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've practiced transitioning from work mode to home mode. Remember: take 3 breaths before greeting your family—arrive, don't rush in.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> The 3-breath door ritual works best when it's automatic. Practice it physically at your actual door. Those 3 breaths signal to your brain: 'I'm transitioning. Work stays outside. Home begins here.' Arrive with presence, not work energy.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Home Energy Reset"}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Session Context */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{currentSessionData.title}</h3>
            <p className="text-gray-600 mb-2">{currentSessionData.description}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
              <p className="text-sm text-blue-800">{currentSessionData.context}</p>
            </div>
          </div>

          {/* Phase 1: Initial Energy Assessment */}
          {phase === 'idle' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Current Energy State</h4>
                <p className="text-gray-700 mb-4">{currentSessionData.workState}</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate your current energy (1 = Very Stressed/Work Mode, 10 = Very Calm/Home Mode)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={beforeEnergy}
                    onChange={(e) => setBeforeEnergy(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(beforeEnergy - 1) * 11.11}%, #e5e7eb ${(beforeEnergy - 1) * 11.11}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Work Mode (Stressed)</span>
                    <span className="text-lg font-bold text-orange-600">{beforeEnergy}/10</span>
                    <span>Home Mode (Calm)</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startBreathing}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-6 h-6" />
                Begin Energy Reset Practice
              </motion.button>
            </div>
          )}

          {/* Phase 2: Breathing Exercise */}
          {phase === 'breathing' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-xl p-8 border-2 border-blue-200 text-center">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Step 1: 3 Breaths at the Door</h4>
                <p className="text-gray-600 mb-6">Take 3 deep breaths before entering. Inhale (4s), Hold (2s), Exhale (6s)</p>
                
                {/* Breathing Orb */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{
                      scale: getOrbSize() / 150,
                    }}
                    transition={{
                      duration: breathPhase === 'inhale' ? breathingTimings.inhale : 
                               breathPhase === 'hold' ? breathingTimings.hold : 
                               breathingTimings.exhale,
                      ease: breathPhase === 'exhale' ? "easeIn" : "easeOut"
                    }}
                    className={`w-48 h-48 rounded-full bg-gradient-to-br ${getOrbColor()} shadow-2xl flex items-center justify-center`}
                  >
                    <motion.div
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [0.9, 1, 0.9]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-32 h-32 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                    >
                      <Wind className="w-16 h-16 text-white" />
                    </motion.div>
                  </motion.div>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {breathPhase === 'inhale' ? 'Breathe In' :
                     breathPhase === 'hold' ? 'Hold' :
                     'Breathe Out'}
                  </h3>
                  <p className="text-6xl font-bold text-blue-600">{timeRemaining}</p>
                  <p className="text-lg text-gray-600">
                    Breath {breathCount + 1} of 3
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Phase 3: Visualization */}
          {phase === 'visualization' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200 text-center">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Step 2: Visualize Crossing the Threshold</h4>
                
                {/* Door Visualization */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{
                      x: [0, 50, 0],
                      opacity: [0.5, 1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative"
                  >
                    <DoorOpen className="w-32 h-32 text-indigo-600" />
                    <motion.div
                      animate={{
                        x: [-100, 100],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                <div className="bg-white rounded-lg p-6 border-2 border-indigo-200 mb-4">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {currentSessionData.visualizationText}
                  </p>
                  {timeRemaining > 0 && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-gray-500">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span>Visualize for {timeRemaining} more seconds...</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 4: Energy Shift Rating */}
          {phase === 'rating' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
                <h4 className="text-xl font-semibold text-gray-800 mb-4 text-center">Step 3: Rate Your Energy Shift</h4>
                
                <div className="space-y-6">
                  {/* After Energy */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How do you feel now? (1 = Still in Work Mode, 10 = Fully in Home Mode)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={afterEnergy}
                      onChange={(e) => setAfterEnergy(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${(afterEnergy - 1) * 11.11}%, #e5e7eb ${(afterEnergy - 1) * 11.11}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>Work Mode</span>
                      <span className="text-lg font-bold text-green-600">{afterEnergy}/10</span>
                      <span>Home Mode</span>
                    </div>
                  </div>

                  {/* Energy Shift Display */}
                  {afterEnergy !== beforeEnergy && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-lg p-6 border-2 border-green-300"
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-4 mb-2">
                          <span className="text-2xl font-bold text-orange-600">{beforeEnergy}</span>
                          <TrendingUp className="w-8 h-8 text-green-500" />
                          <span className="text-2xl font-bold text-green-600">{afterEnergy}</span>
                        </div>
                        <p className="text-gray-700 font-medium">
                          Energy Shift: {afterEnergy > beforeEnergy ? '+' : ''}{afterEnergy - beforeEnergy} points
                        </p>
                        {afterEnergy > beforeEnergy && (
                          <p className="text-green-600 font-semibold mt-2">
                            ✓ Successfully transitioned to home mode!
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEnergyShift}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Complete This Session
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Message */}
          {energyShift !== null && energyShift > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-green-100 border-2 border-green-300 rounded-xl p-4"
            >
              <p className="text-green-800 font-medium text-center">
                ✓ Great! You've shifted from work energy to home energy. Moving to next session...
              </p>
            </motion.div>
          )}

          {/* Parent Tip */}
          <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>💡 Parent Tip:</strong> {currentSessionData.parentTip}
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default HomeEnergyReset;

