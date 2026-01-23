import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Eye, CheckCircle, Circle, Target, Sparkles } from "lucide-react";

const MindfulObservationGame = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-43";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [answers, setAnswers] = useState({});

  // Define 5 mindfulness questions for parents
  const questions = [
    {
      id: 1,
      question: "How often do you intentionally pause during the day to observe your child's emotions without immediately trying to fix or change them?",
      options: [
        { id: 'a', text: "Rarely - I usually jump in to solve problems right away" },
        { id: 'b', text: "Sometimes - I try to pause, but get caught up in daily tasks" },
        { id: 'c', text: "Often - I make a conscious effort to observe before responding" },
        { id: 'd', text: "Regularly - I consistently practice observing my child's emotions mindfully" }
      ],
      correct: 'd',
      feedback: {
        'a': "Remember that observing without immediately fixing gives your child space to process emotions and develop emotional regulation skills.",
        'b': "Try setting small reminders to pause and observe. Even a few seconds of mindful attention can make a difference.",
        'c': "Great practice! Continue to build this mindful observation habit.",
        'd': "Excellent! This mindful approach helps your child feel understood and develops their emotional intelligence."
      }
    },
    {
      id: 2,
      question: "When spending time with your child, how aware are you of your own mental state and emotional reactions?",
      options: [
        { id: 'a', text: "I rarely notice my own emotional state during interactions" },
        { id: 'b', text: "Occasionally I notice, but it doesn't affect how I interact" },
        { id: 'd', text: "I'm consistently aware of my emotional state and adjust my responses mindfully" },
        { id: 'c', text: "I often notice my emotions and try to regulate them before responding" },
      ],
      correct: 'd',
      feedback: {
        'a': "Awareness of your own emotions is key to mindful parenting. Try taking a moment to check in with yourself before interacting.",
        'b': "Awareness is the first step. As you become more aware, you can start to use that awareness to guide your responses.",
        'c': "You're developing great self-awareness skills. Keep practicing to strengthen this ability.",
        'd': "Outstanding! Being aware of your emotional state helps you respond to your child with intention rather than react impulsively."
      }
    },
    {
      id: 3,
      question: "How frequently do you engage in activities with your child where you're fully present and undistracted?",
      options: [
        { id: 'a', text: "Rarely - I'm usually multitasking or thinking about other responsibilities" },
        { id: 'd', text: "Most of the time - I prioritize being fully present during our interactions" },
        { id: 'b', text: "Sometimes - I try to be present but get distracted easily" },
        { id: 'c', text: "Often - I make efforts to put devices away and focus on our time together" },
      ],
      correct: 'd',
      feedback: {
        'a': "Full presence takes practice. Start with short periods of focused attention and gradually increase.",
        'b': "Notice when your mind wanders and gently redirect your attention back to your child.",
        'c': "Great effort! Your intention to minimize distractions is valuable for your child's sense of security.",
        'd': "Wonderful! Your mindful presence creates a strong emotional bond and helps your child feel valued and secure."
      }
    },
    {
      id: 4,
      question: "When your child is sharing something with you, how mindful are you of listening without planning your response while they're speaking?",
      options: [
        { id: 'd', text: "I consistently practice listening fully without planning my response ahead of time" },
        { id: 'a', text: "I usually start thinking about what to say while they're talking" },
        { id: 'b', text: "Sometimes I catch myself planning my response and try to refocus" },
        { id: 'c', text: "I mostly listen fully, though I occasionally start forming responses prematurely" },
      ],
      correct: 'd',
      feedback: {
        'a': "Truly listening without planning a response helps children feel heard and validated. Try focusing on understanding first.",
        'b': "Self-awareness during conversations is key. When you notice your mind wandering, gently return to listening.",
        'c': "You're developing good listening habits. Continue to practice being fully present as your child speaks.",
        'd': "Excellent listening skills! This mindful approach helps your child feel truly heard and understood."
      }
    },
    {
      id: 5,
      question: "How often do you take moments to observe your child's behavior patterns and body language to better understand their needs?",
      options: [
        { id: 'a', text: "I rarely pay attention to these subtle patterns" },
        { id: 'b', text: "Occasionally I notice patterns, but don't connect them to needs" },
        { id: 'c', text: "I often observe patterns and try to understand what my child needs" },
        { id: 'd', text: "I regularly observe patterns and proactively meet my child's emotional and physical needs" }
      ],
      correct: 'd',
      feedback: {
        'a': "Start by taking brief moments to notice your child's body language and behavioral patterns. This awareness grows with practice.",
        'b': "Observation is the first step. Try connecting what you observe to your child's potential needs.",
        'c': "Great observational skills! You're building an important foundation for responsive parenting.",
        'd': "Outstanding! This mindful observation helps you meet your child's needs proactively and strengthens your parent-child bond."
      }
    }
  ];

  const currentQuestion = questions[currentRound];
  const allAnswered = Object.keys(answers).length >= questions.length;

  // Handle selecting an answer
  const handleAnswerSelect = (optionId) => {
    if (selectedAnswer) return; // Prevent changing answer once selected
    
    // Record the answer
    const newAnswers = { ...answers, [currentRound]: optionId };
    setAnswers(newAnswers);
    setSelectedAnswer(optionId);
    
    // Update score if correct answer selected
    if (optionId === currentQuestion.correct) {
      setScore(prev => prev + 1);
    }
    
    // Show feedback
    setShowFeedback(true);
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentRound < questions.length - 1) {
        // Move to next question
        setCurrentRound(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // All questions answered, show game over
        setShowGameOver(true);
      }
    }, 3000); // Increased delay to allow reading feedback
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "Mindful Observation Game"}
        subtitle="Practice Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= Math.floor(totalLevels * 0.8)} // At least 80% correct
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">👁️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Mindful Observation Mastered!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've strengthened your presence by noticing details around you. Remember: practicing focus here improves attention with your child too.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> The ability to notice details calmly is the same ability to notice your child's subtle cues, expressions, and needs. When you train your mind to observe mindfully here, you bring that same focused presence to every interaction with your child. Mindful observation deepens connection.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Mindful Observation Game"}
      subtitle={`Question ${currentRound + 1} of ${totalLevels}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentRound + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={currentRound}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentRound + 1} of {totalLevels}</span>
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{Object.keys(answers).length} / {questions.length} answered</span>
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Question display */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Mindful Observation Question</h3>
            <p className="text-gray-700 text-lg">{currentQuestion.question}</p>
          </div>

          {!showFeedback && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span><strong>Reflect:</strong> Take a moment to honestly assess your mindful observation practices as a parent.</span>
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={!!selectedAnswer}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedAnswer === option.id
                        ? option.id === currentQuestion.correct 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600 shadow-lg' 
                          : 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-red-600 shadow-lg'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                        selectedAnswer === option.id
                          ? option.id === currentQuestion.correct
                            ? 'bg-white text-green-600'
                            : 'bg-white text-red-600'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium">{option.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className={`rounded-xl p-6 border-2 ${selectedAnswer === currentQuestion.correct ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {selectedAnswer === currentQuestion.correct ? 'Great Insight!' : 'Valuable Reflection'}
                </h3>
                <p className="text-gray-700">
                  {currentQuestion.feedback[selectedAnswer]}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Mindful Parenting Tip:</strong> Regular self-reflection on our mindful observation practices helps us grow in our ability to be present with our children.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default MindfulObservationGame;

