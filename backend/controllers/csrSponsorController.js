import bcrypt from "bcryptjs";
import {
  registerSponsor as registerSponsorService,
  getSponsorProfile as getSponsorProfileService,
  updateProfile as updateProfileService,
  getDashboardData as getDashboardDataService,
  listCsrNotifications as listCsrNotificationsService,
  markCsrNotificationRead as markCsrNotificationReadService,
  markAllCsrNotificationsRead as markAllCsrNotificationsReadService,
} from "../services/csrSponsorService.js";
import CSRSponsor from "../models/CSRSponsor.js";
import User from "../models/User.js";

const handleErrorResponse = (res, error, fallbackMessage) => {
  console.error(fallbackMessage, error);
  const status = error.status || 500;
  res.status(status).json({
    message: error.message || fallbackMessage,
    error: error.message,
  });
};

/**
 * Public CSR self-registration (doc alignment: POST /api/csr/register).
 * No auth required. Creates User (role csr, approvalStatus pending) + CSRSponsor, notifies admin.
 */
export const registerCsrPublic = async (req, res) => {
  try {
    const { name, email, password, organization, phone, website, registrationNumber, industry, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    const companyName = organization || name;
    if (!companyName) {
      return res.status(400).json({ message: "Organization or company name is required" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "csr",
      isVerified: true,
      approvalStatus: "pending",
      organization: companyName,
    });
    const csrSponsorData = {
      userId: newUser._id,
      companyName: companyName.trim(),
      contactName: name.trim(),
      email: normalizedEmail,
      status: "active",
      autoCreated: false,
    };
    if (phone) csrSponsorData.phone = phone;
    if (website) csrSponsorData.website = website;
    if (registrationNumber) csrSponsorData.registrationNumber = registrationNumber;
    if (industry) csrSponsorData.industry = industry;
    if (address && typeof address === "object") {
      csrSponsorData.address = {};
      if (address.street) csrSponsorData.address.street = address.street;
      if (address.city) csrSponsorData.address.city = address.city;
      if (address.state) csrSponsorData.address.state = address.state;
      if (address.postalCode) csrSponsorData.address.postalCode = address.postalCode;
      if (address.country) csrSponsorData.address.country = address.country;
    }
    const csrSponsor = new CSRSponsor(csrSponsorData);
    await csrSponsor.save();
    try {
      const { notifyAdminNewCSR } = await import("../cronJobs/csrNotificationUtils.js");
      await notifyAdminNewCSR(csrSponsor);
    } catch (notifyErr) {
      console.error("CSR registration: notify admin failed", notifyErr);
    }
    res.status(201).json({
      message: "CSR account created successfully. Your account is pending admin approval.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        approvalStatus: newUser.approvalStatus,
      },
    });
  } catch (error) {
    handleErrorResponse(res, error, "CSR registration error:");
  }
};

export const registerSponsor = async (req, res) => {
  try {
    const sponsor = await registerSponsorService(req.user, req.body);
    res.status(201).json({ message: "Sponsor registered", data: sponsor });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Sponsor registration error:");
  }
};

export const getSponsorProfile = async (req, res) => {
  try {
    const sponsor = await getSponsorProfileService(req.user);
    res.json({ message: "Sponsor profile fetched", data: sponsor });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Sponsor profile fetch error:");
  }
};

export const updateSponsorProfile = async (req, res) => {
  try {
    const sponsor = await updateProfileService(req.user, req.body);
    res.json({ message: "Sponsor profile updated", data: sponsor });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Sponsor update error:");
  }
};

export const getSponsorDashboard = async (req, res) => {
  try {
    const dashboard = await getDashboardDataService(req.user);
    res.json({ message: "Dashboard retrieved", data: dashboard });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Sponsor dashboard error:");
  }
};

// Get CSR notification preferences
export const getPreferences = async (req, res) => {
  try {
    const sponsor = await CSRSponsor.findOne({ userId: req.user._id });
    
    if (!sponsor) {
      return res.status(404).json({ message: "CSR sponsor profile not found" });
    }

    // Return preferences or defaults
    const preferences = sponsor.notificationPreferences || {};
    res.json({
      message: "Preferences fetched",
      data: {
        emailNotifications: preferences.channels?.includes("email") ?? true,
        inAppNotifications: preferences.channels?.includes("in_app") ?? true,
        notificationFrequency: preferences.frequency || "daily",
        enabled: preferences.enabled ?? true,
      },
    });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Preferences fetch error:");
  }
};

// Update CSR notification preferences
export const updatePreferences = async (req, res) => {
  try {
    const { emailNotifications, inAppNotifications, notificationFrequency } = req.body;
    
    const sponsor = await CSRSponsor.findOne({ userId: req.user._id });
    
    if (!sponsor) {
      return res.status(404).json({ message: "CSR sponsor profile not found" });
    }

    // Build channels array based on preferences
    const channels = [];
    if (emailNotifications !== false) channels.push("email");
    if (inAppNotifications !== false) channels.push("in_app");

    // Update notification preferences
    sponsor.notificationPreferences = {
      enabled: channels.length > 0,
      channels: channels.length > 0 ? channels : ["email", "in_app"],
      frequency: notificationFrequency || "daily",
      recipients: sponsor.notificationPreferences?.recipients || [],
    };

    await sponsor.save();

    res.json({
      message: "Preferences updated",
      data: {
        emailNotifications: emailNotifications !== false,
        inAppNotifications: inAppNotifications !== false,
        notificationFrequency: notificationFrequency || "daily",
        enabled: sponsor.notificationPreferences.enabled,
      },
    });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Preferences update error:");
  }
};

// GET /api/csr/settings — CSR settings (doc alignment: combines preferences + any future settings)
export const getSettings = async (req, res) => {
  try {
    const sponsor = await CSRSponsor.findOne({ userId: req.user._id });
    if (!sponsor) {
      return res.status(404).json({ message: "CSR sponsor profile not found" });
    }
    const prefs = sponsor.notificationPreferences || {};
    res.json({
      message: "Settings fetched",
      data: {
        notificationPreferences: {
          email: prefs.channels?.includes("email") ?? true,
          inApp: prefs.channels?.includes("in_app") ?? true,
          frequency: prefs.frequency || "daily",
          enabled: prefs.enabled ?? true,
        },
      },
    });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Settings fetch error:");
  }
};

// PUT /api/csr/settings — Update CSR settings (doc alignment)
export const updateSettings = async (req, res) => {
  try {
    const { notificationPreferences } = req.body;
    const sponsor = await CSRSponsor.findOne({ userId: req.user._id });
    if (!sponsor) {
      return res.status(404).json({ message: "CSR sponsor profile not found" });
    }
    if (notificationPreferences) {
      const { email, inApp, frequency } = notificationPreferences;
      const channels = [];
      if (email !== false) channels.push("email");
      if (inApp !== false) channels.push("in_app");
      sponsor.notificationPreferences = {
        enabled: channels.length > 0,
        channels: channels.length > 0 ? channels : ["email", "in_app"],
        frequency: frequency || "daily",
        recipients: sponsor.notificationPreferences?.recipients || [],
      };
    }
    await sponsor.save();
    const prefs = sponsor.notificationPreferences || {};
    res.json({
      message: "Settings updated",
      data: {
        notificationPreferences: {
          email: prefs.channels?.includes("email") ?? true,
          inApp: prefs.channels?.includes("in_app") ?? true,
          frequency: prefs.frequency || "daily",
          enabled: prefs.enabled ?? true,
        },
      },
    });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Settings update error:");
  }
};

// GET /api/csr/registration-status — CSR registration/approval status (doc alignment)
export const getRegistrationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("approvalStatus rejectionReason rejectedAt createdAt");
    const sponsor = await CSRSponsor.findOne({ userId: req.user._id }).select("companyName createdAt");
    const status = user?.approvalStatus || "pending";
    const programCount = sponsor
      ? await Program.countDocuments({ csrPartnerId: sponsor._id })
      : 0;
    res.json({
      message: "Registration status fetched",
      data: {
        status,
        hasPrograms: programCount > 0,
        companyName: sponsor?.companyName || null,
        rejectionReason: user?.rejectionReason || null,
        rejectedAt: user?.rejectedAt || null,
        registeredAt: sponsor?.createdAt || user?.createdAt || null,
      },
    });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Registration status error:");
  }
};

// PUT /api/csr/change-password — CSR change password (doc alignment)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.password) {
      return res.status(400).json({ message: "Cannot change password for social login accounts" });
    }
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    handleErrorResponse(res, error, "CSR Change password error:");
  }
};

// GET /api/csr/notifications — list CSR notifications (doc alignment)
export const getCsrNotifications = async (req, res) => {
  try {
    const { limit } = req.query;
    const result = await listCsrNotificationsService(req.user._id, { limit: limit ? parseInt(limit, 10) : 50 });
    res.json({
      message: "Notifications loaded",
      notifications: result.notifications,
      unreadCount: result.unreadCount,
    });
  } catch (error) {
    handleErrorResponse(res, error, "CSR notifications list error:");
  }
};

// PUT /api/csr/notifications/:id/read — mark notification as read (doc alignment)
export const markCsrNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    await markCsrNotificationReadService(id, req.user._id);
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    handleErrorResponse(res, error, "CSR notification mark read error:");
  }
};

// PUT /api/csr/notifications/read-all — mark all as read (convenience)
export const markAllCsrNotificationsRead = async (req, res) => {
  try {
    const result = await markAllCsrNotificationsReadService(req.user._id);
    res.json({ message: "All notifications marked as read", updated: result.updated });
  } catch (error) {
    handleErrorResponse(res, error, "CSR mark all read error:");
  }
};

export default {
  registerSponsor,
  getSponsorProfile,
  updateSponsorProfile,
  getSponsorDashboard,
  getPreferences,
  updatePreferences,
  getSettings,
  updateSettings,
  changePassword,
  getRegistrationStatus,
  getCsrNotifications,
  markCsrNotificationRead,
  markAllCsrNotificationsRead,
};
