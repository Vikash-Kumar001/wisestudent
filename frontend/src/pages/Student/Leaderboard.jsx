import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Trophy,
    Crown,
    Medal,
    Star,
    Flame,
    Zap,
    TrendingUp,
    Award,
    Sparkles,
    Target,
    Shield,
    Rocket,
    ChevronUp,
    ChevronDown,
    User,
    ArrowUp,
    ArrowDown,
    Minus,
    Play,
    GamepadIcon,
    CheckCircle,
    Calendar,
    Activity,
    TrendingDown,
    Users,
    Clock
} from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../hooks/useAuth";
import api from "../../utils/api";

const Leaderboard = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('allTime');
    const [games, setGames] = useState([]);
    const [showPlayOptions, setShowPlayOptions] = useState(null);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [currentUserInfo, setCurrentUserInfo] = useState(null); // User info if outside top 50
    const { socket } = useSocket();
    const dropdownRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    // Use refs to track previous leaders per period to avoid dependency loops
    const previousLeadersRef = useRef(new Map()); // Map<period, Array>
    const periodRef = useRef(selectedPeriod);

    // Calculate user age for age-appropriate UI
    const userAge = useMemo(() => {
        if (!currentUser) return null;
        const dob = currentUser.dateOfBirth || currentUser.dob;
        if (!dob) return null;
        
        const dobDate = typeof dob === 'string' ? new Date(dob) : dob;
        if (isNaN(dobDate.getTime())) return null;
        
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }
        
        return age;
    }, [currentUser]);

    // Determine age group
    const ageGroup = useMemo(() => {
        if (userAge === null) return 'adults'; // Default
        if (userAge < 13) return 'kids';
        if (userAge < 18) return 'teens';
        return 'adults';
    }, [userAge]);

    // Age-appropriate theme configuration
    const themeConfig = useMemo(() => {
        switch (ageGroup) {
            case 'kids':
                return {
                    primaryGradient: 'from-purple-400 via-pink-400 to-orange-400',
                    secondaryGradient: 'from-blue-400 to-purple-400',
                    accentColor: 'purple',
                    title: 'Super Star Leaders!',
                    titleEmoji: '🌟',
                    subtitle: 'Check out the top performers and climb the ranks!',
                    emoji: '⭐',
                    cardStyle: 'colorful'
                };
            case 'teens':
                return {
                    primaryGradient: 'from-indigo-500 via-purple-500 to-pink-500',
                    secondaryGradient: 'from-blue-500 to-cyan-500',
                    accentColor: 'indigo',
                    title: 'Champions Arena',
                    titleEmoji: '🏆',
                    subtitle: 'Battle for the top spot and claim your glory! ⚡',
                    emoji: '🏆',
                    cardStyle: 'modern'
                };
            default: // adults
                return {
                    primaryGradient: 'from-yellow-600 via-orange-600 to-red-600',
                    secondaryGradient: 'from-indigo-600 to-purple-600',
                    accentColor: 'orange',
                    title: 'Leaderboard',
                    titleEmoji: '🏆',
                    subtitle: 'Top performers and achievers',
                    emoji: '🏆',
                    cardStyle: 'professional'
                };
        }
    }, [ageGroup]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowPlayOptions(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch games data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const gamesResponse = await api.get('/api/game/games');
                setGames(Array.isArray(gamesResponse.data) ? gamesResponse.data : []);
            } catch (error) {
                console.debug('Games not available for play options:', error.message);
                setGames([]);
            }
        };
        
        fetchData();
    }, []);

    // Calculate position changes between updates
    const calculatePositionChanges = useCallback((newLeaders, oldLeaders) => {
        if (!oldLeaders || oldLeaders.length === 0) {
            return newLeaders.map(entry => ({ ...entry, positionChange: 0 }));
        }

        const oldMap = new Map(oldLeaders.map((entry, index) => [
            entry._id?.toString() || entry.id?.toString(),
            { rank: index + 1, entry }
        ]));

        return newLeaders.map((entry, newIndex) => {
            const userId = entry._id?.toString() || entry.id?.toString();
            const oldData = oldMap.get(userId);
            
            if (!oldData) {
                return { ...entry, positionChange: 0, rank: newIndex + 1 };
            }

            const oldRank = oldData.rank;
            const newRank = newIndex + 1;
            const positionChange = oldRank - newRank; // Positive means moved up

            return {
                ...entry,
                rank: newRank,
                positionChange
            };
        });
    }, []);

    // Fallback function to fetch leaderboard via API
    const fetchLeaderboardAPI = useCallback(async (period = selectedPeriod) => {
        try {
            setLoading(true);
            setError(null);
            console.log(`📊 Fetching leaderboard for period: ${period}`);
            const response = await api.get(`/api/stats/leaderboard-snippet?period=${period}`);
            
            if (response.data) {
                const leaderboardData = response.data.leaderboard || [];
                console.log(`📊 Received ${leaderboardData.length} entries for period: ${period}`);
                
                // If leaderboard is empty, show empty state
                if (leaderboardData.length === 0) {
                    console.log(`📊 No data for period: ${period}, showing empty state`);
                    setLeaders([]);
                    setLoading(false);
                    setLastUpdate(new Date());
                    return;
                }
                
                const list = leaderboardData.map((entry, index) => {
                    let isCurrent = false;
                    if (entry.isCurrentUser !== undefined) {
                        isCurrent = entry.isCurrentUser;
                    } else if (currentUser && entry._id && currentUser._id) {
                        isCurrent = entry._id.toString() === currentUser._id.toString();
                    }
                    
                    return {
                        ...entry,
                        rank: entry.rank || index + 1,
                        xp: entry.xp || 0,
                        level: entry.level || Math.floor((entry.xp || 0) / 1000) + 1,
                        name: entry.name || 'Unknown',
                        username: entry.username || 'user',
                        isCurrentUser: isCurrent,
                        positionChange: entry.positionChange || 0
                    };
                });
                
                // Get previous leaders for this period from ref
                const previousLeaders = previousLeadersRef.current.get(period) || [];
                
                // Calculate position changes
                const leadersWithChanges = calculatePositionChanges(list, previousLeaders);
                
                // Store current list as previous for next comparison
                previousLeadersRef.current.set(period, [...list]);
                setLeaders(leadersWithChanges);
                
                // Store current user info from response
                if (response.data.currentUserInfo) {
                    setCurrentUserInfo(response.data.currentUserInfo);
                } else {
                    setCurrentUserInfo(null);
                }
                
                setLastUpdate(new Date());
                console.log(`✅ Successfully loaded ${leadersWithChanges.length} entries for period: ${period}`);
                console.log(`📍 Current user rank: ${response.data.currentUserRank || 'N/A'}`);
            } else {
                console.warn(`⚠️ No data in response for period: ${period}`);
                setLeaders([]);
                setCurrentUserInfo(null);
            }
            setLoading(false);
        } catch (err) {
            console.error('❌ Error fetching leaderboard:', err);
            
            // Check if it's a service worker offline error (503)
            const isOfflineError = err.response?.status === 503 || 
                                  err.message?.includes('offline') || 
                                  err.message?.includes('Service Unavailable');
            
            if (isOfflineError) {
                // If we have a socket connection, try to use that instead
                if (socket && socket.connected) {
                    console.log('🔄 API failed but socket is connected, using socket instead');
                    // The socket will handle it, just set error to null
                    setError(null);
                    setLoading(false);
                    return;
                }
                // Otherwise show offline message
                setError('You appear to be offline. Please check your connection.');
            } else {
                setError('Failed to load leaderboard. Please try again.');
            }
            
            setLeaders([]);
            setLoading(false);
        }
    }, [selectedPeriod, currentUser, calculatePositionChanges, socket]);

    // Update period ref when selectedPeriod changes
    useEffect(() => {
        periodRef.current = selectedPeriod;
    }, [selectedPeriod]);

    // Socket connection for leaderboard
    useEffect(() => {
        const currentPeriod = selectedPeriod;
        
        if (!socket) {
            fetchLeaderboardAPI(currentPeriod);
            setIsConnected(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        const handleConnect = () => {
            setIsConnected(true);
            console.log('✅ Socket connected, subscribing to leaderboard');
            try {
                socket.emit('student:leaderboard:subscribe', { period: currentPeriod });
            } catch (err) {
                console.error("❌ Error subscribing to leaderboard:", err.message);
                setError('Failed to connect to leaderboard');
                setLoading(false);
                fetchLeaderboardAPI(currentPeriod);
            }
        };

        const handleDisconnect = () => {
            setIsConnected(false);
            console.log('⚠️ Socket disconnected, using API fallback');
            // Retry connection after a delay
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            reconnectTimeoutRef.current = setTimeout(() => {
                if (!socket.connected) {
                    fetchLeaderboardAPI(periodRef.current);
                }
            }, 2000);
        };

        // Subscribe to current period immediately if connected
        if (socket.connected) {
            socket.emit('student:leaderboard:subscribe', { period: currentPeriod });
        } else {
            socket.on('connect', handleConnect);
        }

        socket.on('disconnect', handleDisconnect);

        const handleData = (payload) => {
            try {
                // Only process data if it matches the currently selected period
                const currentPeriod = periodRef.current;
                if (payload?.period && payload.period !== currentPeriod) {
                    console.log(`Ignoring leaderboard data for period ${payload.period}, current period is ${currentPeriod}`);
                    return;
                }
                
                let list = [];
                if (Array.isArray(payload)) {
                    list = payload;
                } else if (payload?.leaderboard && Array.isArray(payload.leaderboard)) {
                    list = payload.leaderboard;
                }
                
                console.log(`📊 Socket received ${list.length} entries for period: ${currentPeriod}`);
                
                // If list is empty, still set it to show empty state
                if (list.length === 0) {
                    console.log(`📊 No data from socket for period: ${currentPeriod}, showing empty state`);
                    setLeaders([]);
                    setLoading(false);
                    setError(null);
                    setLastUpdate(new Date());
                    setIsConnected(true);
                    return;
                }
                
                const processedList = list.map((entry, index) => {
                    let isCurrent = false;
                    if (entry.isCurrentUser !== undefined) {
                        isCurrent = entry.isCurrentUser;
                    } else if (currentUser && entry._id && currentUser._id) {
                        isCurrent = entry._id.toString() === currentUser._id.toString();
                    }
                    
                    return {
                        ...entry,
                        rank: entry.rank || index + 1,
                        xp: entry.xp || 0,
                        level: entry.level || Math.floor((entry.xp || 0) / 1000) + 1,
                        name: entry.name || 'Unknown',
                        username: entry.username || 'user',
                        isCurrentUser: isCurrent,
                        positionChange: entry.positionChange || 0
                    };
                });
                
                // Get previous leaders for this period from ref
                const previousLeaders = previousLeadersRef.current.get(currentPeriod) || [];
                
                // Calculate position changes with animation
                const leadersWithChanges = calculatePositionChanges(processedList, previousLeaders);
                
                // Store current list as previous for next comparison
                previousLeadersRef.current.set(currentPeriod, [...processedList]);
                setLeaders(leadersWithChanges);
                
                // Note: Socket data doesn't include currentUserRank/Info yet
                // We'll keep the existing values from API fetch
                
                setLoading(false);
                setError(null);
                setLastUpdate(new Date());
                setIsConnected(true);
            } catch (err) {
                console.error('Error processing leaderboard data:', err);
                setError('Failed to process leaderboard data');
                setLoading(false);
            }
        };

        const handleError = (errorPayload) => {
            console.error('Leaderboard error:', errorPayload);
            setError(errorPayload?.message || 'Failed to load leaderboard');
            setLoading(false);
            fetchLeaderboardAPI(periodRef.current);
        };

        socket.on('student:leaderboard:data', handleData);
        socket.on('student:leaderboard:error', handleError);

        return () => {
            socket.off('student:leaderboard:data', handleData);
            socket.off('student:leaderboard:error', handleError);
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [socket, selectedPeriod, currentUser, fetchLeaderboardAPI, calculatePositionChanges]);

    // Listen for XP updates to refresh leaderboard
    useEffect(() => {
        if (!socket) return;

        const handleXPUpdate = () => {
            if (socket && socket.connected) {
                socket.emit('student:leaderboard:subscribe', { period: periodRef.current });
            } else {
                fetchLeaderboardAPI(periodRef.current);
            }
        };

        socket.on('xp:updated', handleXPUpdate);
        socket.on('game-completed', handleXPUpdate);
        socket.on('level-up', handleXPUpdate);

        return () => {
            socket.off('xp:updated', handleXPUpdate);
            socket.off('game-completed', handleXPUpdate);
            socket.off('level-up', handleXPUpdate);
        };
    }, [socket, fetchLeaderboardAPI]);

    const getRankBadge = (rank) => {
        switch (rank) {
            case 1: return "bg-gradient-to-r from-yellow-400 to-orange-400";
            case 2: return "bg-gradient-to-r from-gray-400 to-slate-400";
            case 3: return "bg-gradient-to-r from-amber-400 to-orange-400";
            default: return `bg-gradient-to-r ${themeConfig.secondaryGradient}`;
        }
    };

    const getPositionChange = (user) => {
        const change = user.positionChange || 0;
        
        if (change > 0) {
            return { 
                icon: <ArrowUp className="w-4 h-4 text-green-500" />, 
                text: `+${change}`, 
                color: "text-green-500",
                bgColor: "bg-green-100"
            };
        } else if (change < 0) {
            return { 
                icon: <ArrowDown className="w-4 h-4 text-red-500" />, 
                text: `${change}`, 
                color: "text-red-500",
                bgColor: "bg-red-100"
            };
        }
        return { 
            icon: <Minus className="w-4 h-4 text-gray-400" />, 
            text: "—", 
            color: "text-gray-400",
            bgColor: "bg-gray-100"
        };
    };

    const formatXP = (xp) => {
        if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
        if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
        return xp?.toLocaleString() || '0';
    };

    const formatTimeAgo = (date) => {
        if (!date) return 'Just now';
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 20,
            },
        },
    };

    const positionChangeVariants = {
        up: {
            scale: [1, 1.2, 1],
            y: [0, -5, 0],
            transition: { duration: 0.5 }
        },
        down: {
            scale: [1, 1.1, 1],
            y: [0, 5, 0],
            transition: { duration: 0.5 }
        }
    };

    const periods = [
        { value: 'daily', label: 'Today', icon: <Clock className="w-4 h-4" /> },
        { value: 'weekly', label: 'This Week', icon: <Calendar className="w-4 h-4" /> },
        { value: 'monthly', label: 'This Month', icon: <TrendingUp className="w-4 h-4" /> },
        { value: 'allTime', label: 'All Time', icon: <Trophy className="w-4 h-4" /> }
    ];
    
    const navigateToGame = (gameId) => {
        if (gameId) {
            navigate(`/student/games/${gameId}`);
        } else {
            navigate('/student/games');
        }
    };
    
    const togglePlayOptions = (index) => {
        setShowPlayOptions(showPlayOptions === index ? null : index);
    };

    if (loading && leaders.length === 0) {
        return (
            <div className={`min-h-screen bg-gradient-to-br ${ageGroup === 'kids' ? 'from-purple-50 via-pink-50 to-orange-50' : ageGroup === 'teens' ? 'from-indigo-50 via-purple-50 to-pink-50' : 'from-indigo-50 via-white to-purple-50'} p-4 sm:p-6 lg:p-8`}>
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className={`w-16 h-16 bg-gradient-to-r ${themeConfig.primaryGradient} rounded-full animate-pulse mx-auto mb-4 flex items-center justify-center`}>
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <div className="h-8 bg-gray-300 rounded animate-pulse w-64 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-48 mx-auto"></div>
                    </div>
                    <div className="space-y-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                                        <div className="h-3 bg-gray-300 rounded w-48"></div>
                                    </div>
                                    <div className="w-20 h-8 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const hasTopThree = Array.isArray(leaders) && leaders.filter(l => l && l.name && l.xp !== undefined).length >= 3;
    const topThree = hasTopThree ? leaders.slice(0, 3) : [];
    const restLeaders = hasTopThree ? leaders.slice(3) : leaders;

    return (
        <div className={`min-h-screen bg-gradient-to-br ${ageGroup === 'kids' ? 'from-purple-50 via-pink-50 to-orange-50' : ageGroup === 'teens' ? 'from-indigo-50 via-purple-50 to-pink-50' : 'from-indigo-50 via-white to-purple-50'} relative overflow-hidden`}>
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-20 left-10 w-64 h-64 bg-gradient-to-r ${themeConfig.primaryGradient} rounded-full opacity-20 blur-3xl animate-pulse`} />
                <div className={`absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r ${themeConfig.secondaryGradient} rounded-full opacity-15 blur-3xl animate-pulse`} style={{ animationDelay: '1s' }} />
                <div className={`absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r ${themeConfig.secondaryGradient} rounded-full opacity-20 blur-3xl animate-pulse`} style={{ animationDelay: '2s' }} />

                {/* Floating decorative elements */}
                <motion.div
                    className="absolute top-1/4 left-1/3 text-yellow-400 opacity-60 hidden md:block"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Trophy className="w-6 h-6" />
                </motion.div>
                <motion.div
                    className="absolute top-2/3 right-1/4 text-purple-400 opacity-50 hidden md:block"
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                >
                    <Star className="w-5 h-5" />
                </motion.div>
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        className="relative inline-block"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div className={`w-20 h-20 bg-gradient-to-r ${themeConfig.primaryGradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl`}>
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 text-purple-400 animate-bounce" style={{ animationDelay: '0.3s' }}>
                            <Star className="w-5 h-5" />
                        </div>
                    </motion.div>

                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black mb-3 flex items-center justify-center gap-2 text-center`}>
                        {themeConfig.titleEmoji && (
                            <span className="text-4xl sm:text-5xl lg:text-6xl" style={{ fontFamily: 'system-ui, -apple-system' }}>
                                {themeConfig.titleEmoji}
                            </span>
                        )}
                        <span className={`bg-gradient-to-r ${themeConfig.primaryGradient} bg-clip-text text-transparent drop-shadow-sm leading-tight`}>
                            {themeConfig.title}
                        </span>
                        {themeConfig.titleEmoji && (
                            <span className="text-4xl sm:text-5xl lg:text-6xl" style={{ fontFamily: 'system-ui, -apple-system' }}>
                                {themeConfig.titleEmoji}
                            </span>
                        )}
                    </h1>

                    <p className={`text-gray-600 text-lg sm:text-xl font-medium tracking-wide mb-4`}>
                        {themeConfig.subtitle}
                    </p>

                    {/* Connection Status & Last Update */}
                    <div className="flex items-center justify-center gap-4 mb-4 text-sm">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                            <span>{isConnected ? 'Live Updates' : 'Offline Mode'}</span>
                        </div>
                        {lastUpdate && (
                            <div className="flex items-center gap-2 text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>Updated {formatTimeAgo(lastUpdate)}</span>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md mx-auto"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Period Selector */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {periods.map((period) => (
                            <motion.button
                                key={period.value}
                                onClick={() => setSelectedPeriod(period.value)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                                    selectedPeriod === period.value
                                        ? `bg-gradient-to-r ${themeConfig.primaryGradient} text-white shadow-lg`
                                        : 'bg-white/80 text-gray-700 hover:bg-white shadow-md'
                                }`}
                            >
                                {period.icon}
                                {period.label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Top 3 Podium */}
                {hasTopThree && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8 sm:mb-12"
                    >
                        <div className="flex items-end justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                            {/* Second Place */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center"
                            >
                                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-400 to-slate-400 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-xl relative">
                                    <span className="text-white font-black text-xl sm:text-2xl">2</span>
                                    {topThree[1]?.positionChange > 0 && (
                                        <motion.div
                                            variants={positionChangeVariants}
                                            animate="up"
                                            className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                                        >
                                            +{topThree[1].positionChange}
                                        </motion.div>
                                    )}
                                </div>
                                <div className="bg-gradient-to-r from-gray-400 to-slate-400 h-16 w-16 sm:h-24 sm:w-24 rounded-t-3xl flex items-center justify-center mx-auto shadow-xl">
                                    <Medal className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center justify-center gap-2">
                                        {topThree[1]?.name || '-'}
                                        {topThree[1]?.isCurrentUser && (
                                            <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
                                                YOU
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
                                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                                        {formatXP(topThree[1]?.xp || 0)} XP
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Level {topThree[1]?.level || 1}</p>
                                </div>
                            </motion.div>

                            {/* First Place */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-center"
                            >
                                <div className={`w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r ${themeConfig.primaryGradient} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-2xl relative`}>
                                    <span className="text-white font-black text-2xl sm:text-3xl">1</span>
                                    <motion.div
                                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
                                        // animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-ping" />
                                    </motion.div>
                                </div>
                                <div className={`bg-gradient-to-r ${themeConfig.primaryGradient} h-20 w-20 sm:h-32 sm:w-28 rounded-t-3xl flex items-center justify-center mx-auto shadow-2xl`}>
                                    <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <h3 className={`font-bold text-gray-800 text-base sm:text-lg flex items-center justify-center gap-2`}>
                                        {topThree[0]?.name || '-'}
                                        {topThree[0]?.isCurrentUser && (
                                            <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
                                                YOU
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
                                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                                        {formatXP(topThree[0]?.xp || 0)} XP
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Level {topThree[0]?.level || 1}</p>
                                </div>
                            </motion.div>

                            {/* Third Place */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="text-center"
                            >
                                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-xl relative">
                                    <span className="text-white font-black text-xl sm:text-2xl">3</span>
                                    {topThree[2]?.positionChange > 0 && (
                                        <motion.div
                                            variants={positionChangeVariants}
                                            animate="up"
                                            className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                                        >
                                            +{topThree[2].positionChange}
                                        </motion.div>
                                    )}
                                </div>
                                <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-16 w-16 sm:h-20 sm:w-24 rounded-t-3xl flex items-center justify-center mx-auto shadow-xl">
                                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center justify-center gap-2">
                                        {topThree[2]?.name || '-'}
                                        {topThree[2]?.isCurrentUser && (
                                            <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
                                                YOU
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
                                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                                        {formatXP(topThree[2]?.xp || 0)} XP
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Level {topThree[2]?.level || 1}</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* Leaderboard List */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedPeriod}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        {restLeaders.map((user, index) => {
                            const actualRank = hasTopThree ? index + 4 : index + 1;
                            const position = getPositionChange(user);
                            const isCurrentUser = user.isCurrentUser !== undefined 
                                ? user.isCurrentUser 
                                : (currentUser && user._id && currentUser._id && 
                                    user._id.toString() === currentUser._id.toString());
                            const hasPositionChange = user.positionChange !== 0;

                            return (
                                <motion.div
                                    key={user._id || user.id || index}
                                    layout
                                    variants={itemVariants}
                                    initial={hasPositionChange ? (user.positionChange > 0 ? "up" : "down") : false}
                                    whileHover={{
                                        scale: 1.02,
                                        y: -2,
                                        transition: { duration: 0.2 }
                                    }}
                                    className={`bg-white/90 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg border transition-all duration-300 relative overflow-hidden ${
                                        isCurrentUser 
                                            ? `ring-2 ring-yellow-400 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50` 
                                            : 'border-white/40 hover:shadow-xl'
                                    }`}
                                >
                                    {isCurrentUser && (
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400" />
                                    )}

                                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
                                        {/* Rank Badge */}
                                        <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${getRankBadge(actualRank)} flex items-center justify-center shadow-lg relative flex-shrink-0`}>
                                            <span className="text-white font-black text-base sm:text-xl">#{actualRank}</span>
                                            {hasPositionChange && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className={`absolute -top-1 -right-1 ${position.bgColor} rounded-full w-5 h-5 flex items-center justify-center`}
                                                >
                                                    {position.icon}
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-0.5 sm:mb-1">
                                                <h3 className={`text-base sm:text-lg font-bold truncate ${
                                                    isCurrentUser ? 'text-yellow-700' : 'text-gray-800'
                                                }`}>
                                                    {user.name}
                                                    {isCurrentUser && (
                                                        <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
                                                            YOU
                                                        </span>
                                                    )}
                                                </h3>
                                                {hasPositionChange && (
                                                    <motion.span
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${position.color} ${position.bgColor}`}
                                                    >
                                                        {position.text}
                                                    </motion.span>
                                                )}
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 truncate">
                                                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                                @{user.username || 'user'}
                                            </p>
                                        </div>

                                        {/* Position Change and XP */}
                                        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                                            {/* XP */}
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 text-indigo-600 font-bold">
                                                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="text-base sm:text-lg">{formatXP(user.xp)}</span>
                                                </div>
                                                <div className="text-xs text-gray-500">Level {user.level || 1}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Achievement badges and Play button */}
                                    <div className="mt-3 flex flex-wrap justify-between items-center gap-2">
                                        <div className="flex flex-wrap gap-2">
                                            {actualRank <= 3 && (
                                                <>
                                                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                        <Star className="w-3 h-3" />
                                                        Elite Player
                                                    </div>
                                                    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                        <Zap className="w-3 h-3" />
                                                        High Scorer
                                                    </div>
                                                </>
                                            )}
                                            {actualRank <= 10 && actualRank > 3 && (
                                                <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                    <TrendingUp className="w-3 h-3" />
                                                    Top 10
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Play Button */}
                                        <div className="relative" ref={dropdownRef}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => togglePlayOptions(actualRank - 1)}
                                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md hover:shadow-lg transition-all"
                                            >
                                                <Play className="w-3 h-3" />
                                                Play Now
                                            </motion.button>
                                            
                                            {/* Play Options Dropdown */}
                                            <AnimatePresence>
                                                {showPlayOptions === actualRank - 1 && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-20 min-w-[180px]"
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            {games.length > 0 && (
                                                                <button 
                                                                    onClick={() => {
                                                                        navigateToGame(games[0]._id || games[0].id);
                                                                        setShowPlayOptions(null);
                                                                    }}
                                                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left transition-colors"
                                                                >
                                                                    <GamepadIcon className="w-4 h-4 text-purple-500" />
                                                                    Play Game
                                                                </button>
                                                            )}
                                                            
                                                            {games.length === 0 && (
                                                                <div className="px-3 py-2 text-sm text-gray-500">
                                                                    No games available
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {/* Current User Position (if outside top entries) */}
                {currentUserInfo && !leaders.find(l => l.isCurrentUser) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 mb-6"
                    >
                        <div className="text-center mb-4">
                            <h2 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${themeConfig.primaryGradient} bg-clip-text text-transparent`}>
                                Your Position
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Keep climbing to reach the top!
                            </p>
                        </div>
                        
                        <motion.div
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 border-2 border-yellow-400 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400" />
                            
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                                {/* Rank Badge */}
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                    <span className="text-white font-black text-2xl sm:text-3xl">#{currentUserInfo.rank}</span>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                        <h3 className="text-xl sm:text-2xl font-bold text-yellow-800 flex items-center gap-2">
                                            {currentUserInfo.name}
                                            <span className="text-xs bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-semibold">
                                                YOU
                                            </span>
                                        </h3>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-700 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        @{currentUserInfo.username || 'user'}
                                    </p>
                                </div>

                                {/* XP */}
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl sm:text-2xl">
                                        <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                                        <span>{formatXP(currentUserInfo.xp)}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">Level {currentUserInfo.level || 1}</div>
                                </div>
                            </div>

                            {/* Motivational message */}
                            <div className="mt-4 pt-4 border-t border-yellow-200">
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                    {currentUserInfo.rank <= 10 ? (
                                        <>
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span>You're in the top 10! Keep going! 🌟</span>
                                        </>
                                    ) : currentUserInfo.rank <= 20 ? (
                                        <>
                                            <TrendingUp className="w-4 h-4 text-green-500" />
                                            <span>Almost in the top 10! Keep pushing! 📈</span>
                                        </>
                                    ) : (
                                        <>
                                            <Rocket className="w-4 h-4 text-purple-500" />
                                            <span>Keep earning XP to climb the ranks! 🚀</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Quick action buttons */}
                            <div className="mt-4 flex flex-wrap gap-3 justify-center">
                                {games.length > 0 && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigateToGame(games[0]._id || games[0].id)}
                                        className={`bg-gradient-to-r ${themeConfig.primaryGradient} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2`}
                                    >
                                        <Play className="w-4 h-4" />
                                        Play Game to Earn XP
                                    </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/student/dashboard')}
                                    className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 hover:border-indigo-400"
                                >
                                    <Activity className="w-4 h-4" />
                                    Explore Activities
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Empty State */}
                {leaders.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12 sm:py-16"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1
                            }}
                            className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r ${themeConfig.secondaryGradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}
                        >
                            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </motion.div>
                        
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                            {selectedPeriod === 'daily' && 'No Activity Today Yet! 🌅'}
                            {selectedPeriod === 'weekly' && 'This Week\'s Leaderboard is Empty! 📅'}
                            {selectedPeriod === 'monthly' && 'This Month\'s Leaderboard is Empty! 📆'}
                            {selectedPeriod === 'allTime' && 'No Champions Yet! 🏆'}
                        </h3>
                        
                        <p className="text-base sm:text-lg text-gray-600 mb-2 max-w-md mx-auto">
                            {selectedPeriod === 'daily' && 'Start earning XP today by playing games, completing challenges, or logging your mood!'}
                            {selectedPeriod === 'weekly' && 'Be the first to earn XP this week and claim the top spot!'}
                            {selectedPeriod === 'monthly' && 'Start your journey this month and climb the ranks!'}
                            {selectedPeriod === 'allTime' && 'Be the first to claim your spot on the leaderboard!'}
                        </p>
                        
                        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                            Complete activities, play games, and log your progress to earn XP and climb the ranks!
                        </p>
                        
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                            {games.length > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigateToGame(games[0]._id || games[0].id)}
                                    className={`bg-gradient-to-r ${themeConfig.primaryGradient} text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2`}
                                >
                                    <GamepadIcon className="w-5 h-5" />
                                    Play Game to Earn XP
                                </motion.button>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/student/dashboard')}
                                className={`bg-white border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:border-${themeConfig.accentColor}-400`}
                            >
                                <Activity className="w-5 h-5" />
                                Explore Activities
                            </motion.button>
                        </div>
                        
                        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                <span>Play Games</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                <span>Complete Challenges</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                <span>Log Your Mood</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Motivational Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-8 sm:mt-12"
                >
                    <div className={`inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r ${themeConfig.primaryGradient} text-white px-4 sm:px-8 py-3 sm:py-4 rounded-full shadow-xl font-semibold text-sm sm:text-lg`}>
                        <Target className="w-4 h-4 sm:w-6 sm:h-6" />
                        <span className="hidden xs:inline">{ageGroup === 'kids' ? 'Keep learning and climbing the ranks! 🌟' : ageGroup === 'teens' ? 'Climb the ranks and become a legend! 🚀' : 'Strive for excellence and climb the ranks!'}</span>
                        <span className="xs:hidden">Become a legend! 🚀</span>
                        <Rocket className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Leaderboard;

