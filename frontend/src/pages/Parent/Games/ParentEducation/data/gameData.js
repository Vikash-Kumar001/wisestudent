import { getCalmCoinsForGame, getReplayCostForGame } from '../../../../../utils/parentGameUtils';

/**
 * Parent Education Game Data
 * Each game has exactly 5 questions
 * CalmCoins are awarded per game (not per question)
 */
export const parentEducationGameData = [
  {
    id: 'parent-education-1',
    title: 'Name Your Feeling',
    description: 'Help parents recognize and label emotions in daily family situations',
    gameIndex: 1,
    calmCoins: getCalmCoinsForGame(1),  // 5 CalmCoins
    replayCost: getReplayCostForGame(1), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-1'
  },
  {
    id: 'parent-education-2',
    title: 'Emotion Mirror',
    description: 'Observe how your body signals stress or calm',
    gameIndex: 2,
    calmCoins: getCalmCoinsForGame(2),  // 5 CalmCoins
    replayCost: getReplayCostForGame(2), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-2'
  },
  {
    id: 'parent-education-3',
    title: 'Feelings Flashcards',
    description: 'Build an emotional vocabulary for family conversations',
    gameIndex: 3,
    calmCoins: getCalmCoinsForGame(3),  // 5 CalmCoins
    replayCost: getReplayCostForGame(3), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-3'
  },
  {
    id: 'parent-education-4',
    title: 'Inner Weather Check',
    description: 'Recognize emotional "weather" and build emotional vocabulary',
    gameIndex: 4,
    calmCoins: getCalmCoinsForGame(4),  // 5 CalmCoins
    replayCost: getReplayCostForGame(4), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-4'
  },
  {
    id: 'parent-education-5',
    title: 'Trigger Tracker',
    description: 'Identify what situations provoke anger or sadness',
    gameIndex: 5,
    calmCoins: getCalmCoinsForGame(5),  // 5 CalmCoins
    replayCost: getReplayCostForGame(5), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-5'
  },
  {
    id: 'parent-education-6',
    title: 'Thought Catcher',
    description: 'Spot negative self-talk and reframe it with compassion',
    gameIndex: 6,
    calmCoins: getCalmCoinsForGame(6),  // 5 CalmCoins
    replayCost: getReplayCostForGame(6), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-6'
  },
  {
    id: 'parent-education-7',
    title: 'Mood Journal',
    description: 'Track daily emotions to discover mood patterns',
    gameIndex: 7,
    calmCoins: getCalmCoinsForGame(7),  // 5 CalmCoins
    replayCost: getReplayCostForGame(7), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-7'
  },
  {
    id: 'parent-education-8',
    title: 'Mirror Moment',
    description: 'Practice speaking feelings aloud to release tension',
    gameIndex: 8,
    calmCoins: getCalmCoinsForGame(8),  // 5 CalmCoins
    replayCost: getReplayCostForGame(8), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-8'
  },
  {
    id: 'parent-education-9',
    title: 'Emotional Reflex',
    description: 'React quickly to name visible emotions in others',
    gameIndex: 9,
    calmCoins: getCalmCoinsForGame(9),  // 5 CalmCoins
    replayCost: getReplayCostForGame(9), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-9'
  },
  {
    id: 'parent-education-10',
    title: 'Self-Aware Parent Badge',
    description: 'Celebrate consistent self-awareness practices',
    gameIndex: 10,
    calmCoins: 0,  // No CalmCoins for badge collection
    replayCost: 0, // No replay cost
    estimatedTime: '2 min',
    difficulty: 'special',
    category: 'parent-education',
    totalQuestions: 0,
    totalLevels: 0,
    path: '/parent/games/parent-education/parent-education-10',
    isBadgeGame: true
  },
  {
    id: 'parent-education-11',
    title: 'Stress Barometer',
    description: 'Identify how stress builds up during a typical day',
    gameIndex: 11,
    calmCoins: getCalmCoinsForGame(11),  // 5 CalmCoins
    replayCost: getReplayCostForGame(11), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-11'
  },
  {
    id: 'parent-education-12',
    title: 'Breathe to Reset',
    description: 'Learn quick breathing rhythm to calm the body',
    gameIndex: 12,
    calmCoins: getCalmCoinsForGame(12),  // 5 CalmCoins
    replayCost: getReplayCostForGame(12), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-12'
  },
  {
    id: 'parent-education-13',
    title: 'Pause Before React',
    description: 'Train yourself to pause instead of shouting or snapping',
    gameIndex: 13,
    calmCoins: getCalmCoinsForGame(13),  // 5 CalmCoins
    replayCost: getReplayCostForGame(13), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-13'
  },
  {
    id: 'parent-education-14',
    title: 'Tension Release Stretch',
    description: 'Physically discharge tension after emotional stress',
    gameIndex: 14,
    calmCoins: getCalmCoinsForGame(14),  // 5 CalmCoins
    replayCost: getReplayCostForGame(14), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-14'
  },
  {
    id: 'parent-education-15',
    title: 'Calm Voice Challenge',
    description: 'Learn to speak firmly but softly under pressure',
    gameIndex: 15,
    calmCoins: getCalmCoinsForGame(15),  // 5 CalmCoins
    replayCost: getReplayCostForGame(15), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-15'
  },
  {
    id: 'parent-education-16',
    title: 'The Reframe Game',
    description: 'Change stressful thoughts into constructive ones',
    gameIndex: 16,
    calmCoins: getCalmCoinsForGame(16),  // 5 CalmCoins
    replayCost: getReplayCostForGame(16), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-16'
  },
  {
    id: 'parent-education-17',
    title: 'Family Calm Corner',
    description: 'Create a shared calm space for emotional resets',
    gameIndex: 17,
    calmCoins: getCalmCoinsForGame(17),  // 5 CalmCoins
    replayCost: getReplayCostForGame(17), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-17'
  },
  {
    id: 'parent-education-18',
    title: 'Daily De-Stress Journal',
    description: 'Reflect on stressful moments and how they were handled',
    gameIndex: 18,
    calmCoins: getCalmCoinsForGame(18),  // 5 CalmCoins
    replayCost: getReplayCostForGame(18), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-18'
  },
  {
    id: 'parent-education-19',
    title: 'Stress Detox Visualization',
    description: 'Use guided imagery to release tension mentally',
    gameIndex: 19,
    calmCoins: getCalmCoinsForGame(19),  // 5 CalmCoins
    replayCost: getReplayCostForGame(19), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-19'
  },
  {
    id: 'parent-education-20',
    title: 'Calm Parent Badge',
    description: 'Celebrate consistent practice of stress regulation habits',
    gameIndex: 20,
    calmCoins: 0,  // Achievement Badge - no coins
    replayCost: 0, // No replay needed
    estimatedTime: '0 min',
    difficulty: 'achievement',
    category: 'parent-education',
    totalQuestions: 0,
    totalLevels: 0,
    path: '/parent/games/parent-education/parent-education-20',
    isBadgeGame: true
  },
  {
    id: 'parent-education-21',
    title: 'Walk in Their Shoes',
    description: 'Experience situations from a child\'s perspective',
    gameIndex: 21,
    calmCoins: getCalmCoinsForGame(21),  // 5 CalmCoins
    replayCost: getReplayCostForGame(21), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-21'
  },
  {
    id: 'parent-education-22',
    title: 'Feelings First',
    description: 'Practice acknowledging your child\'s emotion before offering advice',
    gameIndex: 22,
    calmCoins: getCalmCoinsForGame(22),  // 5 CalmCoins
    replayCost: getReplayCostForGame(22), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-22'
  },
  {
    id: 'parent-education-23',
    title: 'Kind Response Challenge',
    description: 'Replace irritation with gentle, firm kindness',
    gameIndex: 23,
    calmCoins: getCalmCoinsForGame(23),  // 5 CalmCoins
    replayCost: getReplayCostForGame(23), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-23'
  },
  {
    id: 'parent-education-24',
    title: 'Emotion Echo Game',
    description: 'Learn to mirror your child\'s emotion to help them feel heard',
    gameIndex: 24,
    calmCoins: getCalmCoinsForGame(24),  // 5 CalmCoins
    replayCost: getReplayCostForGame(24), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-24'
  },
  {
    id: 'parent-education-25',
    title: 'The Compassion Meter',
    description: 'Track your level of patience and empathy through the week',
    gameIndex: 25,
    calmCoins: getCalmCoinsForGame(25),  // 5 CalmCoins
    replayCost: getReplayCostForGame(25), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-25'
  },
  {
    id: 'parent-education-26',
    title: 'Active Empathy Roleplay',
    description: 'Choose calm, understanding responses under emotional stress',
    gameIndex: 26,
    calmCoins: getCalmCoinsForGame(26),  // 5 CalmCoins
    replayCost: getReplayCostForGame(26), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-26'
  },
  {
    id: 'parent-education-27',
    title: 'Family Feelings Circle',
    description: 'Encourage open emotional sharing at home',
    gameIndex: 27,
    calmCoins: getCalmCoinsForGame(27),  // 5 CalmCoins
    replayCost: getReplayCostForGame(27), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-27'
  },
  {
    id: 'parent-education-28',
    title: 'Gratitude for Effort',
    description: 'Shift focus from results to effort and intent',
    gameIndex: 28,
    calmCoins: getCalmCoinsForGame(28),  // 5 CalmCoins
    replayCost: getReplayCostForGame(28), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-28'
  },
  {
    id: 'parent-education-29',
    title: 'Emotional Repair Practice',
    description: 'Learn to apologize and reconnect after losing temper',
    gameIndex: 29,
    calmCoins: getCalmCoinsForGame(29),  // 5 CalmCoins
    replayCost: getReplayCostForGame(29), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-29'
  },
  {
    id: 'parent-education-30',
    title: 'Compassionate Parent Badge',
    description: 'Reward parents for consistent empathy and emotional connection',
    gameIndex: 30,
    calmCoins: 0,  // Achievement Badge - no coins
    replayCost: 0, // No replay needed
    estimatedTime: '0 min',
    difficulty: 'achievement',
    category: 'parent-education',
    totalQuestions: 0,
    totalLevels: 0,
    path: '/parent/games/parent-education/parent-education-30',
    isBadgeGame: true
  },
  {
    id: 'parent-education-31',
    title: 'The Balance Wheel',
    description: 'Visualize balance across key life zones — work, rest, family, and self',
    gameIndex: 31,
    calmCoins: getCalmCoinsForGame(31),  // 5 CalmCoins
    replayCost: getReplayCostForGame(31), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-31'
  },
  {
    id: 'parent-education-32',
    title: 'Presence Detector',
    description: 'Identify distractions that steal family time',
    gameIndex: 32,
    calmCoins: getCalmCoinsForGame(32),  // 5 CalmCoins
    replayCost: getReplayCostForGame(32), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-32'
  },
  {
    id: 'parent-education-33',
    title: 'Family Time Planner',
    description: 'Schedule consistent quality family moments',
    gameIndex: 33,
    calmCoins: getCalmCoinsForGame(33),  // 5 CalmCoins
    replayCost: getReplayCostForGame(33), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-33'
  },
  {
    id: 'parent-education-34',
    title: 'Work Worry Box',
    description: 'Learn to park work tension before entering home',
    gameIndex: 34,
    calmCoins: getCalmCoinsForGame(34),  // 5 CalmCoins
    replayCost: getReplayCostForGame(34), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-34'
  },
  {
    id: 'parent-education-35',
    title: 'The Presence Practice',
    description: 'Train mindful awareness with family — being here, not elsewhere',
    gameIndex: 35,
    calmCoins: getCalmCoinsForGame(35),  // 5 CalmCoins
    replayCost: getReplayCostForGame(35), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-35'
  },
  {
    id: 'parent-education-36',
    title: 'Shared Meal Challenge',
    description: 'Reinforce connection through daily shared meals',
    gameIndex: 36,
    calmCoins: getCalmCoinsForGame(36),  // 5 CalmCoins
    replayCost: getReplayCostForGame(36), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-36'
  },
  {
    id: 'parent-education-37',
    title: 'Home Energy Reset',
    description: 'Transition emotionally from "work mode" to "home mode"',
    gameIndex: 37,
    calmCoins: getCalmCoinsForGame(37),  // 5 CalmCoins
    replayCost: getReplayCostForGame(37), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-37'
  },
  {
    id: 'parent-education-38',
    title: 'Quality Over Quantity',
    description: 'Realize that emotional presence outweighs time length',
    gameIndex: 38,
    calmCoins: getCalmCoinsForGame(38),  // 5 CalmCoins
    replayCost: getReplayCostForGame(38), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-38'
  },
  {
    id: 'parent-education-39',
    title: 'Work–Family Boundary Planner',
    description: 'Define clear lines between work and personal life',
    gameIndex: 39,
    calmCoins: getCalmCoinsForGame(39),  // 5 CalmCoins
    replayCost: getReplayCostForGame(39), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-39'
  },
  {
    id: 'parent-education-40',
    title: 'Present Parent Badge',
    description: 'Reward consistent family presence and balance habits',
    gameIndex: 40,
    calmCoins: 0,
    replayCost: 0,
    estimatedTime: '0 min',
    difficulty: 'achievement',
    category: 'parent-education',
    totalQuestions: 0,
    totalLevels: 0,
    isBadgeGame: true,
    path: '/parent/games/parent-education/parent-education-40'
  },
  {
    id: 'parent-education-41',
    title: 'The Power of Pause',
    description: 'Learn to pause before responding in stressful family moments',
    gameIndex: 41,
    calmCoins: getCalmCoinsForGame(41),  // 5 CalmCoins
    replayCost: getReplayCostForGame(41), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-41'
  },
  {
    id: 'parent-education-42',
    title: 'One-Minute Mindful Reset',
    description: 'Reconnect body and mind through short, intentional breathing',
    gameIndex: 42,
    calmCoins: getCalmCoinsForGame(42),  // 5 CalmCoins
    replayCost: getReplayCostForGame(42), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-42'
  },
  {
    id: 'parent-education-43',
    title: 'Mindful Observation Game',
    description: 'Strengthen presence by noticing details around you',
    gameIndex: 43,
    calmCoins: getCalmCoinsForGame(43),  // 5 CalmCoins
    replayCost: getReplayCostForGame(43), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-43'
  },
  {
    id: 'parent-education-44',
    title: 'Breathing with Awareness',
    description: 'Feel every breath fully to restore balance and clarity',
    gameIndex: 44,
    calmCoins: getCalmCoinsForGame(44),  // 5 CalmCoins
    replayCost: getReplayCostForGame(44), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-44'
  },
  {
    id: 'parent-education-45',
    title: 'Mindful Sound Walk',
    description: 'Tune into the sounds around you to ground your awareness',
    gameIndex: 45,
    calmCoins: getCalmCoinsForGame(45),  // 5 CalmCoins
    replayCost: getReplayCostForGame(45), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-45'
  },
  {
    id: 'parent-education-46',
    title: 'Thought Cloud Game',
    description: 'Observe thoughts without getting lost in them',
    gameIndex: 46,
    calmCoins: getCalmCoinsForGame(46),  // 5 CalmCoins
    replayCost: getReplayCostForGame(46), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-46'
  },
  {
    id: 'parent-education-47',
    title: 'Still Mind Challenge',
    description: 'Practice sitting still without touching the phone or fidgeting',
    gameIndex: 47,
    calmCoins: getCalmCoinsForGame(47),  // 5 CalmCoins
    replayCost: getReplayCostForGame(47), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-47'
  },
  {
    id: 'parent-education-48',
    title: 'Mindful Meal Moment',
    description: 'Experience eating as a calming, sensory ritual',
    gameIndex: 48,
    calmCoins: getCalmCoinsForGame(48),  // 5 CalmCoins
    replayCost: getReplayCostForGame(48), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-48'
  },
  {
    id: 'parent-education-49',
    title: 'Gratitude Breathing',
    description: 'Combine gratitude with breath for emotional reset',
    gameIndex: 49,
    calmCoins: getCalmCoinsForGame(49),  // 5 CalmCoins
    replayCost: getReplayCostForGame(49), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-49'
  },
  {
    id: 'parent-education-50',
    title: 'Mindful Parent Badge',
    description: 'Acknowledge parents who nurture calm and mindful habits daily',
    gameIndex: 50,
    calmCoins: 0,  // Badge games don't award coins
    replayCost: 0, // Badge games can't be replayed
    estimatedTime: '0 min',
    difficulty: 'achievement',
    category: 'parent-education',
    totalQuestions: 0,
    totalLevels: 0,
    isBadgeGame: true,
    path: '/parent/games/parent-education/parent-education-50'
  },
  {
    id: 'parent-education-51',
    title: 'The Bounce-Back Quiz',
    description: 'Understand your response patterns to parenting setbacks',
    gameIndex: 51,
    calmCoins: getCalmCoinsForGame(51),  // 5 CalmCoins
    replayCost: getReplayCostForGame(51), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-51'
  },
  {
    id: 'parent-education-52',
    title: 'Growth Mindset Game',
    description: 'Shift from self-blame to learning after mistakes',
    gameIndex: 52,
    calmCoins: getCalmCoinsForGame(52),  // 5 CalmCoins
    replayCost: getReplayCostForGame(52), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-52'
  },
  {
    id: 'parent-education-53',
    title: 'Tough Day Reset',
    description: 'Recover emotionally after a stressful parenting day',
    gameIndex: 53,
    calmCoins: getCalmCoinsForGame(53),  // 5 CalmCoins
    replayCost: getReplayCostForGame(53), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-53'
  },
  {
    id: 'parent-education-54',
    title: 'Forgive Yourself Journal',
    description: 'Practice self-forgiveness for moments of guilt or anger',
    gameIndex: 54,
    calmCoins: getCalmCoinsForGame(54),  // 5 CalmCoins
    replayCost: getReplayCostForGame(54), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-54'
  },
  {
    id: 'parent-education-55',
    title: 'Challenge–Choice Simulation',
    description: 'Practice choosing healthier reactions under stress',
    gameIndex: 55,
    calmCoins: getCalmCoinsForGame(55),  // 5 CalmCoins
    replayCost: getReplayCostForGame(55), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-55'
  },
  {
    id: 'parent-education-56',
    title: 'Inner Strength Visualization',
    description: 'Visualize calm strength returning after an emotional storm',
    gameIndex: 56,
    calmCoins: getCalmCoinsForGame(56),  // 5 CalmCoins
    replayCost: getReplayCostForGame(56), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-56'
  },
  {
    id: 'parent-education-57',
    title: 'Resilience Ladder',
    description: 'Reflect on progress made through life\'s challenges',
    gameIndex: 57,
    calmCoins: getCalmCoinsForGame(57),  // 5 CalmCoins
    replayCost: getReplayCostForGame(57), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-57'
  },
  {
    id: 'parent-education-58',
    title: 'Support Network Builder',
    description: 'Identify people who help you bounce back emotionally',
    gameIndex: 58,
    calmCoins: getCalmCoinsForGame(58),  // 5 CalmCoins
    replayCost: getReplayCostForGame(58), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-58'
  },
  {
    id: 'parent-education-59',
    title: 'Gratitude for Growth',
    description: 'Appreciate how tough experiences have built strength',
    gameIndex: 59,
    calmCoins: getCalmCoinsForGame(59),  // 5 CalmCoins
    replayCost: getReplayCostForGame(59), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-59'
  },
  {
    id: 'parent-education-60',
    title: 'Resilient Parent Badge',
    description: 'Recognize parents who recover and grow through challenges',
    gameIndex: 60,
    calmCoins: 0,  // Badge games don't award coins
    replayCost: 0, // Badge games can't be replayed
    estimatedTime: '0 min',
    difficulty: 'achievement',
    category: 'parent-education',
    totalQuestions: 0,
    totalLevels: 0,
    isBadgeGame: true,
    path: '/parent/games/parent-education/parent-education-60'
  },
  {
    id: 'parent-education-61',
    title: 'The Art of Listening',
    description: 'Strengthen patient and active listening with children and family',
    gameIndex: 61,
    calmCoins: getCalmCoinsForGame(61),  // 5 CalmCoins
    replayCost: getReplayCostForGame(61), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-61'
  },
  {
    id: 'parent-education-62',
    title: 'The Respectful "No"',
    description: 'Practice setting boundaries kindly but firmly',
    gameIndex: 62,
    calmCoins: getCalmCoinsForGame(62),  // 5 CalmCoins
    replayCost: getReplayCostForGame(62), // 2 CalmCoins
    estimatedTime: '25 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-62'
  },
  {
    id: 'parent-education-63',
    title: 'Family Tone Mirror',
    description: 'Observe and improve the tone used in daily family communication',
    gameIndex: 63,
    calmCoins: getCalmCoinsForGame(63),  // 5 CalmCoins
    replayCost: getReplayCostForGame(63), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-63'
  },
  {
    id: 'parent-education-64',
    title: 'Conflict Response Simulation',
    description: 'Learn to stay calm and constructive during family disagreements',
    gameIndex: 64,
    calmCoins: getCalmCoinsForGame(64),  // 5 CalmCoins
    replayCost: getReplayCostForGame(64), // 2 CalmCoins
    estimatedTime: '25 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-64'
  },
  {
    id: 'parent-education-65',
    title: 'Personal Boundary Builder',
    description: 'Define emotional limits that preserve peace',
    gameIndex: 65,
    calmCoins: getCalmCoinsForGame(65),  // 5 CalmCoins
    replayCost: getReplayCostForGame(65), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-65'
  },
  {
    id: 'parent-education-66',
    title: 'Emotional Honesty Practice',
    description: 'Express feelings clearly without blame or criticism',
    gameIndex: 66,
    calmCoins: getCalmCoinsForGame(66),  // 5 CalmCoins
    replayCost: getReplayCostForGame(66), // 2 CalmCoins
    estimatedTime: '18 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-66'
  },
  {
    id: 'parent-education-67',
    title: 'Family Communication Journal',
    description: 'Reflect on how family conversations affect emotions',
    gameIndex: 67,
    calmCoins: getCalmCoinsForGame(67),  // 5 CalmCoins
    replayCost: getReplayCostForGame(67), // 2 CalmCoins
    estimatedTime: '30 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-67'
  },
  {
    id: 'parent-education-68',
    title: 'Assertive Expression Challenge',
    description: 'Build confidence to communicate calmly even in disagreement',
    gameIndex: 68,
    calmCoins: getCalmCoinsForGame(68),  // 5 CalmCoins
    replayCost: getReplayCostForGame(68), // 2 CalmCoins
    estimatedTime: '25 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-68'
  },
  {
    id: 'parent-education-69',
    title: 'Emotional Boundary Reflex',
    description: 'Quickly identify healthy vs unhealthy emotional boundaries',
    gameIndex: 69,
    calmCoins: getCalmCoinsForGame(69),  // 5 CalmCoins
    replayCost: getReplayCostForGame(69), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-69'
  },
  {
    id: 'parent-education-70',
    title: 'Peaceful Communicator Badge',
    description: 'Reward parents who maintain emotional clarity and respect in dialogue',
    gameIndex: 70,
    calmCoins: 0,  // Badge games don't award coins
    replayCost: 0, // Badge games can't be replayed
    estimatedTime: '0 min',
    difficulty: 'achievement',
    category: 'parent-education',
    totalQuestions: 0,
    totalLevels: 0,
    isBadgeGame: true,
    path: '/parent/games/parent-education/parent-education-70'
  },
  {
    id: 'parent-education-71',
    title: 'The Support Circle',
    description: 'Identify people who emotionally support you and your family',
    gameIndex: 71,
    calmCoins: getCalmCoinsForGame(71),  // 5 CalmCoins
    replayCost: getReplayCostForGame(71), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-71'
  },
  {
    id: 'parent-education-72',
    title: 'Ask for Help Simulation',
    description: 'Practice reaching out without shame or hesitation',
    gameIndex: 72,
    calmCoins: getCalmCoinsForGame(72),  // 5 CalmCoins
    replayCost: getReplayCostForGame(72), // 2 CalmCoins
    estimatedTime: '25 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-72'
  },
  {
    id: 'parent-education-73',
    title: 'Connection Challenge',
    description: 'Strengthen relationships by initiating supportive gestures',
    gameIndex: 73,
    calmCoins: getCalmCoinsForGame(73),  // 5 CalmCoins
    replayCost: getReplayCostForGame(73), // 2 CalmCoins
    estimatedTime: '30 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-73'
  },
  {
    id: 'parent-education-74',
    title: 'Gratitude to Others',
    description: 'Deepen bonds by expressing genuine appreciation',
    gameIndex: 74,
    calmCoins: getCalmCoinsForGame(74),  // 5 CalmCoins
    replayCost: getReplayCostForGame(74), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-74'
  },
  {
    id: 'parent-education-75',
    title: 'Listening Partner Game',
    description: 'Practice supportive listening in relationships',
    gameIndex: 75,
    calmCoins: getCalmCoinsForGame(75),  // 5 CalmCoins
    replayCost: getReplayCostForGame(75), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-75'
  },
  {
    id: 'parent-education-76',
    title: 'Family Support Map',
    description: 'Visualize emotional roles within your family',
    gameIndex: 76,
    calmCoins: getCalmCoinsForGame(76),  // 5 CalmCoins
    replayCost: getReplayCostForGame(76), // 2 CalmCoins
    estimatedTime: '25 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-76'
  },
  {
    id: 'parent-education-77',
    title: 'Helping Hand Challenge',
    description: 'Build empathy through acts of kindness in your community',
    gameIndex: 77,
    calmCoins: getCalmCoinsForGame(77),  // 5 CalmCoins
    replayCost: getReplayCostForGame(77), // 2 CalmCoins
    estimatedTime: 'Varies',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-77'
  },
  {
    id: 'parent-education-78',
    title: 'Positive Parenting Circle',
    description: 'Join or form a parent peer group for emotional sharing',
    gameIndex: 78,
    calmCoins: getCalmCoinsForGame(78),  // 5 CalmCoins
    replayCost: getReplayCostForGame(78), // 2 CalmCoins
    estimatedTime: 'Varies',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-78'
  },
  {
    id: 'parent-education-79',
    title: 'Connection Reflection Journal',
    description: 'Reflect on how social ties improved your mood this week',
    gameIndex: 79,
    calmCoins: getCalmCoinsForGame(79),  // 5 CalmCoins
    replayCost: getReplayCostForGame(79), // 2 CalmCoins
    estimatedTime: '30 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-79'
  },
  {
    id: 'parent-education-80',
    title: 'Connected Parent Badge',
    description: 'Celebrate consistent efforts to nurture supportive relationships',
    gameIndex: 80,
    calmCoins: 0,  // Badge games don't award coins
    replayCost: 0, // Badge games can't be replayed
    estimatedTime: '0 min',
    difficulty: 'achievement',
    category: 'parent-education',
    totalQuestions: 0,
    totalLevels: 0,
    isBadgeGame: true,
    path: '/parent/games/parent-education/parent-education-80'
  },
  {
    id: 'parent-education-81',
    title: 'Why I Parent',
    description: 'Reconnect with the deeper reason you chose this parenting journey',
    gameIndex: 81,
    calmCoins: getCalmCoinsForGame(81),  // 5 CalmCoins
    replayCost: getReplayCostForGame(81), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-81'
  },
  {
    id: 'parent-education-82',
    title: 'Legacy Reflection',
    description: 'Identify what values and memories you wish to leave behind',
    gameIndex: 82,
    calmCoins: getCalmCoinsForGame(82),  // 5 CalmCoins
    replayCost: getReplayCostForGame(82), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-82'
  },
  {
    id: 'parent-education-83',
    title: 'Meaning in the Mundane',
    description: 'Find purpose in small, everyday parenting actions',
    gameIndex: 83,
    calmCoins: getCalmCoinsForGame(83),  // 5 CalmCoins
    replayCost: getReplayCostForGame(83), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-83'
  },
  {
    id: 'parent-education-84',
    title: 'Family Values Map',
    description: 'Define the 5 core values that guide your family decisions',
    gameIndex: 84,
    calmCoins: getCalmCoinsForGame(84),  // 5 CalmCoins
    replayCost: getReplayCostForGame(84), // 2 CalmCoins
    estimatedTime: '20 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-84'
  },
  {
    id: 'parent-education-85',
    title: 'My Parenting Mantra',
    description: 'Create a simple daily affirmation for parenting purpose',
    gameIndex: 85,
    calmCoins: getCalmCoinsForGame(85),  // 5 CalmCoins
    replayCost: getReplayCostForGame(85), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-85'
  },
  {
    id: 'parent-education-86',
    title: 'Fulfillment Journal',
    description: 'Reflect on moments of joy and pride in your parenting week',
    gameIndex: 86,
    calmCoins: getCalmCoinsForGame(86),  // 5 CalmCoins
    replayCost: getReplayCostForGame(86), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-86'
  },
  {
    id: 'parent-education-87',
    title: 'Family Vision Board',
    description: 'Visualize your family\'s dreams and goals together',
    gameIndex: 87,
    calmCoins: getCalmCoinsForGame(87),  // 5 CalmCoins
    replayCost: getReplayCostForGame(87), // 2 CalmCoins
    estimatedTime: '25 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-87'
  },
  {
    id: 'parent-education-88',
    title: 'Generational Gratitude',
    description: 'Acknowledge lessons learned from parents, elders, and mentors',
    gameIndex: 88,
    calmCoins: getCalmCoinsForGame(88),  // 5 CalmCoins
    replayCost: getReplayCostForGame(88), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'intermediate',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-88'
  },
  {
    id: 'parent-education-89',
    title: 'Purpose Alignment Quiz',
    description: 'See if daily actions match your parenting goals and values',
    gameIndex: 89,
    calmCoins: getCalmCoinsForGame(89),  // 5 CalmCoins
    replayCost: getReplayCostForGame(89), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-89'
  },
  {
    id: 'parent-education-90',
    title: 'Purposeful Parent Badge',
    description: 'Celebrate parents who raise families guided by love and intention',
    gameIndex: 90,
    calmCoins: 0,  // Badge games don't award coins
    replayCost: 0, // Badge games can't be replayed
    estimatedTime: '0 min',
    difficulty: 'achievement',
    category: 'parent-education',
    totalQuestions: 0,
    totalLevels: 0,
    isBadgeGame: true,
    path: '/parent/games/parent-education/parent-education-90'
  },
  {
    id: 'parent-education-91',
    title: 'Screen-Time Mirror',
    description: 'Recognize your daily digital habits and their emotional effects',
    gameIndex: 91,
    calmCoins: getCalmCoinsForGame(91),  // 5 CalmCoins
    replayCost: getReplayCostForGame(91), // 2 CalmCoins
    estimatedTime: '25 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-91'
  },
  {
    id: 'parent-education-92',
    title: 'Family No-Screen Hour',
    description: 'Build collective family time without devices',
    gameIndex: 92,
    calmCoins: getCalmCoinsForGame(92),  // 5 CalmCoins
    replayCost: getReplayCostForGame(92), // 2 CalmCoins
    estimatedTime: '65 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-92'
  },
  {
    id: 'parent-education-93',
    title: 'Digital Boundaries Quiz',
    description: 'Set realistic limits for technology use at home',
    gameIndex: 93,
    calmCoins: getCalmCoinsForGame(93),  // 5 CalmCoins
    replayCost: getReplayCostForGame(93), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-93'
  },
  {
    id: 'parent-education-94',
    title: 'Evening Log-Off Ritual',
    description: 'End the day with calm instead of scrolling',
    gameIndex: 94,
    calmCoins: getCalmCoinsForGame(94),  // 5 CalmCoins
    replayCost: getReplayCostForGame(94), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-94'
  },
  {
    id: 'parent-education-95',
    title: 'Nature Reconnect',
    description: 'Refresh the senses by connecting with the natural world',
    gameIndex: 95,
    calmCoins: getCalmCoinsForGame(95),  // 5 CalmCoins
    replayCost: getReplayCostForGame(95), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-95'
  },
  {
    id: 'parent-education-96',
    title: 'Self-Care Inventory',
    description: 'Assess your balance of rest, nutrition, exercise, and joy',
    gameIndex: 96,
    calmCoins: getCalmCoinsForGame(96),  // 5 CalmCoins
    replayCost: getReplayCostForGame(96), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-96'
  },
  {
    id: 'parent-education-97',
    title: 'Morning Nourish Routine',
    description: 'Start the day with grounded, mindful self-nourishment',
    gameIndex: 97,
    calmCoins: getCalmCoinsForGame(97),  // 5 CalmCoins
    replayCost: getReplayCostForGame(97), // 2 CalmCoins
    estimatedTime: '15 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-97'
  },
  {
    id: 'parent-education-98',
    title: 'Silence Challenge',
    description: 'Enjoy moments of silence without the urge to check your phone',
    gameIndex: 98,
    calmCoins: getCalmCoinsForGame(98),  // 5 CalmCoins
    replayCost: getReplayCostForGame(98), // 2 CalmCoins
    estimatedTime: '7 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-98'
  },
  {
    id: 'parent-education-99',
    title: 'Rest & Recharge Plan',
    description: 'Create a personalized rest schedule for physical and emotional renewal',
    gameIndex: 99,
    calmCoins: getCalmCoinsForGame(99),  // 5 CalmCoins
    replayCost: getReplayCostForGame(99), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'parent-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/parent/games/parent-education/parent-education-99'
  },
  {
    id: 'parent-education-100',
    title: 'Self-Care Champion Badge',
    description: 'Reward parents who consistently model self-care and digital discipline',
    gameIndex: 100,
    calmCoins: 0,  // Badge games don't award coins
    replayCost: 0, // Badge games can't be replayed
    estimatedTime: '0 min',
    difficulty: 'achievement',
    category: 'parent-education',
    totalQuestions: 0,
    totalLevels: 0,
    isBadgeGame: true,
    path: '/parent/games/parent-education/parent-education-100'
  },
  // More games will be added here later
];

/**
 * Get game data by ID
 */
export const getParentEducationGameById = (gameId) => {
  return parentEducationGameData.find(game => game.id === gameId) || null;
};

/**
 * Get all parent education games
 */
export const getAllParentEducationGames = () => {
  return parentEducationGameData;
};

