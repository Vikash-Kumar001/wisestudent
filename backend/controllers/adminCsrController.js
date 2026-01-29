import adminCsrService from "../services/adminCsrService.js";

/**
 * List all CSR partners with filters and pagination
 */
export const listAllPartners = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      search: req.query.search,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };

    const result = await adminCsrService.listAllPartners(filters);
    res.json({
      message: "CSR partners loaded",
      data: result.partners,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
        limit: result.limit,
      },
    });
  } catch (error) {
    console.error("Admin list partners error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to load CSR partners",
    });
  }
};

/**
 * Get detailed info for a specific CSR partner
 */
export const getPartnerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await adminCsrService.getPartnerDetails(id);
    res.json({
      message: "CSR partner details loaded",
      data: result,
    });
  } catch (error) {
    console.error("Admin get partner details error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to load partner details",
    });
  }
};

/**
 * List pending sponsor registrations
 */
export const getPendingSponsors = async (req, res) => {
  try {
    const sponsors = await adminCsrService.listPendingSponsors();
    res.json({ message: "Pending sponsors loaded", data: sponsors });
  } catch (error) {
    console.error("Admin pending sponsors error:", error);
    res.status(500).json({ message: "Failed to load pending sponsors", error: error.message });
  }
};

/**
 * Approve/verify a CSR sponsor registration
 */
export const verifySponsor = async (req, res) => {
  try {
    const sponsor = await adminCsrService.verifySponsor(req.params.id, req.user._id);
    res.json({ message: "Sponsor approved successfully", data: sponsor });
  } catch (error) {
    console.error("Admin verify sponsor error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to approve sponsor",
    });
  }
};

/**
 * Reject a CSR sponsor registration
 */
export const rejectSponsor = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }
    const sponsor = await adminCsrService.rejectSponsor(req.params.id, req.user._id, reason);
    res.json({ message: "Sponsor rejected", data: sponsor });
  } catch (error) {
    console.error("Admin reject sponsor error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to reject sponsor",
    });
  }
};

/**
 * Deactivate a CSR partner
 */
export const deactivatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await adminCsrService.deactivatePartner(id, req.user._id);
    res.json({ message: "Partner deactivated successfully", data: partner });
  } catch (error) {
    console.error("Admin deactivate partner error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to deactivate partner",
    });
  }
};

/**
 * Reactivate a CSR partner
 */
export const reactivatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await adminCsrService.reactivatePartner(id, req.user._id);
    res.json({ message: "Partner reactivated successfully", data: partner });
  } catch (error) {
    console.error("Admin reactivate partner error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to reactivate partner",
    });
  }
};

/**
 * Update CSR partner details (company name, contact, email, phone)
 */
export const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = await adminCsrService.updatePartner(id, updates);
    res.json({ message: "Partner updated successfully", data: result });
  } catch (error) {
    console.error("Admin update partner error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to update partner",
    });
  }
};

/**
 * List CSR notifications (View sent notifications)
 */
export const listNotifications = async (req, res) => {
  try {
    const filters = {
      sponsorId: req.query.sponsorId,
      type: req.query.type,
      status: req.query.status,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
      fromDate: req.query.fromDate,
      toDate: req.query.toDate,
    };
    const result = await adminCsrService.listNotifications(filters);
    res.json({
      message: "Notifications loaded",
      data: result.notifications,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
        limit: result.limit,
      },
    });
  } catch (error) {
    console.error("Admin list CSR notifications error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to load notifications",
    });
  }
};

/**
 * Send notification to one or more CSR partners
 */
export const sendNotification = async (req, res) => {
  try {
    const { sponsorIds, sponsorId, title, message, type, link, sendEmail } = req.body;
    const result = await adminCsrService.sendNotification({
      sponsorIds,
      sponsorId,
      title,
      message,
      type,
      link,
      sendEmail,
    });
    res.json({
      message: `Notification sent to ${result.sent} partner(s)`,
      data: result,
    });
  } catch (error) {
    console.error("Admin send CSR notification error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to send notification",
    });
  }
};

export default {
  listAllPartners,
  getPartnerDetails,
  getPendingSponsors,
  verifySponsor,
  rejectSponsor,
  deactivatePartner,
  reactivatePartner,
  updatePartner,
  listNotifications,
  sendNotification,
};
