import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Settings, Building2, Users, Shield, Bell, Globe, Save, X, Plus, Edit,
  Trash2, Check, AlertCircle, MapPin, Mail, Phone, User, Lock, Key,
  CheckCircle, Info, Calendar, Zap, Target, Award, FileText
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const SchoolAdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  
  // General Settings
  const [organizationInfo, setOrganizationInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: ''
  });

  // Campus Management
  const [campuses, setCampuses] = useState([]);
  const [showAddCampusModal, setShowAddCampusModal] = useState(false);
  const [showEditCampusModal, setShowEditCampusModal] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [campusForm, setCampusForm] = useState({
    name: '',
    code: '',
    location: '',
    contactInfo: { email: '', phone: '' },
    principalId: ''
  });
  const [campusFormErrors, setCampusFormErrors] = useState({});
  const [isSubmittingCampus, setIsSubmittingCampus] = useState(false);

  // Preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoApproval: false,
    requireApprovalForLargeScope: true,
    defaultGradingSystem: 'percentage',
    academicYearStart: '04-01',
    timezone: 'Asia/Kolkata'
  });

  useEffect(() => {
    fetchAllSettings();
  }, []);

  const fetchAllSettings = async () => {
    try {
      setLoading(true);
      const [orgRes, campusesRes] = await Promise.all([
        api.get('/api/school/admin/organization-info'),
        api.get('/api/school/admin/campuses')
      ]);

      // Normalize organization info - handle address as string or object
      const orgData = orgRes.data.organization || {};
      let normalizedAddress = '';
      
      if (orgData.address) {
        if (typeof orgData.address === 'string') {
          normalizedAddress = orgData.address;
        } else if (typeof orgData.address === 'object') {
          // If street contains the full address (has commas or is long), use only street
          if (orgData.address.street && (orgData.address.street.includes(',') || orgData.address.street.length > 50)) {
            normalizedAddress = orgData.address.street;
          } else {
            // Convert address object to string, avoiding duplicates
            const addressParts = [];
            if (orgData.address.street) addressParts.push(orgData.address.street);
            if (orgData.address.city) addressParts.push(orgData.address.city);
            if (orgData.address.state) addressParts.push(orgData.address.state);
            if (orgData.address.pincode) addressParts.push(orgData.address.pincode);
            if (orgData.address.country) addressParts.push(orgData.address.country);
            normalizedAddress = addressParts.join(', ');
          }
        }
      }
      
      // Remove duplicate address parts (in case address was saved incorrectly)
      if (normalizedAddress) {
        const parts = normalizedAddress.split(',').map(p => p.trim()).filter(Boolean);
        const uniqueParts = [];
        const seen = new Set();
        for (const part of parts) {
          // Only add if we haven't seen this exact part before
          if (!seen.has(part.toLowerCase())) {
            seen.add(part.toLowerCase());
            uniqueParts.push(part);
          }
        }
        normalizedAddress = uniqueParts.join(', ');
      }

      setOrganizationInfo({
        name: orgData.name || '',
        email: orgData.email || '',
        phone: orgData.phone || '',
        address: normalizedAddress,
        website: orgData.website || ''
      });
      setCampuses(campusesRes.data.campuses || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  // Save Organization Info
  const handleSaveOrganization = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Prepare payload with trimmed values - ensure name is always sent if it exists
      const payload = {
        name: organizationInfo.name ? organizationInfo.name.trim() : '',
        email: organizationInfo.email ? organizationInfo.email.trim() : '',
        phone: organizationInfo.phone ? organizationInfo.phone.trim() : '',
        address: organizationInfo.address ? organizationInfo.address.trim() : '',
        website: organizationInfo.website ? organizationInfo.website.trim() : ''
      };

      console.log('📤 Sending organization update:', payload);

      const response = await api.put('/api/school/admin/organization-info', payload);
      console.log('✅ Organization update response:', response.data);
      
      toast.success('Organization settings saved successfully!');
      
      // Refresh data to get updated values
      await fetchAllSettings();
    } catch (error) {
      console.error('❌ Error saving organization:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Validate campus form
  const validateCampusForm = () => {
    const errors = {};
    
    // Name validation
    if (!campusForm.name.trim()) {
      errors.name = 'Campus name is required';
    } else if (campusForm.name.trim().length < 3) {
      errors.name = 'Campus name must be at least 3 characters';
    } else if (campusForm.name.trim().length > 100) {
      errors.name = 'Campus name must be less than 100 characters';
    }

    // Code validation (optional but if provided, must be valid)
    if (campusForm.code && campusForm.code.trim().length > 20) {
      errors.code = 'Campus code must be less than 20 characters';
    }

    // Location validation
    if (!campusForm.location.trim()) {
      errors.location = 'Location is required';
    } else if (campusForm.location.trim().length < 5) {
      errors.location = 'Location must be at least 5 characters';
    } else if (campusForm.location.trim().length > 200) {
      errors.location = 'Location must be less than 200 characters';
    }

    // Email validation
    if (campusForm.contactInfo.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(campusForm.contactInfo.email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (campusForm.contactInfo.phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(campusForm.contactInfo.phone.trim())) {
        errors.phone = 'Please enter a valid phone number';
      } else if (campusForm.contactInfo.phone.replace(/\D/g, '').length < 10) {
        errors.phone = 'Phone number must contain at least 10 digits';
      }
    }

    setCampusFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add Campus
  const handleAddCampus = async (e) => {
    e.preventDefault();
    
    if (!validateCampusForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmittingCampus(true);
    try {
      const payload = {
        name: campusForm.name.trim(),
        code: campusForm.code.trim() || undefined,
        location: campusForm.location.trim(),
        contactInfo: {
          email: campusForm.contactInfo.email.trim() || undefined,
          phone: campusForm.contactInfo.phone.trim() || undefined
        },
        principalId: campusForm.principalId || undefined
      };

      await api.post('/api/school/admin/campuses', payload);
      toast.success('Campus added successfully!');
      setShowAddCampusModal(false);
      resetCampusForm();
      fetchAllSettings();
    } catch (error) {
      console.error('Error adding campus:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add campus';
      toast.error(errorMessage);
      
      // Set field-specific errors if provided by backend
      if (error.response?.data?.errors) {
        setCampusFormErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmittingCampus(false);
    }
  };

  // Edit Campus
  const handleEditCampus = async (e) => {
    e.preventDefault();
    
    if (!validateCampusForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmittingCampus(true);
    try {
      const payload = {
        name: campusForm.name.trim(),
        code: campusForm.code.trim() || undefined,
        location: campusForm.location.trim(),
        contactInfo: {
          email: campusForm.contactInfo.email.trim() || undefined,
          phone: campusForm.contactInfo.phone.trim() || undefined
        }
      };

      await api.put(`/api/school/admin/campuses/${selectedCampus.campusId}`, payload);
      toast.success('Campus updated successfully!');
      setShowEditCampusModal(false);
      setSelectedCampus(null);
      resetCampusForm();
      fetchAllSettings();
    } catch (error) {
      console.error('Error updating campus:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update campus';
      toast.error(errorMessage);
      
      // Set field-specific errors if provided by backend
      if (error.response?.data?.errors) {
        setCampusFormErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmittingCampus(false);
    }
  };

  // Delete Campus
  const handleDeleteCampus = async (campusId) => {
    if (!window.confirm('Are you sure you want to delete this campus?')) {
      return;
    }

    try {
      await api.delete(`/api/school/admin/campuses/${campusId}`);
      toast.success('Campus deleted successfully');
      fetchAllSettings();
    } catch (error) {
      console.error('Error deleting campus:', error);
      toast.error('Failed to delete campus');
    }
  };

  const openEditCampus = (campus) => {
    setSelectedCampus(campus);
    setCampusForm({
      name: campus.name || '',
      code: campus.code || '',
      location: campus.location || '',
      contactInfo: campus.contactInfo || { email: '', phone: '' },
      principalId: campus.principal?._id || ''
    });
    setCampusFormErrors({});
    setShowEditCampusModal(true);
  };

  const resetCampusForm = () => {
    setCampusForm({
      name: '',
      code: '',
      location: '',
      contactInfo: { email: '', phone: '' },
      principalId: ''
    });
    setCampusFormErrors({});
  };

  const handleCampusFormChange = useCallback((field, value) => {
    setCampusForm(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
    
    // Clear error for this field when user starts typing
    setCampusFormErrors(prev => {
      const newErrors = { ...prev };
      if (field.includes('.')) {
        const [parent] = field.split('.');
        delete newErrors[parent];
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  }, []);

  // Save Preferences
  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      await api.put('/api/school/admin/preferences', preferences);
      toast.success('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  // Campus Modal Component - Professional Industry Level
  const CampusModal = ({ isEdit = false }) => {
    const isOpen = isEdit ? showEditCampusModal : showAddCampusModal;
    
    const handleClose = useCallback(() => {
      if (isSubmittingCampus) {
        return; // Prevent closing while submitting
      }
      
      if (isEdit) {
        setShowEditCampusModal(false);
      } else {
        setShowAddCampusModal(false);
      }
      resetCampusForm();
    }, [isEdit, isSubmittingCampus]);

    // Handle ESC key press
    useEffect(() => {
      if (!isOpen) {
        document.body.style.overflow = 'unset';
        return;
      }
      
      const handleEscape = (e) => {
        if (e.key === 'Escape' && !isSubmittingCampus) {
          handleClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, isSubmittingCampus, handleClose]);

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                {/* Professional Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black mb-1">
                          {isEdit ? 'Edit Campus' : 'Add New Campus'}
                        </h2>
                        <p className="text-sm text-white/90">
                          {isEdit ? 'Update campus information and details' : 'Configure new campus details and contact information'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      disabled={isSubmittingCampus}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Close modal"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                <form 
                  onSubmit={isEdit ? handleEditCampus : handleAddCampus} 
                  className="flex-1 overflow-y-auto p-6 space-y-6"
                >
                  {/* Basic Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                      <Info className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Campus Name */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-indigo-600" />
                          Campus Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="campusName"
                          value={campusForm.name}
                          onChange={(e) => handleCampusFormChange('name', e.target.value)}
                          onBlur={() => {
                            // Validate only the name field
                            if (!campusForm.name.trim()) {
                              setCampusFormErrors(prev => ({ ...prev, name: 'Campus name is required' }));
                            } else if (campusForm.name.trim().length < 3) {
                              setCampusFormErrors(prev => ({ ...prev, name: 'Campus name must be at least 3 characters' }));
                            } else if (campusForm.name.trim().length > 100) {
                              setCampusFormErrors(prev => ({ ...prev, name: 'Campus name must be less than 100 characters' }));
                            } else {
                              setCampusFormErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.name;
                                return newErrors;
                              });
                            }
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none font-semibold transition-all ${
                            campusFormErrors.name
                              ? 'border-red-500 focus:border-red-600 bg-red-50'
                              : 'border-gray-200 focus:border-indigo-500 bg-white'
                          }`}
                          placeholder="e.g., Main Campus, East Wing, Downtown Branch"
                          maxLength={100}
                          disabled={isSubmittingCampus}
                          aria-invalid={!!campusFormErrors.name}
                          aria-describedby={campusFormErrors.name ? 'name-error' : undefined}
                        />
                        {campusFormErrors.name && (
                          <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {campusFormErrors.name}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          {campusForm.name.length}/100 characters
                        </p>
                      </div>

                      {/* Campus Code */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <Key className="w-4 h-4 text-gray-600" />
                          Campus Code
                          <span className="text-xs font-normal text-gray-500">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          name="campusCode"
                          value={campusForm.code}
                          onChange={(e) => handleCampusFormChange('code', e.target.value.toUpperCase())}
                          onBlur={() => {
                            // Validate only the code field
                            if (campusForm.code && campusForm.code.trim().length > 20) {
                              setCampusFormErrors(prev => ({ ...prev, code: 'Campus code must be less than 20 characters' }));
                            } else {
                              setCampusFormErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.code;
                                return newErrors;
                              });
                            }
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none font-semibold transition-all ${
                            campusFormErrors.code
                              ? 'border-red-500 focus:border-red-600 bg-red-50'
                              : 'border-gray-200 focus:border-indigo-500 bg-white'
                          }`}
                          placeholder="CAMP-001"
                          maxLength={20}
                          disabled={isSubmittingCampus}
                          aria-invalid={!!campusFormErrors.code}
                        />
                        {campusFormErrors.code && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {campusFormErrors.code}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          Short identifier for this campus
                        </p>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-600" />
                          Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="campusLocation"
                          value={campusForm.location}
                          onChange={(e) => handleCampusFormChange('location', e.target.value)}
                          onBlur={() => {
                            // Validate only the location field
                            if (!campusForm.location.trim()) {
                              setCampusFormErrors(prev => ({ ...prev, location: 'Location is required' }));
                            } else if (campusForm.location.trim().length < 5) {
                              setCampusFormErrors(prev => ({ ...prev, location: 'Location must be at least 5 characters' }));
                            } else if (campusForm.location.trim().length > 200) {
                              setCampusFormErrors(prev => ({ ...prev, location: 'Location must be less than 200 characters' }));
                            } else {
                              setCampusFormErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.location;
                                return newErrors;
                              });
                            }
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none font-semibold transition-all ${
                            campusFormErrors.location
                              ? 'border-red-500 focus:border-red-600 bg-red-50'
                              : 'border-gray-200 focus:border-indigo-500 bg-white'
                          }`}
                          placeholder="123 Education Street, City, State, ZIP"
                          maxLength={200}
                          disabled={isSubmittingCampus}
                          aria-invalid={!!campusFormErrors.location}
                        />
                        {campusFormErrors.location && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {campusFormErrors.location}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          Full address of the campus
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 pb-2">
                      <Phone className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                      <span className="text-xs font-normal text-gray-500">(Optional)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Contact Email */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-600" />
                          Contact Email
                        </label>
                        <input
                          type="email"
                          value={campusForm.contactInfo.email}
                          onChange={(e) => handleCampusFormChange('contactInfo.email', e.target.value)}
                          onBlur={(e) => {
                            // Only validate if field has value or was previously focused
                            if (e.target.value.trim() || campusFormErrors[e.target.name]) {
                              validateCampusForm();
                            }
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none font-semibold transition-all ${
                            campusFormErrors.email
                              ? 'border-red-500 focus:border-red-600 bg-red-50'
                              : 'border-gray-200 focus:border-indigo-500 bg-white'
                          }`}
                          placeholder="campus@school.com"
                          disabled={isSubmittingCampus}
                          aria-invalid={!!campusFormErrors.email}
                        />
                        {campusFormErrors.email && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {campusFormErrors.email}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          Official email for this campus
                        </p>
                      </div>

                      {/* Contact Phone */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-600" />
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          name="campusPhone"
                          value={campusForm.contactInfo.phone}
                          onChange={(e) => handleCampusFormChange('contactInfo.phone', e.target.value)}
                          onBlur={() => {
                            // Validate only the phone field
                            if (campusForm.contactInfo.phone) {
                              const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                              if (!phoneRegex.test(campusForm.contactInfo.phone.trim())) {
                                setCampusFormErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }));
                              } else if (campusForm.contactInfo.phone.replace(/\D/g, '').length < 10) {
                                setCampusFormErrors(prev => ({ ...prev, phone: 'Phone number must contain at least 10 digits' }));
                              } else {
                                setCampusFormErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.phone;
                                  return newErrors;
                                });
                              }
                            }
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none font-semibold transition-all ${
                            campusFormErrors.phone
                              ? 'border-red-500 focus:border-red-600 bg-red-50'
                              : 'border-gray-200 focus:border-indigo-500 bg-white'
                          }`}
                          placeholder="+91 98765 43210"
                          disabled={isSubmittingCampus}
                          aria-invalid={!!campusFormErrors.phone}
                        />
                        {campusFormErrors.phone && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {campusFormErrors.phone}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          Include country code (e.g., +91)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmittingCampus}
                      className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingCampus || Object.keys(campusFormErrors).length > 0}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmittingCampus ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          {isEdit ? 'Updating...' : 'Adding...'}
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          {isEdit ? 'Update Campus' : 'Add Campus'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

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
              <Settings className="w-10 h-10" />
              School Settings
            </h1>
            <p className="text-lg text-white/90">Manage your school configuration and preferences</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-2 mb-6 flex gap-2 flex-wrap"
        >
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'general'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            General
          </button>
          <button
            onClick={() => setActiveTab('campuses')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'campuses'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Campuses
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'preferences'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Zap className="w-4 h-4" />
            Preferences
          </button>
        </motion.div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-purple-600" />
              Organization Information
            </h2>

            <form onSubmit={handleSaveOrganization} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">School Name *</label>
                  <input
                    type="text"
                    value={organizationInfo.name || ''}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                    placeholder="Enter school name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={organizationInfo.email || ''}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                    placeholder="school@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={organizationInfo.phone || ''}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={organizationInfo.website || ''}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, website: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                    placeholder="https://www.school.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    Address
                  </label>
                  <textarea
                    value={typeof organizationInfo.address === 'string' ? organizationInfo.address : (organizationInfo.address || '')}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, address: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold resize-none transition-all"
                    rows="3"
                    placeholder="Enter full address (Street, City, State, ZIP, Country)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the complete address of your school
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Campuses Tab */}
        {activeTab === 'campuses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-purple-600" />
                Campus Management
              </h2>
              <button
                onClick={() => setShowAddCampusModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Campus
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campuses.map((campus, idx) => (
                <motion.div
                  key={campus.campusId || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-purple-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{campus.name}</h3>
                      {campus.isMain && (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold mt-1">
                          Main Campus
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{campus.location || 'No location'}</span>
                    </div>
                    {campus.contactInfo?.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="line-clamp-1">{campus.contactInfo.email}</span>
                      </div>
                    )}
                    {campus.contactInfo?.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{campus.contactInfo.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-center p-2 rounded-lg bg-blue-50">
                      <p className="text-xs text-gray-600">Students</p>
                      <p className="text-lg font-black text-blue-600">{campus.studentCount || 0}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-green-50">
                      <p className="text-xs text-gray-600">Teachers</p>
                      <p className="text-lg font-black text-green-600">{campus.teacherCount || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditCampus(campus)}
                      className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    {!campus.isMain && (
                      <button
                        onClick={() => handleDeleteCampus(campus.campusId)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {campuses.length === 0 && (
                <div className="md:col-span-2 lg:col-span-3 bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Campuses Yet</h3>
                  <p className="text-gray-600 mb-6">Add your first campus to get started</p>
                  <button
                    onClick={() => setShowAddCampusModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Add Campus
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-600" />
              System Preferences
            </h2>

            <div className="space-y-6">
              {/* Notifications */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-600" />
                  Notifications
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-gray-900">Email Notifications</p>
                      <p className="text-xs text-gray-600">Receive updates via email</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={preferences.smsNotifications}
                      onChange={(e) => setPreferences({...preferences, smsNotifications: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-gray-900">SMS Notifications</p>
                      <p className="text-xs text-gray-600">Receive alerts via SMS</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Approval Settings */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  Approval Settings
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={preferences.requireApprovalForLargeScope}
                      onChange={(e) => setPreferences({...preferences, requireApprovalForLargeScope: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-gray-900">Require Approval for Large Scope</p>
                      <p className="text-xs text-gray-600">School-wide or multi-campus assignments need approval</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Academic Settings */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Academic Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Default Grading System</label>
                    <select
                      value={preferences.defaultGradingSystem}
                      onChange={(e) => setPreferences({...preferences, defaultGradingSystem: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
                    >
                      <option value="percentage">Percentage (0-100)</option>
                      <option value="grade">Letter Grade (A-F)</option>
                      <option value="gpa">GPA (0.0-4.0)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Timezone</label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-semibold"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <CampusModal isEdit={false} />
      <CampusModal isEdit={true} />
    </div>
  );
};

export default SchoolAdminSettings;
