import express from "express";
import { requireAuth, requireCSR } from "../middlewares/requireAuth.js";
import {
  getMyPrograms,
  getProgramOverview,
  getStudentReach,
  getEngagement,
  getReadinessExposure,
  getSchoolCoverage,
  getRecognition,
  getCheckpoints,
  acknowledgeCheckpoint,
  getProfile,
} from "../controllers/csrProgramController.js";
import {
  listReports,
  downloadImpactSummary,
  downloadSchoolCoverage,
  downloadComplianceSummary,
} from "../controllers/csrReportDownloadController.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth);
router.use(requireCSR);

// ============================================
// Program Listing
// ============================================

// Get all programs for authenticated CSR user
router.get("/programs", getMyPrograms);

// ============================================
// Program Details (all read-only)
// ============================================

// Get program overview (main dashboard)
router.get("/programs/:programId/overview", getProgramOverview);

// Get student reach metrics
router.get("/programs/:programId/student-reach", getStudentReach);

// Get engagement metrics
router.get("/programs/:programId/engagement", getEngagement);

// Get readiness exposure (10 pillars)
router.get("/programs/:programId/readiness-exposure", getReadinessExposure);

// Get school coverage table
router.get("/programs/:programId/school-coverage", getSchoolCoverage);

// Get recognition metrics
router.get("/programs/:programId/recognition", getRecognition);

// ============================================
// Checkpoints
// ============================================

// Get all checkpoints for program
router.get("/programs/:programId/checkpoints", getCheckpoints);

// Acknowledge a checkpoint (CSR action)
router.post("/programs/:programId/checkpoints/:checkpointNumber/acknowledge", acknowledgeCheckpoint);

// ============================================
// Reports (download only)
// ============================================

// List available reports
router.get("/programs/:programId/reports", listReports);

// Download Impact Summary (PDF)
router.get("/programs/:programId/reports/impact-summary", downloadImpactSummary);

// Download School Coverage (Excel/PDF)
router.get("/programs/:programId/reports/school-coverage", downloadSchoolCoverage);

// Download Compliance Summary (PDF)
router.get("/programs/:programId/reports/compliance", downloadComplianceSummary);

// ============================================
// Profile
// ============================================

// Get CSR profile
router.get("/profile", getProfile);

export default router;
