import React, { useState, useEffect, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Filter, Grid, List, Flag, ChevronDown, Download, Eye,
  BookOpen, TrendingUp, Zap, Coins, Star, Activity, MessageSquare, FileText,
  Heart, Clock, Plus, UserPlus, MoreVertical, AlertCircle, CheckCircle, Award,
  X, Mail, Phone, Calendar, MapPin, Shield, Target, Brain, Trophy, Trash2, Key, Copy, Lock, User,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import AddStudentModal from '../../components/AddStudentModal';
import StudentDetailModal from '../../components/StudentDetailModal';
import ResetPasswordModal from '../../components/ResetPasswordModal';
import LimitReachedModal from '../../components/LimitReachedModal';
import { useSocket } from '../../context/SocketContext';
import { usePermissions, PermissionGuard } from '../../hooks/usePermissions';

const SchoolAdminStudents = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    studentId: '',
    studentName: '',
    newPassword: ''
  });
  const [newStudent, setNewStudent] = useState({
    name: '', email: '', phone: '', gender: '', password: '', dateOfBirth: ''
  });
  const [limitModal, setLimitModal] = useState({ open: false, message: '', type: 'student' });
  const [expandedClasses, setExpandedClasses] = useState(new Set()); // Track which classes are expanded
  const [studentsPerPage, setStudentsPerPage] = useState(10); // Items per page
  const [currentPages, setCurrentPages] = useState({}); // Track current page for each section
  const { socket } = useSocket();
  const { hasPermission, loading: permissionsLoading } = usePermissions();

  const fetchClasses = useCallback(async () => {
    try {
      const response = await api.get('/api/school/admin/classes');
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }, []);

  const fetchStudentsData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const params = new URLSearchParams();
      if (selectedClass !== 'all') params.append('classId', selectedClass);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const [studentsRes, statsRes] = await Promise.all([
        api.get(`/api/school/admin/students?${params}`),
        api.get('/api/school/admin/students/stats'),
      ]);

      setStudents(studentsRes.data.students || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Error fetching students:', error);
      if (showLoading) {
        toast.error('Failed to load students');
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [selectedClass, filterStatus]);

  useEffect(() => {
    fetchClasses();
    fetchStudentsData();
  }, [fetchClasses, fetchStudentsData]);

  // Comprehensive realtime updates
  useEffect(() => {
    if (!socket) return;

    // Handle student updates (created, updated, password reset)
    const handleStudentUpdate = () => {
      console.log('👥 Student update received, refreshing students list...');
      fetchStudentsData(false); // Don't show loading spinner for realtime updates
    };

    // Handle student removal
    const handleStudentRemoved = () => {
      console.log('🗑️ Student removed, refreshing students list...');
      fetchStudentsData(false);
    };

    // Handle class roster updates (affects student assignments)
    const handleClassRosterUpdate = () => {
      console.log('📚 Class roster updated, refreshing students list...');
      fetchStudentsData(false);
    };

    // Handle pillar mastery updates (affects student scores)
    const handlePillarUpdate = () => {
      console.log('📊 Pillar mastery updated, refreshing students list...');
      fetchStudentsData(false);
    };

    // Handle wellbeing flag updates
    const handleWellbeingUpdate = () => {
      console.log('❤️ Wellbeing update received, refreshing students list...');
      fetchStudentsData(false);
    };

    // Handle student activity (affects active status)
    const handleStudentActivity = () => {
      console.log('📈 Student activity received, refreshing students list...');
      fetchStudentsData(false);
    };

    // Subscribe to all relevant events
    socket.on('school:students:updated', handleStudentUpdate);
    socket.on('school:students:removed', handleStudentRemoved);
    socket.on('school:class-roster:updated', handleClassRosterUpdate);
    socket.on('student:pillar:updated', handlePillarUpdate);
    socket.on('student:wellbeing:updated', handleWellbeingUpdate);
    socket.on('student:activity:new', handleStudentActivity);
    socket.on('game-completed', handlePillarUpdate); // Games affect pillar mastery

    return () => {
      socket.off('school:students:updated', handleStudentUpdate);
      socket.off('school:students:removed', handleStudentRemoved);
      socket.off('school:class-roster:updated', handleClassRosterUpdate);
      socket.off('student:pillar:updated', handlePillarUpdate);
      socket.off('student:wellbeing:updated', handleWellbeingUpdate);
      socket.off('student:activity:new', handleStudentActivity);
      socket.off('game-completed', handlePillarUpdate);
    };
  }, [socket, fetchStudentsData]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/school/admin/students/create', newStudent);
      toast.success('Student added successfully! Login credentials have been created.');
      setShowAddStudentModal(false);
      setNewStudent({ name: '', email: '', phone: '', gender: '', password: '', dateOfBirth: '' });
      fetchStudentsData();
    } catch (error) {
      console.error('Error adding student:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add student';
      if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('student limit reached')) {
        setLimitModal({ open: true, message: errorMessage, type: 'student' });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleViewStudent = async (student) => {
    try {
      const response = await api.get(`/api/school/admin/students/${student._id}`);
      const studentData = response.data.student || {};

      // Ensure userId is available for the modal to fetch details
      if (!studentData.userId && student.userId) {
        studentData.userId = student.userId;
      }

      // Fetch real-time pillar mastery for this student using the User ID (same as student dashboard)
      try {
        const userId = studentData.userId;
        
        if (userId) {
          // Use the same endpoint as student dashboard for real-time pillar data
          const masteryRes = await api.get(`/api/stats/pillar-mastery/${userId}`);
          const mastery = masteryRes.data || {};

          // Store the full pillars array from real-time data (all 10 pillars from UnifiedGameProgress)
          if (mastery.pillars && Array.isArray(mastery.pillars)) {
            studentData.pillarMasteryArray = mastery.pillars;
          }
          
          // Update avgScore from overallMastery (real-time calculation from game progress)
          if (typeof mastery.overallMastery === 'number') {
            studentData.avgScore = mastery.overallMastery;
          }
        }
      } catch (pillarsErr) {
        console.error('Failed to fetch real-time pillar mastery for student:', pillarsErr);
        // Don't fail the whole request, just log the error - will use fallback static data
      }

      setSelectedStudent(studentData);
      setShowStudentDetail(true);
    } catch (error) {
      console.error('Error fetching student details:', error);
      toast.error('Failed to load student details');
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName}? This will permanently remove the student account and all associated data.`)) {
      return;
    }

    try {
      await api.delete(`/api/school/admin/students/${studentId}`);
      toast.success('Student deleted successfully!');
      fetchStudentsData();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error(error.response?.data?.message || 'Failed to delete student');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetPasswordData.newPassword || resetPasswordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await api.post(`/api/school/admin/students/${resetPasswordData.studentId}/reset-password`, {
        newPassword: resetPasswordData.newPassword
      });
      toast.success('Password reset successfully!');
      setShowResetPasswordModal(false);
      setResetPasswordData({ studentId: '', studentName: '', newPassword: '' });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  const openResetPasswordModal = (student) => {
    setResetPasswordData({
      studentId: student._id,
      studentName: student.name,
      newPassword: ''
    });
    setShowResetPasswordModal(true);
  };

  const handleExportStudents = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await api.get(`/api/school/admin/students/export?format=csv&${params}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Students exported successfully!');
    } catch (error) {
      console.error('Error exporting students:', error);
      toast.error('Failed to export students');
    }
  };

  

  // Group students by class
  const groupStudentsByClass = (studentsList) => {
    const grouped = {};
    
    studentsList.forEach(student => {
      // Get class identifier
      let classKey = 'unassigned';
      let className = 'Unassigned Students';
      
      if (student.classId) {
        const classNum = student.classId.classNumber || student.grade;
        const stream = student.classId.stream || '';
        classKey = student.classId._id?.toString() || `${classNum}${stream}`;
        className = `Class ${classNum}${stream ? ` ${stream}` : ''}`;
      } else if (student.grade) {
        classKey = `grade_${student.grade}`;
        className = `Grade ${student.grade}`;
      }
      
      if (!grouped[classKey]) {
        grouped[classKey] = {
          classId: student.classId?._id || null,
          className: className,
          classNumber: student.classId?.classNumber || student.grade || null,
          stream: student.classId?.stream || null,
          students: []
        };
      }
      
      grouped[classKey].students.push(student);
    });
    
    // Sort classes by class number
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      if (a === 'unassigned') return 1;
      if (b === 'unassigned') return -1;
      const aNum = grouped[a].classNumber || 0;
      const bNum = grouped[b].classNumber || 0;
      return aNum - bNum;
    });
    
    return sortedKeys.map(key => ({
      ...grouped[key],
      key
    }));
  };

  // Filter students by search term
  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group filtered students by class
  const groupedStudents = groupStudentsByClass(filteredStudents);
  
  // Filter by selected class if not 'all'
  const displayGroups = selectedClass === 'all' 
    ? groupedStudents 
    : groupedStudents.filter(group => {
        if (selectedClass === 'unassigned') {
          return group.key === 'unassigned';
        }
        return group.classId?.toString() === selectedClass || group.key === selectedClass;
      });

  // Toggle class expansion
  const toggleClassExpansion = (classKey) => {
    setExpandedClasses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(classKey)) {
        newSet.delete(classKey);
      } else {
        newSet.add(classKey);
      }
      return newSet;
    });
  };

  // Expand all classes by default on initial load
  useEffect(() => {
    if (expandedClasses.size === 0 && displayGroups.length > 0) {
      const allClassKeys = displayGroups.map(g => g.key);
      setExpandedClasses(new Set(allClassKeys));
    }
  }, [displayGroups.length]); // Only depend on length to avoid infinite loops

  // Pagination helper functions
  const getSectionKey = (classKey, section) => `${classKey}-${section}`;
  
  const getCurrentPage = (sectionKey) => currentPages[sectionKey] || 1;
  
  const setCurrentPage = (sectionKey, page) => {
    setCurrentPages(prev => ({
      ...prev,
      [sectionKey]: page
    }));
  };

  const paginateStudents = (students, sectionKey) => {
    const currentPage = getCurrentPage(sectionKey);
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    return {
      paginatedStudents: students.slice(startIndex, endIndex),
      totalPages: Math.ceil(students.length / studentsPerPage),
      currentPage,
      totalStudents: students.length
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Users className="w-10 h-10" />
              Student Management
            </h1>
            <p className="text-lg text-white/90">
              {filteredStudents.length} students • {stats.active || 0} active • {displayGroups.length} {displayGroups.length === 1 ? 'class' : 'classes'}
            </p>
          </Motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-black text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-black text-gray-900">{stats.active || 0}</p>
              </div>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Flag className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Flagged</p>
                <p className="text-2xl font-black text-gray-900">{stats.flagged || 0}</p>
              </div>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-black text-gray-900">{stats.inactive || 0}</p>
              </div>
            </div>
          </Motion.div>
        </div>

        {/* Search & Filters */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search students by name, email, or phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    Class {cls.classNumber}{cls.stream ? ` ${cls.stream}` : ''} ({cls.totalStudents || 0} students)
                  </option>
                ))}
                <option value="unassigned">Unassigned Students</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="flagged">Flagged</option>
              </select>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Grid className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <List className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <PermissionGuard require="viewStudentPII">
                <button
                  onClick={handleExportStudents}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </PermissionGuard>

              <PermissionGuard require="createStudent">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Student
                </button>
              </PermissionGuard>
            </div>
          </div>
          </Motion.div>

        {/* Students Grid */}
        {viewMode === 'grid' ? (
          <div className="space-y-8">
            {displayGroups.map((group, groupIdx) => {
              // Group students by section within the class
              const studentsBySection = {};
              group.students.forEach(student => {
                const section = student.section || 'Unassigned';
                if (!studentsBySection[section]) {
                  studentsBySection[section] = [];
                }
                studentsBySection[section].push(student);
              });
              const sections = Object.keys(studentsBySection).sort();

              return (
                <div key={group.key || groupIdx} className="space-y-6">
                  {/* Class Header - Same as list view */}
                  <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIdx * 0.1 }}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all"
                    onClick={() => toggleClassExpansion(group.key)}
                  >
                    <div className="bg-gray-50 border-b border-gray-200 p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">{group.className}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-gray-500" />
                                {group.students.length} {group.students.length === 1 ? 'student' : 'students'}
                              </span>
                              {sections.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Users className="w-4 h-4 text-gray-500" />
                                  {sections.length} {sections.length === 1 ? 'section' : 'sections'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {sections.map((section, secIdx) => (
                              <span key={secIdx} className="px-3 py-1.5 bg-white rounded-md text-xs font-semibold text-gray-700 border border-gray-300">
                                Section {section}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                            <ChevronDown 
                              className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                                expandedClasses.has(group.key) ? 'rotate-180' : ''
                              }`}
                            />
                            <span className="text-sm font-semibold text-gray-700">
                              {expandedClasses.has(group.key) ? 'Collapse' : 'Expand'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Motion.div>

                  {/* Sections - Only show if class is expanded */}
                  {expandedClasses.has(group.key) && (
                    <AnimatePresence>
                      {sections.map((section, sectionIdx) => (
                        <Motion.div
                          key={section}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          {/* Section Header */}
                          <Motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (groupIdx * 0.1) + (sectionIdx * 0.05) }}
                            className="flex items-center gap-3 px-4"
                          >
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                              <Users className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-bold text-gray-700">Section {section}</span>
                              <span className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded-full font-semibold">
                                {studentsBySection[section].length} {studentsBySection[section].length === 1 ? 'student' : 'students'}
                              </span>
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                          </Motion.div>

                          {/* Students in this section */}
                          {(() => {
                            const sectionKey = getSectionKey(group.key, section);
                            const { paginatedStudents, totalPages, currentPage, totalStudents } = paginateStudents(studentsBySection[section], sectionKey);
                            
                            return (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {paginatedStudents.map((student, idx) => (
                              <Motion.div
                                key={student._id || idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.02 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all"
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <span className="text-lg font-bold text-indigo-600">{student.name?.charAt(0) || 'S'}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 text-sm truncate">{student.name || 'Student'}</h3>
                                    <p className="text-xs text-gray-600 truncate">{student.email || 'N/A'}</p>
                                  </div>
                                  {student.wellbeingFlags?.length > 0 && (
                                    <div className="flex-shrink-0">
                                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Flagged for counselor attention"></div>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2.5 mb-4">
                                  <div className="flex items-center gap-2 text-xs">
                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-gray-600">{student.phone || 'N/A'}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs">
                                    <User className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-gray-600">{student.gender || 'N/A'}</span>
                                  </div>
                                  <div className="flex items-start gap-2 text-xs">
                                    <Users className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      {student.parents && student.parents.length > 0 ? (
                                        <div>
                                          <div className="font-semibold text-gray-900 truncate">{student.parents[0].name || 'N/A'}</div>
                                          <div className="text-gray-600 truncate">{student.parents[0].email || 'N/A'}</div>
                                          {student.parents.length > 1 && (
                                            <div className="text-gray-500 text-xs">+{student.parents.length - 1} more</div>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-gray-600">N/A</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                                      student.wellbeingFlags?.length > 0 
                                        ? 'bg-red-50 text-red-700 border border-red-200' 
                                        : student.isActive 
                                        ? 'bg-green-50 text-green-700 border border-green-200' 
                                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                                    }`}>
                                      {student.wellbeingFlags?.length > 0 ? (
                                        <>
                                          <Flag className="w-3 h-3" />
                                          Flagged
                                        </>
                                      ) : student.isActive ? (
                                        <>
                                          <CheckCircle className="w-3 h-3" />
                                          Active
                                        </>
                                      ) : (
                                        <>
                                          <AlertCircle className="w-3 h-3" />
                                          Inactive
                                        </>
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleViewStudent(student)}
                                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                                  >
                                    View Profile
                                  </button>
                                  <PermissionGuard require="deleteStudent">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteStudent(student._id, student.name);
                                      }}
                                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                      title="Delete Student"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </PermissionGuard>
                                </div>
                              </Motion.div>
                                  ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                  <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <span className="font-semibold">
                                        Showing {((currentPage - 1) * studentsPerPage) + 1} to {Math.min(currentPage * studentsPerPage, totalStudents)} of {totalStudents} students
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => setCurrentPage(sectionKey, Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      >
                                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                                      </button>
                                      <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                          if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                          ) {
                                            return (
                                              <button
                                                key={page}
                                                onClick={() => setCurrentPage(sectionKey, page)}
                                                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                                                  currentPage === page
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                }`}
                                              >
                                                {page}
                                              </button>
                                            );
                                          } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                          ) {
                                            return (
                                              <span key={page} className="px-2 text-gray-500">
                                                ...
                                              </span>
                                            );
                                          }
                                          return null;
                                        })}
                                      </div>
                                      <button
                                        onClick={() => setCurrentPage(sectionKey, Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      >
                                        <ChevronRight className="w-4 h-4 text-gray-600" />
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-600">Per page:</span>
                                      <select
                                        value={studentsPerPage}
                                        onChange={(e) => {
                                          setStudentsPerPage(Number(e.target.value));
                                          setCurrentPage(sectionKey, 1); // Reset to first page
                                        }}
                                        className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                      >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                      </select>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </Motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-8">
            {displayGroups.map((group, groupIdx) => {
              // Group students by section within the class
              const studentsBySection = {};
              group.students.forEach(student => {
                const section = student.section || 'Unassigned';
                if (!studentsBySection[section]) {
                  studentsBySection[section] = [];
                }
                studentsBySection[section].push(student);
              });
              const sections = Object.keys(studentsBySection).sort();

              return (
                <div key={group.key || groupIdx} className="space-y-6">
                  {/* Enhanced Class Header - Clickable */}
                  <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIdx * 0.1 }}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all"
                    onClick={() => toggleClassExpansion(group.key)}
                  >
                    <div className="bg-gray-50 border-b border-gray-200 p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">{group.className}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-gray-500" />
                                {group.students.length} {group.students.length === 1 ? 'student' : 'students'}
                              </span>
                              {sections.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Users className="w-4 h-4 text-gray-500" />
                                  {sections.length} {sections.length === 1 ? 'section' : 'sections'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {sections.map((section, secIdx) => (
                              <span key={secIdx} className="px-3 py-1.5 bg-white rounded-md text-xs font-semibold text-gray-700 border border-gray-300">
                                Section {section}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                            <ChevronDown 
                              className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                                expandedClasses.has(group.key) ? 'rotate-180' : ''
                              }`}
                            />
                            <span className="text-sm font-semibold text-gray-700">
                              {expandedClasses.has(group.key) ? 'Collapse' : 'Expand'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Motion.div>

                  {/* Sections - Only show if class is expanded */}
                  {expandedClasses.has(group.key) && (
                    <AnimatePresence>
                      {sections.map((section, sectionIdx) => (
                        <Motion.div
                          key={section}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                      {/* Section Header */}
                      <Motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (groupIdx * 0.1) + (sectionIdx * 0.05) }}
                        className="flex items-center gap-3 px-4"
                      >
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-bold text-purple-700">Section {section}</span>
                          <span className="text-xs text-purple-600 bg-white px-2 py-0.5 rounded-full font-semibold">
                            {studentsBySection[section].length} {studentsBySection[section].length === 1 ? 'student' : 'students'}
                          </span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
                      </Motion.div>

                      {/* Students Table for this section */}
                      {(() => {
                        const sectionKey = getSectionKey(group.key, section);
                        const { paginatedStudents, totalPages, currentPage, totalStudents } = paginateStudents(studentsBySection[section], sectionKey);
                        
                        return (
                          <div className="space-y-4">
                            <Motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: (groupIdx * 0.1) + (sectionIdx * 0.05) + 0.1 }}
                              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                            >
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 via-gray-50 to-gray-100 border-b-2 border-gray-200">
                                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                          <User className="w-4 h-4 text-purple-600" />
                                          Student
                                        </div>
                                      </th>
                                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                          <Phone className="w-4 h-4 text-blue-600" />
                                          Phone
                                        </div>
                                      </th>
                                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                          <User className="w-4 h-4 text-pink-600" />
                                          Gender
                                        </div>
                                      </th>
                                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                          <Users className="w-4 h-4 text-green-600" />
                                          Linked Parent
                                        </div>
                                      </th>
                                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                          <Activity className="w-4 h-4 text-orange-600" />
                                          Status
                                        </div>
                                      </th>
                                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                          <Zap className="w-4 h-4 text-purple-600" />
                                          Actions
                                        </div>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {paginatedStudents.map((student, idx) => (
                                <Motion.tr
                                  key={student._id || idx}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: idx * 0.01 }}
                                  className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all group"
                                >
                                  <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md group-hover:shadow-lg transition-all">
                                        {student.name?.charAt(0) || 'S'}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 text-sm mb-0.5">{student.name || 'Student'}</p>
                                        <div className="flex items-center gap-1.5">
                                          <Mail className="w-3 h-3 text-gray-400" />
                                          <p className="text-xs text-gray-600 truncate">{student.email || 'N/A'}</p>
                                        </div>
                                      </div>
                                      {student.wellbeingFlags?.length > 0 && (
                                        <div className="flex-shrink-0">
                                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Flagged for counselor attention"></div>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm font-semibold text-gray-900">{student.phone || 'N/A'}</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-6">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-pink-50 text-pink-700 border border-pink-200">
                                      {student.gender === 'Male' ? '👨' : student.gender === 'Female' ? '👩' : '👤'}
                                      {student.gender || 'N/A'}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6">
                                    {student.parents && student.parents.length > 0 ? (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <Users className="w-3.5 h-3.5 text-green-600" />
                                          <p className="text-sm font-semibold text-gray-900">{student.parents[0].name || 'N/A'}</p>
                                        </div>
                                        <p className="text-xs text-gray-600 flex items-center gap-1.5">
                                          <Mail className="w-3 h-3 text-gray-400" />
                                          {student.parents[0].email || 'N/A'}
                                        </p>
                                        {student.parents.length > 1 && (
                                          <p className="text-xs text-purple-600 font-semibold">+{student.parents.length - 1} more parent{student.parents.length - 1 > 1 ? 's' : ''}</p>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600">
                                        <X className="w-3 h-3" />
                                        N/A
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-4 px-6">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                                      student.wellbeingFlags?.length > 0 
                                        ? 'bg-red-100 text-red-700 border border-red-200' 
                                        : student.isActive 
                                        ? 'bg-green-100 text-green-700 border border-green-200' 
                                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                                    }`}>
                                      {student.wellbeingFlags?.length > 0 ? (
                                        <>
                                          <Flag className="w-3.5 h-3.5" />
                                          Flagged
                                        </>
                                      ) : student.isActive ? (
                                        <>
                                          <CheckCircle className="w-3.5 h-3.5" />
                                          Active
                                        </>
                                      ) : (
                                        <>
                                          <AlertCircle className="w-3.5 h-3.5" />
                                          Inactive
                                        </>
                                      )}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleViewStudent(student)}
                                        className="p-2 hover:bg-purple-100 rounded-lg transition-all group/btn"
                                        title="View Details"
                                      >
                                        <Eye className="w-5 h-5 text-purple-600 group-hover/btn:scale-110 transition-transform" />
                                      </button>
                                      <PermissionGuard require="deleteStudent">
                                        <button
                                          onClick={() => handleDeleteStudent(student._id, student.name)}
                                          className="p-2 hover:bg-red-100 rounded-lg transition-all group/btn"
                                          title="Delete Student"
                                        >
                                          <Trash2 className="w-5 h-5 text-red-600 group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                      </PermissionGuard>
                                    </div>
                                  </td>
                                </Motion.tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </Motion.div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                              <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="font-semibold">
                                    Showing {((currentPage - 1) * studentsPerPage) + 1} to {Math.min(currentPage * studentsPerPage, totalStudents)} of {totalStudents} students
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setCurrentPage(sectionKey, Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                      if (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                      ) {
                                        return (
                                          <button
                                            key={page}
                                            onClick={() => setCurrentPage(sectionKey, page)}
                                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                                              currentPage === page
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                          >
                                            {page}
                                          </button>
                                        );
                                      } else if (
                                        page === currentPage - 2 ||
                                        page === currentPage + 2
                                      ) {
                                        return (
                                          <span key={page} className="px-2 text-gray-500">
                                            ...
                                          </span>
                                        );
                                      }
                                      return null;
                                    })}
                                  </div>
                                  <button
                                    onClick={() => setCurrentPage(sectionKey, Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Per page:</span>
                                  <select
                                    value={studentsPerPage}
                                    onChange={(e) => {
                                      setStudentsPerPage(Number(e.target.value));
                                      setCurrentPage(sectionKey, 1); // Reset to first page
                                    }}
                                    className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                        </Motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {displayGroups.length === 0 && filteredStudents.length === 0 && !loading && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center"
          >
            <Users className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or add new students</p>
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <UserPlus className="w-5 h-5" />
              Add New Student
            </button>
            </Motion.div>
        )}
      </div>

      {/* Modals */}
      <AddStudentModal
        showAddStudentModal={showAddStudentModal}
        setShowAddStudentModal={setShowAddStudentModal}
        newStudent={newStudent}
        setNewStudent={setNewStudent}
        handleAddStudent={handleAddStudent}
      />
      <StudentDetailModal
        showStudentDetail={showStudentDetail}
        setShowStudentDetail={setShowStudentDetail}
        selectedStudent={selectedStudent}
        openResetPasswordModal={openResetPasswordModal}
        handleDeleteStudent={handleDeleteStudent}
      />
      <ResetPasswordModal
        showResetPasswordModal={showResetPasswordModal}
        setShowResetPasswordModal={setShowResetPasswordModal}
        resetPasswordData={resetPasswordData}
        setResetPasswordData={setResetPasswordData}
        handleResetPassword={handleResetPassword}
      />
      <LimitReachedModal
        open={limitModal.open}
        message={limitModal.message}
        type={limitModal.type}
        onClose={() => setLimitModal((prev) => ({ ...prev, open: false }))}
        onRequest={() => {
          setLimitModal((prev) => ({ ...prev, open: false }));
        }}
      />
    </div>
  );
};

export default SchoolAdminStudents;
