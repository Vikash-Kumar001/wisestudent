import Notification from '../models/Notification.js';

/**
 * Create a notification
 */
export const createNotification = async (notificationData) => {
  try {
    // Check if Notification model exists, otherwise return mock
    if (typeof Notification !== 'undefined' && Notification) {
      return await Notification.create(notificationData);
    } else {
      return { success: true, data: notificationData };
    }
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send email notification
 */
export const sendEmailNotification = async (to, subject, body) => {
  try {
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    if (process.env.DEBUG_EMAIL === '1') {
      console.log('📧 Email sent to:', to, 'Subject:', subject);
    }
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send SMS notification
 */
export const sendSMSNotification = async (phoneNumber, message) => {
  try {
    // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
    if (process.env.DEBUG_EMAIL === '1') {
      console.log('📱 SMS sent to:', phoneNumber);
    }
    return { success: true };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send Slack/PagerDuty alert
 */
export const sendAlert = async (alertData) => {
  try {
    // In production, integrate with alerting service (PagerDuty, Slack, etc.)
    if (process.env.DEBUG_EMAIL === '1') {
      console.log('🚨 Alert sent:', alertData);
    }
    return { success: true };
  } catch (error) {
    console.error('Error sending alert:', error);
    return { success: false, error: error.message };
  }
};

