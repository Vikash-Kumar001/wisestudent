import { getCalmCoinsForGame, getReplayCostForGame } from '../../../../../utils/teacherGameUtils';

/**
 * Teacher Education Game Data
 * Each game has exactly 5 questions
 * CalmCoins are awarded per game (not per question)
 */
export const teacherEducationGameData = [
  {
    id: 'teacher-education-1',
    title: 'Classroom Emotions',
    description: 'Recognize and respond to student emotions effectively',
    gameIndex: 1,
    calmCoins: getCalmCoinsForGame(1),  // 5 CalmCoins
    replayCost: getReplayCostForGame(1), // 2 CalmCoins
    estimatedTime: '12 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/teacher-education/teacher-education-1'
  },
  {
    id: 'teacher-education-2',
    title: 'Stress Response',
    description: 'Identify stress signals and practice self-regulation',
    gameIndex: 2,
    calmCoins: getCalmCoinsForGame(2),  // 5 CalmCoins
    replayCost: getReplayCostForGame(2), // 2 CalmCoins
    estimatedTime: '10 min',
    difficulty: 'beginner',
    category: 'teacher-education',
    totalQuestions: 5,
    totalLevels: 5,
    path: '/school-teacher/games/teacher-education/teacher-education-2'
  },
  // More games will be added here later
];

/**
 * Get game data by ID
 */
export const getTeacherEducationGameById = (gameId) => {
  return teacherEducationGameData.find(game => game.id === gameId) || null;
};

/**
 * Get all teacher education games
 */
export const getAllTeacherEducationGames = () => {
  return teacherEducationGameData;
};

