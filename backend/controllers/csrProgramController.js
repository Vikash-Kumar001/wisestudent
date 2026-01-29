import Program from "../models/Program.js";
import ProgramSchool from "../models/ProgramSchool.js";
import ProgramCheckpoint from "../models/ProgramCheckpoint.js";
import ProgramMetrics from "../models/ProgramMetrics.js";
import CSRSponsor from "../models/CSRSponsor.js";
import checkpointService from "../services/checkpointService.js";

/**
 * Get CSR Partner ID from user
 * @param {Object} user - Authenticated user
 * @returns {Object} CSR Sponsor document
 */
const getCSRSponsor = async (user) => {
  const sponsor = await CSRSponsor.findOne({ userId: user._id });
  if (!sponsor) {
    const error = new Error("CSR Partner profile not found");
    error.status = 404;
    throw error;
  }
  return sponsor;
};

/**
 * Validate that CSR user owns the program
 * @param {String} programId - Program ID
 * @param {Object} user - Authenticated user
 * @returns {Object} { sponsor, program }
 */
const validateCSROwnership = async (programId, user) => {
  const sponsor = await getCSRSponsor(user);

  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  if (program.csrPartnerId.toString() !== sponsor._id.toString()) {
    const error = new Error("You do not have access to this program");
    error.status = 403;
    throw error;
  }

  return { sponsor, program };
};

/**
 * Get all programs for the authenticated CSR user
 */
export const getMyPrograms = async (req, res) => {
  try {
    const sponsor = await getCSRSponsor(req.user);

    const programs = await Program.find({ csrPartnerId: sponsor._id })
      .select("programId name description duration status metrics scope createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Add checkpoint info to each program
    const programsWithCheckpoints = await Promise.all(
      programs.map(async (program) => {
        const checkpointStatus = await checkpointService.getCheckpointStatus(program._id);
        return {
          ...program,
          currentCheckpoint: checkpointStatus.currentCheckpoint,
          nextCheckpoint: checkpointStatus.nextCheckpoint,
          completedCheckpoints: checkpointStatus.completedCheckpoints,
        };
      })
    );

    res.json({ data: programsWithCheckpoints });
  } catch (error) {
    console.error("Get my programs error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get programs",
    });
  }
};

/**
 * Get program overview (main dashboard data)
 */
export const getProgramOverview = async (req, res) => {
  try {
    const { programId } = req.params;
    const { program } = await validateCSROwnership(programId, req.user);

    // Get CSR partner details
    const csrPartner = await CSRSponsor.findById(program.csrPartnerId)
      .select("companyName contactName email")
      .lean();

    // Get checkpoint status
    const checkpointStatus = await checkpointService.getCheckpointStatus(program._id);

    // Get metrics
    const metrics = await ProgramMetrics.findOne({ programId: program._id }).lean();

    // Get school summary
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

    // Get unique regions (districts)
    const regions = await ProgramSchool.aggregate([
      { $match: { programId: program._id } },
      {
        $lookup: {
          from: "organizations",
          localField: "schoolId",
          foreignField: "_id",
          as: "school",
        },
      },
      { $unwind: "$school" },
      {
        $group: {
          _id: "$school.settings.address.city",
        },
      },
    ]);

    const stats = schoolStats[0] || { totalSchools: 0, totalStudents: 0 };

    res.json({
      data: {
        program: {
          programId: program.programId,
          name: program.name,
          description: program.description,
          duration: program.duration,
          geography: program.scope?.geography,
          status: program.status,
        },
        csrPartner: {
          companyName: csrPartner?.companyName,
          contactName: csrPartner?.contactName,
        },
        checkpoint: {
          current: checkpointStatus.currentCheckpoint,
          next: checkpointStatus.nextCheckpoint,
          canAcknowledge: checkpointStatus.currentCheckpoint?.status === "ready",
          completed: checkpointStatus.completedCheckpoints,
          total: checkpointStatus.totalCheckpoints,
        },
        metrics: {
          studentsOnboarded: metrics?.studentReach?.totalOnboarded || stats.totalStudents,
          schoolsImplemented: stats.totalSchools,
          regionsCovered: regions.length,
          regions: regions.map((r) => r._id).filter(Boolean),
        },
      },
    });
  } catch (error) {
    console.error("Get program overview error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get program overview",
    });
  }
};

/**
 * Get student reach metrics
 */
export const getStudentReach = async (req, res) => {
  try {
    const { programId } = req.params;
    await validateCSROwnership(programId, req.user);

    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });

    const metrics = await ProgramMetrics.findOne({ programId: program._id }).lean();

    res.json({
      data: {
        totalOnboarded: metrics?.studentReach?.totalOnboarded || 0,
        activeStudents: metrics?.studentReach?.activeStudents || 0,
        activePercentage: metrics?.studentReach?.activePercentage || 0,
        completionRate: metrics?.studentReach?.completionRate || 0,
        dropoffRate: metrics?.studentReach?.dropoffRate || 0,
        timeline: metrics?.studentReach?.onboardingTimeline || [],
      },
    });
  } catch (error) {
    console.error("Get student reach error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get student reach metrics",
    });
  }
};

/**
 * Get engagement metrics
 */
export const getEngagement = async (req, res) => {
  try {
    const { programId } = req.params;
    await validateCSROwnership(programId, req.user);

    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });

    const metrics = await ProgramMetrics.findOne({ programId: program._id }).lean();

    res.json({
      data: {
        averageSessionsPerStudent: metrics?.engagement?.averageSessionsPerStudent || 0,
        participationRate: metrics?.engagement?.participationRate || 0,
        engagementTrend: metrics?.engagement?.engagementTrend || "stable",
        autoInsight: metrics?.engagement?.autoInsight || 
          "Student engagement data is being collected and will be available soon.",
        weeklyTrend: metrics?.engagement?.weeklyTrend || [],
      },
    });
  } catch (error) {
    console.error("Get engagement error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get engagement metrics",
    });
  }
};

/**
 * Get readiness exposure (10 pillars)
 */
export const getReadinessExposure = async (req, res) => {
  try {
    const { programId } = req.params;
    await validateCSROwnership(programId, req.user);

    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });

    const metrics = await ProgramMetrics.findOne({ programId: program._id }).lean();

    const pillars = [
      { id: "financialAwareness", name: "Financial Awareness Exposure" },
      { id: "decisionAwareness", name: "Decision Awareness Exposure" },
      { id: "pressureHandling", name: "Pressure Handling Exposure" },
      { id: "emotionalRegulation", name: "Emotional Regulation Exposure" },
      { id: "goalSetting", name: "Goal Setting Exposure" },
      { id: "timeManagement", name: "Time Management Exposure" },
      { id: "socialAwareness", name: "Social Awareness Exposure" },
      { id: "criticalThinking", name: "Critical Thinking Exposure" },
      { id: "selfAwareness", name: "Self Awareness Exposure" },
      { id: "adaptability", name: "Adaptability Exposure" },
    ];

    const pillarsData = pillars.map((pillar) => ({
      id: pillar.id,
      name: pillar.name,
      level: metrics?.readinessExposure?.[pillar.id]?.level || "low",
      trend: metrics?.readinessExposure?.[pillar.id]?.trend || "stable",
    }));

    res.json({
      data: {
        pillars: pillarsData,
        disclaimer:
          "Indicators reflect exposure trends only. They do not represent assessment, diagnosis, or scoring.",
      },
    });
  } catch (error) {
    console.error("Get readiness exposure error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get readiness exposure metrics",
    });
  }
};

/**
 * Get school coverage (table data)
 */
export const getSchoolCoverage = async (req, res) => {
  try {
    const { programId } = req.params;
    const { district, page = 1, limit = 50 } = req.query;
    
    await validateCSROwnership(programId, req.user);

    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });

    const query = { programId: program._id };
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [programSchools, total] = await Promise.all([
      ProgramSchool.find(query)
        .populate({
          path: "schoolId",
          select: "name settings.address",
        })
        .sort({ "schoolId.name": 1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      ProgramSchool.countDocuments(query),
    ]);

    // Filter by district if provided
    let schools = programSchools.map((ps) => ({
      schoolName: ps.schoolId?.name || "Unknown School",
      district: ps.schoolId?.settings?.address?.city || "",
      state: ps.schoolId?.settings?.address?.state || "",
      studentsCovered: ps.studentsCovered,
      status: ps.implementationStatus,
    }));

    if (district) {
      schools = schools.filter(
        (s) =>
          s.district.toLowerCase().includes(district.toLowerCase()) ||
          s.state.toLowerCase().includes(district.toLowerCase())
      );
    }

    // Get totals
    const totals = await ProgramSchool.aggregate([
      { $match: { programId: program._id } },
      {
        $group: {
          _id: null,
          totalSchools: { $sum: 1 },
          totalStudents: { $sum: "$studentsCovered" },
        },
      },
    ]);

    res.json({
      data: {
        totalSchools: totals[0]?.totalSchools || 0,
        totalStudents: totals[0]?.totalStudents || 0,
        schools,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: district ? schools.length : total,
          pages: Math.ceil((district ? schools.length : total) / parseInt(limit, 10)),
        },
      },
    });
  } catch (error) {
    console.error("Get school coverage error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get school coverage",
    });
  }
};

/**
 * Get recognition metrics
 */
export const getRecognition = async (req, res) => {
  try {
    const { programId } = req.params;
    await validateCSROwnership(programId, req.user);

    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });

    const metrics = await ProgramMetrics.findOne({ programId: program._id }).lean();

    res.json({
      data: {
        certificatesIssued: metrics?.recognition?.certificatesIssued || 0,
        recognitionKitsDispatched: metrics?.recognition?.recognitionKitsDispatched || 0,
        completionBasedRecognition: metrics?.recognition?.completionBasedRecognition || 0,
        helperText: "Recognition is provided based on participation and completion.",
      },
    });
  } catch (error) {
    console.error("Get recognition error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get recognition metrics",
    });
  }
};

/**
 * Get checkpoints for a program
 */
export const getCheckpoints = async (req, res) => {
  try {
    const { programId } = req.params;
    await validateCSROwnership(programId, req.user);

    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });

    const checkpoints = await checkpointService.getCheckpoints(program._id);

    res.json({ data: checkpoints });
  } catch (error) {
    console.error("Get checkpoints error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get checkpoints",
    });
  }
};

/**
 * Acknowledge a checkpoint (CSR action)
 */
export const acknowledgeCheckpoint = async (req, res) => {
  try {
    const { programId, checkpointNumber } = req.params;
    await validateCSROwnership(programId, req.user);

    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });

    const result = await checkpointService.acknowledgeCheckpoint(
      program._id,
      parseInt(checkpointNumber, 10),
      req.user._id
    );

    res.json({
      message: "Checkpoint acknowledged successfully",
      data: result,
    });
  } catch (error) {
    console.error("Acknowledge checkpoint error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to acknowledge checkpoint",
    });
  }
};

/**
 * Get CSR profile info
 */
export const getProfile = async (req, res) => {
  try {
    const sponsor = await getCSRSponsor(req.user);

    // Get associated programs
    const programs = await Program.find({ csrPartnerId: sponsor._id })
      .select("programId name status")
      .lean();

    res.json({
      data: {
        companyName: sponsor.companyName,
        contactName: sponsor.contactName,
        email: sponsor.email,
        phone: sponsor.phone,
        status: sponsor.status,
        programs: programs.map((p) => ({
          programId: p.programId,
          name: p.name,
          status: p.status,
        })),
      },
    });
  } catch (error) {
    console.error("Get CSR profile error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get profile",
    });
  }
};

export default {
  getMyPrograms,
  getProgramOverview,
  getStudentReach,
  getEngagement,
  getReadinessExposure,
  getSchoolCoverage,
  getRecognition,
  getCheckpoints,
  acknowledgeCheckpoint,
  getProfile,
};
