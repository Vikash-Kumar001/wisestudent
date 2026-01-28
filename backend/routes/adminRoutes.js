import express from 'express';
import {
  getSchoolsByRegion,
  getStudentActiveRate,
  getPillarPerformance,
  getPlatformHealth,
  getPrivacyCompliance,
  getAdminDashboard,
  getNetworkMap,
  getBenchmarksPanel,
  getPlatformTelemetry,
  getAdminAccounts,
  getAdminAccountDetails,
  updateAdminAccountPlan,
  deleteAdminAccount,
  getDataExportSandbox,
  getPolicyLegal,
  getSchoolOnboardingConsole,
  createTenant,
  approveModule,
  getResearchSandbox,
  createResearchAgreement,
  getComplianceDashboard,
  processDeletionRequest
} from '../controllers/adminController.js';
import {
  getGoodieOrders,
  updateGoodieOrderStatus,
  createGoodie,
  listAllGoodies,
  deleteGoodie
} from '../controllers/goodieController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { checkAdmin } from '../middlewares/checkRole.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(checkAdmin);

// Dashboard summary endpoint
router.get('/dashboard', getAdminDashboard);

// Individual metric endpoints
router.get('/schools-by-region', getSchoolsByRegion);
router.get('/student-active-rate', getStudentActiveRate);
router.get('/pillar-performance', getPillarPerformance);
router.get('/platform-health', getPlatformHealth);
router.get('/privacy-compliance', getPrivacyCompliance);

// New feature endpoints
router.get('/network-map', getNetworkMap);
router.get('/benchmarks-panel', getBenchmarksPanel);
router.get('/platform-telemetry', getPlatformTelemetry);
router.get('/accounts', getAdminAccounts);
router.get('/accounts/:userId', getAdminAccountDetails);
router.patch('/accounts/:userId/plan', updateAdminAccountPlan);
router.delete('/accounts/:userId', deleteAdminAccount);
router.get('/data-export', getDataExportSandbox);
router.get('/policy-legal', getPolicyLegal);

// Advanced feature endpoints
router.get('/school-onboarding', getSchoolOnboardingConsole);
router.post('/create-tenant', createTenant);
router.post('/approve-module', approveModule);
router.get('/research-sandbox', getResearchSandbox);
router.post('/create-research-agreement', createResearchAgreement);
router.get('/compliance-dashboard', getComplianceDashboard);
router.post('/process-deletion', processDeletionRequest);

router.get('/goodie-orders', getGoodieOrders);
router.patch('/goodie-orders/:orderId', updateGoodieOrderStatus);
router.get('/goodies', listAllGoodies);
router.post('/goodies', createGoodie);
router.delete('/goodies/:goodieId', deleteGoodie);

export default router;

