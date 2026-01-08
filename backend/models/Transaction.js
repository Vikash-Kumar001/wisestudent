import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["earn", "spend", "redeem", "donate", "credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["completed", "pending", "rejected"],
      default: "completed",
    },
    upiId: {
      type: String, // only used in redeem requests
    },
    coinType: {
      type: String,
      enum: ['healcoins', 'calmcoins'],
      default: 'healcoins' // Default to HealCoins for backward compatibility
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
