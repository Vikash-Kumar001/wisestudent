import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Mail, MessageSquare, Flag, Eye, 
  Activity, Heart, Trophy, Zap, Coins, Calendar,
  Clock, AlertTriangle, FileText, Send, Save,
  TrendingUp, Brain, Target, Award, Flame
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../hooks/useAuth';

const StudentDetailModal = ({ 
  student, 
  isOpen, 
  onClose, 
  onUpdate,
  // Support alternative prop names for SchoolAdminStudents
  selectedStudent,
  showStudentDetail,
  setShowStudentDetail,
  openResetPasswordModal,
  handleDeleteStudent
}) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('timeline');
  const [loading, setLoading] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [_notes, setNotes] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isFlagged, setIsFlagged] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Support both prop formats
  const actualStudent = student || selectedStudent;
  const actualIsOpen = isOpen !== undefined ? isOpen : showStudentDetail;
  const actualOnClose = onClose || (() => setShowStudentDetail && setShowStudentDetail(false));

  useEffect(() => {
    if (actualIsOpen && actualStudent) {
      console.log('📋 Opening student detail modal for:', {
        studentId: actualStudent._id,
        userId: actualStudent.userId,
        name: actualStudent.name
      });
      fetchStudentDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualIsOpen, actualStudent]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (actualIsOpen) {
      // Save the current scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    };
  }, [actualIsOpen]);

  const fetchStudentDetails = async (showLoading = true) => {
    if (!actualStudent?._id && !actualStudent?.userId) return;
    
    // Use userId if available (for school admin), otherwise use _id (for teacher)
    const studentIdToUse = actualStudent?.userId || actualStudent?._id;
    
    if (!studentIdToUse) return;
    
    try {
      if (showLoading) setLoading(true);
      const response = await api.get(`/api/school/teacher/student/${studentIdToUse}/details`);
      setStudentDetails(response.data);
      setNotes(response.data.notes || '');
      setIsFlagged(response.data.flagged || false);
      
      // Update student stats from API response
      if (response.data) {
        // Update the actualStudent object with real-time stats
        if (actualStudent) {
          actualStudent.level = response.data.level || actualStudent.level || 1;
          actualStudent.xp = response.data.xp || actualStudent.xp || 0;
          actualStudent.coins = response.data.coins || actualStudent.coins || 0;
          actualStudent.streak = response.data.streak || actualStudent.streak || 0;
        }
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      // If teacher endpoint fails, try admin endpoint as fallback
      if (actualStudent?._id && !actualStudent?.userId) {
        try {
          const adminResponse = await api.get(`/api/school/admin/students/${actualStudent._id}`);
          const adminStudentData = adminResponse.data.student || {};
          
          // Transform admin response to match expected format
          setStudentDetails({
            student: {
              _id: adminStudentData._id,
              name: adminStudentData.name,
              email: adminStudentData.email,
              avatar: adminStudentData.avatar
            },
            timeline: [],
            notes: [],
            flagged: adminStudentData.wellbeingFlags?.length > 0 || false,
            flagReason: '',
            recentMood: null,
            consentFlags: {},
            level: 1,
            xp: 0,
            coins: 0,
            streak: 0
          });
          setNotes('');
          setIsFlagged(adminStudentData.wellbeingFlags?.length > 0 || false);
        } catch (adminError) {
          console.error('Error fetching student details from admin endpoint:', adminError);
        }
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Realtime updates for student details
  useEffect(() => {
    if (!socket || !actualIsOpen || !actualStudent?._id) return;

    const handleStudentUpdate = (data) => {
      if (data.studentId === actualStudent._id || data.studentId === actualStudent._id?.toString()) {
        console.log('🔄 Student detail update received, refreshing...');
        fetchStudentDetails(false);
      }
    };

    const handlePillarUpdate = (data) => {
      const studentUserId = actualStudent?.userId || actualStudent?._id;
      if (data.studentId === studentUserId || data.studentId === studentUserId?.toString() || 
          data.userId === studentUserId || data.userId === studentUserId?.toString()) {
        console.log('📊 Pillar mastery update received, refreshing student details...');
        fetchStudentDetails(false);
      }
    };

    const handleWellbeingUpdate = (data) => {
      if (data.studentId === actualStudent._id || data.studentId === actualStudent._id?.toString()) {
        console.log('❤️ Wellbeing update received, refreshing student details...');
        fetchStudentDetails(false);
      }
    };

    const handleActivityUpdate = (data) => {
      if (data.studentId === actualStudent._id || data.studentId === actualStudent._id?.toString()) {
        console.log('📈 Activity update received, refreshing student details...');
        fetchStudentDetails(false);
      }
    };

    const handleStatsUpdate = (data) => {
      // Check if this update is for the current student
      const studentUserId = actualStudent?.userId || actualStudent?._id;
      if (data.userId === studentUserId?.toString() || 
          data.studentId === actualStudent?._id?.toString() ||
          data.studentId === studentUserId?.toString()) {
        console.log('📊 Stats update received, refreshing student details...');
        fetchStudentDetails(false);
      }
    };

    socket.on('school:students:updated', handleStudentUpdate);
    socket.on('student:pillar:updated', handlePillarUpdate);
    socket.on('student:wellbeing:updated', handleWellbeingUpdate);
    socket.on('student:activity:new', handleActivityUpdate);
    socket.on('game-completed', handlePillarUpdate);
    socket.on('stats:updated', handleStatsUpdate);
    socket.on('level:up', handleStatsUpdate);
    socket.on('xp:earned', handleStatsUpdate);
    socket.on('wallet:updated', handleStatsUpdate);

    return () => {
      socket.off('school:students:updated', handleStudentUpdate);
      socket.off('student:pillar:updated', handlePillarUpdate);
      socket.off('student:wellbeing:updated', handleWellbeingUpdate);
      socket.off('student:activity:new', handleActivityUpdate);
      socket.off('game-completed', handlePillarUpdate);
      socket.off('stats:updated', handleStatsUpdate);
      socket.off('level:up', handleStatsUpdate);
      socket.off('xp:earned', handleStatsUpdate);
      socket.off('wallet:updated', handleStatsUpdate);
    };
  }, [socket, actualIsOpen, actualStudent, fetchStudentDetails]);

  const handleSaveNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    const studentIdToUse = actualStudent?.userId || actualStudent?._id;
    if (!studentIdToUse) return;

    try {
      await api.post(`/api/school/teacher/student/${studentIdToUse}/notes`, {
        note: newNote.trim()
      });
      toast.success('Note saved successfully');
      setNewNote('');
      // Refresh details to show the new note
      await fetchStudentDetails(false);
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleToggleFlag = async () => {
    const studentIdToUse = actualStudent?.userId || actualStudent?._id;
    if (!studentIdToUse) return;

    try {
      await api.put(`/api/school/teacher/student/${studentIdToUse}/flag`, {
        flagged: !isFlagged,
        reason: !isFlagged ? 'Needs attention' : null
      });
      setIsFlagged(!isFlagged);
      toast.success(isFlagged ? 'Student unflagged' : 'Student flagged for counselor');
      // Refresh details to get updated flag status
      await fetchStudentDetails(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error toggling flag:', error);
      toast.error('Failed to update flag');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const studentIdToUse = actualStudent?.userId || actualStudent?._id;
    if (!studentIdToUse) return;

    try {
      await api.post(`/api/school/teacher/student/${studentIdToUse}/message`, {
        message: messageText.trim()
      });
      toast.success('Message sent successfully');
      setMessageText('');
      // Refresh details to show the new activity in timeline
      await fetchStudentDetails(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (!actualStudent) return null;

  return (
    <AnimatePresence>
      {actualIsOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={actualOnClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white/30">
                        {actualStudent.name?.charAt(0) || 'S'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black">{actualStudent.name}</h2>
                      <p className="text-white/90 text-sm font-medium">{actualStudent.email}</p>
                    </div>
                  </div>
                  <Motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={actualOnClose}
                    className="p-2 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
                  >
                    <X className="w-6 h-6" />
                  </Motion.button>
                </div>

                {/* Quick Stats - Matching dashboard style */}
                <div className="grid grid-cols-4 gap-3">
                  <Motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20"
                  >
                    <Zap className="w-5 h-5 mx-auto mb-1 text-white" />
                    <p className="text-xl font-black text-white">{studentDetails?.level ?? actualStudent.level ?? 1}</p>
                    <p className="text-xs text-white/80 font-semibold">Level</p>
                  </Motion.div>
                  <Motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20"
                  >
                    <Trophy className="w-5 h-5 mx-auto mb-1 text-white" />
                    <p className="text-xl font-black text-white">{studentDetails?.xp ?? actualStudent.xp ?? 0}</p>
                    <p className="text-xs text-white/80 font-semibold">XP</p>
                  </Motion.div>
                  <Motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20"
                  >
                    <Coins className="w-5 h-5 mx-auto mb-1 text-white" />
                    <p className="text-xl font-black text-white">{studentDetails?.coins ?? actualStudent.coins ?? 0}</p>
                    <p className="text-xs text-white/80 font-semibold">Coins</p>
                  </Motion.div>
                  <Motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20"
                  >
                    <Flame className="w-5 h-5 mx-auto mb-1 text-white" />
                    <p className="text-xl font-black text-white">{studentDetails?.streak ?? actualStudent.streak ?? 0}</p>
                    <p className="text-xs text-white/80 font-semibold">Streak</p>
                  </Motion.div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('timeline')}
                  className={`flex-1 px-4 py-3 font-bold transition-all relative ${
                    activeTab === 'timeline'
                      ? 'text-indigo-600 bg-gradient-to-b from-indigo-50 to-purple-50'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  Timeline
                  {activeTab === 'timeline' && (
                    <Motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"
                    />
                  )}
                </Motion.button>
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 px-4 py-3 font-bold transition-all relative ${
                    activeTab === 'notes'
                      ? 'text-purple-600 bg-gradient-to-b from-purple-50 to-pink-50'
                      : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Notes
                  {activeTab === 'notes' && (
                    <Motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                    />
                  )}
                </Motion.button>
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('actions')}
                  className={`flex-1 px-4 py-3 font-bold transition-all relative ${
                    activeTab === 'actions'
                      ? 'text-pink-600 bg-gradient-to-b from-pink-50 to-rose-50'
                      : 'text-slate-600 hover:text-pink-600 hover:bg-slate-50'
                  }`}
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Actions
                  {activeTab === 'actions' && (
                    <Motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-600 to-rose-600"
                    />
                  )}
                </Motion.button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 300px)' }}>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
                    />
                    <p className="text-sm font-semibold text-slate-500">Loading comprehensive dashboard data</p>
                  </div>
                ) : (
                  <>
                    {activeTab === 'timeline' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
                              <Activity className="w-5 h-5 text-white" />
                            </div>
                            Recent Activity Timeline
                          </h3>
                          {loading && (
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                              <Motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
                              />
                              Loading...
                            </div>
                          )}
                        </div>
                        {studentDetails?.timeline && studentDetails.timeline.length > 0 ? (
                          studentDetails.timeline.map((item, idx) => (
                            <Motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-md">
                                  {item.type === 'mission' ? <Target className="w-5 h-5" /> :
                                   item.type === 'mood' ? <Heart className="w-5 h-5" /> :
                                   <Activity className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-slate-900 mb-1">{item.action}</p>
                                  <p className="text-sm text-slate-600 mb-2">{item.details}</p>
                                  <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {item.time}
                                  </p>
                                </div>
                              </div>
                            </Motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-slate-400">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Activity className="w-6 h-6 text-indigo-400" />
                            </div>
                            <p className="font-semibold text-slate-600">No recent activity</p>
                            <p className="text-xs mt-1 text-slate-500">Activity will appear here as the student engages</p>
                          </div>
                        )}

                        {/* Mood Summary */}
                        {studentDetails?.recentMood && (
                          <Motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 rounded-lg border border-slate-200 shadow-sm"
                          >
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                              <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg shadow-md">
                                <Heart className="w-4 h-4 text-white" />
                              </div>
                              Recent Mood
                            </h4>
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">{studentDetails.recentMood.emoji || '😊'}</div>
                              <div className="flex-1">
                                <p className="font-bold text-slate-900">{studentDetails.recentMood.mood || 'Happy'}</p>
                                <p className="text-sm text-slate-600 font-semibold">Score: {studentDetails.recentMood.score || 3}/5</p>
                              </div>
                            </div>
                          </Motion.div>
                        )}
                      </div>
                    )}

                    {activeTab === 'notes' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            Teacher Notes
                          </h3>
                        </div>

                        {/* Add New Note */}
                        <Motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-lg p-4 border border-slate-200 shadow-sm"
                        >
                          <textarea
                            placeholder="Add a new note about this student..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none font-medium text-slate-700"
                          />
                          <Motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSaveNote}
                            className="mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-md transition-all flex items-center gap-2 w-full justify-center"
                          >
                            <Save className="w-4 h-4" />
                            Save Note
                          </Motion.button>
                        </Motion.div>

                        {/* Existing Notes */}
                        <div className="space-y-3">
                          {studentDetails?.notes && studentDetails.notes.length > 0 ? (
                            studentDetails.notes.map((note, idx) => (
                              <Motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all"
                              >
                                <p className="text-slate-800 mb-3 font-medium leading-relaxed text-sm">{note.text}</p>
                                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                                  <span className="flex items-center gap-1 font-semibold">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(note.date).toLocaleDateString()}
                                  </span>
                                  <span className="font-semibold">By: {note.teacher || 'You'}</span>
                                </div>
                              </Motion.div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-slate-400">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FileText className="w-6 h-6 text-purple-400" />
                              </div>
                              <p className="font-semibold text-slate-600">No notes yet</p>
                              <p className="text-xs mt-1 text-slate-500">Add your first note above</p>
                            </div>
                          )}
                        </div>

                        {/* Consent Flags */}
                        {studentDetails?.consentFlags && (
                          <Motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-lg border border-slate-200 shadow-sm"
                          >
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-md">
                                <AlertTriangle className="w-4 h-4 text-white" />
                              </div>
                              Consent & Permissions
                            </h4>
                            <div className="space-y-2">
                              {Object.entries(studentDetails.consentFlags).slice(0, 3).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-2.5 bg-white/60 rounded-lg border border-slate-200">
                                  <span className="text-sm text-slate-700 font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    value ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                                  }`}>
                                    {value ? 'Granted' : 'Not Granted'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </Motion.div>
                        )}
                      </div>
                    )}

                    {activeTab === 'actions' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <div className="p-2.5 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-md">
                              <Send className="w-5 h-5 text-white" />
                            </div>
                            Quick Actions
                          </h3>
                        </div>

                        {/* Send Message */}
                        <Motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 rounded-lg p-4 border border-slate-200 shadow-sm"
                        >
                          <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-md">
                              <MessageSquare className="w-4 h-4 text-white" />
                            </div>
                            Notify Student
                          </h4>
                          <textarea
                            placeholder="Type your message to the student..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none font-medium text-slate-700"
                          />
                          <Motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSendMessage}
                            className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold hover:shadow-md transition-all flex items-center gap-2 w-full justify-center"
                          >
                            <Send className="w-4 h-4" />
                            Send Notification
                          </Motion.button>
                        </Motion.div>

                        {/* Row: Flag + Full Profile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          {/* Flag for Counselor */}
                          <Motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`rounded-lg p-4 border border-slate-200 shadow-sm ${
                              isFlagged 
                                ? 'bg-gradient-to-br from-red-50 to-rose-50' 
                                : 'bg-gradient-to-br from-slate-50 to-gray-50'
                            }`}
                          >
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                              <div className={`p-2 rounded-lg shadow-md ${isFlagged ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-slate-400'}`}>
                                <Flag className="w-4 h-4 text-white" />
                              </div>
                              Flag for Counselor
                            </h4>
                            <p className="text-sm text-slate-600 mb-3 font-medium">
                              {isFlagged 
                                ? 'This student is currently flagged and will be reviewed by counselor'
                                : 'Flag this student if they need counselor attention'}
                            </p>
                            <Motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleToggleFlag}
                              className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 w-full justify-center ${
                                isFlagged
                                  ? 'bg-gradient-to-r from-slate-600 to-gray-700 text-white hover:shadow-md'
                                  : 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-md'
                              }`}
                            >
                              <Flag className="w-4 h-4" />
                              {isFlagged ? 'Remove Flag' : 'Flag Student'}
                            </Motion.button>
                          </Motion.div>

                          {/* View Full Profile */}
                          <Motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-lg p-4 border border-slate-200 shadow-sm"
                          >
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-md">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                              Full Profile
                            </h4>
                            <p className="text-sm text-slate-600 mb-3 font-medium">
                              View complete analytics and progress reports
                            </p>
                            <Motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                actualOnClose();
                                const studentIdToUse = actualStudent?.userId || actualStudent?._id;
                                if (studentIdToUse) {
                                  // Check user role to determine the correct route
                                  const userRole = user?.role;
                                  const route = userRole === 'school_admin' 
                                    ? `/school/admin/student/${studentIdToUse}/progress`
                                    : `/school-teacher/student/${studentIdToUse}/progress`;
                                  window.location.href = route;
                                } else {
                                  toast.error('Unable to open profile: Student ID not found');
                                }
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-md transition-all flex items-center gap-2 w-full justify-center"
                            >
                              <Eye className="w-4 h-4" />
                              View Full Profile
                            </Motion.button>
                          </Motion.div>
                        </div>
                        
                        {/* Ensure content is scrollable - add padding at bottom */}
                        <div className="h-4"></div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StudentDetailModal;
