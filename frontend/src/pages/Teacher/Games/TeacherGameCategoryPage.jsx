import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Lock, Play, RefreshCw, Trophy, Clock, Gamepad2, Sparkles, Brain, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import { useWallet } from "../../../context/WalletContext";
import { toast } from "react-hot-toast";
import { getAllTeacherEducationGames } from "./TeacherEducation/data/gameData";
import { getReplayCostForGame, getGameIndexFromId } from "../../../utils/teacherGameUtils";
import teacherGameCompletionService from "../../../services/teacherGameCompletionService";

const TeacherGameCategoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { wallet, refreshWallet } = useWallet();
  const { category } = useParams();
  
  const [games, setGames] = useState([]);
  const [gameCompletionStatus, setGameCompletionStatus] = useState({});
  const [gameProgressData, setGameProgressData] = useState({});
  const [processingReplay, setProcessingReplay] = useState(false);
  const [showReplayConfirmModal, setShowReplayConfirmModal] = useState(false);
  const [selectedGameForReplay, setSelectedGameForReplay] = useState(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  // Load game completion status
  const loadGameCompletionStatus = useCallback(async () => {
    if (!user?._id) return;

    try {
      setIsLoadingProgress(true);
      
      // Get all teacher education games
      const allGames = getAllTeacherEducationGames();
      const gameIds = allGames.map(game => game.id);

      // Fetch progress for all games
      const progressPromises = gameIds.map(gameId =>
        teacherGameCompletionService.getGameProgress(gameId).catch(() => null)
      );

      const progressResults = await Promise.all(progressPromises);
      
      const status = {};
      const progress = {};

      progressResults.forEach((result, index) => {
        if (result) {
          const gameId = gameIds[index];
          status[gameId] = result.fullyCompleted === true;
          progress[gameId] = result;
        }
      });

      setGameCompletionStatus(status);
      setGameProgressData(progress);
    } catch (error) {
      console.error('Failed to load game completion status:', error);
    } finally {
      setIsLoadingProgress(false);
    }
  }, [user]);

  useEffect(() => {
    if (category === 'teacher-education') {
      const allGames = getAllTeacherEducationGames();
      setGames(allGames);
      loadGameCompletionStatus();
    }
  }, [category, loadGameCompletionStatus]);

  // Listen for game completion events
  useEffect(() => {
    const handleGameCompleted = (event) => {
      const { gameId, fullyCompleted } = event?.detail || {};
      if (gameId && fullyCompleted) {
        setGameCompletionStatus(prev => ({
          ...prev,
          [gameId]: true
        }));
        loadGameCompletionStatus();
        if (refreshWallet) {
          refreshWallet();
        }
      }
    };

    window.addEventListener('teacherGameCompleted', handleGameCompleted);
    return () => {
      window.removeEventListener('teacherGameCompleted', handleGameCompleted);
    };
  }, [loadGameCompletionStatus, refreshWallet]);

  const handleGameClick = (game) => {
    const gameIndex = getGameIndexFromId(game.id);
    const replayCost = getReplayCostForGame(gameIndex);
    const progress = gameProgressData[game.id];
    const isFullyCompleted = gameCompletionStatus[game.id] === true;
    const canReplay = isFullyCompleted && progress?.replayUnlocked === true;

    // Check if game needs replay unlock
    if (isFullyCompleted && !canReplay) {
      toast.error(
        `This game is locked. Unlock replay for ${replayCost} CalmCoins to play again.`,
        {
          duration: 4000,
          position: "bottom-center",
          icon: "🔒",
        }
      );
      return;
    }

    // Navigate to game
    navigate(`/school-teacher/games/${category}/${game.id}`, {
      state: {
        returnPath: `/school-teacher/games/${category}`,
        totalCoins: game.calmCoins,
        gameIndex: game.gameIndex,
        isReplay: canReplay
      }
    });
  };

  const handleUnlockReplayClick = (game, e) => {
    e?.stopPropagation();
    if (processingReplay) return;

    const gameIndex = getGameIndexFromId(game.id);
    const replayCost = getReplayCostForGame(gameIndex);

    // Check wallet balance
    if (!wallet || wallet.balance < replayCost) {
      toast.error(
        `Insufficient balance! You need ${replayCost} CalmCoins to unlock replay.`,
        {
          duration: 4000,
          position: "bottom-center",
          icon: "💰",
        }
      );
      return;
    }

    setSelectedGameForReplay(game);
    setShowReplayConfirmModal(true);
  };

  const handleUnlockReplay = async () => {
    if (!selectedGameForReplay) return;

    const game = selectedGameForReplay;
    const gameIndex = getGameIndexFromId(game.id);
    const replayCost = getReplayCostForGame(gameIndex);

    setProcessingReplay(true);
    setShowReplayConfirmModal(false);

    try {
      const result = await teacherGameCompletionService.unlockReplay(game.id, gameIndex);

      if (result.success) {
        // Update progress data
        setGameProgressData(prev => ({
          ...prev,
          [game.id]: {
            ...prev[game.id],
            replayUnlocked: true
          }
        }));

        // Refresh wallet
        if (refreshWallet) {
          refreshWallet();
        }
      }
    } catch (error) {
      console.error('Failed to unlock replay:', error);
    } finally {
      setProcessingReplay(false);
      setSelectedGameForReplay(null);
    }
  };

  const getGameStatus = (game) => {
    const isCompleted = gameCompletionStatus[game.id] === true;
    const progress = gameProgressData[game.id];
    const canReplay = isCompleted && progress?.replayUnlocked === true;
    const needsReplayUnlock = isCompleted && (!progress || progress.replayUnlocked !== true);

    return {
      isCompleted,
      canReplay,
      needsReplayUnlock,
      isLocked: needsReplayUnlock
    };
  };

  if (category !== 'teacher-education') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Category not found</h1>
          <button
            onClick={() => navigate('/school-teacher/games')}
            className="text-purple-600 hover:underline"
          >
            Back to Teacher Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ x: -5 }}
                  onClick={() => navigate('/school-teacher/games')}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg border border-white/30 transition-all"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </motion.button>
                <motion.div
                  className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    Mental Health & Emotional Regulation
                  </h1>
                  <p className="text-sm text-white/90">
                    Core self-awareness and stress balance for teachers
                  </p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-lg">
                    {wallet?.balance || 0} CalmCoins
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {isLoadingProgress ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => {
              const status = getGameStatus(game);
              const replayCost = getReplayCostForGame(game.gameIndex);
              
              // Different gradient colors for each game
              const gradients = [
                { bg: 'from-blue-50 via-cyan-50 to-indigo-50', icon: 'from-blue-500 to-cyan-600', border: 'border-blue-200' },
                { bg: 'from-purple-50 via-pink-50 to-rose-50', icon: 'from-purple-500 to-pink-600', border: 'border-purple-200' },
                { bg: 'from-emerald-50 via-teal-50 to-cyan-50', icon: 'from-emerald-500 to-teal-600', border: 'border-emerald-200' },
                { bg: 'from-amber-50 via-orange-50 to-red-50', icon: 'from-amber-500 to-orange-600', border: 'border-amber-200' },
                { bg: 'from-violet-50 via-indigo-50 to-purple-50', icon: 'from-violet-500 to-indigo-600', border: 'border-violet-200' },
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={!status.isLocked ? { y: -8, scale: 1.02 } : {}}
                  onClick={() => !status.isLocked && handleGameClick(game)}
                  className={`group relative overflow-hidden rounded-3xl border-2 ${gradient.border} bg-gradient-to-br ${gradient.bg} shadow-xl cursor-pointer transition-all hover:shadow-2xl ${
                    status.isLocked ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white to-transparent rounded-full blur-xl"></div>
                  </div>

                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-slate-900">{game.title}</h3>
                          {status.isCompleted && (
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 10, 0] }}
                              transition={{ duration: 0.5, delay: 1 }}
                            >
                              <Trophy className="w-5 h-5 text-yellow-500" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{game.description}</p>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient.icon} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
                      >
                        <Gamepad2 className="w-6 h-6" />
                      </motion.div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Clock className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-semibold text-slate-700">{game.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-semibold text-slate-700">{game.calmCoins} Coins</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/50">
                      {status.isLocked ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleUnlockReplayClick(game, e)}
                          disabled={processingReplay}
                          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 w-full justify-center"
                        >
                          <Lock className="w-4 h-4" />
                          <span className="font-semibold">Unlock ({replayCost} Coins)</span>
                        </motion.button>
                      ) : status.canReplay ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleGameClick(game)}
                          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all w-full justify-center font-semibold"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Play Again
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleGameClick(game)}
                          className={`flex items-center gap-2 bg-gradient-to-r ${gradient.icon} text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all w-full justify-center font-semibold`}
                        >
                          <Play className="w-4 h-4" />
                          {status.isCompleted ? 'Review' : 'Start Game'}
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  {!status.isLocked && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient.icon} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Replay Confirmation Modal */}
      {showReplayConfirmModal && selectedGameForReplay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setShowReplayConfirmModal(false);
            setSelectedGameForReplay(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Unlock Replay?</h3>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Unlock replay for <strong className="text-slate-900">{selectedGameForReplay.title}</strong> for{' '}
              <strong className="text-purple-600">{getReplayCostForGame(getGameIndexFromId(selectedGameForReplay.id))} CalmCoins</strong>?
            </p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowReplayConfirmModal(false);
                  setSelectedGameForReplay(null);
                }}
                className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUnlockReplay}
                disabled={processingReplay}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-semibold"
              >
                {processingReplay ? 'Processing...' : 'Unlock'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TeacherGameCategoryPage;

