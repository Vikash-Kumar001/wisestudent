import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, TrendingUp, Users, Award, Trophy, Target, Calendar, Download,
  Filter, ChevronDown, AlertCircle, CheckCircle, Zap, Brain, Heart, Sparkles,
  Globe, Shield, BookOpen, Activity, ArrowRight, Eye, Flag, X
} from 'lucide-react';
import { Line, Doughnut, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler
} from 'chart.js';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler
);

const SchoolAdminAnalytics = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [pillarMastery, setPillarMastery] = useState({});
  const [studentsAtRisk, setStudentsAtRisk] = useState([]);
  const [wellbeingCases, setWellbeingCases] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [studentAdoption, setStudentAdoption] = useState({});
  const [teacherStats, setTeacherStats] = useState({});
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [engagementTrend, setEngagementTrend] = useState([]);
  const [performanceByGrade, setPerformanceByGrade] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeRange, selectedGrade]);

  // Realtime analytics updates
  useEffect(() => {
    if (!socket) return;

    // Listen for dashboard updates that affect analytics
    const handleDashboardUpdate = () => {
      console.log('🔄 Analytics update received, refreshing data...');
      fetchAnalyticsData(false); // Don't show loading spinner for realtime updates
    };

    // Listen for student updates
    const handleStudentUpdate = () => {
      console.log('👥 Student update received, refreshing analytics...');
      fetchAnalyticsData(false);
    };

    // Listen for pillar mastery updates (when games are completed)
    const handlePillarUpdate = () => {
      console.log('📊 Pillar mastery update received, refreshing analytics...');
      fetchAnalyticsData(false);
    };

    // Listen for wellbeing case updates
    const handleWellbeingUpdate = () => {
      console.log('❤️ Wellbeing update received, refreshing analytics...');
      fetchAnalyticsData(false);
    };

    // Listen for class roster updates
    const handleClassRosterUpdate = () => {
      console.log('📚 Class roster update received, refreshing analytics...');
      fetchAnalyticsData(false);
    };

    // Listen for game completion (affects pillar mastery and leaderboard)
    const handleGameCompleted = () => {
      console.log('🎮 Game completed, refreshing analytics...');
      fetchAnalyticsData(false);
    };

    // Listen for engagement updates (when students/teachers are active)
    const handleEngagementUpdate = () => {
      console.log('📈 Engagement update received, refreshing analytics...');
      fetchAnalyticsData(false);
    };

    // Subscribe to all relevant events
    socket.on('school-admin:dashboard:update', handleDashboardUpdate);
    socket.on('school:students:updated', handleStudentUpdate);
    socket.on('school:students:removed', handleStudentUpdate);
    socket.on('school:class-roster:updated', handleClassRosterUpdate);
    socket.on('student:pillar:updated', handlePillarUpdate);
    socket.on('student:wellbeing:updated', handleWellbeingUpdate);
    socket.on('student:activity:new', handleStudentUpdate);
    socket.on('game-completed', handleGameCompleted);
    socket.on('teacher:activity:update', handleEngagementUpdate);
    socket.on('activity:logged', handleEngagementUpdate);

    // Request initial update only once when socket is ready
    if (socket.connected) {
      socket.emit('school-admin:dashboard:request-update');
    } else {
      socket.once('connect', () => {
        socket.emit('school-admin:dashboard:request-update');
      });
    }

    return () => {
      socket.off('school-admin:dashboard:update', handleDashboardUpdate);
      socket.off('school:students:updated', handleStudentUpdate);
      socket.off('school:students:removed', handleStudentUpdate);
      socket.off('school:class-roster:updated', handleClassRosterUpdate);
      socket.off('student:pillar:updated', handlePillarUpdate);
      socket.off('student:wellbeing:updated', handleWellbeingUpdate);
      socket.off('student:activity:new', handleStudentUpdate);
      socket.off('game-completed', handleGameCompleted);
      socket.off('teacher:activity:update', handleEngagementUpdate);
      socket.off('activity:logged', handleEngagementUpdate);
    };
  }, [socket]);

  const fetchAnalyticsData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const gradeParam = selectedGrade !== 'all' ? `?grade=${selectedGrade}` : '';
      
      const [
        masteryRes, atRiskRes, wellbeingRes, leaderboardRes,
        classesRes, adoptionRes, teacherRes, engagementRes, performanceRes
      ] = await Promise.all([
        api.get(`/api/school/admin/analytics/pillar-mastery${gradeParam}`),
        api.get('/api/school/admin/students?status=at-risk&limit=10'),
        api.get('/api/school/admin/analytics/wellbeing-cases'),
        api.get('/api/school/admin/top-performers?limit=8'),
        api.get('/api/school/admin/classes'),
        api.get(`/api/school/admin/analytics/student-adoption${gradeParam}`),
        api.get('/api/school/admin/analytics/teacher-adoption'),
        api.get('/api/school/admin/analytics/engagement-trend'),
        api.get('/api/school/admin/analytics/performance-by-grade'),
      ]);

      setPillarMastery(masteryRes.data || {});
      setStudentsAtRisk(atRiskRes.data.students || []);
      setWellbeingCases(wellbeingRes.data || {});
      setLeaderboard(leaderboardRes.data.students || []);
      setClasses(classesRes.data.classes || []);
      setStudentAdoption(adoptionRes.data || {});
      setTeacherStats(teacherRes.data || {});
      setEngagementTrend(engagementRes.data.trend || []);
      setPerformanceByGrade(performanceRes.data.grades || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      if (showLoading) {
        toast.error('Failed to load analytics');
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      toast.loading('Generating report...', { id: 'export' });
      const params = new URLSearchParams();
      if (selectedGrade !== 'all') params.append('grade', selectedGrade);
      params.append('timeRange', selectedTimeRange);
      params.append('format', exportFormat);

      if (exportFormat === 'pdf') {
        const response = await api.get(`/api/school/admin/analytics/export?${params}`, {
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `school-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else if (exportFormat === 'json') {
        const response = await api.get(`/api/school/admin/analytics/export?${params}`);
        const jsonStr = JSON.stringify(response.data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `school-analytics-${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const response = await api.get(`/api/school/admin/analytics/export?${params}`, {
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `school-analytics-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }

      toast.success('Report exported successfully!', { id: 'export' });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report', { id: 'export' });
    }
  };

  const handleViewStudent = async (student) => {
    try {
      const response = await api.get(`/api/school/admin/students/${student._id}`);
      setSelectedStudent(response.data.student);
      setShowStudentModal(true);
    } catch (error) {
      console.error('Error fetching student details:', error);
      toast.error('Failed to load student details');
    }
  };

  // Pillar Mastery Chart Data
  const getPillarChartData = () => {
    const pillars = pillarMastery.averages?.pillars || pillarMastery.pillars || pillarMastery;
    const pillarNames = {
      finance: 'Financial Literacy',
      brain: 'Brain Health',
      uvls: 'UVLS (Life Skills & Values)',
      dcos: 'Digital Citizenship & Online Safety',
      moral: 'Moral Values',
      ai: 'AI for All',
      'health-male': 'Health - Male',
      'health-female': 'Health - Female',
      ehe: 'Entrepreneurship & Higher Education',
      crgc: 'Civic Responsibility & Global Citizenship',
      sustainability: 'Sustainability'
    };
    const pillarOrder = [
      'finance',
      'brain',
      'uvls',
      'dcos',
      'moral',
      'ai',
      'health-male',
      'health-female',
      'ehe',
      'crgc',
      'sustainability'
    ];

    const labels = [];
    const data = [];
    const backgroundColors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(251, 146, 60, 0.8)',
      'rgba(14, 165, 233, 0.8)',
      'rgba(234, 179, 8, 0.8)',
      'rgba(168, 85, 247, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(248, 113, 113, 0.8)',
      'rgba(100, 116, 139, 0.8)'
    ];

    if (typeof pillars === 'object' && !Array.isArray(pillars)) {
      pillarOrder.forEach((key) => {
        const value = pillars[key];
        if (typeof value === 'number') {
          labels.push(pillarNames[key] || key);
          data.push(value);
        }
      });
    }

    return {
      labels,
      datasets: [{
        label: 'Pillar Mastery (%)',
        data,
        backgroundColor: data.map((_, idx) => backgroundColors[idx % backgroundColors.length]),
        borderColor: data.map((_, idx) => backgroundColors[idx % backgroundColors.length].replace('0.8', '1')),
        borderWidth: 2,
      }]
    };
  };

  const gradeOptions = useMemo(() => {
    const gradeSet = new Set();
    (classes || []).forEach((cls) => {
      if (cls.classNumber !== undefined && cls.classNumber !== null) {
        gradeSet.add(Number(cls.classNumber));
      }
    });
    return Array.from(gradeSet).sort((a, b) => a - b);
  }, [classes]);

  // Wellbeing Cases Chart Data
  const getWellbeingChartData = () => {
    return {
      labels: ['Open', 'In Progress', 'Resolved'],
      datasets: [{
        data: [
          wellbeingCases.open || 0,
          wellbeingCases.inProgress || 0,
          wellbeingCases.resolved || 0
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: ['#ef4444', '#fb923c', '#22c55e'],
        borderWidth: 2,
      }]
    };
  };

  // Engagement Trend Chart Data
  const getEngagementTrendData = () => {
    const labels = engagementTrend.map(item => item.date || item.label || '');
    const studentData = engagementTrend.map(item => item.students || 0);
    const teacherData = engagementTrend.map(item => item.teachers || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Students',
          data: studentData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Teachers',
          data: teacherData,
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
          fill: true,
        }
      ]
    };
  };

  // Performance by Grade Chart Data
  const getPerformanceByGradeData = () => {
    const labels = performanceByGrade.map(item => `Grade ${item.grade}`);
    const avgScores = performanceByGrade.map(item => item.avgScore || 0);

    return {
      labels,
      datasets: [{
        label: 'Average Score',
        data: avgScores,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12, weight: 'bold' },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 }
      }
    }
  };

  // Student Detail Modal
  const StudentDetailModal = () => (
    <AnimatePresence>
      {showStudentModal && selectedStudent && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStudentModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg">
                      {selectedStudent.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black mb-1">{selectedStudent.name || 'Student'}</h2>
                      <p className="text-sm text-white/80">Grade {selectedStudent.grade || 'N/A'} - Section {selectedStudent.section || 'A'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStudentModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Overall Score</p>
                    <p className="text-2xl font-black text-blue-600">{selectedStudent.avgScore || 0}%</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Status</p>
                    <p className="text-lg font-black text-green-600">{selectedStudent.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Attendance</p>
                    <p className="text-2xl font-black text-purple-600">{selectedStudent.attendance?.percentage || 0}%</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                    <p className="text-xs text-gray-600 mb-1">Flags</p>
                    <p className="text-2xl font-black text-orange-600">{selectedStudent.wellbeingFlags?.length || 0}</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Pillar Mastery
                  </h3>
                  <div className="space-y-3">
                    {selectedStudent.pillars && Object.entries(selectedStudent.pillars).map(([pillar, score]) => (
                      typeof score === 'number' && (
                        <div key={pillar}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-gray-700 uppercase">{pillar}</span>
                            <span className="text-sm font-black text-gray-900">{score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                score >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                score >= 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                                'bg-gradient-to-r from-red-500 to-pink-600'
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <BarChart3 className="w-10 h-10" />
              School Analytics Dashboard
            </h1>
            <p className="text-lg text-white/90">Comprehensive school-wide performance insights</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-8 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Grades</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            Export Report
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="rounded-full bg-white/20 text-white text-xs px-3 py-1 border border-white/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Export format"
            >
              <option value="pdf" className="text-slate-900">PDF</option>
              <option value="csv" className="text-slate-900">CSV</option>
              <option value="json" className="text-slate-900">JSON</option>
            </select>
          </motion.button>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Student Adoption</p>
            <p className="text-3xl font-black text-gray-900">{studentAdoption.adoptionRate || 0}%</p>
            <p className="text-xs text-gray-500 mt-1">{studentAdoption.activeStudents || 0} / {studentAdoption.totalEnrolled || 0} students</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Target className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Avg Pillar Mastery</p>
            <p className="text-3xl font-black text-gray-900">
              {(() => {
                const pillars = pillarMastery.averages?.pillars || pillarMastery.pillars || pillarMastery;
                const values = typeof pillars === 'object' && !Array.isArray(pillars)
                  ? Object.values(pillars).filter(v => typeof v === 'number')
                  : [];
                return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
              })()}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Across {pillarMastery.totalStudents || 0} students</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Teacher DAU/MAU</p>
            <p className="text-3xl font-black text-gray-900">{teacherStats.dauRate || 0}%</p>
            <p className="text-xs text-gray-500 mt-1">{teacherStats.dau || 0} daily / {teacherStats.mau || 0} monthly</p>
          </motion.div>

        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Pillar Mastery Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Pillar Mastery Breakdown
              </h3>
            </div>
            <div className="h-64">
              <Bar data={getPillarChartData()} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Engagement Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Engagement Trend
              </h3>
            </div>
            <div className="h-64">
              <Line data={getEngagementTrendData()} options={chartOptions} />
            </div>
          </motion.div>

          {/* Performance by Grade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Performance by Grade
              </h3>
            </div>
            <div className="h-64">
              <Bar data={getPerformanceByGradeData()} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Top Performers
              </h3>
              <button
                onClick={() => navigate('/school/admin/top-performers')}
                className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((student, idx) => (
                <motion.div
                  key={student._id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer"
                  onClick={() => handleViewStudent(student)}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-black text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{student.name || 'Student'}</p>
                    <p className="text-xs text-gray-500">Grade {student.grade} - {student.section}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-purple-600">{student.score || 0}%</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* At-Risk Students */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-600" />
                Students at Risk ({studentsAtRisk.length})
              </h3>
              <button
                onClick={() => navigate('/school/admin/students?status=at-risk')}
                className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {studentsAtRisk.slice(0, 5).map((student, idx) => (
                <motion.div
                  key={student._id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                  onClick={() => handleViewStudent(student)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {student.name?.charAt(0) || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{student.name || 'Student'}</p>
                    <p className="text-xs text-gray-500">Grade {student.grade} - {student.section}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flag className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-bold text-red-600">{student.wellbeingFlags?.length || 0}</span>
                  </div>
                </motion.div>
              ))}
              
              {studentsAtRisk.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p className="font-semibold text-gray-700">No students at risk</p>
                  <p className="text-sm text-gray-500">All students are doing well!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Student Detail Modal */}
      <StudentDetailModal />
    </div>
  );
};

export default SchoolAdminAnalytics;
