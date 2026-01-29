import express from "express";
import { requireAuth, requireCSR } from "../middlewares/requireAuth.js";
import {
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
} from "../controllers/csrSponsorController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireCSR);

router.post("/register", registerSponsor);
router.get("/profile", getSponsorProfile);
router.put("/profile", updateSponsorProfile);
router.get("/dashboard", getSponsorDashboard);

// Notification preferences
router.get("/preferences", getPreferences);
router.put("/preferences", updatePreferences);

// Settings (doc alignment: GET/PUT /api/csr/settings)
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

// Change password (doc alignment: PUT /api/csr/change-password)
router.put("/change-password", changePassword);

// Registration status (doc alignment: GET /api/csr/registration-status)
router.get("/registration-status", getRegistrationStatus);

// Notifications (doc alignment: GET /api/csr/notifications, PUT /api/csr/notifications/:id/read)
router.get("/notifications", getCsrNotifications);
router.put("/notifications/read-all", markAllCsrNotificationsRead);
router.put("/notifications/:id/read", markCsrNotificationRead);

export default router;
