import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const StressResponse = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-2";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedBodyParts, setSelectedBodyParts] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Body parts that can be selected
  const bodyParts = [
    { id: 'head', label: 'Head', emoji: '🧠', position: { top: '5%', left: '50%' } },
    { id: 'neck', label: 'Neck', emoji: '👤', position: { top: '15%', left: '50%' } },
    { id: 'shoulders', label: 'Shoulders', emoji: '💪', position: { top: '20%', left: '50%' } },
    { id: 'chest', label: 'Chest', emoji: '❤️', position: { top: '30%', left: '50%' } },
    { id: 'stomach', label: 'Stomach', emoji: '🫀', position: { top: '45%', left: '50%' } },
    { id: 'hands', label: 'Hands', emoji: '✋', position: { top: '25%', left: '25%' } },
    { id: 'hands-right', label: 'Hands', emoji: '✋', position: { top: '25%', left: '75%' } },
    { id: 'back', label: 'Back', emoji: '🦴', position: { top: '35%', left: '50%' } },
    { id: 'legs', label: 'Legs', emoji: '🦵', position: { top: '60%', left: '50%' } },
  ];

  const scenarios = [
    {
      id: 1,
      title: "Difficult Parent Meeting",
      description: "You have a parent-teacher conference scheduled in 10 minutes with a parent known for being demanding. You're reviewing student work, preparing talking points, and feeling the pressure to address all concerns professionally.",
      question: "Where in your body do you feel tension or stress right now?",
      correctParts: ['shoulders', 'neck', 'head'], // Common stress areas
      reflection: "Noticing tension in your shoulders, neck, or head is a signal that stress is building. When you identify where tension lives in your body, you can take action: take 3 slow deep breaths, roll your shoulders, or gently stretch your neck. This physical awareness helps you respond to stress before it escalates.",
      teacherTip: "Notice tension early and release it with slow breathing. When you feel stress in your body, pause and take 3 deep breaths. This simple act can prevent overreaction and help you maintain professional composure during challenging conversations."
    },
    {
      id: 2,
      title: "Classroom Management Challenge",
      description: "Your class has been particularly disruptive today. Despite multiple redirects, students are off-task, talking, and not engaging with the lesson. You're trying to maintain control while feeling your effectiveness slipping away.",
      question: "Where do you feel the emotional weight in your body?",
      correctParts: ['chest', 'stomach', 'shoulders'],
      reflection: "Emotional stress often manifests in the chest (tightness), stomach (butterflies or knots), or shoulders (carrying the weight). Recognizing these physical signals helps you understand that your body is responding to classroom stress. You can say to yourself: 'I'm feeling this in my chest. Let me take a moment to breathe and reset.'",
      teacherTip: "Body awareness helps you separate emotional reactions from teaching responses. When you notice tension in your chest or stomach, take slow, deep breaths. This calms your nervous system and gives you space to choose effective classroom management strategies."
    },
    {
      id: 3,
      title: "Observation Day Stress",
      description: "Your principal is observing your lesson today. You've prepared thoroughly, but students are more restless than usual. You're trying to implement all the strategies you planned while managing unexpected student behaviors.",
      question: "What physical sensations do you notice in your body?",
      correctParts: ['hands', 'chest', 'neck'],
      reflection: "Performance stress often shows up as clenched hands, a racing heart (chest), or a tight neck. These are your body's signals that you're feeling evaluated and pressured. Acknowledging these sensations helps you stay grounded. You can practice: 'I notice my hands are clenched. Let me release them and breathe.'",
      teacherTip: "Physical awareness during high-pressure moments helps you stay present. When you notice your body reacting (clenched hands, tight chest), take a moment to release the tension. This prevents you from overthinking and helps you focus on connecting with your students."
    },
    {
      id: 4,
      title: "Successful Teaching Moment",
      description: "You've just finished a lesson where every student was engaged, asking thoughtful questions, and genuinely understanding the material. The classroom atmosphere was positive, and you feel like you're making a real impact.",
      question: "Where in your body do you feel lightness or satisfaction?",
      correctParts: ['chest', 'shoulders', 'stomach'],
      reflection: "Satisfaction and success often feel like openness in the chest, relaxed shoulders, or a settled stomach. Noticing these positive sensations helps you recognize when you're in a good teaching state. You can practice: 'I feel satisfied in my chest and shoulders. This is what effective teaching feels like in my body.' This awareness helps you return to this state when stress arises.",
      teacherTip: "Recognizing positive sensations in your body helps you recreate them. When you notice lightness in your chest or relaxed shoulders, remember this feeling. You can return to this state with slow breathing and by focusing on student connection."
    },
    {
      id: 5,
      title: "End of Week Exhaustion",
      description: "It's Friday afternoon, and you've taught five classes, attended two meetings, graded assignments, and managed multiple student issues throughout the week. You haven't had time to eat properly, and you feel completely drained. Your body feels heavy.",
      question: "Where do you feel the exhaustion or heaviness?",
      correctParts: ['legs', 'back', 'shoulders'],
      reflection: "Exhaustion often shows up as heaviness in the legs, tension in the back, or weight in the shoulders. These physical signals tell you that your body needs rest and recovery. Acknowledging this helps you prioritize self-care. You can say: 'I feel heavy in my legs and back. I need to rest this weekend and set boundaries for next week.'",
      teacherTip: "Body awareness helps you recognize when you need support. When you notice heaviness or exhaustion in your body, it's a signal to rest, delegate tasks, or ask for help. Taking care of yourself allows you to be fully present for your students."
    }
  ];

  const handleBodyPartClick = (partId) => {
    const currentScenario = scenarios[currentQuestion];
    
    // Track selected parts for this question
    const questionKey = `q${currentQuestion}`;
    const currentSelections = selectedBodyParts[questionKey] || [];
    
    if (!currentSelections.includes(partId)) {
      const newSelections = [...currentSelections, partId];
      setSelectedBodyParts({
        ...selectedBodyParts,
        [questionKey]: newSelections
      });

      // Check if at least one correct part was selected
      const hasCorrectPart = newSelections.some(sel => currentScenario.correctParts.includes(sel));
      if (hasCorrectPart && !selectedBodyParts[questionKey]?.some(sel => currentScenario.correctParts.includes(sel))) {
        setScore(prev => prev + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const currentScenario = scenarios[currentQuestion];
  const questionKey = `q${currentQuestion}`;
  const selectedParts = selectedBodyParts[questionKey] || [];
  const hasSelectedCorrect = selectedParts.some(part => currentScenario.correctParts.includes(part));

  return (
    <TeacherGameShell
      title={gameData?.title || "Stress Response"}
      subtitle={gameData?.description || "Observe how your body signals stress or satisfaction in teaching"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion}
    >
      {currentQuestion < scenarios.length ? (
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Scenario {currentQuestion + 1} of {scenarios.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Score: {score}/{scenarios.length}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-700 mb-3">
                {currentScenario.title}
              </h3>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {currentScenario.description}
                </p>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              {currentScenario.question}
            </h2>

            {/* Body Outline */}
            <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 mb-6 min-h-[500px] flex items-center justify-center border-2 border-purple-200">
              <div className="relative w-full max-w-md">
                {/* Body outline SVG-style using divs */}
                <div className="relative mx-auto" style={{ width: '180px', height: '480px' }}>
                  {/* Head */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full border-3 border-purple-400 shadow-md"></div>
                  {/* Neck */}
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-2 border-purple-400"></div>
                  {/* Torso */}
                  <div className="absolute top-22 left-1/2 transform -translate-x-1/2 w-28 h-44 bg-white rounded-lg border-3 border-purple-400 shadow-md"></div>
                  {/* Left Arm */}
                  <div className="absolute top-26 left-1/2 transform -translate-x-18 w-12 h-28 bg-white rounded-lg border-3 border-purple-400 shadow-md"></div>
                  {/* Right Arm */}
                  <div className="absolute top-26 left-1/2 transform translate-x-18 w-12 h-28 bg-white rounded-lg border-3 border-purple-400 shadow-md"></div>
                  {/* Left Leg */}
                  <div className="absolute top-66 left-1/2 transform -translate-x-6 w-10 h-36 bg-white rounded-lg border-3 border-purple-400 shadow-md"></div>
                  {/* Right Leg */}
                  <div className="absolute top-66 left-1/2 transform translate-x-6 w-10 h-36 bg-white rounded-lg border-3 border-purple-400 shadow-md"></div>
                </div>

                {/* Clickable body part markers with better positioning */}
                <button
                  onClick={() => handleBodyPartClick('head')}
                  className={`absolute top-8 left-1/2 transform -translate-x-1/2 transition-all ${
                    selectedParts.includes('head')
                      ? currentScenario.correctParts.includes('head')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-purple-200 text-gray-700'
                  } rounded-full w-14 h-14 flex items-center justify-center border-2 ${
                    selectedParts.includes('head')
                      ? currentScenario.correctParts.includes('head')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                  } shadow-lg cursor-pointer z-10`}
                  title="Head"
                >
                  <span className="text-2xl">🧠</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('neck')}
                  className={`absolute top-20 left-1/2 transform -translate-x-1/2 transition-all ${
                    selectedParts.includes('neck')
                      ? currentScenario.correctParts.includes('neck')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-purple-200 text-gray-700'
                  } rounded-full w-14 h-14 flex items-center justify-center border-2 ${
                    selectedParts.includes('neck')
                      ? currentScenario.correctParts.includes('neck')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                  } shadow-lg cursor-pointer z-10`}
                  title="Neck"
                >
                  <span className="text-2xl">👤</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('shoulders')}
                  className={`absolute top-28 left-1/2 transform -translate-x-1/2 transition-all ${
                    selectedParts.includes('shoulders')
                      ? currentScenario.correctParts.includes('shoulders')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-purple-200 text-gray-700'
                  } rounded-full w-14 h-14 flex items-center justify-center border-2 ${
                    selectedParts.includes('shoulders')
                      ? currentScenario.correctParts.includes('shoulders')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                  } shadow-lg cursor-pointer z-10`}
                  title="Shoulders"
                >
                  <span className="text-2xl">💪</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('chest')}
                  className={`absolute top-40 left-1/2 transform -translate-x-1/2 transition-all ${
                    selectedParts.includes('chest')
                      ? currentScenario.correctParts.includes('chest')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-purple-200 text-gray-700'
                  } rounded-full w-14 h-14 flex items-center justify-center border-2 ${
                    selectedParts.includes('chest')
                      ? currentScenario.correctParts.includes('chest')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                  } shadow-lg cursor-pointer z-10`}
                  title="Chest"
                >
                  <span className="text-2xl">❤️</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('stomach')}
                  className={`absolute top-56 left-1/2 transform -translate-x-1/2 transition-all ${
                    selectedParts.includes('stomach')
                      ? currentScenario.correctParts.includes('stomach')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-purple-200 text-gray-700'
                  } rounded-full w-14 h-14 flex items-center justify-center border-2 ${
                    selectedParts.includes('stomach')
                      ? currentScenario.correctParts.includes('stomach')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                  } shadow-lg cursor-pointer z-10`}
                  title="Stomach"
                >
                  <span className="text-2xl">🫀</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('hands')}
                  className={`absolute top-36 left-1/4 transform -translate-x-1/2 transition-all ${
                    selectedParts.includes('hands')
                      ? currentScenario.correctParts.includes('hands')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-purple-200 text-gray-700'
                  } rounded-full w-14 h-14 flex items-center justify-center border-2 ${
                    selectedParts.includes('hands')
                      ? currentScenario.correctParts.includes('hands')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                  } shadow-lg cursor-pointer z-10`}
                  title="Hands"
                >
                  <span className="text-2xl">✋</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('back')}
                  className={`absolute top-48 left-1/2 transform -translate-x-1/2 transition-all ${
                    selectedParts.includes('back')
                      ? currentScenario.correctParts.includes('back')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-purple-200 text-gray-700'
                  } rounded-full w-14 h-14 flex items-center justify-center border-2 ${
                    selectedParts.includes('back')
                      ? currentScenario.correctParts.includes('back')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                  } shadow-lg cursor-pointer z-10`}
                  title="Back"
                >
                  <span className="text-2xl">🦴</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('legs')}
                  className={`absolute top-80 left-1/2 transform -translate-x-1/2 transition-all ${
                    selectedParts.includes('legs')
                      ? currentScenario.correctParts.includes('legs')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-purple-200 text-gray-700'
                  } rounded-full w-14 h-14 flex items-center justify-center border-2 ${
                    selectedParts.includes('legs')
                      ? currentScenario.correctParts.includes('legs')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                  } shadow-lg cursor-pointer z-10`}
                  title="Legs"
                >
                  <span className="text-2xl">🦵</span>
                </button>
              </div>
            </div>

            {/* Selected parts display */}
            {selectedParts.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-2">You selected:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedParts.map(partId => {
                    const part = bodyParts.find(p => p.id === partId);
                    const isCorrect = currentScenario.correctParts.includes(partId);
                    return (
                      <span
                        key={partId}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isCorrect
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}
                      >
                        {part?.emoji} {part?.label} {isCorrect ? '✓' : '✗'}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reflection Message */}
            {selectedParts.length > 0 && (
              <div className={`mt-6 p-4 rounded-xl border-2 ${
                hasSelectedCorrect
                  ? 'bg-green-50 border-green-200'
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`text-2xl flex-shrink-0 ${
                    hasSelectedCorrect
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}>
                    {hasSelectedCorrect ? '💡' : '📝'}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold mb-2 ${
                      hasSelectedCorrect
                        ? 'text-green-800'
                        : 'text-orange-800'
                    }`}>
                      {hasSelectedCorrect
                        ? 'Reflection'
                        : 'Learning Moment'}
                    </h4>
                    <p className={`text-sm leading-relaxed mb-2 ${
                      hasSelectedCorrect
                        ? 'text-green-700'
                        : 'text-orange-700'
                    }`}>
                      {currentScenario.reflection}
                    </p>
                    <div className="bg-white/60 rounded-lg p-3 mt-3 border border-purple-200">
                      <p className="text-xs font-semibold text-purple-800 mb-1">Teacher Tip:</p>
                      <p className="text-xs text-purple-700">
                        {currentScenario.teacherTip}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {currentQuestion < scenarios.length - 1 ? 'Next Scenario' : 'Finish Game'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </TeacherGameShell>
  );
};

export default StressResponse;

