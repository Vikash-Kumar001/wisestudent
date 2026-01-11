import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Organization from "../models/Organization.js";

// Middleware to extract and validate tenant information
export const extractTenant = async (req, res, next) => {
  try {
    // Try to get token from Authorization header first, then cookies
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] || req.cookies?.finmen_token;
    
    if (!token) {
      // Log for debugging (only in development)
      if (process.env.NODE_ENV !== 'production') {
        console.log('No token found:', {
          hasAuthHeader: !!authHeader,
          hasCookies: !!req.cookies?.finmen_token,
          url: req.url,
          method: req.method
        });
      }
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('orgId');
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // For legacy users (without orgId), allow access to original features
    if (!user.orgId) {
      req.user = user;
      req.isLegacyUser = true;
      return next();
    }

    // For multi-tenant users, validate organization and tenant
    if (!user.tenantId) {
      return res.status(403).json({ message: "Tenant information missing" });
    }

    const organization = await Organization.findById(user.orgId);
    if (!organization || !organization.isActive) {
      return res.status(403).json({ message: "Organization not found or inactive" });
    }

    if (organization.tenantId && user.tenantId !== organization.tenantId) {
      user.tenantId = organization.tenantId;
      await user.save();
    }

    // Attach tenant information to request
    req.user = user;
    req.tenantId = user.tenantId;
    req.organization = organization;
    req.isMultiTenant = true;

    next();
  } catch (error) {
    console.error("Tenant middleware error:", error);
    
    // Provide more specific error messages
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    } else if (error.name === 'NotBeforeError') {
      return res.status(401).json({ message: "Token not active" });
    }
    
    return res.status(401).json({ message: "Authentication failed" });
  }
};

// Middleware to enforce tenant isolation for database queries
export const enforceTenantIsolation = (req, res, next) => {
  // Skip for legacy users
  if (req.isLegacyUser) {
    return next();
  }

  if (!req.tenantId) {
    return res.status(403).json({ message: "Tenant isolation required" });
  }

  // Add tenant filter to all database queries
  const originalQuery = req.query;
  req.query = { ...originalQuery, tenantId: req.tenantId };
  
  // Store original body and add tenantId
  if (req.body && typeof req.body === 'object') {
    req.body.tenantId = req.tenantId;
    req.body.orgId = req.user.orgId;
  }

  next();
};

// Middleware to check if user has required role within their tenant
export const requireTenantRole = (allowedRoles) => {
  return (req, res, next) => {
    if (req.isLegacyUser) {
      // For legacy users, use existing role check
      if (allowedRoles.includes(req.user.role)) {
        return next();
      }
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Insufficient permissions for this tenant operation" 
      });
    }

    next();
  };
};

// Middleware to validate resource belongs to user's tenant
export const validateTenantResource = async (req, res, next) => {
  if (req.isLegacyUser) {
    return next();
  }

  try {
    const resourceId = req.params.id;
    const Model = req.resourceModel; // Should be set by route handler
    
    if (!Model || !resourceId) {
      return next();
    }

    const resource = await Model.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (resource.tenantId !== req.tenantId) {
      return res.status(403).json({ 
        message: "Access denied: Resource belongs to different tenant" 
      });
    }

    req.resource = resource;
    next();
  } catch (error) {
    console.error("Tenant resource validation error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Middleware to check organization subscription limits
export const checkSubscriptionLimits = async (req, res, next) => {
  if (req.isLegacyUser) {
    return next();
  }

  try {
    const organization = req.organization;
    
    // Check if subscription is active
    if (organization.companyId) {
      const company = await Company.findById(organization.companyId);
      if (!company || new Date() > company.subscriptionExpiry) {
        return res.status(403).json({ 
          message: "Subscription expired. Please renew to continue." 
        });
      }
    }

    // Check user limits
    if (organization.userCount >= organization.maxUsers) {
      return res.status(403).json({ 
        message: "User limit reached. Please upgrade your plan." 
      });
    }

    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Helper function to get tenant-scoped query
export const getTenantQuery = (req, baseQuery = {}) => {
  if (req.isLegacyUser) {
    return baseQuery;
  }
  
  return {
    ...baseQuery,
    tenantId: req.tenantId
  };
};

// Helper function to add tenant data to document
export const addTenantData = (req, data) => {
  if (req.isLegacyUser) {
    return data;
  }
  
  return {
    ...data,
    tenantId: req.tenantId,
    orgId: req.user.orgId
  };
};