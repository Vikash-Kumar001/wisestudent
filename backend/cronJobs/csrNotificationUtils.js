import CSRNotification from '../models/CSRNotification.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import CSRSponsor from '../models/CSRSponsor.js';
import { sendEmailNotification } from '../services/notificationService.js';

const DEFAULT_CHANNELS = ['in_app'];

const normalizeRecipients = (sponsor) => {
  const explicit = sponsor?.notificationPreferences?.recipients || [];
  const fallback = [{ userId: sponsor?.userId, email: sponsor?.email }];
  const combined = [...explicit, ...fallback].filter(
    (recipient) => recipient && (recipient.email || recipient.userId)
  );

  const seen = new Set();
  return combined.filter((recipient) => {
    const key = `${recipient.userId || ''}-${recipient.email || ''}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const getNotificationChannels = (sponsor) => {
  if (sponsor?.notificationPreferences?.channels?.length) {
    return sponsor.notificationPreferences.channels;
  }
  return DEFAULT_CHANNELS;
};

const sendEmails = async (recipients, title, message, link) => {
  const payload = `${message}\n\n${link ? `View details: ${link}` : ''}`.trim();
  for (const recipient of recipients || []) {
    if (!recipient?.email) {
      continue;
    }
    try {
      await sendEmailNotification(recipient.email, title, payload);
    } catch (error) {
      console.error('ƒ?O CSR notification email failed:', error);
    }
  }
};

export const dispatchCsrNotification = async (sponsor, payload) => {
  if (!sponsor || !payload) {
    return;
  }

  const recipients = normalizeRecipients(sponsor);
  const channels = getNotificationChannels(sponsor);
  const notification = new CSRNotification({
    sponsorId: sponsor._id,
    recipients,
    channels,
    status: 'pending',
    ...payload,
  });

  await notification.save();

  try {
    const { emitCsrNotificationToRecipients } = await import('../utils/csrNotificationSocket.js');
    emitCsrNotificationToRecipients(notification);
  } catch (err) {
    console.error('CSR notification socket emit failed:', err);
  }

  if (channels.includes('email')) {
    await sendEmails(recipients, payload.title, payload.message, payload.link);
  }
};

/**
 * Notify all admin users about a new CSR registration
 */
export const notifyAdminNewCSR = async (csrPartner) => {
  try {
    // Get all admin users
    const adminUsers = await User.find({ role: 'admin' }).select('_id email name');
    
    if (!adminUsers || adminUsers.length === 0) {
      console.warn('No admin users found to notify about new CSR registration');
      return;
    }

    const title = 'New CSR Registration';
    const message = `${csrPartner.companyName} has registered and is pending approval`;
    const link = `/admin/csr/partners?tab=pending`;

    // Create notification for each admin user
    for (const admin of adminUsers) {
      try {
        // Use Notification model for admin notifications
        const notification = new Notification({
          userId: admin._id,
          type: 'csr_registered',
          category: 'registration',
          title,
          message,
          link,
          read: false,
        });

        await notification.save();

        // Send email notification
        if (admin.email) {
          await sendEmailNotification(
            admin.email,
            title,
            `${message}\n\nView details: ${link}`
          );
        }
      } catch (error) {
        console.error(`Failed to notify admin ${admin.email}:`, error);
      }
    }

    try {
      const { emitAdminCsrNewRegistration } = await import('../utils/csrNotificationSocket.js');
      await emitAdminCsrNewRegistration(csrPartner);
    } catch (err) {
      console.error('Admin CSR new registration socket emit failed:', err);
    }
  } catch (error) {
    console.error('Error notifying admins about new CSR:', error);
  }
};

/**
 * Notify CSR partner that their account has been approved
 */
export const notifyCSRApproved = async (csrPartner) => {
  try {
    if (!csrPartner) {
      return;
    }

    const title = 'Account Approved';
    const message = 'Your CSR Partner account has been approved';
    const link = '/csr/overview';

    await dispatchCsrNotification(csrPartner, {
      type: 'csr_approved',
      category: 'registration',
      title,
      message,
      link,
      severity: 'low',
    });

    // Send email notification
    if (csrPartner.email) {
      await sendEmailNotification(
        csrPartner.email,
        title,
        `${message}\n\nYou can now access your CSR dashboard: ${link}`
      );
    }
  } catch (error) {
    console.error('Error notifying CSR about approval:', error);
  }
};

/**
 * Notify CSR partner that their registration was rejected
 */
export const notifyCSRRejected = async (csrPartner, reason) => {
  try {
    if (!csrPartner) {
      return;
    }

    const title = 'Registration Not Approved';
    const message = `Your registration was not approved. Reason: ${reason || 'No reason provided'}`;
    const link = '/csr/rejected';

    await dispatchCsrNotification(csrPartner, {
      type: 'csr_rejected',
      category: 'registration',
      title,
      message,
      link,
      severity: 'high',
      metadata: { rejectionReason: reason },
    });

    // Send email notification
    if (csrPartner.email) {
      await sendEmailNotification(
        csrPartner.email,
        title,
        `${message}\n\nIf you have questions, please contact support.`
      );
    }
  } catch (error) {
    console.error('Error notifying CSR about rejection:', error);
  }
};

/**
 * Notify CSR partner that a new program has been created for them
 */
export const notifyCSRProgramCreated = async (program, csrPartner) => {
  try {
    if (!program || !csrPartner) {
      return;
    }

    const title = 'New Program Created';
    const message = `A new program "${program.name}" has been created for your organization`;
    const link = `/csr/overview?programId=${program._id}`;

    await dispatchCsrNotification(csrPartner, {
      type: 'program_created',
      category: 'program',
      title,
      message,
      link,
      severity: 'medium',
      metadata: { programId: program._id, programName: program.name },
    });
  } catch (error) {
    console.error('Error notifying CSR about program creation:', error);
  }
};

/**
 * Notify CSR partner that a checkpoint is ready for their acknowledgment
 */
export const notifyCSRCheckpointReady = async (program, checkpoint, csrPartner) => {
  try {
    if (!program || !checkpoint || !csrPartner) {
      return;
    }

    const checkpointNames = {
      1: 'Program Approval',
      2: 'Onboarding Confirmation',
      3: 'Mid-Program Review',
      4: 'Completion Review',
      5: 'Extension/Renewal',
    };

    const checkpointName = checkpointNames[checkpoint.checkpointNumber] || checkpoint.type;
    const title = 'Checkpoint Ready for Review';
    const message = `Checkpoint ${checkpoint.checkpointNumber}: ${checkpointName} is ready for your acknowledgment`;
    const link = `/csr/overview?programId=${program._id}&checkpoint=${checkpoint.checkpointNumber}`;

    await dispatchCsrNotification(csrPartner, {
      type: 'checkpoint_triggered',
      category: 'checkpoint',
      title,
      message,
      link,
      severity: 'medium',
      metadata: {
        programId: program._id,
        programName: program.name,
        checkpointNumber: checkpoint.checkpointNumber,
        checkpointType: checkpoint.type,
      },
    });
  } catch (error) {
    console.error('Error notifying CSR about checkpoint:', error);
  }
};

/**
 * Notify admin users that a CSR partner has acknowledged a checkpoint
 */
export const notifyAdminCheckpointAcknowledged = async (program, checkpoint, csrPartner) => {
  try {
    if (!program || !checkpoint || !csrPartner) {
      return;
    }

    // Get all admin users
    const adminUsers = await User.find({ role: 'admin' }).select('_id email name');
    
    if (!adminUsers || adminUsers.length === 0) {
      console.warn('No admin users found to notify about checkpoint acknowledgment');
      return;
    }

    const checkpointNames = {
      1: 'Program Approval',
      2: 'Onboarding Confirmation',
      3: 'Mid-Program Review',
      4: 'Completion Review',
      5: 'Extension/Renewal',
    };

    const checkpointName = checkpointNames[checkpoint.checkpointNumber] || checkpoint.type;
    const title = 'Checkpoint Acknowledged';
    const message = `${csrPartner.companyName} acknowledged checkpoint ${checkpoint.checkpointNumber}: ${checkpointName}`;
    const link = `/admin/programs/${program._id}/checkpoints`;

    // Create notification for each admin user
    for (const admin of adminUsers) {
      try {
        const notification = new Notification({
          userId: admin._id,
          type: 'checkpoint_acknowledged',
          category: 'checkpoint',
          title,
          message,
          link,
          read: false,
          metadata: {
            programId: program._id,
            programName: program.name,
            csrPartnerId: csrPartner._id,
            csrPartnerName: csrPartner.companyName,
            checkpointNumber: checkpoint.checkpointNumber,
          },
        });

        await notification.save();
      } catch (error) {
        console.error(`Failed to notify admin ${admin.email}:`, error);
      }
    }

    try {
      const { emitAdminCsrCheckpointAcknowledged } = await import('../utils/csrNotificationSocket.js');
      await emitAdminCsrCheckpointAcknowledged({
        programId: program._id,
        programName: program.name,
        csrPartnerName: csrPartner.companyName,
        checkpointNumber: checkpoint.checkpointNumber,
        link: `/admin/programs/${program._id}/checkpoints`,
      });
    } catch (err) {
      console.error('Admin CSR checkpoint acknowledged socket emit failed:', err);
    }
  } catch (error) {
    console.error('Error notifying admins about checkpoint acknowledgment:', error);
  }
};

/**
 * Notify CSR partner that schools have been assigned to their program
 */
export const notifyCSRSchoolsAssigned = async (program, csrPartner, schoolCount) => {
  try {
    if (!program || !csrPartner) {
      return;
    }

    const title = 'Schools Assigned to Program';
    const message = `${schoolCount || 0} school(s) have been assigned to program "${program.name}"`;
    const link = `/csr/schools?programId=${program._id}`;

    await dispatchCsrNotification(csrPartner, {
      type: 'schools_assigned',
      category: 'program',
      title,
      message,
      link,
      severity: 'low',
      metadata: {
        programId: program._id,
        programName: program.name,
        schoolCount: schoolCount || 0,
      },
    });
  } catch (error) {
    console.error('Error notifying CSR about school assignment:', error);
  }
};

/**
 * Notify CSR partner that metrics have been updated
 */
export const notifyCSRMetricsUpdated = async (program, csrPartner) => {
  try {
    if (!program || !csrPartner) {
      return;
    }

    const title = 'Program Metrics Updated';
    const message = `Metrics for program "${program.name}" have been refreshed`;
    const link = `/csr/overview?programId=${program._id}`;

    await dispatchCsrNotification(csrPartner, {
      type: 'metrics_updated',
      category: 'program',
      title,
      message,
      link,
      severity: 'low',
      metadata: {
        programId: program._id,
        programName: program.name,
      },
    });
  } catch (error) {
    console.error('Error notifying CSR about metrics update:', error);
  }
};

/**
 * Notify CSR partner that a report has been generated
 */
export const notifyCSRReportGenerated = async (program, csrPartner, reportType) => {
  try {
    if (!program || !csrPartner) {
      return;
    }

    const reportTypeNames = {
      impact_summary: 'Impact Summary',
      school_coverage: 'School Coverage Report',
      compliance: 'Compliance Summary',
    };

    const reportName = reportTypeNames[reportType] || reportType;
    const title = 'Report Generated';
    const message = `Your ${reportName} for program "${program.name}" is ready for download`;
    const link = `/csr/reports?programId=${program._id}`;

    await dispatchCsrNotification(csrPartner, {
      type: 'report_generated',
      category: 'report',
      title,
      message,
      link,
      severity: 'low',
      metadata: {
        programId: program._id,
        programName: program.name,
        reportType,
      },
    });
  } catch (error) {
    console.error('Error notifying CSR about report generation:', error);
  }
};

