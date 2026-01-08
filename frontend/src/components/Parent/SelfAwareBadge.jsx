import React, { useState, useEffect } from 'react';
import { Award, X } from 'lucide-react';
import parentBadgeService from '../../services/parentBadgeService';

const SelfAwareBadge = ({ onClose }) => {
  const [badgeStatus, setBadgeStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadgeStatus();
  }, []);

  const loadBadgeStatus = async () => {
    try {
      setLoading(true);
      const result = await parentBadgeService.getSelfAwareBadgeStatus();
      setBadgeStatus(result);
    } catch (error) {
      console.error('Failed to load badge status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading badge status...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasBadge = badgeStatus?.hasBadge === true;
  const newlyEarned = badgeStatus?.newlyEarned === true;
  const gamesCompleted = badgeStatus?.gamesCompleted || 0;
  const gamesNeeded = badgeStatus?.gamesNeeded || 5;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Badge Content */}
        <div className="p-8">
          {hasBadge ? (
            <>
              {/* Badge Earned */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 mb-4 animate-bounce">
                  <span className="text-5xl">🧘</span>
                </div>
                {newlyEarned && (
                  <div className="mb-4">
                    <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full animate-pulse">
                      🎉 New Badge Earned!
                    </div>
                  </div>
                )}
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Self-Aware Parent
                </h2>
                <p className="text-xl text-purple-600 font-medium italic mb-4">
                  "Understanding yourself brings peace."
                </p>
                <p className="text-gray-600">
                  You've completed {gamesCompleted} awareness games!
                </p>
              </div>

              {/* Badge Details */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-purple-800 mb-2">Parent Tip:</h3>
                    <p className="text-sm text-purple-700">
                      Display your badge proudly—your calm benefits everyone. Your commitment to self-awareness creates a more peaceful home environment for your family.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Badge Not Earned */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 mb-4">
                  <span className="text-5xl opacity-50">🧘</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Self-Aware Parent
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  Complete 5 awareness games to unlock this badge
                </p>
              </div>

              {/* Progress */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-gray-200">
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{gamesCompleted} / 5 games completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(gamesCompleted / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {gamesNeeded > 0
                    ? `Complete ${gamesNeeded} more game${gamesNeeded > 1 ? 's' : ''} to unlock!`
                    : 'Almost there! Complete one more game.'}
                </p>
              </div>

              {/* Games to Complete */}
              <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-xs font-semibold text-blue-800 mb-2">Awareness Games:</p>
                <p className="text-xs text-blue-700">
                  Complete games like Mood Journal, Thought Catcher, and Mirror Moment to build your self-awareness skills.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelfAwareBadge;

