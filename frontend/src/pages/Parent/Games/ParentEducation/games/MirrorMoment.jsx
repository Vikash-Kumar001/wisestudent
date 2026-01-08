import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const MirrorMoment = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-8";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentMoment, setCurrentMoment] = useState(0);
  const [emotionText, setEmotionText] = useState("");
  const [showReflection, setShowReflection] = useState(false);
  const [selfRating, setSelfRating] = useState(null);
  const [completedMoments, setCompletedMoments] = useState([]);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Empathy reflection messages based on common emotional expressions
  const generateEmpathyReflection = (emotionText, scenario) => {
    const lowerText = emotionText.toLowerCase();
    
    // Pattern matching for different emotion types
    if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('mad')) {
      return {
        message: "I hear your frustration, and it's completely understandable. Anger often signals that something important to you feels threatened or ignored. Your feelings are valid, and recognizing them is the first step toward addressing what's really underneath.",
        emoji: "💪",
        tone: "supportive"
      };
    }
    if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('hurt') || lowerText.includes('disappointed')) {
      return {
        message: "I see your sadness, and I'm here with you. It takes courage to acknowledge difficult feelings. Remember that sadness is a natural response to loss, disappointment, or pain. You don't have to rush through it—giving yourself space to feel is self-compassion.",
        emoji: "🤗",
        tone: "compassionate"
      };
    }
    if (lowerText.includes('overwhelmed') || lowerText.includes('stressed') || lowerText.includes('too much') || lowerText.includes('exhausted')) {
      return {
        message: "You're carrying a lot right now, and it makes sense that you feel overwhelmed. Taking a moment to name these feelings is powerful—it helps release some of the pressure. You're doing your best, and that's enough.",
        emoji: "🌊",
        tone: "calming"
      };
    }
    if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('nervous') || lowerText.includes('afraid')) {
      return {
        message: "Your anxiety is real, and I understand how heavy that feels. Anxiety often comes from caring deeply about things that matter. You've taken a brave step by expressing it. Remember, this feeling will pass, and you have tools to support yourself through it.",
        emoji: "🦋",
        tone: "reassuring"
      };
    }
    if (lowerText.includes('guilty') || lowerText.includes('shame') || lowerText.includes('bad parent')) {
      return {
        message: "I hear the weight of guilt and self-judgment. Parenting is hard, and everyone makes mistakes. What matters is your willingness to learn and grow. You're human, and that's okay. Your love and effort count for so much.",
        emoji: "💙",
        tone: "forgiving"
      };
    }
    if (lowerText.includes('lonely') || lowerText.includes('alone') || lowerText.includes('isolated')) {
      return {
        message: "Loneliness can feel especially heavy when you're giving so much to others. Your need for connection and support is real and valid. Reaching out, even through words like this, is a step toward connection. You're not as alone as you might feel.",
        emoji: "🌟",
        tone: "connecting"
      };
    }
    if (lowerText.includes('grateful') || lowerText.includes('thankful') || lowerText.includes('blessed') || lowerText.includes('happy')) {
      return {
        message: "How beautiful that you're noticing moments of gratitude and joy. Celebrating these feelings strengthens them and helps you hold onto them during harder times. Thank you for sharing this light—it reminds us all of the good that exists even in challenging seasons.",
        emoji: "✨",
        tone: "celebrating"
      };
    }
    if (lowerText.includes('confused') || lowerText.includes('uncertain') || lowerText.includes('unsure')) {
      return {
        message: "It's okay to not have all the answers. Uncertainty is part of the parenting journey, and acknowledging it shows wisdom rather than weakness. Trust that you're learning as you go, and that's exactly how it's meant to be.",
        emoji: "🧭",
        tone: "encouraging"
      };
    }
    
    // Default empathetic response
    return {
      message: "Thank you for sharing what you're feeling. Expressing emotions, especially difficult ones, takes courage and self-awareness. Your feelings are valid, and giving them voice is a powerful act of self-care. You're not alone in this journey.",
      emoji: "💜",
      tone: "empathetic"
    };
  };

  // Reflection moments/scenarios
  const mirrorMoments = [
    {
      id: 1,
      title: "End of a Long Day",
      prompt: "After a challenging day of parenting, work, and responsibilities, take a moment to express what you're feeling right now. Speak or type whatever comes up—no judgment, just release.",
      scenario: "It's evening, and you've been 'on' all day. Kids are finally in bed, dishes are done, but you haven't had a moment for yourself. What emotions are sitting with you right now?",
      parentTip: "Voice release reduces bottled stress. Try expressing feelings aloud before sleep—even quietly to yourself—to release tension and clear your mind."
    },
    {
      id: 2,
      title: "After a Parenting Mistake",
      prompt: "You lost your temper or made a decision you regret. Instead of burying the feeling, let it out. What's going on inside?",
      scenario: "You said something harsh or reacted in a way that doesn't align with the parent you want to be. Guilt, shame, or frustration might be swirling. Express what you're feeling.",
      parentTip: "Speaking feelings aloud helps process guilt and move toward repair. Saying 'I feel guilty about...' is the first step in making things right."
    },
    {
      id: 3,
      title: "Feeling Overwhelmed",
      prompt: "Everything feels like too much right now. Don't hold it in—let the overwhelm have a voice. What's weighing on you?",
      scenario: "Too many demands, too little time, too much pressure. The to-do list feels endless, and you're running on empty. What emotions are underneath the overwhelm?",
      parentTip: "Naming overwhelm out loud helps break its power. Try: 'I'm feeling overwhelmed by...' This simple act can create space for clarity and next steps."
    },
    {
      id: 4,
      title: "Moment of Gratitude",
      prompt: "Not all mirror moments are heavy. Share something you're feeling grateful for or a moment of joy you noticed today.",
      scenario: "Amid the challenges, there was a smile, a connection, a small win. Take a moment to name and celebrate what felt good today.",
      parentTip: "Expressing positive emotions strengthens them. Speaking gratitude aloud—even to yourself—amplifies joy and helps you notice more moments of goodness."
    },
    {
      id: 5,
      title: "Uncertainty & Doubt",
      prompt: "Parenting brings moments of doubt and uncertainty. It's okay to voice your concerns and questions. What are you uncertain about right now?",
      scenario: "You're questioning a decision, wondering if you're doing things 'right,' or feeling unsure about what comes next. Express the uncertainty without trying to solve it yet.",
      parentTip: "Giving voice to uncertainty reduces its power over you. Speaking it aloud can help you see that doubt is normal and temporary, not a sign of failure."
    }
  ];

  const handleExpressEmotion = () => {
    if (!emotionText.trim()) {
      alert("Please express your feelings before continuing. Type or speak what you're experiencing.");
      return;
    }

    // Generate empathy reflection
    const reflection = generateEmpathyReflection(emotionText, mirrorMoments[currentMoment]);
    
    // Save the moment
    const completedMoment = {
      momentId: mirrorMoments[currentMoment].id,
      emotionText: emotionText,
      reflection: reflection,
      selfRating: null
    };
    
    setCompletedMoments([...completedMoments, completedMoment]);
    setShowReflection(true);
    
    // Award point for engaging
    setScore(prev => prev + 1);
  };

  const handleSelfRating = (rating) => {
    setSelfRating(rating);
    
    // Update the completed moment with rating
    const updatedMoments = [...completedMoments];
    updatedMoments[updatedMoments.length - 1].selfRating = rating;
    setCompletedMoments(updatedMoments);
    
    // Move to next moment after rating
    setTimeout(() => {
      if (currentMoment < mirrorMoments.length - 1) {
        setCurrentMoment(currentMoment + 1);
        setEmotionText("");
        setShowReflection(false);
        setSelfRating(null);
      } else {
        // All moments completed
        setShowGameOver(true);
      }
    }, 2000);
  };

  const currentMomentData = mirrorMoments[currentMoment];
  const currentReflection = completedMoments.length > 0 && showReflection
    ? completedMoments[completedMoments.length - 1].reflection
    : null;

  return (
    <ParentGameShell
      title={gameData?.title || "Mirror Moment"}
      subtitle={gameData?.description || "Practice speaking feelings aloud to release tension"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentMoment}
    >
      {currentMoment < mirrorMoments.length ? (
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Moment {currentMoment + 1} of {mirrorMoments.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Score: {score}/{mirrorMoments.length}
                </span>
              </div>
            </div>

            {/* Mirror Moment Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🪞</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {currentMomentData.title}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto rounded-full"></div>
            </div>

            {/* Scenario Description */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {currentMomentData.scenario}
                </p>
                <p className="text-base font-semibold text-blue-800 italic">
                  {currentMomentData.prompt}
                </p>
              </div>
            </div>

            {/* Emotion Expression Area */}
            {!showReflection && (
              <div className="mb-6">
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  Express Your Feelings (Type or speak aloud):
                </label>
                <div className="relative">
                  <textarea
                    value={emotionText}
                    onChange={(e) => setEmotionText(e.target.value)}
                    placeholder="Type what you're feeling... (Or speak it aloud to yourself as you type)"
                    className="w-full h-40 p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none text-gray-700 text-lg"
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                    💭 Speaking aloud as you type helps release tension
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {emotionText.length} characters
                </p>
                
                <button
                  onClick={handleExpressEmotion}
                  disabled={!emotionText.trim()}
                  className={`w-full mt-4 py-4 rounded-xl font-bold text-lg transition-all ${
                    emotionText.trim()
                      ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-[1.02]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Share My Feelings
                </button>
              </div>
            )}

            {/* AI Reflection Display */}
            {showReflection && currentReflection && (
              <div className="mb-6 animate-fade-in">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{currentReflection.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-purple-800 mb-2 text-lg">Empathetic Reflection</h4>
                      <p className="text-base text-gray-700 leading-relaxed italic">
                        "{currentReflection.message}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Self-Rating */}
            {showReflection && !selfRating && (
              <div className="mb-6 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  How do you feel after expressing and hearing this reflection?
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((rating) => {
                    const ratingEmojis = ['😔', '😐', '🙂', '😊', '✨'];
                    const ratingLabels = ['Heavy', 'Neutral', 'Better', 'Lighter', 'Released'];
                    
                    return (
                      <button
                        key={rating}
                        onClick={() => handleSelfRating(rating)}
                        className="p-4 rounded-xl border-2 border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50 hover:scale-110 transition-all cursor-pointer"
                      >
                        <div className="text-3xl mb-2">{ratingEmojis[rating - 1]}</div>
                        <div className="text-xs font-medium text-gray-700">{ratingLabels[rating - 1]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rating Confirmation */}
            {selfRating && (
              <div className="mb-6 animate-fade-in">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 text-center">
                  <p className="text-lg text-green-700 font-medium">
                    Thank you for this moment of reflection. 🌟
                  </p>
                </div>
              </div>
            )}

            {/* Parent Tip */}
            <div className="mt-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border-2 border-orange-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-xs font-semibold text-orange-800 mb-1">Parent Tip:</p>
                  <p className="text-sm text-orange-700">
                    {currentMomentData.parentTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </ParentGameShell>
  );
};

export default MirrorMoment;

