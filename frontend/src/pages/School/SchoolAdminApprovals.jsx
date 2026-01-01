import React, { useState, useEffect, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, Clock, Eye, Check, X, MessageSquare, FileText, User, Calendar,
  AlertCircle, Filter, Search, Download, RefreshCw, ArrowRight, Star, Award,
  Send, BookOpen, Target, Zap, Info, Edit3, XCircle
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import analytics from '../../utils/analytics';
import { useSocket } from '../../context/SocketContext';
import { usePermissions, PermissionGuard } from '../../hooks/usePermissions';

const SchoolAdminApprovals = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [pendingTemplates, setPendingTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState('assignments');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [changeRequest, setChangeRequest] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/school/admin/pending-approvals');
      setPendingAssignments(response.data.assignments || []);
      setPendingTemplates(response.data.templates || []);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      toast.error('Failed to load approvals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  // Real-time socket listeners for approval updates
  useEffect(() => {
    if (!socket) return;

    const handleAssignmentApproved = (data) => {
      console.log('✅ Assignment approved, refreshing approvals...');
      setPendingAssignments(prev => prev.filter(a => a.id !== data.assignmentId));
      fetchApprovals();
    };

    const handleAssignmentRejected = (data) => {
      console.log('❌ Assignment rejected, refreshing approvals...');
      setPendingAssignments(prev => prev.filter(a => a.id !== data.assignmentId));
      fetchApprovals();
    };

    const handleAssignmentChangesRequested = (data) => {
      console.log('🔄 Assignment changes requested, refreshing approvals...');
      setPendingAssignments(prev => prev.filter(a => a.id !== data.assignmentId));
      fetchApprovals();
    };

    const handleTemplateApproved = (data) => {
      console.log('✅ Template approved, refreshing approvals...');
      setPendingTemplates(prev => prev.filter(t => t.id !== data.templateId));
      fetchApprovals();
    };

    const handleTemplateRejected = (data) => {
      console.log('❌ Template rejected, refreshing approvals...');
      setPendingTemplates(prev => prev.filter(t => t.id !== data.templateId));
      fetchApprovals();
    };

    const handleDashboardUpdate = () => {
      console.log('🔄 Dashboard update received, refreshing approvals...');
      fetchApprovals();
    };

    socket.on('assignment:approved', handleAssignmentApproved);
    socket.on('assignment:rejected', handleAssignmentRejected);
    socket.on('assignment:changes_requested', handleAssignmentChangesRequested);
    socket.on('template:approved', handleTemplateApproved);
    socket.on('template:rejected', handleTemplateRejected);
    socket.on('school-admin:dashboard:update', handleDashboardUpdate);

    return () => {
      socket.off('assignment:approved', handleAssignmentApproved);
      socket.off('assignment:rejected', handleAssignmentRejected);
      socket.off('assignment:changes_requested', handleAssignmentChangesRequested);
      socket.off('template:approved', handleTemplateApproved);
      socket.off('template:rejected', handleTemplateRejected);
      socket.off('school-admin:dashboard:update', handleDashboardUpdate);
    };
  }, [socket, fetchApprovals]);

  const handleViewPreview = async (assignment) => {
    try {
      const response = await api.get(`/api/school/admin/assignments/${assignment.id}/preview`);
      setSelectedAssignment(response.data.assignment);
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error fetching preview:', error);
      toast.error('Failed to load assignment preview');
    }
  };

  const handleApprove = async (assignmentId) => {
    try {
      setProcessingId(assignmentId);
      await api.post(`/api/school/admin/assignments/${assignmentId}/approve`, {});
      analytics.trackApprovalAction(assignmentId, 'approved', null, 'assignment');
      toast.success('Assignment approved and published! Students notified.');
      setShowPreviewModal(false);
      fetchApprovals();
    } catch (error) {
      console.error('Error approving:', error);
      toast.error(error.response?.data?.message || 'Failed to approve assignment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRequestChanges = async () => {
    if (!changeRequest.trim()) {
      toast.error('Please provide feedback for changes');
      return;
    }

    try {
      setProcessingId(selectedAssignment.id);
      await api.post(`/api/school/admin/assignments/${selectedAssignment.id}/request-changes`, {
        changes: changeRequest,
        comments: changeRequest
      });
      analytics.trackApprovalAction(selectedAssignment.id, 'requested_changes', null, 'assignment');
      toast.success('Change request sent to teacher');
      setShowRequestChangesModal(false);
      setShowPreviewModal(false);
      setChangeRequest('');
      fetchApprovals();
    } catch (error) {
      console.error('Error requesting changes:', error);
      toast.error('Failed to send change request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (assignmentId, reason = '') => {
    if (!window.confirm('Are you sure you want to reject this assignment?')) {
      return;
    }

    try {
      setProcessingId(assignmentId);
      await api.post(`/api/school/admin/assignments/${assignmentId}/reject`, {
        reason: reason || 'Assignment does not meet requirements'
      });
      analytics.trackApprovalAction(assignmentId, 'rejected', null, 'assignment');
      toast.success('Assignment rejected');
      setShowPreviewModal(false);
      fetchApprovals();
    } catch (error) {
      console.error('Error rejecting:', error);
      toast.error('Failed to reject assignment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewTemplate = async (template) => {
    try {
      const response = await api.get(`/api/school/admin/templates/${template.id}`);
      setSelectedTemplate(response.data.template);
      setShowTemplateModal(true);
    } catch (error) {
      console.error('Error fetching template:', error);
      toast.error('Failed to load template details');
    }
  };

  const handleApproveTemplate = async (templateId) => {
    try {
      setProcessingId(templateId);
      await api.post(`/api/school/admin/templates/${templateId}/approve`);
      toast.success('Template approved!');
      setShowTemplateModal(false);
      fetchApprovals();
    } catch (error) {
      console.error('Error approving template:', error);
      toast.error('Failed to approve template');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to reject this template?')) {
      return;
    }

    try {
      setProcessingId(templateId);
      await api.post(`/api/school/admin/templates/${templateId}/reject`);
      toast.success('Template rejected');
      setShowTemplateModal(false);
      fetchApprovals();
    } catch (error) {
      console.error('Error rejecting template:', error);
      toast.error('Failed to reject template');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredAssignments = pendingAssignments.filter(a =>
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = pendingTemplates.filter(t =>
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.creator?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Assignment Preview Modal
  const AssignmentPreviewModal = () => (
    <AnimatePresence>
      {showPreviewModal && selectedAssignment && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreviewModal(false)}
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
                  <div>
                    <h2 className="text-2xl font-black mb-1">{selectedAssignment.title}</h2>
                    <p className="text-sm text-white/80">Assignment Preview</p>
                  </div>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Teacher Info */}
                <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {selectedAssignment.teacher?.name?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selectedAssignment.teacher?.name || 'Teacher'}</p>
                    <p className="text-sm text-gray-600">{selectedAssignment.teacher?.email || 'No email'}</p>
                  </div>
                </div>

                {/* Assignment Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Subject</p>
                    <p className="text-lg font-black text-purple-600">{selectedAssignment.subject || 'General'}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Grade</p>
                    <p className="text-lg font-black text-green-600">{selectedAssignment.grade || 'N/A'}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Due Date</p>
                    <p className="text-sm font-bold text-blue-600">
                      {selectedAssignment.dueDate ? new Date(selectedAssignment.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                    <p className="text-xs text-gray-600 mb-1">Scope</p>
                    <p className="text-sm font-bold text-orange-600 capitalize">{selectedAssignment.scope || 'Class'}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedAssignment.description || 'No description provided'}</p>
                </div>

                {/* Questions/Content */}
                {selectedAssignment.questions && selectedAssignment.questions.length > 0 && (
                  <div className="bg-white rounded-xl p-6 mb-6 border-2 border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Questions ({selectedAssignment.questions.length})
                    </h3>
                    <div className="space-y-4">
                      {selectedAssignment.questions.slice(0, 5).map((q, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="font-semibold text-gray-900 mb-2">Q{idx + 1}. {q.question || q.text}</p>
                          {q.options && (
                            <ul className="text-sm text-gray-600 space-y-1 ml-4">
                              {q.options.map((opt, i) => (
                                <li key={i} className={q.correctAnswer === opt ? 'text-green-600 font-semibold' : ''}>
                                  {String.fromCharCode(65 + i)}. {opt}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                      {selectedAssignment.questions.length > 5 && (
                        <p className="text-sm text-gray-500 text-center">
                          +{selectedAssignment.questions.length - 5} more questions
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-purple-600" />
                    Additional Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Marks:</p>
                      <p className="font-bold text-gray-900">{selectedAssignment.totalMarks || 100}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration:</p>
                      <p className="font-bold text-gray-900">{selectedAssignment.duration || 60} minutes</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Max Attempts:</p>
                      <p className="font-bold text-gray-900">{selectedAssignment.maxAttempts || 1}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created:</p>
                      <p className="font-bold text-gray-900">
                        {selectedAssignment.createdAt ? new Date(selectedAssignment.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleApprove(selectedAssignment.id)}
                    disabled={processingId === selectedAssignment.id}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                    {processingId === selectedAssignment.id ? 'Processing...' : 'Approve & Publish'}
                  </button>

                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      setShowRequestChangesModal(true);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    Request Changes
                  </button>

                  <button
                    onClick={() => handleReject(selectedAssignment.id)}
                    disabled={processingId === selectedAssignment.id}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Request Changes Modal
  const RequestChangesModal = () => (
    <AnimatePresence>
      {showRequestChangesModal && selectedAssignment && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRequestChangesModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Request Changes</h2>
                    <p className="text-sm text-white/80">{selectedAssignment.title}</p>
                  </div>
                  <button
                    onClick={() => setShowRequestChangesModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Feedback for Teacher *
                </label>
                <textarea
                  value={changeRequest}
                  onChange={(e) => setChangeRequest(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none font-medium resize-none"
                  rows="6"
                  placeholder="Provide specific feedback on what needs to be changed..."
                  required
                />

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => setShowRequestChangesModal(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestChanges}
                    disabled={!changeRequest.trim() || processingId === selectedAssignment.id}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                    {processingId === selectedAssignment.id ? 'Sending...' : 'Send Feedback'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Template Preview Modal
  const TemplatePreviewModal = () => (
    <AnimatePresence>
      {showTemplateModal && selectedTemplate && (
        <>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTemplateModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <Motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">{selectedTemplate.title}</h2>
                    <p className="text-sm text-white/80">Template Preview</p>
                  </div>
                  <button
                    onClick={() => setShowTemplateModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Category</p>
                    <p className="text-sm font-black text-blue-600 capitalize">{selectedTemplate.category}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Type</p>
                    <p className="text-sm font-black text-green-600 capitalize">{selectedTemplate.type}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Premium</p>
                    <p className="text-sm font-black text-purple-600">{selectedTemplate.isPremium ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                    <p className="text-xs text-gray-600 mb-1">Price</p>
                    <p className="text-sm font-black text-orange-600">₹{selectedTemplate.price || 0}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700">{selectedTemplate.description}</p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleApproveTemplate(selectedTemplate._id)}
                    disabled={processingId === selectedTemplate._id}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                    Approve Template
                  </button>

                  <button
                    onClick={() => handleRejectTemplate(selectedTemplate._id)}
                    disabled={processingId === selectedTemplate._id}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Motion.div
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
          <Motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <CheckCircle className="w-10 h-10" />
              Pending Approvals
            </h1>
            <p className="text-lg text-white/90">
              {pendingAssignments.length} assignments • {pendingTemplates.length} templates awaiting review
            </p>
          </Motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Tabs */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-2 mb-6 flex gap-2"
        >
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'assignments'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Assignments ({pendingAssignments.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'templates'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Templates ({pendingTemplates.length})
          </button>
        </Motion.div>

        {/* Search & Refresh */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6 flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
            />
          </div>

          <button
            onClick={fetchApprovals}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </Motion.div>

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <>
            {filteredAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssignments.map((assignment, idx) => (
                  <Motion.div
                    key={assignment.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-orange-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{assignment.title}</h3>
                      <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{assignment.description}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow">
                        {assignment.teacher?.name?.charAt(0) || 'T'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{assignment.teacher?.name || 'Teacher'}</p>
                        <p className="text-xs text-gray-600 truncate">{assignment.className || 'Class'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="text-center p-2 rounded-lg bg-purple-50">
                        <p className="text-xs text-gray-600">Subject</p>
                        <p className="text-xs font-bold text-purple-600 truncate">{assignment.subject || 'General'}</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-green-50">
                        <p className="text-xs text-gray-600">Due</p>
                        <p className="text-xs font-bold text-green-600">
                          {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <PermissionGuard require="approveAssignments">
                        <button
                          onClick={() => handleViewPreview(assignment)}
                          className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>

                        <button
                          onClick={() => handleApprove(assignment.id)}
                          disabled={processingId === assignment.id}
                          className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          {processingId === assignment.id ? '...' : 'Approve'}
                        </button>
                      </PermissionGuard>
                    </div>
                  </Motion.div>
                ))}
              </div>
            ) : (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center"
              >
                <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-500" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending assignments to review</p>
              </Motion.div>
            )}
          </>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <>
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template, idx) => (
                  <Motion.div
                    key={template.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{template.title}</h3>
                      {template.isPremium && (
                        <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow">
                        {template.creator?.name?.charAt(0) || 'C'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{template.creator?.name || 'Creator'}</p>
                        <p className="text-xs text-gray-600 capitalize">{template.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <PermissionGuard require="approveTemplates">
                        <button
                          onClick={() => handleViewTemplate(template)}
                          className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>

                        <button
                          onClick={() => handleApproveTemplate(template.id)}
                          disabled={processingId === template.id}
                          className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          {processingId === template.id ? '...' : 'Approve'}
                        </button>
                      </PermissionGuard>
                    </div>
                  </Motion.div>
                ))}
              </div>
            ) : (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center"
              >
                <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-500" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending templates to review</p>
              </Motion.div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <AssignmentPreviewModal />
      <RequestChangesModal />
      <TemplatePreviewModal />
    </div>
  );
};

export default SchoolAdminApprovals;
