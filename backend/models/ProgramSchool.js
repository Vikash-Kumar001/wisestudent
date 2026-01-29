import mongoose from "mongoose";

const metricsSchema = new mongoose.Schema(
  {
    studentsOnboarded: { type: Number, default: 0 },
    activeStudents: { type: Number, default: 0 },
    completedStudents: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
  },
  { _id: false }
);

const programSchoolSchema = new mongoose.Schema(
  {
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
      index: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    studentsCovered: {
      type: Number,
      default: 0,
    },
    implementationStatus: {
      type: String,
      enum: ["pending", "in_progress", "active", "completed"],
      default: "pending",
    },
    // Date tracking
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    onboardingStartedAt: {
      type: Date,
    },
    onboardingCompletedAt: {
      type: Date,
    },
    programCompletedAt: {
      type: Date,
    },
    // Metrics subdocument
    metrics: {
      type: metricsSchema,
      default: () => ({}),
    },
    // Tracking
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicate program-school assignments
programSchoolSchema.index({ programId: 1, schoolId: 1 }, { unique: true });

// Additional indexes for common queries
programSchoolSchema.index({ implementationStatus: 1 });
programSchoolSchema.index({ programId: 1, implementationStatus: 1 });
programSchoolSchema.index({ schoolId: 1, implementationStatus: 1 });

// Virtual for checking if school is actively participating
programSchoolSchema.virtual("isActive").get(function () {
  return ["in_progress", "active"].includes(this.implementationStatus);
});

// Ensure virtuals are included in JSON output
programSchoolSchema.set("toJSON", { virtuals: true });
programSchoolSchema.set("toObject", { virtuals: true });

export default mongoose.model("ProgramSchool", programSchoolSchema);
