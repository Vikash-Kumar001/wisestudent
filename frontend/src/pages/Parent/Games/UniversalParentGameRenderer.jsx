import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import parentGameCategories, { getParentGame } from './index';

const UniversalParentGameRenderer = () => {
  const { category, gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentGame, setCurrentGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate and load game component
  useEffect(() => {
    console.log('Loading parent game:', { category, gameId });

    // Validate parameters
    if (!category || !gameId) {
      setError('Missing required parameters: category and game');
      setLoading(false);
      return;
    }

    // Validate category exists
    const catData = parentGameCategories[category];
    if (!catData) {
      setError(`Unknown category: ${category}`);
      setLoading(false);
      return;
    }

    // Get the game component function
    const GameComponent = getParentGame(category, gameId);

    if (!GameComponent) {
      setError(`Game not found: ${gameId} in ${category}`);
      setLoading(false);
      return;
    }

    setCurrentGame(() => GameComponent);
    setLoading(false);
  }, [category, gameId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/parent/games')}
            className="text-blue-600 hover:underline"
          >
            Back to Parent Games
          </button>
        </div>
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Not Found</h2>
          <p className="text-gray-600 mb-4">The requested game could not be loaded.</p>
          <button
            onClick={() => navigate('/parent/games')}
            className="text-blue-600 hover:underline"
          >
            Back to Parent Games
          </button>
        </div>
      </div>
    );
  }

  // Render the game component
  const GameComponent = currentGame;
  return <GameComponent />;
};

export default UniversalParentGameRenderer;

