import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const MoodJournal = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-7";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentDay, setCurrentDay] = useState(0);
  const [moodEntries, setMoodEntries] = useState([]);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [reflection, setReflection] = useState("");
  const [showChart, setShowChart] = useState(false);

  // Available mood emojis with descriptions
  const moodEmojis = [
    { emoji: '😊', label: 'Happy', value: 5, color: 'from-yellow-400 to-orange-400' },
    { emoji: '😌', label: 'Calm', value: 4, color: 'from-blue-400 to-cyan-400' },
    { emoji: '😐', label: 'Neutral', value: 3, color: 'from-gray-400 to-gray-500' },
    { emoji: '😟', label: 'Worried', value: 2, color: 'from-orange-400 to-red-400' },
    { emoji: '😢', label: 'Sad', value: 1, color: 'from-blue-500 to-indigo-500' },
    { emoji: '😡', label: 'Angry', value: 1, color: 'from-red-500 to-rose-600' },
    { emoji: '😴', label: 'Tired', value: 2, color: 'from-purple-400 to-indigo-400' },
    { emoji: '🤗', label: 'Grateful', value: 5, color: 'from-green-400 to-emerald-400' },
    { emoji: '😰', label: 'Anxious', value: 1, color: 'from-amber-400 to-orange-500' },
    { emoji: '😎', label: 'Confident', value: 4, color: 'from-cyan-400 to-blue-400' },
    { emoji: '🙂', label: 'Content', value: 4, color: 'from-green-300 to-teal-400' },
    { emoji: '😔', label: 'Disappointed', value: 2, color: 'from-blue-400 to-indigo-400' }
  ];

  // Daily scenarios to help parents reflect
  const dailyScenarios = [
    {
      id: 1,
      day: "Monday",
      scenario: "You start the week feeling energized. The morning routine went smoothly, and your children seemed ready for the week ahead.",
      reflectionPrompt: "How did the start of your week make you feel?",
      parentTip: "Tracking your mood helps you notice patterns. Do Mondays tend to be energizing or draining for you?"
    },
    {
      id: 2,
      day: "Tuesday",
      scenario: "Mid-week brings challenges. A work deadline, your child's meltdown, and unexpected expenses all hit at once.",
      reflectionPrompt: "When multiple stressors pile up, what emotions do you notice?",
      parentTip: "Difficult days are normal. Journaling helps you process emotions rather than bottling them up."
    },
    {
      id: 3,
      day: "Wednesday",
      scenario: "Today felt more balanced. You took a moment to breathe, asked for help when needed, and felt proud of how you handled a tricky situation.",
      reflectionPrompt: "What moments today made you feel capable or proud?",
      parentTip: "Noticing positive moments, even small ones, builds emotional awareness and gratitude."
    },
    {
      id: 4,
      day: "Thursday",
      scenario: "You're feeling tired and overwhelmed. The week's demands are catching up, and you're running on empty.",
      reflectionPrompt: "When you feel exhausted, what emotions come up?",
      parentTip: "Tiredness often amplifies difficult emotions. Recognizing this helps you respond with self-compassion."
    },
    {
      id: 5,
      day: "Friday",
      scenario: "The week ends with a mix of relief and reflection. You survived the challenges and found moments of connection with your family.",
      reflectionPrompt: "Looking back at the week, what emotions stand out?",
      parentTip: "Weekly reflection helps you see the bigger picture. Not every day will be perfect, and that's okay."
    }
  ];

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    // Award points for engaging with the activity
    if (!moodEntries[currentDay]) {
      setScore(prev => prev + 1);
    }
  };

  const handleReflectionChange = (e) => {
    setReflection(e.target.value);
  };

  const handleDayComplete = () => {
    if (!selectedEmoji || !reflection.trim()) {
      alert("Please select a mood emoji and write a short reflection before continuing.");
      return;
    }

    const newEntry = {
      day: currentDay + 1,
      dayName: dailyScenarios[currentDay].day,
      emoji: selectedEmoji,
      reflection: reflection,
      timestamp: new Date().toISOString()
    };

    const updatedEntries = [...moodEntries, newEntry];
    setMoodEntries(updatedEntries);

    // Reset for next day
    setSelectedEmoji(null);
    setReflection("");

    // Move to next day or show chart
    if (currentDay < dailyScenarios.length - 1) {
      setCurrentDay(currentDay + 1);
    } else {
      // All days completed - show chart
      setShowChart(true);
      setTimeout(() => {
        setShowGameOver(true);
      }, 5000); // Show chart for 5 seconds before game over
    }
  };

  const renderMoodChart = () => {
    if (!moodEntries.length) return null;

    const maxValue = 5;
    const chartHeight = 200;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Your Weekly Mood Pattern
        </h3>
        
        <div className="relative" style={{ height: `${chartHeight + 60}px` }}>
          {/* Chart bars */}
          <div className="flex items-end justify-between h-full gap-2">
            {moodEntries.map((entry, index) => {
              const heightPercentage = (entry.emoji.value / maxValue) * 100;
              const barHeight = (heightPercentage / 100) * chartHeight;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: `${chartHeight}px` }}>
                    <div
                      className={`w-full bg-gradient-to-t ${entry.emoji.color} rounded-t-lg shadow-md transition-all hover:scale-105 cursor-pointer relative group`}
                      style={{ height: `${barHeight}px`, minHeight: '20px' }}
                      title={`${entry.dayName}: ${entry.emoji.label}`}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-2xl">{entry.emoji.emoji}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-semibold text-gray-600">{entry.dayName.slice(0, 3)}</p>
                    <p className="text-lg">{entry.emoji.emoji}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
          <h4 className="font-bold text-blue-800 mb-3 text-lg">📊 Mood Insights</h4>
          <div className="space-y-2 text-sm text-blue-700">
            {generateMoodInsights()}
          </div>
        </div>

        {/* Reflection Summary */}
        <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
          <h4 className="font-bold text-green-800 mb-3 text-lg">📝 Your Weekly Reflections</h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {moodEntries.map((entry, index) => (
              <div key={index} className="bg-white/60 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{entry.emoji.emoji}</span>
                  <span className="font-semibold text-sm text-gray-700">{entry.dayName}</span>
                </div>
                <p className="text-xs text-gray-600 italic">"{entry.reflection}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const generateMoodInsights = () => {
    if (moodEntries.length === 0) return null;

    const avgMood = moodEntries.reduce((sum, entry) => sum + entry.emoji.value, 0) / moodEntries.length;
    const highMoodDays = moodEntries.filter(e => e.emoji.value >= 4).length;
    const lowMoodDays = moodEntries.filter(e => e.emoji.value <= 2).length;

    const insights = [];

    if (avgMood >= 4) {
      insights.push("✨ You experienced mostly positive emotions this week. Notice what contributed to these feelings.");
    } else if (avgMood >= 3) {
      insights.push("📈 Your week had a mix of emotions. This balance is normal and healthy.");
    } else {
      insights.push("💙 You had some challenging days this week. Remember, difficult emotions are valid and temporary.");
    }

    if (highMoodDays > lowMoodDays) {
      insights.push("🌟 You had more high-mood days than low-mood days. Celebrate these wins!");
    } else if (lowMoodDays > 0) {
      insights.push("🌱 Tracking difficult days helps you recognize patterns and plan for self-care.");
    }

    insights.push("💡 Sharing positive trends with your family builds emotional openness and connection.");

    return insights.map((insight, index) => (
      <p key={index} className="flex items-start gap-2">
        <span className="flex-shrink-0">{insight.split(' ')[0]}</span>
        <span>{insight.substring(insight.indexOf(' ') + 1)}</span>
      </p>
    ));
  };

  const currentScenario = dailyScenarios[currentDay];

  return (
    <ParentGameShell
      title={gameData?.title || "Mood Journal"}
      subtitle={gameData?.description || "Track daily emotions to discover mood patterns"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentDay}
    >
      {showChart ? (
        <div className="w-full max-w-5xl mx-auto px-4">
          {renderMoodChart()}
        </div>
      ) : currentDay < dailyScenarios.length ? (
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Day {currentDay + 1} of {dailyScenarios.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Entries: {moodEntries.length}/{dailyScenarios.length}
                </span>
              </div>
            </div>

            {/* Day Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {currentScenario.day}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto rounded-full"></div>
            </div>

            {/* Scenario Description */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {currentScenario.scenario}
                </p>
                <p className="text-base font-semibold text-blue-800 italic">
                  {currentScenario.reflectionPrompt}
                </p>
              </div>
            </div>

            {/* Emoji Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                How are you feeling today?
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {moodEmojis.map((mood, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiSelect(mood)}
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-110 hover:shadow-lg ${
                      selectedEmoji && selectedEmoji.emoji === mood.emoji
                        ? `bg-gradient-to-br ${mood.color} border-gray-800 shadow-lg scale-110`
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-4xl mb-2">{mood.emoji}</div>
                    <div className="text-xs font-medium text-gray-700">{mood.label}</div>
                  </button>
                ))}
              </div>
              {selectedEmoji && (
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold text-gray-700">
                    Selected: {selectedEmoji.emoji} {selectedEmoji.label}
                  </p>
                </div>
              )}
            </div>

            {/* Reflection Input */}
            <div className="mb-6">
              <label className="block text-lg font-bold text-gray-800 mb-3">
                Write a short reflection (2-3 sentences):
              </label>
              <textarea
                value={reflection}
                onChange={handleReflectionChange}
                placeholder="What contributed to this feeling? What do you notice about your emotions today?"
                className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none text-gray-700"
              />
              <p className="mt-2 text-sm text-gray-500">
                {reflection.length} characters
              </p>
            </div>

            {/* Parent Tip */}
            <div className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-xs font-semibold text-green-800 mb-1">Parent Tip:</p>
                  <p className="text-sm text-green-700">
                    {currentScenario.parentTip}
                  </p>
                </div>
              </div>
            </div>

            {/* Complete Day Button */}
            <button
              onClick={handleDayComplete}
              disabled={!selectedEmoji || !reflection.trim()}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                selectedEmoji && reflection.trim()
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentDay < dailyScenarios.length - 1 ? 'Save Entry & Continue' : 'Complete Journal & View Chart'}
            </button>
          </div>
        </div>
      ) : null}
    </ParentGameShell>
  );
};

export default MoodJournal;

