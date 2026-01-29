// CSR Alert Checker - DISABLED
// Alert system removed as part of CSR system cleanup
// Old alert models (CSRAlert, CSRAlertRule) and service (csrAlertService) have been removed

// import cron from 'node-cron';
// import { checkAndTriggerAlerts } from '../services/csrAlertService.js';

// let ioInstance = null;
// let isRunning = false;

/**
 * Schedule CSR alert checking
 * DISABLED - Alert system removed
 */
export const scheduleCSRAlertChecker = (io) => {
  // Alert system disabled - no-op
  return;
  
  // OLD CODE (commented out):
  // ioInstance = io;
  // cron.schedule('*/15 * * * *', async () => {
  //   if (isRunning) return;
  //   try {
  //     isRunning = true;
  //     await checkAndTriggerAlerts(ioInstance);
  //   } catch (error) {
  //     console.error('❌ Error in CSR alert checker:', error);
  //   } finally {
  //     isRunning = false;
  //   }
  // });
};

export default scheduleCSRAlertChecker;

