import { getIoInstance } from "./socketServer.js";
import User from "../models/User.js";

/**
 * Emit real-time CSR notification to recipient user rooms (Phase 8: Socket.IO).
 * Call after creating a CSRNotification (admin send or system event).
 * @param {Object} notification - CSRNotification document or lean object with _id, type, title, message, link, createdAt, recipients
 */
export const emitCsrNotificationToRecipients = (notification) => {
  try {
    const io = getIoInstance();
    if (!io) return;

    const recipients = notification.recipients || [];
    const payload = {
      _id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      createdAt: notification.createdAt,
      read: false,
    };

    for (const r of recipients) {
      const userId = r.userId?.toString?.() || r.userId;
      if (userId) {
        io.to(userId).emit("csr:notification:new", payload);
      }
    }
  } catch (err) {
    console.error("CSR notification socket emit error:", err.message);
  }
};

/**
 * Emit to all admin users: new CSR registration (Phase 8: Socket.IO).
 * @param {Object} csrPartner - CSRSponsor document or lean object (companyName, _id, etc.)
 */
export const emitAdminCsrNewRegistration = async (csrPartner) => {
  try {
    const io = getIoInstance();
    if (!io) return;

    const adminUsers = await User.find({ role: "admin" }).select("_id").lean();
    const payload = {
      type: "new_registration",
      companyName: csrPartner?.companyName,
      partnerId: csrPartner?._id?.toString?.(),
      message: `${csrPartner?.companyName || "A CSR"} has registered and is pending approval`,
      link: "/admin/csr/partners?tab=pending",
    };

    for (const admin of adminUsers || []) {
      const id = admin._id?.toString?.();
      if (id) io.to(id).emit("admin:csr:new_registration", payload);
    }
  } catch (err) {
    console.error("Admin CSR new registration socket emit error:", err.message);
  }
};

/**
 * Emit to all admin users: CSR acknowledged a checkpoint (Phase 8: Socket.IO).
 * @param {Object} payload - { programId, programName, csrPartnerName, checkpointNumber, link }
 */
export const emitAdminCsrCheckpointAcknowledged = async (payload) => {
  try {
    const io = getIoInstance();
    if (!io) return;

    const adminUsers = await User.find({ role: "admin" }).select("_id").lean();
    const data = {
      type: "checkpoint_acknowledged",
      ...payload,
    };

    for (const admin of adminUsers || []) {
      const id = admin._id?.toString?.();
      if (id) io.to(id).emit("admin:csr:checkpoint_acknowledged", data);
    }
  } catch (err) {
    console.error("Admin CSR checkpoint acknowledged socket emit error:", err.message);
  }
};
