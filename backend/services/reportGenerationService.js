import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import Program from "../models/Program.js";
import ProgramSchool from "../models/ProgramSchool.js";
import ProgramMetrics from "../models/ProgramMetrics.js";
import ProgramCheckpoint from "../models/ProgramCheckpoint.js";
import CSRSponsor from "../models/CSRSponsor.js";

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {String} Formatted date string
 */
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format number with commas
 * @param {Number} num - Number to format
 * @returns {String} Formatted number string
 */
const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

/**
 * Add PDF header
 * @param {PDFDocument} doc - PDF document
 * @param {String} title - Header title
 */
const createHeader = (doc, title) => {
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor("#1e293b")
    .text(title, 50, doc.y, { align: "left" });
  doc.moveDown(0.5);
};

/**
 * Add mandatory disclaimer to PDF
 * @param {PDFDocument} doc - PDF document
 */
const addDisclaimer = (doc) => {
  doc.addPage();
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#92400e")
    .text("Important Disclaimer", 50, doc.y, { align: "left" });
  doc.moveDown(0.3);
  doc
    .fontSize(9)
    .fillColor("#78350f")
    .text(
      "Indicators reflect exposure trends only. They do not represent assessment, diagnosis, or scoring. " +
        "These metrics show what topics students were exposed to, not their abilities or performance.",
      50,
      doc.y,
      {
        align: "left",
        width: 500,
        lineGap: 2,
      }
    );
};

/**
 * Generate Impact Summary PDF
 * @param {String} programId - Program ID
 * @returns {Promise<Buffer>} PDF buffer
 */
export const generateImpactSummaryPDF = async (programId) => {
  // Fetch program data
  const program = await Program.findById(programId).populate("csrPartnerId");
  if (!program) {
    throw new Error("Program not found");
  }

  const metrics = await ProgramMetrics.findOne({ programId });
  const checkpoints = await ProgramCheckpoint.find({ programId }).sort({
    checkpointNumber: 1,
  });

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // PAGE 1: Cover Page
      doc.fontSize(24).font("Helvetica-Bold").fillColor("#6366f1");
      doc.text("CSR Impact Summary Report", 50, 100, { align: "center" });

      doc.moveDown(2);
      doc.fontSize(18).fillColor("#1e293b");
      doc.text(program.name || "Program Report", 50, doc.y, { align: "center" });

      doc.moveDown(1);
      doc.fontSize(12).fillColor("#64748b");
      doc.text(
        `CSR Partner: ${program.csrPartnerId?.companyName || "N/A"}`,
        50,
        doc.y,
        { align: "center" }
      );

      doc.moveDown(0.5);
      doc.text(
        `Period: ${formatDate(program.duration?.startDate)} - ${formatDate(program.duration?.endDate)}`,
        50,
        doc.y,
        { align: "center" }
      );

      doc.moveDown(2);
      doc.fontSize(10).fillColor("#94a3b8");
      doc.text(
        `Generated on: ${formatDate(new Date())}`,
        50,
        doc.y,
        { align: "center" }
      );

      // PAGE 2: Program Overview
      doc.addPage();
      createHeader(doc, "Program Overview");

      doc.fontSize(11).font("Helvetica").fillColor("#1e293b");
      doc.text("Program Objective:", 50, doc.y);
      doc.font("Helvetica-Bold");
      doc.text(program.description || "No description provided", 50, doc.y + 5, {
        width: 500,
        lineGap: 3,
      });

      doc.moveDown(1);
      doc.font("Helvetica").text("Target Group:", 50, doc.y);
      doc.font("Helvetica-Bold");
      const targetGroup = [
        program.scope?.geography?.states?.length > 0
          ? `States: ${program.scope.geography.states.join(", ")}`
          : "",
        program.scope?.schoolCategory?.length > 0
          ? `School Categories: ${program.scope.schoolCategory.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " ")).join(", ")}`
          : "",
        program.scope?.targetStudentCount
          ? `Target Students: ${formatNumber(program.scope.targetStudentCount)}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");
      doc.text(targetGroup || "Not specified", 50, doc.y + 5, {
        width: 500,
        lineGap: 3,
      });

      doc.moveDown(1);
      doc.font("Helvetica").text("Delivery Model:", 50, doc.y);
      doc.font("Helvetica-Bold");
      doc.text("WiseStudent Platform - Digital Learning & Readiness", 50, doc.y + 5);

      // PAGE 3: Reach & Engagement
      doc.addPage();
      createHeader(doc, "Reach & Engagement Metrics");

      if (metrics?.studentReach) {
        const reachData = [
          ["Metric", "Value"],
          ["Total Students Onboarded", formatNumber(metrics.studentReach.totalOnboarded)],
          ["Active Students", formatNumber(metrics.studentReach.activeStudents)],
          ["Active Percentage", `${metrics.studentReach.activePercentage || 0}%`],
          ["Completion Rate", `${metrics.studentReach.completionRate || 0}%`],
        ];

        let startY = doc.y;
        doc.fontSize(10);
        reachData.forEach((row, index) => {
          const y = startY + index * 20;
          doc.font(index === 0 ? "Helvetica-Bold" : "Helvetica").fillColor(index === 0 ? "#1e293b" : "#475569");
          doc.text(row[0], 50, y);
          doc.text(row[1], 350, y, { align: "right" });
        });

        doc.moveDown(2);
      }

      if (metrics?.engagement) {
        createHeader(doc, "Engagement Metrics");
        const engagementData = [
          ["Average Sessions per Student", formatNumber(metrics.engagement.averageSessionsPerStudent)],
          ["Participation Rate", `${metrics.engagement.participationRate || 0}%`],
          ["Engagement Trend", metrics.engagement.engagementTrend || "Stable"],
        ];

        let startY = doc.y;
        doc.fontSize(10);
        engagementData.forEach((row) => {
          const y = startY;
          doc.font("Helvetica").fillColor("#475569");
          doc.text(row[0], 50, y);
          doc.text(row[1], 350, y, { align: "right" });
          startY += 20;
        });
      }

      // PAGE 4: Readiness Exposure
      doc.addPage();
      createHeader(doc, "Readiness Exposure - 10 Pillars");

      if (metrics?.readinessExposure) {
        const pillars = [
          { name: "Financial Awareness", key: "financialAwareness" },
          { name: "Decision Awareness", key: "decisionAwareness" },
          { name: "Pressure Handling", key: "pressureHandling" },
          { name: "Emotional Regulation", key: "emotionalRegulation" },
          { name: "Goal Setting", key: "goalSetting" },
          { name: "Time Management", key: "timeManagement" },
          { name: "Social Awareness", key: "socialAwareness" },
          { name: "Critical Thinking", key: "criticalThinking" },
          { name: "Self Awareness", key: "selfAwareness" },
          { name: "Adaptability", key: "adaptability" },
        ];

        let startY = doc.y;
        doc.fontSize(9);

        pillars.forEach((pillar, index) => {
          if (startY > 700) {
            doc.addPage();
            startY = 50;
          }

          const pillarData = metrics.readinessExposure[pillar.key];
          const level = pillarData?.level || "low";
          const trend = pillarData?.trend || "stable";

          doc.font("Helvetica-Bold").fillColor("#1e293b");
          doc.text(`${index + 1}. ${pillar.name}`, 50, startY);
          doc.font("Helvetica").fillColor("#64748b");
          doc.text(`   Exposure Level: ${level} | Trend: ${trend}`, 70, startY + 15);
          startY += 40;
        });
      }

      // Add mandatory disclaimer
      addDisclaimer(doc);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate School Coverage Excel
 * @param {String} programId - Program ID
 * @returns {Promise<Buffer>} Excel buffer
 */
export const generateSchoolCoverageExcel = async (programId) => {
  const program = await Program.findById(programId).populate("csrPartnerId");
  if (!program) {
    throw new Error("Program not found");
  }

  const programSchools = await ProgramSchool.find({ programId }).populate({
    path: "schoolId",
    select: "name settings.address district state",
  });

  const workbook = new ExcelJS.Workbook();

  // Sheet 1: Program Summary
  const summarySheet = workbook.addWorksheet("Program Summary");
  summarySheet.columns = [
    { header: "Field", key: "field", width: 25 },
    { header: "Value", key: "value", width: 40 },
  ];

  summarySheet.addRow({ field: "Program Name", value: program.name });
  summarySheet.addRow({ field: "CSR Partner", value: program.csrPartnerId?.companyName || "N/A" });
  summarySheet.addRow({
    field: "Start Date",
    value: formatDate(program.duration?.startDate),
  });
  summarySheet.addRow({
    field: "End Date",
    value: formatDate(program.duration?.endDate),
  });
  summarySheet.addRow({
    field: "States",
    value: program.scope?.geography?.states?.join(", ") || "All",
  });
  summarySheet.addRow({
    field: "Total Schools",
    value: programSchools.length,
  });
  summarySheet.addRow({
    field: "Total Students",
    value: programSchools.reduce((sum, ps) => sum + (ps.studentsCovered || 0), 0),
  });

  // Sheet 2: School Table
  const schoolSheet = workbook.addWorksheet("Schools");
  schoolSheet.columns = [
    { header: "School Name", key: "schoolName", width: 30 },
    { header: "District", key: "district", width: 25 },
    { header: "State", key: "state", width: 20 },
    { header: "Students Covered", key: "studentsCovered", width: 18 },
    { header: "Status", key: "status", width: 15 },
  ];

  programSchools.forEach((ps) => {
    const school = ps.schoolId || {};
    // Handle both populated and non-populated school data
    const schoolName = school.name || school.schoolName || "N/A";
    const district = school.district || school.settings?.address?.city || "N/A";
    const state = school.state || school.settings?.address?.state || "N/A";
    
    schoolSheet.addRow({
      schoolName,
      district,
      state,
      studentsCovered: ps.studentsCovered || 0,
      status: ps.implementationStatus || "pending",
    });
  });

  // Sheet 3: Summary by District
  const districtSheet = workbook.addWorksheet("Summary by District");
  districtSheet.columns = [
    { header: "District", key: "district", width: 30 },
    { header: "Schools", key: "schools", width: 15 },
    { header: "Students", key: "students", width: 15 },
  ];

  const districtMap = {};
  programSchools.forEach((ps) => {
    const school = ps.schoolId || {};
    const district = school.district || school.settings?.address?.city || "Unknown";
    if (!districtMap[district]) {
      districtMap[district] = { schools: 0, students: 0 };
    }
    districtMap[district].schools++;
    districtMap[district].students += ps.studentsCovered || 0;
  });

  Object.entries(districtMap).forEach(([district, data]) => {
    districtSheet.addRow({
      district,
      schools: data.schools,
      students: data.students,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};

/**
 * Generate School Coverage PDF
 * @param {String} programId - Program ID
 * @returns {Promise<Buffer>} PDF buffer
 */
export const generateSchoolCoveragePDF = async (programId) => {
  const program = await Program.findById(programId).populate("csrPartnerId");
  if (!program) {
    throw new Error("Program not found");
  }

  const programSchools = await ProgramSchool.find({ programId }).populate({
    path: "schoolId",
    select: "name settings.address district state",
  });

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // Cover Page
      doc.fontSize(24).font("Helvetica-Bold").fillColor("#6366f1");
      doc.text("School Coverage Report", 50, 100, { align: "center" });

      doc.moveDown(2);
      doc.fontSize(16).fillColor("#1e293b");
      doc.text(program.name || "Program Report", 50, doc.y, { align: "center" });

      doc.moveDown(1);
      doc.fontSize(12).fillColor("#64748b");
      doc.text(
        `Total Schools: ${programSchools.length} | Total Students: ${formatNumber(
          programSchools.reduce((sum, ps) => sum + (ps.studentsCovered || 0), 0)
        )}`,
        50,
        doc.y,
        { align: "center" }
      );

      // Summary by District
      doc.addPage();
      createHeader(doc, "Summary by District");

      const districtMap = {};
      programSchools.forEach((ps) => {
        const school = ps.schoolId || {};
        const district = school.district || school.settings?.address?.city || "Unknown";
        if (!districtMap[district]) {
          districtMap[district] = { schools: 0, students: 0 };
        }
        districtMap[district].schools++;
        districtMap[district].students += ps.studentsCovered || 0;
      });

      let startY = doc.y;
      doc.fontSize(10);
      Object.entries(districtMap).forEach(([district, data]) => {
        if (startY > 700) {
          doc.addPage();
          startY = 50;
        }
        doc.font("Helvetica-Bold").fillColor("#1e293b");
        doc.text(district, 50, startY);
        doc.font("Helvetica").fillColor("#64748b");
        doc.text(
          `Schools: ${data.schools} | Students: ${formatNumber(data.students)}`,
          70,
          startY + 15
        );
        startY += 35;
      });

      // School List
      doc.addPage();
      createHeader(doc, "School Details");

      let y = doc.y;
      doc.fontSize(9);
      programSchools.forEach((ps, index) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }

        const school = ps.schoolId || {};
        const schoolName = school.name || school.schoolName || "N/A";
        const district = school.district || school.settings?.address?.city || "N/A";
        const state = school.state || school.settings?.address?.state || "N/A";
        
        doc.font("Helvetica-Bold").fillColor("#1e293b");
        doc.text(`${index + 1}. ${schoolName}`, 50, y);
        doc.font("Helvetica").fillColor("#64748b");
        doc.text(
          `   ${district}, ${state} | Students: ${formatNumber(
            ps.studentsCovered || 0
          )} | Status: ${ps.implementationStatus || "pending"}`,
          70,
          y + 12
        );
        y += 30;
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate Compliance PDF
 * @param {String} programId - Program ID
 * @returns {Promise<Buffer>} PDF buffer
 */
export const generateCompliancePDF = async (programId) => {
  const program = await Program.findById(programId).populate("csrPartnerId");
  if (!program) {
    throw new Error("Program not found");
  }

  const checkpoints = await ProgramCheckpoint.find({ programId })
    .sort({ checkpointNumber: 1 })
    .populate("triggeredBy", "name email")
    .populate("acknowledgedBy", "name email");

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // Cover Page
      doc.fontSize(24).font("Helvetica-Bold").fillColor("#6366f1");
      doc.text("Compliance Summary Report", 50, 100, { align: "center" });

      doc.moveDown(2);
      doc.fontSize(16).fillColor("#1e293b");
      doc.text(program.name || "Program Report", 50, doc.y, { align: "center" });

      doc.moveDown(1);
      doc.fontSize(12).fillColor("#64748b");
      doc.text(
        `CSR Partner: ${program.csrPartnerId?.companyName || "N/A"}`,
        50,
        doc.y,
        { align: "center" }
      );

      // Checkpoint History
      doc.addPage();
      createHeader(doc, "Checkpoint History");

      const checkpointNames = {
        1: "Program Approval",
        2: "Onboarding Confirmation",
        3: "Mid-Program Review",
        4: "Completion Review",
        5: "Extension/Renewal",
      };

      let startY = doc.y;
      doc.fontSize(10);

      checkpoints.forEach((checkpoint) => {
        if (startY > 700) {
          doc.addPage();
          startY = 50;
        }

        doc.font("Helvetica-Bold").fillColor("#1e293b");
        doc.text(
          `Checkpoint ${checkpoint.checkpointNumber}: ${checkpointNames[checkpoint.checkpointNumber] || checkpoint.type}`,
          50,
          startY
        );

        doc.font("Helvetica").fillColor("#64748b");
        let detailY = startY + 15;

        if (checkpoint.triggeredAt) {
          doc.text(`Triggered: ${formatDate(checkpoint.triggeredAt)}`, 70, detailY);
          if (checkpoint.triggeredBy) {
            doc.text(`By: ${checkpoint.triggeredBy.name || checkpoint.triggeredBy.email}`, 70, detailY + 12);
            detailY += 24;
          } else {
            detailY += 15;
          }
        }

        if (checkpoint.acknowledgedAt) {
          doc.text(`Acknowledged: ${formatDate(checkpoint.acknowledgedAt)}`, 70, detailY);
          if (checkpoint.acknowledgedBy) {
            doc.text(`By: ${checkpoint.acknowledgedBy.name || checkpoint.acknowledgedBy.email}`, 70, detailY + 12);
            detailY += 24;
          } else {
            detailY += 15;
          }
        }

        if (checkpoint.completedAt) {
          doc.text(`Completed: ${formatDate(checkpoint.completedAt)}`, 70, detailY);
          detailY += 15;
        }

        doc.text(`Status: ${checkpoint.status}`, 70, detailY);
        startY = detailY + 25;
      });

      // Compliance Confirmation
      doc.addPage();
      createHeader(doc, "Compliance Confirmation");

      doc.fontSize(11).font("Helvetica").fillColor("#1e293b");
      doc.text(
        "This document confirms that all program checkpoints have been properly managed according to the governance framework.",
        50,
        doc.y,
        { width: 500, lineGap: 3 }
      );

      doc.moveDown(1);
      doc.text(`Program Status: ${program.status}`, 50, doc.y);
      doc.text(`Total Checkpoints: ${checkpoints.length}`, 50, doc.y + 15);
      doc.text(
        `Completed Checkpoints: ${checkpoints.filter((c) => c.status === "completed").length}`,
        50,
        doc.y + 30
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  generateImpactSummaryPDF,
  generateSchoolCoverageExcel,
  generateSchoolCoveragePDF,
  generateCompliancePDF,
};
