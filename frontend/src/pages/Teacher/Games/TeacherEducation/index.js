// Import all teacher education game components
import ClassroomEmotions from './games/ClassroomEmotions';
import StressResponse from './games/StressResponse';

/**
 * Teacher Education Games Registry
 * Maps game IDs to their React components
 */
const teacherEducationGames = {
  'classroom-emotions': ClassroomEmotions,
  'teacher-education-1': ClassroomEmotions, // Alias for game ID
  'stress-response': StressResponse,
  'teacher-education-2': StressResponse, // Alias for game ID
  // More games will be added here later
};

/**
 * Get a teacher education game component by game ID
 * @param {string} gameId - Game identifier (e.g., 'classroom-emotions' or 'teacher-education-1')
 * @returns {React.Component|null} - Game component or null if not found
 */
export const getTeacherEducationGame = (gameId) => {
  // Try direct match first
  if (teacherEducationGames[gameId]) {
    return teacherEducationGames[gameId];
  }
  
  // Try to extract game slug from gameId (e.g., 'teacher-education-1' -> 'classroom-emotions')
  // Map game IDs to their component slugs
  const gameIdToSlug = {
    'teacher-education-1': 'classroom-emotions',
    'teacher-education-2': 'stress-response',
  };
  
  // If gameId matches a mapped ID, use the slug
  if (gameIdToSlug[gameId]) {
    return teacherEducationGames[gameIdToSlug[gameId]] || null;
  }
  
  // Try to extract slug from gameId if it contains hyphens
  // For format like 'teacher-education-classroom-emotions'
  const parts = gameId.split('-');
  if (parts.length > 2) {
    // Extract the slug part (everything after 'teacher-education-')
    const slug = parts.slice(2).join('-');
    if (teacherEducationGames[slug]) {
      return teacherEducationGames[slug];
    }
  }
  
  return null;
};

export default teacherEducationGames;

