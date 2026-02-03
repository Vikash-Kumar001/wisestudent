import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    incidentType: {
      type: String,
      enum: ['sla_breach', 'privacy_incident', 'security_breach', 'data_breach', 'performance_issue', 'other'],
      required: true
    },
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      required: true
    },
    status: {
      type: String,
      enum: ['open', 'investigating', 'resolved', 'closed'],
      default: 'open'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    ticketNumber: {
      type: String,
      unique: true
      // Auto-generated in pre-save hook when not provided
    },
    // SLA-specific fields
    slaMetrics: {
      latency: Number,
      errorRate: Number,
      thresholdLatency: Number,
      thresholdErrorRate: Number,
      breachDuration: Number, // in seconds
      apiEndpoint: String
    },
    // Privacy incident-specific fields
    privacyDetails: {
      affectedUsers: Number,
      dataTypes: [String],
      potentialExposure: String,
      affectedRegion: String,
      regulatoryImpact: [String], // GDPR, CCPA, etc.
      containmentStatus: {
        type: String,
        enum: ['not_contained', 'partially_contained', 'fully_contained']
      }
    },
    // Notification tracking
    notifications: [{
      sentTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      sentAt: Date,
      notificationType: String,
      delivered: Boolean,
      readAt: Date
    }],
    // Assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    // Resolution
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolutionNotes: String,
    // Audit trail
    auditTrail: [{
      action: String,
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      performedAt: {
        type: Date,
        default: Date.now
      },
      metadata: mongoose.Schema.Types.Mixed
    }]
  },
  {
    timestamps: true
  }
);

// Generate ticket number
incidentSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    const year = new Date().getFullYear();
    const prefix = this.incidentType.toUpperCase().substring(0, 3);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.ticketNumber = `${prefix}-${year}-${random}`;
  }
  next();
});

// Indexes (ticketNumber already has unique index via unique: true)
incidentSchema.index({ status: 1, severity: 1 });
incidentSchema.index({ incidentType: 1 });
incidentSchema.index({ createdAt: -1 });
incidentSchema.index({ assignedTo: 1 });

const Incident = mongoose.model('Incident', incidentSchema);
export default Incident;

