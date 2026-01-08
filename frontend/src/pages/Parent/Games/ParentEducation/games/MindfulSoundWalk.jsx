import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Play, Volume2, Pause, Ear, Wind, Footprints, Bird, Sparkles } from "lucide-react";

const MindfulSoundWalk = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-45";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentWalk, setCurrentWalk] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [focusedSounds, setFocusedSounds] = useState([]);
  const [reflections, setReflections] = useState({});
  const [showReflection, setShowReflection] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const audioContextRef = useRef(null);
  const soundSourcesRef = useRef([]);

  // Sound walk scenarios
  const walks = [
    {
      id: 1,
      title: "Morning Garden Walk",
      description: "Step into a peaceful morning garden. Tune into the sounds around you to ground your awareness.",
      context: "Early morning in a garden—birds are singing, leaves rustle in the breeze, and you can hear your own footsteps on the path.",
      sounds: [
        { id: 'birds', label: 'Bird Songs', icon: Bird, color: 'from-blue-400 to-cyan-400', description: 'Chirping and singing' },
        { id: 'breeze', label: 'Gentle Breeze', icon: Wind, color: 'from-green-400 to-emerald-400', description: 'Leaves rustling' },
        { id: 'footsteps', label: 'Footsteps', icon: Footprints, color: 'from-amber-400 to-orange-400', description: 'Walking on path' }
      ],
      parentTip: "Walking with awareness lowers cortisol more than phone scrolling ever could. When you tune into sounds, you're grounding yourself in the present moment, not escaping into screens."
    },
    {
      id: 2,
      title: "Forest Path Walk",
      description: "Walk through a quiet forest path. Listen mindfully to the natural sounds around you.",
      context: "A peaceful forest trail—distant birds, wind through trees, and your steps on the forest floor.",
      sounds: [
        { id: 'birds', label: 'Bird Calls', icon: Bird, color: 'from-blue-400 to-cyan-400', description: 'Distant bird calls' },
        { id: 'breeze', label: 'Wind Through Trees', icon: Wind, color: 'from-green-400 to-emerald-400', description: 'Rustling leaves' },
        { id: 'footsteps', label: 'Footsteps on Path', icon: Footprints, color: 'from-amber-400 to-orange-400', description: 'Walking sounds' }
      ],
      parentTip: "Practicing mindful sound walks trains your brain to be present. This presence—not phone scrolling—is what lowers stress and builds connection with your child."
    },
    {
      id: 3,
      title: "Park Stroll",
      description: "Take a mindful stroll through a park. Focus on three distinct sounds to ground your awareness.",
      context: "A city park—birds in trees, a gentle breeze, and the rhythm of your walking.",
      sounds: [
        { id: 'birds', label: 'Park Birds', icon: Bird, color: 'from-blue-400 to-cyan-400', description: 'Birds in trees' },
        { id: 'breeze', label: 'Park Breeze', icon: Wind, color: 'from-green-400 to-emerald-400', description: 'Gentle wind' },
        { id: 'footsteps', label: 'Walking Rhythm', icon: Footprints, color: 'from-amber-400 to-orange-400', description: 'Your footsteps' }
      ],
      parentTip: "After a mindful sound walk, you arrive home more present. Your lowered cortisol means more patience, more connection, more calm for your child."
    },
    {
      id: 4,
      title: "Beach Walk",
      description: "Walk along a beach path. Tune into the sounds of nature to restore your awareness.",
      context: "A beachside path—seagulls calling, ocean breeze, and footsteps on sand.",
      sounds: [
        { id: 'birds', label: 'Seagulls', icon: Bird, color: 'from-blue-400 to-cyan-400', description: 'Seagull calls' },
        { id: 'breeze', label: 'Ocean Breeze', icon: Wind, color: 'from-green-400 to-emerald-400', description: 'Wind from ocean' },
        { id: 'footsteps', label: 'Footsteps on Sand', icon: Footprints, color: 'from-amber-400 to-orange-400', description: 'Sand underfoot' }
      ],
      parentTip: "Mindful sound walks are a reset button. Five minutes of tuning into sounds does more for your stress than hours of scrolling. Try it before coming home to your child."
    },
    {
      id: 5,
      title: "Neighborhood Walk",
      description: "Take a mindful walk through your neighborhood. Focus on three sounds to ground yourself.",
      context: "Your familiar neighborhood—birds in nearby trees, a light breeze, and your steady walking pace.",
      sounds: [
        { id: 'birds', label: 'Neighborhood Birds', icon: Bird, color: 'from-blue-400 to-cyan-400', description: 'Birds nearby' },
        { id: 'breeze', label: 'Light Breeze', icon: Wind, color: 'from-green-400 to-emerald-400', description: 'Gentle wind' },
        { id: 'footsteps', label: 'Your Footsteps', icon: Footprints, color: 'from-amber-400 to-orange-400', description: 'Walking pace' }
      ],
      parentTip: "Make sound walks a daily practice. Five minutes of mindful listening before coming home means you arrive with lower stress and higher presence. Your child feels the difference."
    }
  ];

  const currentWalkData = walks[currentWalk];

  // Initialize audio context
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.log('Audio context not available');
    }

    return () => {
      // Cleanup: stop all sounds
      if (soundSourcesRef.current) {
        soundSourcesRef.current.forEach(source => {
          if (source) source.stop();
        });
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Generate bird sounds using Web Audio API
  const generateBirdSound = () => {
    if (!audioContextRef.current) return null;
    
    const osc1 = audioContextRef.current.createOscillator();
    const osc2 = audioContextRef.current.createOscillator();
    const gain1 = audioContextRef.current.createGain();
    const gain2 = audioContextRef.current.createGain();
    const masterGain = audioContextRef.current.createGain();
    
    // Create chirping pattern
    osc1.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
    osc1.frequency.setValueAtTime(1200, audioContextRef.current.currentTime + 0.1);
    osc1.frequency.setValueAtTime(900, audioContextRef.current.currentTime + 0.2);
    osc1.type = 'sine';
    
    osc2.frequency.setValueAtTime(1000, audioContextRef.current.currentTime);
    osc2.frequency.setValueAtTime(1400, audioContextRef.current.currentTime + 0.15);
    osc2.type = 'triangle';
    
    gain1.gain.setValueAtTime(0.15, audioContextRef.current.currentTime);
    gain2.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    masterGain.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    
    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(masterGain);
    gain2.connect(masterGain);
    masterGain.connect(audioContextRef.current.destination);
    
    osc1.start();
    osc2.start();
    
    return { osc1, osc2, stop: () => { osc1.stop(); osc2.stop(); } };
  };

  // Generate breeze/wind sounds
  const generateBreezeSound = () => {
    if (!audioContextRef.current) return null;
    
    // Use noise generator for wind-like sound
    const bufferSize = audioContextRef.current.sampleRate * 2;
    const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioContextRef.current.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    
    const filter = audioContextRef.current.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    
    const gain = audioContextRef.current.createGain();
    gain.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioContextRef.current.destination);
    
    noise.start();
    
    return { noise, stop: () => noise.stop() };
  };

  // Generate footsteps sound
  const generateFootstepsSound = () => {
    if (!audioContextRef.current) return null;
    
    const playStep = () => {
      const osc = audioContextRef.current.createOscillator();
      const gain = audioContextRef.current.createGain();
      const filter = audioContextRef.current.createBiquadFilter();
      
      filter.type = 'lowpass';
      filter.frequency.value = 200;
      
      osc.frequency.setValueAtTime(100, audioContextRef.current.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, audioContextRef.current.currentTime + 0.2);
      osc.type = 'sawtooth';
      
      gain.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioContextRef.current.destination);
      
      osc.start();
      osc.stop(audioContextRef.current.currentTime + 0.2);
    };
    
    // Play footsteps rhythmically
    const interval = setInterval(playStep, 800);
    
    return { interval, stop: () => clearInterval(interval) };
  };

  // Start the sound walk
  const startWalk = () => {
    setIsListening(true);
    setFocusedSounds([]);
    
    // Play all sounds simultaneously
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    const birdSound = generateBirdSound();
    const breezeSound = generateBreezeSound();
    const footstepsSound = generateFootstepsSound();
    
    soundSourcesRef.current = [birdSound, breezeSound, footstepsSound].filter(Boolean);
  };

  // Stop all sounds
  const stopWalk = () => {
    setIsListening(false);
    if (soundSourcesRef.current) {
      soundSourcesRef.current.forEach(source => {
        if (source && source.stop) source.stop();
      });
      soundSourcesRef.current = [];
    }
  };

  // Handle sound focus
  const handleSoundFocus = (soundId) => {
    if (focusedSounds.includes(soundId)) {
      setFocusedSounds(prev => prev.filter(id => id !== soundId));
    } else if (focusedSounds.length < 3) {
      setFocusedSounds(prev => [...prev, soundId]);
      
      // If 3 sounds focused, stop listening and show reflection
      if (focusedSounds.length === 2) {
        setTimeout(() => {
          stopWalk();
          setShowReflection(true);
        }, 500);
      }
    }
  };

  // Handle reflection submission
  const handleReflectionSubmit = (reflectionText) => {
    const walkKey = `walk${currentWalk}`;
    setReflections(prev => ({
      ...prev,
      [walkKey]: reflectionText
    }));
    
    setScore(prev => prev + 1);
    
    setTimeout(() => {
      if (currentWalk < walks.length - 1) {
        setCurrentWalk(prev => prev + 1);
        setFocusedSounds([]);
        setShowReflection(false);
      } else {
        setShowGameOver(true);
      }
    }, 1500);
  };

  const progress = ((currentWalk + 1) / totalLevels) * 100;

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Mindful Sound Walk"}
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
            <div className="text-6xl mb-4">👂</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Mindful Sound Walk Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've learned to tune into sounds around you to ground your awareness. Remember: walking with awareness lowers cortisol more than phone scrolling ever could.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Walking with awareness lowers cortisol more than phone scrolling ever could. When you tune into sounds, you're grounding yourself in the present moment, not escaping into screens. After a mindful sound walk, you arrive home more present. Your lowered stress means more patience, more connection, more calm for your child. Make sound walks a daily practice.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Mindful Sound Walk"}
      subtitle={`Walk ${currentWalk + 1} of ${totalLevels}: ${currentWalkData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentWalk + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          key={currentWalk}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Walk {currentWalk + 1} of {totalLevels}</span>
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

          {/* Walk context */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{currentWalkData.title}</h3>
            <p className="text-gray-700 mb-2">{currentWalkData.description}</p>
            <p className="text-sm text-gray-600 italic mb-3">{currentWalkData.context}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> {currentWalkData.parentTip}
              </p>
            </div>
          </div>

          {!isListening && !showReflection && (
            /* Start screen */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Step Outdoors</h3>
                <p className="text-gray-700 mb-6">
                  Take a moment to prepare for your mindful sound walk. When you're ready, start listening and focus on 3 distinct sounds around you.
                </p>
                <div className="flex items-center justify-center gap-6 mb-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Ear className="w-5 h-5" />
                    <span>Listen mindfully</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    <span>Focus on 3 sounds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Ground awareness</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startWalk}
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mx-auto"
                >
                  <Play className="w-6 h-6" />
                  Start Sound Walk
                </motion.button>
              </div>
            </div>
          )}

          {isListening && !showReflection && (
            /* Listening screen */
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-4 h-4 bg-green-500 rounded-full"
                  />
                  <p className="text-lg font-semibold text-gray-800">Listening...</p>
                </div>
                <p className="text-gray-700 mb-4">
                  Focus on <strong>{3 - focusedSounds.length}</strong> more sound{focusedSounds.length !== 2 ? 's' : ''} to complete your walk.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopWalk}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <Pause className="w-5 h-5" />
                  Stop Listening
                </motion.button>
              </div>

              {/* Sound options */}
              <div className="grid md:grid-cols-3 gap-4">
                {currentWalkData.sounds.map((sound) => {
                  const isFocused = focusedSounds.includes(sound.id);
                  const SoundIcon = sound.icon;
                  
                  return (
                    <motion.button
                      key={sound.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSoundFocus(sound.id)}
                      disabled={focusedSounds.length >= 3 && !isFocused}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        isFocused
                          ? `bg-gradient-to-br ${sound.color} text-white border-transparent shadow-lg`
                          : focusedSounds.length >= 3
                          ? 'bg-gray-100 border-gray-300 text-gray-400 opacity-50 cursor-not-allowed'
                          : `bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:shadow-md`
                      }`}
                    >
                      <SoundIcon className="w-12 h-12 mx-auto mb-3" />
                      <div className="font-semibold text-lg mb-1">{sound.label}</div>
                      <div className="text-sm opacity-75">{sound.description}</div>
                      {isFocused && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <CheckCircle className="w-6 h-6 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Focused sounds display */}
              {focusedSounds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Sounds You've Focused On:</h4>
                  <div className="flex flex-wrap gap-2">
                    {focusedSounds.map((soundId) => {
                      const sound = currentWalkData.sounds.find(s => s.id === soundId);
                      return (
                        <span key={soundId} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          <sound.icon className="w-4 h-4" />
                          {sound?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {showReflection && (
            /* Reflection screen */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                  Reflect on Your Sound Walk
                </h3>
                <p className="text-gray-700 mb-4">
                  How did tuning into sounds affect your awareness? What did you notice about being present with the sounds?
                </p>
                
                <SoundWalkReflection
                  onSubmit={handleReflectionSubmit}
                  focusedSounds={focusedSounds}
                  sounds={currentWalkData.sounds}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

// Reflection component
const SoundWalkReflection = ({ onSubmit, focusedSounds, sounds }) => {
  const [reflection, setReflection] = useState("");

  const handleSubmit = () => {
    if (reflection.trim().length > 10) {
      onSubmit(reflection);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="Share your reflections on the sound walk. How did focusing on sounds ground your awareness? What did you notice?"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
        rows={6}
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={reflection.trim().length < 10}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Reflection
      </motion.button>
      <p className="text-xs text-gray-500 text-center">
        Minimum 10 characters required
      </p>
    </div>
  );
};

export default MindfulSoundWalk;

