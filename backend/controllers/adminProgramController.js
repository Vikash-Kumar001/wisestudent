import programService from "../services/programService.js";
import programSchoolService from "../services/programSchoolService.js";
import checkpointService from "../services/checkpointService.js";
import Program from "../models/Program.js";
import ProgramMetrics from "../models/ProgramMetrics.js";
import ProgramSchool from "../models/ProgramSchool.js";
import reportGenerationService from "../services/reportGenerationService.js";

/**
 * Create a new program
 */
export const createProgram = async (req, res) => {
  try {
    const program = await programService.createProgram(req.user._id, req.body);
    res.status(201).json({
      message: "Program created successfully",
      data: program,
    });
  } catch (error) {
    console.error("Create program error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to create program",
    });
  }
};

/**
 * Update an existing program
 */
export const updateProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await programService.updateProgram(programId, req.body);
    res.json({
      message: "Program updated successfully",
      data: program,
    });
  } catch (error) {
    console.error("Update program error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to update program",
    });
  }
};

/**
 * Get a single program by ID
 */
export const getProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await programService.getProgram(programId);
    res.json({ data: program });
  } catch (error) {
    console.error("Get program error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get program",
    });
  }
};

/**
 * List all programs with filters
 */
export const listPrograms = async (req, res) => {
  try {
    const filters = {
      csrPartnerId: req.query.csrPartnerId,
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      search: req.query.search,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };

    const result = await programService.listPrograms(filters);
    res.json({
      data: result.programs,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
        limit: result.limit,
      },
    });
  } catch (error) {
    console.error("List programs error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to list programs",
    });
  }
};

/**
 * Archive a program
 */
export const archiveProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await programService.archiveProgram(programId);
    res.json({
      message: "Program archived successfully",
      data: program,
    });
  } catch (error) {
    console.error("Archive program error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to archive program",
    });
  }
};

/**
 * Get available schools for assignment
 */
export const getAvailableSchools = async (req, res) => {
  try {
    const { programId } = req.params;
    const schools = await programSchoolService.getAvailableSchools(programId);
    res.json({ data: schools });
  } catch (error) {
    console.error("Get available schools error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get available schools",
    });
  }
};

/**
 * Get assigned schools for a program
 */
export const getAssignedSchools = async (req, res) => {
  try {
    const { programId } = req.params;
    const filters = {
      status: req.query.status,
      district: req.query.district,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    };

    const result = await programSchoolService.getAssignedSchools(programId, filters);
    res.json({
      data: result.schools,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
      },
    });
  } catch (error) {
    console.error("Get assigned schools error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get assigned schools",
    });
  }
};

/**
 * Assign schools to a program
 */
export const assignSchools = async (req, res) => {
  try {
    const { programId } = req.params;
    const { schoolIds } = req.body;

    if (!schoolIds || !Array.isArray(schoolIds) || schoolIds.length === 0) {
      return res.status(400).json({ message: "schoolIds array is required" });
    }

    const result = await programSchoolService.assignSchools(programId, schoolIds, req.user._id);
    res.status(201).json({
      message: "Schools assigned successfully",
      data: result,
    });
  } catch (error) {
    console.error("Assign schools error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to assign schools",
    });
  }
};

/**
 * Bulk assign schools by filters
 */
export const assignSchoolsBulk = async (req, res) => {
  try {
    const { programId } = req.params;
    const { district, state, category } = req.body;

    const result = await programSchoolService.assignSchoolsBulk(
      programId,
      { district, state, category },
      req.user._id
    );
    res.status(201).json({
      message: "Schools assigned in bulk successfully",
      data: result,
    });
  } catch (error) {
    console.error("Bulk assign schools error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to bulk assign schools",
    });
  }
};

/**
 * Remove a school from program
 */
export const removeSchool = async (req, res) => {
  try {
    const { programId, schoolId } = req.params;
    const result = await programSchoolService.removeSchool(programId, schoolId);
    res.json({
      message: "School removed from program",
      data: result,
    });
  } catch (error) {
    console.error("Remove school error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to remove school",
    });
  }
};

/**
 * Update school implementation status
 */
export const updateSchoolStatus = async (req, res) => {
  try {
    const { programSchoolId } = req.params;
    const { status, metrics } = req.body;

    const result = await programSchoolService.updateSchoolStatus(programSchoolId, status, metrics);
    res.json({
      message: "School status updated",
      data: result,
    });
  } catch (error) {
    console.error("Update school status error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to update school status",
    });
  }
};

/**
 * Get schools summary for a program
 */
export const getSchoolsSummary = async (req, res) => {
  try {
    const { programId } = req.params;
    const summary = await programSchoolService.getSchoolsSummary(programId);
    res.json({ data: summary });
  } catch (error) {
    console.error("Get schools summary error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get schools summary",
    });
  }
};

/**
 * Get checkpoints for a program
 */
export const getCheckpoints = async (req, res) => {
  try {
    const { programId } = req.params;
    const checkpoints = await checkpointService.getCheckpoints(programId);
    res.json({ data: checkpoints });
  } catch (error) {
    console.error("Get checkpoints error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get checkpoints",
    });
  }
};

/**
 * Trigger a checkpoint for CSR review
 */
export const triggerCheckpoint = async (req, res) => {
  try {
    const { programId, checkpointNumber } = req.params;
    const checkpoint = await checkpointService.triggerCheckpoint(
      programId,
      parseInt(checkpointNumber, 10),
      req.user._id
    );
    res.json({
      message: "Checkpoint triggered successfully",
      data: checkpoint,
    });
  } catch (error) {
    console.error("Trigger checkpoint error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to trigger checkpoint",
    });
  }
};

/**
 * Check if a checkpoint can be triggered
 */
export const canTriggerCheckpoint = async (req, res) => {
  try {
    const { programId, checkpointNumber } = req.params;
    const result = await checkpointService.canTriggerCheckpoint(
      programId,
      parseInt(checkpointNumber, 10)
    );
    res.json({ data: result });
  } catch (error) {
    console.error("Can trigger checkpoint error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to check checkpoint status",
    });
  }
};

/**
 * Get checkpoint status summary
 */
export const getCheckpointStatus = async (req, res) => {
  try {
    const { programId } = req.params;
    const status = await checkpointService.getCheckpointStatus(programId);
    res.json({ data: status });
  } catch (error) {
    console.error("Get checkpoint status error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get checkpoint status",
    });
  }
};

/**
 * Update program status
 */
export const updateProgramStatus = async (req, res) => {
  try {
    const { programId } = req.params;
    const { status } = req.body;
    const program = await programService.updateProgramStatus(programId, status, req.user._id);
    res.json({
      message: "Program status updated",
      data: program,
    });
  } catch (error) {
    console.error("Update program status error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to update program status",
    });
  }
};

/**
 * Get program metrics (admin view)
 */
export const getProgramMetrics = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    const metrics = await ProgramMetrics.findOne({ programId: program._id }).lean();
    const schoolStats = await ProgramSchool.aggregate([
      { $match: { programId: program._id } },
      {
        $group: {
          _id: null,
          totalSchools: { $sum: 1 },
          totalStudents: { $sum: "$studentsCovered" },
        },
      },
    ]);
    const stats = schoolStats[0] || { totalSchools: 0, totalStudents: 0 };
    res.json({
      data: {
        ...(metrics || {}),
        programId: program._id,
        programName: program.name,
        lastComputedAt: metrics?.lastComputedAt || null,
        computedBy: metrics?.computedBy || "system",
        schoolStats: {
          totalSchools: stats.totalSchools,
          totalStudents: stats.totalStudents,
        },
      },
    });
  } catch (error) {
    console.error("Get program metrics error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get program metrics",
    });
  }
};

/**
 * Refresh program metrics (recompute from ProgramSchool and update ProgramMetrics)
 */
export const refreshProgramMetrics = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    const schoolStats = await ProgramSchool.aggregate([
      { $match: { programId: program._id } },
      {
        $group: {
          _id: null,
          totalSchools: { $sum: 1 },
          totalStudents: { $sum: "$studentsCovered" },
        },
      },
    ]);
    const stats = schoolStats[0] || { totalSchools: 0, totalStudents: 0 };
    let metrics = await ProgramMetrics.findOne({ programId: program._id });
    if (!metrics) {
      metrics = new ProgramMetrics({ programId: program._id });
    }
    metrics.studentReach = metrics.studentReach || {};
    metrics.studentReach.totalOnboarded = stats.totalStudents;
    metrics.studentReach.activeStudents = stats.totalStudents;
    metrics.lastComputedAt = new Date();
    metrics.computedBy = "manual";
    await metrics.save();
    program.metrics = program.metrics || {};
    program.metrics.schoolsImplemented = stats.totalSchools;
    program.metrics.studentsOnboarded = stats.totalStudents;
    await program.save();
    const updated = await ProgramMetrics.findOne({ programId: program._id }).lean();
    res.json({
      message: "Metrics refreshed successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Refresh program metrics error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to refresh program metrics",
    });
  }
};

const getPublishedAt = (program, reportType) => {
  const entry = (program.publishedReports || []).find((r) => r.reportType === reportType);
  return entry?.publishedAt || null;
};

/**
 * List available reports for a program (admin)
 */
export const listProgramReports = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    const metrics = await ProgramMetrics.findOne({ programId: program._id });
    const schoolCount = await ProgramSchool.countDocuments({ programId: program._id });
    res.json({
      data: {
        reports: [
          {
            type: "impact_summary",
            name: "Impact Summary",
            description: "2-4 page summary for CSR/ESG reports",
            format: "pdf",
            available: true,
            generatedAt: metrics?.lastComputedAt || new Date(),
            publishedAt: getPublishedAt(program, "impact_summary"),
          },
          {
            type: "school_coverage",
            name: "School Coverage Report",
            description: "Detailed school-level coverage for audits",
            formats: ["excel", "pdf"],
            available: schoolCount > 0,
            generatedAt: new Date(),
            publishedAt: getPublishedAt(program, "school_coverage"),
          },
          {
            type: "compliance",
            name: "Compliance Summary",
            description: "Compliance and governance documentation",
            format: "pdf",
            available: true,
            generatedAt: new Date(),
            publishedAt: getPublishedAt(program, "compliance"),
          },
        ],
        note: "Reports are generated on demand. Use Preview/Download, then Publish to make available to CSR.",
      },
    });
  } catch (error) {
    console.error("List program reports error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to list reports",
    });
  }
};

/**
 * Publish a report (make available to CSR)
 */
export const publishReport = async (req, res) => {
  try {
    const { programId } = req.params;
    const { reportType } = req.body;
    const validTypes = ["impact_summary", "school_coverage", "compliance"];
    if (!reportType || !validTypes.includes(reportType)) {
      return res.status(400).json({ message: "Invalid reportType. Use: impact_summary, school_coverage, compliance" });
    }
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    program.publishedReports = program.publishedReports || [];
    const existing = program.publishedReports.findIndex((r) => r.reportType === reportType);
    const entry = { reportType, publishedAt: new Date(), publishedBy: req.user._id };
    if (existing >= 0) {
      program.publishedReports[existing] = entry;
    } else {
      program.publishedReports.push(entry);
    }
    await program.save();
    res.json({
      message: "Report published. CSR can now see it in their report list.",
      data: { reportType, publishedAt: entry.publishedAt },
    });
  } catch (error) {
    console.error("Publish report error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to publish report",
    });
  }
};

/**
 * Generate reports (pre-warm / mark generated; reports are generated on download)
 */
export const generateProgramReports = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json({
      message: "Reports are generated on download. Use the download links to get reports.",
      data: { programId: program._id, programName: program.name },
    });
  } catch (error) {
    console.error("Generate program reports error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to generate reports",
    });
  }
};

/**
 * Download Impact Summary PDF (admin)
 */
export const downloadImpactSummary = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    const pdfBuffer = await reportGenerationService.generateImpactSummaryPDF(program._id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="impact-summary-${program.programId || program._id}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Download impact summary error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to download impact summary",
    });
  }
};

/**
 * Download School Coverage Report (admin) - Excel or PDF
 */
export const downloadSchoolCoverage = async (req, res) => {
  try {
    const { programId } = req.params;
    const { format = "pdf" } = req.query;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    let buffer, contentType, extension;
    if (format === "excel") {
      buffer = await reportGenerationService.generateSchoolCoverageExcel(program._id);
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      extension = "xlsx";
    } else {
      buffer = await reportGenerationService.generateSchoolCoveragePDF(program._id);
      contentType = "application/pdf";
      extension = "pdf";
    }
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="school-coverage-${program.programId || program._id}.${extension}"`
    );
    res.send(buffer);
  } catch (error) {
    console.error("Download school coverage error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to download school coverage report",
    });
  }
};

/**
 * Download Compliance Summary PDF (admin)
 */
export const downloadComplianceSummary = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    const pdfBuffer = await reportGenerationService.generateCompliancePDF(program._id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="compliance-summary-${program.programId || program._id}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Download compliance summary error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to download compliance summary",
    });
  }
};

/**
 * Update checkpoint notes (admin notes / notes)
 */
export const updateCheckpoint = async (req, res) => {
  try {
    const { programId, checkpointNumber } = req.params;
    const { adminNotes, notes } = req.body;
    const checkpoint = await checkpointService.updateCheckpointNotes(
      programId,
      parseInt(checkpointNumber, 10),
      { adminNotes, notes }
    );
    res.json({
      message: "Checkpoint notes updated",
      data: checkpoint,
    });
  } catch (error) {
    console.error("Update checkpoint error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to update checkpoint notes",
    });
  }
};

export default {
  createProgram,
  updateProgram,
  getProgram,
  listPrograms,
  archiveProgram,
  getAvailableSchools,
  getAssignedSchools,
  assignSchools,
  assignSchoolsBulk,
  removeSchool,
  updateSchoolStatus,
  getSchoolsSummary,
  getCheckpoints,
  triggerCheckpoint,
  canTriggerCheckpoint,
  getCheckpointStatus,
  updateProgramStatus,
  getProgramMetrics,
  refreshProgramMetrics,
  listProgramReports,
  generateProgramReports,
  publishReport,
  downloadImpactSummary,
  downloadSchoolCoverage,
  downloadComplianceSummary,
  updateCheckpoint,
};
