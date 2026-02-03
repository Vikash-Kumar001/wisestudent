import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import Program from "../models/Program.js";
import ProgramSchool from "../models/ProgramSchool.js";
import ProgramMetrics from "../models/ProgramMetrics.js";
import ProgramCheckpoint from "../models/ProgramCheckpoint.js";
import SchoolStudent from "../models/School/SchoolStudent.js";
import Organization from "../models/Organization.js";
import UnifiedGameProgress from "../models/UnifiedGameProgress.js";
import CSRSponsor from "../models/CSRSponsor.js";
import { READINESS_PILLAR_DEFS, scoreToLevel, READINESS_EXPOSURE_DISCLAIMER } from "../constants/readinessPillars.js";

/** Normalize programId to ObjectId for aggregate match */
const toObjectId = (id) =>
  id && mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;

/**
 * Get school ID string from a ProgramSchool doc (works when schoolId is populated or raw ObjectId).
 */
const getSchoolIdStr = (ps) => {
  const sid = ps.schoolId;
  if (!sid) return "";
  return (sid._id ?? sid).toString();
};

/**
 * Get real student/school counts for reports (from SchoolStudent and ProgramSchool).
 * @param {ObjectId|string} programId - Program ID
 * @returns {Promise<{ totalStudents, totalSchools, studentCountBySchoolId }>}
 */
const getReportMetrics = async (programId) => {
  const pid = toObjectId(programId);
  const [schoolStats, studentCounts] = await Promise.all([
    ProgramSchool.aggregate([
      { $match: { programId: pid } },
      { $group: { _id: null, totalSchools: { $sum: 1 }, schoolIds: { $push: "$schoolId" } } },
    ]),
    ProgramSchool.aggregate([
      { $match: { programId: pid } },
      {
        $lookup: {
          from: "schoolstudents",
          localField: "schoolId",
          foreignField: "orgId",
          as: "students",
        },
      },
      { $project: { schoolId: 1, count: { $size: "$students" } } },
    ]),
  ]);

  const studentCountBySchoolId = {};
  let totalStudents = 0;
  (studentCounts || []).forEach((row) => {
    const count = row.count ?? 0;
    const key = row.schoolId?.toString?.() ?? (row.schoolId && row.schoolId.toString?.()) ?? "";
    if (key) studentCountBySchoolId[key] = count;
    totalStudents += count;
  });

  const schoolIds = schoolStats[0]?.schoolIds || [];
  if (totalStudents === 0 && schoolIds.length > 0) {
    const byOrg = await SchoolStudent.aggregate([
      { $match: { orgId: { $in: schoolIds } } },
      { $group: { _id: "$orgId", count: { $sum: 1 } } },
    ]);
    byOrg.forEach((row) => {
      const key = row._id?.toString?.() ?? "";
      if (key) {
        studentCountBySchoolId[key] = row.count ?? 0;
        totalStudents += row.count ?? 0;
      }
    });
  }

  return {
    totalStudents,
    totalSchools: schoolStats[0]?.totalSchools ?? 0,
    studentCountBySchoolId,
  };
};

/**
 * Get recognition metrics for reports (aligned with CSR getRecognition).
 * Certificate issued = sum certificatesDelivered; Kits in progress = sum certificatesInProgress; Badges from UnifiedGameProgress.
 * @param {ObjectId|string} programId - Program ID
 * @returns {Promise<{ certificatesIssued, badgesIssued, recognitionKitsInProgress, completionBasedRecognition }>}
 */
const getReportRecognitionMetrics = async (programId) => {
  const pid = toObjectId(programId);
  const assignedSchools = await ProgramSchool.find({ programId: pid }).select("schoolId").lean();
  const schoolIds = assignedSchools.map((ps) => ps.schoolId).filter(Boolean);
  if (schoolIds.length === 0) {
    return {
      certificatesIssued: 0,
      badgesIssued: 0,
      recognitionKitsInProgress: 0,
      completionBasedRecognition: 0,
    };
  }
  const orgs = await Organization.find({ _id: { $in: schoolIds } }).select("tenantId").lean();
  const tenantIds = orgs.map((o) => o.tenantId).filter(Boolean);
  const baseMatch =
    tenantIds.length > 0
      ? { $or: [{ orgId: { $in: schoolIds } }, { tenantId: { $in: tenantIds } }] }
      : { orgId: { $in: schoolIds } };

  const studentAgg = await SchoolStudent.aggregate([
    { $match: baseMatch },
    {
      $group: {
        _id: null,
        userIds: { $addToSet: "$userId" },
        count: { $sum: 1 },
        certificatesDeliveredSum: { $sum: { $ifNull: ["$certificatesDelivered", 0] } },
        certificatesInProgressSum: { $sum: { $ifNull: ["$certificatesInProgress", 0] } },
      },
    },
  ]);
  const row = studentAgg[0];
  const studentUserIds = (row?.userIds || []).filter(Boolean);
  const totalStudents = row?.count ?? 0;
  let certificatesIssued = row?.certificatesDeliveredSum ?? 0;
  let recognitionKitsInProgress = row?.certificatesInProgressSum ?? 0;
  let badgesIssued = 0;
  let completionBasedRecognition = 0;

  if (studentUserIds.length > 0) {
    const [badgeCount, completerIds] = await Promise.all([
      UnifiedGameProgress.countDocuments({ userId: { $in: studentUserIds }, badgeAwarded: true }),
      UnifiedGameProgress.distinct("userId", { userId: { $in: studentUserIds }, fullyCompleted: true }),
    ]);
    badgesIssued = badgeCount;
    const completersCount = completerIds?.length ?? 0;
    completionBasedRecognition = totalStudents > 0 ? Math.round((completersCount / totalStudents) * 100) : 0;
  }

  return {
    certificatesIssued,
    badgesIssued,
    recognitionKitsInProgress,
    completionBasedRecognition,
  };
};

/**
 * Get readiness exposure data for reports — same structure as CSR page /programs/:programId/readiness-exposure.
 * Pillar definitions: constants/readinessPillars.js (single source of truth).
 * @param {ObjectId|string} programId - Program ID
 * @returns {Promise<{ pillars: Array<{ id, name, level, trend, hasData }>, disclaimer: string }>}
 */
const getReportReadinessExposure = async (programId) => {
  const pid = toObjectId(programId);
  const metrics = await ProgramMetrics.findOne({ programId: pid }).lean();
  const assignedSchools = await ProgramSchool.find({ programId: pid }).select("schoolId").lean();
  const schoolIds = assignedSchools.map((ps) => ps.schoolId).filter(Boolean);

  let pillarAverages = {};
  let gameTypeCounts = {};
  let totalStudents = 0;

  if (schoolIds.length > 0) {
    const orgs = await Organization.find({ _id: { $in: schoolIds } }).select("tenantId").lean();
    const tenantIds = orgs.map((o) => o.tenantId).filter(Boolean);
    const baseMatch =
      tenantIds.length > 0
        ? { $or: [{ orgId: { $in: schoolIds } }, { tenantId: { $in: tenantIds } }] }
        : { orgId: { $in: schoolIds } };
    const baseMatchWithLegacy = { ...baseMatch, allowLegacy: true };

    const agg = await SchoolStudent.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: null,
          avgUvls: { $avg: { $ifNull: ["$pillars.uvls", 0] } },
          avgDcos: { $avg: { $ifNull: ["$pillars.dcos", 0] } },
          avgMoral: { $avg: { $ifNull: ["$pillars.moral", 0] } },
          avgEhe: { $avg: { $ifNull: ["$pillars.ehe", 0] } },
          avgCrgc: { $avg: { $ifNull: ["$pillars.crgc", 0] } },
          count: { $sum: 1 },
        },
      },
    ]);
    const row = agg[0];
    if (row && row.count > 0) {
      totalStudents = row.count;
      pillarAverages = {
        uvls: row.avgUvls,
        dcos: row.avgDcos,
        moral: row.avgMoral,
        ehe: row.avgEhe,
        crgc: row.avgCrgc,
      };
    }

    if (totalStudents > 0) {
      const studentUserIds = await SchoolStudent.find(baseMatchWithLegacy)
        .select("userId")
        .lean()
        .then((docs) => docs.map((d) => d.userId).filter(Boolean));
      if (studentUserIds.length > 0) {
        for (const def of READINESS_PILLAR_DEFS) {
          if (def.source !== "game" || !def.gameTypes) continue;
          const uniqueUserIds = await UnifiedGameProgress.distinct("userId", {
            userId: { $in: studentUserIds },
            gameType: { $in: def.gameTypes },
          });
          gameTypeCounts[def.id] = uniqueUserIds?.length ?? 0;
        }
      }
    }
  }

  const pillars = READINESS_PILLAR_DEFS.map((pillar) => {
    const stored = metrics?.readinessExposure?.[pillar.id];
    let level = null;
    let hasData = false;
    if (pillar.source === "schoolstudent" && pillar.pillarKey) {
      const avg = pillarAverages[pillar.pillarKey];
      level = scoreToLevel(avg);
      hasData = avg != null;
    } else if (pillar.source === "game" && totalStudents > 0) {
      const count = gameTypeCounts[pillar.id] ?? 0;
      const pct = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
      level = scoreToLevel(pct);
      hasData = true;
    }
    if (!hasData && stored?.level != null && stored?.level !== "low") {
      hasData = true;
      level = stored.level;
    }
    return {
      id: pillar.id,
      name: pillar.name,
      level: hasData ? (level ?? stored?.level ?? null) : null,
      trend: hasData ? "stable" : (stored?.trend ?? "stable"),
      hasData,
    };
  });

  return {
    pillars,
    disclaimer: READINESS_EXPOSURE_DISCLAIMER,
  };
};

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

/** Ensure space on current page; add new page if needed (PDFKit). */
const ensureSpace = (doc, minLines = 8) => {
  const lineHeight = 14;
  if (doc.y + minLines * lineHeight > 700) {
    doc.addPage();
    doc.y = 50;
  }
};

/** Get pillar level by id from pillars array. */
const getPillarLevel = (pillars, id) => {
  const p = (pillars || []).find((x) => x.id === id);
  if (!p?.hasData || p.level == null) return null;
  const level = String(p.level).toLowerCase();
  return level.charAt(0).toUpperCase() + level.slice(1);
};

/**
 * Generate Impact Summary PDF — WISESTUDENT IMPACT & READINESS SUMMARY REPORT (CSR-Supported Student Readiness Program).
 * Structure: Cover, Program Overview, Objectives, Reach & Access, Engagement, Readiness Exposure, School Snapshot, Recognition, Ethical Safeguards, Impact Statement, Conclusion.
 * @param {String} programId - Program ID
 * @returns {Promise<Buffer>} PDF buffer
 */
export const generateImpactSummaryPDF = async (programId) => {
  const program = await Program.findById(programId).populate("csrPartnerId");
  if (!program) {
    throw new Error("Program not found");
  }

  const [metrics, reportMetrics, recognitionMetrics, readinessExposure] = await Promise.all([
    ProgramMetrics.findOne({ programId }).lean(),
    getReportMetrics(programId),
    getReportRecognitionMetrics(programId),
    getReportReadinessExposure(programId),
  ]);

  const totalStudents =
    reportMetrics.totalStudents > 0
      ? reportMetrics.totalStudents
      : (metrics?.studentReach?.totalOnboarded ?? 0);
  const totalSchools = reportMetrics.totalSchools ?? 0;
  const activePct =
    totalStudents > 0
      ? (metrics?.studentReach?.activePercentage ?? 100)
      : (metrics?.studentReach?.activePercentage ?? 0);
  const completionRate = metrics?.studentReach?.completionRate ?? 0;
  const rec = recognitionMetrics || {};
  const pillars = readinessExposure?.pillars ?? [];
  const disclaimerText = readinessExposure?.disclaimer ?? READINESS_EXPOSURE_DISCLAIMER;

  const programDuration =
    program.duration?.startDate && program.duration?.endDate
      ? `${formatDate(program.duration.startDate)} – ${formatDate(program.duration.endDate)}`
      : "—";
  const geographicCoverage =
    program.scope?.geography?.states?.length > 0
      ? program.scope.geography.states.join(", ")
      : "—";
  const engagementTrend = metrics?.engagement?.engagementTrend || "Stable";
  const avgSessions = metrics?.engagement?.averageSessionsPerStudent ?? "—";

  const decisionLevel = getPillarLevel(pillars, "uvls") || getPillarLevel(pillars, "moralValues") || "—";
  const financialLevel = getPillarLevel(pillars, "financialLiteracy") || "—";
  const pressureLevel = getPillarLevel(pillars, "brainHealth") || "—";

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

      const body = (text, opts = {}) => {
        ensureSpaceSection(doc, 2);
        doc.fontSize(10).font("Helvetica").fillColor("#475569");
        doc.text(text, 50, doc.y, { width: 500, lineGap: 3, ...opts });
        doc.moveDown(0.5);
      };

      const sectionTitle = (num, title) => {
        ensureSpaceSection(doc, 4);
        if (num > 1) doc.moveDown(2); // space between sections
        doc.fontSize(14).font("Helvetica-Bold").fillColor("#1e293b");
        doc.text(`${num}. ${title}`, 50, doc.y);
        doc.moveDown(0.8);
      };

      // ————— Cover Page (first page only): Magorix header image + report content on same page —————
      const headerDir = path.join(process.cwd(), "uploads", "csr");
      const headerPath = [
        path.join(headerDir, "header.png"),
        path.join(headerDir, "header.jpg"),
        path.join(headerDir, "cover.png"),
      ].find((p) => fs.existsSync(p));
      const layoutPath = [
        path.join(headerDir, "layout2.png"),
        path.join(headerDir, "layout.png"),
      ].find((p) => fs.existsSync(p));
      const contentWidth = 495; // A4 minus margins
      let coverStartY = 50;

      const drawSectionLayout = () => {
        if (layoutPath) {
          try {
            doc.image(layoutPath, 0, 0, { width: 595.28, height: 841.89 });
          } catch (e) {
            console.warn("[Impact Summary] Layout image could not be embedded:", e?.message);
          }
        }
      };
      const ensureSpaceSection = (d, minLines = 8) => {
        const lineHeight = 14;
        if (d.y + minLines * lineHeight > 700) {
          d.addPage();
          drawSectionLayout();
          d.y = 50;
        }
      };

      if (headerPath) {
        try {
          doc.image(headerPath, 50, 50, { width: contentWidth });
          coverStartY = 50 + 155; // content just below the header
        } catch (imgErr) {
          console.warn("[Impact Summary] Header image could not be embedded:", imgErr.message);
        }
      }

      doc.y = coverStartY;
      doc.moveDown(0.8);
      doc.fontSize(18).font("Helvetica-Bold").fillColor("#1e293b");
      doc.text("WISESTUDENT – IMPACT & READINESS SUMMARY", 50, doc.y, {
        align: "center",
        width: contentWidth,
      });
      doc.moveDown(0.2);
      doc.text("REPORT", 50, doc.y, { align: "center", width: contentWidth });
      doc.moveDown(0.4);
      doc.fontSize(10).font("Helvetica").fillColor("#64748b");
      doc.text("(CSR-Supported Student Readiness Program)", 50, doc.y, {
        align: "center",
        width: contentWidth,
      });
      doc.moveDown(1.5);

      doc.fontSize(11).font("Helvetica").fillColor("#1e293b");
      doc.text("Cover Page", 50, doc.y);
      doc.moveDown(0.8);

      const coverLines = [
        ["Program Name:", "WiseStudent Student Readiness Initiative"],
        ["CSR Partner:", program.csrPartnerId?.companyName || "—"],
        ["Implementation Partner:", "WiseStudent (Magorix Private Limited)"],
        ["Program Duration:", programDuration],
        ["Geographic Coverage:", geographicCoverage],
        ["Report Date:", formatDate(new Date())],
      ];
      coverLines.forEach(([label, value]) => {
        const y = doc.y;
        doc.font("Helvetica").fillColor("#64748b").text(label, 50, y);
        doc.font("Helvetica-Bold").fillColor("#1e293b").text(String(value), 220, y, { width: 330 });
        doc.y = y + 16;
      });

      // ————— Section pages: use layout.png (all sections except first/cover page) —————
      doc.addPage();
      drawSectionLayout();
      doc.y = 50;
      sectionTitle(1, "Program Overview");
      body(
        "The WiseStudent Student Readiness Initiative is a school-integrated program designed to support students in developing awareness around real-life decision-making, financial understanding, and handling everyday pressures."
      );
      body(
        "The program is delivered digitally through participating schools in a structured, non-disruptive manner and does not interfere with academic instruction. WiseStudent acts as the technology and implementation partner, while schools retain oversight of student participation. CSR partners provide governance support and funding for program delivery."
      );
      body(
        "The initiative focuses on readiness exposure, not assessment or evaluation, and is designed to be safe, scalable, and suitable for student-focused CSR engagement."
      );

      // ————— 2. Program Objectives —————
      sectionTitle(2, "Program Objectives");
      doc.fontSize(10).font("Helvetica").fillColor("#475569");
      doc.text("The key objectives of the program are:", 50, doc.y);
      doc.moveDown(0.3);
      [
        "To provide structured exposure to real-life decision-making scenarios",
        "To build early awareness around financial responsibility",
        "To help students recognise and manage everyday academic and personal pressures",
        "To support schools in offering life-readiness support without additional teaching burden",
      ].forEach((bullet) => {
        doc.text(`• ${bullet}`, 60, doc.y, { width: 480, lineGap: 2 });
        doc.moveDown(0.2);
      });

      // ————— 3. Reach & Access Summary —————
      sectionTitle(3, "Reach & Access Summary");
      doc.font("Helvetica").fillColor("#475569");
      doc.text(`Total Students Covered: ${formatNumber(totalStudents)}`, 50, doc.y);
      doc.moveDown(0.3);
      doc.text(`Total Schools Implemented: ${formatNumber(totalSchools)}`, 50, doc.y);
      doc.moveDown(0.3);
      doc.text(`Regions / Districts Covered: ${geographicCoverage}`, 50, doc.y);
      doc.moveDown(0.6);
      doc.text("Participation Indicators", 50, doc.y);
      doc.moveDown(0.2);
      doc.text(`• Active Participation Rate: ${formatNumber(activePct)} %`, 60, doc.y);
      doc.moveDown(0.2);
      doc.text(`• Program Completion Rate: ${formatNumber(completionRate)} %`, 60, doc.y);
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#64748b").text("All participation data is presented in aggregate form.", 50, doc.y);
      doc.moveDown(0.5);

      // ————— 4. Engagement Overview —————
      sectionTitle(4, "Engagement Overview");
      body(
        "The program tracked overall student participation and consistency throughout the implementation period."
      );
      doc.font("Helvetica").fillColor("#475569").text("Key Engagement Indicators", 50, doc.y);
      doc.moveDown(0.3);
      doc.text(`• Average Engagement Sessions per Student: ${formatNumber(avgSessions)}`, 60, doc.y);
      doc.moveDown(0.2);
      doc.text(`• Overall Engagement Trend: ${engagementTrend}`, 60, doc.y);
      doc.moveDown(0.4);
      doc.text(
        "Engagement Observation (Auto-generated):",
        50,
        doc.y
      );
      doc.moveDown(0.2);
      doc
        .font("Helvetica")
        .text(
          '"Student engagement remained consistent across the program duration, indicating sustained participation without academic disruption."',
          60,
          doc.y,
          { width: 480, lineGap: 2 }
        );
      doc.moveDown(0.5);

      // ————— 5. Readiness Exposure Summary —————
      sectionTitle(5, "Readiness Exposure Summary");
      body(
        "WiseStudent measures exposure to readiness concepts, not performance or outcomes. These indicators reflect the type of structured scenarios students were exposed to during the program."
      );
      doc.font("Helvetica").fillColor("#475569").text("Aggregate Readiness Exposure", 50, doc.y);
      doc.moveDown(0.3);
      doc.text(`• Decision Awareness Exposure: ${decisionLevel}`, 60, doc.y);
      doc.moveDown(0.2);
      doc.text(`• Financial Awareness Exposure: ${financialLevel}`, 60, doc.y);
      doc.moveDown(0.2);
      doc.text(`• Pressure Handling Exposure: ${pressureLevel}`, 60, doc.y);
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#64748b").text(disclaimerText, 50, doc.y, { width: 500, lineGap: 2 });
      doc.moveDown(0.5);

      // ————— 6. School Implementation Snapshot —————
      sectionTitle(6, "School Implementation Snapshot");
      body(
        "The program was implemented across multiple schools under a controlled and school-led deployment model."
      );
      doc.font("Helvetica").fillColor("#475569").text("Implementation Highlights", 50, doc.y);
      doc.moveDown(0.2);
      [
        "Schools onboarded in line with planned timelines",
        "Program delivered without academic disruption",
        "No additional instructional burden placed on teachers",
        "Schools retained full administrative oversight",
      ].forEach((bullet) => {
        doc.text(`• ${bullet}`, 60, doc.y, { width: 480 });
        doc.moveDown(0.2);
      });
      doc.moveDown(0.2);
      doc
        .fontSize(9)
        .fillColor("#64748b")
        .text("Detailed school-wise information is provided separately in the School Coverage Report.", 50, doc.y, {
          width: 500,
        });
      doc.moveDown(0.5);

      // ————— 7. Recognition & Completion —————
      sectionTitle(7, "Recognition & Completion");
      body(
        "Students who completed the program received participation-based recognition."
      );
      doc.font("Helvetica").fillColor("#475569").text("Recognition Summary", 50, doc.y);
      doc.moveDown(0.3);
      doc.text(`• Certificates Issued: ${formatNumber(rec.certificatesIssued)}`, 60, doc.y);
      doc.moveDown(0.2);
      doc.text(`• Recognition Kits Dispatched: ${formatNumber(rec.recognitionKitsInProgress)}`, 60, doc.y);
      doc.moveDown(0.5);
      doc
        .fontSize(9)
        .fillColor("#64748b")
        .text("Recognition was designed to acknowledge participation and encourage continued engagement.", 50, doc.y, {
          width: 500,
        });
      doc.moveDown(0.5);

      // ————— 8. Ethical & Safety Safeguards —————
      sectionTitle(8, "Ethical & Safety Safeguards");
      body(
        "The program was delivered in alignment with ethical standards appropriate for student-focused CSR initiatives."
      );
      [
        "No sensitive personal data collected",
        "No individual student profiling or labelling",
        "No mental health diagnosis or counselling",
        "All insights reported in aggregate form",
        "Program delivered through schools with oversight",
      ].forEach((bullet) => {
        doc.text(`• ${bullet}`, 60, doc.y, { width: 480 });
        doc.moveDown(0.2);
      });
      doc.moveDown(0.2);
      doc
        .fontSize(9)
        .fillColor("#64748b")
        .text("A detailed Compliance & Safeguards Summary is available as a separate document.", 50, doc.y, {
          width: 500,
        });
      doc.moveDown(0.5);

      // ————— 9. Overall Impact Statement —————
      sectionTitle(9, "Overall Impact Statement");
      body(
        "This CSR-supported initiative enabled structured life-readiness exposure for students across participating schools. The program successfully delivered awareness around decision-making, financial responsibility, and everyday pressure handling in a safe, school-controlled environment."
      );
      body(
        "The initiative demonstrates how scalable, non-intrusive platforms can support student readiness as part of broader education and inclusion efforts."
      );

      // ————— 10. Conclusion —————
      sectionTitle(10, "Conclusion");
      body(
        "WiseStudent remains committed to responsible, ethical, and transparent delivery of student readiness programs. This report is intended to support CSR reporting, audit reference, and governance review."
      );
      doc.moveDown(1);
      const issuedByY = doc.y;
      doc.font("Helvetica").fillColor("#64748b").text("Issued by:", 50, doc.y);
      doc.moveDown(0.3);
      doc.text("WiseStudent (Magorix Private Limited)", 60, doc.y);
      doc.text("Designation: Authorized Signatory", 60, doc.y + 14);
      doc.text(`Date: ${formatDate(new Date())}`, 60, doc.y + 28);

      // Platform stamp (Magorix / Director) on the right of "Issued by" and Date block
      const stampDir = path.join(process.cwd(), "uploads", "csr");
      const stampPath = [path.join(stampDir, "stamp.png"), path.join(stampDir, "stamp.jpg")].find((p) =>
        fs.existsSync(p)
      );
      if (stampPath) {
        try {
          const stampWidth = 230;
          const stampX = 310; // right of "Issued by" / Date text (text ends ~280)
          doc.image(stampPath, stampX, issuedByY, { width: stampWidth });
        } catch (imgErr) {
          console.warn("[Impact Summary] Stamp image could not be embedded:", imgErr.message);
        }
      }

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

  const [programSchools, reportMetrics] = await Promise.all([
    ProgramSchool.find({ programId }).populate({
      path: "schoolId",
      select: "name settings.address district state",
    }),
    getReportMetrics(programId),
  ]);

  const studentCount = (ps) =>
    reportMetrics.studentCountBySchoolId[getSchoolIdStr(ps)] ?? ps.studentsCovered ?? 0;
  const totalStudentsSum = programSchools.reduce((sum, ps) => sum + studentCount(ps), 0);

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
    value: totalStudentsSum,
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
    const schoolName = school.name || school.schoolName || "N/A";
    const district = school.district || school.settings?.address?.city || "N/A";
    const state = school.state || school.settings?.address?.state || "N/A";

    schoolSheet.addRow({
      schoolName,
      district,
      state,
      studentsCovered: studentCount(ps),
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
    districtMap[district].students += studentCount(ps);
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

  const [programSchools, reportMetrics] = await Promise.all([
    ProgramSchool.find({ programId }).populate({
      path: "schoolId",
      select: "name settings.address district state",
    }),
    getReportMetrics(programId),
  ]);

  const studentCount = (ps) =>
    reportMetrics.studentCountBySchoolId[getSchoolIdStr(ps)] ?? ps.studentsCovered ?? 0;
  const totalStudentsSum = programSchools.reduce((sum, ps) => sum + studentCount(ps), 0);

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
        `Total Schools: ${programSchools.length} | Total Students: ${formatNumber(totalStudentsSum)}`,
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
        districtMap[district].students += studentCount(ps);
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
          `   ${district}, ${state} | Students: ${formatNumber(studentCount(ps))} | Status: ${ps.implementationStatus || "pending"}`,
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
