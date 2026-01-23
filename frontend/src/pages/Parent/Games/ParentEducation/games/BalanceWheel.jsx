import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Heart, Briefcase, Moon, User, RotateCcw, Trophy, Clock, Star, Play, CheckCircle, AlertTriangle } from "lucide-react";

const BalanceWheel = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-31";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentLevel, setCurrentLevel] = useState(0);
  const [choicesMade, setChoicesMade] = useState({});
  const [levelScores, setLevelScores] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);

  // Life domains with icons and colors
  const domains = [
    { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', borderColor: 'border-pink-300', hexFrom: '#ec4899', hexTo: '#f43f5e' },
    { id: 'work', label: 'Work', emoji: '💼', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', hexFrom: '#3b82f6', hexTo: '#06b6d4' },
    { id: 'rest', label: 'Rest', emoji: '😴', color: 'from-purple-500 to-indigo-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-300', hexFrom: '#a855f7', hexTo: '#6366f1' },
    { id: 'self', label: 'Self', emoji: '🧘', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', borderColor: 'border-green-300', hexFrom: '#22c55e', hexTo: '#10b981' }
  ];

  // 5 Levels with different parenting scenarios and choices
  const levels = [
    {
      id: 1,
      title: "The Busy Week Challenge",
      description: "You have an important work deadline this week, but your child is sick and your partner is traveling. What's your priority strategy?",
      context: "This week you have a critical project due at work, but your 6-year-old has come down with a fever and needs constant care. Your partner is away on business. You feel pulled in multiple directions.",
      choices: [
        {
          id: 'work-first',
          title: "Focus on work during the day, give extra attention to child in evenings",
          impact: { family: 7, work: 9, rest: 3, self: 2 },
          explanation: "This prioritizes work but ensures your child still feels cared for. However, you'll be exhausted.",
          isOptimal: false
        },
        
        {
          id: 'delegate',
          title: "Call your neighbor to help watch the child while you work",
          impact: { family: 5, work: 8, rest: 4, self: 4 },
          explanation: "This balances both needs but may make your child feel abandoned.",
          isOptimal: false
        },
        {
          id: 'family-first',
          title: "Take the day off work to care for your child, catch up later",
          impact: { family: 10, work: 4, rest: 5, self: 3 },
          explanation: "This ensures your child feels secure and cared for, though it may stress your work deadline.",
          isOptimal: true
        },
      ],
      parentTip: "During crisis periods, perfect balance isn't possible. Focus on meeting essential needs in each domain rather than ideal amounts.",
      explanation: "When facing a crisis like a sick child, the key is recognizing that balance looks different. It's about meeting minimum viable needs in each area rather than maintaining your usual distribution."
    },
    {
      id: 2,
      title: "The Weekend Warrior Dilemma",
      description: "You're trying to catch up on household chores, spend quality time with family, and rest. What's your weekend strategy?",
      context: "Saturday morning arrives and you have a long list: grocery shopping, laundry, kid's soccer game, meal prep, and your own rest. You want to make everyone happy but feel overwhelmed by competing priorities.",
      choices: [
        {
          id: 'everything',
          title: "Try to do everything - wake up early and tackle the whole list",
          impact: { family: 6, work: 0, rest: 2, self: 1 },
          explanation: "This leaves you exhausted and may not give quality time to anyone.",
          isOptimal: false
        },
        {
          id: 'family-focus',
          title: "Prioritize the soccer game and family time, do chores when kids nap",
          impact: { family: 9, work: 0, rest: 6, self: 5 },
          explanation: "This gives your child quality attention and lets you rest, but chores may pile up.",
          isOptimal: true
        },
        {
          id: 'delegate-chores',
          title: "Ask older kids to help with chores while you prepare for next week",
          impact: { family: 7, work: 2, rest: 4, self: 4 },
          explanation: "This teaches responsibility to kids but may create stress during family time.",
          isOptimal: false
        }
      ],
      parentTip: "Weekends don't need to be perfect. Choose a few priorities and let go of the rest. It's better to do a few things well than everything poorly.",
      explanation: "Weekend balance is about intentionality. Rather than trying to do everything, identify what truly matters most and allocate resources accordingly."
    },
    {
      id: 3,
      title: "The Burnout Recovery",
      description: "After months of overwork, you realize you need to rebuild your energy and relationships. How do you start?",
      context: "You've been working 60+ hours a week for months. Your relationship with your spouse feels strained, you're exhausted, and your children seem distant. You know you need to make changes but aren't sure where to start.",
      choices: [
        {
          id: 'boundary-setting',
          title: "Set strict work boundaries - no emails after 7pm, weekends off",
          impact: { family: 7, work: 6, rest: 7, self: 6 },
          explanation: "This gradually improves balance without extreme measures.",
          isOptimal: true
        },
        {
          id: 'quit-job',
          title: "Quit your job immediately to focus on family and health",
          impact: { family: 8, work: 0, rest: 9, self: 8 },
          explanation: "This solves the immediate problem but creates financial stress.",
          isOptimal: false
        },
        
        {
          id: 'support-system',
          title: "Hire help for household tasks to free up energy for relationships",
          impact: { family: 8, work: 5, rest: 6, self: 7 },
          explanation: "This provides relief but requires financial investment.",
          isOptimal: false
        }
      ],
      parentTip: "Recovery from burnout requires intentional investment in rest and relationships. It's not selfish—it's necessary for sustainable parenting.",
      explanation: "When recovering from burnout, you need to temporarily over-invest in rest and relationships to rebuild your baseline. This is an investment in your future capacity."
    },
    {
      id: 4,
      title: "The Seasonal Shift",
      description: "School starts and routines change. How do you adapt your family's balance to the new schedule?",
      context: "Back-to-school season is here. New schedules, homework routines, after-school activities, and work travel all collide. You need to find a new equilibrium that works for everyone.",
      choices: [
        {
          id: 'maintain-routine',
          title: "Stick to your current routine and expect everyone to adjust",
          impact: { family: 4, work: 7, rest: 3, self: 2 },
          explanation: "This maintains your work schedule but ignores the new family needs.",
          isOptimal: false
        },
        {
          id: 'family-meeting',
          title: "Hold a family meeting to create new routines together",
          impact: { family: 9, work: 6, rest: 6, self: 5 },
          explanation: "This ensures buy-in from all family members and creates realistic expectations.",
          isOptimal: true
        },
        {
          id: 'simplify',
          title: "Cut back on after-school activities to reduce complexity",
          impact: { family: 7, work: 6, rest: 7, self: 6 },
          explanation: "This reduces stress but may disappoint your children.",
          isOptimal: false
        }
      ],
      parentTip: "Transitions require temporary over-attention to adjustment. Give yourself grace as you establish new rhythms.",
      explanation: "Seasonal transitions are natural times to reassess and rebalance. Expect it to take time to find the new equilibrium."
    },
    {
      id: 5,
      title: "The Long-term Vision",
      description: "Plan your ideal sustainable balance for the next year. What does thriving look like for your family?",
      context: "Looking ahead to the next year, you want to create a sustainable lifestyle that allows you to thrive in all areas. What would that look like in practice?",
      choices: [
        {
          id: 'perfection',
          title: "Aim for equal time in all areas every day",
          impact: { family: 6, work: 6, rest: 6, self: 6 },
          explanation: "This is unrealistic and will lead to disappointment when disrupted.",
          isOptimal: false
        },
        
        {
          id: 'seasonal-approach',
          title: "Accept that balance varies by season and life stage",
          impact: { family: 8, work: 6, rest: 8, self: 6 },
          explanation: "This provides realistic expectations for different periods.",
          isOptimal: false
        },
        {
          id: 'flexible-balance',
          title: "Create flexible weekly goals that average out over time",
          impact: { family: 7, work: 7, rest: 7, self: 7 },
          explanation: "This allows for daily variations while maintaining overall balance.",
          isOptimal: true
        },
      ],
      parentTip: "Sustainable balance isn't a destination—it's a practice of continuous adjustment. Build in regular check-ins to assess and rebalance.",
      explanation: "Long-term balance requires systems and practices, not just intentions. Think about the routines and boundaries that will sustain your desired balance over time."
    }
  ];

  const currentLevelData = levels[currentLevel];

  const handleChoice = (choiceId) => {
    if (choicesMade[currentLevel]) return; // Already made a choice
    
    setChoicesMade(prev => ({
      ...prev,
      [currentLevel]: choiceId
    }));
    
    setSelectedChoice(choiceId);
    
    // Find the selected choice
    const selected = currentLevelData.choices.find(c => c.id === choiceId);
    
    // Calculate score: 1 point if optimal choice was made
    const levelScore = selected.isOptimal ? 1 : 0;
    const newLevelScores = [...levelScores];
    newLevelScores[currentLevel] = levelScore;
    setLevelScores(newLevelScores);
    
    const newScore = score + levelScore;
    setScore(newScore);
    
    setShowFeedback(true);
    
    // Show level complete for a moment
    setTimeout(() => {
      setShowFeedback(false);
      setShowLevelComplete(true);
      
      setTimeout(() => {
        setShowLevelComplete(false);
        if (currentLevel < levels.length - 1) {
          setCurrentLevel(currentLevel + 1);
          setSelectedChoice(null);
        } else {
          setShowGameOver(true);
        }
      }, 2000);
    }, 4000);
  };

  const getImpactColor = (value) => {
    if (value >= 7) return 'text-green-600';
    if (value >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactEmoji = (value) => {
    if (value >= 7) return '😊';
    if (value >= 5) return '😐';
    return '😔';
  };

  const drawBalanceWheel = () => {
    // Get the impact of the selected choice
    const choiceId = choicesMade[currentLevel];
    const selectedChoice = currentLevelData.choices.find(c => c.id === choiceId);
    const impact = selectedChoice ? selectedChoice.impact : { family: 5, work: 5, rest: 5, self: 5 };
    
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const angles = [0, 90, 180, 270]; // 4 domains: 0° (top), 90° (right), 180° (bottom), 270° (left)
    
    // Normalize impacts to fit in the circle (max 10 for visualization)
    const maxImpact = Math.max(...Object.values(impact), 1);
    const normalized = {};
    Object.keys(impact).forEach(key => {
      normalized[key] = (impact[key] / maxImpact) * 10 || 0;
    });
    
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
        
        {/* Draw segments for each domain */}
        {domains.map((domain, index) => {
          const value = normalized[domain.id] || 0;
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
            <g key={domain.id}>
              {/* Segment fill based on value */}
              <path
                d={pathData}
                fill={`url(#gradient-${domain.id})`}
                opacity={0.3 + (value / 10) * 0.4}
              />
              {/* Segment border */}
              <path
                d={pathData}
                fill="none"
                stroke={domain.hexFrom}
                strokeWidth="2"
                opacity="0.5"
              />
              {/* Value indicator line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={centerX + Math.cos(angleRad) * segmentRadius}
                y2={centerY + Math.sin(angleRad) * segmentRadius}
                stroke={domain.hexTo}
                strokeWidth="3"
              />
              {/* Domain label and value */}
              <text
                x={centerX + Math.cos(angleRad) * (radius + 25)}
                y={centerY + Math.sin(angleRad) * (radius + 25)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-semibold fill-gray-700"
              >
                <tspan x={centerX + Math.cos(angleRad) * (radius + 25)} dy="-5">{domain.emoji}</tspan>
                <tspan x={centerX + Math.cos(angleRad) * (radius + 25)} dy="15">{impact[domain.id] || 0}</tspan>
              </text>
            </g>
          );
        })}
        
        {/* Center point */}
        <circle cx={centerX} cy={centerY} r="4" fill="#6b7280" />
        
        {/* Gradients for each domain */}
        <defs>
          {domains.map(domain => (
            <linearGradient key={domain.id} id={`gradient-${domain.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={domain.hexFrom} />
              <stop offset="100%" stopColor={domain.hexTo} />
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
        allAnswersCorrect={score === totalLevels} // Perfect score: 5/5 levels completed correctly
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-xl p-8 text-center border-4 border-indigo-200">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Balance Mastery Achieved!</h2>
            <p className="text-xl text-gray-700 mb-6">
              You scored <span className="font-bold text-indigo-600 text-2xl">{score}</span> out of <span className="font-bold text-purple-600">{totalLevels}</span> optimal choices!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
                <div className="text-4xl mb-3">🌟</div>
                <h3 className="text-lg font-bold text-green-700 mb-2">Your Success</h3>
                <p className="text-gray-700">
                  You've demonstrated excellent understanding of work-life balance principles for parents. Each scenario required thoughtful consideration of competing priorities.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
                <div className="text-4xl mb-3">💡</div>
                <h3 className="text-lg font-bold text-blue-700 mb-2">Key Insight</h3>
                <p className="text-gray-700">
                  Balance isn't static—it's a dynamic practice of adjusting priorities based on changing circumstances while maintaining core wellbeing.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-lg text-amber-800 font-medium">
                <strong>💡 Master Parent Tip:</strong> Remember that balance is a practice, not a destination. Regular check-ins with yourself and your family will help you maintain sustainable rhythms over time.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  const choiceMade = choicesMade[currentLevel];
  
  // Calculate feedback for the current level
  let levelFeedback = null;
  if (showFeedback) {
    const choiceId = choicesMade[currentLevel];
    const selectedChoice = currentLevelData.choices.find(c => c.id === choiceId);
    
    levelFeedback = {
      choice: selectedChoice,
      isOptimal: selectedChoice?.isOptimal
    };
  }

  return (
    <ParentGameShell
      title={gameData?.title || "The Balance Wheel"}
      subtitle={`Level ${currentLevel + 1} of ${totalLevels}: ${currentLevelData.title}`}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={currentLevel + 1}
      progress={(currentLevel / totalLevels) * 100}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Level Context */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Star className="w-6 h-6 text-indigo-600" />
              {currentLevelData.title}
            </h3>
            <p className="text-gray-700 mb-3 text-lg font-medium">{currentLevelData.description}</p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 mb-4">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Situation:
              </h4>
              <p className="text-blue-700">{currentLevelData.context}</p>
            </div>
          </div>

          {/* Balance Wheel Visualization */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-gray-200">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Impact of Your Choice
              </h4>
              <div className="flex justify-center mb-4">
                {drawBalanceWheel()}
              </div>
              
              <div className="text-center text-sm text-gray-600">
                <p>Visual representation of how your choice affects each life domain</p>
              </div>
            </div>
          </div>

          {/* Choices */}
          <div className="space-y-4 mb-6">
            {currentLevelData.choices.map((choice, index) => {
              const isSelected = selectedChoice === choice.id;
              const isChosen = choicesMade[currentLevel] === choice.id;
              
              return (
                <motion.div
                  key={choice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-indigo-400 bg-indigo-50 shadow-md' : 'border-gray-200 bg-white'} ${choiceMade ? 'cursor-default' : 'hover:shadow-md'}`}
                  onClick={() => !choiceMade && handleChoice(choice.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isChosen ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                      {isChosen ? <CheckCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2">{choice.title}</h4>
                      
                      {/* Impact indicators */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        {domains.map(domain => (
                          <div key={domain.id} className="text-center p-2 rounded-lg bg-gray-50">
                            <div className="text-lg">{domain.emoji}</div>
                            <div className="text-xs font-medium text-gray-600">{domain.label}</div>
                            <div className={`font-bold ${getImpactColor(choice.impact[domain.id])}`}>
                              {getImpactEmoji(choice.impact[domain.id])} {choice.impact[domain.id]}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-3">{choice.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Feedback Display */}
          {showFeedback && levelFeedback && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`rounded-xl p-6 border-2 mb-6 ${levelFeedback.isOptimal ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'}`}
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Choice Feedback
                </h4>
                
                <div className={`rounded-lg p-4 mb-4 ${levelFeedback.isOptimal ? 'bg-green-100 border border-green-300' : 'bg-amber-100 border border-amber-300'}`}>
                  <p className={`font-bold ${levelFeedback.isOptimal ? 'text-green-800' : 'text-amber-800'}`}>
                    {levelFeedback.isOptimal ? (
                      <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Optimal Choice! This strategy will help maintain balance.</span>
                    ) : (
                      <span className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> This choice has some drawbacks. Consider alternative approaches.</span>
                    )}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700">{currentLevelData.explanation}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Parent Tip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200"
          >
            <p className="text-sm text-amber-800">
              <strong>💡 Parent Tip:</strong> {currentLevelData.parentTip}
            </p>
          </motion.div>
          
          {/* Level Complete Animation */}
          {showLevelComplete && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              >
                <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md w-full mx-4">
                  <div className="text-6xl mb-4">✅</div>
                  
                  <p className="text-gray-600 mb-4">Preparing next challenge...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default BalanceWheel;

