/**
 * Check CSR (or any user) approval status by email.
 * Usage: node scripts/check-csr-approval.js [email]
 * Example: node scripts/check-csr-approval.js vikashkumardesigners@gmail.com
 */
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const email = process.argv[2] || "vikashkumardesigners@gmail.com";
const normalizedEmail = email.toLowerCase().trim();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }

  const User = (await import("../models/User.js")).default;
  const user = await User.findOne({ email: normalizedEmail })
    .select("name email role approvalStatus createdAt")
    .lean();

  if (!user) {
    console.log("No user found with email:", normalizedEmail);
    await mongoose.disconnect();
    process.exit(0);
    return;
  }

  console.log("User:", user.name || user.email);
  console.log("Email:", user.email);
  console.log("Role:", user.role);
  console.log("Approval status:", user.approvalStatus ?? "(not set)");
  console.log("Created:", user.createdAt);

  if (user.role === "csr") {
    const isApproved = user.approvalStatus === "approved";
    console.log("\n→ This CSR account is", isApproved ? "APPROVED by super admin" : "NOT approved (status: " + (user.approvalStatus || "pending") + ")");
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
