import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Sliders, TrendingUp, TrendingDown, Minus } from "lucide-react";

const BalanceWheel = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-31";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [ratings, setRatings] = useState({});
  const [showPattern, setShowPattern] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Life zones for the balance wheel
  const zones = [
    { id: 'work', label: 'Work', icon: '💼', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', hexFrom: '#3b82f6', hexTo: '#06b6d4', hexBorder: '#93c5fd' },
    { id: 'rest', label: 'Rest', icon: '😴', color: 'from-purple-500 to-indigo-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-300', hexFrom: '#a855f7', hexTo: '#6366f1', hexBorder: '#c4b5fd' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', borderColor: 'border-pink-300', hexFrom: '#ec4899', hexTo: '#f43f5e', hexBorder: '#fbcfe8' },
    { id: 'self', label: 'Self', icon: '🧘', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', borderColor: 'border-green-300', hexFrom: '#22c55e', hexTo: '#10b981', hexBorder: '#86efac' }
  ];

  // Scenarios with different life situations
  const scenarios = [
    {
      id: 1,
      title: "Busy Work Week",
      description: "You've had a particularly demanding work week with tight deadlines. Rate your current satisfaction (1-10) in each life zone.",
      context: "Work has been consuming most of your time and energy. You've been skipping lunch breaks, staying late, and bringing work stress home.",
      idealBalance: { work: 7, rest: 6, family: 6, self: 6 }, // Ideal range: 6-8
      parentTip: "If one section is too low, don't aim for perfection—restore gently. Small adjustments in rest or self-care can make a big difference even when work is demanding.",
      explanation: "When work dominates (7-10), it often pulls from rest (4-6) and self (4-6). The key is to acknowledge this imbalance and make gentle shifts—like a 15-minute walk or a phone call to family—rather than trying to overhaul everything at once."
    },
    {
      id: 2,
      title: "Exhausted Parent",
      description: "You've been taking care of everyone else's needs. How satisfied are you in each zone right now?",
      context: "The kids have been sick, family needs have been high, and you've been putting everyone else first. You feel drained but haven't prioritized your own needs.",
      idealBalance: { work: 5, rest: 4, family: 7, self: 3 }, // Family high, self low
      parentTip: "Self-care isn't selfish—it's necessary. When self is below 4, everything else suffers. Even 10 minutes of 'you time' can shift the entire wheel.",
      explanation: "When family satisfaction is high but self is very low (1-3), you're likely experiencing burnout. Notice how low self-care affects your capacity to enjoy family time. Small acts of self-care restore your ability to be present."
    },
    {
      id: 3,
      title: "Post-Vacation Reality",
      description: "You just returned from a vacation. Rate how balanced you feel across these zones now.",
      context: "Vacation was restful, but coming back to work and family responsibilities feels overwhelming. You're trying to catch up on everything.",
      idealBalance: { work: 3, rest: 8, family: 8, self: 7 }, // Rest and family high, work low
      parentTip: "Balance doesn't mean everything is equal—it means nothing is completely depleted. If one zone (like work) is temporarily low after rest, that's okay. The wheel shifts over time.",
      explanation: "After rest and family time, work satisfaction may drop (2-5) as you adjust back to routine. This is natural. The goal isn't to keep all zones at 8, but to prevent any zone from staying below 3 for too long."
    },
    {
      id: 4,
      title: "Weekend Overwhelm",
      description: "It's Sunday evening and you're preparing for another week. How balanced do you feel?",
      context: "You spent the weekend handling chores, family activities, and trying to rest, but it feels like nothing got enough attention. You're anxious about the week ahead.",
      idealBalance: { work: 4, rest: 5, family: 6, self: 4 }, // All moderate, none thriving
      parentTip: "When everything feels 'medium,' the wheel may look balanced but it's not satisfying. Look for one zone to intentionally elevate—even slightly—to create momentum.",
      explanation: "When all zones are between 4-6, nothing feels terrible but nothing feels good either. This is the 'treading water' pattern. Choose ONE zone to intentionally boost (even by 1 point) rather than trying to fix everything at once."
    },
    {
      id: 5,
      title: "Seeking Harmony",
      description: "Imagine your ideal balanced life. Rate where you'd like to be in each zone.",
      context: "You're reflecting on what balance means to you. Not perfection, but a sustainable rhythm where all zones get attention without any being completely neglected.",
      idealBalance: { work: 7, rest: 7, family: 8, self: 6 }, // Balanced but realistic
      parentTip: "True balance is flexible, not fixed. Some weeks work is 8 and self is 5. Other weeks self is 8 and work is 5. The wheel rotates—what matters is that over time, no zone stays empty.",
      explanation: "Ideal balance isn't all zones at 10. It's a sustainable pattern where each zone gets enough attention to maintain your well-being. Work might be 6-8, rest 6-8, family 7-9, self 5-7. This is realistic and maintainable."
    }
  ];

  const currentScenarioData = scenarios[currentScenario];

  // Initialize ratings for current scenario
  const initializeRatings = () => {
    if (!ratings[currentScenario]) {
      const initial = {};
      zones.forEach(zone => {
        initial[zone.id] = 5; // Start at middle (5)
      });
      setRatings(prev => ({ ...prev, [currentScenario]: initial }));
    }
  };

  React.useEffect(() => {
    initializeRatings();
  }, [currentScenario]);

  const handleRatingChange = (zoneId, value) => {
    setRatings(prev => ({
      ...prev,
      [currentScenario]: {
        ...prev[currentScenario],
        [zoneId]: parseInt(value)
      }
    }));
    setShowPattern(false);
  };

  const calculateBalanceScore = () => {
    const currentRatings = ratings[currentScenario] || {};
    const ideal = currentScenarioData.idealBalance;
    
    // Calculate how close the ratings are to the ideal (allowing flexibility)
    let correctZones = 0;
    zones.forEach(zone => {
      const userRating = currentRatings[zone.id] || 5;
      const idealRating = ideal[zone.id];
      // Allow ±2 points from ideal to be considered correct
      if (Math.abs(userRating - idealRating) <= 2) {
        correctZones++;
      }
    });
    
    return correctZones;
  };

  const getBalancePattern = () => {
    const currentRatings = ratings[currentScenario] || {};
    const pattern = zones.map(zone => ({
      zone: zone.label,
      value: currentRatings[zone.id] || 5,
      color: zone.color,
      icon: zone.icon
    }));
    return pattern;
  };

  const getBalanceInsight = () => {
    const currentRatings = ratings[currentScenario] || {};
    const values = Object.values(currentRatings);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const range = max - min;

    if (range <= 2 && avg >= 6) {
      return { type: 'balanced', message: "This looks well-balanced! All zones are in a healthy range." };
    } else if (range > 4) {
      return { type: 'unbalanced', message: "There's a significant imbalance. Notice which zones are very low—these need gentle attention." };
    } else if (avg < 4) {
      return { type: 'low', message: "Overall satisfaction is low across zones. This might indicate burnout or overwhelm." };
    } else {
      return { type: 'moderate', message: "Moderate balance—nothing is critically low, but there's room for improvement." };
    }
  };

  const handleShowPattern = () => {
    setShowPattern(true);
  };

  const handleNext = () => {
    const balanceScore = calculateBalanceScore();
    const newScore = score + balanceScore;
    setScore(newScore);

    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setShowPattern(false);
    } else {
      setShowGameOver(true);
    }
  };

  const getScoreEmoji = (value) => {
    if (value <= 3) return '😔';
    if (value <= 5) return '😐';
    if (value <= 7) return '🙂';
    if (value <= 8) return '😊';
    return '😄';
  };

  const drawWheel = () => {
    const currentRatings = ratings[currentScenario] || {};
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const angles = [0, 90, 180, 270]; // 4 zones: 0° (top), 90° (right), 180° (bottom), 270° (left)
    
    return (
      <svg width="300" height="300" className="mx-auto">
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2"
          opacity="0.3"
        />
        
        {/* Draw segments for each zone */}
        {zones.map((zone, index) => {
          const value = currentRatings[zone.id] || 5;
          const angle = angles[index];
          const angleRad = (angle - 90) * (Math.PI / 180); // Start from top
          const segmentRadius = radius * (value / 10);
          
          // Calculate path for this segment (pie slice)
          const startAngle = angleRad - (Math.PI / 4); // 45 degrees each way
          const endAngle = angleRad + (Math.PI / 4);
          
          const x1 = centerX + Math.cos(startAngle) * segmentRadius;
          const y1 = centerY + Math.sin(startAngle) * segmentRadius;
          const x2 = centerX + Math.cos(endAngle) * segmentRadius;
          const y2 = centerY + Math.sin(endAngle) * segmentRadius;
          
          // Create path for segment
          const largeArcFlag = Math.PI / 2 > (endAngle - startAngle) ? 0 : 1;
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${centerX + Math.cos(startAngle) * radius} ${centerY + Math.sin(startAngle) * radius}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${centerX + Math.cos(endAngle) * radius} ${centerY + Math.sin(endAngle) * radius}`,
            'Z'
          ].join(' ');
          
          return (
            <g key={zone.id}>
              {/* Segment fill based on value */}
              <path
                d={pathData}
                fill={`url(#gradient-${zone.id})`}
                opacity={0.3 + (value / 10) * 0.4}
              />
              {/* Segment border */}
              <path
                d={pathData}
                fill="none"
                stroke={zone.hexBorder}
                strokeWidth="2"
                opacity="0.5"
              />
              {/* Value indicator line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={centerX + Math.cos(angleRad) * segmentRadius}
                y2={centerY + Math.sin(angleRad) * segmentRadius}
                stroke={zone.hexTo}
                strokeWidth="3"
              />
              {/* Zone label and value */}
              <text
                x={centerX + Math.cos(angleRad) * (radius + 25)}
                y={centerY + Math.sin(angleRad) * (radius + 25)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-semibold fill-gray-700"
              >
                <tspan x={centerX + Math.cos(angleRad) * (radius + 25)} dy="-5">{zone.icon}</tspan>
                <tspan x={centerX + Math.cos(angleRad) * (radius + 25)} dy="15">{value}/10</tspan>
              </text>
            </g>
          );
        })}
        
        {/* Center point */}
        <circle cx={centerX} cy={centerY} r="4" fill="#6b7280" />
        
        {/* Gradients for each zone */}
        <defs>
          {zones.map(zone => (
            <linearGradient key={zone.id} id={`gradient-${zone.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={zone.hexFrom} />
              <stop offset="100%" stopColor={zone.hexTo} />
            </linearGradient>
          ))}
        </defs>
      </svg>
    );
  };

  if (showGameOver) {
    return (
      <ParentGameShell
        title={gameData?.title || "The Balance Wheel"}
        subtitle="Game Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={score >= totalLevels * 3} // At least 3 zones correct per scenario
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">⚖️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Balance Assessment Complete!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've explored how different life situations affect your balance wheel. Remember: balance isn't perfection—it's awareness and gentle adjustments.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-gray-700 font-medium">
                <strong>💡 Parent Tip:</strong> Check your balance wheel regularly. If one section is too low, don't aim for perfection—restore gently. Small, consistent adjustments create lasting balance.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  const currentRatings = ratings[currentScenario] || {};
  const balanceInsight = getBalancePattern().length > 0 ? getBalanceInsight() : null;

  return (
    <ParentGameShell
      title={gameData?.title || "The Balance Wheel"}
      subtitle={`Scenario ${currentScenario + 1} of ${totalLevels}: ${currentScenarioData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentScenario + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Scenario Context */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{currentScenarioData.title}</h3>
            <p className="text-gray-600 mb-2">{currentScenarioData.description}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
              <p className="text-sm text-blue-800">{currentScenarioData.context}</p>
            </div>
          </div>

          {/* Balance Wheel Visualization */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-gray-200">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Your Balance Wheel</h4>
              <div className="flex justify-center mb-6">
                {drawWheel()}
              </div>
            </div>
          </div>

          {/* Sliders for each zone */}
          <div className="space-y-6 mb-6">
            {zones.map((zone, index) => {
              const value = currentRatings[zone.id] || 5;
              return (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${zone.bgColor} border-2 ${zone.borderColor} rounded-xl p-4`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{zone.icon}</span>
                      <span className="text-lg font-semibold text-gray-700">{zone.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getScoreEmoji(value)}</span>
                      <span className="text-2xl font-bold text-gray-800 w-12 text-center">{value}/10</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => handleRatingChange(zone.id, e.target.value)}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${zone.hexFrom} 0%, ${zone.hexFrom} ${(value - 1) * 11.11}%, #e5e7eb ${(value - 1) * 11.11}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Very Low</span>
                    <span>Moderate</span>
                    <span>Very High</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Balance Pattern Analysis */}
          {showPattern && balanceInsight && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  Balance Pattern Analysis
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {getBalancePattern().map((item, index) => {
                    const trend = item.value > 6 ? 'up' : item.value < 4 ? 'down' : 'neutral';
                    return (
                      <div key={index} className="bg-white rounded-lg p-3 text-center border border-gray-200">
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-sm font-medium text-gray-600">{item.zone}</div>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                          {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                          {trend === 'neutral' && <Minus className="w-4 h-4 text-gray-400" />}
                          <span className={`text-lg font-bold ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                            {item.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white rounded-lg p-4 border border-indigo-100">
                  <p className="text-gray-700 mb-3">
                    <strong>Insight:</strong> {balanceInsight.message}
                  </p>
                  <p className="text-sm text-gray-600">{currentScenarioData.explanation}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShowPattern}
              disabled={showPattern}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sliders className="w-5 h-5" />
              View Balance Pattern
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={!showPattern}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Complete Assessment'}
            </motion.button>
          </div>

          {/* Parent Tip */}
          {showPattern && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200"
            >
              <p className="text-sm text-amber-800">
                <strong>💡 Parent Tip:</strong> {currentScenarioData.parentTip}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default BalanceWheel;

