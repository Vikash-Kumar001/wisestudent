import mongoose from "mongoose";

const geographySchema = new mongoose.Schema(
  {
    states: [{ type: String, trim: true }],
    districts: [{ type: String, trim: true }],
  },
  { _id: false }
);

const scopeSchema = new mongoose.Schema(
  {
    geography: {
      type: geographySchema,
      default: () => ({}),
    },
    schoolCategory: [
      {
        type: String,
        enum: ["government", "aided", "low_income_private"],
      },
    ],
    targetStudentCount: { type: Number, default: 0 },
    targetSchoolCount: { type: Number, default: 0 },
    gradeLevels: [{ type: String, trim: true }],
  },
  { _id: false }
);

const durationSchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { _id: false }
);

const metricsSchema = new mongoose.Schema(
  {
    studentsOnboarded: { type: Number, default: 0 },
    schoolsImplemented: { type: Number, default: 0 },
    activeStudents: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
  },
  { _id: false }
);

const programSchema = new mongoose.Schema(
  {
    programId: {
      type: String,
      unique: true,
      default: () => `PRG-${Date.now()}`,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    csrPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CSRSponsor",
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    scope: {
      type: scopeSchema,
      default: () => ({}),
    },
    duration: {
      type: durationSchema,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "approved",
        "implementation_in_progress",
        "mid_program_review_completed",
        "completed",
      ],
      default: "draft",
    },
    metrics: {
      type: metricsSchema,
      default: () => ({}),
    },
    // Report publish tracking: when admin publishes a report, CSR sees "Published on ..."
    publishedReports: [
      {
        reportType: { type: String, enum: ["impact_summary", "school_coverage", "compliance"] },
        publishedAt: { type: Date, default: Date.now },
        publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

// Compound indexes for common queries
programSchema.index({ csrPartnerId: 1, status: 1 });
programSchema.index({ status: 1 });
programSchema.index({ "duration.startDate": 1, "duration.endDate": 1 });
programSchema.index({ createdBy: 1 });

// Virtual for checking if program is active
programSchema.virtual("isActive").get(function () {
  const now = new Date();
  return (
    this.duration.startDate <= now &&
    this.duration.endDate >= now &&
    ["approved", "implementation_in_progress", "mid_program_review_completed"].includes(this.status)
  );
});

// Virtual for checking if program is completed
programSchema.virtual("isCompleted").get(function () {
  return this.status === "completed";
});

// Virtual for program progress percentage
programSchema.virtual("progressPercentage").get(function () {
  if (!this.duration.startDate || !this.duration.endDate) return 0;
  
  const now = new Date();
  const start = new Date(this.duration.startDate);
  const end = new Date(this.duration.endDate);
  
  if (now < start) return 0;
  if (now > end) return 100;
  
  const total = end - start;
  const elapsed = now - start;
  
  return Math.round((elapsed / total) * 100);
});

// Ensure virtuals are included in JSON output
programSchema.set("toJSON", { virtuals: true });
programSchema.set("toObject", { virtuals: true });

export default mongoose.model("Program", programSchema);
