import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { BookOpen, Heart, Lightbulb, CheckCircle } from "lucide-react";

const DailyDeStressJournal = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-18";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentEntry, setCurrentEntry] = useState(0);
  const [journalEntries, setJournalEntries] = useState({});
  const [showInsight, setShowInsight] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Journal prompts for 5 days
  const journalPrompts = [
    {
      id: 1,
      title: "Day 1: Morning Stress",
      prompt: "Think about a stressful moment from this morning or recently.",
      eventHint: "What happened? (e.g., 'Morning rush, kids fighting, running late')",
      emotionHint: "What emotion did you feel? (e.g., 'Frustrated, overwhelmed, angry')",
      responseHint: "How did you respond? (e.g., 'I snapped, I took a breath, I walked away')",
      learningHint: "What did you learn? (e.g., 'I need to prepare the night before, I can pause before reacting')"
    },
    {
      id: 2,
      title: "Day 2: Work-Family Balance",
      prompt: "Reflect on a moment when work and family responsibilities collided.",
      eventHint: "What happened? (e.g., 'Work deadline during child's event, competing demands')",
      emotionHint: "What emotion did you feel? (e.g., 'Guilty, torn, anxious')",
      responseHint: "How did you respond? (e.g., 'I prioritized work, I communicated boundaries, I asked for help')",
      learningHint: "What did you learn? (e.g., 'I can't do everything, setting boundaries is important')"
    },
    {
      id: 3,
      title: "Day 3: Sibling Conflict",
      prompt: "Think about a recent conflict between your children that was stressful.",
      eventHint: "What happened? (e.g., 'Children fighting over a toy, physical altercation')",
      emotionHint: "What emotion did you feel? (e.g., 'Frustrated, helpless, angry')",
      responseHint: "How did you respond? (e.g., 'I yelled, I separated them, I helped them problem-solve')",
      learningHint: "What did you learn? (e.g., 'I can stay calm and help them resolve conflicts, I don't need to fix everything immediately')"
    },
    {
      id: 4,
      title: "Day 4: Parenting Doubt",
      prompt: "Reflect on a moment when you doubted your parenting abilities.",
      eventHint: "What happened? (e.g., 'Made a mistake, child's behavior, comparison to others')",
      emotionHint: "What emotion did you feel? (e.g., 'Self-doubt, shame, inadequacy')",
      responseHint: "How did you respond? (e.g., 'I criticized myself, I reached out for support, I practiced self-compassion')",
      learningHint: "What did you learn? (e.g., 'Everyone makes mistakes, I'm doing my best, I can repair and learn')"
    },
    {
      id: 5,
      title: "Day 5: Evening Overwhelm",
      prompt: "Think about a stressful moment from the evening routine.",
      eventHint: "What happened? (e.g., 'Bedtime resistance, unfinished tasks, exhaustion')",
      emotionHint: "What emotion did you feel? (e.g., 'Exhausted, overwhelmed, defeated')",
      responseHint: "How did you respond? (e.g., 'I pushed through, I adjusted expectations, I asked partner for help')",
      learningHint: "What did you learn? (e.g., 'I need to rest, I can't do everything, asking for help is okay')"
    }
  ];

  const handleInputChange = (field, value) => {
    setJournalEntries(prev => ({
      ...prev,
      [currentEntry]: {
        ...prev[currentEntry],
        [field]: value
      }
    }));
  };

  const generateInsight = (entry) => {
    const event = entry?.event || '';
    const emotion = entry?.emotion || '';
    const response = entry?.response || '';
    const learning = entry?.learning || '';

    // Analyze the entry to generate insights
    const insights = [];

    // Check for emotional awareness
    if (emotion.length > 10) {
      insights.push("You showed strong emotional awareness by identifying and naming your feelings.");
    }

    // Check for reflection on response
    if (response.toLowerCase().includes('pause') || response.toLowerCase().includes('breath') || 
        response.toLowerCase().includes('calm') || response.toLowerCase().includes('wait')) {
      insights.push("Your response shows self-regulation skills - you're learning to pause before reacting.");
    } else if (response.toLowerCase().includes('snap') || response.toLowerCase().includes('yell') ||
               response.toLowerCase().includes('angry') || response.toLowerCase().includes('reacted')) {
      insights.push("Noticing your reactive response is the first step. Next time, try pausing for 5 seconds before responding.");
    }

    // Check for learning mindset
    if (learning.length > 15) {
      insights.push("You're developing a growth mindset by reflecting on what you learned from the experience.");
    }

    // Check for self-compassion
    if (learning.toLowerCase().includes('okay') || learning.toLowerCase().includes('human') ||
        learning.toLowerCase().includes('best') || learning.toLowerCase().includes('normal')) {
      insights.push("You're showing self-compassion, which helps you grow without self-criticism.");
    }

    // Pattern recognition
    const allEntries = Object.values(journalEntries);
    const commonEmotions = allEntries.map(e => e?.emotion?.toLowerCase() || '').filter(Boolean);
    const mostCommonEmotion = commonEmotions.length > 0 
      ? commonEmotions.reduce((a, b, i, arr) => 
          arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
        )
      : null;

    let insightText = "Stress Insight:\n\n";
    
    if (insights.length > 0) {
      insightText += insights.join(" ") + "\n\n";
    }

    insightText += `Reflecting on your stressful moments helps you:\n`;
    insightText += `• Recognize patterns in your emotional responses\n`;
    insightText += `• Identify triggers before they escalate\n`;
    insightText += `• Learn from each experience to handle stress better\n`;
    insightText += `• Build emotional maturity through self-awareness\n`;

    if (mostCommonEmotion && allEntries.length >= 3) {
      insightText += `\nYou've noticed ${mostCommonEmotion} appearing frequently. `;
      insightText += `This awareness helps you prepare for and manage this emotion better.`;
    }

    insightText += `\n\nContinue journaling daily to build emotional intelligence and stress resilience.`;

    return insightText;
  };

  const handleNext = () => {
    const currentEntryData = journalEntries[currentEntry];
    if (currentEntryData?.event && currentEntryData?.emotion && 
        currentEntryData?.response && currentEntryData?.learning) {
      setScore(prev => prev + 1);
      setShowInsight(true);
    }
  };

  const handleContinue = () => {
    setShowInsight(false);
    if (currentEntry < totalLevels - 1) {
      setCurrentEntry(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentEntry(0);
    setJournalEntries({});
    setShowInsight(false);
    setScore(0);
    setShowGameOver(false);
  };

  const progress = ((currentEntry + 1) / totalLevels) * 100;
  const currentPrompt = journalPrompts[currentEntry];
  const currentEntryData = journalEntries[currentEntry] || {};
  const canProceed = currentEntryData?.event && currentEntryData?.emotion && 
                     currentEntryData?.response && currentEntryData?.learning;

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentEntry}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Entry {currentEntry + 1} of {totalLevels}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
            />
          </div>
        </div>

        {!showInsight ? (
          <>
            {/* Journal prompt */}
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-6 shadow-xl border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentPrompt.title}
                </h2>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                {currentPrompt.prompt}
              </p>
            </div>

            {/* Journal template */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Your Stress Reflection Journal
              </h3>

              {/* Event section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <label className="text-lg font-semibold text-gray-900">
                    Event: What happened?
                  </label>
                </div>
                <textarea
                  value={currentEntryData?.event || ''}
                  onChange={(e) => handleInputChange('event', e.target.value)}
                  placeholder={currentPrompt.eventHint}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-h-24 text-lg resize-none"
                />
              </div>

              {/* Emotion section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    Emotion: How did you feel?
                  </label>
                </div>
                <textarea
                  value={currentEntryData?.emotion || ''}
                  onChange={(e) => handleInputChange('emotion', e.target.value)}
                  placeholder={currentPrompt.emotionHint}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 min-h-24 text-lg resize-none"
                />
              </div>

              {/* Response section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <label className="text-lg font-semibold text-gray-900">
                    Response: How did you respond?
                  </label>
                </div>
                <textarea
                  value={currentEntryData?.response || ''}
                  onChange={(e) => handleInputChange('response', e.target.value)}
                  placeholder={currentPrompt.responseHint}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 min-h-24 text-lg resize-none"
                />
              </div>

              {/* Learning section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Learning: What did you learn?
                  </label>
                </div>
                <textarea
                  value={currentEntryData?.learning || ''}
                  onChange={(e) => handleInputChange('learning', e.target.value)}
                  placeholder={currentPrompt.learningHint}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 min-h-24 text-lg resize-none"
                />
              </div>

              {/* Completion indicator */}
              {canProceed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3"
                >
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="text-green-800 font-semibold">
                    All sections completed! Ready to generate your stress insight.
                  </p>
                </motion.div>
              )}

              {/* Generate insight button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={!canProceed}
                className={`w-full mt-6 px-6 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all ${
                  canProceed
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Generate Stress Insight
              </motion.button>
            </div>
          </>
        ) : (
          /* Stress Insight display */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Insight card */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-8 h-8 text-amber-600" />
                <h3 className="text-3xl font-bold text-gray-900">
                  Your Stress Insight
                </h3>
              </div>

              {/* Journal entry summary */}
              <div className="bg-white rounded-xl p-6 shadow-lg mb-6 space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">📝 Event:</h4>
                  <p className="text-gray-700">{currentEntryData.event}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">💭 Emotion:</h4>
                  <p className="text-gray-700">{currentEntryData.emotion}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">⚡ Response:</h4>
                  <p className="text-gray-700">{currentEntryData.response}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">✨ Learning:</h4>
                  <p className="text-gray-700">{currentEntryData.learning}</p>
                </div>
              </div>

              {/* Generated insight */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
                <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed font-medium">
                  {generateInsight(currentEntryData)}
                </pre>
              </div>
            </div>

            {/* Parent tip */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-sm text-blue-800 leading-relaxed text-center">
                <strong>💡 Parent Tip:</strong> Reviewing your responses builds emotional maturity. 
                Each time you reflect on how you handled stress, you're building self-awareness and emotional intelligence. 
                This practice helps you respond more skillfully to future challenges.
              </p>
            </div>

            {/* Continue button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {currentEntry < totalLevels - 1 ? 'Next Entry' : 'View Results'}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );

  return (
    <ParentGameShell
      gameId={gameId}
      gameData={gameData}
      totalCoins={totalCoins}
      totalLevels={totalLevels}
      currentLevel={currentEntry + 1}
      score={score}
      showGameOver={showGameOver}
      onRestart={handleRestart}
      progress={progress}
    >
      {gameContent}
    </ParentGameShell>
  );
};

export default DailyDeStressJournal;

