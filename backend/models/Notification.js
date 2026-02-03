import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "info", 
        "success", 
        "warning", 
        "alert",
        "child_created",
        "child_linked",
        "student_linked",
        "parent_linked",
        "account_created",
        "message",
        "achievement",
        "redemption",
        "level_up",
        "report",
        "general",
        "csr_registered",
        "checkpoint_acknowledged",
        "incident_alert",
        "privacy_incident",
      ],
      default: "info",
    },
    category: {
      type: String,
      enum: ["registration", "program", "checkpoint", "report", "general"],
    },
    title: { type: String },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
    read: { type: Boolean, default: false }, // Alias for isRead
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Auto-delete notifications after 15 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1296000 }); // 15 days (15 * 24 * 60 * 60)

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
