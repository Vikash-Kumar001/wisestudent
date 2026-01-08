import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Eye, Ear, Heart, Smile, Play, Pause, CheckCircle } from "lucide-react";

const PresencePractice = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-35";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentPractice, setCurrentPractice] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [practicesCompleted, setPracticesCompleted] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  
  const timerRef = useRef(null);

  // Practice scenarios with different family moments
  const practices = [
    {
      id: 1,
      title: "Morning Presence",
      description: "Practice presence during a morning moment with your child",
      context: "Your child is getting ready for school or eating breakfast. There's a rush, but this moment offers an opportunity for presence.",
      situation: "You're helping your child get ready in the morning. Take this moment to practice full presence.",
      steps: [
        {
          id: 'observe',
          label: "LOOK",
          instruction: "Observe your child",
          voicePrompt: "Look",
          detailedText: "Take 15 seconds to really look at your child. Notice their expressions, their movements, the way they hold themselves. See them fully, without judgment or agenda.",
          duration: 15,
          icon: Eye,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          emoji: "👁️"
        },
        {
          id: 'listen',
          label: "LISTEN",
          instruction: "Listen deeply",
          voicePrompt: "Listen",
          detailedText: "For 15 seconds, listen to your child's voice, their sounds, their breathing. Hear beyond words—notice the tone, the energy, what they're really communicating. Listen with your whole being.",
          duration: 15,
          icon: Ear,
          color: "from-purple-500 to-indigo-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-300",
          emoji: "👂"
        },
        {
          id: 'feel',
          label: "FEEL",
          instruction: "Take a breath, then smile",
          voicePrompt: "Feel",
          detailedText: "Take one deep, slow breath. As you breathe out, feel your connection with your child. Then smile silently—not because you have to, but because you're here, truly here, with them. Feel the calm energy of presence.",
          duration: 10,
          icon: Heart,
          color: "from-pink-500 to-rose-500",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-300",
          emoji: "💚"
        }
      ],
      parentTip: "Presence heals more than advice; your calm energy speaks louder. When you're fully present, your child feels seen, heard, and safe. This foundation makes everything else easier.",
      explanation: "Morning routines can feel rushed, but even 40 seconds of full presence transforms the energy. Your child carries that feeling of being truly seen throughout their day."
    },
    {
      id: 2,
      title: "After School Presence",
      description: "Practice presence when your child comes home from school",
      context: "Your child has had a full day at school. They need to download, process, and feel connected. This is a crucial moment for presence.",
      situation: "Your child just walked through the door after school. They're full of their day—excitement, stress, stories. Practice full presence now.",
      steps: [
        {
          id: 'observe',
          label: "LOOK",
          instruction: "Observe your child",
          voicePrompt: "Look",
          detailedText: "Look at your child. Notice their posture, their energy level, their expression. Are they excited? Tired? Stressed? See them as they are in this moment, without rushing to fix or respond.",
          duration: 15,
          icon: Eye,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          emoji: "👁️"
        },
        {
          id: 'listen',
          label: "LISTEN",
          instruction: "Listen deeply",
          voicePrompt: "Listen",
          detailedText: "Listen to what they're saying and what they're not saying. Listen to their tone, their pace, the words they choose. Hear their whole experience, not just the words.",
          duration: 15,
          icon: Ear,
          color: "from-purple-500 to-indigo-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-300",
          emoji: "👂"
        },
        {
          id: 'feel',
          label: "FEEL",
          instruction: "Take a breath, then smile",
          voicePrompt: "Feel",
          detailedText: "Breathe in. Feel your love for them. Breathe out. Feel your presence with them. Smile silently—you're here, you're listening, you're present. Your calm presence is what they need most.",
          duration: 10,
          icon: Heart,
          color: "from-pink-500 to-rose-500",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-300",
          emoji: "💚"
        }
      ],
      parentTip: "The first 10 minutes after school are golden. Your child needs to process their day. Your presence—not your advice, not your solutions—is what helps them feel safe and heard.",
      explanation: "When children feel truly seen and heard after school, they open up naturally. Your presence creates the space for them to process, decompress, and share."
    },
    {
      id: 3,
      title: "Evening Presence",
      description: "Practice presence during a quiet evening moment",
      context: "The day is winding down. You're tired, your child might be tired. This is when presence becomes a choice—to be fully here despite fatigue.",
      situation: "It's evening. You're both tired from the day. Practice presence even when energy is low. Presence is a choice, not a feeling.",
      steps: [
        {
          id: 'observe',
          label: "LOOK",
          instruction: "Observe your child",
          voicePrompt: "Look",
          detailedText: "Look at your child. See them beyond the tiredness, beyond the day's stress. See the child you love, the person they are. Notice the small details—their hands, their expressions, their essence.",
          duration: 15,
          icon: Eye,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          emoji: "👁️"
        },
        {
          id: 'listen',
          label: "LISTEN",
          instruction: "Listen deeply",
          voicePrompt: "Listen",
          detailedText: "Listen to the quiet moments. Listen to what they might not be saying. Listen to their energy, their needs, their heart. Even silence can be listened to deeply.",
          duration: 15,
          icon: Ear,
          color: "from-purple-500 to-indigo-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-300",
          emoji: "👂"
        },
        {
          id: 'feel',
          label: "FEEL",
          instruction: "Take a breath, then smile",
          voicePrompt: "Feel",
          detailedText: "Take a deep breath. Acknowledge your tiredness, and choose presence anyway. Breathe out. Smile silently—you're here, and that's enough. Your presence, even when tired, is a gift.",
          duration: 10,
          icon: Heart,
          color: "from-pink-500 to-rose-500",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-300",
          emoji: "💚"
        }
      ],
      parentTip: "Presence doesn't require perfect energy—it requires intention. Even when you're tired, choosing to be present for just 40 seconds transforms the energy of your connection.",
      explanation: "Evening presence is especially powerful because it's a choice made despite fatigue. Your child feels the difference when you choose presence over distraction, even when you're tired."
    },
    {
      id: 4,
      title: "Conflict Presence",
      description: "Practice presence during a challenging moment",
      context: "There's tension, frustration, or conflict. This is when presence is hardest—and most needed. Practice being fully here even when it's difficult.",
      situation: "You're in a moment of tension or conflict with your child. Practice presence even when it's challenging. Presence creates space for connection.",
      steps: [
        {
          id: 'observe',
          label: "LOOK",
          instruction: "Observe your child",
          voicePrompt: "Look",
          detailedText: "Look at your child. See beyond their behavior to the child underneath—the one who's struggling, feeling big emotions, needing connection. See them with compassion, not judgment.",
          duration: 15,
          icon: Eye,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          emoji: "👁️"
        },
        {
          id: 'listen',
          label: "LISTEN",
          instruction: "Listen deeply",
          voicePrompt: "Listen",
          detailedText: "Listen to what's really being communicated beneath the words. Listen to their emotions, their needs, their heart. Listen without needing to fix or solve—just listen.",
          duration: 15,
          icon: Ear,
          color: "from-purple-500 to-indigo-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-300",
          emoji: "👂"
        },
        {
          id: 'feel',
          label: "FEEL",
          instruction: "Take a breath, then smile",
          voicePrompt: "Feel",
          detailedText: "Take a breath. Feel your own emotions, your own reactivity. Breathe through it. Then smile silently—not a fake smile, but a gentle acknowledgment: 'I'm here. I see you. We're okay.' Feel the calm that presence brings.",
          duration: 10,
          icon: Heart,
          color: "from-pink-500 to-rose-500",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-300",
          emoji: "💚"
        }
      ],
      parentTip: "Presence in conflict is transformative. When you can stay present even during tension, you create space for healing. Your calm presence is what your child needs to regulate their own emotions.",
      explanation: "Conflict moments are when presence is hardest and most valuable. When you stay present during difficulty, you model emotional regulation and create connection even in challenge."
    },
    {
      id: 5,
      title: "Daily Presence Ritual",
      description: "Make presence practice a daily habit",
      context: "This is about integrating presence into your daily life—making it a natural practice, not a special occasion.",
      situation: "Practice the presence ritual. Make it a daily habit—Look, Listen, Feel. Build this into your routine.",
      steps: [
        {
          id: 'observe',
          label: "LOOK",
          instruction: "Observe your child",
          voicePrompt: "Look",
          detailedText: "Look at your child. Really see them. This practice, done daily, trains your brain to see beyond surface behavior to the person underneath. Notice how this becomes easier with practice.",
          duration: 15,
          icon: Eye,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          emoji: "👁️"
        },
        {
          id: 'listen',
          label: "LISTEN",
          instruction: "Listen deeply",
          voicePrompt: "Listen",
          detailedText: "Listen deeply. With practice, you'll hear more—not just words, but needs, emotions, the whole communication. Deep listening becomes a habit, a way of being with your child.",
          duration: 15,
          icon: Ear,
          color: "from-purple-500 to-indigo-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-300",
          emoji: "👂"
        },
        {
          id: 'feel',
          label: "FEEL",
          instruction: "Take a breath, then smile",
          voicePrompt: "Feel",
          detailedText: "Breathe. Feel your presence. Smile silently. This ritual, practiced daily, rewires your nervous system. You become more present, more calm, more connected. Your child feels the difference, and so do you.",
          duration: 10,
          icon: Heart,
          color: "from-pink-500 to-rose-500",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-300",
          emoji: "💚"
        }
      ],
      parentTip: "Presence practice becomes powerful when it's consistent. Try doing this 'Look, Listen, Feel' ritual once a day—even for 40 seconds. Your consistent presence creates a foundation of connection that supports everything else.",
      explanation: "Daily presence practice creates lasting change. Your brain rewires itself to be more present, your nervous system learns to stay calm, and your relationship with your child deepens. Presence becomes who you are, not just something you do."
    }
  ];

  const currentPracticeData = practices[currentPractice];
  const currentStepData = currentPracticeData?.steps[currentStep];

  // Start practice step
  const startStep = () => {
    if (currentStepData) {
      setIsPlaying(true);
      setTimeRemaining(currentStepData.duration);
      setStepCompleted(false);
    }
  };

  // Handle step timer
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) {
      if (isPlaying && timeRemaining === 0) {
        setStepCompleted(true);
        setIsPlaying(false);
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
  }, [isPlaying, timeRemaining]);

  // Text-to-speech for voice prompts (optional, can be disabled if browser doesn't support)
  const speakPrompt = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextStep = () => {
    if (currentStep < currentPracticeData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimeRemaining(0);
      setStepCompleted(false);
    } else {
      // Practice complete
      setPracticesCompleted(prev => ({
        ...prev,
        [currentPractice]: true
      }));
      setScore(prev => prev + 1);
      
      if (currentPractice < practices.length - 1) {
        setCurrentPractice(currentPractice + 1);
        setCurrentStep(0);
        setTimeRemaining(0);
        setStepCompleted(false);
      } else {
        setShowGameOver(true);
      }
    }
  };

  const handleStartStep = () => {
    startStep();
    if (currentStepData?.voicePrompt) {
      speakPrompt(currentStepData.voicePrompt);
    }
  };

  const StepIcon = currentStepData?.icon || Eye;

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "The Presence Practice"}
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
            <div className="text-6xl mb-4">🧘</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Presence Practice Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've practiced mindful awareness with your family. Remember: presence heals more than advice; your calm energy speaks louder.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Make presence practice a daily habit. The 'Look, Listen, Feel' ritual takes just 40 seconds but transforms your connection. Your consistent presence creates a foundation that supports everything else in parenting.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "The Presence Practice"}
      subtitle={`Practice ${currentPractice + 1} of ${totalLevels}: ${currentPracticeData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentPractice + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Practice Context */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{currentPracticeData.title}</h3>
            <p className="text-gray-600 mb-2">{currentPracticeData.description}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
              <p className="text-sm text-blue-800">{currentPracticeData.context}</p>
            </div>
          </div>

          {/* Situation */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 mb-6">
            <p className="text-gray-700 font-medium">{currentPracticeData.situation}</p>
          </div>

          {/* Current Step Display */}
          {currentStepData && (
            <div className="mb-6">
              <div className={`${currentStepData.bgColor} border-2 ${currentStepData.borderColor} rounded-2xl p-8 text-center`}>
                {/* Step Header */}
                <div className="mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                    style={{
                      background: currentStepData.id === 'observe' 
                        ? 'linear-gradient(to bottom right, #3b82f6, #06b6d4)'
                        : currentStepData.id === 'listen'
                        ? 'linear-gradient(to bottom right, #a855f7, #6366f1)'
                        : 'linear-gradient(to bottom right, #ec4899, #f43f5e)'
                    }}
                  >
                    <StepIcon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h4 className="text-4xl font-bold text-gray-800 mb-2">{currentStepData.label}</h4>
                  <p className="text-xl text-gray-600">{currentStepData.instruction}</p>
                </div>

                {/* Timer and Status */}
                {!isPlaying && !stepCompleted && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartStep}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                  >
                    <Play className="w-6 h-6" />
                    Start {currentStepData.label} Practice
                  </motion.button>
                )}

                {isPlaying && (
                  <div className="space-y-4">
                    <motion.div
                      key={timeRemaining}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-6xl font-bold text-indigo-600"
                    >
                      {timeRemaining}
                    </motion.div>
                    <div className="text-gray-600 text-lg">{currentStepData.detailedText}</div>
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                      <span>Practice in progress...</span>
                    </div>
                  </div>
                )}

                {stepCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <p className="text-xl font-semibold text-green-600">Step Complete!</p>
                    <p className="text-gray-600">You've completed the {currentStepData.label} practice.</p>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Step Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3">
              {currentPracticeData.steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep || (index === currentStep && stepCompleted);
                
                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      {index > 0 && (
                        <div className={`w-8 h-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      )}
                      <motion.div
                        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5, repeat: isActive && isPlaying ? Infinity : 0 }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                          isCompleted
                            ? 'bg-green-500'
                            : isActive
                            ? ''
                            : 'bg-gray-200 text-gray-400'
                        }`}
                        style={isActive && !isCompleted ? {
                          background: step.id === 'observe' 
                            ? 'linear-gradient(to bottom right, #3b82f6, #06b6d4)'
                            : step.id === 'listen'
                            ? 'linear-gradient(to bottom right, #a855f7, #6366f1)'
                            : 'linear-gradient(to bottom right, #ec4899, #f43f5e)'
                        } : {}}
                      >
                        <StepIcon className="w-6 h-6" />
                      </motion.div>
                      {index < currentPracticeData.steps.length - 1 && (
                        <div className={`w-8 h-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Button */}
          {stepCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextStep}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {currentStep < currentPracticeData.steps.length - 1 ? 'Next Step' : currentPractice < practices.length - 1 ? 'Next Practice' : 'Complete All Practices'}
              </motion.button>
            </motion.div>
          )}

          {/* Explanation and Tip */}
          {stepCompleted && currentStep === currentPracticeData.steps.length - 1 && (
            <div className="mt-6 space-y-4">
              <div className="bg-white border-2 border-indigo-200 rounded-xl p-4">
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Why This Works:</strong> {currentPracticeData.explanation}
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>💡 Parent Tip:</strong> {currentPracticeData.parentTip}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default PresencePractice;

