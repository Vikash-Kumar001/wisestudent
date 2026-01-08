import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const ClassroomEmotions = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-1";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const allScenarios = [
    {
      id: 1,
      title: "Disruptive Student Scenario",
      description: "During your math lesson, a student is constantly talking, distracting others, and refusing to follow instructions. You've redirected them twice already, and the class is getting restless.",
      options: [
        "Annoyed and Impatient",
        "Calm and Understanding",
        "Frustrated and Overwhelmed",
        "Indifferent and Unaffected"
      ],
      correct: 2, // Frustrated and Overwhelmed
      reflection: "Recognizing you feel 'Frustrated and Overwhelmed' helps you pause before reacting. Naming this emotion allows you to respond thoughtfully rather than escalating the situation. When you label your feeling, you can choose a calm response that maintains classroom management while addressing the student's needs.",
      teacherTip: "Naming emotions reduces reactive behavior. When you label your frustration, you create space to choose your response. You might say to yourself: 'I'm feeling frustrated. Let me take a breath and use a calm redirect strategy.'"
    },
    {
      id: 2,
      title: "Heavy Workload Scenario",
      description: "You've just received urgent grading requests for three classes, a parent meeting is scheduled for this afternoon, and you have lesson plans due. Your students are asking questions, and you feel pulled in multiple directions.",
      options: [
        "Energetic and Motivated",
        "Stressed and Pressured",
        "Excited and Challenged",
        "Relaxed and Unconcerned"
      ],
      correct: 1, // Stressed and Pressured
      reflection: "Acknowledging you feel 'Stressed and Pressured' helps you communicate your needs clearly. You can say to your students: 'I'm feeling a bit overwhelmed right now. Let me finish this task, then I'll be fully present for your questions.' This models emotional awareness and sets healthy boundaries.",
      teacherTip: "When you name your stress, you can prioritize tasks and ask for help. Your students learn that it's okay to feel overwhelmed and that they can also ask for support when needed."
    },
    {
      id: 3,
      title: "Student Conflict Scenario",
      description: "Two students in your class are having a heated argument during group work. The tension is affecting the whole classroom. You notice other students are uncomfortable, and the situation feels unresolved.",
      options: [
        "Peaceful and Content",
        "Concerned and Alert",
        "Angry and Resentful",
        "Hopeful and Optimistic"
      ],
      correct: 1, // Concerned and Alert
      reflection: "Identifying you feel 'Concerned and Alert' helps you approach the situation with care. You can say to yourself: 'I'm feeling concerned about this conflict. Let me create a safe space to address it calmly.' Naming the emotion helps you respond thoughtfully rather than reactively.",
      teacherTip: "Naming your concern helps you address student conflicts with empathy. When you recognize your emotional state, you can create a supportive environment for conflict resolution and model healthy communication for your students."
    },
    {
      id: 4,
      title: "Breakthrough Moment Scenario",
      description: "A student who has been struggling with reading suddenly reads a complete sentence independently. The whole class celebrates, and you see the joy and pride on the student's face. The classroom feels warm and connected.",
      options: [
        "Anxious and Worried",
        "Joyful and Proud",
        "Bored and Disinterested",
        "Irritated and Impatient"
      ],
      correct: 1, // Joyful and Proud
      reflection: "Recognizing you feel 'Joyful and Proud' helps you savor this teaching moment. You can say: 'I'm feeling so proud of this student's progress and joyful about this breakthrough.' This reinforces positive classroom culture and teaches students to appreciate their achievements.",
      teacherTip: "Naming positive emotions like 'joy' and 'pride' helps you celebrate student successes authentically. When you express these emotions, students learn to recognize and express their own achievements, strengthening classroom community."
    },
    {
      id: 5,
      title: "Parent Meeting Scenario",
      description: "You're meeting with a parent who is upset about their child's grade. The parent is questioning your teaching methods and seems defensive. You prepared well, but the conversation feels tense and confrontational.",
      options: [
        "Confident and Prepared",
        "Nervous and Defensive",
        "Angry and Critical",
        "Calm and Empathetic"
      ],
      correct: 3, // Calm and Empathetic
      reflection: "Acknowledging you feel 'Nervous and Defensive' (a natural response) helps you choose to respond with 'Calm and Empathetic' instead. You can say to yourself: 'I notice I'm feeling defensive. Let me take a breath and listen to the parent's concerns with empathy.' This allows you to build understanding rather than escalate tension.",
      teacherTip: "Recognizing your defensive feelings helps you respond with empathy. When you name your emotions, you can choose a calm approach that validates the parent's concerns while maintaining professional boundaries. This models emotional regulation for all involved."
    }
  ];

  // Use first 5 scenarios for this game (as per game structure requirement)
  const scenarios = allScenarios.slice(0, 5);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newSelectedAnswers = { ...selectedAnswers, [questionIndex]: optionIndex };
    setSelectedAnswers(newSelectedAnswers);

    // Check if answer is correct
    if (optionIndex === scenarios[questionIndex].correct) {
      setScore(prev => prev + 1);
    }

    // Move to next question after a short delay
    setTimeout(() => {
      if (questionIndex < scenarios.length - 1) {
        setCurrentQuestion(questionIndex + 1);
      } else {
        // All questions answered
        setShowGameOver(true);
      }
    }, 2000); // 2 second delay to show reflection
  };

  const getOptionStyle = (questionIndex, optionIndex) => {
    const selected = selectedAnswers[questionIndex] === optionIndex;
    const isCorrect = optionIndex === scenarios[questionIndex].correct;
    const isSelected = selected;
    const showFeedback = isSelected;

    let backgroundColor = "bg-white";
    let borderColor = "border-gray-300";
    let textColor = "text-gray-700";

    if (showFeedback) {
      if (isCorrect) {
        backgroundColor = "bg-green-50";
        borderColor = "border-green-500";
        textColor = "text-green-700";
      } else {
        backgroundColor = "bg-red-50";
        borderColor = "border-red-500";
        textColor = "text-red-700";
      }
    } else if (selected) {
      backgroundColor = "bg-blue-50";
      borderColor = "border-blue-500";
      textColor = "text-blue-700";
    }

    return `${backgroundColor} ${borderColor} ${textColor}`;
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Classroom Emotions"}
      subtitle={gameData?.description || "Recognize and label emotions in classroom situations"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion}
    >
      {currentQuestion < scenarios.length ? (
        <div className="w-full max-w-3xl mx-auto px-4">
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
                {scenarios[currentQuestion].title}
              </h3>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {scenarios[currentQuestion].description}
                </p>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              What emotion are you feeling in this situation?
            </h2>

            <div className="space-y-4 mb-6">
              {scenarios[currentQuestion].options.map((option, optionIndex) => {
                const isSelected = selectedAnswers[currentQuestion] === optionIndex;
                const isCorrect = optionIndex === scenarios[currentQuestion].correct;
                const showFeedback = isSelected;

                return (
                  <button
                    key={optionIndex}
                    onClick={() => !selectedAnswers[currentQuestion] && handleAnswerSelect(currentQuestion, optionIndex)}
                    disabled={!!selectedAnswers[currentQuestion]}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      getOptionStyle(currentQuestion, optionIndex)
                    } ${
                      selectedAnswers[currentQuestion] ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showFeedback && (
                        <span className="text-xl">
                          {isCorrect ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reflection Message */}
            {selectedAnswers[currentQuestion] !== undefined && (
              <div className={`mt-6 p-4 rounded-xl border-2 ${
                selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                  ? 'bg-green-50 border-green-200'
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`text-2xl flex-shrink-0 ${
                    selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}>
                    {selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct ? '💡' : '📝'}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold mb-2 ${
                      selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                        ? 'text-green-800'
                        : 'text-orange-800'
                    }`}>
                      {selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                        ? 'Reflection'
                        : 'Learning Moment'}
                    </h4>
                    <p className={`text-sm leading-relaxed mb-2 ${
                      selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                        ? 'text-green-700'
                        : 'text-orange-700'
                    }`}>
                      {scenarios[currentQuestion].reflection}
                    </p>
                    <div className="bg-white/60 rounded-lg p-3 mt-3 border border-purple-200">
                      <p className="text-xs font-semibold text-purple-800 mb-1">Teacher Tip:</p>
                      <p className="text-xs text-purple-700">
                        {scenarios[currentQuestion].teacherTip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </TeacherGameShell>
  );
};

export default ClassroomEmotions;

