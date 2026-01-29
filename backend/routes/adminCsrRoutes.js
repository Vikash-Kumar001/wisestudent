import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import {
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
} from "../controllers/adminCsrController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

// ============================================
// CSR Partner Management
// ============================================

// List all CSR partners with filters
router.get("/", listAllPartners);

// Get pending sponsor registrations (for approval queue)
router.get("/pending", getPendingSponsors);

// List CSR notifications (View sent notifications)
router.get("/notifications", listNotifications);
// Send notification to one or more CSR partners
router.post("/notifications/send", sendNotification);

// Get specific CSR partner details
router.get("/:id", getPartnerDetails);

// Update CSR partner details (company name, contact, email, phone)
router.put("/:id", updatePartner);

// Approve a CSR registration
router.post("/:id/verify", verifySponsor);
router.post("/:id/approve", verifySponsor); // Alias

// Reject a CSR registration
router.post("/:id/reject", rejectSponsor);

// Deactivate a CSR partner
router.put("/:id/deactivate", deactivatePartner);

// Reactivate a CSR partner
router.put("/:id/reactivate", reactivatePartner);

export default router;
