import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import api from '../utils/api';

/**
 * Professional Permission Management Hook
 * Industry-level permission checking and management for frontend
 */

// Helper function to get default permissions based on role type
const getDefaultPermissionsForRole = (roleType) => {
  const rolePermissions = {
    'school_admin': ['*'], // All permissions
    'campus_admin': [
      'viewDashboard',
      'viewAnalytics',
      'viewOwnCampusOnly',
      'createStudent',
      'editStudent',
      'viewStudentPII',
      'createStaff',
      'editStaff',
      'assignClasses',
      'approveAssignments',
      'viewAllAssignments',
      'createTemplates',
      'editTemplates',
      'viewWellbeingCases',
      'createWellbeingFlags',
      'resolveWellbeingCases',
      'viewEmergencyAlerts',
      'createEmergencyAlerts',
    ],
    'counselor': [
      'viewDashboard',
      'viewAnalytics',
      'viewStudentPII',
      'viewWellbeingCases',
      'createWellbeingFlags',
      'resolveWellbeingCases',
      'accessCounselingData',
      'viewEmergencyAlerts',
    ],
    'school_teacher': [
      'viewDashboard',
      'viewAnalytics',
      'viewStudentPII',
      'createAssignments',
      'viewAllAssignments',
      'createTemplates',
      'editTemplates',
    ],
  };

  return rolePermissions[roleType] || [];
};

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [rolePermission, setRolePermission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user permissions from backend
  const fetchPermissions = useCallback(async () => {
    if (!user || !user.role) {
      setPermissions([]);
      setRolePermission(null);
      setLoading(false);
      return;
    }

    // Only fetch for school roles
    const schoolRoles = ['school_admin', 'campus_admin', 'counselor', 'school_teacher'];
    if (!schoolRoles.includes(user.role)) {
      setPermissions([]);
      setRolePermission(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use default permissions based on role type
      // Since role management UI is removed, we use hardcoded default permissions
      const defaultPermissions = getDefaultPermissionsForRole(user.role);
      
      if (defaultPermissions.length > 0) {
        setPermissions(defaultPermissions);
        // Create a mock rolePermission object for compatibility
        setRolePermission({
          roleType: user.role,
          roleName: user.role,
          displayName: user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          permissions: defaultPermissions.reduce((acc, perm) => {
            acc[perm] = true;
            return acc;
          }, {}),
        });
      } else {
        setPermissions([]);
        setRolePermission(null);
      }
    } catch (err) {
      console.error('Error setting permissions:', err);
      setError(err.message);
      
      // Fallback: grant all permissions for school_admin
      if (user.role === 'school_admin') {
        setPermissions(['*']);
      } else {
        setPermissions([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  /**
   * Check if user has a specific permission
   * @param {String|Array<String>} requiredPermission - Permission(s) to check
   * @param {String} mode - 'all' (AND) or 'any' (OR), default: 'all'
   * @returns {Boolean}
   */
  const hasPermission = useCallback((requiredPermission, mode = 'all') => {
    // School admin has all permissions by default
    if (permissions.includes('*')) {
      return true;
    }

    if (!requiredPermission) {
      return true;
    }

    const perms = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];

    if (mode === 'any') {
      return perms.some(perm => permissions.includes(perm));
    }

    return perms.every(perm => permissions.includes(perm));
  }, [permissions]);

  /**
   * Check if user can access a specific campus
   * @param {String} campusId - Campus ID to check
   * @returns {Boolean}
   */
  const canAccessCampus = useCallback((campusId) => {
    if (!campusId) {
      return true;
    }

    // School admin can access all campuses
    if (permissions.includes('*') || hasPermission('viewAllCampuses')) {
      return true;
    }

    // If user can only view own campus, check if it matches
    if (hasPermission('viewOwnCampusOnly') && !hasPermission('viewAllCampuses')) {
      return user?.campusId === campusId;
    }

    // Check campus restrictions if rolePermission exists
    if (rolePermission?.campusRestrictions && rolePermission.campusRestrictions.length > 0) {
      const restriction = rolePermission.campusRestrictions.find(
        r => r.campusId === campusId
      );
      if (restriction) {
        return restriction.canAccess === true;
      }
    }

    return true;
  }, [permissions, rolePermission, user, hasPermission]);

  /**
   * Get all permissions as an object
   * @returns {Object} Permission object with boolean values
   */
  const getPermissionsObject = useCallback(() => {
    if (permissions.includes('*')) {
      // Return all permissions as true for school_admin
      return {
        viewDashboard: true,
        viewAnalytics: true,
        viewAllCampuses: true,
        viewOwnCampusOnly: false,
        createStudent: true,
        editStudent: true,
        deleteStudent: true,
        viewStudentPII: true,
        createStaff: true,
        editStaff: true,
        deleteStaff: true,
        assignClasses: true,
        approveAssignments: true,
        createAssignments: true,
        viewAllAssignments: true,
        createTemplates: true,
        editTemplates: true,
        deleteTemplates: true,
        approveTemplates: true,
        publishTemplates: true,
        viewWellbeingCases: true,
        createWellbeingFlags: true,
        resolveWellbeingCases: true,
        accessCounselingData: true,
        viewFinancials: true,
        manageSubscription: true,
        manageSettings: true,
        manageCampuses: true,
        manageRoles: true,
        viewComplianceData: true,
        manageConsents: true,
        managePolicies: true,
        viewAuditLogs: true,
        viewEmergencyAlerts: true,
        createEmergencyAlerts: true,
        manageEscalation: true,
      };
    }

    if (!rolePermission || !rolePermission.permissions) {
      return {};
    }

    return rolePermission.permissions;
  }, [permissions, rolePermission]);

  /**
   * Check if user has any of the specified permissions
   * @param {Array<String>} permissionList - List of permissions to check
   * @returns {Boolean}
   */
  const hasAnyPermission = useCallback((permissionList) => {
    return hasPermission(permissionList, 'any');
  }, [hasPermission]);

  /**
   * Check if user has all of the specified permissions
   * @param {Array<String>} permissionList - List of permissions to check
   * @returns {Boolean}
   */
  const hasAllPermissions = useCallback((permissionList) => {
    return hasPermission(permissionList, 'all');
  }, [hasPermission]);

  return {
    permissions,
    rolePermission,
    loading,
    error,
    hasPermission,
    canAccessCampus,
    getPermissionsObject,
    hasAnyPermission,
    hasAllPermissions,
    refreshPermissions: fetchPermissions,
  };
};

/**
 * Higher-order component to protect routes/components based on permissions
 * @param {React.Component} Component - Component to protect
 * @param {String|Array<String>} requiredPermission - Required permission(s)
 * @param {React.Component} FallbackComponent - Component to show if no permission
 * @returns {React.Component}
 */
export const withPermission = (Component, requiredPermission, FallbackComponent = null) => {
  return (props) => {
    const { hasPermission, loading } = usePermissions();

    if (loading) {
      return <div className="flex items-center justify-center p-8">Loading...</div>;
    }

    if (!hasPermission(requiredPermission)) {
      if (FallbackComponent) {
        return <FallbackComponent {...props} />;
      }
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

/**
 * Permission-based conditional rendering component
 * @param {Object} props
 * @param {String|Array<String>} props.require - Required permission(s)
 * @param {String} props.mode - 'all' (AND) or 'any' (OR)
 * @param {React.ReactNode} props.children - Children to render if permission granted
 * @param {React.ReactNode} props.fallback - Fallback content if no permission
 * @returns {React.ReactNode}
 */
export const PermissionGuard = ({ require, mode = 'all', children, fallback = null }) => {
  const { hasPermission, loading } = usePermissions();

  if (loading) {
    return null;
  }

  if (!hasPermission(require, mode)) {
    return fallback;
  }

  return children;
};

