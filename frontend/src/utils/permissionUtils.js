/**
 * Permission Utility Functions
 * Helper functions for permission checking and management
 */

/**
 * Permission labels mapping
 */
export const PERMISSION_LABELS = {
  // Dashboard access
  viewDashboard: 'View Dashboard',
  viewAnalytics: 'View Analytics',
  viewAllCampuses: 'View All Campuses',
  viewOwnCampusOnly: 'View Own Campus Only',
  
  // Student management
  createStudent: 'Create Student',
  editStudent: 'Edit Student',
  deleteStudent: 'Delete Student',
  viewStudentPII: 'View Student PII',
  
  // Teacher/Staff management
  createStaff: 'Create Staff',
  editStaff: 'Edit Staff',
  deleteStaff: 'Delete Staff',
  assignClasses: 'Assign Classes',
  
  // Assignments & Content
  approveAssignments: 'Approve Assignments',
  createAssignments: 'Create Assignments',
  viewAllAssignments: 'View All Assignments',
  
  // Templates
  createTemplates: 'Create Templates',
  editTemplates: 'Edit Templates',
  deleteTemplates: 'Delete Templates',
  approveTemplates: 'Approve Templates',
  publishTemplates: 'Publish Templates',
  
  // Wellbeing & Counseling
  viewWellbeingCases: 'View Wellbeing Cases',
  createWellbeingFlags: 'Create Wellbeing Flags',
  resolveWellbeingCases: 'Resolve Wellbeing Cases',
  accessCounselingData: 'Access Counseling Data',
  
  // Financial
  viewFinancials: 'View Financials',
  manageSubscription: 'Manage Subscription',
  
  // Settings & Configuration
  manageSettings: 'Manage Settings',
  manageCampuses: 'Manage Campuses',
  manageRoles: 'Manage Roles',
  
  // Compliance
  viewComplianceData: 'View Compliance Data',
  manageConsents: 'Manage Consents',
  managePolicies: 'Manage Policies',
  viewAuditLogs: 'View Audit Logs',
  
  // Emergency
  viewEmergencyAlerts: 'View Emergency Alerts',
  createEmergencyAlerts: 'Create Emergency Alerts',
  manageEscalation: 'Manage Escalation',
};

/**
 * Get human-readable label for a permission
 * @param {String} permission - Permission key
 * @returns {String} Human-readable label
 */
export const getPermissionLabel = (permission) => {
  return PERMISSION_LABELS[permission] || permission;
};

/**
 * Group permissions by category
 * @param {Array<String>} permissions - List of permissions
 * @returns {Object} Grouped permissions
 */
export const groupPermissionsByCategory = (permissions) => {
  const categories = {
    'Dashboard & Analytics': ['viewDashboard', 'viewAnalytics', 'viewAllCampuses', 'viewOwnCampusOnly'],
    'Student Management': ['createStudent', 'editStudent', 'deleteStudent', 'viewStudentPII'],
    'Staff Management': ['createStaff', 'editStaff', 'deleteStaff', 'assignClasses'],
    'Assignments & Content': ['approveAssignments', 'createAssignments', 'viewAllAssignments'],
    'Templates': ['createTemplates', 'editTemplates', 'deleteTemplates', 'approveTemplates', 'publishTemplates'],
    'Wellbeing & Counseling': ['viewWellbeingCases', 'createWellbeingFlags', 'resolveWellbeingCases', 'accessCounselingData'],
    'Financial': ['viewFinancials', 'manageSubscription'],
    'Settings & Configuration': ['manageSettings', 'manageCampuses', 'manageRoles'],
    'Compliance': ['viewComplianceData', 'manageConsents', 'managePolicies', 'viewAuditLogs'],
    'Emergency': ['viewEmergencyAlerts', 'createEmergencyAlerts', 'manageEscalation'],
  };

  const grouped = {};
  
  Object.entries(categories).forEach(([category, categoryPerms]) => {
    const matchingPerms = permissions.filter(perm => categoryPerms.includes(perm));
    if (matchingPerms.length > 0) {
      grouped[category] = matchingPerms;
    }
  });

  return grouped;
};

/**
 * Check if permission is required for an action
 * @param {String} action - Action name (e.g., 'create', 'edit', 'delete', 'view')
 * @param {String} resource - Resource name (e.g., 'student', 'teacher', 'campus')
 * @returns {String|null} Required permission or null
 */
export const getRequiredPermission = (action, resource) => {
  const permissionMap = {
    'create': {
      'student': 'createStudent',
      'teacher': 'createStaff',
      'staff': 'createStaff',
      'campus': 'manageCampuses',
      'template': 'createTemplates',
      'assignment': 'createAssignments',
      'role': 'manageRoles',
    },
    'edit': {
      'student': 'editStudent',
      'teacher': 'editStaff',
      'staff': 'editStaff',
      'campus': 'manageCampuses',
      'template': 'editTemplates',
      'assignment': 'editAssignments',
      'role': 'manageRoles',
      'settings': 'manageSettings',
    },
    'delete': {
      'student': 'deleteStudent',
      'teacher': 'deleteStaff',
      'staff': 'deleteStaff',
      'campus': 'manageCampuses',
      'template': 'deleteTemplates',
      'assignment': 'deleteAssignments',
    },
    'view': {
      'student': 'viewStudentPII',
      'dashboard': 'viewDashboard',
      'analytics': 'viewAnalytics',
      'campuses': 'viewAllCampuses',
      'assignments': 'viewAllAssignments',
      'compliance': 'viewComplianceData',
      'audit': 'viewAuditLogs',
      'financials': 'viewFinancials',
    },
    'approve': {
      'assignment': 'approveAssignments',
      'template': 'approveTemplates',
    },
  };

  return permissionMap[action]?.[resource] || null;
};

/**
 * Format permission list for display
 * @param {Array<String>} permissions - List of permissions
 * @param {Number} maxDisplay - Maximum number to display before showing "+X more"
 * @returns {Array<Object>} Formatted permission list
 */
export const formatPermissionsForDisplay = (permissions, maxDisplay = 6) => {
  if (permissions.length <= maxDisplay) {
    return permissions.map(perm => ({
      key: perm,
      label: getPermissionLabel(perm),
    }));
  }

  const displayed = permissions.slice(0, maxDisplay).map(perm => ({
    key: perm,
    label: getPermissionLabel(perm),
  }));

  const remaining = permissions.length - maxDisplay;

  return {
    displayed,
    remaining,
    total: permissions.length,
  };
};

